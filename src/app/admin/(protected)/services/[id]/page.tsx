import { redirect } from "next/navigation";

/**
 * The dedicated service detail editor has been folded into the Services list
 * page dialog (which is the single source of truth for service fields). This
 * redirect keeps any deep links working instead of leaving a stale, partial
 * editor that drifts out of sync with the main one.
 */
export default function AdminServiceDetailPage() {
  redirect("/admin/services");
}