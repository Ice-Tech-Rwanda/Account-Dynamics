import { PageHero } from "@/components/shared/PageHero";
import { getHomepageContent, getSiteImages } from "@/lib/content/service.server";
import { siteImages } from "@/lib/siteImages";
export async function ServicesHero() {
 const [content, images] = await Promise.all([getHomepageContent(),getSiteImages()]);
 return <PageHero eyebrow="Your kind of adventure" title={content.services.title || "Safari, Tour & Travel Services"} description={content.services.subtitle || undefined} image={images.servicesHero.url || siteImages.servicesHero.src} breadcrumb={[{label:"Services",href:"/services"}]} />;
}
