import { notFound } from "next/navigation";
import { serviceCategories } from "@/lib/data/services";
import { ServiceDetailHero } from "@/domains/services/components/ServiceDetailHero";
import { ServiceList } from "@/domains/services/components/ServiceList";
import { CTASection } from "@/domains/home/components/CTASection";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return serviceCategories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const category = serviceCategories.find((c) => c.slug === slug);
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

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const category = serviceCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div className="overflow-x-hidden">
      <ServiceDetailHero category={category} />
      <ServiceList services={category.services} />
      <CTASection />
    </div>
  );
}
