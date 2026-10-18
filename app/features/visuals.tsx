"use client";

import { useEffect, useState } from "react";
import { Donut } from "../mock/ui";
import { useLoop } from "../_components/use-loop";

/*
 * Visuals for the Features bento. Each card gets its own idea; nothing here is reused from
 * the homepage animations. Loops only run while on screen, and reduced-motion visitors see
 * each loop's final state.
 */

const EXCEL_FONT = 'Calibri, Carlito, "Segoe UI", Arial, sans-serif';

function Cursor({
  x,
  y,
  show = true,
}: {
  x: number | string;
  y: number | string;
  show?: boolean;
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="pointer-events-none absolute z-20 transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
      style={{ left: x, top: y, opacity: show ? 1 : 0 }}
    >
      <path
        d="M5 3.5v15.2l4.1-3.7 2.6 6 2.7-1.2-2.6-5.9h5.6L5 3.5Z"
        fill="var(--color-fg)"
        stroke="var(--color-fg-inverse)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- 1. Learns from one example: one messy sheet cleans itself in place ---------- */

type MorphRow =
  | { kind: "junk"; text: string }
  | { kind: "head" | "data"; messy: string[]; clean: string[] };

const morphRows: MorphRow[] = [
  { kind: "junk", text: "CLIENT SERVICES REPORT" },
  { kind: "junk", text: "Program: All Sites        Run date: 03/09/26 08:14" },
  {
    kind: "head",
    messy: ["CLNT_ID", "CLNT_NM", "SVC_DT", "AMT"],
    clean: ["Client ID", "Client Name", "Service Date", "Amount"],
  },
  {
    kind: "data",
    messy: ["10482", "  Smith, JOHN ", "03-02-26", "$1,200.00"],
    clean: ["10482", "John Smith", "2026-03-02", "1200"],
  },
  {
    kind: "junk",
    text: "Confidential: contains client information     Page 1 of 2",
  },
  {
    kind: "data",
    messy: ["10484", "LEE, DAVID ", "03-03-26", "$300.00"],
    clean: ["10484", "David Lee", "2026-03-03", "300"],
  },
  {
    kind: "data",
    messy: ["10486", "nguyen, tom", "03-05-26", "$450.00"],
    clean: ["10486", "Tom Nguyen", "2026-03-05", "450"],
  },
];

const morphStatus = [
  "Comparing your before and after",
  "Spotting print clutter",
  "Removing it",
  "Renaming columns",
  "Cleaning names, dates and amounts",
  "Learned 8 steps from one example",
];

export function LearnMorph() {
  const { ref, step } = useLoop<HTMLDivElement>(6, 1100);
  const flagged = step === 1;
  const removed = step >= 2;
  const renamed = step >= 3;
  const cleaned = step >= 4;

  return (
    <div
      ref={ref}
      className="flex w-full max-w-[560px] flex-col gap-4"
      aria-hidden="true"
    >
      <div
        className="overflow-hidden rounded-lg border border-line-strong bg-fg text-[13px] text-fg-inverse"
        style={{ fontFamily: EXCEL_FONT }}
      >
        <div className="flex items-center gap-2 border-b border-fg-inverse/10 bg-fg-inverse/[0.04] px-3 py-1.5 text-[11px] text-fg-inverse/60">
          <span className="rounded-[3px] bg-fg-inverse/75 px-1.5 py-px text-[9px] font-semibold text-fg">
            XLSX
          </span>
          {cleaned ? "Client Services.xlsx" : "Client_Services_0302.xlsx"}
        </div>
        {morphRows.map((r, i) => {
          if (r.kind === "junk") {
            return (
              <div
                key={i}
                className="grid transition-[grid-template-rows] duration-500 ease-out"
                style={{ gridTemplateRows: removed ? "0fr" : "1fr" }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div
                    className={`flex h-8 items-center whitespace-pre border-b border-fg-inverse/10 px-3 transition-colors duration-300 ${
                      flagged ? "bg-danger/15 text-danger line-through" : ""
                    } ${i === 0 ? "justify-center font-bold" : ""}`}
                  >
                    {r.text}
                  </div>
                </div>
              </div>
            );
          }
          const isHead = r.kind === "head";
          const done = isHead ? renamed : cleaned;
          const cells = done ? r.clean : r.messy;
          return (
            <div
              key={i}
              className="grid h-8 grid-cols-[70px_1.4fr_1fr_1fr] border-b border-fg-inverse/10 last:border-0"
            >
              {cells.map((c, j) => (
                <span
                  key={j}
                  className={`flex items-center overflow-hidden whitespace-pre border-r border-fg-inverse/10 px-3 transition-colors duration-500 last:border-0 ${
                    isHead ? "font-bold" : ""
                  } ${
                    (isHead && step === 3) || (!isHead && step === 4)
                      ? "bg-brand"
                      : done && !isHead && j > 0
                        ? "bg-brand-200/60"
                        : ""
                  } ${!isHead && done && (j === 2 || j === 3 || j === 0) ? "justify-end tabular-nums" : ""}`}
                >
                  {c}
                </span>
              ))}
            </div>
          );
        })}
      </div>
      <div className="type-body-sm flex items-center justify-center gap-2.5 text-fg-soft">
        <Donut
          stage={step >= 5 ? "done" : "matching"}
          progress={Math.round(((step + 1) / 6) * 100)}
          size={20}
        />
        {morphStatus[step]}
      </div>
    </div>
  );
}

/* ---------- 2. Every step in plain English (static) ---------- */

export function PlainEnglishVisual() {
  const steps = [
    'Remove everything above the row that starts with "CLNT_ID"',
    'Remove "Page _ of _" lines and repeated headers',
    "Change Client Name to First Last, in title case",
    "Remove rows where Status is Withdrawn",
  ];
  return (
    <div
      className="flex w-full max-w-[360px] flex-col gap-2"
      aria-hidden="true"
    >
      {steps.map((s, i) => (
        <div
          key={s}
          className="flex items-start gap-3 rounded-lg border border-line-subtle bg-page px-3.5 py-2.5"
        >
          <span className="type-data w-4 shrink-0 pt-0.5 text-xs text-brand">
            {i + 1}
          </span>
          <span className="type-body-sm text-[13px] text-fg-soft">{s}</span>
        </div>
      ))}
      <div className="type-label mt-1 self-end rounded-md bg-fg px-3 py-1.5 text-[12px] text-fg-inverse">
        Approve steps
      </div>
    </div>
  );
}

/* ---------- 3. Keeps the context: the header moves rows and is still found ---------- */

export function ContextVisual() {
  const { ref, step } = useLoop<HTMLDivElement>(2, 2600);
  const moved = step === 1;
  const rows = [
    "CLIENT SERVICES REPORT",
    "Program: All Sites",
    "",
    "CLNT_ID   CLNT_NM   STAT",
    "10482     Smith, JOHN",
    "",
  ];
  const shifted = [
    "CLIENT SERVICES REPORT",
    "Program: All Sites",
    "Run by: svc_batch",
    "",
    "",
    "CLNT_ID   CLNT_NM   STAT",
  ];
  const shown = moved ? shifted : rows;
  const headerRow = moved ? 6 : 4;

  return (
    <div
      ref={ref}
      className="flex w-full max-w-[300px] flex-col gap-3"
      aria-hidden="true"
    >
      <div className="overflow-hidden rounded-md border border-line-strong bg-fg font-mono text-[11px] text-fg-inverse">
        {shown.map((r, i) => (
          <div
            key={i}
            className={`flex h-6 items-center border-b border-fg-inverse/10 transition-colors duration-500 last:border-0 ${
              i + 1 === headerRow ? "bg-brand" : ""
            }`}
          >
            <span className="w-7 shrink-0 border-r border-fg-inverse/10 text-center text-[10px] text-fg-inverse/50">
              {i + 1}
            </span>
            <span className="truncate whitespace-pre px-2">{r}</span>
          </div>
        ))}
      </div>
      <div className="type-caption flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-brand">
          <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Found CLNT_ID on row {headerRow}
        <span className="text-fg-subtle">
          {moved ? "(row 4 last time)" : ""}
        </span>
      </div>
    </div>
  );
}

/* ---------- 4. Follows the file: three places, all wired back to Dropdone ---------- */

const places = [
  { name: "SharePoint", path: "Sites › Finance › Reports", icon: "cloud" },
  { name: "Downloads", path: "~/Downloads", icon: "folder" },
  { name: "Shared drive", path: "\\\\HSD-Share\\Reports", icon: "server" },
] as const;

// Positions in % of the diagram. Wide: Dropdone in the middle, places around it.
// Narrow: Dropdone on the left, places stacked on the right, so nothing overlaps on phones.
const layouts = {
  wide: { hub: { x: 50, y: 50 }, nodes: [{ x: 16, y: 20 }, { x: 16, y: 80 }, { x: 84, y: 50 }] },
  narrow: { hub: { x: 17, y: 50 }, nodes: [{ x: 66, y: 16 }, { x: 66, y: 50 }, { x: 66, y: 84 }] },
};

export function FollowHub() {
  const { ref, step } = useLoop<HTMLDivElement>(3, 1900);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 520));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  const layout = narrow ? layouts.narrow : layouts.wide;

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-[600px] ${narrow ? "h-[300px]" : "aspect-[600/260]"}`}
      aria-hidden="true"
    >
      {/* Lines run center to center, underneath the boxes, so they never overlap them */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {layout.nodes.map((n, i) => {
          const on = i === step;
          return (
            <line
              key={i}
              x1={layout.hub.x}
              y1={layout.hub.y}
              x2={n.x}
              y2={n.y}
              stroke={on ? "var(--color-brand)" : "var(--color-line-strong)"}
              strokeWidth={on ? 2.5 : 1.5}
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke 300ms, stroke-width 300ms" }}
            />
          );
        })}
      </svg>

      {/* Dropdone */}
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${layout.hub.x}%`, top: `${layout.hub.y}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dropdone-icon-animated.svg" alt="" className="size-16 rounded-[14px]" />
      </div>

      {/* Places */}
      {places.map((p, i) => {
        const on = i === step;
        const n = layout.nodes[i];
        return (
          <div
            key={p.name}
            className={`absolute z-10 flex w-44 -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-lg border px-3 py-2 transition-colors duration-300 ${
              on ? "border-brand bg-surface-strong" : "border-line bg-page"
            }`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span className={`type-label flex items-center gap-2 text-[13px] ${on ? "text-brand" : "text-fg-soft"}`}>
              <PlaceIcon kind={p.icon} />
              {p.name}
            </span>
            <span className="type-data truncate text-[10px] text-fg-subtle">{p.path}</span>
            <span
              className={`type-data flex items-center gap-1 overflow-hidden whitespace-nowrap text-[10px] text-fg transition-[max-height,opacity] duration-300 ${
                on ? "max-h-5 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <span className="rounded-[2px] bg-fg px-1 text-[8px] font-semibold text-fg-inverse">XLSX</span>
              Client Services.xlsx
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PlaceIcon({ kind }: { kind: "cloud" | "folder" | "server" }) {
  const paths = {
    cloud: (
      <path d="M7.5 18.5h9.5a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4.25 4.25 0 0 0 7.5 18.5Z" />
    ),
    folder: (
      <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-10Z" />
    ),
    server: (
      <>
        <rect x="4" y="4.5" width="16" height="6" rx="1.5" />
        <rect x="4" y="13.5" width="16" height="6" rx="1.5" />
      </>
    ),
  };
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
    >
      {paths[kind]}
    </svg>
  );
}

/* ---------- 5. Asks instead of guessing: the real setup question, answered ---------- */

export function AskQuestion() {
  // 0 question · 1 cursor moves · 2 press "Not sure" · 3 step updates · 4 hold
  const { ref, step } = useLoop<HTMLDivElement>(6, 950);
  const answered = step >= 3;
  const cursor = step === 0 ? { x: "85%", y: "100%" } : { x: "33%", y: "80%" };

  return (
    <div ref={ref} className="relative w-full max-w-[440px]" aria-hidden="true">
      <div className="relative flex flex-col gap-3 rounded-xl border border-warning/50 bg-page p-4">
        <p className="type-body-sm text-[13px] text-fg-soft">
          You removed 2 rows. Both say{" "}
          <span className="text-fg">Withdrawn</span>, and both have a{" "}
          <span className="text-fg">blank Amount</span>. Next week, should
          Dropdone remove a row like this?
        </p>
        <div className="grid grid-cols-4 overflow-hidden rounded-md border border-line text-[11px]">
          {["10491", "Rosa Diaz", "Active", "(blank)"].map((c, i) => (
            <span
              key={i}
              className={`type-data px-2 py-1.5 ${c === "(blank)" ? "text-warning" : "text-fg-soft"}`}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          {["Yes", "No", "Not sure"].map((o) => (
            <span
              key={o}
              className={`type-label rounded-md border px-3 py-1.5 text-[12px] transition-colors ${
                o === "Not sure" && step >= 2
                  ? "border-brand bg-brand text-fg-inverse"
                  : "border-line text-fg-soft"
              }`}
            >
              {o}
            </span>
          ))}
        </div>
        <Cursor x={cursor.x} y={cursor.y} show={step >= 1 && step <= 2} />
      </div>
      <div
        className={`mt-3 flex items-start gap-2.5 rounded-lg border border-brand/30 bg-brand-a10 px-3.5 py-2.5 transition-[opacity,transform] duration-500 ${
          answered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        <span className="type-data pt-0.5 text-xs text-brand">8</span>
        <span className="type-body-sm text-[13px] text-fg-soft">
          Remove rows where Status is Withdrawn, and flag rows with a blank
          Amount for you
        </span>
      </div>
    </div>
  );
}

/* ---------- 6. Undo any update: press Restore, the workbook rolls back ---------- */

const versions = {
  today: {
    label: "Today, 8:20 AM",
    rows: [
      ["John Smith", "1,200"],
      ["David Lee", "300"],
      ["Tom Nguyen", "450"],
    ],
    total: "1,950",
  },
  last: {
    label: "Mar 9, 8:20 AM",
    rows: [
      ["John Smith", "980"],
      ["David Lee", "300"],
      ["Tom Nguyen", "610"],
    ],
    total: "1,890",
  },
};

export function UndoRestore() {
  // 0 today · 1 cursor to Restore · 2 press · 3 values roll back · 4 hold
  const { ref, step } = useLoop<HTMLDivElement>(6, 1000);
  const restored = step >= 3;
  const shown = restored ? versions.last : versions.today;

  return (
    <div
      ref={ref}
      className="relative grid w-full max-w-[520px] items-center gap-3 sm:grid-cols-[1fr_190px]"
      aria-hidden="true"
    >
      {/* The workbook */}
      <div
        className="overflow-hidden rounded-lg border border-line-strong bg-fg text-[12.5px] text-fg-inverse"
        style={{ fontFamily: EXCEL_FONT }}
      >
        <div className="flex items-center justify-between gap-2 border-b border-fg-inverse/10 bg-fg-inverse/[0.04] px-3 py-1.5 text-[10.5px] text-fg-inverse/60">
          <span>Client Services.xlsx · Data</span>
          <span
            className={`font-semibold ${restored ? "text-fg-inverse" : ""}`}
          >
            {shown.label}
          </span>
        </div>
        <div className="grid grid-cols-[1fr_80px] border-b border-fg-inverse/10 bg-fg-inverse/[0.04] font-bold">
          <span className="px-3 py-1.5">Client Name</span>
          <span className="px-3 py-1.5 text-right">Amount</span>
        </div>
        {shown.rows.map(([name, amt], i) => {
          const changed =
            versions.today.rows[i][1] !== versions.last.rows[i][1];
          return (
            <div
              key={name}
              className="grid grid-cols-[1fr_80px] border-b border-fg-inverse/10"
            >
              <span className="px-3 py-1.5">{name}</span>
              <span
                className={`px-3 py-1.5 text-right tabular-nums transition-colors duration-500 ${
                  changed && step === 3
                    ? "bg-brand"
                    : changed && restored
                      ? "bg-brand-200/60"
                      : ""
                }`}
              >
                {amt}
              </span>
            </div>
          );
        })}
        <div className="grid grid-cols-[1fr_80px] font-bold">
          <span className="px-3 py-1.5">Total</span>
          <span className="px-3 py-1.5 text-right tabular-nums">
            {shown.total}
          </span>
        </div>
      </div>

      {/* Versions */}
      <div className="flex flex-col gap-2">
        {(["today", "last"] as const).map((key) => {
          const v = versions[key];
          const isCurrent = restored ? key === "last" : key === "today";
          const pressing = key === "last" && step === 2;
          return (
            <div
              key={key}
              className="flex flex-col gap-1.5 rounded-lg border border-line bg-page px-3 py-2"
            >
              <span className="type-label text-[12px] text-fg">{v.label}</span>
              {isCurrent ? (
                <span className="badge badge-lime self-start">Current</span>
              ) : (
                <span
                  className={`type-label self-start rounded-md border px-2.5 py-0.5 text-[11px] transition-colors ${
                    pressing
                      ? "border-brand bg-brand text-fg-inverse"
                      : "border-line text-fg-soft"
                  }`}
                >
                  Restore
                </span>
              )}
            </div>
          );
        })}
      </div>
      <Cursor
        x="74%"
        y={step === 0 ? "105%" : "74%"}
        show={step >= 1 && step <= 2}
      />
    </div>
  );
}

/* ---------- 7. Checks before it saves: four checks tick, then it saves ---------- */

const checks = [
  "Same columns",
  "Same order",
  "Same kinds of values",
  "About as many rows changed as usual",
];

export function ChecksBeforeSave() {
  const { ref, step } = useLoop<HTMLDivElement>(checks.length + 3, 650);
  const saved = step >= checks.length + 1;

  return (
    <div
      ref={ref}
      className="flex w-full max-w-[300px] flex-col gap-2"
      aria-hidden="true"
    >
      {checks.map((c, i) => {
        const done = step > i;
        const running = step === i;
        return (
          <div
            key={c}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors duration-300 ${
              done ? "border-brand/30 bg-page" : "border-line-subtle bg-page"
            }`}
          >
            <Donut
              stage={done ? "done" : running ? "checking" : "queued"}
              progress={done ? 100 : running ? 60 : 0}
              size={20}
            />
            <span
              className={`type-body-sm text-[13px] transition-colors ${done ? "text-fg" : "text-fg-muted"}`}
            >
              {c}
            </span>
          </div>
        );
      })}
      <div
        className={`type-label mt-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] transition-colors duration-300 ${
          saved
            ? "bg-brand text-fg-inverse"
            : "bg-surface-strong text-fg-subtle"
        }`}
      >
        {saved ? "Saved to Client Services.xlsx" : "Not saved yet"}
      </div>
    </div>
  );
}

/* ---------- 8. Pro: when an export changes, it proposes the fix (static) ---------- */

export function ProFixVisual() {
  return (
    <div
      className="flex w-full max-w-[460px] flex-col gap-3"
      aria-hidden="true"
    >
      <div className="flex items-start gap-3 rounded-lg border border-danger/40 bg-page px-3.5 py-3">
        <Donut stage="stopped" progress={40} size={22} />
        <div>
          <p className="type-label text-[13px] text-fg">This export changed</p>
          <p className="type-caption">SVC_DT is now called SERVICE_DATE.</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-brand/30 bg-page px-3.5 py-3">
        <p className="type-data text-[10px] uppercase tracking-[0.08em] text-brand">
          Proposed fix
        </p>
        <p className="type-body-sm text-[13px] text-fg-soft">
          Step 6: Format{" "}
          <span className="text-fg-subtle line-through">SVC_DT</span>{" "}
          <span className="text-fg">SERVICE_DATE</span> as YYYY-MM-DD
        </p>
        <div className="flex gap-2">
          <span className="type-label rounded-md bg-fg px-3 py-1.5 text-[12px] text-fg-inverse">
            Approve
          </span>
          <span className="type-label rounded-md border border-line px-3 py-1.5 text-[12px] text-fg-soft">
            Review rows
          </span>
        </div>
      </div>
    </div>
  );
}
