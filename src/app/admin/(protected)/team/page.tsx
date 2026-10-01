"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useAdminList } from "@/components/admin/useAdminList";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { CrudDialog } from "@/components/admin/CrudDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useContentActions } from "@/components/admin/useContentActions";
import { StatusFilter } from "@/components/admin/StatusFilter";
import { Badge } from "@/components/ui/badge";

export default function AdminTeamPage() {
const { data, loading, error, search, setSearch, page, setPage, totalPages, total, refresh, params, setParams } = useAdminList<any>({
    endpoint: "/api/admin/team-members",
    pageSize: 20,
  });
  const { canDelete, deleteItem, setDeleteItem, toggleArchive, confirmDelete } =
    useContentActions<any>("/api/admin/team-members", refresh, { singular: "team member" });
  const [editItem, setEditItem] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleSave = async (formData: Record<string, any>) => {
    const payload: Record<string, any> = { ...formData };
    if (typeof payload.expertise === "string") {
      payload.expertise = payload.expertise
        .split(",")
        .map((e: string) => e.trim())
        .filter(Boolean);
    }
    const method = editItem ? "PATCH" : "POST";
    const url = editItem ? `/api/admin/team-members/${editItem.id}` : "/api/admin/team-members";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editItem ? "Team member updated" : "Team member added");
      refresh();
      setEditItem(null);
      setShowCreate(false);
    } else {
      const e = await res.json().catch(() => ({}));
      toast.error(e.error || "Failed to save team member");
    }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>,
    },
    { key: "role", label: "Position / Role" },
    {
      key: "isFounder",
      label: "Founder",
      render: (item) =>
        item.isFounder ? (
          <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Founder</Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge
          className={
            item.status === "PUBLISHED"
              ? "bg-emerald-100 text-emerald-700 border-0 text-[10px]"
              : item.status === "ARCHIVED"
              ? "bg-slate-200 text-slate-600 border-0 text-[10px] dark:bg-slate-700/60"
              : "bg-amber-100 text-amber-700 border-0 text-[10px]"
          }
        >
          {item.status}
        </Badge>
      ),
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
          {item.status === "ARCHIVED" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleArchive(item);
              }}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Restore
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleArchive(item);
              }}
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              Archive
            </button>
          )}
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteItem(item);
              }}
              className="text-xs font-semibold text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="Team Members"
      subtitle="Manage Global Line Safaris team profiles"
      onRefresh={refresh}
      loading={loading}
      onAdd={() => setShowCreate(true)}
      addLabel="Add Member"
    >
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        searchKeys={["name", "role", "bio"]}
        searchPlaceholder="Search team members..."
        filters={(
          <StatusFilter
            value={params.status ?? ""}
            onChange={(status) => setParams({ status })}
          />
        )}
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
        open={showCreate || !!editItem}
        onClose={() => {
          setShowCreate(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        title={editItem ? "Edit Member" : "Add Member"}
        initial={editItem ?? {}}
        fields={[
          { name: "name", label: "Full Name", required: true },
          { name: "role", label: "Position / Role", required: true },
          { name: "bio", label: "Biography", type: "textarea" },
          { name: "photo", label: "Photo", type: "image", placeholder: "/uploads/... or https://..." },
          { name: "email", label: "Email (optional)", type: "email" },
          { name: "linkedin", label: "LinkedIn Profile URL" },
          { name: "expertise", label: "Expertise", type: "stringList", itemLabel: "skill", addLabel: "Add", placeholder: "Gorilla trekking, Safari guiding..." },
          { name: "isFounder", label: "Company Founder", type: "checkbox" },
          { name: "displayOrder", label: "Display Order", type: "number", min: 0 },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Published", value: "PUBLISHED" },
              { label: "Draft", value: "DRAFT" },
              { label: "Archived", value: "ARCHIVED" },
            ],
          },
        ]}
      />

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        title="Delete team member?"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
      />
    </AdminPageShell>
  );
}
