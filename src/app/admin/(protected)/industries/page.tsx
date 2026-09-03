"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

export default function AdminIndustriesPage() {
  const { data, loading, search, setSearch, page, setPage, totalPages, total, refresh } = useAdminList<any>({
    endpoint: "/api/admin/industries",
    pageSize: 20,
  });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const handleSave = async (formData: Record<string, any>) => {
    const payload: Record<string, any> = { ...formData };
    if (typeof payload.services === "string") {
      payload.services = payload.services
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/admin/industries/${editItem.id}` : "/api/admin/industries";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editItem ? "Industry updated" : "Industry added");
      refresh();
      setEditItem(null);
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to save industry");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const res = await fetch(`/api/admin/industries/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Industry deleted");
      refresh();
      setDeleteItem(null);
    } else {
      toast.error("Failed to delete industry");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Industry / Sector Name",
      sortable: true,
      render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>,
    },
    { key: "slug", label: "Slug" },
    { key: "displayOrder", label: "Order", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge
          className={
            item.status === "PUBLISHED"
              ? "bg-emerald-100 text-emerald-700 border-0 text-[10px]"
              : "bg-slate-100 text-slate-600 border-0 text-[10px]"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditItem(item);
            }}
            className="text-xs font-semibold text-brand hover:underline"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteItem(item);
            }}
            className="text-xs font-semibold text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="Industries & Audiences"
      subtitle="Manage target client sectors (Small Businesses, Professionals, Startups, Real Estate, etc.)"
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add Industry"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["name", "slug", "description"]}
        searchPlaceholder="Search industries..."
        pageSize={20}
        searchValue={search}
        onSearchChange={setSearch}
        serverPage={page}
        onPageChange={setPage}
        serverTotalPages={totalPages}
        serverTotal={total}
      />

      <CrudDialog
        open={showCreate || !!editItem}
        onClose={() => {
          setShowCreate(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        title={editItem ? "Edit Industry" : "Add Industry"}
        initial={editItem ?? {}}
        fields={[
          { name: "name", label: "Industry Name", required: true },
          { name: "slug", label: "Slug", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "icon", label: "Icon Name", placeholder: "Building2" },
          { name: "image", label: "Image URL", placeholder: "/uploads/... or https://..." },
          { name: "services", label: "Services offered (comma-separated)", placeholder: "Tax, Audit, Payroll" },
          { name: "displayOrder", label: "Display Order", type: "number", min: 0 },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Published", value: "PUBLISHED" },
              { label: "Draft", value: "DRAFT" },
            ],
          },
        ]}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete industry?"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
      />
    </AdminPageShell>
  );
}
