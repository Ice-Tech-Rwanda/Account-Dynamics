import { Suspense } from "react";
import Link from "next/link";
import { galleryService } from "@/domains/gallery/service.server";
import { GalleryHero } from "@/domains/gallery/components/GalleryHero";
import { GalleryMasonry } from "@/domains/gallery/components/GalleryMasonry";
import { GalleryFiltersClient } from "@/domains/gallery/components/GalleryFiltersClient";

export const metadata = {
  title: "Gallery",
  description: "Browse photos and videos from events, tournaments, and community programs.",
};

export default async function GalleryPage(props: { searchParams?: Promise<Record<string, string | string[]>> }) {
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const params = new URLSearchParams(typeof searchParams === 'object' ? Object.fromEntries(Object.entries(searchParams as Record<string,string>).map(([k,v])=>[k, String(v)])) : undefined);
  const activeCategory = (params.get('category') || 'all').toString();

  const result = await galleryService.list({ limit: 500, category: activeCategory === 'all' ? undefined : activeCategory });
  const galleryItems = result.data;

  return (
    <main>
      <GalleryHero />

      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
              Browse Media
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore the Gallery
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Filter by category or click any item to view in fullscreen
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end gap-4 mb-6">
            <Link href="/api/gallery/feed/json" className="text-xs text-slate-500 hover:underline">Gallery JSON Feed</Link>
            <Link href="/api/gallery/feed/rss" className="text-xs text-slate-500 hover:underline">Gallery RSS</Link>
          </div>

          <div className="mb-10">
            <Suspense fallback={<div className="h-12" />}>
              <GalleryFiltersClient active={activeCategory} />
            </Suspense>
          </div>

          <GalleryMasonry items={galleryItems} />
        </div>
      </section>

      {/* Note: Lightbox is client rendered and will mount when a user activates it via client interaction */}
    </main>
  );
}
