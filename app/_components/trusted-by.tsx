// "Trusted by" logo carousel. These counties are fictional, with emblems drawn here,
// for the hackathon concept site. Swap in real names and logo files (set `logo`) only
// once an organization has agreed in writing to be listed.

type Emblem = "mountain" | "pine" | "wave" | "sun" | "cactus" | "star" | "river" | "wheat";

const counties: { name: string; state: string; emblem: Emblem; logo?: string }[] = [
  { name: "Saguaro Flats County", state: "AZ", emblem: "cactus" },
  { name: "Pinecrest County", state: "OR", emblem: "pine" },
  { name: "Copper Basin County", state: "NM", emblem: "mountain" },
  { name: "Lakeshore County", state: "MI", emblem: "wave" },
  { name: "Juniper Hills County", state: "NV", emblem: "sun" },
  { name: "Harborview County", state: "WA", emblem: "river" },
  { name: "Prairie Bend County", state: "KS", emblem: "wheat" },
  { name: "Lone Star Valley County", state: "TX", emblem: "star" },
];

export function TrustedBy() {
  return (
    <section aria-label="Trusted by" className="border-b border-line-subtle bg-section">
      <div className="mx-auto flex max-w-site flex-col gap-8 px-6 py-14">
        <p className="type-eyebrow text-center text-fg-muted">Trusted by county and city teams</p>
      </div>
      <div className="group relative overflow-hidden pb-14">
        {/* Edge fades so logos slide in and out instead of being cut off */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-section to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-section to-transparent" />
        <ul className="animate-marquee flex w-max group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          {[...counties, ...counties].map((c, i) => (
            <li
              key={`${c.name}-${i}`}
              aria-hidden={i >= counties.length}
              className={`flex shrink-0 items-center gap-3 pr-14 text-fg-muted transition-colors hover:text-fg ${
                i >= counties.length ? "motion-reduce:hidden" : ""
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
            </li>
          ))}
        </ul>
      </div>
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
