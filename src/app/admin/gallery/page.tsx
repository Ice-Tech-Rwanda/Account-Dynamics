"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import type { Column } from "@/components/admin/AdminDataTable";

interface GalleryItem {
  id: string; title: string; description: string; type: string;
  date: string; category: string | null;
}

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "type", label: "Type", type: "select" as const, options: [{ label: "Photos", value: "photos" }, { label: "Videos", value: "videos" }] },
  { name: "date", label: "Date", type: "date" as const },
  { name: "category", label: "Category", type: "select" as const, options: [{ label: "Office Events", value: "office-events" }, { label: "Workshops", value: "workshops" }, { label: "Community Outreach", value: "community" }, { label: "General", value: "general" }] },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/gallery");
    const { data } = await res.json(); setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true; const doFetch = async () => {
      const res = await fetch("/api/gallery");
      const { data } = await res.json();
      if (mounted) { setItems(data); setLoading(false); }
    }; doFetch();
    return () => { mounted = false };
  }, []);

  const handleSave = async (data: Record<string, string | number | boolean>) => {
    if (editItem) {
      await fetch(`/api/gallery/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      toast.success("Gallery item updated");
    } else {
      await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      toast.success("Gallery item created");
    }
    setEditItem(null);
    await fetchItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/gallery/${deleteId}`, { method: "DELETE" });
    toast.success("Gallery item deleted");
    setDeleteId(null);
    await fetchItems();
  };

  const columns: Column<GalleryItem>[] = [
    { key: "title", label: "Title", sortable: true, render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.title}</span> },
    { key: "type", label: "Type", render: (item) => <Badge variant={item.type === "videos" ? "destructive" : "default"} className="text-[9px]">{item.type}</Badge> },
    { key: "category", label: "Category", render: (item) => item.category ? <Badge variant="outline" className="text-[9px]">{item.category}</Badge> : <span className="text-slate-300">—</span> },
    { key: "date", label: "Date", sortable: true, render: (item) => <span className="text-xs text-slate-500">{formatDate(item.date)}</span> },
    { key: "id", label: "Actions", className: "text-right", render: (item) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => { setEditItem(item); setDialogOpen(true); }} className="rounded-lg p-1.5 text-slate-400 hover:text-brand hover:bg-brand/10"><Pencil className="size-3.5" /></button>
        <button onClick={() => setDeleteId(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-brand" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Gallery</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage photo and video albums.</p>
        </div>
        <Button variant="brand" size="sm" className="rounded-xl gap-1" onClick={() => { setEditItem(null); setDialogOpen(true); }}>
          <Plus className="size-4" /> Add Item
        </Button>
      </div>
      <AdminDataTable columns={columns} data={items} searchKeys={["title", "category", "type"]} searchPlaceholder="Search gallery..." />
      <CrudDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditItem(null); }} onSave={handleSave} fields={fields} initial={editItem ?? {}} title={editItem ? "Edit Gallery Item" : "Add Gallery Item"} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete gallery item?" />
    </div>
  );
}
