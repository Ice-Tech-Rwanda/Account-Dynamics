"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Image as ImageIcon, FileText, Pencil, Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { adminFetch } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminMediaPage() {
  const { data, loading, error, search, setSearch, refresh } = useAdminList<any>({ endpoint: "/api/admin/media", pageSize: 24 });
  const [uploading, setUploading] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [urlOpen, setUrlOpen] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [urlAlt, setUrlAlt] = useState("");
  const [urlSaving, setUrlSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const formData = new FormData();
    for (const file of files) formData.append("files", file);
    try {
      const res = await adminFetch("/api/admin/media/upload", { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errors?.length) {
          const first = json.errors[0];
          toast.error(`${first.filename}: ${first.error}`);
        } else {
          toast.error(json.error || "Upload failed");
        }
        return;
      }
      if (json.uploaded?.length) toast.success(`${json.uploaded.length} file(s) uploaded`);
      if (json.errors?.length) toast.error(`${json.errors.length} file(s) failed: ${json.errors[0].error}`);
      refresh();
    } catch { toast.error("Upload failed"); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAddByUrl = async () => {
    if (!urlValue.trim()) { toast.error("Please paste an image URL"); return; }
    setUrlSaving(true);
    try {
      const res = await adminFetch("/api/admin/media/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlValue, alt: urlAlt }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Image added from URL");
        setUrlOpen(false);
        setUrlValue("");
        setUrlAlt("");
        refresh();
      } else {
        toast.error(json.error || "Failed to add by URL");
      }
    } catch { toast.error("Failed to add by URL"); }
    setUrlSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await adminFetch(`/api/admin/media/${deleteItem.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted"); refresh();
      } else {
        const e = await res.json().catch(() => ({}));
        toast.error(e.error || "Failed to delete");
      }
    } catch { toast.error("Failed to delete"); }
    setDeleteItem(null);
  };

  const handleSave = async (formData: Record<string, any>) => {
    if (!editItem) return;
    const res = await adminFetch(`/api/admin/media/${editItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success("Media updated");
      refresh();
      setEditItem(null);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to update");
    }
  };

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); toast.success("URL copied"); };
  const formatSize = (size?: number | null) => {
    if (size == null) return "—";
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)}MB`;
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  };

  return (
    <AdminPageShell title="Media Library" subtitle="Upload and manage images (JPG, PNG, WebP, GIF) used across the website" onRefresh={refresh} loading={loading}>
      <div className="mb-4 flex items-center gap-3">
        <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleUpload} />
        <Button variant="brand" size="sm" className="rounded-xl gap-1.5" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <Upload className="size-3.5" /> {uploading ? "Uploading..." : "Upload Files"}
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => setUrlOpen(true)}>
          <Plus className="size-3.5" /> Add by URL
        </Button>
        <div className="relative flex-1 max-w-xs">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media..." className="w-full h-9 pl-3 pr-3 rounded-lg border border-slate-200 bg-white text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {data.map((item: any) => (
          <div key={item.id} className="group relative rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50 overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {item.mimeType?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.alt || item.name} className="w-full h-full object-cover" />
              ) : (
                <FileText className="size-8 text-slate-300" />
              )}
            </div>
            <div className="p-2">
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate">{item.name}</p>
              <p className="text-[10px] text-slate-400">{formatSize(item.size)}</p>
            </div>
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => copyUrl(item.url)} className="h-6 w-6 rounded-md bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-500 hover:text-brand shadow-sm"><Copy className="size-3" /></button>
              <button onClick={() => setEditItem(item)} className="h-6 w-6 rounded-md bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-500 hover:text-brand shadow-sm"><Pencil className="size-3" /></button>
              <button onClick={() => setDeleteItem(item)} className="h-6 w-6 rounded-md bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-500 hover:text-red-500 shadow-sm"><Trash2 className="size-3" /></button>
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <AlertTriangle className="size-7 text-red-400" />
          <p className="text-sm text-slate-500">{error === "Failed to fetch" ? "Could not load media. Please check your connection and try again." : error}</p>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 mt-1" onClick={refresh}>
            <RefreshCw className="size-3.5" /> Retry
          </Button>
        </div>
      ) : data.length === 0 && !loading ? (
        <div className="text-center py-12 text-slate-400">
          <ImageIcon className="size-12 mx-auto mb-3 text-slate-200" />
          <p className="text-sm">No media files yet. Upload your first file above.</p>
        </div>
      ) : null}

      <CrudDialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSave={handleSave}
        title="Edit Media"
        initial={editItem ?? {}}
        fields={[
          { name: "alt", label: "Alt Text (accessibility)" },
          { name: "title", label: "Title" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
      />

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete media?" message="This will permanently remove this file." />

      {urlOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setUrlOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Add image by URL</h2>
              <button onClick={() => setUrlOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Image URL</Label>
                <Input
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 rounded-xl"
                />
                <p className="mt-1 text-[11px] text-slate-400">Must end in .jpg, .png, .webp, or .gif.</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Alt text (optional)</Label>
                <Input
                  value={urlAlt}
                  onChange={(e) => setUrlAlt(e.target.value)}
                  placeholder="Describe the image"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setUrlOpen(false)}>Cancel</Button>
              <Button variant="brand" size="sm" className="rounded-xl" onClick={handleAddByUrl} disabled={urlSaving}>
                {urlSaving ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}