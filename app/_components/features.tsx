"use client";

import type { ReactNode } from "react";
import { Donut } from "../mock/ui";
import { useLoop } from "./use-loop";

/*
 * Small looping vignettes, one per feature. Each one steps through a handful of states
 * with useLoop and lets CSS transitions do the in-betweens. The last step is the
 * finished state, which is also what reduced-motion visitors see.
 */

export type FeatureKey = "learn" | "ask" | "inPlace" | "follow" | "local";

export const featureCopy: Record<FeatureKey, { title: string; body: string }> = {
  learn: {
    title: "Learns from one example",
    body: "Show it one messy export and the workbook you made from it. It works out which column goes where, so nobody writes rules.",
  },
  ask: {
    title: "Asks instead of guessing",
    body: "If a value doesn't fit last time's pattern, it stops before saving and asks. No clean-looking report that's quietly wrong.",
  },
  inPlace: {
    title: "Updates your workbook in place",
    body: "New values go into the cells you already use. Formulas, formatting and the other sheets stay exactly as you left them.",
  },
  follow: {
    title: "Follows the file when it moves",
    body: "Someone moved the report into an Archive folder? Dropdone finds it again and keeps it updated.",
  },
  local: {
    title: "Stays on your computer",
    body: "Cleaning happens on your machine. Exports and workbooks are never uploaded, unless you turn on Pro's adjusted refresh.",
  },
};

const vignettes: Record<FeatureKey, () => ReactNode> = {
  learn: LearnVignette,
  ask: AskVignette,
  inPlace: InPlaceVignette,
  follow: FollowVignette,
  local: LocalVignette,
};

export function FeatureCard({ feature }: { feature: FeatureKey }) {
  const Vignette = vignettes[feature];
  const copy = featureCopy[feature];
  return (
    <article className="card flex flex-col overflow-hidden hover:bg-surface">
      <div className="border-b border-line-subtle bg-section">
        <Vignette />
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="type-h4">{copy.title}</h3>
        <p className="type-body-sm">{copy.body}</p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

export function Stage({ children, stageRef }: { children: ReactNode; stageRef: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={stageRef} className="relative flex h-60 items-center justify-center overflow-hidden px-6" aria-hidden="true">
      {children}
    </div>
  );
}

export function Chip({ children, lit, mono = true }: { children: ReactNode; lit?: boolean; mono?: boolean }) {
  return (
    <span
      className={`${mono ? "type-data text-[11px]" : "type-body-sm text-[12px]"} inline-flex h-7 items-center rounded-sm border px-2.5 transition-colors duration-300 ${
        lit ? "border-brand/50 bg-brand-a10 text-brand" : "border-line-subtle bg-surface-strong text-fg-muted"
      }`}
    >
      {children}
    </span>
  );
}

/* 1. Learns from one example: messy headers map to the workbook's columns one by one. */
export function LearnVignette() {
  const pairs = [
    ["CASE_ID", "Case ID"],
    ["CLIENT NM", "Client"],
    ["OPEN_DT", "Opened"],
    ["WORKER", "Caseworker"],
  ];
  const { ref, step } = useLoop<HTMLDivElement>(pairs.length + 3, 650);
  return (
    <Stage stageRef={ref}>
      <div className="flex w-full max-w-[340px] flex-col gap-2">
        <div className="mb-1 grid grid-cols-[1fr_28px_1fr] text-[10px]">
          <span className="type-data uppercase tracking-[0.08em] text-fg-subtle">Export</span>
          <span />
          <span className="type-data uppercase tracking-[0.08em] text-fg-subtle">Your workbook</span>
        </div>
        {pairs.map(([from, to], i) => {
          const on = step > i;
          return (
            <div key={from} className="grid grid-cols-[1fr_28px_1fr] items-center">
              <Chip>{from}</Chip>
              <span
                className={`h-px w-full bg-brand transition-[transform,opacity] duration-300 origin-left ${on ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`}
              />
              <Chip lit={on} mono={false}>
                {to}
              </Chip>
            </div>
          );
        })}
        <div
          className={`type-caption mt-2 flex items-center gap-2 transition-opacity duration-300 ${step >= pairs.length + 1 ? "opacity-100" : "opacity-0"}`}
        >
          <Donut stage="done" progress={100} size={18} />
          Learned 4 columns from one example
        </div>
      </div>
    </Stage>
  );
}

/* 3. Asks instead of guessing: processing pauses on a question, then finishes once answered. */
export function AskVignette() {
  const { ref, step } = useLoop<HTMLDivElement>(7, 750);
  const progress = [30, 62, 85, 85, 85, 100, 100][step];
  const asking = step >= 2 && step <= 4;
  const pressed = step === 4;
  const done = step >= 5;
  return (
    <Stage stageRef={ref}>
      <div className="flex w-full max-w-[360px] flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg border border-line bg-page px-3 py-2.5">
          <span className="type-label min-w-0 flex-1 truncate text-[12px] text-fg">CASE_EXPORT_1023.csv</span>
          <span className={`type-label text-[11px] ${asking ? "text-warning" : done ? "text-fg" : "text-fg-soft"}`}>
            {asking ? "Needs your answer" : done ? "Workbook updated" : "Checking"}
          </span>
          <Donut stage={asking ? "review" : done ? "done" : "checking"} progress={progress} size={26} />
        </div>
        <div
          className={`flex flex-col gap-2.5 rounded-lg border border-warning/40 bg-surface p-3 transition-[opacity,transform] duration-300 ${
            asking ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <p className="type-body-sm text-[12px] text-fg-soft">
            Row 214 has <span className="type-data rounded-sm bg-surface-strong px-1 text-[11px]">N/A</span> as the open date.
            Last time, those were left blank. Do the same?
          </p>
          <div className="flex gap-2">
            <span
              className={`type-label rounded-md px-2.5 py-1 text-[11px] transition-colors ${
                pressed ? "bg-brand text-fg-inverse" : "bg-fg text-fg-inverse"
              }`}
            >
              Leave it blank
            </span>
            <span className="type-label rounded-md border border-line px-2.5 py-1 text-[11px] text-fg-soft">Show me the row</span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* 4. Updates in place: values change row by row, the formula total stays a formula. */
export function InPlaceVignette() {
  const before = [
    ["SNAP", "412"],
    ["LIHEAP", "96"],
    ["TANF", "58"],
    ["WIC", "203"],
  ];
  const after = ["438", "101", "55", "219"];
  const { ref, step } = useLoop<HTMLDivElement>(before.length + 3, 650);
  const updated = (i: number) => step > i && step <= before.length + 1;
  const flashing = (i: number) => step === i + 1;
  const values = before.map((r, i) => (step > i && step <= before.length + 1 ? after[i] : r[1]));
  const total = values.reduce((sum, v) => sum + Number(v), 0);

  return (
    <Stage stageRef={ref}>
      <div className="w-full max-w-[340px] overflow-hidden rounded-md border border-line-strong bg-fg text-fg-inverse">
        <div className="flex items-center gap-2 border-b border-fg-inverse/10 px-2.5 py-1.5 text-[10px]">
          <span className="type-data rounded-sm bg-fg-inverse/5 px-1.5 text-fg-inverse/60">B6</span>
          <span className="type-data text-fg-inverse/70">=SUM(B2:B5)</span>
        </div>
        <table className="w-full border-collapse text-[11.5px]">
          <tbody>
            <tr className="bg-fg-inverse/5 font-semibold">
              <td className="border border-fg-inverse/10 px-2 py-1.5">Program</td>
              <td className="border border-fg-inverse/10 px-2 py-1.5 text-right">Open cases</td>
            </tr>
            {before.map((r, i) => (
              <tr key={r[0]}>
                <td className="border border-fg-inverse/10 px-2 py-1.5">{r[0]}</td>
                <td
                  className={`border border-fg-inverse/10 px-2 py-1.5 text-right tabular-nums transition-colors duration-500 ${
                    flashing(i) ? "bg-brand" : updated(i) ? "bg-brand-200" : ""
                  }`}
                >
                  {values[i]}
                </td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="border border-fg-inverse/10 px-2 py-1.5">Total</td>
              <td className="border border-fg-inverse/10 px-2 py-1.5 text-right tabular-nums">{total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Stage>
  );
}

/* 5. Follows the file: the path changes, Dropdone re-finds the workbook and updates it. */
export function FollowVignette() {
  const { ref, step } = useLoop<HTMLDivElement>(6, 800);
  const moved = step >= 1;
  const searching = step === 2;
  const found = step >= 3;
  const updated = step >= 4;
  return (
    <Stage stageRef={ref}>
      <div className="flex w-full max-w-[360px] flex-col gap-3">
        <div className="flex flex-col gap-1.5 rounded-lg border border-line bg-page p-3">
          <span className="type-data text-[10px] uppercase tracking-[0.08em] text-fg-subtle">Weekly Caseload.xlsx</span>
          <div className="relative h-5 overflow-hidden">
            <p
              className={`type-data absolute inset-x-0 text-[12px] transition-[transform,opacity] duration-500 ${
                moved ? "-translate-y-5 opacity-0" : "translate-y-0 text-fg-soft opacity-100"
              }`}
            >
              HSD-Share › Reports › 2026
            </p>
            <p
              className={`type-data absolute inset-x-0 text-[12px] text-fg-soft transition-[transform,opacity] duration-500 ${
                moved ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              HSD-Share › Archive › FY26
            </p>
          </div>
        </div>
        <div className="flex h-9 items-center gap-2.5 px-1">
          {searching && (
            <>
              <Donut stage="matching" progress={45} size={20} />
              <span className="type-body-sm text-[12px]">File moved. Looking for it…</span>
            </>
          )}
          {found && (
            <>
              <Donut stage="done" progress={100} size={20} />
              <span className="type-body-sm text-[12px] text-fg-soft">
                {updated ? "Found it in Archive and updated it" : "Found it in Archive"}
              </span>
            </>
          )}
        </div>
      </div>
    </Stage>
  );
}

/* 6. Never leaves your computer: the file travels export → Dropdone → workbook inside the machine. */
export function LocalVignette() {
  const { ref, step } = useLoop<HTMLDivElement>(4, 800);
  const pos = ["left-[10%]", "left-[43%]", "left-[76%]", "left-[76%]"][step];
  const nodes = [
    { label: "Export", sub: ".csv" },
    { label: "Dropdone", sub: "on this Mac", brand: true },
    { label: "Workbook", sub: ".xlsx" },
  ];
  return (
    <Stage stageRef={ref}>
      <div className="flex w-full max-w-[380px] flex-col gap-3">
        <div className="relative rounded-lg border border-line bg-page px-4 pb-4 pt-7">
          <span className="type-data absolute left-3 top-2 text-[10px] uppercase tracking-[0.08em] text-fg-subtle">
            Your computer
          </span>
          <div className="relative flex items-center justify-between">
            <span className="absolute left-[12%] right-[12%] top-1/2 h-px bg-line-strong" />
            {nodes.map((n) => (
              <div key={n.label} className="relative z-10 flex flex-col items-center gap-1">
                <span
                  className={`flex size-11 items-center justify-center rounded-md border ${
                    n.brand ? "border-brand/50 bg-brand-a10" : "border-line bg-surface"
                  }`}
                >
                  {n.brand ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/brand/dropdone-icon.svg" alt="" className="size-7" />
                  ) : (
                    <span className="type-data text-[9px] text-fg-muted">{n.sub.slice(1).toUpperCase()}</span>
                  )}
                </span>
                <span className="type-caption text-[11px] text-fg-soft">{n.label}</span>
              </div>
            ))}
            <span
              className={`absolute top-[18px] z-20 size-2.5 rounded-[2px] bg-brand transition-[left] duration-700 ease-in-out ${pos}`}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-fg-subtle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M7.5 18.5h9.5a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4.25 4.25 0 0 0 7.5 18.5Z" />
            <path d="M4 4l16 16" />
          </svg>
          <span className="type-caption text-[11px]">Cleaned here. Nothing uploaded.</span>
        </div>
      </div>
    </Stage>
  );
}
