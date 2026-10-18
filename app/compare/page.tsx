import type { Metadata } from "next";
import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";
import { PixelDivider } from "../_components/pixel-divider";
import { JoinSection } from "../_components/join-section";
import { ChangeDemo } from "./change-demo";
import { PixelField } from "../_components/pixel-field";

export const metadata: Metadata = {
  title: "Compare · Dropdone",
  description:
    "Dropdone is most useful when the cleanup repeats, you already know what the result should look like, and keeping an automation running is the real burden. Here's how it compares with Power Query, macros and Copilot.",
};

const conditions = [
  { n: "01", title: "The cleanup repeats", body: "Same export, same mess, every week or every month." },
  { n: "02", title: "You know what done looks like", body: "You already have the finished report. Dropdone copies that." },
  { n: "03", title: "Upkeep is the burden", body: "Nobody has time to build, fix or babysit an automation." },
];

type Mark = "yes" | "partial" | "no";
type Cell = { mark: Mark; text: string };

const tools = ["Power Query", "Excel macros / VBA", "Microsoft Copilot"];

const rows: { label: string; icon: IconName; dropdone: Cell; others: [Cell, Cell, Cell] }[] = [
  {
    label: "How you set it up",
    icon: "setup",
    dropdone: { mark: "yes", text: "Show it one before and after" },
    others: [
      { mark: "partial", text: "Build each step in the editor" },
      { mark: "partial", text: "Record clicks or write VBA" },
      { mark: "partial", text: "Describe it in a prompt, every time" },
    ],
  },
  {
    label: "Learns from your finished report",
    icon: "learn",
    dropdone: { mark: "yes", text: "Yes, that's the whole setup" },
    others: [
      { mark: "no", text: "No, you define the steps" },
      { mark: "no", text: "No, it replays what you recorded" },
      { mark: "no", text: "No, it works from your prompt" },
    ],
  },
  {
    label: "When rows shift in a new export",
    icon: "shift",
    dropdone: { mark: "yes", text: "Finds columns by what they are" },
    others: [
      { mark: "partial", text: "Fine if headers match; edits needed if not" },
      { mark: "no", text: "Often breaks on recorded cell positions" },
      { mark: "partial", text: "Prompt again and recheck" },
    ],
  },
  {
    label: "Same result every run",
    icon: "repeat",
    dropdone: { mark: "yes", text: "Approved steps run exactly as written" },
    others: [
      { mark: "yes", text: "Yes" },
      { mark: "partial", text: "While the layout holds" },
      { mark: "no", text: "Output can differ run to run" },
    ],
  },
  {
    label: "Checks before it saves",
    icon: "check",
    dropdone: { mark: "yes", text: "Compares to your workbook, stops if off" },
    others: [
      { mark: "partial", text: "Only the checks you build" },
      { mark: "partial", text: "Only the checks you write" },
      { mark: "no", text: "You review the result" },
    ],
  },
  {
    label: "Who keeps it working",
    icon: "wrench",
    dropdone: { mark: "yes", text: "Re-teach with one example if the export changes" },
    others: [
      { mark: "partial", text: "Someone who knows Power Query" },
      { mark: "no", text: "Whoever can still read the VBA" },
      { mark: "partial", text: "You, every time you run it" },
    ],
  },
  {
    label: "Data stays on your computer",
    icon: "device",
    dropdone: { mark: "yes", text: "Every run, yes" },
    others: [
      { mark: "yes", text: "Yes" },
      { mark: "yes", text: "Yes" },
      { mark: "no", text: "Processed in Microsoft 365" },
    ],
  },
];

// The fit check at the end of the page: three reasons it isn't, three reasons it is.
const notForYou = [
  "Every report is a one-off, so there's no cleanup to repeat.",
  "You need live data piped in straight from a database.",
  "Your exports already come out clean and ready to use.",
];
const forYou = [
  "You clean the same export every week or every month.",
  "You already know what the finished report should look like.",
  "Your data has to stay on your organization's computers.",
];

const GRID = "grid grid-cols-[132px_repeat(4,minmax(140px,1fr))] lg:grid-cols-[minmax(170px,1.05fr)_repeat(4,minmax(150px,1fr))]";
// On narrower screens the table scrolls sideways; the row labels stay pinned on the left.
const PIN = "max-lg:sticky max-lg:-left-6 max-lg:z-10 max-lg:bg-page max-lg:shadow-[1px_0_0_var(--color-line-subtle)] max-lg:-ml-6 max-lg:pl-6";

export default function ComparePage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <PixelField seed={3} />
          <div className="relative mx-auto flex max-w-site flex-col gap-12 px-6 pb-8 pt-36 md:pb-10 md:pt-44">
            <div className="flex max-w-[760px] flex-col gap-6">
              <h1>
                Built for the cleanup you{" "}
                <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">repeat</span>.
              </h1>
            </div>
            <ol className="grid gap-4 md:grid-cols-3">
              {conditions.map((c) => (
                <li key={c.n} className="flex flex-col gap-3 rounded-2xl border border-line-subtle bg-surface p-6">
                  <span className="type-stat text-[2.5rem]! text-brand">{c.n}</span>
                  <p className="type-h4">{c.title}</p>
                  <p className="type-body-sm">{c.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Comparison: follows straight on from the opening, no divider */}
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-10 px-6 pb-20 pt-8 md:pb-28 md:pt-10">
            <h2 className="mx-auto max-w-[24ch] text-center">
              How it compares with the tools you already{" "}
              <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">have</span>.
            </h2>
            <ChangeDemo />

            <div className="-mx-6 overflow-x-auto px-6 lg:overflow-visible">
              <div className="min-w-[700px] lg:min-w-[920px]" role="table" aria-label="Dropdone compared with Power Query, Excel macros and Microsoft Copilot">
                {/* Header row stays pinned under the nav while you scroll the comparisons */}
                <div role="row" className={`${GRID} z-20 border-b border-line bg-page lg:sticky lg:top-20`}>
                  <span role="columnheader" className={`py-4 ${PIN}`} />
                  <span role="columnheader" className="flex items-center justify-center rounded-t-xl bg-brand-a10 px-4 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/dropdone-lockup.svg" alt="Dropdone" className="h-9 w-auto" />
                  </span>
                  {tools.map((t) => (
                    <span role="columnheader" key={t} className="type-label flex items-center justify-center px-4 py-4 text-center text-fg">
                      {t}
                    </span>
                  ))}
                </div>

                {rows.map((r, i) => (
                  <div role="row" key={r.label} className={`${GRID} border-b border-line last:border-0 ${i % 2 ? "bg-surface/40" : ""}`}>
                    <span role="rowheader" className={`type-label flex items-center gap-3 py-5 pr-4 text-fg ${PIN}`}>
                      <RowIcon name={r.icon} />
                      {r.label}
                    </span>
                    <CellView cell={r.dropdone} highlight last={i === rows.length - 1} />
                    {r.others.map((c, j) => (
                      <CellView key={j} cell={c} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <p className="type-caption">Based on how each tool usually works out of the box. Your setup may differ.</p>
          </div>
        </section>
        <PixelDivider seed={12} />

        {/* Is it a fit? */}
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-10 px-6 py-24 md:py-32">
            <h2 className="type-h1 flex flex-wrap items-center gap-x-[0.3em]">
              Is
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/dropdone-lockup.svg" alt="Dropdone" className="inline-block h-[1.15em] w-auto" />
              <span>
                a <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">fit</span>?
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <FitList title="Probably not, if…" items={notForYou} good={false} />
              <FitList title="Yes, if…" items={forYou} good />
            </div>
          </div>
        </section>

        {/* Join */}
        <PixelDivider seed={13} />
        <JoinSection secondary={{ href: "/pricing", label: "See pricing" }} />
      </main>
      <SiteFooter />
    </>
  );
}

function FitList({ title, items, good }: { title: string; items: string[]; good: boolean }) {
  return (
    <div className={`flex flex-col gap-4 rounded-2xl border p-6 md:p-7 ${good ? "border-brand/40 bg-brand-a10" : "border-line-subtle bg-surface"}`}>
      <h3 className={`type-h4 ${good ? "text-fg" : "text-fg-soft"}`}>{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3.5">
            <span
              className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${
                good ? "bg-brand text-fg-inverse" : "border border-line-strong text-fg-muted"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d={good ? "m5 12.5 4.5 4.5L19 7.5" : "M6 6l12 12M18 6 6 18"}
                  stroke="currentColor"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={`type-body ${good ? "text-fg" : "text-fg-soft"}`}>
              <span className="sr-only">{good ? "Good fit: " : "Not a fit: "}</span>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type IconName = "setup" | "learn" | "shift" | "repeat" | "check" | "wrench" | "device";

// A small line icon for each comparison row, so the rows scan at a glance.
function RowIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    setup: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4",
    learn: "M4 5h7v14H4zM13 5h7v14h-7M7 9h1M7 12h1M16 9h1M16 12h1",
    shift: "M8 4v16m0 0-3-3m3 3 3-3M16 20V4m0 0-3 3m3-3 3 3",
    repeat: "M4 12a8 8 0 0 1 13.6-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.6 5.7L4 15.5M4 20v-4.5h4.5",
    check: "M12 3.5 5 6.5v5c0 4.3 3 7.7 7 9 4-1.3 7-4.7 7-9v-5l-7-3ZM9 12l2 2 4-4",
    wrench: "M14.5 6.5a4 4 0 0 0 5 5L13 18a2.1 2.1 0 0 1-3-3l6.5-6.5a4 4 0 0 1-2-2ZM6 18l-2 2",
    device: "M3.5 5h17v11h-17zM8 20h8M12 16v4",
  };
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-line-subtle bg-surface text-brand max-sm:hidden" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[name]} />
      </svg>
    </span>
  );
}

function CellView({ cell, highlight, last }: { cell: Cell; highlight?: boolean; last?: boolean }) {
  return (
    <span
      role="cell"
      className={`flex flex-col items-center gap-2 px-4 py-5 text-center ${highlight ? `bg-brand-a10 ${last ? "rounded-b-xl" : ""}` : ""}`}
    >
      <MarkIcon mark={cell.mark} />
      <span className={`type-body-sm ${highlight ? "text-fg" : ""}`}>{cell.text}</span>
    </span>
  );
}

function MarkIcon({ mark }: { mark: Mark }) {
  if (mark === "yes") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-brand text-fg-inverse" role="img" aria-label="Yes">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (mark === "partial") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full border border-line-strong" role="img" aria-label="Partly">
        <span className="h-[2px] w-2.5 rounded-pill bg-fg-muted" />
      </span>
    );
  }
  return (
    <span className="flex size-6 items-center justify-center rounded-full border border-line text-fg-subtle" role="img" aria-label="No">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
