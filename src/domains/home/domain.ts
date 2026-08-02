import type { Event } from "@/domains/events/domain"
import type { GalleryItem } from "@/domains/gallery/domain"
import type { Partner } from "@/domains/partners/domain"
import type { Product } from "@/domains/shop/domain"
import type { Ranking } from "@/domains/rankings/domain"

export interface HomePageData {
  upcomingEvents: Event[]
  galleryItems: GalleryItem[]
  partners: Partner[]
  featuredProducts: Product[]
  topRankings: Ranking[]
}
