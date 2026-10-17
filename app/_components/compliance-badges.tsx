// Compliance badges shown under the Trusted by carousel.
// FERPA, HIPAA, GLBA and CCPA are laws with no official logos, and the FBI (CJIS) and NIST
// restrict use of their seals, so these are one consistent set of badges drawn here.
// They say what Dropdone is designed for, not that it's been audited or certified.

const badges = [
  { name: "FERPA", detail: "Student records" },
  { name: "HIPAA", detail: "Health information" },
  { name: "CJIS", detail: "Criminal justice data" },
  { name: "GLBA", detail: "Financial records" },
  { name: "NIST 800-53", detail: "Security controls" },
  { name: "CCPA", detail: "Consumer privacy" },
];

export function ComplianceBadges() {
  return (
    <div className="mx-auto flex max-w-site flex-col items-center gap-5 px-6 pb-16 pt-10">
      <p className="type-caption text-fg-muted">Designed for teams handling regulated data</p>
      <ul className="flex flex-wrap justify-center gap-3">
        {badges.map((b) => (
          <li
            key={b.name}
            className="flex items-center gap-3 rounded-lg border border-line bg-surface py-2.5 pl-3 pr-4"
          >
            <ShieldMark />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-[15px] font-extrabold tracking-[-0.01em] text-fg">{b.name}</span>
              <span className="type-data text-[10px] uppercase tracking-[0.08em] text-fg-subtle">{b.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShieldMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0 text-brand">
      <path
        d="M14 3 5 6.5v6.2c0 5.4 3.8 9.9 9 11.3 5.2-1.4 9-5.9 9-11.3V6.5L14 3Z"
        fill="var(--color-brand-a10)"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m10 14 3 3 5.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
