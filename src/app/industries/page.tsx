import { getIndustries } from "@/lib/content/service.server";
import { IndustriesHero } from "@/domains/industries/components/IndustriesHero";
import { IndustryGrid } from "@/domains/industries/components/IndustryGrid";
import { CTASection } from "@/domains/home/components/CTASection";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Industries",
  description:
    "Account Dynamics serves clients across a wide range of industries in Toronto and across Canada.",
  openGraph: {
    title: "Industries | Account Dynamics",
    description: "Industries served by Account Dynamics.",
    url: "/industries",
  },
  alternates: {
    canonical: "/industries",
  },
};

export default async function IndustriesPage() {
  const { industries } = await getIndustries();

  return (
    <div className="overflow-x-hidden">
      <IndustriesHero />
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="it-container px-4 sm:px-6 lg:px-8">
          <IndustryGrid industries={industries} />
        </div>
      </section>
      <CTASection />
    </div>
  );
}
