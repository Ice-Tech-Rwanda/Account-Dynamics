"use client";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";

export default function AdminSubscribersPage() {
  const { data, loading, search, setSearch } = useAdminList<any>({ endpoint: "/api/admin/subscribers", pageSize: 20 });

  const columns: Column<any>[] = [
    { key: "email", label: "Email", sortable: true, render: (item) => <span className="font-medium">{item.email}</span> },
    { key: "active", label: "Status", render: (item) => item.active ? <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Active</Badge> : <Badge className="bg-slate-100 text-slate-500 border-0 text-[10px]">Inactive</Badge> },
    { key: "createdAt", label: "Subscribed", sortable: true, render: (item) => new Date(item.createdAt).toLocaleDateString() },
  ];

  return (
    <AdminPageShell title="Subscribers" subtitle="Newsletter subscribers" loading={loading}>
    </AdminPageShell>
  );
}
