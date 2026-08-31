import { HeroSection } from "@/domains/home/components/HeroSection";
import { ServiceHighlightsSection } from "@/domains/home/components/ServiceHighlights";
import { ServicesPreviewSection } from "@/domains/home/components/ServicesPreview";
import { AdvisorySection } from "@/domains/home/components/AdvisorySection";
import { AboutPreviewSection } from "@/domains/home/components/AboutPreview";
import { WhyChoosePreview } from "@/domains/home/components/WhyChoosePreview";
import { WhoWeServeSection } from "@/domains/home/components/WhoWeServeSection";
import { TechnologySection } from "@/domains/home/components/TechnologySection";
import { MembershipSection } from "@/domains/home/components/MembershipSection";
import { FaqSection } from "@/domains/home/components/FaqSection";
import { CTASection } from "@/domains/home/components/CTASection";
import { siteConfig } from "@/lib/site";
import {
  getFaqs,
  getServiceCategories,
  getIndustries,
  getTechnologyItems,
  getTeam,
  getHomepageContent,
} from "@/lib/content/service.server";

export const dynamic = "force-dynamic";

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

export default async function HomePage() {
  const [faqs, categories, { whoWeServe }, technologyItems, { founder }, homepage] =
    await Promise.all([
      getFaqs(),
      getServiceCategories(),
      getIndustries(),
      getTechnologyItems(),
      getTeam(),
      getHomepageContent(),
    ]);

  const serviceHighlights = homepage.services.items.map((item) => ({
    title: item.title,
    description: item.description,
    icon: item.icon,
  }));

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
      <ServiceHighlightsSection highlights={serviceHighlights} />
      <ServicesPreviewSection categories={categories} />
      <AdvisorySection />
      <AboutPreviewSection founder={founder} />
      <WhyChoosePreview pillars={homepage.whyChoose.items} />
      <WhoWeServeSection audiences={whoWeServe} />
      <TechnologySection items={technologyItems} />
      <MembershipSection />
      <FaqSection faqs={faqs} />
      <CTASection />
    </div>
  );
}
