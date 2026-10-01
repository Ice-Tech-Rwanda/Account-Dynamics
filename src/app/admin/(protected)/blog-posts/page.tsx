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

export default function AdminBlogPostsPage() {
  const { data, loading, error, search, setSearch, page, setPage, totalPages, total, refresh, params, setParams } = useAdminList<any>({
    endpoint: "/api/admin/blog-posts",
    pageSize: 20,
  });
  const { canDelete, deleteItem, setDeleteItem, toggleArchive, confirmDelete } =
    useContentActions<any>("/api/admin/blog-posts", refresh, { singular: "blog post" });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleSave = async (formData: Record<string, any>) => {
    const payload = { ...formData };
    if (!payload.readTime) payload.readTime = null;
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/admin/blog-posts/${editItem.id}` : "/api/admin/blog-posts";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editItem ? "Blog post updated" : "Blog post created");
      refresh();
      setEditItem(null);
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to save blog post");
      throw new Error(e.error || "Failed to save blog post");
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
    { key: "category", label: "Category" },
    { key: "author", label: "Author", render: (item) => item.author || "Global Line Safaris" },
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
    { key: "readTime", label: "Read (min)", render: (item) => item.readTime ?? "—" },
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
      title="Blog Posts"
      subtitle="Travel guides and safari stories shown at /blog"
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add Blog Post"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["title", "slug", "excerpt", "category"]}
        searchPlaceholder="Search blog posts..."
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
        title={editItem ? "Edit Blog Post" : "Add Blog Post"}
        initial={editItem ?? {}}
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "slug", label: "Slug", required: true, placeholder: "how-to-plan-a-gorilla-trek" },
          { name: "excerpt", label: "Excerpt", type: "textarea" },
          { name: "content", label: "Article Content", type: "textarea" },
          { name: "category", label: "Category", placeholder: "Travel Guides" },
          { name: "image", label: "Cover Image", type: "image" },
          { name: "author", label: "Author" },
          { name: "readTime", label: "Read Time (minutes)", type: "number", min: 1 },
          { name: "seoTitle", label: "SEO Title", placeholder: "Optional search title" },
          { name: "seoDescription", label: "SEO Description", type: "textarea" },
          { name: "displayOrder", label: "Display Order", type: "number", min: 0 },
          { name: "featured", label: "Featured in journal", type: "checkbox" },
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
        title="Delete Blog Post?"
        message={`Are you sure you want to delete "${deleteItem?.title}"?`}
      />
    </AdminPageShell>
  );
}