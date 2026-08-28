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

interface EventItem {
  id: string; title: string; slug: string; description: string; category: string;
  startDate: string; endDate: string | null; location: string; status: string;
  maxParticipants: number | null; featured: boolean;
}

const fields = [
  { name: "title", label: "Title", required: true },
  { name: "description", label: "Description", type: "textarea" as const, required: true },
  { name: "category", label: "Category", type: "select" as const, required: true, options: [{ label: "Seminar", value: "seminar" }, { label: "Workshop", value: "workshop" }, { label: "Webinar", value: "webinar" }, { label: "Networking", value: "networking" }] },
  { name: "startDate", label: "Start Date", type: "date" as const, required: true },
  { name: "endDate", label: "End Date", type: "date" as const },
  { name: "location", label: "Location", required: true },
  { name: "status", label: "Status", type: "select" as const, options: [{ label: "Upcoming", value: "upcoming" }, { label: "Ongoing", value: "ongoing" }, { label: "Completed", value: "completed" }] },
  { name: "maxParticipants", label: "Max Participants", type: "number" as const },
];

const statusColors: Record<string, "brand" | "accent" | "secondary"> = { upcoming: "brand", ongoing: "accent", completed: "secondary" };

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<EventItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/events");
    const { data } = await res.json(); setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true; const doFetch = async () => {
      const res = await fetch("/api/events");
      const { data } = await res.json();
      if (mounted) { setItems(data); setLoading(false); }
    }; doFetch();
    return () => { mounted = false };
  }, []);

  const handleSave = async (data: Record<string, string | number | boolean>) => {
    if (editItem) {
      await fetch(`/api/events/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      toast.success("Event updated");
    } else {
      await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      toast.success("Event created");
    }
    setEditItem(null);
    await fetchItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/events/${deleteId}`, { method: "DELETE" });
    toast.success("Event deleted");
    setDeleteId(null);
    await fetchItems();
  };

  const columns: Column<EventItem>[] = [
    { key: "title", label: "Title", sortable: true, render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.title}</span> },
    { key: "category", label: "Category", render: (item) => <Badge variant="brand" className="text-[9px]">{item.category}</Badge> },
    { key: "startDate", label: "Date", sortable: true, render: (item) => <span className="text-xs text-slate-500">{formatDate(item.startDate)}</span> },
    { key: "location", label: "Location", render: (item) => <span className="text-xs text-slate-500">{item.location}</span> },
    { key: "status", label: "Status", render: (item) => <Badge variant={statusColors[item.status] || "default"} className="text-[9px]">{item.status}</Badge> },
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
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Events</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Create and manage seminars, webinars and workshops.</p>
        </div>
        <Button variant="brand" size="sm" className="rounded-xl gap-1" onClick={() => { setEditItem(null); setDialogOpen(true); }}>
          <Plus className="size-4" /> New Event
        </Button>
      </div>
      <AdminDataTable columns={columns} data={items} searchKeys={["title", "location"]} searchPlaceholder="Search events..." />
      <CrudDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditItem(null); }} onSave={handleSave} fields={fields} initial={editItem ?? {}} title={editItem ? "Edit Event" : "New Event"} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete event?" />
    </div>
  );
}
