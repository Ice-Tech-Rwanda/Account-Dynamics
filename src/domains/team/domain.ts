import { z } from "zod"

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    email?: string
  }
}

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().min(1, "Bio is required"),
  avatar: z.string().optional(),
  socialLinks: z.string().optional(),
  order: z.coerce.number().optional(),
})
