"use client";

import { useEffect, useRef, useState } from "react";

// Running total for the homepage (concept-site number). Counts up when it scrolls into
// view, then ticks up every few seconds so it reads as live.
const BASE_REPORTS = 48213;
const MIN_PER_REPORT = 20;

export function ReportsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [reports, setReports] = useState(BASE_REPORTS);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let tick: ReturnType<typeof setTimeout> | undefined;

    const scheduleTick = () => {
      tick = setTimeout(() => {
        setReports((r) => r + 1);
        scheduleTick();
      }, 2500 + Math.random() * 3500);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (reduced) return scheduleTick();
        // Count up over ~1.4s from 90% of the total.
        const from = Math.round(BASE_REPORTS * 0.9);
        const start = performance.now();
        const step = (now: number) => {
          const x = Math.min(1, (now - start) / 1400);
          const eased = 1 - Math.pow(1 - x, 3);
          setReports(Math.round(from + (BASE_REPORTS - from) * eased));
          if (x < 1) raf = requestAnimationFrame(step);
          else scheduleTick();
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      if (tick) clearTimeout(tick);
    };
  }, []);

  const hours = Math.round((reports * MIN_PER_REPORT) / 60);

  return (
    <div ref={ref} className="flex flex-wrap items-end justify-center gap-x-14 gap-y-6">
      <Stat value={reports} label="reports cleaned" live />
      <Stat value={hours} label="hours of cleanup saved" />
    </div>
  );
}

function Stat({ value, label, live }: { value: number; label: string; live?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="type-stat text-[clamp(2.75rem,2.2rem+2.2vw,4.25rem)]! text-fg">
        {value.toLocaleString("en-US")}
      </span>
      <span className="type-label flex items-center gap-2 text-fg-muted">
        {live && (
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-brand" />
          </span>
        )}
        {label}
      </span>
    </div>
  );
}
