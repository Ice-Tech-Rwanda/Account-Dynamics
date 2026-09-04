import { describe, it, expect, afterEach } from "vitest";
import { isBlobConfigured, getBlobConfigStatus } from "@/lib/uploads/config";

const BLOB_VAR = "BLOB_READ_WRITE_TOKEN";
const realToken = "vercel_blob_rw_abcd1234_foobar";

function setBlobEnv(value: string | undefined) {
  if (value === undefined) {
    delete process.env[BLOB_VAR];
  } else {
    process.env[BLOB_VAR] = value;
  }
}

afterEach(() => {
  delete process.env[BLOB_VAR];
});

describe("blob config validation", () => {
  it("reports not configured when the token is unset", () => {
    setBlobEnv(undefined);
    expect(isBlobConfigured()).toBe(false);
    expect(getBlobConfigStatus()).toEqual({
      configured: false,
      backend: "local" as const,
    });
  });

  it("reports not configured when the token is empty or whitespace", () => {
    setBlobEnv("");
    expect(isBlobConfigured()).toBe(false);
    setBlobEnv("   ");
    expect(isBlobConfigured()).toBe(false);
  });

  it("reports configured when a valid token is present", () => {
    setBlobEnv(realToken);
    expect(isBlobConfigured()).toBe(true);
    expect(getBlobConfigStatus()).toEqual({
      configured: true,
      backend: "blob" as const,
    });
  });

  it("trims surrounding whitespace when validating", () => {
    setBlobEnv(`  ${realToken}  `);
    expect(isBlobConfigured()).toBe(true);
  });

  it("never surfaces the token value", () => {
    setBlobEnv(realToken);
    const status = getBlobConfigStatus();
    expect(JSON.stringify(status)).not.toContain(realToken);
    expect(JSON.stringify(status)).not.toContain("token");
    expect(isBlobConfigured()).toBe(true);
  });
});
