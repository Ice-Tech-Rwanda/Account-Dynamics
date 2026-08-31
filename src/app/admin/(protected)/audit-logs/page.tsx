"use client";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";

export default function AdminAuditLogsPage() {
  const { data, loading, refresh } = useAdminList<any>({
    endpoint: "/api/admin/audit-logs",
    pageSize: 20,
  });

  const columns: Column<any>[] = [
    {
      key: "createdAt",
      label: "Timestamp",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
          {item.action}
        </span>
      ),
    },
    { key: "entity", label: "Entity Type" },
    {
      key: "entityId",
      label: "Record ID",
      render: (item) => (
        <span className="text-xs font-mono text-slate-400 truncate max-w-[120px] block">
          {item.entityId || "—"}
        </span>
      ),
    },
    {
      key: "user",
      label: "Admin User",
      render: (item) => item.user?.email || "System",
    },
    {
      key: "details",
      label: "Details & Changes",
      render: (item) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[240px] block">
          {item.details || "—"}
        </span>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="Audit Logs"
      subtitle="Complete chronological audit trail of all administrative mutations (SUPER_ADMIN only)"
      onRefresh={refresh}
      loading={loading}
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["action", "entity", "details"]}
        searchPlaceholder="Search audit logs..."
        pageSize={20}
      />
    </AdminPageShell>
  );
}
