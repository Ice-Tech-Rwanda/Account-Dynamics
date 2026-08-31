/**
 * Rate limiting for public forms.
 *
 * Uses Upstash Ratelimit (Redis) on serverless/production so limits are enforced
 * globally across instances. Falls back to a per-instance in-memory limiter when
 * Upstash is not configured (local dev / self-hosted), matching the previous behavior.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 15 * 60; // 15 minutes
const MAX_FORM_SUBMISSIONS = 10; // per 15 min window per IP per endpoint

type Entry = { attempts: number[] };
const WINDOW_MS = WINDOW_SECONDS * 1000;
const store = new Map<string, Entry>();

function memoryKey(key: string): string {
  return `form:${key}`;
}

function memoryAllowed(key: string, maxAttempts = MAX_FORM_SUBMISSIONS): boolean {
  const now = Date.now();
  const full = memoryKey(key);
  const entry = store.get(full) ?? { attempts: [] };
  entry.attempts = entry.attempts.filter((t) => t > now - WINDOW_MS);
  if (entry.attempts.length >= maxAttempts) {
    store.set(full, entry);
    return false;
  }
  entry.attempts.push(now);
  store.set(full, entry);
  return true;
}

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Lazy singleton for Upstash (only created if env is configured).
let upstash: Ratelimit | null | undefined;

function getUpstash(): Ratelimit | null {
  if (upstash !== undefined) return upstash;

  const hasRedis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!hasRedis) {
    upstash = null;
    return null;
  }

  try {
    upstash = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX_FORM_SUBMISSIONS, `${WINDOW_SECONDS} s`),
      analytics: false,
    });
  } catch (err) {
    console.warn("[rateLimiter] Upstash init failed, falling back to in-memory", err);
    upstash = null;
  }
  return upstash;
}

/**
 * Rate limit public form submissions (contact, quote, booking, newsletter).
 * Uses IP + endpoint as key. 10 submissions per 15 min per IP per endpoint.
 * Async so the Upstash Redis path works; safe to await in route handlers.
 */
export async function isFormAllowed(request: Request, endpoint: string): Promise<boolean> {
  const key = `form:${endpoint}:${clientIp(request)}`;

  const redis = getUpstash();
  if (redis) {
    try {
      const result = await redis.limit(key);
      return result.success;
    } catch (err) {
      console.warn("[rateLimiter] Upstash check failed, allowing request", err);
      return true;
    }
  }

  return memoryAllowed(key);
}

/** Clear the in-memory limiter entry for a key (used mainly in tests). */
export function resetKey(key: string): void {
  store.delete(memoryKey(key));
}
