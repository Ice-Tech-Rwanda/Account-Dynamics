import { PageHero } from "@/components/shared/PageHero";
import { siteImages } from "@/lib/siteImages";
export function IndustriesHero() { return <PageHero eyebrow="Made for you" title="A Journey for Every Explorer" description="From wildlife lovers and cultural explorers to families and educational groups, discover experiences shaped around your interests." image={siteImages.contact.src} breadcrumb={[{label:"Who We Serve",href:"/industries"}]} />; }
