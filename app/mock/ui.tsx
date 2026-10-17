"use client";

import type { ReactNode } from "react";
import { stageLabel, type Stage, type StagedItem } from "./data";
import { ArrowRightIcon, FileSheetIcon } from "./icons";

export const btnSecondary =
  "type-label inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border border-line px-3.5 text-sm text-fg-soft transition-colors hover:border-line-strong hover:text-fg disabled:cursor-not-allowed disabled:opacity-40";
export const btnQuiet =
  "type-label inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-[13px] text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg";

export function PageHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="type-h4">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function ColHead({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <span className={`type-data text-[11px] uppercase tracking-[0.08em] text-fg-subtle ${className}`}>{children}</span>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: T; label: string; count?: number; alert?: boolean }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-line-subtle">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={`type-label -mb-px flex cursor-pointer items-center gap-2 border-b-2 px-3 pb-3 pt-1 text-sm transition-colors ${
            value === t.key ? "border-brand text-fg" : "border-transparent text-fg-muted hover:text-fg"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span
              className={`type-data rounded-sm px-1.5 text-[11px] ${
                t.alert && t.count > 0 ? "bg-warning text-fg-inverse" : "bg-surface-strong text-fg-soft"
              }`}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function FileCell({ name, sub, meta }: { name: string; sub: string; meta?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-strong text-fg-soft">
        <FileSheetIcon />
      </span>
      <div className="min-w-0">
        <p className="type-label truncate text-[14px] text-fg">{name}</p>
        <p className="type-data mt-0.5 truncate text-xs text-fg-muted">
          {sub} {meta && <span className="text-fg-subtle">· {meta}</span>}
        </p>
      </div>
    </div>
  );
}

export function TargetCell({ name, sub, detail }: { name: string; sub: string; detail?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 text-fg-subtle">
      <ArrowRightIcon className="shrink-0" />
      <div className="min-w-0">
        <p className="type-body-sm truncate text-fg-soft">{name}</p>
        <p className="type-caption mt-0.5 truncate">
          {sub}
          {detail && (
            <>
              {" "}
              · <span className="text-fg-muted">{detail}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export function statusDetail(item: StagedItem) {
  switch (item.stage) {
    case "done":
      return `Saved ${item.finishedAgo ?? "just now"}`;
    case "review":
      return "Paused before saving";
    case "held":
      return `Stopped at ${item.progress}%`;
    case "queued":
      return "Waiting for the files ahead";
    default:
      return `${item.progress}% · step ${steps[item.stage] ?? 0} of 4`;
  }
}

const steps: Partial<Record<Stage, number>> = { reading: 1, matching: 2, cleaning: 3, checking: 4 };

export function StatusCell({ item }: { item: StagedItem }) {
  const running = !["done", "review", "queued", "held"].includes(item.stage);
  return (
    <div className="flex items-center justify-end gap-3.5">
      <div className="min-w-0 text-right">
        <p
          className={`type-label truncate text-[13px] ${
            item.stage === "review"
              ? "text-warning"
              : item.stage === "done"
                ? "text-fg"
                : running
                  ? "text-fg-soft"
                  : "text-fg-muted"
          }`}
        >
          {stageLabel[item.stage]}
        </p>
        <p className="type-data mt-0.5 truncate text-[11px] text-fg-subtle">{statusDetail(item)}</p>
      </div>
      <Donut stage={item.stage} progress={item.progress} />
    </div>
  );
}

export function Donut({ stage, progress, size = 40 }: { stage: Stage; progress: number; size?: number }) {
  const stroke = size >= 40 ? 4 : 3.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = stage === "queued" ? 0 : progress;
  const color =
    stage === "review" ? "var(--color-warning)" : stage === "held" ? "var(--color-fg-muted)" : "var(--color-brand)";

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${stageLabel[stage]}, ${pct}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={stroke}
          strokeDasharray={stage === "queued" ? "2 4" : undefined}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 450ms ease-out" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        {stage === "done" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-brand">
            <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : stage === "review" ? (
          <span className="type-label text-[14px] leading-none text-warning">?</span>
        ) : stage === "held" ? (
          <span className="flex gap-[3px]">
            <span className="h-2.5 w-[3px] rounded-[1px] bg-fg-muted" />
            <span className="h-2.5 w-[3px] rounded-[1px] bg-fg-muted" />
          </span>
        ) : stage === "queued" ? null : (
          size >= 40 && <span className="type-data text-[10px] leading-none text-fg-soft">{pct}</span>
        )}
      </span>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-10 shrink-0 cursor-pointer rounded-pill transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "bg-brand" : "bg-surface-strong"
      }`}
    >
      <span
        className={`absolute top-1 size-4 rounded-full transition-[left] duration-150 ${
          checked ? "left-5 bg-fg-inverse" : "left-1 bg-fg-muted"
        }`}
      />
    </button>
  );
}

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="type-label text-fg">{title}</h2>
        {description && <p className="type-caption mt-1">{description}</p>}
      </div>
      <div className="card divide-y divide-line-subtle overflow-hidden hover:bg-surface">{children}</div>
    </section>
  );
}

export function SettingRow({
  title,
  description,
  control,
}: {
  title: ReactNode;
  description?: ReactNode;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4">
      <div className="min-w-0">
        <p className="type-body-sm text-fg">{title}</p>
        {description && <p className="type-caption mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

export function ProBadge() {
  return <span className="badge bg-brand-a24 text-brand">Pro</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="type-body-sm px-5 py-10 text-center">{children}</p>;
}
