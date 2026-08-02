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

interface RankingItem {
  id: string; playerName: string; rank: number; rating: number;
  gamesPlayed: number; wins: number; losses: number; winRate: number;
  badge: string | null; region: string; title: string | null;
}

const fields = [
  { name: "playerName", label: "Player Name", required: true },
  { name: "rank", label: "Rank", type: "number" as const, required: true },
  { name: "rating", label: "Rating", type: "number" as const, required: true },
  { name: "gamesPlayed", label: "Games Played", type: "number" as const },
  { name: "wins", label: "Wins", type: "number" as const },
  { name: "region", label: "Region" },
  { name: "badge", label: "Badge", type: "select" as const, options: [{ label: "None", value: "" }, { label: "Gold", value: "Gold" }, { label: "Silver", value: "Silver" }, { label: "Bronze", value: "Bronze" }] },
  { name: "title", label: "Title" },
];

export default function AdminRankingsPage() {
  const [items, setItems] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<RankingItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/rankings");
    const { data } = await res.json(); setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true; const doFetch = async () => {
      const res = await fetch("/api/rankings");
      const { data } = await res.json();
      if (mounted) { setItems(data); setLoading(false); }
    }; doFetch();
    return () => { mounted = false };
  }, []);

  const handleSave = async (data: Record<string, string | number | boolean>) => {
    if (editItem) {
      await fetch(`/api/rankings/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      toast.success("Ranking updated");
    } else {
      await fetch("/api/rankings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      toast.success("Ranking created");
    }
    setEditItem(null);
    await fetchItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/rankings/${deleteId}`, { method: "DELETE" });
    toast.success("Ranking deleted");
    setDeleteId(null);
    await fetchItems();
  };

  const columns: Column<RankingItem>[] = [
    { key: "rank", label: "Rank", sortable: true, className: "w-16", render: (item) => (
      <span className="font-black text-slate-900 dark:text-white">#{item.rank}</span>
    )},
    { key: "playerName", label: "Player", sortable: true, render: (item) => (
      <div><span className="font-medium text-slate-900 dark:text-white">{item.playerName}</span>{item.title && <span className="text-xs text-slate-400 ml-2">{item.title}</span>}</div>
    )},
    { key: "rating", label: "Rating", sortable: true, render: (item) => <span className="font-bold text-brand">{item.rating}</span> },
    { key: "gamesPlayed", label: "Games", sortable: true },
    { key: "winRate", label: "Win %", sortable: true, render: (item) => <span>{item.winRate}%</span> },
    { key: "region", label: "Region" },
    { key: "badge", label: "Badge", render: (item) => item.badge ? <Badge variant={item.badge === "Gold" ? "accent" : "outline"} className="text-[9px]">{item.badge}</Badge> : <span className="text-slate-300">—</span> },
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
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Rankings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage player rankings and leaderboard data.</p>
        </div>
        <Button variant="brand" size="sm" className="rounded-xl gap-1" onClick={() => { setEditItem(null); setDialogOpen(true); }}>
          <Plus className="size-4" /> Add Player
        </Button>
      </div>
      <AdminDataTable columns={columns} data={items} searchKeys={["playerName", "region", "title"]} searchPlaceholder="Search players..." />
      <CrudDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditItem(null); }} onSave={handleSave} fields={fields} initial={editItem ?? {}} title={editItem ? "Edit Player" : "Add Player"} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete ranking?" />
    </div>
  );
}
