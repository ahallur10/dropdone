// Security section for IT reviewers. Laid out like the one-page datasheet an IT team
// actually asks for: a boundary diagram of where data goes, and the controls as a spec
// sheet with plain answers. The certifications sit under the Trusted by carousel.

const spec = [
  { label: "Where cleaning runs", value: "On your computer", note: "Works with the network unplugged." },
  { label: "Data sent to Dropdone", value: "None", note: "No upload to us, no cloud copy of your records." },
  { label: "Source code", value: "Open", note: "Community edition, readable by your IT team." },
  { label: "Installers", value: "Code-signed", note: "Mac and Windows, no security workarounds." },
  { label: "Before every write", value: "Previous version saved", note: "Any change can be undone." },
  { label: "Telemetry", value: "Off by default", note: "No analytics on your files or their contents." },
];

export function Security() {
  return (
    <section id="security" className="scroll-mt-16">
      <div className="mx-auto grid max-w-site grid-cols-1 gap-14 px-6 py-24 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="flex min-w-0 flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-5">
            <h2 className="max-w-[16ch]">
              Built to pass your{" "}
              <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">IT review</span>.
            </h2>
            <p className="type-lead max-w-[46ch] text-fg-muted">
              Client, student and financial records stay where they already are: on your organization&apos;s
              computers.
            </p>
          </div>
          <Boundary />
        </div>

        <div className="min-w-0 rounded-2xl border border-line-subtle bg-header">
          <div className="flex items-center justify-between gap-4 border-b border-line-subtle px-6 py-4">
            <span className="type-data text-[11px] uppercase tracking-[0.14em] text-fg-soft">Security overview</span>
            <span className="type-data hidden text-[11px] text-fg-subtle sm:inline">For Mac and Windows</span>
          </div>
          <dl>
            {spec.map((row, i) => (
              <div
                key={row.label}
                className="grid gap-x-6 gap-y-1.5 border-b border-line-subtle px-6 py-5 last:border-0 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
              >
                <dt className="flex items-center gap-3">
                  <span className="type-data w-5 text-[11px] text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <span className="type-label text-fg-soft">{row.label}</span>
                </dt>
                <dd className="flex flex-col gap-1 pl-8 sm:pl-0">
                  <span className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="size-2 shrink-0 bg-brand" />
                    <span className="type-h4 text-fg">{row.value}</span>
                  </span>
                  <span className="type-body-sm pl-[18px]">{row.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// Where the data goes: export in, workbook out, all inside the machine's boundary.
// The line out to the internet is cut.
function Boundary() {
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative rounded-xl border border-dashed border-line-strong p-5 pt-9">
        <span className="type-data absolute left-5 top-3.5 text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          Your computer
        </span>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <Node label="Export" sub=".pdf .xlsx .csv" />
          <Wire />
          <Node label="Dropdone" sub="Runs your steps" strong />
          <Wire />
          <Node label="Workbook" sub="Updated in place" />
        </div>
      </div>
      <div className="flex items-center gap-3 pl-5">
        <span aria-hidden="true" className="relative h-6 w-px bg-line">
          <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-fg-muted" />
          <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-fg-muted" />
        </span>
        <span className="type-caption">Every run: 0 bytes of your data sent. Setup sends your one example to the AI provider you choose.</span>
      </div>
    </figure>
  );
}

function Node({ label, sub, strong }: { label: string; sub: string; strong?: boolean }) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col gap-0.5 rounded-lg border px-3 py-2.5 ${
        strong ? "border-brand/40 bg-brand-a10" : "border-line-subtle bg-surface"
      }`}
    >
      <span className={`type-label truncate text-[13px] ${strong ? "text-brand" : "text-fg"}`}>{label}</span>
      <span className="type-data truncate text-[10px] text-fg-subtle">{sub}</span>
    </div>
  );
}

function Wire() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" className="shrink-0 rotate-90 self-center text-brand sm:rotate-0" aria-hidden="true">
      <path d="M0 5h15m0 0-3.5-3.5M15 5l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
