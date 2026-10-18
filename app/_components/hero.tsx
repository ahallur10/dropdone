import Link from "next/link";
import { LegacySystems } from "./legacy-systems";
import { PixelLayers } from "./pixel-layers";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden lg:min-h-[min(100svh,calc(36vw+12rem))]">
      <div className="mx-auto flex w-full max-w-site flex-col gap-12 px-6 pb-8 pt-28 lg:pb-12 lg:pt-32">
        {/* Copy */}
        <div className="relative z-10 flex flex-col gap-6 lg:max-w-[46%]">
          <p className="type-eyebrow">For the export you clean every week</p>
          {/* Sized down from type-display so the headline fits half the width */}
          <h1 className="type-display text-[clamp(2.5rem,1.5rem+3vw,3.85rem)]!">
            Show it once.
            <br />
            <span className="text-brand">Drop it</span> forever.
          </h1>
          <p className="type-lead max-w-[40ch] text-fg-soft">
            Drop in the messy export. Get back the clean workbook. Every time.
          </p>
          <LegacySystems />
          <div className="flex flex-wrap items-center gap-3">
            <a className="btn-primary no-underline transition-colors hover:bg-fg-soft max-sm:w-full" href="#join">
              <DownloadIcon />
              Download for Mac and Windows
            </a>
            <a className="btn-primary px-btn no-underline max-sm:w-full" href="#join">
              <PixelLayers />
              Get early access
            </a>
          </div>
          <p className="type-caption flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-muted">
            <span>Free early access · Your files stay on your computer</span>
            <Link href="/how-it-works" className="text-fg-soft underline decoration-line-strong underline-offset-4 hover:text-fg">
              See how it works
            </Link>
          </p>
        </div>

        {/* Video: shown whole at its own 16:9 shape. On large screens it fills the right side
            of the hero, runs off the window edge, and fades into the page on its left, top and
            bottom edges so it reads as part of the page rather than a framed window. */}
        <div className="animate-fade-in relative aspect-[1928/1076] w-full overflow-hidden rounded-xl border border-line bg-surface lg:absolute lg:right-0 lg:top-1/2 lg:w-[64vw] lg:-translate-y-1/2 lg:rounded-none lg:border-0 lg:bg-transparent hero-fade">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dropdone-hero-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <video
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            src="/dropdone-hero.mp4"
            poster="/dropdone-hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-label="A broom slowly sweeping messy spreadsheet data on the left, while a robot vacuum clears a whole column on the right"
          />
        </div>
      </div>
    </section>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
