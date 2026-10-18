"use client";

import { useEffect, useRef, useState } from "react";

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

  // Phones flip each card on its own (tap, or swipe either way). Each card keeps its own
  // rotation so a swipe turns it in the direction of the swipe. Larger screens use the toggle.
  const [phone, setPhone] = useState(false);
  const [angles, setAngles] = useState([0, 0, 0]);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 47.99rem)");
    const apply = () => setPhone(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const flip = (i: number, dir: 1 | -1 = 1) => setAngles((a) => a.map((v, j) => (j === i ? v + dir * 180 : v)));
  const isCleaned = (i: number) => (phone ? Math.abs(angles[i] / 180) % 2 === 1 : cleaned);

  const closeRef = useRef<HTMLButtonElement>(null);

  // While the lightbox is open: Escape closes it, the page behind doesn't scroll, focus
  // moves to the close button, and goes back to the card that opened it afterwards.
  useEffect(() => {
    if (!zoom) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [zoom]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        {/* Same size and underline treatment as the page's opening headline */}
        <div className="flex flex-col gap-4">
          {/* Extra leading so the underlined "clean" doesn't crowd the line above */}
          <h2 className="type-h1 max-w-[18ch] leading-[1.2]!">
            Three different systems. One{" "}
            <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">clean</span> result.
          </h2>
          <p className="type-body max-w-[54ch] text-fg-muted">
            These are just three examples, not a list of what&apos;s supported. If your system exports the same report
            each time, Dropdone can learn its cleanup.
          </p>
        </div>
        <div
          role="group"
          aria-label="Show the exports"
          className="hidden grid-cols-2 gap-1 rounded-lg border border-line bg-surface p-1 md:grid">
          {(["original", "cleaned"] as Side[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={side === s}
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

      <p className="type-label -mt-2 flex items-center gap-2 text-brand md:hidden">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 12a8 8 0 0 1 13.6-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.6 5.7L4 15.5M4 20v-4.5h4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Tap or swipe a card to see it cleaned
      </p>

      <ul className="grid gap-4 md:grid-cols-3">
        {examples.map((ex, i) => (
          <li key={ex.system} className="relative flex flex-col gap-4">
            {/* Flip card: on phones a tap or swipe flips it; on larger screens it opens full size */}
            <button
              onClick={() => {
                if (phone) return flip(i);
                const face = cleaned ? ex.cleaned : ex.original;
                setZoom({ src: face.src, alt: `${ex.system} ${ex.kind}, ${side}` });
              }}
              onTouchStart={(e) => {
                touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
              }}
              onTouchEnd={(e) => {
                const start = touch.current;
                touch.current = null;
                if (!phone || !start) return;
                const dx = e.changedTouches[0].clientX - start.x;
                const dy = e.changedTouches[0].clientY - start.y;
                // A sideways swipe flips the card that way; the tap that follows is ignored.
                if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                  e.preventDefault();
                  flip(i, dx > 0 ? 1 : -1);
                }
              }}
              className={`group relative block h-72 w-full touch-pan-y [perspective:1400px] ${phone ? "cursor-pointer" : "cursor-zoom-in"}`}
              aria-label={
                phone
                  ? `${ex.system} ${ex.kind}: showing the ${isCleaned(i) ? "cleaned" : "original"} version. Tap to flip.`
                  : `${ex.system} ${ex.kind}: view the ${side} version full size`
              }
            >
              <span
                className="relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
                style={{
                  transform: phone ? `rotateY(${angles[i]}deg)` : cleaned ? "rotateY(180deg)" : "none",
                  transitionDelay: phone ? "0ms" : `${i * 120}ms`,
                }}
              >
                <Face src={ex.original.src} label="Original" tone="muted" />
                <Face src={ex.cleaned.src} label="Cleaned" tone="brand" back />
              </span>
            </button>
            {phone && (
              <button
                type="button"
                onClick={() => {
                  const face = isCleaned(i) ? ex.cleaned : ex.original;
                  setZoom({ src: face.src, alt: `${ex.system} ${ex.kind}, ${isCleaned(i) ? "cleaned" : "original"}` });
                }}
                aria-label={`View the ${ex.system} ${isCleaned(i) ? "cleaned" : "original"} version full size`}
                className="absolute right-2.5 top-2.5 z-10 flex size-9 cursor-zoom-in items-center justify-center rounded-md bg-page/80 text-fg backdrop-blur"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <div className="flex flex-col gap-1.5 px-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="type-h4">{ex.system}</p>
                <p className="type-data text-[11px] text-fg-subtle">{ex.kind}</p>
              </div>
              <p className={`type-body-sm transition-colors ${isCleaned(i) ? "text-fg-soft" : ""}`}>
                {isCleaned(i) ? ex.result : ex.problem}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoom.alt}
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-page/90 p-4 backdrop-blur-sm md:p-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom.src} alt={zoom.alt} className="max-h-full max-w-full rounded-lg border border-line bg-fg object-contain" />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setZoom(null)}
            className="type-caption absolute right-4 top-4 cursor-pointer rounded-md bg-surface px-3 py-1.5 text-fg-soft hover:text-fg"
          >
            Close <span className="text-fg-subtle">· Esc</span>
          </button>
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
