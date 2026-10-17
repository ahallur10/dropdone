"use client";

import { useState } from "react";

type Sample = {
  id: string;
  tab: string;
  exportFile: string;
  workbook: string;
  messyHeader: string[];
  messy: string[][];
  cleanHeader: string[];
  clean: string[][];
  summary: string[];
};

const samples: Sample[] = [
  {
    id: "gov",
    tab: "County government",
    exportFile: "CASE_EXPORT_20261012.csv",
    workbook: "Weekly Caseload.xlsx",
    messyHeader: ["CASE_ID", "CLIENT NM", "OPEN_DT", "PROGRAM", "WORKER"],
    messy: [
      ["  00412", "SMITH, JOHN ", "10/3/26", "snap ", "r.alvarez"],
      ["00413", "garcia, maria", "2026-10-04", "SNAP", "R.ALVAREZ"],
      ["", "", "", "", ""],
      ["*** PAGE 2 ***", "", "", "", ""],
      ["00415", "LEE,  DANA", "Oct 6 2026", "liheap", "k.nguyen"],
      ["00416", "Patel, Ravi", "10/07/2026", "Snap", "K.Nguyen"],
    ],
    cleanHeader: ["Case ID", "Client", "Opened", "Program", "Caseworker"],
    clean: [
      ["412", "John Smith", "10/03/2026", "SNAP", "R. Alvarez"],
      ["413", "Maria Garcia", "10/04/2026", "SNAP", "R. Alvarez"],
      ["415", "Dana Lee", "10/06/2026", "LIHEAP", "K. Nguyen"],
      ["416", "Ravi Patel", "10/07/2026", "SNAP", "K. Nguyen"],
    ],
    summary: ["2 junk rows removed", "3 date formats fixed", "Names flipped to First Last"],
  },
  {
    id: "edu",
    tab: "Nonprofit and higher ed",
    exportFile: "trio_roster_export (3).xlsx",
    workbook: "TRIO Annual Performance Report.xlsx",
    messyHeader: ["Student ID", "Name", "First Gen?", "Pell", "Advising Date", "Hrs"],
    messy: [
      ["1203345", "MARTINEZ, ANA", "Y", "yes", "9/30", "1.5 hrs"],
      ["1203346", "nguyen, tam", "N", "No", "10/1", "45 min"],
      ["1203345", "MARTINEZ, ANA", "Y", "yes", "9/30", "1.5 hrs"],
      ["", "", "", "", "", ""],
      ["1203348", "Okafor,Chidi", "y", "YES", "10-02", "2"],
    ],
    cleanHeader: ["Student ID", "Student", "First-gen", "Pell eligible", "Advised on", "Hours"],
    clean: [
      ["1203345", "Ana Martinez", "Yes", "Yes", "09/30/2026", "1.50"],
      ["1203346", "Tam Nguyen", "No", "No", "10/01/2026", "0.75"],
      ["1203348", "Chidi Okafor", "Yes", "Yes", "10/02/2026", "2.00"],
    ],
    summary: ["1 duplicate student removed", "Hours converted to decimals", "Yes/No made consistent"],
  },
  {
    id: "bank",
    tab: "Community banking",
    exportFile: "CORE_GL_DUMP_101126.txt",
    workbook: "Daily Deposit Recon.xlsx",
    messyHeader: ["ACCT", "DESC", "DR", "CR", "POST DATE"],
    messy: [
      ["0001-4410", "CHECKING - RETAIL ", "1,204.50", "", "20261009"],
      ["0001-4410", "checking - retail", "", "(310.00)", "20261009"],
      ["** SUBTOTAL **", "", "1,204.50", "(310.00)", ""],
      ["0002-1180", "SAVINGS", "12500", "", "20261010"],
      ["0003-0021", "Money Mkt", "", "75", "20261010"],
    ],
    cleanHeader: ["Account", "Description", "Debit", "Credit", "Posted"],
    clean: [
      ["0001-4410", "Checking, Retail", "1,204.50", "", "10/09/2026"],
      ["0001-4410", "Checking, Retail", "", "310.00", "10/09/2026"],
      ["0002-1180", "Savings", "12,500.00", "", "10/10/2026"],
      ["0003-0021", "Money Market", "", "75.00", "10/10/2026"],
    ],
    summary: ["Subtotal row dropped", "Amounts formatted to cents", "Raw dates made readable"],
  },
];

export function CleanDemo() {
  const [activeId, setActiveId] = useState(samples[0].id);
  const [cleaned, setCleaned] = useState(false);
  const sample = samples.find((s) => s.id === activeId) ?? samples[0];

  const header = cleaned ? sample.cleanHeader : sample.messyHeader;
  const rows = cleaned ? sample.clean : sample.messy;

  return (
    <div className="card overflow-hidden hover:bg-surface">
      {/* Industry tabs */}
      <div
        role="tablist"
        aria-label="Sample exports"
        className="flex gap-1 overflow-x-auto border-b border-line-subtle p-2"
      >
        {samples.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={active}
              onClick={() => {
                setActiveId(s.id);
                setCleaned(false);
              }}
              className={`type-label shrink-0 cursor-pointer rounded-md px-3.5 py-2.5 transition-colors ${
                active
                  ? "bg-surface-strong text-fg"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {s.tab}
            </button>
          );
        })}
      </div>

      {/* File bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <FileIcon />
          <span className="type-data truncate text-fg-soft">
            {cleaned ? sample.workbook : sample.exportFile}
          </span>
          <span
            className={`badge ${
              cleaned ? "badge-lime" : "bg-surface-strong text-fg-soft"
            }`}
          >
            {cleaned ? "Updated" : "Messy export"}
          </span>
        </div>
        {cleaned ? (
          <button
            onClick={() => setCleaned(false)}
            className="btn-primary cursor-pointer"
          >
            Reset
          </button>
        ) : (
          <button
            onClick={() => setCleaned(true)}
            className="btn-brand cursor-pointer"
          >
            Drop it
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-5 pb-5 pt-4">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr>
              {header.map((h, i) => (
                <th
                  key={i}
                  className={`type-data border-b border-line px-3 py-2 text-xs ${
                    cleaned ? "font-medium text-fg" : "text-fg-muted"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={`${sample.id}-${cleaned}-${r}`} className="animate-row-in">
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={`type-data whitespace-pre border-b border-line-subtle px-3 py-2.5 ${
                      cleaned ? "text-fg-soft" : "text-fg-muted"
                    }`}
                  >
                    {cell || " "}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt line */}
      <div
        aria-live="polite"
        className="flex min-h-14 flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-subtle bg-section px-5 py-3"
      >
        {cleaned ? (
          <>
            <span className="type-body-sm flex items-center gap-2 text-success">
              <CheckIcon />
              Matches the shape of {sample.workbook}
            </span>
            {sample.summary.map((s) => (
              <span key={s} className="type-caption text-fg-muted">
                {s}
              </span>
            ))}
          </>
        ) : (
          <span className="type-caption text-fg-muted">
            This is what comes out of the legacy system. Press Drop it to see
            what Dropdone writes into your workbook.
          </span>
        )}
      </div>
    </div>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-fg-muted">
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
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
