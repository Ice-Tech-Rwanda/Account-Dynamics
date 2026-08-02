"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { toast } from "sonner";
import type { Column } from "@/components/admin/AdminDataTable";

interface Resource {
  id: string;
  title: string;
  description?: string;
  category?: string;
  author?: string;
  readTime?: string;
  downloadCount?: number;
  publishedAt?: string;
  status?: string;
  fileUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "description", label: "Description", type: "textarea" as const, required: true },
  { name: "category", label: "Category", type: "select" as const, options: [{ label: "Article", value: "article" }, { label: "Tutorial", value: "tutorial" }, { label: "Guide", value: "guide" }, { label: "Download", value: "download" }] },
  { name: "author", label: "Author", required: true },
  { name: "readTime", label: "Read Time" },
];

export default function AdminResourcesPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Resource | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/admin/resources/list");
    const json = await res.json();
    setItems(json.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true; const doFetch = async () => {
      const res = await fetch("/api/admin/resources/list");
      const json = await res.json();
      if (mounted) { setItems(json.items ?? []); setLoading(false); }
    }; doFetch();
    return () => { mounted = false };
  }, []);

  const handleSave = async (data: Record<string, string | number | boolean>) => {
    try {
      if (editItem) {
        await fetch(`/api/admin/resources/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        toast.success("Resource updated");
      } else {
        await fetch("/api/admin/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        toast.success("Resource created");
      }
      setEditItem(null);
      await fetchItems();
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/resources/${deleteId}`, { method: "DELETE" });
    toast.success("Resource deleted");
    setDeleteId(null);
    await fetchItems();
  };

  const columns: Column<Resource>[] = [
    { key: "title", label: "Title", sortable: true, render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.title}</span> },
    { key: "category", label: "Category", render: (item) => <Badge variant="brand" className="text-[9px]">{item.category}</Badge> },
    { key: "author", label: "Author", render: (item) => <span className="text-slate-500">{item.author}</span> },
    { key: "readTime", label: "Read", render: (item) => <span className="text-xs text-slate-400">{item.readTime ?? "—"}</span> },
    { key: "downloadCount", label: "Downloads", sortable: true, render: (item) => <span className="text-slate-500">{item.downloadCount ?? "—"}</span> },
    { key: "publishedAt", label: "Published", sortable: true, render: (item) => <span className="text-xs text-slate-500">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "—"}</span> },
    { key: "id", label: "Actions", className: "text-right", render: (item) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => { setEditItem(item); setDialogOpen(true); }} className="rounded-lg p-1.5 text-slate-400 hover:text-brand hover:bg-brand/10"><Pencil className="size-3.5" /></button>
        <button onClick={() => setDeleteId(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="size-3.5" /></button>
        <button onClick={async () => {
          // preview accessibility
          if (!item.fileUrl) { toast.error('No file to preview'); return; }
          try {
            const r = await fetch('/api/admin/resources/preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileUrl: item.fileUrl }) });
            const j = await r.json();
            if (j.ok) toast.success('Preview OK'); else toast.error('Preview issues: ' + JSON.stringify(j.issues ?? j));
          } catch (e: any) { toast.error(e?.message ?? 'Preview failed'); }
        }} className="rounded-lg p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50">Preview</button>
        {item.status !== 'published' ? (
          <button onClick={async () => {
            try { await fetch('/api/admin/resources/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, action: 'publish' }) }); toast.success('Published'); await fetchItems(); } catch (e: any) { toast.error(e?.message ?? 'Publish failed'); }
          }} className="rounded-lg p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50">Publish</button>
        ) : (
          <button onClick={async () => { try { await fetch('/api/admin/resources/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, action: 'unpublish' }) }); toast.success('Unpublished'); await fetchItems(); } catch (e: any) { toast.error(e?.message ?? 'Unpublish failed'); } }} className="rounded-lg p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50">Unpublish</button>
        )}
      </div>
    )},
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-brand" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Resources</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage articles, tutorials, guides, and downloads.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={async () => {
            try {
              const res = await fetch('/api/admin/resources/export');
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `resources-${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(a); a.click(); a.remove();
            } catch (e: any) { toast.error(e?.message ?? 'Export failed'); }
          }}>Export CSV</Button>
          <Button variant="brand" size="sm" className="rounded-xl gap-1" onClick={() => { setEditItem(null); setDialogOpen(true); }}>
            <Plus className="size-4" /> Add Resource
          </Button>
        </div>
      </div>
      <AdminDataTable columns={columns} data={items} searchKeys={["title", "author", "category"]} searchPlaceholder="Search resources..." />
      <CrudDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditItem(null); }} onSave={handleSave} fields={fields} initial={editItem ?? {}} title={editItem ? "Edit Resource" : "Add Resource"} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete resource?" />
    </div>
  );
}
