import { after } from "next/server";
import { reportCounts, teamTypes } from "../../_components/waitlist-options";
import { addSignup, countSignups, overLimit, saveAnswers, storeConnected } from "../../_lib/waitlist-store";
import { notifyOwner, sendConfirmation } from "../../_lib/waitlist-email";

// Waitlist signups. The first request (just an email) adds the signup and sends the emails;
// a second request with survey answers adds them to the same signup.

// Apostrophes are allowed (o'brien@county.gov); angle brackets and quotes are not.
const EMAIL = /^[^\s@<>"]+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;
const MAX_EMAIL = 254; // the longest address the email standards allow
const LIMIT = { requests: 20, windowSec: 60 * 10 }; // per IP

// The survey's answers must be one of the options the form offers; anything else is dropped.
const pick = (value: unknown, allowed: string[]) =>
  typeof value === "string" && allowed.includes(value) ? value : null;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const raw = body && typeof body === "object" && !Array.isArray(body) ? body : {};
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";

  // Hidden field real people never see. Bots that fill it get a normal-looking success.
  if (typeof raw.website === "string" && raw.website.trim()) {
    return Response.json({ ok: true, status: "new" });
  }

  if (email.length > MAX_EMAIL || !EMAIL.test(email)) {
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (await overLimit(ip, LIMIT.requests, LIMIT.windowSec)) {
      return Response.json({ error: "Too many tries. Give it a few minutes and try again." }, { status: 429 });
    }

    const answering = "team" in raw || "reports" in raw;
    if (answering) {
      await saveAnswers(email, pick(raw.team, teamTypes), pick(raw.reports, reportCounts));
      return Response.json({ ok: true });
    }

    const isNew = await addSignup(email);
    if (!storeConnected) console.warn("[waitlist] no store connected; signup kept in memory only:", email);
    if (isNew) {
      // Emails go out after the response so a slow mail server never holds up the form.
      after(async () => {
        await sendConfirmation(email);
        await notifyOwner(email, await countSignups().catch(() => null));
      });
    }
    return Response.json({ ok: true, status: isNew ? "new" : "existing" });
  } catch (err) {
    console.error("[waitlist] store error", err);
    return Response.json({ error: "We couldn't save that just now. Try again in a moment." }, { status: 503 });
  }
}
