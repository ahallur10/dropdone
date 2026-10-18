"use client";

import { useState } from "react";
import { Donut } from "../mock/ui";
import { useLoop } from "../_components/use-loop";
import { cleanHeader, contextFile, nextExportFile, question, reportName, steps, summary, warning, workbookFile } from "./sample";

type Answer = (typeof question.options)[number];

/* ---------- Step 2: review the steps, answer the one question ---------- */

export function ReviewSteps() {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [approved, setApproved] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <ContextFile />
      <ol className="flex flex-col gap-1.5">
        {steps.map((s, i) => {
          const isQ = i === question.stepIndex;
          const text = isQ && answer ? question.result[answer] : s;
          return (
            <li
              key={i}
              className={`overflow-hidden rounded-lg border bg-surface transition-colors ${
                isQ && !answer ? "border-warning/50" : approved ? "border-brand/30" : "border-line-subtle"
              }`}
            >
              <div className="flex items-start gap-3 px-4 py-2.5">
                <span className="type-data w-5 shrink-0 pt-0.5 text-xs text-brand">{i + 1}</span>
                <span className="type-body-sm flex-1 text-fg-soft">{text}</span>
                {isQ && !answer && <span className="type-data shrink-0 pt-0.5 text-[11px] text-warning">1 question</span>}
              </div>
              {isQ && !answer && (
                <div className="flex flex-col gap-3 border-t border-line-subtle bg-section px-4 py-4">
                  <p className="type-body-sm text-fg-soft">
                    {question.intro} <span className="text-fg">{question.ask}</span>
                  </p>
                  <div className="overflow-x-auto rounded-md border border-line">
                    <table className="w-full min-w-[440px] border-collapse text-left">
                      <thead>
                        <tr className="bg-surface-strong">
                          {cleanHeader.map((h) => (
                            <th key={h} className="type-data px-3 py-1.5 text-[11px] font-medium text-fg-muted">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {question.row.map((c, j) => (
                            <td key={j} className={`type-data px-3 py-2 text-xs ${c === "(blank)" ? "text-fg-subtle" : "text-fg-soft"}`}>
                              {c}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {question.options.map((o) => (
                      <button
                        key={o}
                        onClick={() => setAnswer(o)}
                        className="type-label min-h-9 cursor-pointer rounded-md border border-line px-4 text-sm text-fg-soft transition-colors hover:border-brand hover:text-fg"
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
        {approved ? (
          <span className="type-label flex items-center gap-2 text-sm text-brand">
            <Donut stage="done" progress={100} size={22} />
            Approved. It runs exactly like this every week.
          </span>
        ) : (
          <button
            disabled={!answer}
            onClick={() => setApproved(true)}
            className="btn-primary min-h-9 cursor-pointer px-4 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Approve steps
          </button>
        )}
      </div>
    </div>
  );
}

function ContextFile() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-brand/30 bg-brand-a10 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="type-label flex items-center gap-2 text-sm text-fg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true" className="text-brand">
            <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5l-5-5Zm0 0v5h5" />
            <path d="M8.5 12.5h7M8.5 16h5" />
          </svg>
          Context file
        </p>
        <span className="type-data text-[10px] uppercase tracking-[0.08em] text-brand">Saved with the cleanup</span>
      </div>
      <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[110px_1fr]">
        {contextFile.entries.map((e) => (
          <div key={e.field} className="contents">
            <dt className="type-label text-[13px] text-fg">{e.field}</dt>
            <dd className="type-body-sm text-fg-soft">{e.detail}</dd>
          </div>
        ))}
      </dl>
      <p className="type-label border-t border-brand/20 pt-3 text-[13px] text-brand">{contextFile.contrast}</p>
    </div>
  );
}

/* ---------- Step 3: drop the next export onto its saved cleanup ---------- */

export function DropOnRecipe() {
  // 0 file waiting · 1 file over card · 2 dropped · 3-5 running · 6 done
  const { ref, step } = useLoop<HTMLDivElement>(8, 750);
  const dropped = step >= 2;
  const over = step === 1;
  const progress = [0, 0, 8, 38, 70, 92, 100, 100][step];
  const done = step >= 6;
  const stage = done ? "done" : step >= 5 ? "checking" : dropped ? "cleaning" : "queued";

  return (
    <div ref={ref} className="relative mx-auto flex h-56 w-full max-w-[460px] flex-col items-center justify-end" aria-hidden="true">
      {/* The new export */}
      <div
        className="absolute left-1/2 z-10 flex items-center gap-2.5 rounded-md border border-line-strong bg-fg px-3 py-2 text-fg-inverse transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)]"
        style={{
          top: step === 0 ? 4 : over ? 92 : 124,
          transform: `translateX(-50%) scale(${dropped ? 0.6 : 1}) rotate(${step === 0 ? -3 : 0}deg)`,
          opacity: dropped ? 0 : 1,
        }}
      >
        <span className="rounded-[3px] bg-fg-inverse/75 px-1.5 py-px text-[10px] font-semibold text-fg">XLSX</span>
        <span className="type-data text-xs">{nextExportFile}</span>
      </div>
      {/* Cursor */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        className="absolute left-1/2 z-20 transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)]"
        style={{ top: (step === 0 ? 4 : over ? 92 : 124) + 22, marginLeft: 40, opacity: dropped ? 0 : 1 }}
      >
        <path d="M5 3.5v15.2l4.1-3.7 2.6 6 2.7-1.2-2.6-5.9h5.6L5 3.5Z" fill="var(--color-fg)" stroke="var(--color-fg-inverse)" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>

      {/* The saved cleanup's card */}
      <div
        className={`flex w-full flex-col gap-3 rounded-xl border p-5 transition-colors duration-300 ${
          over ? "border-brand bg-brand-a10" : "border-line bg-surface"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-md ${over ? "bg-brand text-fg-inverse" : "bg-brand-a10 text-brand"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5l-5-5Zm0 0v5h5" />
              <path d="M8.5 13h7M8.5 16.5h7M12 13v3.5" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="type-label truncate text-fg">{reportName}</p>
            <p className="type-caption mt-0.5">
              {workbookFile} · 8 approved steps
            </p>
          </div>
          {dropped && <Donut stage={stage} progress={progress} size={34} />}
        </div>
        <p className="type-data h-4 text-xs text-fg-muted">
          {step === 0 && "Waiting for next week's export"}
          {over && <span className="text-brand">Drop to run</span>}
          {/* The export moved: the context file finds the header by what it is, not where it was */}
          {dropped && step <= 3 && "Found the CLNT_ID header on row 6 (row 4 last time)"}
          {dropped && step > 3 && !done && `Running step ${Math.max(1, Math.round((progress / 100) * 8))} of 8`}
          {done && <span className="text-brand">Done. Checked and saved in 4 seconds.</span>}
        </p>
      </div>
    </div>
  );
}

/* ---------- Step 4: verify before saving ---------- */

export function VerifyRun() {
  const [mode, setMode] = useState<"ok" | "off">("ok");

  return (
    <div className="flex flex-col gap-4">
      <div role="group" className="grid w-full max-w-sm grid-cols-2 gap-1 rounded-md bg-surface p-1">
        {(
          [
            ["ok", "A normal week"],
            ["off", "Something's off"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={mode === key}
            onClick={() => setMode(key)}
            className={`type-label min-h-8 cursor-pointer rounded-sm px-3 text-[13px] transition-colors ${
              mode === key ? "bg-surface-strong text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "ok" ? (
        <div className="flex flex-col gap-5 rounded-xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="type-label text-fg">{reportName}</p>
            <p className="type-data text-xs text-fg-muted">ran in {summary.duration}</p>
          </div>
          <div className="flex items-center gap-4">
            <Count n={summary.rowsIn} label="client rows in the export" />
            <span className="text-fg-subtle" aria-hidden="true">→</span>
            <Count n={summary.rowsOut} label="rows in your workbook" />
          </div>
          <ul className="flex flex-col gap-2">
            {summary.lines.map((l) => (
              <li key={l} className="type-body-sm flex gap-2.5 text-fg-soft">
                <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-[1px] bg-brand" />
                {l}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1.5 border-t border-line-subtle pt-4">
            <p className="type-body-sm flex items-center gap-2 text-success">
              <Check />
              {summary.checked}
            </p>
            <p className="type-body-sm text-fg-soft">{summary.saved}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-xl border border-warning/50 bg-surface p-5">
          <div className="flex items-start gap-3">
            <Donut stage="review" progress={88} size={34} />
            <div>
              <p className="type-label text-fg">{warning.title}</p>
              <p className="type-body-sm mt-1">{warning.body} Nothing has been saved yet.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pl-[46px]">
            <span className="type-label inline-flex min-h-9 items-center rounded-md border border-line px-4 text-sm text-fg-soft">
              Review rows
            </span>
            <span className="type-label inline-flex min-h-9 items-center rounded-md bg-fg px-4 text-sm text-fg-inverse">
              Looks right
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Count({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="type-h3 tabular-nums">{n}</span>
      <span className="type-caption">{label}</span>
    </div>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Step 1: the before and after, one at a time ---------- */

export function BeforeAfterToggle({ before, after }: { before: React.ReactNode; after: React.ReactNode }) {
  const [side, setSide] = useState<"before" | "after">("before");
  const [touched, setTouched] = useState(false);
  // Flip on its own every few seconds until someone picks a side.
  const { ref, step } = useLoop<HTMLDivElement>(2, 3200);
  const showing = touched ? side : step === 0 ? "before" : "after";

  return (
    <div ref={ref} className="flex flex-col items-center gap-4">
      <div role="group" className="grid w-full max-w-sm grid-cols-2 gap-1 rounded-md bg-surface p-1">
        {(
          [
            ["before", "Before: the export"],
            ["after", "After: your cleaned version"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={showing === key}
            onClick={() => {
              setTouched(true);
              setSide(key);
            }}
            className={`type-label min-h-8 cursor-pointer whitespace-nowrap rounded-sm px-2 text-[12.5px] transition-colors ${
              showing === key ? "bg-surface-strong text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="max-w-full overflow-x-auto">
        <div key={showing} className="animate-fade-in">
          {showing === "before" ? before : after}
        </div>
      </div>
    </div>
  );
}
