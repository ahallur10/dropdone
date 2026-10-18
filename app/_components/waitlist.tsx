"use client";

import { useRef, useState, type FormEvent } from "react";
import { PixelLayers } from "./pixel-layers";
import { reportCounts, teamTypes } from "./waitlist-options";

type Step = "email" | "survey" | "done";

export function Waitlist() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState<string | null>(null);
  const [reports, setReports] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returning, setReturning] = useState(false);
  // Spam trap: a field people never see. Bots tend to fill every input.
  const [website, setWebsite] = useState("");
  // State updates land after the event, so a ref is what actually stops a double submit.
  const inFlight = useRef(false);

  async function send(payload: Record<string, string | null>) {
    let res: Response;
    try {
      res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error("Couldn't reach the server. Check your connection and try again.");
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error ?? "Something went wrong. Try again?");
    return body as { status?: "new" | "existing" };
  }

  async function onJoin(e: FormEvent) {
    e.preventDefault();
    // Enter or a double click can submit again while a request is in flight; ignore repeats.
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    try {
      const { status } = await send({ email: email.trim(), website });
      setReturning(status === "existing");
      setStep("survey");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  async function onSurvey(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    try {
      await send({ email: email.trim(), team, reports });
    } catch {
      // The email is already saved; a failed survey shouldn't block the thank-you.
    } finally {
      inFlight.current = false;
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
        {/* Off-screen and skipped by keyboard and screen readers; only bots fill it in */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="waitlist-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@yourcounty.gov"
            value={email}
            maxLength={254}
            aria-invalid={error ? true : undefined}
            aria-describedby="waitlist-note"
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            className="input w-full sm:flex-1"
          />
          <button type="submit" disabled={pending} className="btn-primary px-btn cursor-pointer disabled:opacity-60">
            <PixelLayers />
            {pending ? "Saving…" : "Get early access"}
          </button>
        </div>
        {error ? (
          <p id="waitlist-note" role="alert" className="type-body-sm text-danger">
            {error}
          </p>
        ) : (
          <p id="waitlist-note" className="type-caption">No spam. A confirmation now, and one email when your download is ready.</p>
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
          {returning
            ? "You're already on the list. Two quick questions if you haven't answered them yet."
            : "You're on the list. Two quick questions, both optional."}
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
        We&apos;ll email {email.trim()} when your Mac or Windows download is ready.
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
  onChange: (v: string | null) => void;
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
              onClick={() => onChange(active ? null : o)}
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
