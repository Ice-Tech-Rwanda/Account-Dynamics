import { z } from "zod"

export const ResourceCategories = ["article", "tutorial", "guide", "download"] as const
export type ResourceCategory = (typeof ResourceCategories)[number]

export interface Resource {
  id: string
  title: string
  slug?: string
  description: string
  category: ResourceCategory
  content?: string
  image?: string
  fileUrl?: string
  author: string
  authorRole?: string
  publishedAt?: string
  readTime?: string
  popular?: boolean
  featured?: boolean
  videoUrl?: string
  downloadCount?: number
  tags?: string[]
}

export const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  fileUrl: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
})
