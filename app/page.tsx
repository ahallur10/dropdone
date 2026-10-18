import Link from "next/link";
import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
import { PixelDivider } from "./_components/pixel-divider";
import { Hero } from "./_components/hero";
import { TrustedBy } from "./_components/trusted-by";
import { Security } from "./_components/security";
import { FeatureCard } from "./_components/features";
import { PricingTiers } from "./_components/pricing-tiers";
import { DragDropDone } from "./_components/drag-drop-done";
import { JoinSection } from "./_components/join-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustedBy />
        <PixelDivider seed={14} />

        {/* How it works */}
        <section id="how" className="scroll-mt-16">
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 py-24 md:py-32">
            <div className="flex flex-col gap-4">
              <h2>
                Drag. Drop. <span className="text-brand">Done.</span>
              </h2>
              <p className="type-lead max-w-[60ch] text-fg-muted">
                Show Dropdone your finished workbook once. After that, every messy report goes in one
                side and comes out the other already cleaned.
              </p>
            </div>
            <DragDropDone />
          </div>
        </section>

        {/* Features */}
        <PixelDivider seed={1} />
        <section id="features" className="scroll-mt-16">
          <div className="mx-auto flex max-w-site flex-col gap-10 px-6 py-24 md:py-32">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col gap-4">
                <h2 className="max-w-[22ch]">Does the job the way you would. Then checks it.</h2>
              </div>
              <Link href="/features" className="btn-ghost no-underline">
                See all features
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard feature="learn" />
              <FeatureCard feature="ask" />
              <FeatureCard feature="inPlace" />
            </div>
          </div>
        </section>
        <PixelDivider seed={2} />

        <Security />

        {/* Pricing */}
        <PixelDivider seed={3} />
        <section id="pricing" className="scroll-mt-16">
          <div className="mx-auto flex max-w-site flex-col gap-10 px-6 py-24 md:py-32">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-[22ch]">Free to start. Pro keeps it working.</h2>
              <Link href="/pricing" className="btn-ghost no-underline">
                Compare plans
              </Link>
            </div>
            <PricingTiers />
          </div>
        </section>
        <PixelDivider seed={4} />

        {/* Join */}
        <JoinSection />
      </main>

      <SiteFooter />
    </>
  );
}
