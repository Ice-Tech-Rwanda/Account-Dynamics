"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

export default function AdminServicesPage() {
  const { data: categories } = useAdminList<any>({ endpoint: "/api/admin/service-categories", pageSize: 100 });
  const { data, loading, search, setSearch, page, setPage, totalPages, total, refresh } =
    useAdminList<any>({ endpoint: "/api/admin/services", pageSize: 20 });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const handleSave = async (formData: Record<string, any>) => {
    const payload: Record<string, any> = { ...formData };
    if (typeof payload.benefits === "string") {
      payload.benefits = payload.benefits
        .split(",")
        .map((b: string) => b.trim())
        .filter(Boolean);
    }
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/admin/services/${editItem.id}` : "/api/admin/services";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editItem ? "Service updated" : "Service created");
      refresh();
      setEditItem(null);
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to save service");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const res = await fetch(`/api/admin/services/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Service deleted");
      refresh();
      setDeleteItem(null);
    } else {
      toast.error("Failed to delete service");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>,
    },
    { key: "category", label: "Category", render: (item) => item.category?.title || "—" },
    { key: "slug", label: "Slug" },
    {
      key: "featured",
      label: "Featured",
      render: (item) =>
        item.featured ? (
          <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Featured</Badge>
        ) : (
          "—"
        ),
    },
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
      title="Services"
      subtitle="Manage your accounting, tax, and advisory service offerings"
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add Service"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["name", "slug", "description"]}
        searchPlaceholder="Search services..."
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
        title={editItem ? "Edit Service" : "Create Service"}
        initial={editItem ?? {}}
        fields={[
          { name: "name", label: "Service Name", required: true },
          {
            name: "categoryId",
            label: "Category",
            type: "select",
            required: true,
            options: categories.map((c) => ({ label: c.title, value: c.id })),
          },
          { name: "slug", label: "Slug (URL identifier)", required: true },
          { name: "description", label: "Full Description", type: "textarea" },
          { name: "shortDescription", label: "Short Summary", type: "textarea" },
          { name: "icon", label: "Icon Name", placeholder: "Briefcase" },
          { name: "image", label: "Image URL", placeholder: "/uploads/... or https://..." },
          { name: "ctaLabel", label: "CTA Button Label", placeholder: "Request a Consultation" },
          { name: "ctaUrl", label: "CTA Destination URL", placeholder: "/contact" },
          { name: "seoTitle", label: "SEO Title", placeholder: "Page title for search engines" },
          { name: "seoDescription", label: "SEO Description", type: "textarea" },
          { name: "featured", label: "Featured on Homepage", type: "checkbox" },
          { name: "benefits", label: "Benefits (comma-separated)", placeholder: "Tax planning, Compliance, Payroll" },
          { name: "displayOrder", label: "Display Order", type: "number", min: 0 },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Published", value: "PUBLISHED" },
              { label: "Draft", value: "DRAFT" },
              { label: "Archived", value: "ARCHIVED" },
            ],
          },
        ]}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete service?"
        message={`Are you sure you want to permanently delete "${deleteItem?.name}"?`}
      />
    </AdminPageShell>
  );
}
