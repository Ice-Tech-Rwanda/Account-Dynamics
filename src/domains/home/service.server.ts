import { eventsService } from "@/domains/events/service.server"
import { galleryService } from "@/domains/gallery/service.server"
import { partnersService } from "@/domains/partners/service.server"
import { shopService } from "@/domains/shop/service.server"
import { rankingsService } from "@/domains/rankings/service.server"
import type { HomePageData } from "./domain"

export const homeService = {
  async getHomePageData(): Promise<HomePageData> {
    const [eventsResult, galleryResult, partnersResult, productsResult, rankingsResult] =
      await Promise.all([
        eventsService.list({ status: "upcoming", limit: 3 }),
        galleryService.list({ limit: 6 }),
        partnersService.list({ limit: 50 }),
        shopService.list({ limit: 50 }),
        rankingsService.list({ limit: 8 }),
      ])

    return {
      upcomingEvents: (eventsResult.events ?? []) as HomePageData["upcomingEvents"],
      galleryItems: (galleryResult.data ?? []).slice(0, 6) as HomePageData["galleryItems"],
      partners: (partnersResult.data ?? []) as HomePageData["partners"],
      featuredProducts: ((productsResult.data ?? []) as HomePageData["featuredProducts"]).filter((p) => p.featured).slice(0, 6),
      topRankings: (rankingsResult.data ?? []) as HomePageData["topRankings"],
    }
  },
}
