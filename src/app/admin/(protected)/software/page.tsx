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
  const { data, loading, refresh } = useAdminList<any>({
    endpoint: "/api/admin/software-tools",
    pageSize: 20,
  });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const handleSave = async (formData: Record<string, any>) => {
    const method = editItem ? "PUT" : "POST";
    const url = editItem ? `/api/admin/software-tools/${editItem.id}` : "/api/admin/software-tools";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success(editItem ? "Software tool updated" : "Software tool added");
      refresh();
      setEditItem(null);
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to save software tool");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const res = await fetch(`/api/admin/software-tools/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Software tool deleted");
      refresh();
      setDeleteItem(null);
    } else {
      toast.error("Failed to delete software tool");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Software / Tool Name",
      sortable: true,
      render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>,
    },
    {
      key: "websiteUrl",
      label: "Website",
      render: (item) =>
        item.websiteUrl ? (
          <a
            href={item.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline text-xs"
          >
            {item.websiteUrl}
          </a>
        ) : (
          "—"
        ),
    },
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
      title="Software & Technology"
      subtitle="Manage accounting software and cloud platforms (QuickBooks, Xero, Wave, Sage)"
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add Tool"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["name", "description", "websiteUrl"]}
        searchPlaceholder="Search software tools..."
        pageSize={15}
      />

      <CrudDialog
        open={showCreate || !!editItem}
        onClose={() => {
          setShowCreate(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        title={editItem ? "Edit Tool" : "Add Tool"}
        initial={editItem ?? {}}
        fields={[
          { name: "name", label: "Tool Name (e.g. QuickBooks Online)", required: true },
          { name: "description", label: "Description / Usage Note", type: "textarea" },
          { name: "websiteUrl", label: "Official Website URL" },
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
        title="Delete software tool?"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
      />
    </AdminPageShell>
  );
}
