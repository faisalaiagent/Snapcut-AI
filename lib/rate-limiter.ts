/**
 * Lightweight in-memory rate limiter for MVP.
 * For production at scale replace with Upstash Redis:
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

/**
 * Check & increment rate limit for a given key.
 * @param key      e.g. IP address or userId
 * @param limit    max requests allowed in the window
 * @param windowMs window duration in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // Clean up expired entry
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs, limit };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt, limit };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
    limit,
  };
}

/**
 * Per-IP API rate limit: 30 requests per minute.
 * Returns null if allowed, or an error Response if rate-limited.
 */
export function apiRateLimit(ip: string): Response | null {
  const result = checkRateLimit(`api:${ip}`, 30, 60_000);
  if (result.success) return null;

  return new Response(
    JSON.stringify({
      error: "Too many requests. Please wait a moment and try again.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(result.resetAt),
      },
    }
  );
}
