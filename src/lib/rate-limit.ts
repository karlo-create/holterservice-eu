/**
 * Tiny in-memory IP rate limiter for the partner-inquiry endpoint.
 *
 * Why in-memory (not Vercel KV):
 *   - VEY-170 says "3/IP/hour, Vercel KV or in-memory" — KV requires a
 *     separate provision step we don't have an API key for yet. In-memory
 *     is a sensible v1 because:
 *       a) Vercel functions stay warm for several minutes between calls,
 *          so a casual abuser hammering from one IP will hit the same
 *          instance and get blocked.
 *       b) Honeypot already filters naive bots; this layer is a soft cap
 *          to slow obvious abuse, not a hard DoS guarantee.
 *       c) Swapping to KV later is a 20-line change.
 *
 * If/when KV is provisioned, replace the `buckets` Map with a KV-backed
 * increment + TTL.
 */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  limit: number,
  now = Date.now()
): RateLimitResult {
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const fresh: Bucket = { count: 1, resetAt: now + WINDOW_MS };
    buckets.set(key, fresh);
    return { ok: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }
  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }
  existing.count += 1;
  return {
    ok: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Best-effort caller IP. Vercel forwards the originating IP in
 * `x-forwarded-for` (first entry). Falls back to a synthetic key so that,
 * even without an IP, we still partition per request batch and don't
 * exempt everyone.
 */
export function clientKey(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
