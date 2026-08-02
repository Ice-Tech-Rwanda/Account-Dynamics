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

interface Partner {
  id: string; name: string; type: string; tier: string | null;
  website: string | null; yearEstablished: number | null;
}

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "type", label: "Type", type: "select" as const, options: [{ label: "Sponsor", value: "sponsor" }, { label: "Partner", value: "partner" }, { label: "Media", value: "media" }] },
  { name: "tier", label: "Tier", type: "select" as const, options: [{ label: "None", value: "" }, { label: "Platinum", value: "platinum" }, { label: "Gold", value: "gold" }, { label: "Silver", value: "silver" }, { label: "Bronze", value: "bronze" }] },
  { name: "website", label: "Website" },
  { name: "yearEstablished", label: "Year", type: "number" as const },
];

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/partners");
    const { data } = await res.json(); setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true; const doFetch = async () => {
      const res = await fetch("/api/partners");
      const { data } = await res.json();
      if (mounted) { setItems(data); setLoading(false); }
    }; doFetch();
    return () => { mounted = false };
  }, []);

  const handleSave = async (data: Record<string, string | number | boolean>) => {
    if (editItem) {
      await fetch(`/api/partners/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      toast.success("Partner updated");
    } else {
      await fetch("/api/partners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      toast.success("Partner created");
    }
    setEditItem(null);
    await fetchItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/partners/${deleteId}`, { method: "DELETE" });
    toast.success("Partner deleted");
    setDeleteId(null);
    await fetchItems();
  };

  const tierColors: Record<string, "accent" | "default" | "secondary"> = { platinum: "accent", gold: "default", silver: "secondary", bronze: "secondary" };

  const columns: Column<Partner>[] = [
    { key: "name", label: "Name", sortable: true, render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.name}</span> },
    { key: "type", label: "Type", render: (item) => <Badge variant="brand" className="text-[9px]">{item.type}</Badge> },
    { key: "tier", label: "Tier", render: (item) => item.tier ? <Badge variant={tierColors[item.tier] || "outline"} className="text-[9px]">{item.tier}</Badge> : <span className="text-slate-300">—</span> },
    { key: "website", label: "Website", render: (item) => item.website ? <span className="text-xs text-slate-500 truncate max-w-[150px] inline-block">{item.website}</span> : <span className="text-slate-300">—</span> },
    { key: "yearEstablished", label: "Since", render: (item) => item.yearEstablished ? <span>{item.yearEstablished}</span> : <span className="text-slate-300">—</span> },
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
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Partners</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage sponsors, partners, and media contacts.</p>
        </div>
        <Button variant="brand" size="sm" className="rounded-xl gap-1" onClick={() => { setEditItem(null); setDialogOpen(true); }}>
          <Plus className="size-4" /> Add Partner
        </Button>
      </div>
      <AdminDataTable columns={columns} data={items} searchKeys={["name", "type", "tier"]} searchPlaceholder="Search partners..." />
      <CrudDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditItem(null); }} onSave={handleSave} fields={fields} initial={editItem ?? {}} title={editItem ? "Edit Partner" : "Add Partner"} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete partner?" />
    </div>
  );
}
