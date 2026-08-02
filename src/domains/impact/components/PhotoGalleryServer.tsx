import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function PhotoGalleryServer({ images }: { images: { src: string; album?: string; }[] }) {
  if (!images || images.length === 0) return null;

  return (
    <section id="impact-gallery" className="py-20 sm:py-28 bg-brand-bg dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">Gallery</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Moments That Matter</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">A glimpse into the events, people, and programs that define {siteConfig.name}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <a key={img.src + i} href={img.src} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden">
              <div style={{ aspectRatio: i % 3 === 0 ? '4/5' : i % 3 === 1 ? '1/1' : '3/4' }} className="relative w-full">
                <Image src={img.src} alt={img.album || 'Gallery image'} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
