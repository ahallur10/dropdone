"use client";

import { useEffect, useState, type DragEvent } from "react";
import { clientServicesSteps, refreshModeLabel, teachSample, type RefreshMode, type Recipe } from "../data";
import { ArrowRightIcon, FileSheetIcon, LockIcon, UploadIcon } from "../icons";
import { btnQuiet, btnSecondary, CheckIcon, ColHead, Donut, Drawer, Label, PageHeader, ProBadge } from "../ui";

/* ---------------- Recipes list ---------------- */

export function RecipesView({
  recipes,
  onChangeMode,
  onDelete,
  onTeach,
}: {
  recipes: Recipe[];
  onChangeMode: (id: string, mode: RefreshMode) => void;
  onDelete: (id: string) => void;
  onTeach: (recipeId?: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = recipes.find((r) => r.id === openId);

  return (
    <>
      <PageHeader
        title="Cleanups"
        actions={
          <button onClick={() => onTeach()} className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm">
            New cleanup
          </button>
        }
      />

      <div className="card overflow-hidden hover:bg-surface">
        <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_90px_150px] gap-6 border-b border-line-subtle px-5 py-3">
          <ColHead>Cleanup</ColHead>
          <ColHead>Learned from</ColHead>
          <ColHead>Steps</ColHead>
          <ColHead className="text-right">Last run</ColHead>
        </div>
        <ul>
          {recipes.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => setOpenId(r.id)}
                className="grid w-full cursor-pointer grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_90px_150px] items-center gap-6 border-b border-line-subtle px-5 py-4 text-left transition-colors hover:bg-surface-hover"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-a10 text-brand">
                    <FileSheetIcon />
                  </span>
                  <div className="min-w-0">
                    <p className="type-label truncate text-[14px] text-fg">{r.name}</p>
                    <p className="type-caption mt-0.5 truncate">
                      {r.workbook} · <span className="text-fg-muted">{r.sheet}</span>
                    </p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="type-data truncate text-xs text-fg-soft">{r.learnedFrom.messy}</p>
                  <p className="type-caption mt-0.5 truncate">and your cleaned version · {r.learnedOn}</p>
                </div>
                <span className="type-data text-sm text-fg-soft">{r.steps.length}</span>
                <span className="type-data text-right text-xs text-fg-muted">{r.lastRun}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <Drawer
          title={open.name}
          subtitle={`${open.folder} › ${open.workbook} · ${open.sheet}`}
          onClose={() => setOpenId(null)}
          footer={
            <>
              <button
                onClick={() => {
                  setOpenId(null);
                  onTeach(open.id);
                }}
                className={btnSecondary}
              >
                Teach it again
              </button>
              <button
                onClick={() => {
                  onDelete(open.id);
                  setOpenId(null);
                }}
                className={`${btnQuiet} text-danger hover:text-danger`}
              >
                Delete cleanup
              </button>
            </>
          }
        >
          <div className="flex flex-col gap-3">
            <Label>Steps, run exactly as written every time</Label>
            <StepList steps={open.steps} />
          </div>

          <div className="flex flex-col gap-3">
            <Label>Updates</Label>
            <div className="grid grid-cols-2 gap-1 rounded-md bg-surface p-1">
              {(["workbook", "sheet"] as RefreshMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => onChangeMode(open.id, m)}
                  className={`type-label flex min-h-8 cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-2 text-[13px] transition-colors ${
                    open.mode === m ? "bg-surface-strong text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {refreshModeLabel[m]}
                </button>
              ))}
            </div>
            <p className="type-caption">
              {open.mode === "workbook"
                ? `Every sheet in ${open.workbook} is rebuilt from the new export.`
                : `Only the ${open.sheet} sheet is replaced. Other sheets, formulas and summary tabs keep working.`}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Version history</Label>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-line bg-surface p-4">
              <div>
                <p className="type-body-sm text-fg-soft">Current version only</p>
                <p className="type-caption mt-0.5">Pro saves every version, with one-click undo.</p>
              </div>
              <ProBadge />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Learned from</Label>
            <p className="type-data text-xs text-fg-soft">
              {open.learnedFrom.messy} → {open.learnedFrom.cleaned}
            </p>
            <p className="type-caption">
              Approved {open.learnedOn} · {open.runs} runs
            </p>
          </div>
        </Drawer>
      )}
    </>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="card divide-y divide-line-subtle overflow-hidden hover:bg-surface">
      {steps.map((s, i) => (
        <li key={s} className="flex gap-3 px-4 py-3">
          <span className="type-data w-5 shrink-0 pt-px text-xs text-brand">{i + 1}</span>
          <span className="type-body-sm text-fg-soft">{s}</span>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Teach a recipe (show it once) ---------------- */

type TeachStep = "files" | "learning" | "review" | "saved";
type Answer = (typeof teachSample.question.options)[number];

const answerRule: Record<Answer, string> = {
  Yes: "Remove rows where Status is Withdrawn or Amount is blank",
  No: "Remove rows where Status is Withdrawn",
  "Not sure": "Remove rows where Status is Withdrawn, and flag rows with a blank Amount for you",
};

export function TeachModal({
  reteach,
  onClose,
  onSave,
}: {
  /** Set when an export changed and the user is teaching an existing recipe again. */
  reteach?: Recipe;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}) {
  const [messy, setMessy] = useState<string | null>(null);
  const [cleaned, setCleaned] = useState<string | null>(reteach ? reteach.workbook : null);
  const [step, setStep] = useState<TeachStep>("files");
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [newId] = useState(() => `recipe-${Date.now()}`);
  const q = teachSample.question;

  useEffect(() => {
    if (step !== "learning") return;
    const t = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 4 + Math.floor(Math.random() * 6));
        if (next >= 100) setStep("review");
        return next;
      });
    }, 110);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // A new recipe uses the spec's sample (with its one question). Re-teaching a recipe whose
  // export changed rebuilds that recipe's own steps; here the date column was renamed.
  const hasQuestion = !reteach;
  const steps = reteach
    ? reteach.steps.map((s) => s.replace("OPEN_DT", "DATE_OPENED"))
    : clientServicesSteps.map((s, i) => (i === q.stepIndex && answer ? answerRule[answer] : s));
  const name = reteach?.name ?? teachSample.recipeName;

  function save() {
    onSave({
      id: reteach?.id ?? newId,
      name,
      workbook: cleaned ?? teachSample.cleaned,
      folder: reteach?.folder ?? "Documents › Reports",
      sheet: reteach?.sheet ?? "Data",
      mode: reteach?.mode ?? "sheet",
      learnedFrom: { messy: messy ?? teachSample.messy, cleaned: cleaned ?? teachSample.cleaned },
      learnedOn: "Today",
      lastRun: "Not run yet",
      runs: reteach?.runs ?? 0,
      steps,
    });
    setStep("saved");
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-page/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Teach a cleanup"
        className="relative flex max-h-[88%] w-[680px] flex-col overflow-hidden rounded-xl border border-line bg-section"
      >
        <div className="flex items-center justify-between border-b border-line-subtle px-6 py-4">
          <div>
            <p className="type-label text-fg">{reteach ? `Teach ${reteach.name} again` : "New cleanup"}</p>
            <p className="type-caption mt-0.5">
              {step === "files" && "Clean one export by hand like you always do. Give Dropdone the before and after."}
              {step === "learning" && "Comparing the before and after."}
              {step === "review" && "Every step in plain English. Approve it, and it runs exactly like this every week."}
              {step === "saved" && "Saved. Next week, drop the new export on its card."}
            </p>
          </div>
          <button onClick={onClose} className={btnQuiet}>
            {step === "saved" ? "Close" : "Cancel"}
          </button>
        </div>

        {step === "files" && (
          <div className="flex flex-col gap-5 px-6 py-6">
            <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
              <DropSlot
                label="1. The messy export"
                hint={reteach ? "This week's export, the one that changed" : "Straight out of your system"}
                value={messy}
                sample={reteach ? "CASE_EXPORT_0316.csv" : teachSample.messy}
                onFile={setMessy}
              />
              <span className="flex items-center text-fg-subtle">
                <ArrowRightIcon />
              </span>
              <DropSlot
                label="2. Your cleaned version"
                hint="Required. The workbook Dropdone will keep updated"
                value={cleaned}
                sample={teachSample.cleaned}
                onFile={setCleaned}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="type-caption flex items-center gap-1.5">
                <LockIcon className="size-3.5" />
                Setup uses AI with your own API key. Weekly runs never use AI.
              </p>
              <button
                disabled={!messy || !cleaned}
                onClick={() => setStep("learning")}
                className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Write the steps
              </button>
            </div>
          </div>
        )}

        {step === "learning" && (
          <div className="flex flex-col items-center gap-4 px-6 py-14">
            <Donut stage="matching" progress={progress} size={56} />
            <p className="type-label text-fg">Comparing the before and after</p>
            <p className="type-caption">
              {progress < 35
                ? "Finding where the real data starts"
                : progress < 70
                  ? "Working out what you removed and renamed"
                  : "Writing each change as a rule, not a row number"}
            </p>
          </div>
        )}

        {step === "review" && (
          <div className="flex min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <ol className="flex flex-col gap-2">
                {steps.map((s, i) => {
                  const isQ = hasQuestion && i === q.stepIndex;
                  return (
                    <li
                      key={i}
                      className={`rounded-lg border ${isQ && !answer ? "border-warning/40" : "border-line-subtle"} bg-surface`}
                    >
                      <div className="flex gap-3 px-4 py-3">
                        <span className="type-data w-5 shrink-0 pt-px text-xs text-brand">{i + 1}</span>
                        <span className="type-body-sm flex-1 text-fg-soft">{s}</span>
                        {isQ && !answer && <span className="type-data shrink-0 text-[11px] text-warning">1 question</span>}
                        {isQ && answer && <CheckIcon className="shrink-0 text-success" />}
                      </div>
                      {isQ && !answer && (
                        <div className="flex flex-col gap-3 border-t border-line-subtle px-4 py-4">
                          <p className="type-body-sm text-fg-soft">
                            {q.intro} <span className="text-fg">{q.ask}</span>
                          </p>
                          <div className="overflow-hidden rounded-md border border-line">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr className="bg-surface-strong">
                                  {q.header.map((h) => (
                                    <th key={h} className="type-data px-2.5 py-1.5 text-[10px] font-medium text-fg-muted">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  {q.row.map((c, j) => (
                                    <td key={j} className={`type-data px-2.5 py-2 text-xs ${c === "(blank)" ? "text-fg-subtle" : "text-fg-soft"}`}>
                                      {c}
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="flex gap-2">
                            {q.options.map((o) => (
                              <button key={o} onClick={() => setAnswer(o)} className={btnSecondary}>
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
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-line-subtle px-6 py-4">
              <p className="type-caption">
                Updates {cleaned} · {reteach?.sheet ?? "Data"} sheet
              </p>
              <button
                disabled={hasQuestion && !answer}
                onClick={save}
                className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Approve cleanup
              </button>
            </div>
          </div>
        )}

        {step === "saved" && (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <Donut stage="done" progress={100} size={48} />
            <p className="type-label text-fg">{name} is ready</p>
            <p className="type-body-sm max-w-[44ch]">
              {steps.length} approved steps. Next week, drop the new export on its card and Dropdone runs them exactly as
              written, then checks the result before saving.
            </p>
            <button onClick={onClose} className="btn-primary mt-2 min-h-9 cursor-pointer px-3.5 text-sm">
              Done
            </button>
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
