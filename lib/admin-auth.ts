import { timingSafeEqual } from "crypto";

const ADMIN_TOKEN = process.env.SHAPE_ADMIN_TOKEN ?? "";

type Headers = Record<string, string | string[] | undefined>;

function getHeader(headers: Headers, name: string): string | undefined {
  const raw = headers[name.toLowerCase()];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

/**
 * True when the request is an authenticated admin call.
 *
 * Accepts either `Authorization: Bearer <token>` or `X-Admin-Token: <token>`.
 * In development we allow the call when no token is configured so the
 * local demo path keeps working.
 */
export function isAdmin(headers: Headers): boolean {
  const bearer = getHeader(headers, "authorization")?.replace(/^Bearer\s+/i, "");
  const xAdmin = getHeader(headers, "x-admin-token");

  if (bearer) {
    const a = Buffer.from(bearer);
    const b = Buffer.from(ADMIN_TOKEN);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }

  if (xAdmin) {
    return xAdmin === ADMIN_TOKEN;
  }

  // Local-dev fallback: no token configured means demo mode.
  return process.env.NODE_ENV !== "production";
}
