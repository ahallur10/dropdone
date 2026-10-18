// Security standard badges shown under the Trusted by carousel (concept site).
// These are drawn here on purpose: the AICPA's SOC logo is only licensed to organizations
// with a completed SOC report, and ISO doesn't allow its logo on certification claims.
// Swap in the auditor-issued marks once real audits exist.

const badges = [
  {
    name: "SOC 2 Type II",
    detail: "Security, availability and confidentiality controls",
    seal: { top: "SOC 2", bottom: "TYPE II" },
  },
  {
    name: "ISO/IEC 27001",
    detail: "Information security management",
    seal: { top: "ISO", bottom: "27001" },
  },
];

export function ComplianceBadges() {
  return (
    <div className="mx-auto flex max-w-site flex-col items-center gap-5 px-6 pb-16 pt-10">
      <p className="type-caption text-fg-muted">Security standards</p>
      {/* Equal-width cards: stacked on phones, side by side from tablets up */}
      <ul className="grid w-full max-w-[400px] gap-3 sm:max-w-[640px] sm:grid-cols-2 sm:gap-4">
        {badges.map((b) => (
          <li key={b.name} className="flex items-center gap-4 rounded-xl border border-line bg-surface py-3 pl-3 pr-6">
            <Seal top={b.seal.top} bottom={b.seal.bottom} />
            <span className="flex flex-col gap-1 leading-tight">
              <span className="font-display text-lg font-extrabold tracking-[-0.01em] text-fg">{b.name}</span>
              <span className="type-caption max-w-[26ch] text-fg-soft">{b.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Seal({ top, bottom }: { top: string; bottom: string }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="32" cy="32" r="30" fill="var(--color-brand-a10)" stroke="var(--color-brand)" strokeWidth="2" />
      <circle cx="32" cy="32" r="24.5" stroke="var(--color-brand)" strokeWidth="0.75" strokeDasharray="2 2.5" />
      {/* Check mark tucked at the top of the ring */}
      <path d="m27.5 13 3 3 6-6" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text
        x="32"
        y="34"
        textAnchor="middle"
        fill="var(--color-fg)"
        style={{ font: "800 12.5px var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {top}
      </text>
      <text
        x="32"
        y="45"
        textAnchor="middle"
        fill="var(--color-brand)"
        style={{ font: "500 7.5px var(--font-mono)", letterSpacing: "0.08em" }}
      >
        {bottom}
      </text>
    </svg>
  );
}
