"use client";

import type { StagedItem } from "../data";
import { btnQuiet, ColHead, EmptyState, FileCell, PageHeader, StatusCell, TargetCell } from "../ui";

// The processing line: everything not finished yet, in the order it will run.
export function QueueView({
  items,
  onToggleHold,
  onRemove,
  onTop,
  onAnswer,
  onClearDone,
  doneCount,
}: {
  items: StagedItem[];
  onToggleHold: (id: string) => void;
  onRemove: (id: string) => void;
  onTop: (id: string) => void;
  onAnswer: () => void;
  onClearDone: () => void;
  doneCount: number;
}) {
  const active = items.filter((i) => i.stage !== "done");
  const holdable = (i: StagedItem) => i.stage !== "review";

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
          <ColHead>File</ColHead>
          <ColHead>Updating</ColHead>
          <ColHead className="text-right">Status</ColHead>
          <ColHead className="text-right">Actions</ColHead>
        </div>
        {active.length === 0 ? (
          <EmptyState>Your queue is empty. Drop an export to start one.</EmptyState>
        ) : (
          <ol>
            {active.map((it, i) => (
              <li
                key={it.id}
                className="grid grid-cols-[32px_minmax(0,1.2fr)_minmax(0,1fr)_240px_150px] items-center gap-5 border-b border-line-subtle px-5 py-4 transition-colors last:border-0 hover:bg-surface-hover"
              >
                <span className="type-data text-sm text-fg-subtle">{i + 1}</span>
                <FileCell name={it.file} sub={it.folder} meta={it.meta} />
                <TargetCell name={it.workbook} sub={it.workbookFolder} detail={it.sheet} />
                <StatusCell item={it} />
                <div className="flex justify-end gap-1">
                  {it.stage === "review" ? (
                    <button onClick={onAnswer} className={`${btnQuiet} text-warning hover:text-warning`}>
                      Answer
                    </button>
                  ) : (
                    holdable(it) && (
                      <button onClick={() => onToggleHold(it.id)} className={btnQuiet}>
                        {it.stage === "held" ? "Resume" : "Pause"}
                      </button>
                    )
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
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
