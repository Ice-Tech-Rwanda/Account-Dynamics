"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { toast } from "sonner";
import { LoadingState } from "@/components/shared/LoadingState";
import type { Column } from "@/components/admin/AdminDataTable";

interface Donation {
  id: string;
  donorName: string | null;
  donorEmail: string | null;
  amount: number;
  message: string | null;
  anonymous: boolean;
  status: string;
  createdAt: string;
}

const fields = [
  { name: "donorName", label: "Donor Name", required: true },
  { name: "donorEmail", label: "Donor Email", type: "email" as const, required: true },
  { name: "amount", label: "Amount (FRW)", type: "number" as const, required: true },
  { name: "message", label: "Message", type: "textarea" as const },
  { name: "status", label: "Status", type: "select" as const, options: [{ label: "Completed", value: "completed" }, { label: "Pending", value: "pending" }] },
  { name: "anonymous", label: "Anonymous", type: "select" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
];

export default function AdminDonationsClient({ initialData }: { initialData: Donation[] }) {
  const [items, setItems] = useState<Donation[]>(initialData ?? []);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Donation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/donations");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setItems(json.data ?? []);
    } catch {
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initialData provided from server; keep it but refresh to ensure latest
    if (initialData && initialData.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/donations");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (!cancelled) setItems(json.data ?? []);
      } catch {
        if (!cancelled) toast.error("Failed to load donations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialData]);

  const handleSave = async (data: Record<string, string | number | boolean>) => {
    const payload = { ...data, anonymous: data.anonymous === "true" || data.anonymous === true };
    try {
      if (editItem) {
        await fetch(`/api/admin/donations/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        toast.success("Donation updated");
      } else {
        await fetch("/api/admin/donations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        toast.success("Donation created");
      }
      setEditItem(null);
      await fetchItems();
    } catch {
      toast.error("Save failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/donations/${deleteId}`, { method: "DELETE" });
      toast.success("Donation deleted");
      setDeleteId(null);
      await fetchItems();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/admin/donations/export`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donations-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }
  };

  const total = items.reduce((s, d) => s + (d.status === "completed" ? d.amount : 0), 0);

  const columns: Column<Donation>[] = [
    { key: "donorName", label: "Donor", sortable: true, render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.anonymous ? "Anonymous" : item.donorName}</span> },
    { key: "donorEmail", label: "Email", render: (item) => <span className="text-slate-500">{item.anonymous ? "—" : item.donorEmail}</span> },
    { key: "amount", label: "Amount", sortable: true, render: (item) => <span className="font-bold text-brand">{item.amount.toLocaleString()} FRW</span> },
    { key: "status", label: "Status", render: (item) => <Badge variant={item.status === "completed" ? "brand" : "accent"} className="text-[9px]">{item.status}</Badge> },
    { key: "createdAt", label: "Date", sortable: true, render: (item) => <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span> },
    { key: "id", label: "Actions", className: "text-right", render: (item) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => { setEditItem(item); setDialogOpen(true); }} className="rounded-lg p-1.5 text-slate-400 hover:text-brand hover:bg-brand/10"><Pencil className="size-3.5" /></button>
        <button onClick={() => setDeleteId(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Donations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track donations, reconciliation, and exports.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="rounded-xl gap-1" onClick={handleExport}><Download className="size-4" /> Export CSV</Button>
          <Button variant="brand" size="sm" className="rounded-xl gap-1" onClick={() => { setEditItem(null); setDialogOpen(true); }}>
            <Plus className="size-4" /> Add Donation
          </Button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-brand/20 bg-brand/5 p-5 dark:bg-brand/10">
        <p className="text-xs font-medium text-brand uppercase tracking-wider">Total Raised</p>
        <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">FRW {total.toLocaleString()}</p>
      </div>

      <AdminDataTable columns={columns} data={items} searchKeys={["donorName", "donorEmail"]} searchPlaceholder="Search donations..." />
      <CrudDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditItem(null); }} onSave={handleSave} fields={fields} initial={editItem ?? {}} title={editItem ? "Edit Donation" : "Add Donation"} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete donation?" />
    </div>
  );
}
