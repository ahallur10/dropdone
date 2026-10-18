"use client";

import { useEffect, useRef, useState } from "react";
import { Donut } from "../mock/ui";
import { countyScenario, type DddScenario } from "./drag-drop-done-scenarios";

/*
 * Drag, Drop, Done: a looping animation of a messy export (a legacy PDF converted to Excel) being dragged into the
 * Dropdone app and coming out as a clean workbook. Drawn on a fixed 1100x688 stage and
 * scaled to fit, so every position below is in stage pixels. Times are in ms.
 */

const W = 1100;
const H = 688;
const LOOP = 12400;

// Timeline marks
const T = {
  reach: [400, 1100],
  drag: [1300, 2700],
  overlay: [1900, 2900],
  sink: [2700, 3100],
  leave: [3100, 3800],
  rowIn: 2950,
  clean: [3100, 6600],
  zoomIn: [3250, 3850],
  zoomOut: [6600, 7050],
  sheet: [7100, 7650],
  fadeOut: [11800, 12300],
} as const;

const PHASES = [
  { key: "drag", n: "01", title: "Drag", body: "Grab this week's export straight out of your system, mess and all.", start: 0 },
  { key: "drop", n: "02", title: "Drop", body: "Drop it on its saved cleanup. Dropdone runs the steps you approved, exactly as written.", start: T.drag[1] },
  { key: "done", n: "03", title: "Done", body: "It checks the result against your workbook, then updates it in place.", start: T.clean[1] },
] as const;

// Static frames used when motion is reduced (or a step is clicked with motion off).
const STILL = [1250, 4900, 7900];

const PDF = { x: 34, y: 150, w: 344, h: 300, grabX: 172, grabY: 118 };
const DROP_POINT = { x: 735, y: 410 };
const CURSOR_START = { x: 330, y: 640 };
const CURSOR_END = { x: 940, y: 660 };
// While the cleanup runs, the camera moves in on the progress row so the stage, the steps
// and the percentage are readable. FOCUS is the row's centre in stage pixels.
const FOCUS = { x: 746, y: 252 };
const ZOOM = 1.75;

export function DragDropDone({ scenario = countyScenario }: { scenario?: DddScenario }) {
  const [t, setT] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      if (mq.matches) setT(STILL[2]);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Fit the fixed stage to the container, and only animate while on screen.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    ro.observe(el);
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reduced || !visible) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      setT((prev) => (prev + dt) % LOOP);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, visible]);

  const phase = t < T.drag[1] ? 0 : t < T.clean[1] ? 1 : 2;

  return (
    <div className="flex flex-col gap-8">
      {/* Steps */}
      <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
        {PHASES.map((p, i) => {
          const active = phase === i;
          const end = i < 2 ? PHASES[i + 1].start : T.fadeOut[0];
          const fill = active ? clamp((t - p.start) / (end - p.start)) : phase > i ? 1 : 0;
          return (
            <li key={p.key}>
              <button
                onClick={() => setT(reduced ? STILL[i] : p.start)}
                className="group flex w-full cursor-pointer flex-col gap-3 text-left"
              >
                <span className="h-[3px] w-full overflow-hidden rounded-pill bg-line">
                  <span className="block h-full bg-brand" style={{ width: `${fill * 100}%` }} />
                </span>
                <span className="flex items-baseline gap-3">
                  <span className={`type-data text-sm ${active ? "text-brand" : "text-fg-subtle"}`}>{p.n}</span>
                  <span className={`type-h3 transition-colors ${active ? "text-fg" : "text-fg-muted group-hover:text-fg-soft"}`}>
                    {p.title}
                  </span>
                </span>
                <span className="type-body-sm max-w-[36ch]">{p.body}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Stage */}
      <div
        ref={frame}
        className="relative w-full overflow-hidden rounded-xl border border-line-subtle bg-section"
        style={{ height: H * scale }}
        role="img"
        aria-label={`Animation: ${scenario.sheet.file} is dragged onto the ${scenario.recipe} cleanup in Dropdone, cleaned, and saved into ${scenario.output.file}.`}
      >
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          <Scene t={t} scenario={scenario} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Scene({ t, scenario }: { t: number; scenario: DddScenario }) {
  const fadeAll = 1 - seg(t, ...T.fadeOut);

  // Cursor path: reach the PDF, drag it to the app, then drift away.
  const reach = ease(seg(t, ...T.reach));
  const drag = ease(seg(t, ...T.drag));
  const leave = ease(seg(t, ...T.leave));
  const grab = { x: PDF.x + PDF.grabX, y: PDF.y + PDF.grabY };
  let cursor = lerp2(CURSOR_START, grab, reach);
  if (t >= T.drag[0]) cursor = lerp2(grab, DROP_POINT, drag);
  if (t >= T.leave[0]) cursor = lerp2(DROP_POINT, CURSOR_END, leave);
  const cursorOpacity = Math.min(seg(t, 150, 450), 1 - seg(t, T.leave[0] + 300, T.leave[1])) * fadeAll;
  const grabbing = t >= T.reach[1] && t < T.sink[0];

  // PDF follows the cursor while dragged, then sinks into the app.
  const s = t < T.drag[0] ? (t >= T.reach[1] ? 1.03 : 1) : lerp(1.03, 0.4, drag) * (1 - 0.75 * ease(seg(t, ...T.sink)));
  const pdfPos =
    t < T.drag[0] ? { x: PDF.x, y: PDF.y } : { x: cursor.x - PDF.grabX * s, y: cursor.y - PDF.grabY * s };
  const pdfOpacity = Math.min(seg(t, 0, 350), 1 - seg(t, T.sink[0] + 150, T.sink[1]));

  const overlay = t >= T.overlay[0] && t < T.overlay[1];
  const rowVisible = t >= T.rowIn && fadeAll > 0;
  const progress = Math.round(seg(t, ...T.clean) * 100);
  const sheetIn = ease(seg(t, ...T.sheet));
  const zoom = ease(seg(t, ...T.zoomIn)) * (1 - ease(seg(t, ...T.zoomOut)));
  const camera = `translate(${W / 2}px, ${H / 2}px) scale(${lerp(1, ZOOM, zoom)}) translate(${-lerp(W / 2, FOCUS.x, zoom)}px, ${-lerp(H / 2, FOCUS.y, zoom)}px)`;

  return (
    <div className="absolute inset-0 origin-top-left" style={{ transform: camera }}>
      <MiniApp
        scenario={scenario}
        overlay={overlay}
        rowVisible={rowVisible}
        rowOpacity={fadeAll}
        rowSlide={ease(seg(t, T.rowIn, T.rowIn + 300))}
        progress={progress}
      />

      {/* Messy export: a legacy PDF converted to Excel */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: PDF.w,
          height: PDF.h,
          opacity: pdfOpacity,
          transform: `translate(${pdfPos.x}px, ${pdfPos.y}px) scale(${s})`,
        }}
      >
        <ExcelSheet scenario={scenario} lifted={grabbing} />
      </div>

      {/* Clean output */}
      {sheetIn > 0 && (
        <div
          className="absolute left-[44px] top-[92px] h-[470px] w-[560px]"
          style={{ opacity: sheetIn * fadeAll, transform: `translateY(${(1 - sheetIn) * 24}px)` }}
        >
          <OutputSheet scenario={scenario} />
        </div>
      )}

      {/* Cursor */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-0 top-0"
        style={{ opacity: cursorOpacity, transform: `translate(${cursor.x - 4}px, ${cursor.y - 2}px)` }}
        aria-hidden="true"
      >
        <path
          d="M5 3.5v15.2l4.1-3.7 2.6 6 2.7-1.2-2.6-5.9h5.6L5 3.5Z"
          fill="var(--color-fg)"
          stroke="var(--color-fg-inverse)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function MiniApp({
  scenario,
  overlay,
  rowVisible,
  rowOpacity,
  rowSlide,
  progress,
}: {
  scenario: DddScenario;
  overlay: boolean;
  rowVisible: boolean;
  rowOpacity: number;
  rowSlide: number;
  progress: number;
}) {
  const stage = progress >= 100 ? "done" : progress >= 80 ? "checking" : progress >= 50 ? "cleaning" : progress >= 22 ? "matching" : progress > 0 ? "reading" : "queued";
  const stageText = {
    queued: "Queued",
    reading: "Reading export",
    matching: "Running steps",
    cleaning: "Running steps",
    checking: "Checking against workbook",
    done: "Workbook updated",
  }[stage];

  return (
    <div className="absolute left-[400px] top-[56px] flex h-[576px] w-[656px] flex-col overflow-hidden rounded-lg border border-line bg-page">
      {/* Title bar */}
      <div className="relative flex h-8 shrink-0 items-center border-b border-line-subtle bg-header px-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="type-caption absolute left-1/2 -translate-x-1/2 text-[11px] text-fg-muted">Dropdone</span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Collapsed sidebar */}
        <div className="flex w-[52px] shrink-0 flex-col items-center gap-3 border-r border-line-subtle bg-section py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dropdone-icon.svg" alt="" className="size-7" />
          <span className="mt-2 size-7 rounded-md bg-surface-strong" />
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-7 rounded-md border border-line-subtle" />
          ))}
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* Toolbar */}
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-line-subtle px-4">
            <span className="h-7 w-48 rounded-md border border-line bg-surface" />
            <span className="type-label rounded-md bg-brand px-2.5 py-1.5 text-[11px] text-fg-inverse">Drop an export</span>
          </div>

          <div className="flex flex-col gap-3 p-4">
            <div className="flex gap-4 border-b border-line-subtle pb-2">
              <span className="type-label text-[12px] text-fg">All files</span>
              <span className="type-label text-[12px] text-fg-muted">In progress</span>
              <span className="type-label text-[12px] text-fg-muted">Done</span>
            </div>

            <div className="card overflow-hidden hover:bg-surface">
              <div className="grid grid-cols-[1.25fr_1fr_150px] gap-4 border-b border-line-subtle px-4 py-2">
                {["File", "Updating", "Status"].map((h, i) => (
                  <span key={h} className={`type-data text-[9px] uppercase tracking-[0.08em] text-fg-subtle ${i === 2 ? "text-right" : ""}`}>
                    {h}
                  </span>
                ))}
              </div>

              {rowVisible && (
                <div
                  className="overflow-hidden"
                  style={{ maxHeight: rowSlide * 64, opacity: rowSlide * rowOpacity }}
                >
                  <MiniRow
                    file={scenario.sheet.file}
                    workbook={scenario.recipe}
                    label={stageText}
                    detail={stage === "done" ? "Saved just now" : `${progress}%`}
                    donut={<Donut stage={stage} progress={progress} size={28} />}
                    highlight
                  />
                </div>
              )}
              {scenario.queue.map((q) => (
                <MiniRow
                  key={q.file}
                  file={q.file}
                  workbook={q.recipe}
                  label="Workbook updated"
                  detail="Saved 2 min ago"
                  donut={<Donut stage="done" progress={100} size={28} />}
                />
              ))}
            </div>
          </div>

          {overlay && (
            <div className="absolute inset-3 top-14 flex flex-col items-center justify-start gap-2 rounded-lg pt-20 border-2 border-dashed border-brand bg-page/85">
              <span className="type-h4">Drop to run</span>
              <span className="type-caption">Runs the {scenario.recipe} cleanup</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniRow({
  file,
  workbook,
  label,
  detail,
  donut,
  highlight,
}: {
  file: string;
  workbook: string;
  label: string;
  detail: string;
  donut: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`grid h-16 grid-cols-[1.25fr_1fr_150px] items-center gap-4 border-b border-line-subtle px-4 last:border-0 ${highlight ? "bg-surface-hover" : ""}`}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={`type-data flex size-8 shrink-0 items-center justify-center rounded-md text-[9px] ${highlight ? "bg-brand-a10 text-brand" : "bg-surface-strong text-fg-muted"}`}>
          {file.split(".").pop()?.toUpperCase()}
        </span>
        <span className="type-label truncate text-[12px] text-fg">{file}</span>
      </div>
      <span className="type-body-sm truncate text-[12px] text-fg-soft">→ {workbook}</span>
      <div className="flex items-center justify-end gap-2.5">
        <div className="min-w-0 text-right">
          <p className="type-label truncate text-[11px] text-fg">{label}</p>
          <p className="type-data text-[9px] text-fg-subtle">{detail}</p>
        </div>
        {donut}
      </div>
    </div>
  );
}

// Column widths in stage px. B, D and G are the empty spacer columns a PDF conversion leaves;
// E is too narrow, so "Withdrawn" gets cut off by the date next to it.
const COLS = [36, 9, 64, 9, 28, 38, 9, 42, 93];
const LETTERS = "ABCDEFGHI".split("");

function ExcelSheet({ scenario, lifted }: { scenario: DddScenario; lifted: boolean }) {
  const { sheet } = scenario;
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-[4px] bg-fg font-sans text-fg-inverse transition-[outline-color] ${
        lifted ? "outline-2 outline-brand" : "outline-0"
      }`}
    >
      {/* Window strip */}
      <div className="flex items-center gap-2 border-b border-fg-inverse/10 bg-fg-inverse/5 px-2 py-1">
        <span className="rounded-[2px] bg-fg-inverse/80 px-1 text-[7px] font-semibold text-fg">XLSX</span>
        <span className="truncate text-[8px] text-fg-inverse/70">{sheet.file}</span>
      </div>
      {/* Formula bar, with the leading spaces visible */}
      <div className="flex items-center gap-1.5 border-b border-fg-inverse/10 px-1.5 py-[3px] text-[7.5px]">
        <span className="w-6 rounded-[2px] border border-fg-inverse/15 text-center text-fg-inverse/70">{sheet.selected.ref}</span>
        <span className="italic text-fg-inverse/40">fx</span>
        <span className="whitespace-pre text-fg-inverse">{sheet.selected.value}</span>
      </div>

      {/* Grid */}
      <div className="relative flex-1 overflow-hidden text-[7.25px] leading-none">
        <div className="flex">
          <span className="h-3 w-4 shrink-0 border-b border-r border-fg-inverse/10 bg-fg-inverse/5" />
          {LETTERS.map((l, c) => (
            <span
              key={l}
              className="flex h-3 shrink-0 items-center justify-center border-b border-r border-fg-inverse/10 bg-fg-inverse/5 text-[6.5px] text-fg-inverse/50"
              style={{ width: COLS[c] }}
            >
              {l}
            </span>
          ))}
        </div>
        {sheet.rows.map((row, r) => {
          const rowNo = r + 1;
          const isHeader = sheet.headerRows.includes(rowNo);
          const merged = row.length === 1;
          return (
            <div key={r} className="flex">
              <span className="flex h-[13px] w-4 shrink-0 items-center justify-center border-b border-r border-fg-inverse/10 bg-fg-inverse/5 text-[6px] text-fg-inverse/50">
                {rowNo}
              </span>
              {merged ? (
                <span
                  className="flex h-[13px] shrink-0 items-center justify-center border-b border-r border-fg-inverse/10 font-bold"
                  style={{ width: COLS.reduce((a, b) => a + b, 0) }}
                >
                  {row[0]}
                </span>
              ) : (
                row.map((cell, c) => {
                  // Text spills into empty cells to its right, like Excel; it's cut off when the next cell has data.
                  let spill = COLS[c];
                  for (let k = c + 1; k < row.length && cell && !row[k]; k++) spill += COLS[k];
                  const isAmount = /^\$/.test(cell);
                  const selected = rowNo === sheet.selected.row && c === sheet.selected.col;
                  return (
                    <span
                      key={c}
                      className={`relative h-[13px] shrink-0 border-b border-r border-fg-inverse/10 ${selected ? "z-10 outline outline-[1.5px] -outline-offset-1 outline-success" : ""}`}
                      style={{ width: COLS[c] }}
                    >
                      {cell && (
                        <span
                          className={`absolute inset-y-0 left-0 z-[1] flex items-center whitespace-pre px-[2px] ${isHeader ? "font-bold" : ""}`}
                          style={{ width: spill, overflow: "hidden" }}
                        >
                          {cell}
                        </span>
                      )}
                      {/* Excel's "number stored as text" marker */}
                      {isAmount && (
                        <span className="absolute left-0 top-0 z-[2] size-0 border-r-[4px] border-t-[4px] border-r-transparent border-t-success" />
                      )}
                    </span>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Sheet tabs, named the way PDF conversions name them */}
      <div className="flex border-t border-fg-inverse/10 bg-fg-inverse/5 px-1">
        {sheet.tabs.map((tab, i) => (
          <span
            key={tab}
            className={`px-2 py-[3px] text-[7px] ${i === 0 ? "border-b-2 border-success bg-fg font-semibold" : "text-fg-inverse/60"}`}
          >
            {tab}
          </span>
        ))}
      </div>
    </div>
  );
}

function OutputSheet({ scenario }: { scenario: DddScenario }) {
  const { output } = scenario;
  const letters = "ABCDEFG".slice(0, output.header.length).split("");
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-line-strong bg-fg text-fg-inverse">
      <div className="flex items-center justify-between gap-3 border-b border-fg-inverse/10 px-4 py-2.5">
        <div className="min-w-0">
          <p className="type-label truncate text-[13px] text-fg-inverse">{output.file}</p>
          <p className="truncate text-[10px] text-fg-inverse/60">{output.folder}</p>
        </div>
        <span className="badge badge-lime shrink-0">Updated just now</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <table className="w-full border-collapse text-left text-[11.5px]">
          <thead>
            <tr className="bg-fg-inverse/5 text-[10px] text-fg-inverse/50">
              <th className="w-8 border border-fg-inverse/10 px-1 py-1 text-center font-normal" />
              {letters.map((l) => (
                <th key={l} className="border border-fg-inverse/10 px-2 py-1 text-center font-normal">
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-fg-inverse/10 bg-fg-inverse/5 text-center text-[10px] text-fg-inverse/50">1</td>
              {output.header.map((h) => (
                <td key={h} className="border border-fg-inverse/10 px-2 py-1.5 font-semibold">
                  {h}
                </td>
              ))}
            </tr>
            {output.rows.map((r, i) => (
              <tr key={i}>
                <td className="border border-fg-inverse/10 bg-fg-inverse/5 text-center text-[10px] text-fg-inverse/50">{i + 2}</td>
                {r.map((c, j) => (
                  <td key={j} className="border border-fg-inverse/10 px-2 py-1.5 tabular-nums">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={`e${i}`}>
                <td className="border border-fg-inverse/10 bg-fg-inverse/5 text-center text-[10px] text-fg-inverse/50">
                  {output.rows.length + 2 + i}
                </td>
                {letters.map((l) => (
                  <td key={l} className="border border-fg-inverse/10 px-2 py-1.5">
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex border-t border-fg-inverse/10 bg-fg-inverse/5 px-2">
        <span className="border-x border-b-2 border-fg-inverse/10 border-b-brand-700 bg-fg px-3 py-1 text-[10px] font-medium">
          {output.sheet}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function clamp(v: number) {
  return Math.max(0, Math.min(1, v));
}
function seg(t: number, a: number, b: number) {
  return clamp((t - a) / (b - a));
}
function ease(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function lerp(a: number, b: number, x: number) {
  return a + (b - a) * x;
}
function lerp2(a: { x: number; y: number }, b: { x: number; y: number }, x: number) {
  return { x: lerp(a.x, b.x, x), y: lerp(a.y, b.y, x) };
}
