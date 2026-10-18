"use client";

import { useState, type FormEvent } from "react";

const teamTypes = [
  "Government",
  "Nonprofit or higher ed",
  "Small business or bookkeeping",
  "Ops or inventory",
  "Something else",
];
const reportCounts = ["1 to 4", "5 to 10", "11 to 25", "More than 25"];

type Step = "email" | "survey" | "done";

export function Waitlist() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState<string | null>(null);
  const [reports, setReports] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(payload: Record<string, string | null>) {
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Something went wrong. Try again?");
    }
  }

  async function onJoin(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await send({ email });
      setStep("survey");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  async function onSurvey(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await send({ email, team, reports });
    } catch {
      // The email is already saved; a failed survey shouldn't block the thank-you.
    } finally {
      setPending(false);
      setStep("done");
    }
  }

  if (step === "email") {
    return (
      <form onSubmit={onJoin} className="flex w-full max-w-xl flex-col gap-3">
        <label htmlFor="waitlist-email" className="type-label text-fg-soft">
          Work email
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="waitlist-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@yourcounty.gov"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full sm:flex-1"
          />
          <button type="submit" disabled={pending} className="btn-primary cursor-pointer disabled:opacity-60">
            {pending ? "Saving…" : "Get early access"}
          </button>
        </div>
        {error ? (
          <p role="alert" className="type-body-sm text-danger">
            {error}
          </p>
        ) : (
          <p className="type-caption">No spam. One email when your download is ready.</p>
        )}
      </form>
    );
  }

  if (step === "survey") {
    return (
      <form onSubmit={onSurvey} className="card flex w-full max-w-xl flex-col gap-6 p-6 hover:bg-surface">
        <p className="type-body-sm flex items-center gap-2 text-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          You&apos;re on the list. Two quick questions, both optional.
        </p>
        <ChipGroup legend="What kind of team are you on?" options={teamTypes} value={team} onChange={setTeam} />
        <ChipGroup legend="How many reports do you clean a month?" options={reportCounts} value={reports} onChange={setReports} />
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={pending} className="btn-primary cursor-pointer disabled:opacity-60">
            Send answers
          </button>
          <button type="button" onClick={() => setStep("done")} className="type-label cursor-pointer px-2 text-fg-muted hover:text-fg">
            Skip
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="card w-full max-w-xl p-6 hover:bg-surface">
      <h3 className="type-h4">Thanks. You&apos;re in.</h3>
      <p className="type-body-sm mt-2">
        We&apos;ll email {email} when your Mac or Windows download is ready.
      </p>
    </div>
  );
}

function ChipGroup({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="type-label mb-3 text-fg">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o)}
              className={`type-body-sm cursor-pointer rounded-pill border px-3.5 py-1.5 transition-colors ${
                active
                  ? "border-brand bg-brand-a10 text-brand"
                  : "border-line text-fg-soft hover:border-line-strong"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
