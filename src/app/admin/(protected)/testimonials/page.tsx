"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

export default function AdminTestimonialsPage() {
  const { data, loading, search, setSearch, page, setPage, totalPages, total, refresh } = useAdminList<any>({
    endpoint: "/api/admin/testimonials",
    pageSize: 20,
  });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const handleSave = async (formData: Record<string, any>) => {
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/admin/testimonials/${editItem.id}` : "/api/admin/testimonials";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success(editItem ? "Testimonial updated" : "Testimonial added");
      refresh();
      setEditItem(null);
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to save testimonial");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const res = await fetch(`/api/admin/testimonials/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Testimonial deleted");
      refresh();
      setDeleteItem(null);
    } else {
      toast.error("Failed to delete testimonial");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "clientName",
      label: "Client Name",
      sortable: true,
      render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.clientName}</span>,
    },
    { key: "company", label: "Company / Organization" },
    {
      key: "rating",
      label: "Rating",
      render: (item) =>
        item.rating ? (
          <span className="text-amber-500 font-semibold">
            {"★".repeat(item.rating)}
            {"☆".repeat(5 - item.rating)}
          </span>
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
      title="Testimonials & Reviews"
      subtitle="Manage verified client testimonials. Only published entries will appear on the public website."
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add Testimonial"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["clientName", "company", "content"]}
        searchPlaceholder="Search testimonials..."
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
        title={editItem ? "Edit Testimonial" : "Add Testimonial"}
        initial={editItem ?? {}}
        fields={[
          { name: "clientName", label: "Client Name", required: true },
          { name: "company", label: "Company / Business Name" },
          { name: "position", label: "Title / Position" },
          { name: "content", label: "Testimonial Content", type: "textarea", required: true },
          { name: "photo", label: "Client Photo URL", placeholder: "/uploads/... or https://..." },
          { name: "rating", label: "Rating (1 to 5)", type: "number", min: 1 },
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
        title="Delete testimonial?"
        message={`Are you sure you want to delete the testimonial from "${deleteItem?.clientName}"?`}
      />
    </AdminPageShell>
  );
}
