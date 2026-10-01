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

export default function AdminDestinationsPage() {
  const { data, loading, error, search, setSearch, page, setPage, totalPages, total, refresh, params, setParams } = useAdminList<any>({
    endpoint: "/api/admin/destinations",
    pageSize: 20,
  });
  const { canDelete, deleteItem, setDeleteItem, toggleArchive, confirmDelete } =
    useContentActions<any>("/api/admin/destinations", refresh, { singular: "destination" });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleSave = async (formData: Record<string, any>) => {
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/admin/destinations/${editItem.id}` : "/api/admin/destinations";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success(editItem ? "Destination updated" : "Destination created");
      refresh();
      setEditItem(null);
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to save destination");
      throw new Error(e.error || "Failed to save destination");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item) => (
        <span className="font-medium text-slate-900 dark:text-white line-clamp-1">{item.name}</span>
      ),
    },
    { key: "slug", label: "Slug" },
    {
      key: "featured",
      label: "Featured",
      render: (item) =>
        item.featured ? (
          <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Featured</Badge>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
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
      title="Destinations"
      subtitle="Rwanda and East Africa destinations shown across the website"
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add Destination"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["name", "slug", "shortDescription"]}
        searchPlaceholder="Search destinations..."
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
        title={editItem ? "Edit Destination" : "Add Destination"}
        initial={editItem ?? {}}
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "slug", label: "Slug", required: true, placeholder: "volcanoes-national-park" },
          { name: "shortDescription", label: "Short Description", type: "textarea" },
          { name: "description", label: "Full Description", type: "textarea" },
          { name: "location", label: "Location" },
          { name: "category", label: "Category", placeholder: "National park, lake, culture..." },
          { name: "image", label: "Image", type: "image" },
          { name: "galleryImages", label: "Gallery Images", type: "imageList" },
          { name: "seoTitle", label: "SEO Title", placeholder: "Optional search title" },
          { name: "seoDescription", label: "SEO Description", type: "textarea" },
          { name: "displayOrder", label: "Display Order", type: "number", min: 0 },
          { name: "featured", label: "Featured on homepage", type: "checkbox" },
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
        title="Delete Destination?"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
      />
    </AdminPageShell>
  );
}
