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

interface ProductItem {
  id: string; name: string; slug: string; price: number; category: string;
  inStock: boolean; stock: number | null; rating: number; reviewCount: number;
}

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "slug", label: "Slug", required: true },
  { name: "price", label: "Price (FRW)", type: "number" as const, required: true },
  { name: "category", label: "Category", type: "select" as const, options: [{ label: "Boards", value: "boards" }, { label: "Books", value: "books" }, { label: "Merch", value: "merch" }, { label: "Accessories", value: "accessories" }] },
  { name: "inStock", label: "In Stock", type: "select" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
  { name: "stock", label: "Stock Count", type: "number" as const },
];

export default function AdminShopPage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProductItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async (p = 1) => {
    const res = await fetch(`/api/admin/products?page=${p}&perPage=${perPage}`);
    const json = await res.json();
    setItems(json.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true; const doFetch = async () => {
      const res = await fetch(`/api/admin/products?page=1&perPage=${perPage}`);
      const json = await res.json();
      if (mounted) { setItems(json.items ?? []); setLoading(false); }
    }; doFetch();
    return () => { mounted = false };
  }, [perPage]);

  const handleSave = async (data: Record<string, string | number | boolean>) => {
    try {
      if (editItem) {
        await fetch(`/api/admin/products/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        toast.success("Product updated");
      } else {
        await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        toast.success("Product created");
      }
      setEditItem(null);
      await fetchItems(page);
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
    toast.success("Product deleted");
    setDeleteId(null);
    await fetchItems(page);
  };

  const getUploadToken = async (filename: string) => {
    try {
      const res = await fetch('/api/admin/products/signed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename }) });
      const j = await res.json();
      return j.token as string | null;
    } catch {
      return null;
    }
  };

  const exportCsvCurrent = async () => {
    const rows = items;
    const headers = ['id','name','slug','price','stock','category'];
    const csv = [headers.join(','), ...rows.map(r => [r.id, r.name, r.slug, String(r.price), String(r.stock ?? ''), r.category].map(c=>`"${String(c).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `products-page-${page}.csv`; document.body.appendChild(a); a.click(); a.remove();
  };

  const columns: Column<ProductItem>[] = [
    { key: "name", label: "Product", sortable: true, render: (item) => <span className="font-medium text-slate-900 dark:text-white">{item.name}</span> },
    { key: "category", label: "Category", render: (item) => <Badge variant="brand" className="text-[9px]">{item.category}</Badge> },
    { key: "price", label: "Price", sortable: true, render: (item) => <span className="font-bold text-brand">{item.price.toLocaleString()} FRW</span> },
    { key: "stock", label: "Stock", render: (item) => item.inStock ? <Badge variant="brand" className="text-[9px]">{item.stock ?? "∞"}</Badge> : <Badge variant="outline" className="text-[9px]">Out</Badge> },
    { key: "rating", label: "Rating", sortable: true, render: (item) => <span className="text-slate-500">{item.rating} ★</span> },
    { key: "id", label: "Actions", className: "text-right", render: (item) => (
      <div className="flex justify-end gap-1">
        <button onClick={() => { setEditItem(item); setDialogOpen(true); }} className="rounded-lg p-1.5 text-slate-400 hover:text-brand hover:bg-brand/10"><Pencil className="size-3.5" /></button>
        <button onClick={() => setDeleteId(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="size-3.5" /></button>
        <button onClick={async () => {
          const fname = prompt('Enter filename for upload token (e.g. product-123.jpg)');
          if (!fname) return;
          const token = await getUploadToken(fname);
          if (token) { await navigator.clipboard.writeText(token); toast.success('Upload token copied to clipboard'); }
          else toast.error('Failed to get upload token');
        }} className="rounded-lg p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50">Get Upload Token</button>
      </div>
    )},
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-brand" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Shop</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage products, inventory, and merchandise.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={exportCsvCurrent}>Export page CSV</Button>
          <Button variant="brand" size="sm" className="rounded-xl gap-1" onClick={() => { setEditItem(null); setDialogOpen(true); }}>
            <Plus className="size-4" /> Add Product
          </Button>
        </div>
      </div>
      <AdminDataTable columns={columns} data={items} searchKeys={["name", "category"]} searchPlaceholder="Search products..." />
      <div className="mt-4 flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={async () => { if (page>1) { setPage(p=>p-1); await fetchItems(page-1); } }}>Previous</Button>
        </div>
        <div className="text-sm text-slate-500">Page {page}</div>
        <div>
          <Button variant="outline" size="sm" onClick={async () => { setPage(p=>p+1); await fetchItems(page+1); }}>Next</Button>
        </div>
      </div>
      <CrudDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditItem(null); }} onSave={handleSave} fields={fields} initial={editItem ?? {}} title={editItem ? "Edit Product" : "Add Product"} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete product?" />
    </div>
  );
}
