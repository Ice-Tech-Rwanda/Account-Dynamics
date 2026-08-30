import "server-only";

import { auth } from "@/lib/auth";
import { NotFoundError, AppError, UnauthorizedError } from "@/lib/errors";
import type { Role } from "@prisma/client";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

const ROLE_RANK: Record<RoleName, number> = {
  EDITOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export function hasRole(user: { role: string }, requiredRole: RoleName): boolean {
  return ROLE_RANK[(user.role as RoleName) ?? "EDITOR"] >= ROLE_RANK[requiredRole];
}

export function isAtLeast(user: { role: string }, requiredRole: RoleName): boolean {
  return hasRole(user, requiredRole);
}

/**
 * Returns the authenticated user's session or null when not signed in.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Requires an authenticated session. Throws 401 when missing.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new UnauthorizedError("Your session has expired. Please sign in again.");
  }
  return session;
}

/**
 * Requires the signed-in user to hold at least `requiredRole`.
 * Throws 401 when unauthenticated and 403 when lacking permission.
 */
export async function requireRole(requiredRole: RoleName) {
  const session = await requireAuth();
  if (!isAtLeast(session.user, requiredRole)) {
    throw new AppError(
      "You don't have permission to perform this action.",
      403,
      "FORBIDDEN"
    );
  }
  return session;
}

/**
 * Requires SUPER_ADMIN.
 */
export async function requireSuperAdmin() {
  return requireRole("SUPER_ADMIN");
}

/**
 * Alias kept for any remaining call sites.
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if (!isAtLeast(session.user, "ADMIN")) {
    throw new AppError(
      "You don't have permission to perform this action.",
      403,
      "FORBIDDEN"
    );
  }
  return session;
}

export async function getRequiredUser() {
  const session = await requireAuth();
  const user = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.user.findUnique({ where: { id: session.user.id } })
  );
  if (!user) throw new NotFoundError("User not found");
  return user;
}