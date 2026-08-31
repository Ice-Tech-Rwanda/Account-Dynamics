"use client";

import { useRouter } from "next/navigation";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  REVIEWING: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  CONTACTED: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  QUOTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  ACCEPTED: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  DECLINED: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  CLOSED: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
};

export default function AdminQuotesPage() {
  const router = useRouter();
  const { data, loading, search, setSearch, refresh, params, setParams } =
    useAdminList<any>({ endpoint: "/api/admin/quotes", pageSize: 15, initialParams: { archived: "false" } });

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          {!item.read && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
          <span className={`font-medium ${!item.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
            {item.name}
          </span>
        </div>
      ),
    },
    { key: "email", label: "Email", sortable: true },
    { key: "service", label: "Service", render: (item) => item.service || "—" },
    { key: "preferredContact", label: "Preferred", render: (item) => item.preferredContact || "email" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge className={`${STATUS_COLORS[item.status] ?? ""} border-0 text-[10px] font-bold`}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <AdminPageShell title="Quote Requests" subtitle="Manage client quote requests" onRefresh={refresh} loading={loading}>
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        pageSize={15}
        filters={
          <div className="flex gap-1.5">
            {["all", "NEW", "REVIEWING", "QUOTED", "ACCEPTED"].map((s) => (
              <button
                key={s}
                onClick={() => setParams(s === "all" ? { archived: "false" } : { status: s, archived: "false" })}
                className={`h-7 px-2.5 rounded-lg text-[11px] font-bold transition-colors ${
                  (s === "all" && !params.status) || params.status === s
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        }
        onRowClick={(item) => router.push(`/admin/quotes/${item.id}`)}
      />
    </AdminPageShell>
  );
}
