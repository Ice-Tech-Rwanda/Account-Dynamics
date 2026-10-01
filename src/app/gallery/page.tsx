import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/domains/home/components/CTASection";
import { GalleryGrid } from "@/domains/gallery/components/GalleryGrid";
import { buildPageMetadata, getGalleryImages } from "@/lib/content/service.server";
import { siteImages } from "@/lib/siteImages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('gallery', {
    title: 'Gallery',
    description: 'A visual journey through Rwanda and East Africa with Global Line Safaris — wildlife, landscapes, people and unforgettable moments.',
    path: '/gallery',
  });
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="overflow-x-hidden">
      <PageHero
        eyebrow="Moments"
        title="Gallery"
        description="A visual journey through Rwanda and East Africa — wildlife, landscapes, people and the moments that make a trip unforgettable."
        image={siteImages.contact.src}
        breadcrumb={[{ label: "Gallery", href: "/gallery" }]}
      />

      <section className="bg-white py-20 dark:bg-slate-950 sm:py-28">
        <div className="it-container px-4 sm:px-6 lg:px-8">
          <GalleryGrid images={images} />
        </div>
      </section>

      <CTASection />
    </div>
  );
}
