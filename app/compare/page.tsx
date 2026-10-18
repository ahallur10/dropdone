import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";

export const metadata: Metadata = {
  title: "Compare · Dropdone",
  description: "How Dropdone compares with Power Query and Microsoft Copilot for cleaning the same export every week.",
};

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

export default function ComparePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section>
          <div className="mx-auto flex max-w-site flex-col gap-12 px-6 pb-24 pt-36 md:pb-32 md:pt-44">
            <div className="flex flex-col gap-6">
              <h1 className="max-w-[20ch]">Built for people who clean reports, not people who write queries.</h1>
              <p className="type-lead max-w-[60ch] text-fg-muted">
                Power Query and Copilot are great tools. They just ask you to build steps or write prompts.
                Dropdone learns from a workbook you already finished.
              </p>
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

        <section className="border-t border-line-subtle bg-section">
          <div className="mx-auto flex max-w-site flex-col items-start gap-6 px-6 py-24 md:py-32">
            <h2 className="max-w-[20ch]">Stop cleaning the same report twice.</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/#join" className="btn-brand no-underline">
                Get early access
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
