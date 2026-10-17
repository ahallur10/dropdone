import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";
import { DragDropDone } from "../_components/drag-drop-done";

export const metadata: Metadata = {
  title: "How it works · Dropdone",
  description:
    "Show Dropdone one messy export and the workbook you made from it. After that, drop each new export and your workbook updates itself.",
};

const steps = [
  {
    id: "show",
    n: "01",
    title: "Show it once",
    body: "Give Dropdone one messy export and the workbook you already made from it by hand. That's the whole setup. It works out which column goes where and what cleanup you did.",
    files: ["CASE_EXPORT_1002.csv", "Weekly Caseload.xlsx"],
    result: "Learned 5 columns and 4 cleanup rules",
  },
  {
    id: "drop",
    n: "02",
    title: "Drop the next one",
    body: "Next time, export the report the way you always do. PDF, CSV or Excel, title rows, subtotals and all. Drag it onto Dropdone, or save it to a folder it watches.",
    files: ["CASE_ACTIVITY_1016.pdf"],
    result: "No cleanup first, no template to fill in",
  },
  {
    id: "check",
    n: "03",
    title: "Check, then save",
    body: "Before anything is saved, Dropdone checks the result against last time: same columns, same order, values that fit. If something doesn't, it asks you instead of guessing.",
    files: ["Weekly Caseload.xlsx"],
    result: "Updated in place, formulas and formatting intact",
  },
];

const fixes: { field: string; from: string[]; to: string }[] = [
  { field: "Names", from: ["SMITH, JOHN", "garcia, maria"], to: "John Smith" },
  { field: "Dates", from: ["10/3/26", "2026-10-04", "Oct 6 2026"], to: "10/03/2026" },
  { field: "Labels", from: ["snap ", "Snap", "SNAP"], to: "SNAP" },
  { field: "IDs", from: ["  00412", "00413"], to: "412" },
  { field: "People", from: ["r.alvarez", "R.ALVAREZ"], to: "R. Alvarez" },
];

const removed = [
  "Report titles and run dates",
  "Page headers repeated mid-report",
  "Group headers and subtotal rows",
  "Confidentiality footers",
  "Blank spacer rows",
  "Duplicate records",
];

export default function HowItWorks() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Intro */}
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 pb-20 pt-36 md:pb-28 md:pt-44">
            <div className="flex flex-col gap-6">
              <p className="type-eyebrow">How it works</p>
              <h1 className="max-w-[18ch]">
                Show it once. Then just{" "}
                <span className="underline decoration-brand decoration-[3px] underline-offset-[8px]">drop</span>.
              </h1>
              <p className="type-lead max-w-[60ch] text-fg-muted">
                Most offices clean the same export by hand every week. Dropdone watches you do it once,
                then does it for you every time after.
              </p>
            </div>
            <DragDropDone />
          </div>
        </section>

        {/* Steps */}
        <section className="border-y border-line-subtle bg-section">
          <div className="mx-auto flex max-w-site flex-col px-6">
            {steps.map((s, i) => (
              <div
                key={s.id}
                id={s.id}
                className={`grid scroll-mt-20 gap-8 py-16 md:grid-cols-2 md:gap-16 md:py-20 ${
                  i > 0 ? "border-t border-line-subtle" : ""
                }`}
              >
                <div className="flex flex-col gap-4">
                  <span className="type-stat text-brand">{s.n}</span>
                  <h2>{s.title}</h2>
                  <p className="max-w-[52ch] text-fg-muted">{s.body}</p>
                </div>
                <div className="card flex flex-col justify-center gap-3 p-6 hover:bg-surface">
                  {s.files.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-3 rounded-md border border-line-subtle bg-surface-strong px-4 py-3"
                    >
                      <FileIcon />
                      <span className="type-data truncate text-fg-soft">{f}</span>
                    </div>
                  ))}
                  <p className="type-body-sm mt-2 flex items-center gap-2 text-fg-soft">
                    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-[1px] bg-brand" />
                    {s.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What it fixes */}
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 py-24 md:py-32">
            <div className="flex flex-col gap-4">
              <p className="type-eyebrow">What it fixes</p>
              <h2 className="max-w-[24ch]">Nobody wrote a rule. It copied what you did last time.</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <div className="card overflow-x-auto p-2 hover:bg-surface">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line">
                      {["Field", "In the export", "In your workbook"].map((h) => (
                        <th key={h} className="type-data px-4 py-3 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fixes.map((m) => (
                      <tr key={m.field} className="border-b border-line-subtle last:border-0">
                        <td className="type-label px-4 py-4 align-top text-fg">{m.field}</td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {m.from.map((f) => (
                              <span key={f} className="type-data whitespace-pre rounded-sm bg-surface-strong px-2 py-0.5 text-xs text-fg-soft">
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <span className="type-data rounded-sm bg-brand-a10 px-2 py-0.5 text-xs text-brand">{m.to}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card flex flex-col gap-4 p-6 hover:bg-surface">
                <h3 className="type-h4">Taken out</h3>
                <ul className="flex flex-col gap-3">
                  {removed.map((r) => (
                    <li key={r} className="type-body-sm flex gap-2.5 text-fg-soft">
                      <span aria-hidden="true" className="type-data text-fg-subtle">−</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="border-y border-line-subtle bg-section">
          <div className="mx-auto grid max-w-site gap-8 px-6 py-20 md:grid-cols-2 md:gap-16">
            <h2 className="max-w-[18ch]">Your files stay on your computer.</h2>
            <div className="flex flex-col gap-4">
              <p className="text-fg-soft">
                The free Community edition does all of this locally. Your exports and workbooks never get
                uploaded to Dropdone, which matters when the data is about real people and your IT office
                has to sign off.
              </p>
              <p className="type-body-sm">
                Adjusted refresh in Pro, for when your export&apos;s format changes, uses an AI model, so it
                only runs if you turn it on.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto flex max-w-site flex-col items-start gap-6 px-6 py-24 md:py-32">
            <p className="type-eyebrow">Early access</p>
            <h2 className="max-w-[20ch]">Stop cleaning the same report twice.</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/#join" className="btn-brand no-underline">
                Join early access
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

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-fg-muted">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}
