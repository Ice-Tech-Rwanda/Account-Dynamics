import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  claimIdempotency,
  releaseIdempotency,
  resetIdempotency,
} from "@/lib/idempotency";

describe("Idempotency helper", () => {
  beforeEach(() => resetIdempotency());
  afterEach(() => vi.useRealTimers());

  it("claims a fresh key exactly once", () => {
    expect(claimIdempotency("contact", "key-abc123")).toBe(true);
    expect(claimIdempotency("contact", "key-abc123")).toBe(false);
  });

  it("scopes keys per endpoint", () => {
    expect(claimIdempotency("contact", "same-key")).toBe(true);
    expect(claimIdempotency("booking", "same-key")).toBe(true);
    expect(claimIdempotency("contact", "same-key")).toBe(false);
  });

  it("allows no-key submissions (backwards compatible)", () => {
    expect(claimIdempotency("contact", "")).toBe(true);
    expect(claimIdempotency("contact", "   ")).toBe(true);
    expect(claimIdempotency("contact", undefined as unknown as string)).toBe(true);
  });

  it("releases a key after a successful create", () => {
    claimIdempotency("quote", "key-xyz");
    expect(claimIdempotency("quote", "key-xyz")).toBe(false);
    releaseIdempotency("quote", "key-xyz");
    expect(claimIdempotency("quote", "key-xyz")).toBe(true);
  });

  it("lets a new claim through once the TTL window elapses", () => {
    vi.useFakeTimers();
    claimIdempotency("contact", "key-expires");
    expect(claimIdempotency("contact", "key-expires")).toBe(false);
    vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    expect(claimIdempotency("contact", "key-expires")).toBe(true);
  });
});