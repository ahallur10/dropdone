import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
import { JoinSection } from "./_components/join-section";
import { PixelDivider } from "./_components/pixel-divider";

export const metadata: Metadata = { title: "Page not found · Dropdone" };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <section>
          <div className="mx-auto flex max-w-site flex-col items-start gap-6 px-6 pb-20 pt-36 md:pb-24 md:pt-44">
            <span className="type-data text-sm text-brand">404</span>
            <h1 className="max-w-[16ch]">This page didn&apos;t make it through the cleanup.</h1>
            <p className="type-lead max-w-[52ch] text-fg-muted">
              The link may be old or mistyped. Everything else is right where you left it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="btn-ghost no-underline">
                Back to home
              </Link>
              <Link href="/how-it-works" className="btn-ghost no-underline">
                See how it works
              </Link>
            </div>
          </div>
        </section>
        <PixelDivider seed={21} />
        <JoinSection />
      </main>
      <SiteFooter />
    </>
  );
}
