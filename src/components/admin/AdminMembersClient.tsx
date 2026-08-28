"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { LoadingState } from "@/components/shared/LoadingState";
import type { Column } from "@/components/admin/AdminDataTable";

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  category?: string;
  status?: string;
  rating?: number;
  createdAt?: string;
}

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email" as const, required: true },
  { name: "phone", label: "Phone" },
  { name: "category", label: "Category" },
  { name: "status", label: "Status", type: "select" as const, options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }] },
];

export default function AdminMembersClient({ initialData }: { initialData: Member[] }) {
  const [items, setItems] = useState<Member[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Member | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/members?page=${page}`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setItems(json.data ?? []);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData && initialData.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/members?page=1");
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        if (!cancelled) setItems(json.data ?? []);
      } catch {
        if (!cancelled) toast.error("Failed to load members");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/members`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [deleteId], action: "delete" }) });
      toast.success("Member deleted");
      setDeleteId(null);
      await fetchItems();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/admin/members/export`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `members-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }
  };

  const columns: Column<Member>[] = [
    { key: "name", label: "Name", sortable: true, render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.name}</span> },
    { key: "email", label: "Email", sortable: true },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Joined" },
    { key: "id", label: "Actions", className: "text-right", render: (item) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => { setEditItem(item); setDialogOpen(true); }} className="rounded-lg p-1.5 text-slate-400 hover:text-brand hover:bg-brand/10"><Pencil className="size-3.5" /></button>
        <button onClick={() => setDeleteId(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Members</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage members and roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleExport}><Download className="size-4" /> Export CSV</Button>
          <Button variant="brand" size="sm" className="rounded-xl gap-1" onClick={() => { setEditItem(null); setDialogOpen(true); }}>
            <Plus className="size-4" /> Add Member
          </Button>
        </div>
      </div>

      <AdminDataTable columns={columns} data={items} searchKeys={["name", "email"]} searchPlaceholder="Search members..." />
      <CrudDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditItem(null); }} onSave={async () => { await fetchItems(); setDialogOpen(false); }} fields={fields as any} initial={editItem ?? {}} title={editItem ? "Edit Member" : "Add Member"} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete member?" />
    </div>
  );
}
