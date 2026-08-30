import { ServicesHero } from "@/domains/services/components/ServicesHero";
import { ServiceCard } from "@/domains/services/components/ServiceCard";
import { CTASection } from "@/domains/home/components/CTASection";
import { getServiceCategories } from "@/lib/content/service.server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services",
  description:
    "Explore the full range of accounting, tax, advisory and business analytics services offered by Account Dynamics in Toronto, Canada.",
  openGraph: {
    title: "Services | Account Dynamics",
    description:
      "Explore the full range of accounting, tax, advisory and business analytics services offered by Account Dynamics.",
    url: "/services",
  },
  alternates: {
    canonical: "/services",
  },
};

export default async function ServicesPage() {
  const categories = await getServiceCategories();

  return (
    <div className="overflow-x-hidden">
      <ServicesHero />
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="it-container px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-8">
            {categories.map((category) => (
              <ServiceCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  );
}
