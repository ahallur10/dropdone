import { timingSafeEqual } from "node:crypto";
import { allSignups } from "../../../_lib/waitlist-store";

// Download every signup as a CSV that opens in Excel:
//   /api/waitlist/export?key=<WAITLIST_EXPORT_KEY>
// Without WAITLIST_EXPORT_KEY set, the endpoint doesn't exist.

const KEY = process.env.WAITLIST_EXPORT_KEY;

function matches(given: string | null) {
  if (!KEY || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(KEY);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Quote every cell, and defuse anything Excel would run as a formula.
const cell = (v: string | null) => {
  const s = v ?? "";
  return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  if (!KEY) return new Response("Not found", { status: 404 });
  const url = new URL(request.url);
  const given = url.searchParams.get("key") ?? request.headers.get("authorization")?.replace(/^Bearer /, "") ?? null;
  if (!matches(given)) return new Response("Unauthorized", { status: 401 });

  const rows = await allSignups();
  const csv = [
    ["Email", "Team", "Reports a month", "Joined", "Updated"].map(cell).join(","),
    ...rows.map((r) => [r.email, r.team, r.reports, r.createdAt, r.updatedAt].map(cell).join(",")),
  ].join("\r\n");

  const date = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dropdone-waitlist-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
