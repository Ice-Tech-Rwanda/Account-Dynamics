import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { serviceCategories } from "@/lib/data/services";
import { ServiceDetailHero } from "@/domains/services/components/ServiceDetailHero";
import { ServiceList } from "@/domains/services/components/ServiceList";
import { CTASection } from "@/domains/home/components/CTASection";

interface ServicePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return serviceCategories.map((cat) => ({ slug: cat.slug }));
}

export function generateMetadata({ params }: ServicePageProps) {
  const category = serviceCategories.find((c) => c.slug === params.slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description.slice(0, 160),
    openGraph: {
      title: `${category.title} | Account Dynamics`,
      description: category.description.slice(0, 160),
      url: `/services/${category.slug}`,
    },
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const category = serviceCategories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  return (
    <div className="overflow-x-hidden">
      <ServiceDetailHero category={category} />
      <ServiceList services={category.services} />
      <CTASection />
    </div>
  );
}
