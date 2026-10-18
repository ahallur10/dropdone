"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePixelStrip } from "./pixel-divider";
import { PixelLayers } from "./pixel-layers";

// Every tab is its own page; the homepage also has short versions of each.
const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/compare", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
];

const SCROLL_THRESHOLD = 24;

// Floating bar: inset from the window edges, with the main call to action repeated
// from the hero so it's always one click away. Once you scroll, the wordmark slides
// away and the logo becomes the animated icon; back at the top it returns to normal.
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-6 rounded-xl border border-line bg-header/80 pl-4 pr-2.5 backdrop-blur-md">
        <Link
          href="/"
          aria-label="Dropdone home"
          className={`relative block h-11 shrink-0 transition-[width] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] ${
            scrolled ? "w-11" : "w-[106px]"
          }`}
        >
          {/* Full lockup: icon plus wordmark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/dropdone-lockup.svg"
            alt="Dropdone"
            className={`absolute left-0 top-1/2 h-9 w-auto max-w-none -translate-y-1/2 transition-opacity duration-200 ${
              scrolled ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* Animated icon, a little larger, shown once you've scrolled */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/dropdone-icon-animated.svg"
            alt=""
            aria-hidden="true"
            className={`absolute left-0 top-1/2 size-11 -translate-y-1/2 transition-[opacity,scale] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] ${
              scrolled ? "scale-100 opacity-100" : "pointer-events-none scale-[0.82] opacity-0"
            }`}
          />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`type-label relative no-underline transition-colors hover:text-fg ${active ? "text-fg" : "text-fg-muted"}`}
              >
                {l.label}
                {active && <ActivePixels seed={l.href.length} />}
              </Link>
            );
          })}
        </nav>
        <Link href="#join" className="btn-primary px-btn no-underline">
          <PixelLayers />
          Get early access
          <ArrowIcon />
        </Link>
      </div>
    </header>
  );
}

// The section dividers' pixel strip, shrunk down to mark the page you're on.
const NAV_STRIP = { pitch: 3, size: 2, rows: [0.42, 0.86, 0.6] };

function ActivePixels({ seed }: { seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  usePixelStrip(ref, { ...NAV_STRIP, seed });
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-2 top-full mt-1.5 block"
      style={{
        height: NAV_STRIP.rows.length * NAV_STRIP.pitch,
        width: "calc(100% + 1rem)",
        imageRendering: "pixelated",
        maskImage: "linear-gradient(to right, transparent, #000 22%, #000 78%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 22%, #000 78%, transparent)",
      }}
    />
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
