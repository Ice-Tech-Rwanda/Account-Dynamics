"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { toast } from "sonner";
import type { Column } from "@/components/admin/AdminDataTable";

interface Order {
  id: string; customerName: string; customerEmail: string; total: number;
  status: string; items: number; createdAt: string;
}

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const res = await fetch("/api/orders");
    const { data } = await res.json(); setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true; const doFetch = async () => {
      const res = await fetch("/api/orders");
      const { data } = await res.json();
      if (mounted) { setItems(data); setLoading(false); }
    }; doFetch();
    return () => { mounted = false };
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    toast.success("Order status updated");
    fetchItems();
  };

  const columns: Column<Order>[] = [
    { key: "id", label: "Order", render: (item) => <span className="font-medium text-slate-900 dark:text-white">#{item.id}</span> },
    { key: "customerName", label: "Customer", sortable: true, render: (item) => <span className="text-slate-900 dark:text-white">{item.customerName}</span> },
    { key: "total", label: "Total", sortable: true, render: (item) => <span className="font-bold text-brand">{item.total.toLocaleString()} FRW</span> },
    { key: "items", label: "Items", render: (item) => <span>{item.items}</span> },
    { key: "status", label: "Status", render: (item) => (
      <select
        value={item.status}
        onChange={(e) => handleStatusChange(item.id, e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium dark:bg-slate-800 dark:border-slate-700"
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    )},
    { key: "createdAt", label: "Date", sortable: true, render: (item) => <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span> },
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-brand" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage shop orders and fulfillment.</p>
        </div>
      </div>
      <AdminDataTable columns={columns} data={items} searchKeys={["customerName", "customerEmail", "id"]} searchPlaceholder="Search orders..." />
    </div>
  );
}
