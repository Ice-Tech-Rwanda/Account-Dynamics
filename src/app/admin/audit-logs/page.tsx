"use client";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";

export default function AdminAuditLogsPage() {
  const { data, loading, search, setSearch, page, setPage, totalPages } =
    useAdminList<any>({ endpoint: "/api/admin/audit-logs", pageSize: 20 });

  const columns: Column<any>[] = [
    { key: "createdAt", label: "Time", sortable: true, render: (item) => <span className="text-xs">{new Date(item.createdAt).toLocaleString()}</span> },
    { key: "action", label: "Action", render: (item) => <span className="font-mono text-xs">{item.action}</span> },
    { key: "entity", label: "Entity" },
    { key: "entityId", label: "Entity ID", render: (item) => <span className="text-xs font-mono truncate max-w-[100px] block">{item.entityId || "—"}</span> },
    { key: "user", label: "User", render: (item) => item.user?.email || "—" },
    { key: "details", label: "Details", render: (item) => <span className="text-xs truncate max-w-[200px] block">{item.details || "—"}</span> },
  ];

  return (
    <AdminPageShell title="Audit Logs" subtitle="Track all admin actions (SUPER_ADMIN only)" loading={loading}>
    </AdminPageShell>
  );
}
