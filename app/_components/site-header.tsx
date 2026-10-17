const links = [
  { href: "#how", label: "How it works" },
  { href: "#compare", label: "Compare" },
  { href: "#pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line-subtle bg-header/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-6 px-6">
        <a href="#top" aria-label="Dropdone home" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dropdone-lockup.svg" alt="Dropdone" className="h-9 w-auto" />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="type-label text-fg-muted no-underline transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#join" className="btn-ghost no-underline">
          Join early access
        </a>
      </div>
    </header>
  );
}
