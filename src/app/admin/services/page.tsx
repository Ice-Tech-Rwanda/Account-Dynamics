"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

export default function AdminServicesPage() {
  const router = useRouter();
  const { data, loading, search, setSearch, refresh } =
    useAdminList<any>({ endpoint: "/api/admin/services", pageSize: 20 });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const handleSave = async (formData: Record<string, any>) => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? `/api/admin/services/${editItem.id}` : "/api/admin/services";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) { toast.success(editItem ? "Service updated" : "Service created"); refresh(); setEditItem(null); setShowCreate(false); }
    else { const e = await res.json().catch(() => ({})); toast.error(e.error || "Failed"); }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const res = await fetch(`/api/admin/services/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Service deleted"); refresh(); setDeleteItem(null); }
    else toast.error("Failed to delete");
  };

  const columns: Column<any>[] = [
    { key: "name", label: "Name", sortable: true, render: (item) => <span className="font-medium">{item.name}</span> },
    { key: "category", label: "Category", render: (item) => item.category?.title || "—" },
    { key: "slug", label: "Slug" },
    { key: "featured", label: "Featured", render: (item) => item.featured ? <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Featured</Badge> : "—" },
    { key: "status", label: "Status", render: (item) => <Badge className="border-0 text-[10px]">{item.status}</Badge> },
    { key: "actions", label: "", render: (item) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditItem(item); }} className="text-xs text-brand hover:underline">Edit</button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteItem(item); }} className="text-xs text-red-500 hover:underline">Delete</button>
      </div>
    )},
  ];

  return (
    <AdminPageShell title="Services" subtitle="Manage your service offerings" onRefresh={refresh} loading={loading} onAdd={() => setShowCreate(true)} addLabel="Add Service">
      <CrudDialog open={showCreate || !!editItem} onClose={() => { setShowCreate(false); setEditItem(null); }} onSave={handleSave} title={editItem ? "Edit Service" : "Create Service"} initial={editItem ?? {}} fields={[
        { name: "name", label: "Name", required: true },
        { name: "slug", label: "Slug" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "icon", label: "Icon", placeholder: "Briefcase" },
        { name: "ctaLabel", label: "CTA Label", placeholder: "Request a Consultation" },
        { name: "displayOrder", label: "Order", type: "number", min: 0 },
        { name: "status", label: "Status", type: "select", options: [{ label: "Published", value: "PUBLISHED" }, { label: "Draft", value: "DRAFT" }, { label: "Archived", value: "ARCHIVED" }] },
      ]} />
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete service?" message="This will permanently remove this service." />
    </AdminPageShell>
  );
}
