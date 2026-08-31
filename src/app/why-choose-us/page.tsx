import { getHomepageContent } from "@/lib/content/service.server";
import { CTASection } from "@/domains/home/components/CTASection";
import { WhyChooseHero } from "@/domains/why-choose-us/components/WhyChooseHero";
import { WhyChoosePillars } from "@/domains/why-choose-us/components/WhyChoosePillars";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Why Choose Us",
  description:
    "Why clients trust Account Dynamics for their accounting, tax and business advisory needs.",
  openGraph: {
    title: "Why Choose Us | Account Dynamics",
    description: "Why clients trust Account Dynamics.",
    url: "/why-choose-us",
  },
  alternates: {
    canonical: "/why-choose-us",
  },
};

export default async function WhyChooseUsPage() {
  const homepage = await getHomepageContent();
  const pillars = homepage.whyChoose.items;

  return (
    <div className="overflow-x-hidden">
      <WhyChooseHero />
      <WhyChoosePillars pillars={pillars} />
      <CTASection />
    </div>
  );
}
