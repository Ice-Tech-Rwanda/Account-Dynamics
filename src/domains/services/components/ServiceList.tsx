"use client";

import Link from "next/link";
import { Check, ArrowRight, BookOpen, ShieldCheck, FileText, Clock, Wallet, Building2, CheckCircle, Lightbulb, Shield, TrendingUp, Briefcase, LayoutGrid, Clipboard, Rocket, Calculator, User, Globe, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceCategory } from "@/lib/data/services";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  ShieldCheck,
  FileText,
  Clock,
  Wallet,
  Building2,
  CheckCircle,
  Lightbulb,
  Shield,
  TrendingUp,
  Briefcase,
  LayoutGrid,
  Clipboard,
  Rocket,
  Calculator,
  User,
  Globe,
  Handshake,
};

interface ServiceListProps {
  category: ServiceCategory;
}

export function ServiceList({ category }: ServiceListProps) {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {category.services.map((service) => {
            const Icon = iconMap[service.icon] || Building2;
            return (
              <div
                key={service.name}
                className="group p-8 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand/5 dark:bg-brand/10 text-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="size-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight pt-1">
                    {service.name}
                  </h2>
                </div>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
                {service.benefits.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center mt-0.5">
                          <Check className="size-3 text-brand" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Contextual CTA */}
        <div className="mt-14 text-center">
          <Link href="/contact">
            <Button variant="accent" size="xl" className="gap-2.5 rounded-xl shadow-xl shadow-accent/20">
              {category.cta} <ArrowRight className="size-4" />
            </Button>
          </Link>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Speak with an Account Dynamics professional about your {category.title.toLowerCase()} needs.
          </p>
        </div>
      </div>
    </section>
  );
}
