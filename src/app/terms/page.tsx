import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { CTASection } from "@/domains/home/components/CTASection";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of Use for ${siteConfig.name}, ${siteConfig.location}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative py-24 sm:py-28 bg-gradient-to-br from-slate-950 via-brand-bg-dark to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(14,124,123,0.08),transparent_50%)]" />
        <div className="relative z-10 it-container px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6">
            Legal
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white">
            Terms of Use
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />
      </section>

      <section className="py-16 sm:py-20 bg-white dark:bg-slate-950">
        <div className="it-container px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 px-5 py-4 text-sm text-amber-800 dark:text-amber-200">
            <strong>Review required.</strong> This draft must be reviewed and
            finalized by your legal counsel before publication. The following is
            a structured placeholder, not legal advice.
          </div>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing or using the {siteConfig.name} website, you agree
                to be bound by these Terms of Use. If you do not agree, please
                do not use the site.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                2. Use of the Website
              </h2>
              <p className="mt-3">
                [Describe acceptable use, prohibited activities and permitted
                use of site content.]
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                3. Intellectual Property
              </h2>
              <p className="mt-3">
                [Confirm ownership of website content, logos and materials and
                describe permitted use.]
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                4. No Professional Advice
              </h2>
              <p className="mt-3">
                Information on this website is provided for general information
                purposes only and does not constitute accounting, tax, legal or
                financial advice. You should consult a qualified professional
                regarding your specific circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                5. Limitation of Liability
              </h2>
              <p className="mt-3">
                [Describe the limits of liability in connection with use of the
                website and services.]
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                6. Governing Law
              </h2>
              <p className="mt-3">
                These Terms of Use are governed by the laws of the Province of
                Ontario and the laws of Canada applicable therein.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                7. Contact
              </h2>
              <p className="mt-3">
                For questions about these Terms of Use, contact us at
                {siteConfig.email} or by phone at {siteConfig.phone}.
              </p>
            </section>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
