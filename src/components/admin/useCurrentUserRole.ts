"use client"

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

export type AdminRole = "EDITOR" | "ADMIN" | "SUPER_ADMIN";

const ROLE_RANK: Record<string, number> = { EDITOR: 1, ADMIN: 2, SUPER_ADMIN: 3 };

export function roleAtLeast(role: string | null | undefined, minimum: AdminRole): boolean {
  return (ROLE_RANK[role ?? ""] ?? 0) >= ROLE_RANK[minimum];
}

/**
 * Returns the signed-in admin's role plus a rank helper.
 *
 * The CMS hides controls that the API would reject with a 403 anyway, so an
 * ADMIN never sees "Delete" on a page that only SUPER_ADMIN can mutate.
 */
export function useCurrentUserRole(): {
  role: AdminRole | null;
  loading: boolean;
  atLeast: (minimum: AdminRole) => boolean;
} {
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminFetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (!cancelled) setRole(user?.role ?? null);
      })
      .catch(() => {
        if (!cancelled) setRole(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { role, loading, atLeast: (minimum) => roleAtLeast(role, minimum) };
}