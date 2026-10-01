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

export default function AdminTourPackagesPage() {
  const { data, loading, error, search, setSearch, page, setPage, totalPages, total, refresh, params, setParams } = useAdminList<any>({
    endpoint: "/api/admin/tour-packages",
    pageSize: 20,
  });
  const { canDelete, deleteItem, setDeleteItem, toggleArchive, confirmDelete } =
    useContentActions<any>("/api/admin/tour-packages", refresh, { singular: "tour package" });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleSave = async (formData: Record<string, any>) => {
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/admin/tour-packages/${editItem.id}` : "/api/admin/tour-packages";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success(editItem ? "Tour package updated" : "Tour package created");
      refresh();
      setEditItem(null);
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to save tour package");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (item) => (
        <span className="font-medium text-slate-900 dark:text-white line-clamp-1">{item.title}</span>
      ),
    },
    { key: "slug", label: "Slug" },
    { key: "location", label: "Location" },
    {
      key: "duration",
      label: "Duration",
      render: (item) => (item.duration ? `${item.duration}` : "—"),
    },
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
      title="Tour Packages"
      subtitle="Safari and tour packages across Rwanda and East Africa"
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add Tour Package"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["title", "slug", "location"]}
        searchPlaceholder="Search tour packages..."
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
        title={editItem ? "Edit Tour Package" : "Add Tour Package"}
        initial={editItem ?? {}}
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "slug", label: "Slug", required: true, placeholder: "gorilla-trekking-5-days" },
          { name: "location", label: "Location" },
          { name: "category", label: "Travel Category", placeholder: "Wildlife, culture, adventure..." },
          { name: "duration", label: "Duration (e.g. 5 days)", type: "text" },
          { name: "price", label: "Price (optional)", type: "text", placeholder: "$30,000.00 — blank means price on request" },
          { name: "priceNote", label: "Price Note", placeholder: "e.g. Per person, based on 2 travellers" },
          { name: "overview", label: "Overview", type: "textarea" },
          { name: "facts", label: "Quick Facts", type: "textarea", placeholder: "Group size, difficulty, best season, style... (one per line)" },
          {
            name: "highlights",
            label: "Highlights",
            type: "stringList",
            itemLabel: "highlight",
            addLabel: "Add",
            placeholder: "What makes this trip memorable...",
          },
          {
            name: "itinerary",
            label: "Itinerary",
            type: "objectList",
            itemLabel: "day",
            addLabel: "Add",
            itemFields: [
              { name: "heading", label: "Heading", placeholder: "Day 1 — Arrival in Kigali" },
              { name: "body", label: "Details", type: "textarea" },
            ],
          },
          { name: "inclusions", label: "Inclusions", type: "stringList", itemLabel: "item", addLabel: "Add" },
          { name: "exclusions", label: "Exclusions", type: "stringList", itemLabel: "item", addLabel: "Add" },
          { name: "note", label: "Additional Note", type: "textarea" },
          { name: "image", label: "Featured Image", type: "image" },
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
        title="Delete Tour Package?"
        message={`Are you sure you want to delete "${deleteItem?.title}"?`}
      />
    </AdminPageShell>
  );
}
