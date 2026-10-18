"use client";

import Link from "next/link";
import { useState } from "react";

// Planned pricing from the PRD. Pro is framed as "works out of the box and keeps working".
type Billing = "monthly" | "yearly";

const tiers = [
  {
    name: "Community",
    tag: "Free · open source",
    price: { monthly: "$0", yearly: "$0" },
    unit: "forever",
    blurb: "For people who want full control, and IT teams who want to read the code.",
    features: [
      "Learns from your before and after",
      "Unlimited recipes, full workbook or single sheet",
      "AI for setup with your own API key",
      "When an export changes, it stops safely and you teach it again",
      "Weekly runs on your computer, offline",
    ],
    cta: { label: "Get early access", href: "/#join", style: "btn-primary" },
  },
  {
    name: "Pro",
    tag: "Works out of the box, keeps working",
    price: { monthly: "$20", yearly: "$200" },
    unit: { monthly: "per user / month", yearly: "per user / year" },
    blurb: "For the person who owns the report and never wants to get stuck.",
    features: [
      "Everything in Community",
      "AI for setup included, no key needed",
      "When an export changes, adjusted refresh proposes the fix and you approve",
      "Every recipe version saved, with one-click undo",
      "Adjusted refresh on up to 5 workbooks",
    ],
    cta: { label: "Get early access", href: "/#join", style: "btn-primary" },
    featured: true,
  },
  {
    name: "Team",
    tag: "For a department",
    price: { monthly: "Let's talk", yearly: "Let's talk" },
    unit: "annual invoice",
    blurb: "For a department rolling Dropdone out after a pilot.",
    features: [
      "Everything in Pro, on unlimited workbooks",
      "Shared recipes and an admin view",
      "A data-handling statement for your IT review",
      "Pay by annual invoice or purchase order",
    ],
    cta: { label: "Talk to us", href: "/#join", style: "btn-ghost" },
  },
] as const;

export function PricingTiers() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" aria-label="Billing period" className="grid grid-cols-2 gap-1 self-start rounded-lg border border-line bg-surface p-1">
        {(["monthly", "yearly"] as Billing[]).map((b) => (
          <button
            key={b}
            role="tab"
            aria-selected={billing === b}
            onClick={() => setBilling(b)}
            className={`type-label flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-5 text-sm capitalize transition-colors ${
              billing === b ? "bg-surface-strong text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {b}
            {b === "yearly" && <span className="type-data rounded-sm bg-brand-a24 px-1.5 text-[10px] text-brand">2 months free</span>}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {tiers.map((t) => {
          const featured = "featured" in t && t.featured;
          const unit = typeof t.unit === "string" ? t.unit : t.unit[billing];
          return (
            <article
              key={t.name}
              className={`flex flex-col gap-6 rounded-2xl border p-7 ${
                featured ? "border-brand/40 bg-surface-strong" : "border-line-subtle bg-surface"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="type-h4">{t.name}</h3>
                  {featured && <span className="badge badge-pink shrink-0">Early access</span>}
                </div>
                <p className={`type-data text-[11px] uppercase tracking-[0.08em] ${featured ? "text-brand" : "text-fg-subtle"}`}>{t.tag}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex items-baseline gap-2">
                  <span className="type-h1">{t.price[billing]}</span>
                </p>
                <p className="type-caption">{unit}</p>
              </div>
              <p className="type-body-sm text-fg-soft">{t.blurb}</p>
              <ul className="flex flex-col gap-3 border-t border-line-subtle pt-6">
                {t.features.map((f) => (
                  <li key={f} className="type-body-sm flex gap-3 text-fg-soft">
                    <span className="mt-[3px] flex size-4 shrink-0 items-center justify-center rounded-full bg-brand text-fg-inverse">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={t.cta.href} className={`${t.cta.style} mt-auto no-underline`}>
                {t.cta.label}
              </Link>
            </article>
          );
        })}
      </div>
      <p className="type-caption">Planned pricing during early access. It may change before launch.</p>
    </div>
  );
}
