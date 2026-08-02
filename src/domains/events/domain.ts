import { z } from "zod"

export const EventStatuses = ["upcoming", "ongoing", "completed"] as const
export const EventCategories = [
  "weekly", "tournament", "university", "school", "workshop",
] as const

export type EventStatus = (typeof EventStatuses)[number]
export type EventCategorySlug = (typeof EventCategories)[number]

export interface EventSpeaker {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
}

export interface ScheduleItem {
  id: string
  time: string
  title: string
  description: string
  speaker?: string
}

export interface EventCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
  count: number
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  category: string
  startDate: string
  endDate?: string
  location: string
  image?: string
  registrationUrl?: string
  status: EventStatus
  maxParticipants?: number
  currentParticipants?: number
  featured?: boolean
  speakers?: EventSpeaker[]
  schedule?: ScheduleItem[]
  gallery?: string[]
  prizes?: string[]
  price?: number
}

export interface EventListParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  status?: string
}

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  image: z.string().optional(),
  registrationUrl: z.string().optional(),
  status: z.enum(EventStatuses).default("upcoming"),
  maxParticipants: z.coerce.number().optional(),
  currentParticipants: z.coerce.number().optional(),
  featured: z.boolean().optional(),
})
