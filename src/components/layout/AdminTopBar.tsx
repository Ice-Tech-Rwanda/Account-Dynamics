"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Moon, Sun, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";

const notifications = [
  { id: "n1", title: "New client inquiry", description: "John S. requested a consultation", time: "2 min ago", type: "member" },
  { id: "n2", title: "Invoice paid", description: "$2,500 from Acme Corp", time: "15 min ago", type: "donation" },
  { id: "n3", title: "Tax deadline reminder", description: "Corporate filings due next week", time: "1 hour ago", type: "event" },
  { id: "n4", title: "New membership sign-up", description: `${siteConfig.shortName} Gold Plan`, time: "3 hours ago", type: "order" },
  { id: "n5", title: "Report generated", description: "Q2 financial summary ready", time: "5 hours ago", type: "gallery" },
];

export function AdminTopBar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white/80 backdrop-blur-xl px-4 lg:px-6 dark:bg-slate-950/80 dark:border-slate-800/50">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:placeholder:text-slate-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          title={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
        >
          {mounted ? (isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />) : <span className="size-[18px]" />}
        </button>

        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            title="Notifications"
          >
            <Bell className="size-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-1">
              {notifications.length}
            </span>
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
                  <button className="text-[10px] font-bold uppercase tracking-wider text-brand hover:underline">Mark all read</button>
                </div>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </button>
                  ))}
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
                    { label: "Profile", icon: User, href: "/admin/settings" },
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
