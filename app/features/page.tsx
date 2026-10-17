import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";
import { FeatureCard, type FeatureKey } from "../_components/features";

export const metadata: Metadata = {
  title: "Features · Dropdone",
  description:
    "Dropdone learns from one example, watches your folders, asks before saving, and updates your workbook in place, all on your own computer.",
};

const groups: { eyebrow: string; title: string; features: FeatureKey[] }[] = [
  {
    eyebrow: "Set up once",
    title: "It learns the job by watching you do it once.",
    features: ["learn", "watch"],
  },
  {
    eyebrow: "Every drop after that",
    title: "It does the job the same way, and checks its work.",
    features: ["ask", "inPlace"],
  },
  {
    eyebrow: "Built for real offices",
    title: "Shared drives, moved files, and IT rules included.",
    features: ["follow", "local"],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-line-subtle">
          <div className="mx-auto flex max-w-site flex-col gap-6 px-6 pb-16 pt-36 md:pb-20 md:pt-44">
            <p className="type-eyebrow">Features</p>
            <h1 className="max-w-[20ch]">One job, done the way you&apos;d do it.</h1>
            <p className="type-lead max-w-[60ch] text-fg-muted">
              Dropdone doesn&apos;t ask you to write formulas, build queries or learn a new tool. Here&apos;s
              everything it does after you show it a workbook once.
            </p>
          </div>
        </section>

        {groups.map((g, i) => (
          <section key={g.eyebrow} className={i % 2 === 1 ? "border-y border-line-subtle bg-section" : ""}>
            <div className="mx-auto flex max-w-site flex-col gap-10 px-6 py-20 md:py-24">
              <div className="flex flex-col gap-4">
                <p className="type-eyebrow">{g.eyebrow}</p>
                <h2 className="max-w-[24ch]">{g.title}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {g.features.map((f) => (
                  <FeatureCard key={f} feature={f} />
                ))}
              </div>
            </div>
          </section>
        ))}

        <section>
          <div className="mx-auto flex max-w-site flex-col items-start gap-6 px-6 py-24 md:py-32">
            <p className="type-eyebrow">Early access</p>
            <h2 className="max-w-[20ch]">Stop cleaning the same report twice.</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/#join" className="btn-brand no-underline">
                Join early access
              </Link>
              <Link href="/how-it-works" className="btn-ghost no-underline">
                See how it works
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
