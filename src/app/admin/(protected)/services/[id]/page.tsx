"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AdminServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/services/${id}`).then(r => r.ok ? r.json() : null).then(setItem).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/services/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    setSaving(false);
    if (res.ok) { toast.success("Service updated"); router.push("/admin/services"); }
    else toast.error("Failed to update");
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;
  if (!item) return <div className="p-8 text-center text-slate-400">Not found</div>;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/services" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand mb-4"><ArrowLeft className="size-4" /> Back to Services</Link>
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50 p-6 space-y-4">
        <h1 className="text-lg font-black text-slate-900 dark:text-white">Edit Service</h1>
        <div><Label>Name</Label><Input value={item.name ?? ""} onChange={e => setItem({ ...item, name: e.target.value })} className="mt-1" /></div>
        <div><Label>Description</Label><textarea value={item.description ?? ""} onChange={e => setItem({ ...item, description: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[100px]" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Icon</Label><Input value={item.icon ?? ""} onChange={e => setItem({ ...item, icon: e.target.value })} className="mt-1" /></div>
          <div><Label>Display Order</Label><Input type="number" value={item.displayOrder ?? 0} onChange={e => setItem({ ...item, displayOrder: Number(e.target.value) })} className="mt-1" /></div>
        </div>
        <div><Label>Status</Label><select value={item.status ?? "PUBLISHED"} onChange={e => setItem({ ...item, status: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option></select></div>
        <div className="flex justify-end gap-2 pt-4"><Button variant="outline" className="rounded-xl" onClick={() => router.push("/admin/services")}>Cancel</Button><Button variant="brand" className="rounded-xl" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button></div>
      </div>
    </div>
  );
}
