import { homeService } from "@/domains/home/service.server"
import { HeroSection } from "@/domains/home/components/HeroSection";
import { AnimatedStats } from "@/domains/home/components/AnimatedStats";
import { FeaturedEvents } from "@/domains/home/components/FeaturedEvents";
import { TopRankings } from "@/domains/home/components/TopRankings";
import { ShopPreview } from "@/domains/home/components/ShopPreview";
import { PartnerSlider } from "@/domains/home/components/PartnerSlider";
import { GalleryMasonry } from "@/domains/home/components/GalleryMasonry";
import { TestimonialSlider } from "@/domains/home/components/TestimonialSlider";
import { NewsletterSection } from "@/domains/home/components/NewsletterSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Star, Sparkles } from "lucide-react";

export default async function HomePage() {
  const { upcomingEvents, galleryItems, partners, featuredProducts: products, topRankings: rankings } = await homeService.getHomePageData();

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <AnimatedStats />
      <FeaturedEvents events={upcomingEvents} />
      <TopRankings rankings={rankings} />
      <ShopPreview products={products} />
      <PartnerSlider partners={partners} />
      <GalleryMasonry items={galleryItems} />
      <TestimonialSlider />
      <NewsletterSection />

      {/* Final CTA */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,168,67,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(13,122,62,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent border border-accent/20 mb-6">
            <Sparkles className="size-3" /> Get Involved
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.06] tracking-[-0.04em] text-white">
            Ready to Get Involved?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re a beginner or an experienced enthusiast, everyone is welcome.
            Join our community and be part of the story.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/join">
              <Button
                variant="accent"
                size="xl"
                className="gap-2.5 rounded-xl shadow-xl shadow-accent/25 hover:shadow-accent/35 transition-all duration-300 text-base"
              >
                <Users className="size-4" /> Join Today
              </Button>
            </Link>
            <Link href="/support">
              <Button
                size="xl"
                className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 gap-2.5 text-base shadow-lg"
              >
                <Star className="size-4" /> Support Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
