import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DestinationCard } from "@/components/shared/DestinationCard";
import type { Destination, HomepageSectionData } from "@/lib/content/types";

export function DestinationsSection({
  destinations,
  section,
}: {
  destinations: Destination[];
  section: HomepageSectionData;
}) {
  const featured = destinations.filter((d) => d.featured);
  const items = (featured.length >= 3 ? featured : destinations).slice(0, 5);
  if (!items.length) return null;

  return (
    <section className="safari-section destinations-section">
      <div className="safari-container">
        <div className="editorial-heading">
          <div>
            <div className="safari-eyebrow">
              <span className="safari-eyebrow-line" />
              <span>{section.eyebrow || "Places that stay with you"}</span>
            </div>
            <h2>{section.title || "Where Your Journey Can Take You"}</h2>
          </div>
          <div>
            {section.subtitle && <p>{section.subtitle}</p>}
            <Link
              className="safari-text-link"
              href={section.ctaUrl || "/destinations"}
            >
              {section.ctaLabel || "All Destinations"}
              <ArrowUpRight width={14} height={14} />
            </Link>
          </div>
        </div>
        <div className="destination-editorial-grid">
          {items.map((destination, index) => (
            <DestinationCard
              key={destination.slug}
              destination={destination}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
