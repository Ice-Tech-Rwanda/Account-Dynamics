"use client";

import { Check } from "lucide-react";
import type { Service } from "@/lib/data/services";

interface ServiceListProps {
  services: Service[];
}

export function ServiceList({ services }: ServiceListProps) {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {services.map((service) => (
              <div
                key={service.name}
                className="group p-8 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center mt-0.5">
                    <Check className="size-4 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
