import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HomepageSectionData, TourPackage } from "@/lib/content/types";
import { PackageCard } from "@/domains/packages/components/PackageCard";

export function PackagesSection({
  packages,
  section,
}: {
  packages: TourPackage[];
  section: HomepageSectionData;
}) {
  const featured = packages.filter((pkg) => pkg.featured);
  const items = (featured.length ? featured : packages).slice(0, 3);
  if (!items.length) return null;

  return (
    <section className="safari-section">
      <div className="safari-container">
        <div className="editorial-heading">
          <div>
            <div className="safari-eyebrow">
              <span className="safari-eyebrow-line" />
              <span>{section.eyebrow || "Find your journey"}</span>
            </div>
            <h2>{section.title || "Featured Safaris & Tour Packages"}</h2>
          </div>
          <div>
            <p>{section.subtitle}</p>
            <Link
              className="safari-text-link"
              href={section.ctaUrl || "/tour-packages"}
            >
              {section.ctaLabel || "All Tour Packages"}
              <ArrowUpRight width={14} height={14} />
            </Link>
          </div>
        </div>
        <div className="discovery-grid">
          {items.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
