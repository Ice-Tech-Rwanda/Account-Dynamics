import Link from "next/link";
import { Building2, User, Globe, Handshake, ArrowRight } from "lucide-react";
import type { ServiceCategory } from "@/lib/content/types";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  User,
  Globe,
  Handshake,
};

interface ServicesPreviewProps {
  categories: ServiceCategory[];
}

export function ServicesPreviewSection({ categories }: ServicesPreviewProps) {
  return (
    <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Comprehensive Accounting Solutions
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            From day-to-day bookkeeping to strategic tax planning, we provide the
            full spectrum of accounting services your business needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Building2;
            return (
              <Link
                key={category.slug}
                href={`/services/${category.slug}`}
                className="group block p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 dark:hover:border-brand/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="size-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
