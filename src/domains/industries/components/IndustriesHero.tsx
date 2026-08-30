"use client";

import { Building2 } from "lucide-react";

export function IndustriesHero() {
  return (
    <section className="relative bg-gradient-to-br from-brand-bg-dark via-brand-bg-dark-mid to-brand py-24 sm:py-32">
      <div className="it-container px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl mb-6">
          <Building2 className="size-8 text-accent" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Industries We Serve
        </h1>
        <p className="mt-4 text-lg text-slate-200/80 max-w-2xl mx-auto leading-relaxed">
          We tailor our accounting, tax and advisory services to the unique needs of businesses across a wide range of industries.
        </p>
      </div>
    </section>
  );
}
