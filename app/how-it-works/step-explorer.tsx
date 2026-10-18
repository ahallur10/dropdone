"use client";

import { useRef, useState, type ReactNode } from "react";

export type ExplorerStep = {
  n: number;
  tag: "Setup" | "Every week";
  title: string;
  line: string;
  visual: ReactNode;
};

/*
 * The four steps as clickable cards (2x2) next to one large panel. Clicking a card swaps the
 * panel to that step's visual. Lime only marks the active card; the panel sits on a surface.
 */
export function StepExplorer({ steps }: { steps: ExplorerStep[] }) {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const current = steps[active];

  function select(i: number) {
    setActive(i);
    // On small screens the panel sits below the cards, so bring it into view.
    if (window.innerWidth < 1024) panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-line-subtle bg-header p-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:p-4">
      {/* Step cards */}
      <div role="tablist" aria-label="How it works, step by step" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-rows-2">
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.n}
              role="tab"
              id={`step-tab-${s.n}`}
              aria-selected={on}
              aria-controls="step-panel"
              onClick={() => select(i)}
              className={`group flex cursor-pointer flex-col rounded-xl border p-5 text-left transition-colors ${
                on ? "border-brand/50 bg-surface-strong" : "border-line-subtle bg-surface hover:border-line hover:bg-surface-hover"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex size-11 items-center justify-center rounded-full font-display text-lg font-black italic transition-colors ${
                    on ? "bg-brand text-fg-inverse" : "border border-line-strong text-fg-muted group-hover:text-fg-soft"
                  }`}
                >
                  {s.n}
                </span>
                <StepTag tag={s.tag} />
              </div>
              {/* Titles sit at the same height in every card; only the selected card shows its
                  description, which slides open below the title and is capped at four lines. */}
              <span className={`type-h4 mt-8 transition-colors lg:mt-10 ${on ? "text-fg" : "text-fg-soft"}`}>{s.title}</span>
              <span
                className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}
                aria-hidden={!on}
              >
                <span className="overflow-hidden">
                  <span className="type-body-sm line-clamp-4 pt-2">{s.line}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Visual panel */}
      <div
        ref={panel}
        id="step-panel"
        role="tabpanel"
        aria-labelledby={`step-tab-${current.n}`}
        className="flex min-h-[560px] scroll-mt-24 flex-col overflow-hidden rounded-xl border border-line-subtle bg-section lg:h-[640px] lg:min-h-0"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line-subtle px-5 py-3">
          <p className="type-label text-sm text-fg">
            <span className="type-data mr-2 text-xs text-brand">0{current.n}</span>
            {current.title}
          </p>
          <div className="flex gap-1.5" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.n} className={`h-1 w-6 rounded-pill transition-colors ${i === active ? "bg-brand" : "bg-line"}`} />
            ))}
          </div>
        </div>
        {/* key remounts the visual so each step's animation starts from the beginning */}
        <div key={current.n} className="animate-fade-in flex min-h-0 flex-1 flex-col overflow-y-auto p-5 md:p-6">
          <div className="my-auto w-full">{current.visual}</div>
        </div>
      </div>
    </div>
  );
}

// Group pill: always visible, so it's clear steps 1 and 2 happen once and 3 and 4 every week.
function StepTag({ tag }: { tag: ExplorerStep["tag"] }) {
  const setup = tag === "Setup";
  return (
    <span
      className={`type-data inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] ${
        setup ? "border-brand/30 bg-brand-a10 text-brand" : "border-line bg-surface-strong text-fg-soft"
      }`}
    >
      {setup ? (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12a8 8 0 0 1 13.6-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.6 5.7L4 15.5M4 20v-4.5h4.5" />
        </svg>
      )}
      {setup ? "Setup · once" : "Every week"}
    </span>
  );
}
