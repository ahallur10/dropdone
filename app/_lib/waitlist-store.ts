import "server-only";

/*
 * Waitlist storage on Upstash Redis (Vercel Storage → Upstash for Redis), over its REST API so
 * there's no client library. Each signup is a hash at waitlist:<email>; a sorted set keeps the
 * order they joined in for the export.
 *
 * Without Redis credentials (local dev, or before the store is connected) it falls back to an
 * in-memory store so the form still works end to end; nothing is kept across restarts.
 */

export type Signup = {
  email: string;
  team: string | null;
  reports: string | null;
  createdAt: string;
  updatedAt: string;
};

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
export const storeConnected = Boolean(URL_ && TOKEN);

const LIST = "waitlist:emails";
const key = (email: string) => `waitlist:${email}`;

type Cmd = (string | number)[];

async function redis<T = unknown>(...commands: Cmd[]): Promise<T[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const out = (await res.json()) as { result?: T; error?: string }[];
  const failed = out.find((r) => r.error);
  if (failed) throw new Error(`Redis: ${failed.error}`);
  return out.map((r) => r.result as T);
}

// In-memory fallback, kept on globalThis so dev hot reloads don't wipe it.
const memory = ((globalThis as { __waitlist?: { rows: Map<string, Signup>; hits: Map<string, { n: number; until: number }> } })
  .__waitlist ??= { rows: new Map(), hits: new Map() });

const now = () => new Date().toISOString();

/** Adds a signup. Returns false if the email was already on the list. */
export async function addSignup(email: string): Promise<boolean> {
  const at = now();
  if (!storeConnected) {
    if (memory.rows.has(email)) return false;
    memory.rows.set(email, { email, team: null, reports: null, createdAt: at, updatedAt: at });
    return true;
  }
  // HSETNX is atomic, so two simultaneous submits can't both count as new.
  const [created] = await redis<number>(["HSETNX", key(email), "createdAt", at]);
  if (created !== 1) return false;
  await redis(["HSET", key(email), "email", email, "updatedAt", at], ["ZADD", LIST, Date.now(), email]);
  return true;
}

/** Saves survey answers onto an existing signup. Unknown emails are ignored. */
export async function saveAnswers(email: string, team: string | null, reports: string | null) {
  const at = now();
  if (!storeConnected) {
    const row = memory.rows.get(email);
    if (row) memory.rows.set(email, { ...row, team, reports, updatedAt: at });
    return;
  }
  const [exists] = await redis<number>(["EXISTS", key(email)]);
  if (!exists) return;
  const fields: Cmd = ["HSET", key(email), "updatedAt", at];
  if (team) fields.push("team", team);
  if (reports) fields.push("reports", reports);
  await redis(fields);
}

/** True if this caller has gone over `limit` requests in the last `windowSec` seconds. */
export async function overLimit(id: string, limit: number, windowSec: number): Promise<boolean> {
  if (!storeConnected) {
    const t = Date.now();
    const hit = memory.hits.get(id);
    const next = hit && hit.until > t ? { n: hit.n + 1, until: hit.until } : { n: 1, until: t + windowSec * 1000 };
    memory.hits.set(id, next);
    return next.n > limit;
  }
  const [count] = await redis<number>(["INCR", `waitlist:rl:${id}`], ["EXPIRE", `waitlist:rl:${id}`, windowSec, "NX"]);
  return count > limit;
}

/** Every signup, oldest first. */
export async function allSignups(): Promise<Signup[]> {
  if (!storeConnected) return [...memory.rows.values()];
  const [emails] = await redis<string[]>(["ZRANGE", LIST, 0, -1]);
  if (!emails?.length) return [];
  const rows = await redis<string[]>(...emails.map((e) => ["HGETALL", key(e)]));
  return rows.map((flat) => {
    const o: Record<string, string> = {};
    for (let i = 0; i < flat.length; i += 2) o[flat[i]] = flat[i + 1];
    return {
      email: o.email,
      team: o.team ?? null,
      reports: o.reports ?? null,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt ?? o.createdAt,
    };
  });
}

/** How many people are on the list. */
export async function countSignups(): Promise<number> {
  if (!storeConnected) return memory.rows.size;
  const [n] = await redis<number>(["ZCARD", LIST]);
  return n ?? 0;
}
