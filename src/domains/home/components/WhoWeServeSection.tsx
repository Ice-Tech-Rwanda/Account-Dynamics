"use client";

import { User, Store, Rocket, Building2, Briefcase, LayoutGrid } from "lucide-react";
import { whoWeServe } from "@/lib/data/who-we-serve";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  User,
  Store,
  Rocket,
  Building2,
  Briefcase,
  LayoutGrid,
};

export function WhoWeServeSection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent mb-4">
            Who We Serve
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Accounting Support Built Around Your Needs
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            We tailor our accounting, tax and advisory services to the clients
            we serve — from individuals to groups of companies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whoWeServe.map((audience) => {
            const Icon = iconMap[audience.icon] || Building2;
            return (
              <div
                key={audience.name}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {audience.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {audience.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {audience.services.slice(0, 3).map((service) => (
                    <span
                      key={service}
                      className="inline-block px-2 py-0.5 text-[11px] font-medium bg-brand/5 dark:bg-brand/10 text-brand rounded-md"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/industries"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-2 transition-all"
          >
            Explore Who We Serve <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
