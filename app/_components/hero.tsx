import Link from "next/link";
import { LegacySystems } from "./legacy-systems";
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dropdone-hero-poster.jpg"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover bg-page motion-reduce:hidden"
        src="/dropdone-hero.mp4"
        poster="/dropdone-hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      {/* Light scrim: enough to read the type, light enough that the footage stays the star */}
      <div className="absolute inset-0 -z-10 bg-page/50" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-linear-to-t from-page to-transparent" />

      <div className="mx-auto flex w-full max-w-site flex-col gap-6 px-6 pb-36 pt-32 md:pb-48">
        <p className="type-eyebrow">For the export you clean every week</p>
        <h1 className="type-display">
          Show it once.
          <br />
          <span className="text-brand">Drop it</span> forever.
        </h1>
        <p className="type-lead max-w-[44ch] text-fg">
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
          <Link
            className="type-label px-2 text-fg-soft underline decoration-line-strong underline-offset-4 hover:text-fg"
            href="/how-it-works"
          >
            See how it works
          </Link>
        </div>
        <p className="type-caption text-fg-soft">Free early access · Your files stay on your computer</p>
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
