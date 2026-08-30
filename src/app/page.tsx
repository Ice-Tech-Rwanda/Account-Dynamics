import { HeroSection } from "@/domains/home/components/HeroSection";
import { ServiceHighlights } from "@/domains/home/components/ServiceHighlights";
import { ServicesPreview } from "@/domains/home/components/ServicesPreview";
import { AdvisorySection } from "@/domains/home/components/AdvisorySection";
import { AboutPreview } from "@/domains/home/components/AboutPreview";
import { WhyChoosePreview } from "@/domains/home/components/WhyChoosePreview";
import { WhoWeServeSection } from "@/domains/home/components/WhoWeServeSection";
import { TechnologySection } from "@/domains/home/components/TechnologySection";
import { MembershipSection } from "@/domains/home/components/MembershipSection";
import { FaqSection } from "@/domains/home/components/FaqSection";
import { CTASection } from "@/domains/home/components/CTASection";
import { siteConfig } from "@/lib/site";
import { faqs } from "@/lib/data/faq";

export const metadata = {
  title: `${siteConfig.name} | Tax, Accounting & Business Advisory`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | Tax, Accounting & Business Advisory`,
    description: siteConfig.description,
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />
      <ServiceHighlights />
      <ServicesPreview />
      <AdvisorySection />
      <AboutPreview />
      <WhyChoosePreview />
      <WhoWeServeSection />
      <TechnologySection />
      <MembershipSection />
      <FaqSection />
      <CTASection />
    </div>
  );
}
