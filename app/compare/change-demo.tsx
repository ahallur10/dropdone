"use client";

import { useLoop } from "../_components/use-loop";
import { CarouselDots } from "../_components/carousel-dots";

/*
 * "What happens when next week's export changes?" Four small sheets play the same scenario side
 * by side: two new lines appear above the header, then each tool reacts the way it usually does.
 * Dropdone finds the header by what it contains; the others look where they looked last time.
 */

type Tone = "good" | "warn" | "bad";
type Tool = {
  name: string;
  logo?: boolean;
  // Which row the tool reads as the header after the change (0 = the new top line).
  looksAt: number;
  working: string;
  result: string;
  tone: Tone;
};

const TOOLS: Tool[] = [
  { name: "Dropdone", logo: true, looksAt: 2, working: "Looking for the CLNT_ID header…", result: "Found it on row 3. Workbook updated.", tone: "good" },
  { name: "Power Query", looksAt: 0, working: "Promoting row 1 to headers…", result: "Wrong header row. Edit the query.", tone: "warn" },
  { name: "Excel macro", looksAt: 0, working: "Replaying: start at row 1…", result: "Broke on the recorded cell position.", tone: "bad" },
  { name: "Copilot", looksAt: -1, working: "Prompting again…", result: "New output this time. Check it all again.", tone: "warn" },
];

const JUNK = ["CLIENT SERVICES REPORT", "Run date: 03/16/26 08:14"];
const DATA = [
  ["10482", "Smith, JOHN", "Active"],
  ["10483", "garcia, maria", "Withdrawn"],
  ["10484", "LEE, DAVID", "Active"],
];

// Timeline (one step = 1.1s): 0 last week · 1 the export changes · 2-3 each tool reads it · 4-7 results
const STEPS = 8;

export function ChangeDemo() {
  const { ref, step } = useLoop<HTMLDivElement>(STEPS, 1100);
  const shifted = step >= 1;
  const reading = step >= 2;
  const done = step >= 4;

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <h3 className="type-h3 text-center">What happens when next week&apos;s export changes?</h3>
      {/* Phones swipe between the four tools; larger screens see them side by side */}
      <ul
        id="change-cards"
        className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {TOOLS.map((t) => (
          <ToolCard key={t.name} tool={t} shifted={shifted} reading={reading} done={done} />
        ))}
      </ul>
      <CarouselDots targetId="change-cards" count={TOOLS.length} label="tool" />
    </div>
  );
}

const toneText: Record<Tone, string> = { good: "text-brand", warn: "text-warning", bad: "text-danger" };
const toneRing: Record<Tone, string> = {
  good: "outline-brand bg-brand-a10",
  warn: "outline-warning bg-warning/10",
  bad: "outline-danger bg-danger/10",
};

function ToolCard({ tool, shifted, reading, done }: { tool: Tool; shifted: boolean; reading: boolean; done: boolean }) {
  const rows = [...(shifted ? JUNK : []), "HEADER", ...DATA.map((d) => d.join("|"))];
  const target = shifted ? tool.looksAt : 0;
  return (
    <li
      className={`flex flex-col gap-3 rounded-2xl border p-4 max-md:w-[82%] max-md:shrink-0 max-md:snap-center ${tool.logo ? "border-brand/40 bg-brand-a10" : "border-line-subtle bg-surface"}`}
    >
      <div className="flex h-7 items-center">
        {tool.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/brand/dropdone-lockup.svg" alt="Dropdone" className="h-7 w-auto" />
        ) : (
          <span className="type-label text-fg">{tool.name}</span>
        )}
      </div>

      {/* Mini sheet */}
      {/* Fixed height with room for all six rows, so the new lines appear inside the box instead
          of pushing the page down */}
      <div className="h-[146px] overflow-hidden rounded-md border border-fg-inverse/10 bg-fg text-fg-inverse" aria-hidden="true">
        {rows.map((r, i) => {
          const isHeader = r === "HEADER";
          const isJunk = JUNK.includes(r);
          const looking = reading && i === target;
          const cells = isHeader ? ["CLNT_ID", "CLNT_NM", "STAT"] : isJunk ? [r] : r.split("|");
          return (
            <div
              key={r}
              className={`animate-row-in flex h-6 shrink-0 items-center gap-2 border-b border-fg-inverse/10 px-2 font-mono text-[10px] outline-2 -outline-offset-2 transition-colors duration-300 last:border-0 ${
                looking ? `outline ${toneRing[tool.tone]}` : "outline-transparent"
              } ${isHeader ? "font-bold" : ""} ${isJunk ? "text-fg-inverse/45" : ""}`}
            >
              <span className="w-5 shrink-0 text-fg-inverse/35">{i + 1}</span>
              {cells.map((c, j) => (
                <span key={j} className={`truncate ${isJunk ? "" : j === 1 ? "flex-[1.4]" : "flex-1"}`}>
                  {c}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* Status */}
      <p className={`type-body-sm flex h-[3.9rem] items-start gap-2 overflow-hidden text-[13px] leading-[1.3rem] ${done ? toneText[tool.tone] : "text-fg-muted"}`}>
        <StatusIcon tone={done ? tool.tone : null} busy={reading && !done} />
        <span>{done ? tool.result : reading ? tool.working : shifted ? "New export dropped in." : "Ran fine last week."}</span>
      </p>
    </li>
  );
}

function StatusIcon({ tone, busy }: { tone: Tone | null; busy: boolean }) {
  const common = "mt-0.5 size-4 shrink-0";
  if (busy) return <span className={`${common} animate-spin rounded-full border-2 border-line-strong border-t-fg-soft`} aria-hidden="true" />;
  if (!tone) return <span className={`${common} rounded-full border border-line-strong`} aria-hidden="true" />;
  const path =
    tone === "good" ? "m5 12.5 4.5 4.5L19 7.5" : tone === "bad" ? "M6 6l12 12M18 6 6 18" : "M12 7v6m0 4h.01";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
