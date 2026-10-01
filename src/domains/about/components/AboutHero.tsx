import { PageHero } from "@/components/shared/PageHero";
import { getHomepageContent, getSiteImages } from "@/lib/content/service.server";
import { siteImages } from "@/lib/siteImages";
export async function AboutHero() {
 const [content, images] = await Promise.all([getHomepageContent(),getSiteImages()]);
 return <PageHero eyebrow="Our Story" title={content.about.title || "Discover Rwanda. Travel With Purpose."} description={content.about.subtitle || undefined} image={images.about.url || siteImages.about.src} breadcrumb={[{label:"About Us",href:"/about"}]} />;
}
