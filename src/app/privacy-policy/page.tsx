import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { CTASection } from "@/domains/home/components/CTASection";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${siteConfig.name}, ${siteConfig.location}.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative py-24 sm:py-28 bg-gradient-to-br from-slate-950 via-brand-bg-dark to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(14,124,123,0.08),transparent_50%)]" />
        <div className="relative z-10 it-container px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6">
            Legal
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white">
            Privacy Policy
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
                1. Introduction
              </h2>
              <p className="mt-3">
                [Company name] (&ldquo;we&rdquo;, &ldquo;our&rdquo;,
                &ldquo;us&rdquo;) respects your privacy. This Privacy Policy
                explains how we collect, use, disclose and protect personal
                information in connection with our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                2. Information We Collect
              </h2>
              <p className="mt-3">
                [Describe the personal information collected, such as name,
                email address, phone number, company and details provided
                through our contact form.]
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                3. How We Use Your Information
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>[Responding to inquiries and providing services]</li>
                <li>[Sending relevant updates, where consent has been given]</li>
                <li>[Improving our website and services]</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                4. Sharing of Information
              </h2>
              <p className="mt-3">
                [Describe any third parties with whom information may be
                shared and the safeguards used.]
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                5. Data Security &amp; Retention
              </h2>
              <p className="mt-3">
                [Describe security measures and retention periods for personal
                information.]
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                6. Your Rights
              </h2>
              <p className="mt-3">
                [Describe rights to access, correct or request deletion of
                personal information and how to exercise them.]
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                7. Contact Us
              </h2>
              <p className="mt-3">
                If you have any questions about this Privacy Policy, contact us
                at {siteConfig.email} or by phone at {siteConfig.phone}.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                8. Changes to This Policy
              </h2>
              <p className="mt-3">
                [Describe how and when updates to this policy will be
                communicated.]
              </p>
            </section>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
