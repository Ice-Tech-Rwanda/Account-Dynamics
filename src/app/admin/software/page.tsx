"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

export default function AdminSoftwarePage() {
  const { data, loading, search, setSearch, refresh } = useAdminList<any>({ endpoint: "/api/admin/software-tools", pageSize: 20 });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const handleSave = async (formData: Record<string, any>) => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? `/api/admin/software-tools/${editItem.id}` : "/api/admin/software-tools";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) { toast.success(editItem ? "Updated" : "Created"); refresh(); setEditItem(null); setShowCreate(false); }
    else { const e = await res.json().catch(() => ({})); toast.error(e.error || "Failed"); }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const res = await fetch(`/api/admin/software-tools/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); refresh(); setDeleteItem(null); }
  };

  const columns: Column<any>[] = [
    { key: "name", label: "Name", sortable: true, render: (item) => <span className="font-medium">{item.name}</span> },
    { key: "websiteUrl", label: "Website", render: (item) => item.websiteUrl ? <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline text-xs">{item.websiteUrl}</a> : "—" },
    { key: "displayOrder", label: "Order", sortable: true },
    { key: "status", label: "Status", render: (item) => <Badge className="border-0 text-[10px]">{item.status}</Badge> },
    { key: "actions", label: "", render: (item) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditItem(item); }} className="text-xs text-brand hover:underline">Edit</button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteItem(item); }} className="text-xs text-red-500 hover:underline">Delete</button>
      </div>
    )},
  ];

  return (
    <AdminPageShell title="Software Tools" subtitle="Accounting software you use" onRefresh={refresh} loading={loading} onAdd={() => setShowCreate(true)} addLabel="Add Tool">
      <CrudDialog open={showCreate || !!editItem} onClose={() => { setShowCreate(false); setEditItem(null); }} onSave={handleSave} title={editItem ? "Edit Tool" : "Add Tool"} initial={editItem ?? {}} fields={[
        { name: "name", label: "Name", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "websiteUrl", label: "Website URL" },
        { name: "displayOrder", label: "Order", type: "number", min: 0 },
        { name: "status", label: "Status", type: "select", options: [{ label: "Published", value: "PUBLISHED" }, { label: "Draft", value: "DRAFT" }] },
      ]} />
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} />
    </AdminPageShell>
  );
}
