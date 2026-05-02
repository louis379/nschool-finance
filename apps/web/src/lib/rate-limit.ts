/**
 * 極簡 in-memory rate limiter。Edge/serverless 上不可靠，但在 Zeabur 單實例 OK。
 * Production 應換成 Upstash / Supabase。
 */

type Bucket = { count: number; resetAt: number };

const STORE_KEY = '__nschool_rate_limit_store__';

function getStore(): Map<string, Bucket> {
  const g = globalThis as unknown as Record<string, unknown>;
  let store = g[STORE_KEY] as Map<string, Bucket> | undefined;
  if (!store) {
    store = new Map<string, Bucket>();
    g[STORE_KEY] = store;
  }
  return store;
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const store = getStore();
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    const fresh: Bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, fresh);
    return { allowed: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}
