// Waitlist signups. Right now this only validates and logs to the server console.
// TODO: before launch, save signups somewhere durable (a database, a Google Sheet, or an email list).

import { reportCounts, teamTypes } from "../../_components/waitlist-options";

// Apostrophes are allowed (o'brien@county.gov); angle brackets and quotes are not.
const EMAIL = /^[^\s@<>"]+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;
const MAX_EMAIL = 254; // the longest address the email standards allow

// The survey's answers must be one of the options the form offers; anything else is dropped.
const pick = (value: unknown, allowed: string[]) =>
  typeof value === "string" && allowed.includes(value) ? value : null;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const raw = body && typeof body === "object" && !Array.isArray(body) ? body : {};
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";

  if (email.length > MAX_EMAIL || !EMAIL.test(email)) {
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  console.log("[waitlist]", {
    email,
    team: pick(raw.team, teamTypes),
    reports: pick(raw.reports, reportCounts),
    at: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
