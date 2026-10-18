// Excel-looking sheets for step 1: the messy export (a legacy PDF converted to Excel) and the
// cleaned version made by hand. Built in HTML so they stay sharp. The mess should look
// accidental, so there are no highlights or annotations beyond what Excel itself shows.

import { cleanHeader, cleanRows, exportFile, messyHeaderRows, messyRows, workbookFile } from "./sample";

// Calibri where available (Excel's default), with close fallbacks.
const EXCEL_FONT = 'Calibri, Carlito, "Segoe UI", Arial, sans-serif';

// B, D and G are empty spacer columns left by the PDF; E is too narrow for "Withdrawn".
const COLS = [56, 14, 100, 14, 50, 62, 14, 66, 150];
const LETTERS = "ABCDEFGHI".split("");
const ROW_H = 21;

export function MessySheet() {
  return (
    <ExcelFrame file={exportFile} cellRef="C5" formula="  Smith, JOHN " tabs={["Table 1", "Table 2"]}>
      <div className="flex">
        <Corner />
        {LETTERS.map((l, c) => (
          <ColLetter key={l} letter={l} width={COLS[c]} />
        ))}
      </div>
      {messyRows.map((row, r) => {
        const rowNo = r + 1;
        const bold = messyHeaderRows.includes(rowNo);
        return (
          <div key={r} className="flex">
            <RowNumber n={rowNo} />
            {row.length === 1 ? (
              // Row 1: merged A1:I1, bold, centered
              <Cell width={COLS.reduce((a, b) => a + b, 0)}>
                <span className="absolute inset-0 flex items-center justify-center font-bold">{row[0]}</span>
              </Cell>
            ) : (
              row.map((cell, c) => {
                // Text spills into empty cells on its right, like Excel, and is cut off when the next cell has data.
                let spill = COLS[c];
                for (let k = c + 1; k < row.length && cell && !row[k]; k++) spill += COLS[k];
                const amountAsText = cell.startsWith("$");
                const selected = rowNo === 5 && c === 2;
                return (
                  <Cell key={c} width={COLS[c]} selected={selected}>
                    {cell && (
                      <span
                        className={`absolute inset-y-0 left-0 z-[1] flex items-center overflow-hidden whitespace-pre px-1 ${bold ? "font-bold" : ""}`}
                        style={{ width: spill }}
                      >
                        {cell}
                      </span>
                    )}
                    {amountAsText && (
                      // Excel's "number stored as text" marker
                      <span className="absolute left-0 top-0 z-[2] size-0 border-r-[6px] border-t-[6px] border-r-transparent border-t-success" />
                    )}
                  </Cell>
                );
              })
            )}
          </div>
        );
      })}
    </ExcelFrame>
  );
}

const CLEAN_COLS = [64, 96, 58, 88, 60];

export function CleanSheet() {
  return (
    <ExcelFrame file={workbookFile} cellRef="A1" formula="Client ID" tabs={["Data", "Summary"]}>
      <div className="flex">
        <Corner />
        {CLEAN_COLS.map((w, c) => (
          <ColLetter key={c} letter={LETTERS[c]} width={w} />
        ))}
      </div>
      <div className="flex">
        <RowNumber n={1} />
        {cleanHeader.map((h, c) => (
          <Cell key={h} width={CLEAN_COLS[c]}>
            <span className="absolute inset-0 flex items-center px-1 font-bold">{h}</span>
          </Cell>
        ))}
      </div>
      {cleanRows.map((row, r) => (
        <div key={r} className="flex">
          <RowNumber n={r + 2} />
          {row.map((cell, c) => {
            // Real numbers and dates sit on the right, like Excel does.
            const right = c === 0 || c === 3 || c === 4;
            return (
              <Cell key={c} width={CLEAN_COLS[c]}>
                <span className={`absolute inset-0 flex items-center px-1 tabular-nums ${right ? "justify-end" : ""}`}>{cell}</span>
              </Cell>
            );
          })}
        </div>
      ))}
      {Array.from({ length: 11 }).map((_, r) => (
        <div key={`e${r}`} className="flex">
          <RowNumber n={r + 5} />
          {CLEAN_COLS.map((w, c) => (
            <Cell key={c} width={w} />
          ))}
        </div>
      ))}
    </ExcelFrame>
  );
}

/* ---------- Excel chrome ---------- */

function ExcelFrame({
  file,
  cellRef,
  formula,
  tabs,
  children,
}: {
  file: string;
  cellRef: string;
  formula: string;
  tabs: string[];
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex w-max flex-col overflow-hidden rounded-md border border-line-strong bg-fg text-[13px] text-fg-inverse"
      style={{ fontFamily: EXCEL_FONT }}
    >
      <div className="flex items-center gap-2 border-b border-fg-inverse/10 bg-fg-inverse/[0.04] px-3 py-1.5">
        <span className="rounded-[3px] bg-fg-inverse/75 px-1.5 py-px text-[10px] font-semibold text-fg">XLSX</span>
        <span className="text-[12px] text-fg-inverse/70">{file}</span>
      </div>
      {/* Formula bar: the leading spaces in C5 stay visible */}
      <div className="flex items-center gap-2 border-b border-fg-inverse/10 px-2 py-1 text-[12px]">
        <span className="w-10 rounded-[3px] border border-fg-inverse/15 py-px text-center text-fg-inverse/70">{cellRef}</span>
        <span className="italic text-fg-inverse/40">fx</span>
        <span className="whitespace-pre bg-fg-inverse/[0.04] px-1">{formula}</span>
      </div>
      <div>{children}</div>
      <div className="flex border-t border-fg-inverse/10 bg-fg-inverse/[0.04] px-2">
        {tabs.map((t, i) => (
          <span
            key={t}
            className={`px-3 py-1 text-[11.5px] ${i === 0 ? "border-b-2 border-success bg-fg font-semibold" : "text-fg-inverse/60"}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Corner() {
  return <span className="w-8 shrink-0 border-b border-r border-fg-inverse/10 bg-fg-inverse/[0.04]" style={{ height: 18 }} />;
}

function ColLetter({ letter, width }: { letter: string; width: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center border-b border-r border-fg-inverse/10 bg-fg-inverse/[0.04] text-[11px] text-fg-inverse/55"
      style={{ width, height: 18 }}
    >
      {letter}
    </span>
  );
}

function RowNumber({ n }: { n: number }) {
  return (
    <span
      className="flex w-8 shrink-0 items-center justify-center border-b border-r border-fg-inverse/10 bg-fg-inverse/[0.04] text-[11px] text-fg-inverse/55"
      style={{ height: ROW_H }}
    >
      {n}
    </span>
  );
}

function Cell({ width, selected, children }: { width: number; selected?: boolean; children?: React.ReactNode }) {
  return (
    <span
      className={`relative shrink-0 border-b border-r border-fg-inverse/10 ${selected ? "z-10 outline outline-2 -outline-offset-1 outline-success" : ""}`}
      style={{ width, height: ROW_H }}
    >
      {children}
    </span>
  );
}
