// "Trusted by" logo carousel. These counties are fictional, with emblems drawn here,
// for the hackathon concept site. Swap in real names and logo files (set `logo`) only
// once an organization has agreed in writing to be listed.

import { ComplianceBadges } from "./compliance-badges";
import { ReportsCounter } from "./reports-counter";

type Emblem = "mountain" | "pine" | "wave" | "sun" | "cactus" | "star" | "river" | "wheat";

// `reports` is reports cleaned in the last 12 months (fictional, like the counties).
const counties: { name: string; state: string; emblem: Emblem; reports: number; logo?: string }[] = [
  { name: "Saguaro Flats County", state: "AZ", emblem: "cactus", reports: 3812 },
  { name: "Pinecrest County", state: "OR", emblem: "pine", reports: 2577 },
  { name: "Copper Basin County", state: "NM", emblem: "mountain", reports: 1236 },
  { name: "Lakeshore County", state: "MI", emblem: "wave", reports: 5940 },
  { name: "Juniper Hills County", state: "NV", emblem: "sun", reports: 918 },
  { name: "Harborview County", state: "WA", emblem: "river", reports: 6604 },
  { name: "Prairie Bend County", state: "KS", emblem: "wheat", reports: 1610 },
  { name: "Lone Star Valley County", state: "TX", emblem: "star", reports: 4402 },
];

// Each report used to take about 20 minutes of hand cleanup.
const hoursSaved = (reports: number) => Math.round((reports * 20) / 60);
const fmt = (n: number) => n.toLocaleString("en-US");

export function TrustedBy() {
  return (
    <section aria-label="Trusted by" className="border-b border-line-subtle bg-section">
      <div className="mx-auto flex max-w-site flex-col items-center gap-8 px-6 pb-10 pt-16">
        <ReportsCounter />
        <p className="text-center font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.6rem)] font-extrabold tracking-[-0.015em] text-fg-soft">
          Trusted by county and city teams
        </p>
      </div>
      {/* overflow-x-clip (not hidden) so the hover cards can hang below the strip */}
      <div className="group/strip relative z-20 overflow-x-clip pb-4">
        {/* Edge fades so logos slide in and out instead of being cut off */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-section to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-section to-transparent" />
        <ul className="animate-marquee flex w-max group-hover/strip:[animation-play-state:paused] group-focus-within/strip:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          {[...counties, ...counties].map((c, i) => {
            const copy = i >= counties.length;
            return (
              <li
                key={`${c.name}-${i}`}
                aria-hidden={copy}
                tabIndex={copy ? -1 : 0}
                className={`group/county relative flex shrink-0 cursor-default items-center gap-3 pr-14 text-fg-muted outline-none transition-colors hover:text-fg focus-visible:text-fg ${
                  copy ? "motion-reduce:hidden" : ""
                }`}
              >
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logo} alt="" className="h-10 w-auto" />
                ) : (
                  <Seal emblem={c.emblem} />
                )}
                <span className="flex flex-col leading-tight">
                  <span className="font-display text-[15px] font-bold tracking-[-0.01em]">{c.name}</span>
                  <span className="type-data text-[10px] uppercase tracking-[0.12em] text-fg-subtle">{c.state}</span>
                </span>

                {/* Hover card */}
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-0 top-full z-30 mt-3 flex w-60 translate-y-1 flex-col gap-3 rounded-lg border border-line bg-surface-strong p-4 opacity-0 transition-[opacity,transform] duration-200 group-hover/county:translate-y-0 group-hover/county:opacity-100 group-focus-visible/county:translate-y-0 group-focus-visible/county:opacity-100"
                >
                  <span className="type-data text-[10px] uppercase tracking-[0.08em] text-fg-subtle">Last 12 months</span>
                  <span className="grid grid-cols-2 gap-3">
                    <span className="flex flex-col gap-0.5">
                      <span className="font-display text-2xl font-black italic tabular-nums tracking-[-0.02em] text-brand">
                        {fmt(hoursSaved(c.reports))}
                      </span>
                      <span className="type-caption text-fg-soft">hours saved</span>
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-display text-2xl font-black italic tabular-nums tracking-[-0.02em] text-fg">
                        {fmt(c.reports)}
                      </span>
                      <span className="type-caption text-fg-soft">reports cleaned</span>
                    </span>
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <ComplianceBadges />
    </section>
  );
}

function Seal({ emblem }: { emblem: Emblem }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="14.5" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.5 2" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {emblemPaths[emblem]}
      </g>
    </svg>
  );
}

const emblemPaths: Record<Emblem, React.ReactNode> = {
  mountain: <path d="M11 26 17.5 15l3.5 6 2.5-3.5L29 26Z" />,
  pine: (
    <>
      <path d="M20 12 14.5 20h3l-4 5.5h13l-4-5.5h3Z" />
      <path d="M20 25.5V29" />
    </>
  ),
  wave: (
    <>
      <path d="M12 18c2.7 0 2.7-2 5.3-2s2.7 2 5.4 2 2.6-2 5.3-2" />
      <path d="M12 23c2.7 0 2.7-2 5.3-2s2.7 2 5.4 2 2.6-2 5.3-2" />
    </>
  ),
  sun: (
    <>
      <circle cx="20" cy="22" r="4" />
      <path d="M12 26h16M20 13.5v2.5M14 16.5l1.6 1.6M26 16.5l-1.6 1.6" />
    </>
  ),
  cactus: (
    <>
      <path d="M20 28V13.5a2 2 0 0 1 2 2V28" />
      <path d="M20 21h-3a1.5 1.5 0 0 1-1.5-1.5V17M22 19.5h2.5A1.5 1.5 0 0 0 26 18v-2.5" />
      <path d="M14 28h12" />
    </>
  ),
  star: <path d="m20 12.5 2.3 4.8 5.2.7-3.8 3.6.9 5.2-4.6-2.5-4.6 2.5.9-5.2-3.8-3.6 5.2-.7Z" />,
  river: (
    <>
      <path d="M13 27c4-2 2-5 6-7s5-4 3-7" />
      <path d="M17 28c4-2 2-5 6-7s4-3 4-5" />
    </>
  ),
  wheat: (
    <>
      <path d="M20 29V13" />
      <path d="M20 17c-2-.3-3-1.5-3-3.3 2 .3 3 1.5 3 3.3ZM20 17c2-.3 3-1.5 3-3.3-2 .3-3 1.5-3 3.3ZM20 22c-2-.3-3-1.5-3-3.3 2 .3 3 1.5 3 3.3ZM20 22c2-.3 3-1.5 3-3.3-2 .3-3 1.5-3 3.3Z" />
    </>
  ),
};
