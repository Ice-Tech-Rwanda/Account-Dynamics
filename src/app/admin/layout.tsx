"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";
import { Toaster } from "sonner";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          collapsed ? "ml-[68px]" : "ml-60"
        )}
      >
        <AdminTopBar />
        <div className="flex-1 p-4 lg:p-6 overflow-auto">{children}</div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
