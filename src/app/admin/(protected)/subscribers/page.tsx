"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

export default function AdminSubscribersPage() {
  const { data, loading, search, setSearch, page, setPage, totalPages, total, refresh } = useAdminList<any>({
    endpoint: "/api/admin/subscribers",
    pageSize: 20,
  });
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${deleteItem.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Subscriber removed");
        refresh();
      } else {
        const e = await res.json().catch(() => ({}));
        toast.error(e.error || "Failed to remove subscriber");
      }
    } catch {
      toast.error("Failed to remove subscriber");
    }
    setDeleteItem(null);
  };

  const columns: Column<any>[] = [
    {
      key: "email",
      label: "Subscriber Email",
      sortable: true,
      render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.email}</span>,
    },
    {
      key: "active",
      label: "Subscription Status",
      render: (item) =>
        item.active ? (
          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Active</Badge>
        ) : (
          <Badge className="bg-slate-100 text-slate-500 border-0 text-[10px]">Inactive</Badge>
        ),
    },
    {
      key: "createdAt",
      label: "Date Subscribed",
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteItem(item);
          }}
          className="text-xs font-semibold text-red-500 hover:underline"
        >
          Remove
        </button>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="Newsletter Subscribers"
      subtitle="Website newsletter and insight subscribers"
      onRefresh={refresh}
      loading={loading}
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["email"]}
        searchPlaceholder="Search subscribers by email..."
        pageSize={20}
        searchValue={search}
        onSearchChange={setSearch}
        serverPage={page}
        onPageChange={setPage}
        serverTotalPages={totalPages}
        serverTotal={total}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Remove subscriber?"
        message={`Are you sure you want to remove ${deleteItem?.email} from the subscriber list?`}
      />
    </AdminPageShell>
  );
}
