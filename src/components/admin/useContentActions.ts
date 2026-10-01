"use client"

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useCurrentUserRole } from "@/components/admin/useCurrentUserRole";

/**
 * How a model expresses "archived".
 *
 * Most CMS content uses the `status` enum with an `ARCHIVED` member. Models that
 * track a separate lifecycle column (TripInquiry: a lead-status enum that has no
 * ARCHIVED member, plus an `archived` boolean) must be told explicitly, otherwise
 * archiving would POST an enum value the update schema rejects with a 400.
 */
export type ArchiveField = "status" | "archived";

export interface ContentActionOptions {
  /** Defaults to "status". */
  archiveField?: ArchiveField;
}

/**
 * Shared row actions for CMS content lists.
 *
 * Deletion is restricted to SUPER_ADMIN by the API registry, which left ADMINs
 * able to create records but unable to ever remove them. Archiving gives ADMINs a
 * safe, reversible alternative, while hard delete stays gated behind the role check.
 */
export function useContentActions<
  T extends { id: string; status?: string | null; archived?: boolean | null }
>(
  endpoint: string,
  refresh: () => void | Promise<void>,
  labels: { singular: string; plural?: string },
  options: ContentActionOptions = {}
) {
  const { atLeast } = useCurrentUserRole();
  const canDelete = atLeast("SUPER_ADMIN");
  const archiveField = options.archiveField ?? "status";

  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  const toggleArchive = useCallback(
    async (item: T) => {
      const archived =
        archiveField === "status" ? item.status === "ARCHIVED" : Boolean(item.archived);

      const body =
        archiveField === "status"
          ? { status: archived ? "DRAFT" : "ARCHIVED" }
          : { archived: !archived };

      const res = await fetch(`${endpoint}/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(archived ? `${labels.singular} restored` : `${labels.singular} archived`);
        refresh();
      } else {
        const e = await res.json().catch(() => ({}));
        toast.error(e.error || `Failed to update ${labels.singular.toLowerCase()}`);
      }
    },
    [endpoint, refresh, labels.singular, archiveField]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteItem) return;
    const res = await fetch(`${endpoint}/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(`${labels.singular} deleted`);
      refresh();
      setDeleteItem(null);
    } else {
      toast.error(`Failed to delete ${labels.singular.toLowerCase()}`);
    }
  }, [deleteItem, endpoint, refresh, labels.singular]);

  return {
    canDelete,
    deleteItem,
    setDeleteItem,
    toggleArchive,
    confirmDelete,
  };
}