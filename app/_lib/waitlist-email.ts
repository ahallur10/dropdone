import "server-only";

/*
 * Waitlist emails through Resend's REST API.
 *   - A confirmation to the person who signed up.
 *   - A "new signup" note to WAITLIST_NOTIFY, so you can see signups arrive.
 *
 * Until a domain is verified in Resend, mail can only come from onboarding@resend.dev and can
 * only be delivered to the Resend account's own address. That means the owner note works right
 * away, while confirmations to other people start working once WAITLIST_FROM uses your domain.
 * A failed send never fails the signup; it's logged and skipped.
 */

const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.WAITLIST_FROM ?? "Dropdone <onboarding@resend.dev>";
const NOTIFY = process.env.WAITLIST_NOTIFY;
// Email clients don't show SVG, so the logo is a PNG served from the live site.
const LOGO = "https://dropdone-kappa.vercel.app/brand/dropdone-lockup-email.png";

async function send(to: string, subject: string, html: string, text: string) {
  if (!KEY) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
      cache: "no-store",
    });
    if (!res.ok) console.warn("[waitlist] email not sent", to, res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.warn("[waitlist] email not sent", to, err);
  }
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function sendConfirmation(email: string) {
  const text = [
    "You're on the Dropdone early access list.",
    "",
    "Dropdone learns a cleanup from one before and after, then does it on every export after that.",
    "We'll email you once when your Mac or Windows download is ready. Nothing else.",
    "",
    "Dropdone",
  ].join("\n");
  const html = `<!doctype html><html><body style="margin:0;background:#131416;padding:32px 16px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#18191C;border:1px solid #2A2C30;border-radius:14px">
<tr><td style="padding:28px 28px 8px"><img src="${LOGO}" width="160" height="59" alt="Dropdone" style="display:block;border:0;width:160px;height:59px"></td></tr>
<tr><td style="padding:12px 28px 0;color:#FFFFFF;font-size:22px;font-weight:700;line-height:1.3">You're on the list.</td></tr>
<tr><td style="padding:12px 28px 0;color:#B9BBC0;font-size:15px;line-height:1.6">Dropdone learns a cleanup from one before and after, then does it on every export after that.</td></tr>
<tr><td style="padding:12px 28px 28px;color:#B9BBC0;font-size:15px;line-height:1.6">We'll email you once, when your Mac or Windows download is ready. Nothing else.</td></tr>
</table>
<p style="color:#6B6E75;font-size:12px;margin:16px 0 0">Sent to ${escape(email)} because it was entered on the Dropdone waitlist.</p>
</td></tr></table></body></html>`;
  await send(email, "You're on the Dropdone list", html, text);
}

export async function notifyOwner(email: string, total: number | null) {
  if (!NOTIFY) return;
  const line = `${email} joined the Dropdone waitlist${total ? ` (${total} total)` : ""}.`;
  await send(NOTIFY, `New signup: ${email}`, `<p>${escape(line)}</p>`, line);
}
