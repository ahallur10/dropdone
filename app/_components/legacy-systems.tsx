"use client";

import { useEffect, useState } from "react";

/*
 * "Clean data from ___" with a rotating list of legacy systems.
 * To show a real logo, drop the vendor's official file in /public/logos and set `logo`.
 * Until then each system shows a neutral monogram. Check each vendor's trademark
 * guidelines before using their logo; naming the system is the safer default.
 */
const systems: { name: string; monogram: string; logo?: string }[] = [
  { name: "Tyler Munis", monogram: "TM" },
  { name: "Oracle PeopleSoft", monogram: "PS" },
  { name: "Crystal Reports", monogram: "CR" },
];

const ROTATE_MS = 2400;

export function LegacySystems() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % systems.length), ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <p className="type-lead flex flex-wrap items-center gap-x-3 gap-y-2 text-fg-soft">
      Clean data from
      <span className="relative inline-flex h-10 w-[15.5rem] overflow-hidden rounded-md border border-line bg-glass backdrop-blur">
        <span
          className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
          style={{ transform: `translateY(-${i * 2.5}rem)` }}
        >
          {systems.map((s) => (
            <span key={s.name} className="flex h-10 items-center gap-2.5 px-2.5">
              {s.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.logo} alt="" className="h-6 w-auto" />
              ) : (
                <span className="type-data flex size-6 shrink-0 items-center justify-center rounded-sm bg-surface-strong text-[10px] text-fg-soft">
                  {s.monogram}
                </span>
              )}
              <span className="type-label whitespace-nowrap text-fg">{s.name}</span>
            </span>
          ))}
        </span>
      </span>
      <span className="sr-only">Works with exports from {systems.map((s) => s.name).join(", ")}.</span>
    </p>
  );
}
