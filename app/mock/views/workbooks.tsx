"use client";

import { useEffect, useState, type DragEvent } from "react";
import { refreshModeLabel, type RefreshMode, type Workbook } from "../data";
import { ArrowRightIcon, FileSheetIcon, UploadIcon } from "../icons";
import { btnQuiet, btnSecondary, ColHead, Donut, PageHeader, ProBadge } from "../ui";

export function WorkbooksView({
  workbooks,
  onChangeMode,
  onForget,
  onTeach,
}: {
  workbooks: Workbook[];
  onChangeMode: (id: string, mode: RefreshMode) => void;
  onForget: (id: string) => void;
  onTeach: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = workbooks.find((w) => w.id === openId);

  return (
    <>
      <PageHeader
        title="Workbooks"
        actions={
          <button onClick={onTeach} className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm">
            Teach a workbook
          </button>
        }
      />

      <div className="card overflow-hidden hover:bg-surface">
        <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_140px_150px] gap-6 border-b border-line-subtle px-5 py-3">
          <ColHead>Workbook</ColHead>
          <ColHead>Learned from</ColHead>
          <ColHead>Refresh</ColHead>
          <ColHead className="text-right">Last update</ColHead>
        </div>
        <ul>
          {workbooks.map((w) => (
            <li key={w.id}>
              <button
                onClick={() => setOpenId(w.id)}
                className={`grid w-full cursor-pointer grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_140px_150px] items-center gap-6 border-b border-line-subtle px-5 py-4 text-left transition-colors hover:bg-surface-hover ${
                  openId === w.id ? "bg-surface-hover" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-a10 text-brand">
                    <FileSheetIcon />
                  </span>
                  <div className="min-w-0">
                    <p className="type-label truncate text-[14px] text-fg">{w.name}</p>
                    <p className="type-caption mt-0.5 truncate">
                      {w.folder} · <span className="text-fg-muted">{w.sheet}</span>
                    </p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="type-data truncate text-xs text-fg-soft">{w.learnedFrom}</p>
                  <p className="type-caption mt-0.5">
                    {w.learnedOn} · {w.columns.length} columns · {w.runs} runs
                  </p>
                </div>
                <span className="type-body-sm text-fg-soft">{refreshModeLabel[w.mode]}</span>
                <span
                  className={`type-data text-right text-xs ${
                    w.lastUpdate === "Waiting on you" ? "text-warning" : "text-fg-muted"
                  }`}
                >
                  {w.lastUpdate}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <WorkbookDrawer
          workbook={open}
          onClose={() => setOpenId(null)}
          onChangeMode={(m) => onChangeMode(open.id, m)}
          onForget={() => {
            onForget(open.id);
            setOpenId(null);
          }}
        />
      )}
    </>
  );
}

function WorkbookDrawer({
  workbook: w,
  onClose,
  onChangeMode,
  onForget,
}: {
  workbook: Workbook;
  onClose: () => void;
  onChangeMode: (m: RefreshMode) => void;
  onForget: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-30 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-page/60" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-[500px] flex-col border-l border-line bg-section"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line-subtle px-6 py-5">
          <div className="min-w-0">
            <p className="type-label truncate text-fg">{w.name}</p>
            <p className="type-caption mt-1 truncate">
              {w.folder} · {w.sheet}
            </p>
          </div>
          <button onClick={onClose} className={btnQuiet} aria-label="Close">
            Close
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-3">
            <p className="type-data text-[11px] uppercase tracking-[0.08em] text-fg-subtle">Refresh</p>
            <div className="grid grid-cols-3 gap-1 rounded-md bg-surface p-1">
              {(["workbook", "sheet", "adjusted"] as RefreshMode[]).map((m) => {
                const locked = m === "adjusted";
                return (
                  <button
                    key={m}
                    disabled={locked}
                    onClick={() => onChangeMode(m)}
                    className={`type-label flex min-h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-2 text-[13px] transition-colors ${
                      w.mode === m ? "bg-surface-strong text-fg" : "text-fg-muted hover:text-fg"
                    } ${locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  >
                    {refreshModeLabel[m]}
                    {locked && <ProBadge />}
                  </button>
                );
              })}
            </div>
            <p className="type-caption">
              {w.mode === "workbook"
                ? "Every sheet is rebuilt from the new export."
                : "Only the " + w.sheet + " sheet is replaced. Other sheets and formulas are left alone."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-data text-[11px] uppercase tracking-[0.08em] text-fg-subtle">Column map</p>
            <ul className="card divide-y divide-line-subtle hover:bg-surface">
              {w.columns.map(([from, to]) => (
                <li key={from} className="grid grid-cols-[1fr_20px_1.2fr] items-center gap-3 px-4 py-2.5">
                  <span className="type-data truncate text-xs text-fg-muted">{from}</span>
                  <ArrowRightIcon className="size-4 text-fg-subtle" />
                  <span className="type-body-sm truncate text-fg-soft">{to}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="type-data text-[11px] uppercase tracking-[0.08em] text-fg-subtle">Cleanup it learned</p>
            <ul className="flex flex-col gap-2.5">
              {w.cleanups.map((c) => (
                <li key={c} className="type-body-sm flex gap-2.5 text-fg-soft">
                  <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-[1px] bg-brand" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="type-data text-[11px] uppercase tracking-[0.08em] text-fg-subtle">Learned from</p>
            <p className="type-data text-xs text-fg-soft">{w.learnedFrom}</p>
            <p className="type-caption">
              Taught {w.learnedOn} · watching {w.watch} · {w.runs} runs
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line-subtle px-6 py-4">
          <button className={btnSecondary}>Show in Finder</button>
          <button onClick={onForget} className={`${btnQuiet} text-danger hover:text-danger`}>
            Forget workbook
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- Teach a workbook (show it once) ---------------- */

type TeachStep = "files" | "learning" | "learned";

export function TeachModal({ onClose, onSave }: { onClose: () => void; onSave: (w: Workbook) => void }) {
  const [exportName, setExportName] = useState<string | null>(null);
  const [workbookName, setWorkbookName] = useState<string | null>(null);
  const [step, setStep] = useState<TeachStep>("files");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step !== "learning") return;
    const t = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 4 + Math.floor(Math.random() * 6));
        if (next >= 100) setStep("learned");
        return next;
      });
    }, 120);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const name = workbookName ?? "Grant Monthly Report.xlsx";

  function save() {
    onSave({
      id: `wb-${Date.now()}`,
      name,
      folder: "Documents › Reports",
      sheet: "Data",
      learnedFrom: exportName ?? "program_export_sep.csv",
      learnedOn: "Today",
      mode: "sheet",
      lastUpdate: "Not run yet",
      runs: 0,
      watch: "Downloads",
      columns: [
        ["PARTICIPANT", "Participant"],
        ["SVC_DT", "Service date"],
        ["SVC_CD", "Service"],
        ["UNITS", "Hours"],
      ],
      cleanups: ["Drop the report header block", "Drop subtotal rows", "One date format: MM/DD/YYYY"],
    });
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-page/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Teach a workbook"
        className="relative flex w-[620px] flex-col overflow-hidden rounded-xl border border-line bg-section"
      >
        <div className="flex items-center justify-between border-b border-line-subtle px-6 py-4">
          <div>
            <p className="type-label text-fg">Teach a workbook</p>
            <p className="type-caption mt-0.5">Show Dropdone one messy export and the workbook you made from it.</p>
          </div>
          <button onClick={onClose} className={btnQuiet}>
            Cancel
          </button>
        </div>

        {step === "files" && (
          <div className="flex flex-col gap-5 px-6 py-6">
            <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
              <DropSlot
                label="1. A messy export"
                hint="The file straight out of your system"
                value={exportName}
                sample="program_export_sep.csv"
                onFile={setExportName}
              />
              <span className="flex items-center text-fg-subtle">
                <ArrowRightIcon />
              </span>
              <DropSlot
                label="2. The workbook you made"
                hint="The finished version you cleaned by hand"
                value={workbookName}
                sample="Grant Monthly Report.xlsx"
                onFile={setWorkbookName}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="type-caption">Both files stay on this Mac. Click a box to use a sample file.</p>
              <button
                disabled={!exportName || !workbookName}
                onClick={() => setStep("learning")}
                className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Learn it
              </button>
            </div>
          </div>
        )}

        {step === "learning" && (
          <div className="flex flex-col items-center gap-4 px-6 py-12">
            <Donut stage="matching" progress={progress} size={56} />
            <p className="type-label text-fg">Comparing the two files</p>
            <p className="type-caption">
              {progress < 40 ? "Reading the export" : progress < 75 ? "Matching columns to your workbook" : "Working out the cleanup"}
            </p>
          </div>
        )}

        {step === "learned" && (
          <div className="flex flex-col gap-5 px-6 py-6">
            <div className="flex items-center gap-3">
              <Donut stage="done" progress={100} size={36} />
              <div>
                <p className="type-label text-fg">Learned {name}</p>
                <p className="type-caption mt-0.5">4 columns, 3 cleanup rules. Check them before saving.</p>
              </div>
            </div>
            <ul className="card divide-y divide-line-subtle hover:bg-surface">
              {[
                ["PARTICIPANT", "Participant"],
                ["SVC_DT", "Service date"],
                ["SVC_CD", "Service"],
                ["UNITS", "Hours"],
              ].map(([from, to]) => (
                <li key={from} className="grid grid-cols-[1fr_20px_1.2fr] items-center gap-3 px-4 py-2.5">
                  <span className="type-data truncate text-xs text-fg-muted">{from}</span>
                  <ArrowRightIcon className="size-4 text-fg-subtle" />
                  <span className="type-body-sm text-fg-soft">{to}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-4">
              <p className="type-caption">New exports in Downloads that look like this will update it.</p>
              <button onClick={save} className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm">
                Save workbook
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DropSlot({
  label,
  hint,
  value,
  sample,
  onFile,
}: {
  label: string;
  hint: string;
  value: string | null;
  sample: string;
  onFile: (name: string) => void;
}) {
  const [over, setOver] = useState(false);

  function onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f.name);
  }

  return (
    <button
      type="button"
      onClick={() => onFile(sample)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-center transition-colors ${
        value ? "border-brand/60 bg-brand-a10" : over ? "border-brand bg-brand-a10" : "border-line-strong hover:border-fg-subtle"
      }`}
    >
      {value ? (
        <>
          <FileSheetIcon className="text-brand" />
          <span className="type-data max-w-full truncate text-xs text-fg">{value}</span>
          <span className="type-caption">{label}</span>
        </>
      ) : (
        <>
          <UploadIcon className="text-fg-subtle" />
          <span className="type-label text-sm text-fg">{label}</span>
          <span className="type-caption">{hint}</span>
        </>
      )}
    </button>
  );
}
