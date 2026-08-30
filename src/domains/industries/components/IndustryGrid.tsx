"use client";

import { Building2, User, Globe, Briefcase, Calculator, FileText } from "lucide-react";
import type { Industry } from "@/lib/content/types";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  User,
  Globe,
  Briefcase,
  Calculator,
  FileText,
};

interface IndustryGridProps {
  industries: Industry[];
}

export function IndustryGrid({ industries }: IndustryGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {industries.map((industry) => {
        const Icon = iconMap[industry.icon] || Building2;
        return (
          <div
            key={industry.slug || industry.name}
            className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform">
              <Icon className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {industry.name}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4">
              {industry.description}
            </p>
          </div>
        );
      })}
      {industries.length === 0 && (
        <div className="col-span-full text-center py-12 text-slate-400">
          <Building2 className="size-12 mx-auto mb-3 text-slate-200" />
          <p className="text-sm">Industries will appear here once added via the admin panel.</p>
        </div>
      )}
    </div>
  );
}
