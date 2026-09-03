"use client";

import { useRouter } from "next/navigation";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  CONTACTED: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  CONFIRMED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  CANCELLED: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
  SPAM: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

export default function AdminConsultationsPage() {
  const router = useRouter();
  const { data, loading, search, setSearch, page, setPage, totalPages, total, refresh, params, setParams } =
    useAdminList<any>({ endpoint: "/api/admin/consultations", pageSize: 15, initialParams: { archived: "false" } });

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
    { key: "preferredDate", label: "Date", render: (item) => item.preferredDate || "—" },
    { key: "preferredTime", label: "Time", render: (item) => item.preferredTime || "—" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge className={`${STATUS_COLORS[item.status] ?? ""} border-0 text-[10px] font-bold`}>
          {item.status}
        </Badge>
      ),
    },
  ];

  return (
    <AdminPageShell title="Consultations" subtitle="Manage consultation bookings" onRefresh={refresh} loading={loading}>
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        pageSize={15}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setParams({ archived: "false" }); }}
        serverPage={page}
        onPageChange={setPage}
        serverTotalPages={totalPages}
        serverTotal={total}
        searchPlaceholder="Search by name, email, company..."
        filters={
          <div className="flex gap-1.5">
            {["all", "NEW", "CONFIRMED", "COMPLETED"].map((s) => (
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
        onRowClick={(item) => router.push(`/admin/consultations/${item.id}`)}
      />
    </AdminPageShell>
  );
}
