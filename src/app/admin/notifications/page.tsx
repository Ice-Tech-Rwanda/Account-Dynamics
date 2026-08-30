"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, CheckCheck } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    fetch("/api/admin/notifications")
      .then(r => r.ok ? r.json() : { data: [], unreadCount: 0 })
      .then(d => { setNotifications(d.data ?? []); setUnreadCount(d.unreadCount ?? 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await fetch("/api/admin/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markAllRead: true }) });
    toast.success("All notifications marked as read");
    fetchNotifications();
  };

  const markRead = async (id: string) => {
    await fetch("/api/admin/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchNotifications();
  };

  return (
    <AdminPageShell title="Notifications" subtitle={`${unreadCount} unread`} loading={loading}
      actions={<Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={markAllRead}><CheckCheck className="size-3.5" /> Mark all read</Button>}>
      <div className="space-y-1">
        {notifications.map(n => (
          <div key={n.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-colors ${n.read ? "bg-white dark:bg-slate-900" : "bg-blue-50/50 dark:bg-blue-500/5"}`}
            onClick={() => !n.read && markRead(n.id)}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-slate-100 dark:bg-slate-800" : "bg-brand/10"}`}>
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
        {notifications.length === 0 && <p className="text-center text-sm text-slate-400 py-12">No notifications</p>}
      </div>
    </AdminPageShell>
  );
}
