import { z } from "zod"

export const GalleryItemTypes = ["image", "video"] as const
export const GalleryItemCategories = [
  "tournaments", "meetups", "school-programs", "university-events",
] as const

export type GalleryItemType = (typeof GalleryItemTypes)[number]
export type GalleryItemCategory = (typeof GalleryItemCategories)[number]

export interface GalleryItem {
  id: string
  src: string
  thumb?: string
  title: string
  description?: string
  category: string
  type: string
  videoUrl?: string
  date: string
  width?: number
  height?: number
}

export interface GalleryAlbum {
  id: string
  title: string
  description: string
  coverImage: string
  images: string[]
  date: string
  type: string
  category?: string
  videoUrl?: string
}

export const galleryItemSchema = z.object({
  src: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(GalleryItemTypes).default("image"),
  videoUrl: z.string().optional(),
  date: z.string().optional(),
  order: z.coerce.number().optional(),
})
