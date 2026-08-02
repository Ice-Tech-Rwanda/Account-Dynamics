import { Handshake, Shield, TrendingUp, Globe, Heart, Target, Users, Lightbulb } from "lucide-react";
import { partnersService } from "@/domains/partners/service.server";
import { PartnershipsHero } from "@/domains/partners/components/PartnershipsHero";
import { LogoWall } from "@/domains/partners/components/LogoWall";
import { PartnerSpotlightCards } from "@/domains/partners/components/PartnerSpotlightCards";
import { PartnershipPackages } from "@/domains/partners/components/PartnershipPackages";
import { PartnershipForm } from "@/domains/partners/components/PartnershipForm";
import { siteConfig } from "@/lib/site";

const benefits = [
  { icon: TrendingUp, label: "Brand Visibility", text: `Your brand featured across all ${siteConfig.name} events, digital platforms, and marketing materials reaching thousands of Scrabble enthusiasts.` },
  { icon: Users, label: "Community Impact", text: "Directly support youth development, education, and community building through the power of Scrabble." },
  { icon: Globe, label: "National Reach", text: "Connect with players, schools, and universities across all provinces of Rwanda." },
  { icon: Shield, label: "CSR Alignment", text: "Demonstrate corporate social responsibility through sports and education initiatives." },
  { icon: Target, label: "Targeted Marketing", text: "Reach a focused demographic of educated, engaged, and community-minded individuals." },
  { icon: Heart, label: "Player Development", text: "Fund scholarships, coaching programs, and pathways for talented young players." },
  { icon: Lightbulb, label: "Innovation Hub", text: "Be part of Rwanda's first dedicated Scrabble innovation and training center." },
  { icon: Handshake, label: "Long-term Partnership", text: "Build a lasting relationship with opportunities for renewal and growth." },
];

const partnerTypes = [
  { icon: Target, label: "Title Sponsors", desc: "Flagship partners who power our major tournaments and events with premier brand visibility.", count: "3 spots" },
  { icon: Handshake, label: "Strategic Partners", desc: "Organizations that collaborate on programs, venues, and shared initiatives.", count: "3 active" },
  { icon: Globe, label: "Media Partners", desc: "News and media organizations that help us share Scrabble stories across Rwanda.", count: "2 active" },
];

export default async function PartnershipsPage() {
  const [partnersResult, packagesResult] = await Promise.all([
    partnersService.list(),
    partnersService.getSponsorshipPackages(),
  ]);

  const partners = partnersResult.data;
  const packages = packagesResult.data;

  return (
    <div className="overflow-x-hidden">
      <PartnershipsHero />

      <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Categories</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Partner Categories
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              We offer multiple partnership tiers to suit your organization&apos;s goals.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {partnerTypes.map((pt) => {
              const Icon = pt.icon;
              return (
                <div
                  key={pt.label}
                  className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 mb-4">
                    <Icon className="size-5 text-brand" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{pt.label}</h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{pt.desc}</p>
                  <span className="mt-3 inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-300">
                    {pt.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Our Partners</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Trusted by Leading Organizations
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              We&apos;re proud to collaborate with these amazing organizations.
            </p>
          </div>

          <LogoWall partners={partners} />
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Spotlight</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Featured Partners
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              A closer look at our key partnerships and their impact.
            </p>
          </div>

          <PartnerSpotlightCards partners={partners} />
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Benefits</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Why Partner with {siteConfig.name}?
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Join us in building Rwanda&apos;s Scrabble community and make a lasting impact.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.label}
                  className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand mb-3">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{benefit.label}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Packages</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Sponsorship Packages
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Choose the partnership level that fits your organization.
            </p>
          </div>

          <PartnershipPackages packages={packages} />
        </div>
      </section>

      <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Collaborate</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
                Become a Partner
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Interested in partnering with {siteConfig.name}? Fill out the form and our partnerships team will reach out within 2-3 business days.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Handshake, label: "Flexible Partnership Types", text: "Sponsorship, strategic, media, or in-kind" },
                  { icon: Target, label: "Custom Packages Available", text: "We'll tailor a package to your goals" },
                  { icon: Heart, label: "Tax Benefits", text: "Contributions may be tax-deductible" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand flex-shrink-0">
                        <Icon className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
                <PartnershipForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
