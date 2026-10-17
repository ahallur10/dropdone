// Waitlist signups. Right now this only validates and logs to the server console.
// TODO: before launch, save signups somewhere durable (a database, a Google Sheet, or an email list).

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!EMAIL.test(email)) {
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  console.log("[waitlist]", {
    email,
    team: body?.team ?? null,
    reports: body?.reports ?? null,
    at: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
