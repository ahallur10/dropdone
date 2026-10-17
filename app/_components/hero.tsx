import Link from "next/link";
import { LegacySystems } from "./legacy-systems";

export function Hero() {
  return (
    <section id="top" className="flex min-h-[100svh] items-center">
      <div className="mx-auto grid w-full max-w-site items-center gap-12 px-6 pb-20 pt-28 lg:grid-cols-[1.08fr_1fr] lg:gap-14 lg:pb-24 lg:pt-32">
        {/* Copy */}
        <div className="flex flex-col gap-6">
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
            <a className="btn-brand no-underline" href="#join">
              <DownloadIcon />
              Download for Mac and Windows
            </a>
            <a className="btn-primary no-underline" href="#join">
              Join the waitlist
            </a>
          </div>
          <p className="type-caption flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-muted">
            <span>Free early access · Your files stay on your computer</span>
            <Link href="/how-it-works" className="text-fg-soft underline decoration-line-strong underline-offset-4 hover:text-fg">
              See how it works
            </Link>
          </p>
        </div>

        {/* Video: shown whole, at its own 16:9 shape, so nothing gets cropped */}
        <div className="animate-fade-in relative aspect-[1928/1076] w-full overflow-hidden rounded-xl border border-line bg-surface">
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
