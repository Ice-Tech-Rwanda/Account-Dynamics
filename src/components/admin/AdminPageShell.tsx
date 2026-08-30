"use client";

import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPageShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  loading?: boolean;
  onRefresh?: () => void;
  children?: React.ReactNode;
}

export function AdminPageShell({
  title,
  subtitle,
  actions,
  onAdd,
  addLabel = "Add New",
  loading,
  onRefresh,
  children,
}: AdminPageShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-1.5"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
          {actions}
          {onAdd && (
            <Button
              variant="brand"
              size="sm"
              className="rounded-xl gap-1.5"
              onClick={onAdd}
            >
              <Plus className="size-3.5" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
}
