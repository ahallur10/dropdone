import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";

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

const rows: { label: string; dropdone: Cell; others: [Cell, Cell, Cell] }[] = [
  {
    label: "How you set it up",
    dropdone: { mark: "yes", text: "Show it one before and after" },
    others: [
      { mark: "partial", text: "Build each step in the editor" },
      { mark: "partial", text: "Record clicks or write VBA" },
      { mark: "partial", text: "Describe it in a prompt, every time" },
    ],
  },
  {
    label: "Learns from your finished report",
    dropdone: { mark: "yes", text: "Yes, that's the whole setup" },
    others: [
      { mark: "no", text: "No, you define the steps" },
      { mark: "no", text: "No, it replays what you recorded" },
      { mark: "no", text: "No, it works from your prompt" },
    ],
  },
  {
    label: "When rows shift in a new export",
    dropdone: { mark: "yes", text: "Finds columns by what they are" },
    others: [
      { mark: "partial", text: "Fine if headers match; edits needed if not" },
      { mark: "no", text: "Often breaks on recorded cell positions" },
      { mark: "partial", text: "Prompt again and recheck" },
    ],
  },
  {
    label: "Same result every run",
    dropdone: { mark: "yes", text: "Approved steps run exactly as written" },
    others: [
      { mark: "yes", text: "Yes" },
      { mark: "partial", text: "While the layout holds" },
      { mark: "no", text: "Output can differ run to run" },
    ],
  },
  {
    label: "Checks before it saves",
    dropdone: { mark: "yes", text: "Compares to your workbook, stops if off" },
    others: [
      { mark: "partial", text: "Only the checks you build" },
      { mark: "partial", text: "Only the checks you write" },
      { mark: "no", text: "You review the result" },
    ],
  },
  {
    label: "Who keeps it working",
    dropdone: { mark: "yes", text: "No one; re-teach with one example if needed" },
    others: [
      { mark: "partial", text: "Someone who knows Power Query" },
      { mark: "no", text: "Whoever can still read the VBA" },
      { mark: "partial", text: "You, every time you run it" },
    ],
  },
  {
    label: "Data stays on your computer",
    dropdone: { mark: "yes", text: "Weekly runs, yes" },
    others: [
      { mark: "yes", text: "Yes" },
      { mark: "yes", text: "Yes" },
      { mark: "no", text: "Processed in Microsoft 365" },
    ],
  },
];

const forYou = [
  "You clean the same export every week or every month.",
  "You already know what the finished report should look like.",
  "Your system can't be changed, so the mess isn't going away.",
  "Nobody has time to build, fix or babysit an automation.",
  "The cleanup lives in one person's head, and they won't always be there.",
  "Your data has to stay on your organization's computers.",
];

const GRID = "grid grid-cols-[minmax(170px,1.05fr)_repeat(4,minmax(150px,1fr))]";

export default function ComparePage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 pb-16 pt-36 md:pb-20 md:pt-44">
            <div className="flex max-w-[760px] flex-col gap-6">
              <h1>
                Built for the cleanup you{" "}
                <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">repeat</span>.
              </h1>
              <p className="type-lead text-fg-muted">
                Dropdone is most useful when the cleanup repeats, you already know what the result should look like,
                and keeping an automation running is the real burden.
              </p>
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

        {/* Comparison */}
        <section className="border-y border-line-subtle bg-section">
          <div className="mx-auto flex max-w-site flex-col gap-10 px-6 py-20 md:py-28">
            <h2 className="max-w-[24ch]">How it compares with the tools you already have.</h2>

            <div className="-mx-6 overflow-x-auto px-6 lg:overflow-visible">
              <div className="min-w-[920px]" role="table" aria-label="Dropdone compared with Power Query, Excel macros and Microsoft Copilot">
                {/* Header row stays pinned under the nav while you scroll the comparisons */}
                <div role="row" className={`${GRID} z-20 border-b border-line bg-section lg:sticky lg:top-20`}>
                  <span role="columnheader" className="py-4" />
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
                  <div role="row" key={r.label} className={`${GRID} border-b border-line-subtle last:border-0`}>
                    <span role="rowheader" className="type-label flex items-center py-5 pr-4 text-fg">
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

        {/* For you if */}
        <section>
          <div className="mx-auto grid max-w-site gap-12 px-6 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="flex flex-col gap-6">
              <h2 className="type-h1">
                Dropdone is for{" "}
                <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">you</span> if…
              </h2>
              <div className="flex flex-col gap-2 rounded-xl border border-line-subtle bg-surface p-5">
                <p className="type-label text-fg">Probably not the right fit if</p>
                <p className="type-body-sm">
                  Every cleanup is different, or you need live data piped in from a database. A data team or Power Query
                  is a better match there.
                </p>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {forYou.map((reason) => (
                <li key={reason} className="flex gap-3.5 rounded-xl border border-line-subtle bg-surface p-5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-fg-inverse">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="type-body text-fg-soft">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-line-subtle bg-section">
          <div className="mx-auto flex max-w-site flex-col items-start gap-6 px-6 py-24 md:py-32">
            <h2 className="max-w-[20ch]">Stop cleaning the same report twice.</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/#join" className="btn-primary no-underline">
                Get early access
              </Link>
              <Link href="/how-it-works" className="btn-ghost no-underline">
                See how it works
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
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
