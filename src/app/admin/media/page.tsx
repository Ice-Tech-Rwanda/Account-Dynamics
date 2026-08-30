"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Image as ImageIcon, FileText } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";

export default function AdminMediaPage() {
  const { data, loading, search, setSearch, refresh } = useAdminList<any>({ endpoint: "/api/admin/media", pageSize: 24 });
  const [uploading, setUploading] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const formData = new FormData();
    for (const file of files) formData.append("files", file);
    try {
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json.uploaded?.length) toast.success(`${json.uploaded.length} file(s) uploaded`);
      if (json.errors?.length) toast.error(`${json.errors.length} file(s) failed`);
      refresh();
    } catch { toast.error("Upload failed"); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await fetch(`/api/admin/media/${deleteItem.id}`, { method: "DELETE" });
    toast.success("Deleted"); refresh(); setDeleteItem(null);
  };

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); toast.success("URL copied"); };

  return (
    <AdminPageShell title="Media Library" subtitle="Upload and manage images and files" onRefresh={refresh} loading={loading}>
      <div className="mb-4 flex items-center gap-3">
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleUpload} />
        <Button variant="brand" size="sm" className="rounded-xl gap-1.5" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <Upload className="size-3.5" /> {uploading ? "Uploading..." : "Upload Files"}
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
                <img src={item.url} alt={item.alt || item.name} className="w-full h-full object-cover" />
              ) : (
                <FileText className="size-8 text-slate-300" />
              )}
            </div>
            <div className="p-2">
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate">{item.name}</p>
              <p className="text-[10px] text-slate-400">{(item.size / 1024).toFixed(0)}KB</p>
            </div>
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => copyUrl(item.url)} className="h-6 w-6 rounded-md bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-500 hover:text-brand shadow-sm"><Copy className="size-3" /></button>
              <button onClick={() => setDeleteItem(item)} className="h-6 w-6 rounded-md bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-500 hover:text-red-500 shadow-sm"><Trash2 className="size-3" /></button>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-400">
          <ImageIcon className="size-12 mx-auto mb-3 text-slate-200" />
          <p className="text-sm">No media files yet. Upload your first file above.</p>
        </div>
      )}

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete media?" message="This will permanently remove this file." />
    </AdminPageShell>
  );
}
