"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useContentActions } from "@/components/admin/useContentActions";
import { StatusFilter } from "@/components/admin/StatusFilter";
import { Badge } from "@/components/ui/badge";

export default function AdminFaqsPage() {
  const { data, loading, error, search, setSearch, page, setPage, totalPages, total, refresh, params, setParams } = useAdminList<any>({
    endpoint: "/api/admin/faqs",
    pageSize: 20,
  });
  const { canDelete, deleteItem, setDeleteItem, toggleArchive, confirmDelete } =
    useContentActions<any>("/api/admin/faqs", refresh, { singular: "FAQ" });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleSave = async (formData: Record<string, any>) => {
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/admin/faqs/${editItem.id}` : "/api/admin/faqs";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success(editItem ? "FAQ updated" : "FAQ created");
      refresh();
      setEditItem(null);
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to save FAQ");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "question",
      label: "Question",
      sortable: true,
      render: (item) => (
        <span className="font-medium text-slate-900 dark:text-white line-clamp-1">
          {item.question}
        </span>
      ),
    },
    { key: "category", label: "Category" },
    { key: "displayOrder", label: "Order", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge
          className={
            item.status === "PUBLISHED"
              ? "bg-emerald-100 text-emerald-700 border-0 text-[10px]"
              : item.status === "ARCHIVED"
              ? "bg-slate-200 text-slate-600 border-0 text-[10px] dark:bg-slate-700/60"
              : "bg-amber-100 text-amber-700 border-0 text-[10px]"
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
          {item.status === "ARCHIVED" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleArchive(item);
              }}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Restore
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleArchive(item);
              }}
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              Archive
            </button>
          )}
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteItem(item);
              }}
              className="text-xs font-semibold text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="FAQs"
      subtitle="Frequently asked questions displayed across the website"
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add FAQ"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["question", "answer", "category"]}
        searchPlaceholder="Search FAQs..."
        filters={(
          <StatusFilter
            value={params.status ?? ""}
            onChange={(status) => setParams({ status })}
          />
        )}
        pageSize={20}
        searchValue={search}
        onSearchChange={setSearch}
        serverPage={page}
        onPageChange={setPage}
        serverTotalPages={totalPages}
        serverTotal={total}
        error={error}
        onRetry={refresh}
      />

      <CrudDialog
        open={showCreate || !!editItem}
        onClose={() => {
          setShowCreate(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        title={editItem ? "Edit FAQ" : "Add FAQ"}
        initial={editItem ?? {}}
        fields={[
          { name: "question", label: "Question", required: true },
          { name: "answer", label: "Answer", type: "textarea", required: true },
          { name: "category", label: "Category", placeholder: "General" },
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
        onConfirm={confirmDelete}
        title="Delete FAQ?"
        message={`Are you sure you want to delete "${deleteItem?.question}"?`}
      />
    </AdminPageShell>
  );
}
