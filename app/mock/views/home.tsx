"use client";

import { useState, type DragEvent } from "react";
import { runSummaries, stoppedReason, warning, type Recipe, type StagedItem } from "../data";
import { FileSheetIcon, UploadIcon } from "../icons";
import {
  btnQuiet,
  btnSecondary,
  CheckIcon,
  ColHead,
  Donut,
  Drawer,
  EmptyState,
  FileCell,
  Label,
  ProBadge,
  StatusCell,
  Tabs,
  TargetCell,
} from "../ui";

type Filter = "all" | "progress" | "review" | "done";

export function HomeView({
  items,
  recipes,
  onRun,
  onLooksRight,
  onDiscard,
  onReteach,
}: {
  items: StagedItem[];
  recipes: Recipe[];
  onRun: (recipeId: string, fileName?: string) => void;
  onLooksRight: () => void;
  onDiscard: () => void;
  onReteach: (recipeId: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [summaryId, setSummaryId] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const needsYou = (i: StagedItem) => i.stage === "review" || i.stage === "stopped";
  const isProgress = (i: StagedItem) => i.stage !== "done" && !needsYou(i);
  const counts = {
    all: items.length,
    progress: items.filter(isProgress).length,
    review: items.filter(needsYou).length,
    done: items.filter((i) => i.stage === "done").length,
  };
  const visible = items.filter((i) =>
    filter === "all" ? true : filter === "progress" ? isProgress(i) : filter === "review" ? needsYou(i) : i.stage === "done",
  );
  const recipeOf = (id: string) => recipes.find((r) => r.id === id);
  const warned = items.find((i) => i.id === warning.itemId && i.stage === "review");
  const stopped = items.find((i) => i.id === stoppedReason.itemId && i.stage === "stopped");
  const summaryItem = items.find((i) => i.id === summaryId);

  return (
    <>
      {/* Recipe cards: drop next week's export onto the one it belongs to */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <Label>Your cleanups · drop an export on one to run it</Label>
        </div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} onRun={onRun} />
          ))}
        </div>
      </section>

      {warned && (
        <Banner
          tone="warning"
          donut={<Donut stage="review" progress={warned.progress} size={32} />}
          title={warning.title}
          body={
            <>
              {warning.body} <span className="type-data text-xs text-fg-subtle">{warned.file}</span>
            </>
          }
          actions={
            <>
              <button onClick={() => setReviewOpen(true)} className={btnSecondary}>
                Review rows
              </button>
              <button onClick={onLooksRight} className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm">
                Looks right
              </button>
            </>
          }
        />
      )}

      {stopped && (
        <Banner
          tone="danger"
          donut={<Donut stage="stopped" progress={stopped.progress} size={32} />}
          title={stoppedReason.title}
          body={stoppedReason.body}
          actions={
            <>
              <button disabled className={`${btnSecondary} gap-2`} title="Pro suggests the fix for you to approve">
                Propose a fix <ProBadge />
              </button>
              <button onClick={() => onReteach(stopped.recipeId)} className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm">
                Teach it again
              </button>
            </>
          }
        />
      )}

      <Tabs
        value={filter}
        onChange={setFilter}
        tabs={[
          { key: "all", label: "All runs", count: counts.all },
          { key: "progress", label: "In progress", count: counts.progress },
          { key: "review", label: "Needs you", count: counts.review, alert: true },
          { key: "done", label: "Done", count: counts.done },
        ]}
      />

      <div className="card overflow-hidden hover:bg-surface">
        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_240px] gap-6 border-b border-line-subtle px-5 py-3">
          <ColHead>Export</ColHead>
          <ColHead>Cleanup</ColHead>
          <ColHead className="text-right">Status</ColHead>
        </div>
        {visible.length === 0 ? (
          <EmptyState>Nothing here right now.</EmptyState>
        ) : (
          <ul>
            {visible.map((it) => {
              const r = recipeOf(it.recipeId);
              const clickable = it.stage === "done" || it.stage === "review";
              return (
                <li key={it.id}>
                  <button
                    disabled={!clickable}
                    onClick={() => (it.stage === "review" ? setReviewOpen(true) : setSummaryId(it.id))}
                    className={`grid w-full grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_240px] items-center gap-6 border-b border-line-subtle px-5 py-4 text-left transition-colors last:border-0 ${
                      clickable ? "cursor-pointer hover:bg-surface-hover" : "cursor-default"
                    }`}
                  >
                    <FileCell name={it.file} sub={it.folder} meta={it.meta} />
                    <TargetCell name={r?.name ?? ""} sub={r?.workbook ?? ""} detail={r?.sheet} />
                    <StatusCell item={it} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {summaryItem && (
        <RunSummaryDrawer item={summaryItem} recipe={recipeOf(summaryItem.recipeId)} onClose={() => setSummaryId(null)} />
      )}

      {reviewOpen && warned && (
        <Drawer
          title="Review the removed rows"
          subtitle={`${warned.file} · Weekly Client Services Report`}
          onClose={() => setReviewOpen(false)}
          footer={
            <>
              <button
                onClick={() => {
                  onDiscard();
                  setReviewOpen(false);
                }}
                className={`${btnQuiet} text-danger hover:text-danger`}
              >
                Don&apos;t save this run
              </button>
              <button
                onClick={() => {
                  onLooksRight();
                  setReviewOpen(false);
                }}
                className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm"
              >
                Looks right, save
              </button>
            </>
          }
        >
          <div className="flex flex-col gap-2 rounded-lg border border-warning/40 bg-surface p-4">
            <p className="type-label text-fg">{warning.title}</p>
            <p className="type-body-sm">Step 8 removes rows where Status is Withdrawn. This week it would remove far more rows than usual.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Rows step 8 would remove</Label>
            <div className="card overflow-hidden hover:bg-surface">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    {warning.header.map((h) => (
                      <th key={h} className="type-data px-3 py-2 text-[11px] font-medium text-fg-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {warning.rows.map((row) => (
                    <tr key={row[0]} className="border-b border-line-subtle last:border-0">
                      {row.map((c, j) => (
                        <td key={j} className="type-data px-3 py-2 text-xs text-fg-soft">
                          {c || <span className="text-fg-subtle">(blank)</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="type-caption">and {warning.more} more</p>
          </div>
        </Drawer>
      )}
    </>
  );
}

function RecipeCard({ recipe, onRun }: { recipe: Recipe; onRun: (recipeId: string, fileName?: string) => void }) {
  const [over, setOver] = useState(false);

  function onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    const f = e.dataTransfer.files[0];
    onRun(recipe.id, f?.name);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={`group relative flex flex-col gap-3 rounded-lg border p-4 transition-colors ${
        over ? "border-brand bg-brand-a10" : "border-line bg-surface hover:border-line-strong"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${over ? "bg-brand text-fg-inverse" : "bg-brand-a10 text-brand"}`}>
          {over ? <UploadIcon /> : <FileSheetIcon />}
        </span>
        <div className="min-w-0">
          <p className="type-label truncate text-[14px] text-fg">{recipe.name}</p>
          <p className="type-caption mt-0.5 truncate">
            {recipe.workbook} · {recipe.steps.length} steps
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="type-data text-[11px] text-fg-subtle">{over ? "Drop to run" : `Last run ${recipe.lastRun}`}</span>
        <button onClick={() => onRun(recipe.id)} className={`${btnQuiet} min-h-7 px-2 text-[12px]`}>
          Run
        </button>
      </div>
    </div>
  );
}

function Banner({
  tone,
  donut,
  title,
  body,
  actions,
}: {
  tone: "warning" | "danger";
  donut: React.ReactNode;
  title: string;
  body: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-surface px-5 py-4 ${
        tone === "warning" ? "border-warning/40" : "border-danger/40"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {donut}
        <div className="min-w-0">
          <p className="type-label text-fg">{title}</p>
          <p className="type-body-sm mt-0.5 max-w-[70ch]">{body}</p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">{actions}</div>
    </div>
  );
}

export function RunSummaryDrawer({
  item,
  recipe,
  onClose,
}: {
  item: StagedItem;
  recipe?: Recipe;
  onClose: () => void;
}) {
  const s = runSummaries[item.recipeId] ?? {
    duration: "3 seconds",
    rowsIn: item.meta,
    rowsOut: "",
    lines: (recipe?.steps ?? []).map((step) => `Ran: ${step}`),
    saved: `Updated ${recipe?.workbook}.`,
  };
  return (
    <Drawer title={recipe?.name ?? "Run summary"} subtitle={`${item.file} · ran in ${s.duration}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="type-h4">{s.rowsIn.split(" ")[0]}</p>
          <p className="type-caption mt-1">{s.rowsIn.split(" ").slice(1).join(" ")}</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="type-h4">{s.rowsOut.split(" ")[0]}</p>
          <p className="type-caption mt-1">{s.rowsOut.split(" ").slice(1).join(" ")}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Label>What it did</Label>
        <ul className="flex flex-col gap-2.5">
          {s.lines.map((l) => (
            <li key={l} className="type-body-sm flex gap-2.5 text-fg-soft">
              <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-[1px] bg-brand" />
              {l}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4">
        <p className="type-body-sm flex items-center gap-2 text-success">
          <CheckIcon />
          Checked against your workbook: columns, order, and value types match.
        </p>
        <p className="type-body-sm text-fg-soft">{s.saved}</p>
      </div>
    </Drawer>
  );
}
