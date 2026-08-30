"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, ShieldCheck, Users, Building2 } from "lucide-react";
import { TeamAvatar } from "@/domains/team/components/TeamAvatar";
import { Button } from "@/components/ui/button";
import { founder } from "@/lib/data/team";
import { siteImages } from "@/lib/siteImages";

const trustPoints = [
  { icon: Award, text: "Registered Professional Accountant" },
  { icon: ShieldCheck, text: "CICA In-depth Tax Course (Tax Specialist)" },
  { icon: Building2, text: "Founded in 2019, Toronto, Ontario" },
  { icon: Users, text: "Personalized, client-centered service" },
];

export function AboutPreview() {
  const [imgSrc, setImgSrc] = useState<string>(siteImages.about.src);

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={imgSrc}
                alt={siteImages.about.alt}
                width={640}
                height={480}
                className="w-full object-cover aspect-[4/3]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
                onError={() => setImgSrc("/team/placeholder.jpg")}
              />
            </div>
            {/* Trust badge */}
            <div className="absolute -bottom-5 left-5 sm:left-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-card px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                Accounting Expertise
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                You can rely on, in Canada
              </p>
            </div>
          </div>

          {/* Right: content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-4">
              About Account Dynamics
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Accounting Expertise You Can Rely On
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Account Dynamics is a Canadian accounting, tax, advisory and
              business analytics firm in Toronto. We combine professional
              accounting expertise with modern cloud technology and a
              client-centered approach to help individuals and small businesses
              understand their numbers and make confident decisions.
            </p>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              From day-to-day bookkeeping to tax planning and business advisory,
              every engagement is built around your specific goals.
            </p>

            <ul className="mt-8 space-y-3">
              {trustPoints.map((point) => (
                <li key={point.text} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand/5 dark:bg-brand/10 flex items-center justify-center text-brand">
                    <point.icon className="size-4" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1.5">
                    {point.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Founder preview */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                &ldquo;We help individuals and small business owners understand
                their financial information so they can make better decisions
                with confidence.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <TeamAvatar slug="founder" size={44} />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {founder.name}
                  </p>
                  <p className="text-sm text-brand font-medium">{founder.role}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/about">
                <Button variant="brand" className="gap-2 rounded-xl">
                  Meet Our Team <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
