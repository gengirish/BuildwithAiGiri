import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Postgres (Neon) data access. Mirrors the optional-integration pattern used
 * elsewhere: returns `null` when `DATABASE_URL` is absent so the app and the
 * E2E suite still run with zero credentials configured.
 *
 * Usage:
 *   const sql = getDb();
 *   if (!sql) { ...degrade... }
 *   const rows = await sql`SELECT * FROM submissions`;
 */
let _sql: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!_sql) _sql = neon(url);
  return _sql;
}

/**
 * True when the DB is unreachable (host does not resolve, connection refused,
 * timeout) rather than rejecting a valid query. Lets callers degrade gracefully
 * — e.g. capture a lead via email instead of dropping it — when the database is
 * paused, deleted, or otherwise offline.
 */
export function isDatabaseUnreachableError(err: unknown): boolean {
  const message =
    err instanceof Error ? `${err.message} ${err.cause ?? ""}` : String(err);
  const blob = message.toLowerCase();
  return (
    blob.includes("fetch failed") ||
    blob.includes("enotfound") ||
    blob.includes("getaddrinfo") ||
    blob.includes("econnrefused") ||
    blob.includes("econnreset") ||
    blob.includes("etimedout") ||
    blob.includes("network") ||
    blob.includes("connection")
  );
}
