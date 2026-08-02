import { z } from "zod"

export const MemberCategories = ["individual", "student", "family", "corporate"] as const
export const MemberStatuses = ["active", "inactive", "suspended"] as const
export type MemberCategory = (typeof MemberCategories)[number]
export type MemberStatus = (typeof MemberStatuses)[number]

export interface Member {
  id: string
  name: string
  email: string
  phone?: string
  category?: string
  status?: string
  rating?: number
  gamesPlayed?: number
  wins?: number
  school?: string
  university?: string
  joinedAt: string
  avatar?: string
}

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  category: z.enum(MemberCategories).default("individual"),
  status: z.enum(MemberStatuses).default("active"),
  school: z.string().optional(),
  university: z.string().optional(),
})
