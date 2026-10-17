"use client";

import { useState } from "react";
import { reviewQuestion, type StagedItem } from "../data";
import { btnSecondary, ColHead, Donut, EmptyState, FileCell, StatusCell, Tabs, TargetCell } from "../ui";

type Filter = "all" | "progress" | "review" | "done";

export function HomeView({ items, onAnswer }: { items: StagedItem[]; onAnswer: () => void }) {
  const [filter, setFilter] = useState<Filter>("all");

  const isProgress = (i: StagedItem) => i.stage !== "done" && i.stage !== "review";
  const counts = {
    all: items.length,
    progress: items.filter(isProgress).length,
    review: items.filter((i) => i.stage === "review").length,
    done: items.filter((i) => i.stage === "done").length,
  };
  const visible = items.filter((i) =>
    filter === "all" ? true : filter === "progress" ? isProgress(i) : filter === "review" ? i.stage === "review" : i.stage === "done",
  );
  const reviewItem = items.find((i) => i.id === reviewQuestion.itemId && i.stage === "review");

  return (
    <>
      {reviewItem && <ReviewBanner item={reviewItem} onAnswer={onAnswer} />}

      <Tabs
        value={filter}
        onChange={setFilter}
        tabs={[
          { key: "all", label: "All files", count: counts.all },
          { key: "progress", label: "In progress", count: counts.progress },
          { key: "review", label: "Needs you", count: counts.review, alert: true },
          { key: "done", label: "Done", count: counts.done },
        ]}
      />

      <div className="card overflow-hidden hover:bg-surface">
        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_240px] gap-6 border-b border-line-subtle px-5 py-3">
          <ColHead>File</ColHead>
          <ColHead>Updating</ColHead>
          <ColHead className="text-right">Status</ColHead>
        </div>
        {visible.length === 0 ? (
          <EmptyState>Nothing here right now.</EmptyState>
        ) : (
          <ul>
            {visible.map((it) => (
              <li
                key={it.id}
                className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_240px] items-center gap-6 border-b border-line-subtle px-5 py-4 transition-colors last:border-0 hover:bg-surface-hover"
              >
                <FileCell name={it.file} sub={it.folder} meta={it.meta} />
                <TargetCell name={it.workbook} sub={it.workbookFolder} detail={it.sheet} />
                <StatusCell item={it} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export function ReviewBanner({ item, onAnswer }: { item: StagedItem; onAnswer: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-warning/40 bg-surface px-5 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <Donut stage="review" progress={item.progress} size={32} />
        <div className="min-w-0">
          <p className="type-label text-fg">{reviewQuestion.title}</p>
          <p className="type-body-sm mt-0.5 max-w-[70ch]">
            {reviewQuestion.body} <span className="type-data text-xs text-fg-subtle">{item.file}</span>
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button onClick={onAnswer} className="btn-primary min-h-9 cursor-pointer px-3.5 text-sm">
          {reviewQuestion.options[0]}
        </button>
        <button onClick={onAnswer} className={btnSecondary}>
          {reviewQuestion.options[1]}
        </button>
      </div>
    </div>
  );
}
