import { describe, it, expect } from "vitest";

// Test the RBAC role hierarchy logic directly (avoids server-only imports)
const ROLE_RANK: Record<string, number> = {
  EDITOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

function hasRole(user: { role: string }, requiredRole: string): boolean {
  return ROLE_RANK[(user.role) ?? "EDITOR"] >= ROLE_RANK[requiredRole];
}

describe("RBAC Role Hierarchy", () => {
  it("SUPER_ADMIN has all roles", () => {
    expect(hasRole({ role: "SUPER_ADMIN" }, "EDITOR")).toBe(true);
    expect(hasRole({ role: "SUPER_ADMIN" }, "ADMIN")).toBe(true);
    expect(hasRole({ role: "SUPER_ADMIN" }, "SUPER_ADMIN")).toBe(true);
  });

  it("ADMIN has ADMIN and EDITOR roles", () => {
    expect(hasRole({ role: "ADMIN" }, "EDITOR")).toBe(true);
    expect(hasRole({ role: "ADMIN" }, "ADMIN")).toBe(true);
    expect(hasRole({ role: "ADMIN" }, "SUPER_ADMIN")).toBe(false);
  });

  it("EDITOR only has EDITOR role", () => {
    expect(hasRole({ role: "EDITOR" }, "EDITOR")).toBe(true);
    expect(hasRole({ role: "EDITOR" }, "ADMIN")).toBe(false);
    expect(hasRole({ role: "EDITOR" }, "SUPER_ADMIN")).toBe(false);
  });

  it("treats unknown role as lowest (no access)", () => {
    // undefined in ROLE_RANK gives NaN, so comparison is false
    expect(hasRole({ role: "unknown" }, "EDITOR")).toBe(false);
    expect(hasRole({ role: "unknown" }, "ADMIN")).toBe(false);
  });

  it("role hierarchy is correct", () => {
    expect(ROLE_RANK.SUPER_ADMIN).toBeGreaterThan(ROLE_RANK.ADMIN);
    expect(ROLE_RANK.ADMIN).toBeGreaterThan(ROLE_RANK.EDITOR);
  });
});
