"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";
import { Toaster } from "sonner";
import { MotionConfig } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminLayoutClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  children: React.ReactNode;
}

export function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"].includes(pathname);

  if (isLoginPage) {
    return <div className="admin-theme">{children}</div>;
  }

  return (
    <MotionConfig reducedMotion="user"><div className="admin-theme admin-workspace flex min-h-screen">
      <button className="admin-mobile-toggle" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="admin-navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X width={20} height={20} /> : <Menu width={20} height={20} />}</button>
      {mobileOpen && <button className="admin-nav-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <AdminSidebar collapsed={collapsed && !mobileOpen} onToggle={() => setCollapsed(!collapsed)} mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div
        className={cn(
          "admin-main min-w-0 flex-1 flex flex-col transition-all duration-300",
          collapsed ? "ml-[68px]" : "ml-60"
        )}
      >
        <AdminTopBar user={user} />
        <div className="admin-page-content flex-1 min-w-0 p-4 lg:p-8">{children}</div>
      </div>
      <Toaster position="top-right" richColors />
    </div></MotionConfig>
  );
}
