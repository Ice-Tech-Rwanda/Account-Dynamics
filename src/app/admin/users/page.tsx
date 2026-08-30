"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  ADMIN: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  EDITOR: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
};

export default function AdminUsersPage() {
  const { data, loading, search, setSearch, refresh } = useAdminList<any>({ endpoint: "/api/admin/users", pageSize: 20 });
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const handleCreate = async (formData: Record<string, any>) => {
    const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) { toast.success("User created"); refresh(); setShowCreate(false); }
    else { const e = await res.json().catch(() => ({})); toast.error(e.error || "Failed"); }
  };

  const handleUpdate = async (formData: Record<string, any>) => {
    if (!editItem) return;
    const res = await fetch(`/api/admin/users/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) { toast.success("User updated"); refresh(); setEditItem(null); }
    else { const e = await res.json().catch(() => ({})); toast.error(e.error || "Failed"); }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const res = await fetch(`/api/admin/users/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) { toast.success("User deleted"); refresh(); setDeleteItem(null); }
    else { const e = await res.json().catch(() => ({})); toast.error(e.error || "Failed"); }
  };

  const columns: Column<any>[] = [
    { key: "name", label: "Name", sortable: true, render: (item) => <span className="font-medium">{item.name || "—"}</span> },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", render: (item) => <Badge className={`${ROLE_COLORS[item.role] ?? ""} border-0 text-[10px] font-bold`}>{item.role}</Badge> },
    { key: "active", label: "Active", render: (item) => item.active ? <span className="text-emerald-600 text-xs font-bold">Yes</span> : <span className="text-red-500 text-xs font-bold">No</span> },
    { key: "lastLoginAt", label: "Last Login", render: (item) => item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleDateString() : "Never" },
    { key: "actions", label: "", render: (item) => (
      <div className="flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); setEditItem(item); }} className="text-xs text-brand hover:underline">Edit</button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteItem(item); }} className="text-xs text-red-500 hover:underline">Delete</button>
      </div>
    )},
  ];

  return (
    <AdminPageShell title="Users" subtitle="Manage admin users (SUPER_ADMIN only)" onRefresh={refresh} loading={loading} onAdd={() => setShowCreate(true)} addLabel="Add User">
      <CrudDialog open={showCreate} onClose={() => setShowCreate(false)} onSave={handleCreate} title="Create User" fields={[
        { name: "name", label: "Name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Password", required: true, placeholder: "Min 8 characters" },
        { name: "role", label: "Role", type: "select", options: [{ label: "Editor", value: "EDITOR" }, { label: "Admin", value: "ADMIN" }, { label: "Super Admin", value: "SUPER_ADMIN" }] },
      ]} />
      <CrudDialog open={!!editItem} onClose={() => setEditItem(null)} onSave={handleUpdate} title="Edit User" initial={editItem ?? {}} fields={[
        { name: "name", label: "Name" },
        { name: "email", label: "Email", type: "email" },
        { name: "role", label: "Role", type: "select", options: [{ label: "Editor", value: "EDITOR" }, { label: "Admin", value: "ADMIN" }, { label: "Super Admin", value: "SUPER_ADMIN" }] },
      ]} />
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete user?" message="This action cannot be undone." />
    </AdminPageShell>
  );
}
