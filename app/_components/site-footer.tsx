import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="bg-header">
      <div className="mx-auto flex max-w-site flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <Link href="/" aria-label="Dropdone home" className="self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dropdone-lockup.svg" alt="Dropdone" className="h-10 w-auto" />
        </Link>
        <p className="type-caption">
          © 2026 Dropdone. Made in Phoenix for everyone who&apos;s ever fixed the same export twice.
        </p>
      </div>
    </footer>
  );
}
