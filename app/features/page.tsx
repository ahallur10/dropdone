import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";
import { PixelDivider } from "../_components/pixel-divider";
import {
  AskQuestion,
  ChecksBeforeSave,
  ContextVisual,
  FollowHub,
  LearnMorph,
  PlainEnglishVisual,
  ProFixVisual,
  UndoRestore,
} from "./visuals";
import { JoinSection } from "../_components/join-section";
import { CarouselDots } from "./carousel-dots";

export const metadata: Metadata = {
  title: "Features · Dropdone",
  description:
    "Dropdone learns from one example, writes every step in plain English, keeps the context of your cleanup, asks instead of guessing, and updates your workbook in place.",
};

type Tone = "surface" | "deep" | "brand";

const toneClass: Record<Tone, string> = {
  surface: "border-line-subtle bg-surface",
  deep: "border-line-subtle bg-header",
  brand: "border-brand/25 bg-brand-a10",
};

// A bento tile: title and one line on top, the visual centered in the space below it.
function Tile({
  title,
  body,
  visual,
  span,
  tall,
  tone = "surface",
  badge,
}: {
  title: string;
  body: string;
  visual: ReactNode;
  /** Column span on large screens, out of 6. */
  span: 2 | 3 | 4;
  tall?: boolean;
  tone?: Tone;
  badge?: ReactNode;
}) {
  const spanClass = { 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "md:col-span-2 lg:col-span-4" }[span];
  // On phones each card is one slide of the carousel.
  const slide = "max-md:w-[86%] max-md:shrink-0 max-md:snap-center";
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border ${toneClass[tone]} ${spanClass} ${slide} ${
        // The minimum heights only matter for lining up the desktop grid; phones size to content.
        tall ? "md:min-h-[520px]" : "md:min-h-[440px]"
      }`}
    >
      <div className="flex flex-col gap-2 p-6 pb-0 md:p-7 md:pb-0">
        {badge}
        <h2 className="type-h4">{title}</h2>
        <p className="type-body-sm max-w-[46ch]">{body}</p>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-6 md:px-6 md:py-8">
        {/* A touch smaller on phones so each card takes less of the screen */}
        <div className="flex w-full justify-center max-sm:[zoom:0.88]">{visual}</div>
      </div>
    </article>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Header */}
        <section>
          <div className="mx-auto flex max-w-site flex-wrap items-end justify-between gap-8 px-6 pb-12 pt-36 md:pt-44">
            <div className="flex max-w-[640px] flex-col gap-6">
              <h1>
                One job, done the way you&apos;d{" "}
                <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">do it</span>.
              </h1>
              <p className="type-lead text-fg-muted">
                No formulas, queries or macros to write. Show Dropdone a report you already cleaned, and it does that
                same cleanup every week, then checks its work.
              </p>
            </div>
          </div>
        </section>

        {/* Bento */}
        {/* Phones: a sideways swipe carousel with position dots. Tablets and up: the bento grid. */}
        <section className="pb-24 md:pb-32">
          <p className="type-caption mx-auto max-w-site px-6 pb-3 md:hidden">Swipe to see all 8 features →</p>
          <div
            id="feature-cards"
            className="mx-auto flex max-w-site snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:none] md:grid md:snap-none md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden"
          >
            <Tile
              span={4}
              tall
              title="Learns from one example"
              body="Give it the messy export and the version you cleaned by hand. It works out every step, so nobody writes rules."
              visual={<LearnMorph />}
            />
            <Tile
              span={2}
              tall
              tone="deep"
              title="Every step in plain English"
              body="Read exactly what it will do before it does it."
              visual={<PlainEnglishVisual />}
            />

            <Tile
              span={2}
              title="Keeps the context"
              body="It knows what a client ID looks like, so a header that moves rows doesn't break anything."
              visual={<ContextVisual />}
            />
            <Tile
              span={4}
              tone="deep"
              title="Follows the file"
              body="SharePoint, Downloads or a shared drive. Wherever the workbook lives, or moves to, Dropdone keeps it updated."
              visual={<FollowHub />}
            />

            <Tile
              span={3}
              title="Asks instead of guessing"
              body="When two rules could explain your cleanup, it asks one quick question. Not sure is always an option."
              visual={<AskQuestion />}
            />
            <Tile
              span={3}
              tone="deep"
              title="Undo any update"
              body="A backup is saved before every write. Press Restore and the workbook goes back to last week's version."
              visual={<UndoRestore />}
            />

            <Tile
              span={2}
              title="Checks before it saves"
              body="If anything looks off, nothing is written until you decide."
              visual={<ChecksBeforeSave />}
            />
            <Tile
              span={4}
              tone="brand"
              badge={<span className="badge badge-lime self-start">Pro</span>}
              title="When an export changes, Pro proposes the fix"
              body="Community stops safely and you teach it again. Pro's adjusted refresh suggests the change, and nothing is saved until you approve."
              visual={<ProFixVisual />}
            />
          </div>
          <CarouselDots targetId="feature-cards" count={8} />
        </section>

        {/* Join */}
        <PixelDivider seed={5} />
        <JoinSection secondary={{ href: "/how-it-works", label: "See how it works" }} />
      </main>
      <SiteFooter />
    </>
  );
}
