"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, CheckCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-fetch";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const res = await adminFetch("/api/admin/notifications");
      if (!res.ok) {
        setError("Failed to load notifications.");
        return;
      }
      const d = await res.json();
      setNotifications(d.data ?? []);
      setUnreadCount(d.unreadCount ?? 0);
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, []);

  const reloadNotifications = () => {
    setError(null);
    setLoading(true);
    fetchNotifications();
  };

  const markAllRead = async () => {
    await adminFetch("/api/admin/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markAllRead: true }) });
    toast.success("All notifications marked as read");
    fetchNotifications();
  };

  const handleClick = async (n: Notification) => {
    if (!n.read) {
      await adminFetch("/api/admin/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id }) });
      fetchNotifications();
    }
    if (n.link) {
      router.push(n.link);
    }
  };

  return (
    <AdminPageShell title="Notifications" subtitle={`${unreadCount} unread`} loading={loading}
      actions={<Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={markAllRead}><CheckCheck className="size-3.5" /> Mark all read</Button>}>
      {error ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30 px-6 py-10 text-center">
          <AlertTriangle className="size-7 text-red-400" />
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 mt-1" onClick={reloadNotifications}>
            <RefreshCw className="size-3.5" /> Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer hover:shadow-sm ${n.read ? "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60" : "bg-blue-50/70 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/20"}`}
              onClick={() => handleClick(n)}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-slate-100 dark:bg-slate-800" : "bg-brand/10 text-brand"}`}>
                <Bell className={`size-4 ${n.read ? "text-slate-400" : "text-brand"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm ${n.read ? "text-slate-600 dark:text-slate-400" : "font-semibold text-slate-900 dark:text-white"}`}>{n.title}</p>
                {n.message && <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>}
                <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-brand shrink-0 mt-2" />}
            </div>
          ))}
          {notifications.length === 0 && !loading && (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 dark:border-slate-800">
              <Bell className="size-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm">No notifications yet. New lead submissions will appear here.</p>
            </div>
          )}
        </div>
      )}
    </AdminPageShell>
  );
}