import { HeroSection } from "@/domains/home/components/HeroSection";
import { ServiceHighlights } from "@/domains/home/components/ServiceHighlights";
import { ServicesPreview } from "@/domains/home/components/ServicesPreview";
import { AdvisorySection } from "@/domains/home/components/AdvisorySection";
import { WhyChoosePreview } from "@/domains/home/components/WhyChoosePreview";
import { MembershipSection } from "@/domains/home/components/MembershipSection";
import { CTASection } from "@/domains/home/components/CTASection";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Home",
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
  },
};

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ServiceHighlights />
      <ServicesPreview />
      <AdvisorySection />
      <WhyChoosePreview />
      <MembershipSection />
      <CTASection />
    </div>
  );
}
