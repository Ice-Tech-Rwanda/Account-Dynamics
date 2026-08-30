import { notFound } from "next/navigation";
import { serviceCategories } from "@/lib/data/services";
import { ServiceDetailHero } from "@/domains/services/components/ServiceDetailHero";
import { ServiceList } from "@/domains/services/components/ServiceList";
import { CTASection } from "@/domains/home/components/CTASection";
import { siteConfig } from "@/lib/site";

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
    title: `${category.title} | Account Dynamics`,
    description: category.description.slice(0, 160),
    openGraph: {
      title: `${category.title} | Account Dynamics`,
      description: category.description.slice(0, 160),
      url: `/services/${category.slug}`,
    },
    alternates: {
      canonical: `/services/${category.slug}`,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const category = serviceCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${category.title} — ${siteConfig.name}`,
    description: category.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      telephone: siteConfig.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "55 Baywood Road, 2nd Floor",
        addressLocality: "Toronto",
        addressRegion: "Ontario",
        postalCode: "M9V 3Y8",
        addressCountry: "CA",
      },
    },
    areaServed: "Canada",
    url: `${siteConfig.siteUrl.replace(/\/$/, "")}/${category.slug}`,
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.services.map((s) => s.name).join(", "),
    itemListElement: category.services.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: service.name,
    })),
  };

  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <ServiceDetailHero category={category} />
      <ServiceList category={category} />
      <CTASection />
    </div>
  );
}
