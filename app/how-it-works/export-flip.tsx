"use client";

import { useEffect, useState } from "react";

/*
 * Three different legacy exports, side by side. "Original" shows each messy export; "Cleaned"
 * flips all three cards (one after another) to the clean table Dropdone writes. Click a card
 * to see the image full size. All three images are fictional demo data.
 */

type Example = {
  system: string;
  kind: string;
  problem: string;
  result: string;
  original: { src: string; w: number; h: number };
  cleaned: { src: string; w: number; h: number };
};

const examples: Example[] = [
  {
    system: "Munis-style",
    kind: "Budget report (PDF)",
    problem: "Repeated headers, departments grouped into sections, and subtotal rows.",
    result: "One row per budget account, every column filled in.",
    original: { src: "/exports/munis-budget-original.png", w: 1300, h: 1005 },
    cleaned: { src: "/exports/munis-budget-cleaned.webp", w: 2000, h: 372 },
  },
  {
    system: "Springbrook-style",
    kind: "AP invoice register (PDF)",
    problem: "Multi-line invoice blocks, wrapped descriptions, and invoice totals mid-page.",
    result: "One row per invoice line, with the vendor on every row.",
    original: { src: "/exports/springbrook-ap-original.png", w: 1082, h: 1400 },
    cleaned: { src: "/exports/springbrook-ap-cleaned.webp", w: 2000, h: 433 },
  },
  {
    system: "JD Edwards-style",
    kind: "Ledger extract (CSV)",
    problem: "Cryptic column codes, encoded dates, padded text, and amounts without decimals.",
    result: "A decoded ledger with readable columns, real dates and amounts.",
    original: { src: "/exports/jde-ledger-original.png", w: 1276, h: 510 },
    cleaned: { src: "/exports/jde-ledger-cleaned.webp", w: 2000, h: 478 },
  },
];

type Side = "original" | "cleaned";

export function ExportFlip() {
  const [side, setSide] = useState<Side>("original");
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const cleaned = side === "cleaned";

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        {/* Same size and underline treatment as the page's opening headline */}
        <h2 className="type-h1 max-w-[18ch]">
          Three different systems. One{" "}
          <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">clean</span> result.
        </h2>
        <div role="tablist" aria-label="Show the exports" className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface p-1">
          {(["original", "cleaned"] as Side[]).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={side === s}
              onClick={() => setSide(s)}
              className={`type-label min-h-10 cursor-pointer rounded-md px-5 text-sm capitalize transition-colors ${
                side === s ? (s === "cleaned" ? "bg-brand text-fg-inverse" : "bg-surface-strong text-fg") : "text-fg-muted hover:text-fg"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {examples.map((ex, i) => (
          <li key={ex.system} className="flex flex-col gap-4">
            {/* Flip card */}
            <button
              onClick={() => {
                const face = cleaned ? ex.cleaned : ex.original;
                setZoom({ src: face.src, alt: `${ex.system} ${ex.kind}, ${side}` });
              }}
              className="group relative block h-72 w-full cursor-zoom-in [perspective:1400px]"
              aria-label={`${ex.system} ${ex.kind}: view the ${side} version full size`}
            >
              <span
                className="relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
                style={{ transform: cleaned ? "rotateY(180deg)" : "none", transitionDelay: `${i * 120}ms` }}
              >
                <Face src={ex.original.src} label="Original" tone="muted" />
                <Face src={ex.cleaned.src} label="Cleaned" tone="brand" back />
              </span>
            </button>

            <div className="flex flex-col gap-1.5 px-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="type-h4">{ex.system}</p>
                <p className="type-data text-[11px] text-fg-subtle">{ex.kind}</p>
              </div>
              <p className={`type-body-sm transition-colors ${cleaned ? "text-fg-soft" : ""}`}>
                {cleaned ? ex.result : ex.problem}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {zoom && (
        <div
          role="dialog"
          aria-label={zoom.alt}
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-page/90 p-4 backdrop-blur-sm md:p-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom.src} alt={zoom.alt} className="max-h-full max-w-full rounded-lg border border-line bg-fg object-contain" />
          <span className="type-caption absolute right-4 top-4 rounded-md bg-surface px-3 py-1.5 text-fg-soft">Click anywhere to close</span>
        </div>
      )}
    </div>
  );
}

function Face({ src, label, tone, back }: { src: string; label: string; tone: "muted" | "brand"; back?: boolean }) {
  return (
    <span
      className="absolute inset-0 overflow-hidden rounded-xl border border-line bg-fg [backface-visibility:hidden]"
      style={back ? { transform: "rotateY(180deg)" } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.03]" />
      <span
        className={`type-data absolute left-3 top-3 rounded-sm px-2 py-1 text-[10px] uppercase tracking-[0.08em] ${
          tone === "brand" ? "bg-brand text-fg-inverse" : "bg-header/85 text-fg-soft"
        }`}
      >
        {label}
      </span>
    </span>
  );
}
