"use client";

import { useState } from "react";
import { aprHeader, aprRows, exportFile, outputFile, roster, removed } from "./trio-sample";

type Stage = "messy" | "review" | "ready";

export function AprDemo() {
  const [stage, setStage] = useState<Stage>("messy");
  const [gpaChoice, setGpaChoice] = useState<"blank" | "manual" | null>(null);

  function reset() {
    setStage("messy");
    setGpaChoice(null);
  }

  return (
    <div className="card overflow-hidden hover:bg-surface">
      {/* File bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <FileIcon />
          <span className="type-data truncate text-fg-soft">
            {stage === "messy" ? exportFile : outputFile}
          </span>
          <span
            className={`badge shrink-0 ${
              stage === "messy"
                ? "bg-surface-strong text-fg-soft"
                : stage === "review"
                  ? "bg-warning text-fg-inverse"
                  : "badge-lime"
            }`}
          >
            {stage === "messy" ? "Roster export" : stage === "review" ? "1 question" : "Ready to upload"}
          </span>
        </div>
        {stage === "messy" && (
          <button onClick={() => setStage("review")} className="btn-brand cursor-pointer">
            Drop it
          </button>
        )}
        {stage === "review" && (
          <button
            onClick={() => setStage("ready")}
            disabled={!gpaChoice}
            className="btn-brand cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save APR file
          </button>
        )}
        {stage === "ready" && (
          <button onClick={reset} className="btn-primary cursor-pointer">
            Start over
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-5 py-4">
        {stage === "messy" ? <RosterTable /> : <AprTable gpaChoice={gpaChoice} />}
      </div>

      {/* Bottom panel */}
      <div aria-live="polite" className="border-t border-line-subtle bg-section px-5 py-5">
        {stage === "messy" && (
          <p className="type-caption text-fg-muted">
            A roster export the way student-tracking systems hand it over: a title row, advisor
            groups, subtotals, a page footer, and four date and term formats. Press Drop it.
          </p>
        )}

        {stage === "review" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <ul className="flex flex-col gap-2.5">
              <Check ok>Columns in the same order as last year&apos;s APR file</Check>
              <Check ok>Every coded field uses a valid APR option</Check>
              <Check ok>Removed {removed.length} kinds of junk, including 1 duplicate student</Check>
              <Check>1 value needs your answer before saving</Check>
            </ul>
            <div className="flex flex-col gap-4 rounded-lg border border-warning/40 bg-surface p-4">
              <p className="type-body-sm text-fg-soft">
                <span className="font-medium text-fg">Ana Martinez</span> has{" "}
                <span className="type-data rounded-sm bg-surface-strong px-1.5 py-0.5 text-xs">N/A</span>{" "}
                for GPA. She&apos;s a first-term student. In last year&apos;s file, first-term
                students had a blank GPA. Do the same here?
              </p>
              <div className="flex flex-wrap gap-2">
                <ChoiceButton active={gpaChoice === "blank"} onClick={() => setGpaChoice("blank")}>
                  Yes, leave it blank
                </ChoiceButton>
                <ChoiceButton active={gpaChoice === "manual"} onClick={() => setGpaChoice("manual")}>
                  I&apos;ll fill it in myself
                </ChoiceButton>
              </div>
            </div>
          </div>
        )}

        {stage === "ready" && (
          <div className="flex flex-col gap-2">
            <p className="type-body-sm flex items-center gap-2 text-success">
              <CheckIcon />
              Saved {outputFile}. Same columns, same order, same codes as the file the TRIO portal
              accepted last year.
            </p>
            <p className="type-caption text-fg-muted">
              {gpaChoice === "manual"
                ? "Ana Martinez's GPA is highlighted so you can fill it in before uploading."
                : "Ana Martinez's GPA was left blank, like last year's first-term students."}{" "}
              Next year, you only drop the export.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RosterTable() {
  const header = roster.find((r) => r.kind === "header");
  const cols = header && header.kind === "header" ? header.cells.length : 7;

  return (
    <table className="w-full min-w-[680px] border-collapse text-left">
      <tbody>
        {roster.map((row, i) => {
          const base = "type-data border-b border-line-subtle px-3 py-2 text-[13px]";
          switch (row.kind) {
            case "title":
              return (
                <tr key={i} className="animate-row-in">
                  <td colSpan={cols} className={`${base} whitespace-pre font-medium text-fg-soft`}>{row.text}</td>
                </tr>
              );
            case "header":
              return (
                <tr key={i} className="animate-row-in">
                  {row.cells.map((c) => (
                    <td key={c} className={`${base} border-line text-fg-muted underline decoration-line-strong underline-offset-4`}>{c}</td>
                  ))}
                </tr>
              );
            case "group":
              return (
                <tr key={i} className="animate-row-in">
                  <td colSpan={cols} className={`${base} font-medium text-fg-soft`}>{row.text}</td>
                </tr>
              );
            case "subtotal":
            case "footer":
              return (
                <tr key={i} className="animate-row-in">
                  <td colSpan={cols} className={`${base} text-right text-fg-subtle`}>{row.text}</td>
                </tr>
              );
            case "blank":
              return (
                <tr key={i} className="animate-row-in">
                  <td colSpan={cols} className={base}>&nbsp;</td>
                </tr>
              );
            case "data":
              return (
                <tr key={i} className="animate-row-in">
                  {row.cells.map((c, j) => (
                    <td key={j} className={`${base} whitespace-pre text-fg-muted`}>{c}</td>
                  ))}
                </tr>
              );
          }
        })}
      </tbody>
    </table>
  );
}

function AprTable({ gpaChoice }: { gpaChoice: "blank" | "manual" | null }) {
  return (
    <table className="w-full min-w-[760px] border-collapse text-left">
      <thead>
        <tr>
          {aprHeader.map((h) => (
            <th key={h} className="type-data border-b border-line px-3 py-2 text-xs font-medium text-fg">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {aprRows.map((row, r) => (
          <tr key={r} className="animate-row-in">
            {row.cells.map((c, j) => {
              const flagged = row.flaggedCol === j && gpaChoice !== "blank";
              return (
                <td
                  key={j}
                  className={`type-data border-b border-line-subtle px-3 py-2.5 text-[13px] text-fg-soft ${
                    flagged ? "outline-2 -outline-offset-2 outline-warning" : ""
                  }`}
                >
                  {c || (flagged ? <span className="text-warning">?</span> : " ")}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Check({ ok, children }: { ok?: boolean; children: React.ReactNode }) {
  return (
    <li className={`type-body-sm flex items-start gap-2.5 ${ok ? "text-fg-soft" : "text-warning"}`}>
      <span className={`mt-0.5 shrink-0 ${ok ? "text-success" : "text-warning"}`}>
        {ok ? <CheckIcon /> : <AlertIcon />}
      </span>
      {children}
    </li>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`type-body-sm cursor-pointer rounded-pill border px-3.5 py-1.5 transition-colors ${
        active ? "border-brand bg-brand-a10 text-brand" : "border-line text-fg-soft hover:border-line-strong"
      }`}
    >
      {children}
    </button>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-fg-muted">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8v5m0 3.5v.01M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
