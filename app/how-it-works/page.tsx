import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";
import { CleanSheet, MessySheet } from "./sheets";
import { StepExplorer, type ExplorerStep } from "./step-explorer";
import { BeforeAfterToggle, DropOnRecipe, ReviewSteps, VerifyRun } from "./step-visuals";
import { ExportFlip } from "./export-flip";

export const metadata: Metadata = {
  title: "How it works · Dropdone",
  description:
    "Clean one export by hand. Give Dropdone the before and after. It writes the steps in plain English, then runs them on every new export and checks the result before saving.",
};

const steps: ExplorerStep[] = [
  {
    n: 1,
    tag: "Setup",
    title: "Show it once",
    line: "Clean one export by hand like you always do. Give Dropdone the before and after.",
    visual: <BeforeAfterToggle before={<MessySheet />} after={<CleanSheet />} />,
  },
  {
    n: 2,
    tag: "Setup",
    title: "Review the steps",
    line: "Every step in plain English, plus a context file of what each column means. Unsure? It asks one question.",
    visual: <ReviewSteps />,
  },
  {
    n: 3,
    tag: "Every week",
    title: "Drop the next export",
    line: "Next week, drag the new export onto its recipe. Same cleanup, no clicks.",
    visual: <DropOnRecipe />,
  },
  {
    n: 4,
    tag: "Every week",
    title: "Verify",
    line: "It checks the result against your workbook before saving anything.",
    visual: <VerifyRun />,
  },
];

export default function HowItWorks() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Intro */}
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-6 px-6 pb-16 pt-36 md:pb-20 md:pt-44">
            <h1 className="max-w-[18ch]">
              Show it once. Then just{" "}
              <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">drop</span>.
            </h1>
            <p className="type-lead max-w-[60ch] text-fg-muted">
              Clean one export by hand like you always do. Dropdone learns the rules behind your cleanup, not the
              row numbers, so next week&apos;s export comes out the same way.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section>
          <div className="mx-auto max-w-site px-6 pb-24 md:pb-32">
            <StepExplorer steps={steps} />
          </div>
        </section>

        {/* Three different exports, one clean result */}
        <section className="border-y border-line-subtle bg-section">
          <div className="mx-auto max-w-site px-6 py-20 md:py-28">
            <ExportFlip />
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto flex max-w-site flex-col items-start gap-6 px-6 py-24 md:py-32">
            <h2 className="max-w-[20ch]">Have your first recipe ready by next week.</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/#join" className="btn-primary no-underline">
                Get early access
              </Link>
              <Link href="/features" className="btn-ghost no-underline">
                See all features
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
