"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Moon, Sun, LogOut, User, Settings, CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { adminFetch } from "@/lib/admin-fetch";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

const POLL_INTERVAL_MS = 60_000;

function timeAgo(value: string): string {
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function AdminTopBar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifUpdating, setNotifUpdating] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/notifications");
      if (!res.ok) return;
      const json = await res.json();
      setNotifications(json.data ?? []);
      setUnreadCount(json.unreadCount ?? 0);
    } catch {
      // 401 is handled by adminFetch (redirect); other failures are silent.
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
    const id = window.setInterval(loadNotifications, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [loadNotifications]);

  useEffect(() => {
    // Hydration guard: only render theme-dependent UI after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = async () => {
    setNotifUpdating(true);
    try {
      const res = await adminFetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) await loadNotifications();
    } catch {
      /* handled by adminFetch */
    } finally {
      setNotifUpdating(false);
    }
  };

  const openNotification = async (n: NotificationItem) => {
    if (!n.read) {
      try {
        await adminFetch("/api/admin/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id }),
        });
        await loadNotifications();
      } catch {
        /* handled by adminFetch */
      }
    }
    setShowNotifications(false);
    if (n.link) router.push(n.link);
  };

  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white/80 backdrop-blur-xl px-4 lg:px-6 dark:bg-slate-950/80 dark:border-slate-800/50">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            aria-label="Search"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:placeholder:text-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          title={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
          aria-label="Toggle theme"
        >
          {mounted ? (isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />) : <span className="size-[18px]" />}
        </button>

        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            title="Notifications"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          >
            <Bell className="size-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-xl shadow-black/5 dark:bg-slate-900 dark:border-slate-700/50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                  <button
                    onClick={markAllRead}
                    disabled={notifUpdating || unreadCount === 0}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand hover:underline disabled:opacity-50 disabled:hover:no-underline"
                  >
                    {notifUpdating ? <Loader2 className="size-3 animate-spin" /> : <CheckCheck className="size-3" />}
                    Mark all read
                  </button>
                </div>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                  {notifLoading ? (
                    <div className="px-4 py-8 text-center text-xs text-slate-400">Loading notifications...</div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-slate-400">No notifications yet. New lead submissions will appear here.</div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => openNotification(n)}
                        className={cn(
                          "w-full text-left px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30",
                          !n.read && "bg-blue-50/60 dark:bg-blue-500/5"
                        )}
                      >
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</p>
                        {n.message && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>}
                        <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                      </button>
                    ))
                  )}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 p-1.5">
                  <Link
                    href="/admin/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="block w-full rounded-lg px-3 py-2 text-center text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={userRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-strong text-xs font-black text-white shadow-sm hover:shadow-md transition-shadow"
            title="Account menu"
            aria-label="Account menu"
          >
            {siteConfig.initials}
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-xl shadow-black/5 dark:bg-slate-900 dark:border-slate-700/50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Administrator</p>
                  <p className="text-xs text-slate-500">{siteConfig.email}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  {[
                    { label: "Profile", icon: User, href: "/admin/profile" },
                    { label: "Settings", icon: Settings, href: "/admin/settings" },
                    { label: "Sign Out", icon: LogOut, href: "/admin/login", danger: true },
                  ].map((item) => {
                    const Icon = item.icon;
                    if (item.danger) {
                      return (
                        <button
                          key={item.label}
                          onClick={handleSignOut}
                          disabled={signingOut}
                          className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
                        >
                          <Icon className="size-4" />
                          {signingOut ? "Signing out..." : item.label}
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}