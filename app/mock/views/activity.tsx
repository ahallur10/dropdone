"use client";

import { useState } from "react";
import type { ActivityEntry, ActivityKind } from "../data";
import { btnQuiet, PageHeader, Tabs } from "../ui";

type Filter = "all" | "updated" | "attention";

const dot: Record<ActivityKind, string> = {
  updated: "bg-brand",
  learned: "bg-brand",
  asked: "bg-warning",
  nomatch: "bg-danger",
  folder: "bg-fg-subtle",
};

export function ActivityView({
  entries,
  onTeach,
  onOpenHome,
}: {
  entries: ActivityEntry[];
  onTeach: () => void;
  onOpenHome: () => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [restored, setRestored] = useState<Set<string>>(new Set());

  const needsAttention = (e: ActivityEntry) => e.kind === "asked" || e.kind === "nomatch";
  const visible = entries.filter((e) =>
    filter === "all" ? true : filter === "updated" ? e.kind === "updated" : needsAttention(e),
  );
  const days = ["Today", "Yesterday", "Earlier this week"] as const;

  return (
    <>
      <PageHeader title="Activity" />
      <Tabs
        value={filter}
        onChange={setFilter}
        tabs={[
          { key: "all", label: "Everything", count: entries.length },
          { key: "updated", label: "Updates", count: entries.filter((e) => e.kind === "updated").length },
          { key: "attention", label: "Needs attention", count: entries.filter(needsAttention).length, alert: true },
        ]}
      />

      <div className="flex flex-col gap-6">
        {days.map((day) => {
          const list = visible.filter((e) => e.day === day);
          if (!list.length) return null;
          return (
            <section key={day} className="flex flex-col gap-2">
              <h2 className="type-data text-[11px] uppercase tracking-[0.08em] text-fg-subtle">{day}</h2>
              <ul className="card divide-y divide-line-subtle overflow-hidden hover:bg-surface">
                {list.map((e) => {
                  const isRestored = restored.has(e.id);
                  return (
                    <li key={e.id} className="grid grid-cols-[86px_14px_minmax(0,1fr)_auto] items-start gap-4 px-5 py-4">
                      <span className="type-data pt-0.5 text-xs text-fg-subtle">{e.time}</span>
                      <span className={`mt-[7px] size-2 rounded-full ${dot[e.kind]}`} />
                      <div className="min-w-0">
                        <p className={`type-body-sm ${isRestored ? "text-fg-muted line-through" : "text-fg"}`}>{e.title}</p>
                        <p className="type-caption mt-0.5 truncate">
                          {isRestored ? "Restored the previous version of this workbook." : e.detail}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {e.kind === "updated" && !isRestored && (
                          <>
                            <button className={btnQuiet}>Open</button>
                            {e.canRestore && (
                              <button
                                onClick={() => setRestored((s) => new Set(s).add(e.id))}
                                className={btnQuiet}
                              >
                                Restore previous
                              </button>
                            )}
                          </>
                        )}
                        {e.kind === "asked" && (
                          <button onClick={onOpenHome} className={`${btnQuiet} text-warning hover:text-warning`}>
                            Answer
                          </button>
                        )}
                        {e.kind === "nomatch" && (
                          <button onClick={onTeach} className={btnQuiet}>
                            Teach a workbook
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
