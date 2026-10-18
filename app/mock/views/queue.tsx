"use client";

import type { Recipe, StagedItem } from "../data";
import { btnQuiet, ColHead, EmptyState, FileCell, PageHeader, StatusCell, TargetCell } from "../ui";

// The run line: every export that hasn't finished yet, in the order it will run.
export function QueueView({
  items,
  recipes,
  onToggleHold,
  onRemove,
  onTop,
  onOpenHome,
  onClearDone,
  doneCount,
}: {
  items: StagedItem[];
  recipes: Recipe[];
  onToggleHold: (id: string) => void;
  onRemove: (id: string) => void;
  onTop: (id: string) => void;
  onOpenHome: () => void;
  onClearDone: () => void;
  doneCount: number;
}) {
  const active = items.filter((i) => i.stage !== "done");
  const recipeOf = (id: string) => recipes.find((r) => r.id === id);

  return (
    <>
      <PageHeader
        title="My queue"
        actions={
          doneCount > 0 && (
            <button onClick={onClearDone} className={btnQuiet}>
              Clear {doneCount} finished
            </button>
          )
        }
      />

      <div className="card overflow-hidden hover:bg-surface">
        <div className="grid grid-cols-[32px_minmax(0,1.2fr)_minmax(0,1fr)_240px_150px] gap-5 border-b border-line-subtle px-5 py-3">
          <ColHead>#</ColHead>
          <ColHead>Export</ColHead>
          <ColHead>Cleanup</ColHead>
          <ColHead className="text-right">Status</ColHead>
          <ColHead className="text-right">Actions</ColHead>
        </div>
        {active.length === 0 ? (
          <EmptyState>Your queue is empty. Drop an export on a cleanup to run it.</EmptyState>
        ) : (
          <ol>
            {active.map((it, i) => {
              const r = recipeOf(it.recipeId);
              const needsYou = it.stage === "review" || it.stage === "stopped";
              return (
                <li
                  key={it.id}
                  className="grid grid-cols-[32px_minmax(0,1.2fr)_minmax(0,1fr)_240px_150px] items-center gap-5 border-b border-line-subtle px-5 py-4 transition-colors last:border-0 hover:bg-surface-hover"
                >
                  <span className="type-data text-sm text-fg-subtle">{i + 1}</span>
                  <FileCell name={it.file} sub={it.folder} meta={it.meta} />
                  <TargetCell name={r?.name ?? ""} sub={r?.workbook ?? ""} detail={r?.sheet} />
                  <StatusCell item={it} />
                  <div className="flex justify-end gap-1">
                    {needsYou ? (
                      <button onClick={onOpenHome} className={`${btnQuiet} text-warning hover:text-warning`}>
                        Open
                      </button>
                    ) : (
                      <button onClick={() => onToggleHold(it.id)} className={btnQuiet}>
                        {it.stage === "held" ? "Resume" : "Pause"}
                      </button>
                    )}
                    {i > 0 && (
                      <button onClick={() => onTop(it.id)} className={btnQuiet} title="Move to top">
                        Top
                      </button>
                    )}
                    <button onClick={() => onRemove(it.id)} className={btnQuiet} title="Remove from queue">
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </>
  );
}
