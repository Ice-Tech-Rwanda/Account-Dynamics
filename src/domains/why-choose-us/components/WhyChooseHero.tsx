import { PageHero } from "@/components/shared/PageHero";
import { siteImages } from "@/lib/siteImages";
export function WhyChooseHero() { return <PageHero eyebrow="Our Difference" title="Why Travel With Global Line Safaris" description="Discover the personal service and local knowledge behind every journey." image={siteImages.advisory.src} breadcrumb={[{label:"Why Travel With Us",href:"/why-choose-us"}]} />; }
