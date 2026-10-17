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
      {/* Scrim so type stays readable over the bright spreadsheet footage */}
      <div className="absolute inset-0 -z-10 bg-page/65" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-linear-to-t from-page to-transparent" />

      {/* Labels for each half of the split-screen video */}
      <div className="pointer-events-none absolute inset-x-0 top-24 hidden grid-cols-2 sm:grid">
        <span className="type-data justify-self-center rounded-sm bg-glass px-2.5 py-1 text-xs uppercase tracking-[0.08em] text-fg-soft backdrop-blur">
          By hand · 20 min, every week
        </span>
        <span className="type-data justify-self-center rounded-sm bg-glass px-2.5 py-1 text-xs uppercase tracking-[0.08em] text-brand backdrop-blur">
          Dropdone · one drop
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-site flex-col gap-6 px-6 pb-20 pt-40 md:pb-28">
        <p className="type-eyebrow">For the export you clean every week</p>
        <h1 className="type-display">
          Show it once.
          <br />
          <span className="text-brand">Drop it</span> forever.
        </h1>
        <p className="type-lead max-w-[60ch] text-fg-soft">
          Drag the messy export onto Dropdone. Your Excel workbook updates itself,
          wherever it lives. No formulas, no macros, no rules to write.
        </p>
        <div className="flex flex-wrap gap-3">
          <a className="btn-brand no-underline" href="#join">
            <DownloadIcon />
            Download for Mac and Windows
          </a>
          <a className="btn-ghost no-underline" href="#how">
            See how it works
          </a>
        </div>
        <p className="type-caption text-fg-muted">
          Free early access · Your files stay on your computer
        </p>
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
