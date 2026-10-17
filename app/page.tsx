import Link from "next/link";
import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
import { Hero } from "./_components/hero";
import { TrustedBy } from "./_components/trusted-by";
import { Security } from "./_components/security";
import { FeatureCard } from "./_components/features";
import { DragDropDone } from "./_components/drag-drop-done";
import { Waitlist } from "./_components/waitlist";

const tiers = [
  {
    name: "Community",
    price: "Free",
    note: "Open source",
    features: [
      "Learn by example from your own workbook",
      "Full workbook and single sheet refresh",
      "Runs entirely on your computer",
    ],
  },
  {
    name: "Pro",
    price: "$20",
    unit: "/month",
    note: "Early access",
    badge: "pink",
    features: [
      "Everything in Community",
      "Adjusted refresh for up to 5 workbooks",
      "When an export's format changes, AI matches your original output",
    ],
  },
  {
    name: "Team",
    price: "Let's talk",
    note: "For larger orgs",
    features: [
      "Unlimited workbooks",
      "Shared setup across your team",
      "Help getting through IT approval",
    ],
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustedBy />

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
        <section id="features" className="scroll-mt-16 border-y border-line-subtle bg-section">
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

        <Security />

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-16 border-y border-line-subtle bg-section">
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 py-24 md:py-32">
            <div className="flex flex-col gap-4">
              <h2 className="max-w-[22ch]">Free to start. Open source at the core.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {tiers.map((t) => (
                <article key={t.name} className="card flex flex-col gap-6 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="type-h4">{t.name}</h3>
                    <span className={`badge shrink-0 whitespace-nowrap ${t.badge === "pink" ? "badge-pink" : "bg-surface-strong text-fg-soft"}`}>
                      {t.note}
                    </span>
                  </div>
                  <p className="flex items-baseline gap-1">
                    <span className="type-h2">{t.price}</span>
                    {t.unit && <span className="type-body-sm">{t.unit}</span>}
                  </p>
                  <ul className="flex flex-col gap-3 border-t border-line-subtle pt-6">
                    {t.features.map((f) => (
                      <li key={f} className="type-body-sm flex gap-2.5 text-fg-soft">
                        <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-[1px] bg-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className="type-caption">Planned pricing. It may change before launch.</p>
          </div>
        </section>

        {/* Waitlist */}
        <section id="join" className="scroll-mt-16">
          <div className="mx-auto grid max-w-site items-center gap-12 px-6 py-24 md:grid-cols-[auto_1fr] md:gap-16 md:py-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/dropdone-icon-animated.svg" alt="" className="size-28 md:size-40" />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h2 className="max-w-[20ch]">Stop cleaning the same report twice.</h2>
                <p className="type-lead max-w-[60ch] text-fg-muted">
                  Dropdone is coming to Mac and Windows. Leave your email and we&apos;ll send
                  the download when your spot opens.
                </p>
              </div>
              <Waitlist />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
