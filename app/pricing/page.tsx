import type { Metadata } from "next";
import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";
import { PixelDivider } from "../_components/pixel-divider";
import { PricingTiers } from "../_components/pricing-tiers";
import { JoinSection } from "../_components/join-section";

export const metadata: Metadata = {
  title: "Pricing · Dropdone",
  description:
    "Community is free and open source. Pro is $20 a month: AI for setup included, adjusted refresh when an export changes, and every version of your cleanups saved.",
};

type Value = string | boolean;

const plans = ["Community", "Pro", "Team"];

const groups: { title: string; rows: { label: string; values: [Value, Value, Value] }[] }[] = [
  {
    title: "Setup",
    rows: [
      { label: "Learns from your before and after", values: [true, true, true] },
      { label: "Every step in plain English, with a context file", values: [true, true, true] },
      { label: "AI for setup", values: ["Your own API key", "Included", "Included"] },
    ],
  },
  {
    title: "Every week",
    rows: [
      { label: "Saved cleanups", values: ["Unlimited", "Unlimited", "Unlimited, shared"] },
      { label: "Full workbook or single sheet refresh", values: [true, true, true] },
      { label: "Checks before saving", values: [true, true, true] },
      { label: "Backup before every write", values: [true, true, true] },
      { label: "Weekly runs on your computer, offline", values: [true, true, true] },
    ],
  },
  {
    title: "When an export changes",
    rows: [
      { label: "Stops safely, saves nothing", values: [true, true, true] },
      { label: "Adjusted refresh proposes the fix", values: [false, "Up to 5 workbooks", "Unlimited"] },
      { label: "Version history with one-click undo", values: ["Current version only", true, true] },
    ],
  },
  {
    title: "For your organization",
    rows: [
      { label: "Open source core your IT team can read", values: [true, true, true] },
      { label: "Admin view", values: [false, false, true] },
      { label: "Data-handling statement for IT review", values: [false, false, true] },
      { label: "Billing", values: ["Free", "Card, monthly or yearly", "Annual invoice or PO"] },
    ],
  },
];

const faqs = [
  {
    q: "What's an API key, and do I need one?",
    a: "Setup uses AI once per cleanup to compare your before and after and write the steps. On Community you paste in a key from an AI provider, which your IT team may already have. On Pro it's included, so there's nothing to set up.",
  },
  {
    q: "Does my data get sent anywhere?",
    a: "Weekly runs happen entirely on your computer and work offline. AI is only used during setup, and with Pro's adjusted refresh when an export changes, and nothing is saved until you approve it.",
  },
  {
    q: "What happens when an export changes?",
    a: "Dropdone checks every run against your workbook. If columns are missing, renamed or reordered, Community stops and saves nothing, and you teach it again with one new example. Pro proposes the fix for you to approve.",
  },
  {
    q: "Can we pay by invoice or purchase order?",
    a: "Yes, on Team. Many public-sector offices can't put a monthly subscription on a card, so Team is billed annually by invoice or PO.",
  },
  {
    q: "Is it really free?",
    a: "Community is free and open source, with unlimited saved cleanups. You only pay if you want AI included and the help Pro gives you when an export changes.",
  },
];

const GRID = "grid grid-cols-[148px_repeat(3,minmax(116px,1fr))] lg:grid-cols-[minmax(200px,1.4fr)_repeat(3,minmax(130px,1fr))]";
// On narrower screens the table scrolls sideways; the row labels stay pinned on the left.
const PIN = "max-lg:sticky max-lg:-left-6 max-lg:z-10 max-lg:bg-page max-lg:shadow-[1px_0_0_var(--color-line-subtle)] max-lg:-ml-6 max-lg:pl-6";

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero + plans */}
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 pb-24 pt-36 md:pb-28 md:pt-44">
            <div className="flex max-w-[720px] flex-col gap-6">
              <h1>
                Free to start. Pro keeps it{" "}
                <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">working</span>.
              </h1>
              <p className="type-lead text-fg-muted">
                Community gives you the full product for free. Pro is for the people who never want to set up an API key
                or get stuck when an export changes.
              </p>
            </div>
            <PricingTiers />
          </div>
        </section>

        {/* Plan comparison */}
        <PixelDivider seed={8} />
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-10 px-6 py-20 md:py-28">
            <h2 className="max-w-[20ch]">Compare plans.</h2>
            <div className="-mx-6 overflow-x-auto px-6 lg:overflow-visible">
              <div className="min-w-[500px] lg:min-w-[720px]" role="table" aria-label="Plan comparison">
                <div role="row" className={`${GRID} z-20 border-b border-line bg-page lg:sticky lg:top-20`}>
                  <span role="columnheader" className={`py-4 ${PIN}`} />
                  {plans.map((p) => (
                    <span
                      role="columnheader"
                      key={p}
                      className={`type-label flex items-center justify-center px-4 py-4 ${p === "Pro" ? "rounded-t-xl bg-brand-a10 text-brand" : "text-fg"}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
                {groups.map((g, gi) => (
                  <div key={g.title} role="rowgroup">
                    <div role="row" className={GRID}>
                      <span role="rowheader" className={`type-data pb-2 pt-8 text-[11px] uppercase tracking-[0.08em] text-fg-subtle ${PIN}`}>
                        {g.title}
                      </span>
                      <span className="bg-transparent" />
                      <span className="bg-brand-a10" />
                      <span />
                    </div>
                    {g.rows.map((r, ri) => {
                      const lastRow = gi === groups.length - 1 && ri === g.rows.length - 1;
                      return (
                        <div role="row" key={r.label} className={`${GRID} border-b border-line-subtle`}>
                          <span role="rowheader" className={`type-body-sm flex items-center py-4 pr-4 text-fg-soft ${PIN}`}>
                            {r.label}
                          </span>
                          {r.values.map((v, i) => (
                            <span
                              role="cell"
                              key={i}
                              className={`flex items-center justify-center px-4 py-4 text-center ${
                                i === 1 ? `bg-brand-a10 ${lastRow ? "rounded-b-xl" : ""}` : ""
                              }`}
                            >
                              <ValueView value={v} />
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <PixelDivider seed={9} />

        {/* FAQ */}
        <section>
          <div className="mx-auto grid max-w-site gap-10 px-6 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <h2 className="max-w-[14ch]">Questions people ask first.</h2>
            <div className="flex flex-col divide-y divide-line-subtle border-y border-line-subtle">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="type-h4 flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition-transform group-open:rotate-45">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[62ch] text-fg-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Join */}
        <PixelDivider seed={10} />
        <JoinSection secondary={{ href: "/compare", label: "Compare with other tools" }} />
      </main>
      <SiteFooter />
    </>
  );
}

function ValueView({ value }: { value: Value }) {
  if (value === true) {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-brand text-fg-inverse" role="img" aria-label="Included">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="type-body-sm text-fg-subtle">No</span>
    );
  }
  return <span className="type-body-sm text-fg-soft">{value}</span>;
}
