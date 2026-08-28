"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { toast } from "sonner";
import { LoadingState } from "@/components/shared/LoadingState";
import type { Column } from "@/components/admin/AdminDataTable";

interface TeamMember {
  id: string; name: string; role: string; bio: string;
  socialLinks: { twitter?: string; linkedin?: string; email?: string } | null;
}

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "role", label: "Role", required: true },
  { name: "bio", label: "Bio", type: "textarea" as const },
];

export default function AdminTeamClient({ initialPage = 1 }: { initialPage?: number }) {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);

  const fetchItems = useCallback(async (p = 1) => {
    setLoading(true);
    const res = await fetch(`/api/team?page=${p}`);
    const json = await res.json();
    setItems((json.data ?? []).map((m: any) => ({ ...m, socialLinks: typeof m.socialLinks === "string" ? JSON.parse(m.socialLinks as string) : m.socialLinks })));
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/team?page=${page}`);
      const json = await res.json();
      if (cancelled) return;
      setItems((json.data ?? []).map((m: any) => ({ ...m, socialLinks: typeof m.socialLinks === "string" ? JSON.parse(m.socialLinks as string) : m.socialLinks })));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [page]);

  const handleSave = async (data: Record<string, string | number | boolean>) => {
    try {
      if (editItem) {
        await fetch(`/api/team/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        toast.success("Team member updated");
      } else {
        await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        toast.success("Team member added");
      }
      setEditItem(null);
      await fetchItems(page);
    } catch (err: any) { toast.error(err?.message ?? 'Save failed'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/team/${deleteId}`, { method: "DELETE" });
    toast.success("Team member removed");
    setDeleteId(null);
    await fetchItems(page);
  };

  const columns: Column<TeamMember>[] = [
    { key: "name", label: "Name", sortable: true, render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.name}</span> },
    { key: "role", label: "Role", sortable: true, render: (item) => <span className="text-slate-500">{item.role}</span> },
    { key: "bio", label: "Bio", render: (item) => <span className="text-xs text-slate-400 line-clamp-1 max-w-[300px] inline-block">{item.bio}</span> },
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
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Team</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage team members and roles.</p>
        </div>
        <Button variant="brand" size="sm" className="rounded-xl gap-1" onClick={() => { setEditItem(null); setDialogOpen(true); }}>
          <Plus className="size-4" /> Add Member
        </Button>
      </div>
      <AdminDataTable columns={columns} data={items} searchKeys={["name", "role"]} searchPlaceholder="Search team..." />
      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={async () => { if (page>1) { setPage(p=>p-1); await fetchItems(page-1); } }}>Previous</Button>
        <div className="text-sm text-slate-500">Page {page}</div>
        <Button variant="outline" size="sm" onClick={async () => { setPage(p=>p+1); await fetchItems(page+1); }}>Next</Button>
      </div>
      <CrudDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditItem(null); }} onSave={handleSave} fields={fields} initial={editItem ?? {}} title={editItem ? "Edit Team Member" : "Add Team Member"} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remove team member?" />
    </div>
  );
}
