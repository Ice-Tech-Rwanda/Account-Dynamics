import Link from "next/link";
import { Building2, User, Globe, Handshake, ArrowRight } from "lucide-react";
import type { ServiceCategory } from "@/lib/data/services";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  User,
  Globe,
  Handshake,
};

interface ServiceCardProps {
  category: ServiceCategory;
}

export function ServiceCard({ category }: ServiceCardProps) {
  const Icon = iconMap[category.icon] || Building2;

  return (
    <Link
      href={`/services/${category.slug}`}
      className="group block p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 hover:shadow-xl transition-all duration-300"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform">
        <Icon className="size-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
        {category.title}
      </h2>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {category.description}
      </p>
      <ul className="mt-6 space-y-2">
        {category.services.map((service) => (
          <li
            key={service.name}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
          >
            <div className="w-1 h-1 rounded-full bg-brand" />
            {service.name}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">
        View Details <ArrowRight className="size-4" />
      </div>
    </Link>
  );
}
