// ---------------------------------------------------------------------------
// Submission idempotency for public forms (contact, quote, booking).
//
// Client submits an `idempotencyKey` (random UUID) generated once per form
// mount. A key is only honoured once per endpoint within the TTL window, so
// accidental double submits / network replays can never create duplicate
// leads. It is per-instance (in-memory), mirroring the localRateLimiter
// fallback, which is correct for the self-hosted single-instance deploy;
// configure Upstash separately if you need global deduplication.
// ---------------------------------------------------------------------------

const DEDUPE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type Entry = { expiresAt: number };
const store = new Map<string, Entry>();

function claimedKey(endpoint: string, key: string): string {
  return `idem:${endpoint}:${key}`;
}

/**
 * Attempt to claim an idempotency key for a given endpoint.
 * Returns true when THIS call is the first to claim it (the request may
 * proceed and create the record). Returns false when the key was already
 * claimed, meaning a duplicate submission.
 */
export function claimIdempotency(endpoint: string, key: string): boolean {
  const candidate = key?.trim();
  if (!candidate) return true; // no key -> never deduped (backwards compatible)

  const now = Date.now();
  const full = claimedKey(endpoint, candidate);
  const existing = store.get(full);

  if (existing && existing.expiresAt > now) return false;

  store.set(full, { expiresAt: now + DEDUPE_TTL_MS });
  return true;
}

/**
 * Release an idempotency claim so a retry can proceed.
 * Call this ONLY when the request FAILED to persist (catch path). A successful
 * create keeps the claim so same-key retries are rejected as duplicates.
 */
export function releaseIdempotency(endpoint: string, key: string): void {
  const candidate = key?.trim();
  if (!candidate) return;
  store.delete(claimedKey(endpoint, candidate));
}

/** Clear all in-memory claims (used mainly in tests). */
export function resetIdempotency(): void {
  store.clear();
}