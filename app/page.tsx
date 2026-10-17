import Link from "next/link";
import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
import { Hero } from "./_components/hero";
import { FeatureCard } from "./_components/features";
import { DragDropDone } from "./_components/drag-drop-done";
import { Waitlist } from "./_components/waitlist";

const stats = [
  { value: "20 min", label: "of hand cleanup on every weekly report at a county human services office" },
  { value: "17 hrs", label: "a year, for just one weekly report, that Dropdone gives back" },
  { value: "0", label: "formulas, macros, or rules you have to write" },
];

const compareRows: { label: string; dropdone: string; pq: string; copilot: string }[] = [
  {
    label: "How you set it up",
    dropdone: "Show it one workbook you already finished",
    pq: "Build each transformation step in the editor",
    copilot: "Describe what you want in a prompt",
  },
  {
    label: "Next week's export",
    dropdone: "Drag it onto the app",
    pq: "Refresh, if the file path and columns didn't change",
    copilot: "Ask again in the new file",
  },
  {
    label: "When the export's format changes",
    dropdone: "Adjusted refresh matches your original output (Pro)",
    pq: "Find and fix the broken steps by hand",
    copilot: "Explain the changes and check the result",
  },
  {
    label: "Checks its work",
    dropdone: "Compares output to your finished workbook and asks before saving",
    pq: "Only the checks you build yourself",
    copilot: "You review the result",
  },
  {
    label: "Where your data goes",
    dropdone: "Stays on your computer",
    pq: "Stays on your computer",
    copilot: "Processed in Microsoft 365",
  },
  {
    label: "Built for",
    dropdone: "Anyone who cleans the same report every week",
    pq: "Excel power users",
    copilot: "Microsoft 365 Copilot subscribers",
  },
];

const audiences = [
  {
    title: "Government and nonprofit analysts",
    body: "Caseload, grant, and program reports pulled from the same system every week. Files stay on your machine, which your privacy officer will appreciate.",
    examples: ["caseload_export.csv", "grant_report.xlsx"],
  },
  {
    title: "Small business and bookkeepers",
    body: "Bank, point of sale, and invoice exports that never come out the way your books need them.",
    examples: ["pos_sales_oct.csv", "bank_stmt.txt"],
  },
  {
    title: "Ops and inventory managers",
    body: "Stock counts and order exports from an ERP older than some of your coworkers.",
    examples: ["INV_COUNT_W42.csv", "orders_dump.xls"],
  },
];

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

        {/* Stats */}
        <section aria-label="Time saved" className="border-y border-line-subtle bg-section">
          <div className="mx-auto grid max-w-site gap-10 px-6 py-16 md:grid-cols-3 md:gap-8">
            {stats.map((s) => (
              <div key={s.value} className="flex flex-col gap-3">
                <span className="type-stat">{s.value}</span>
                <p className="type-body-sm max-w-[32ch]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-16">
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 py-24 md:py-32">
            <div className="flex flex-col gap-4">
              <p className="type-eyebrow">How it works</p>
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
                <p className="type-eyebrow">Features</p>
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

        {/* The idea */}
        <section>
          <div className="mx-auto grid max-w-site gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
            <div className="flex flex-col gap-4">
              <p className="type-eyebrow">The idea</p>
              <h2>
                Macros memorize how you pushed the dough around. Dropdone memorizes the{" "}
                <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">
                  cookie cutter
                </span>
                .
              </h2>
            </div>
            <div className="flex flex-col gap-6 md:pt-10">
              <p className="type-lead max-w-[60ch] text-fg-soft">
                The workbook you already built is the target. Nobody writes rules, and
                Dropdone only has to map a messy export into a shape it already knows.
              </p>
              <p className="max-w-[60ch]">
                Because it knows what finished looks like, it checks its own output
                against your workbook before saving. If something doesn&apos;t fit, it
                asks you instead of handing back a report that looks clean but isn&apos;t.
              </p>
              <figure className="card mt-2 flex flex-col gap-3 p-6 hover:bg-surface">
                <figcaption className="type-eyebrow text-fg-muted">Where it started</figcaption>
                <p className="type-body-sm text-fg-soft">
                  At Maricopa County Human Services, every weekly report took about 20
                  minutes of cleanup before anyone could use it. The way to learn it
                  wasn&apos;t a manual. It was watching a coworker do it once. Dropdone
                  learns the same way a new hire does.
                </p>
              </figure>
            </div>
          </div>
        </section>

        {/* Compare */}
        <section id="compare" className="scroll-mt-16 border-y border-line-subtle bg-section">
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 py-24 md:py-32">
            <div className="flex flex-col gap-4">
              <p className="type-eyebrow">Compare</p>
              <h2 className="max-w-[24ch]">Built for people who clean reports, not people who write queries.</h2>
            </div>
            <div className="card overflow-x-auto hover:bg-surface">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    <th className="w-[22%] px-5 py-4" />
                    <th scope="col" className="type-label px-5 py-4 text-brand">Dropdone</th>
                    <th scope="col" className="type-label px-5 py-4 text-fg">Power Query</th>
                    <th scope="col" className="type-label px-5 py-4 text-fg">Microsoft Copilot</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((r) => (
                    <tr key={r.label} className="border-b border-line-subtle last:border-0">
                      <th scope="row" className="type-data px-5 py-4 align-top text-xs uppercase tracking-[0.06em] text-fg-muted">
                        {r.label}
                      </th>
                      <td className="type-body-sm px-5 py-4 align-top text-fg-soft">{r.dropdone}</td>
                      <td className="type-body-sm px-5 py-4 align-top">{r.pq}</td>
                      <td className="type-body-sm px-5 py-4 align-top">{r.copilot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 py-24 md:py-32">
            <div className="flex flex-col gap-4">
              <p className="type-eyebrow">Who it&apos;s for</p>
              <h2 className="max-w-[22ch]">For whoever gets stuck with the export button.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {audiences.map((a) => (
                <article key={a.title} className="card flex flex-col gap-4 p-6">
                  <h3 className="type-h4">{a.title}</h3>
                  <p className="type-body-sm">{a.body}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {a.examples.map((e) => (
                      <span key={e} className="type-data rounded-sm bg-surface-strong px-2 py-1 text-xs text-fg-soft">
                        {e}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-16 border-y border-line-subtle bg-section">
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 py-24 md:py-32">
            <div className="flex flex-col gap-4">
              <p className="type-eyebrow">Pricing</p>
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
                <p className="type-eyebrow">Early access</p>
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
