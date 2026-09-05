"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminFetch } from "@/lib/admin-fetch";
import { Badge } from "@/components/ui/badge";

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  ADMIN: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  EDITOR: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
};

export default function AdminUsersPage() {
  const { data, loading, error, search, setSearch, page, setPage, totalPages, total, refresh } = useAdminList<any>({
    endpoint: "/api/admin/users",
    pageSize: 20,
  });
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const handleCreate = async (formData: Record<string, any>) => {
    const res = await adminFetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success("User created successfully");
      refresh();
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to create user");
    }
  };

  const handleUpdate = async (formData: Record<string, any>) => {
    if (!editItem) return;
    const res = await adminFetch(`/api/admin/users/${editItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success("User updated successfully");
      refresh();
      setEditItem(null);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const res = await adminFetch(`/api/admin/users/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("User deleted");
      refresh();
      setDeleteItem(null);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to delete user");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.name || "—"}</span>,
    },
    { key: "email", label: "Email Address", sortable: true },
    {
      key: "role",
      label: "Role",
      render: (item) => (
        <Badge className={`${ROLE_COLORS[item.role] ?? ""} border-0 text-[10px] font-bold`}>
          {item.role}
        </Badge>
      ),
    },
    {
      key: "active",
      label: "Active Status",
      render: (item) =>
        item.active ? (
          <span className="text-emerald-600 text-xs font-bold">Active</span>
        ) : (
          <span className="text-red-500 text-xs font-bold">Inactive</span>
        ),
    },
    {
      key: "lastLoginAt",
      label: "Last Login",
      render: (item) =>
        item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleDateString() : "Never",
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditItem(item);
            }}
            className="text-xs font-semibold text-brand hover:underline"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteItem(item);
            }}
            className="text-xs font-semibold text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="User Management"
      subtitle="Manage admin users, roles, and permissions (SUPER_ADMIN only)"
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add Admin User"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["name", "email", "role"]}
        searchPlaceholder="Search users by name or email..."
        pageSize={20}
        searchValue={search}
        onSearchChange={setSearch}
        serverPage={page}
        onPageChange={setPage}
        serverTotalPages={totalPages}
        serverTotal={total}
        error={error}
        onRetry={refresh}
      />

      <CrudDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleCreate}
        title="Create Admin User"
        fields={[
          { name: "name", label: "Full Name", required: true },
          { name: "email", label: "Email Address", type: "email", required: true },
          { name: "password", label: "Password", required: true, placeholder: "Min 12 characters, letters + numbers" },
          {
            name: "role",
            label: "Role",
            type: "select",
            options: [
              { label: "Editor", value: "EDITOR" },
              { label: "Admin", value: "ADMIN" },
              { label: "Super Admin", value: "SUPER_ADMIN" },
            ],
          },
        ]}
      />

      <CrudDialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSave={handleUpdate}
        title="Edit Admin User"
        initial={editItem ?? {}}
        fields={[
          { name: "name", label: "Full Name" },
          { name: "email", label: "Email Address", type: "email" },
          {
            name: "role",
            label: "Role",
            type: "select",
            options: [
              { label: "Editor", value: "EDITOR" },
              { label: "Admin", value: "ADMIN" },
              { label: "Super Admin", value: "SUPER_ADMIN" },
            ],
          },
          { name: "active", label: "Active Account", type: "checkbox" },
        ]}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete user account?"
        message={`Are you sure you want to delete ${deleteItem?.email}? This action cannot be undone.`}
      />
    </AdminPageShell>
  );
}
