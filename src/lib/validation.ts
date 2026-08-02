import { z } from "zod"

export const emailSchema = z.string().email("Invalid email address").max(255)

export const slugSchema = z.string().max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format").optional()

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type Pagination = z.infer<typeof paginationSchema>

export function parsePagination(params: URLSearchParams): Pagination {
  const page = parseInt(params.get("page") || "1", 10)
  const limit = parseInt(params.get("limit") || "20", 10)
  return {
    page: isNaN(page) || page < 1 ? 1 : Math.min(page, 10000),
    limit: isNaN(limit) || limit < 1 ? 20 : Math.min(limit, 100),
  }
}

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: emailSchema,
  phone: z.string().max(50).nullable().optional(),
  category: z.string().max(50).default("individual"),
  status: z.string().max(50).default("active"),
  rating: z.number().int().default(0),
  gamesPlayed: z.number().int().default(0),
  wins: z.number().int().default(0),
  school: z.string().max(200).nullable().optional(),
  university: z.string().max(200).nullable().optional(),
})

export const memberUpdateSchema = memberSchema.partial()

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().max(200).optional(),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().max(500).nullable().optional(),
  category: z.string().min(1, "Category is required").max(100),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).nullable().optional(),
  location: z.string().min(1, "Location is required").max(300),
  image: z.string().max(500).nullable().optional(),
  registrationUrl: z.string().max(500).nullable().optional(),
  status: z.string().max(50).default("upcoming"),
  maxParticipants: z.number().int().positive().nullable().optional(),
  featured: z.boolean().default(false),
})

export const eventUpdateSchema = eventSchema.partial()

export const rankingSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  rank: z.number().int().positive(),
  rating: z.number().int().default(0),
  gamesPlayed: z.number().int().default(0),
  wins: z.number().int().default(0),
  losses: z.number().int().default(0),
  winRate: z.number().min(0).max(100).default(0),
  badge: z.string().max(100).nullable().optional(),
})

export const rankingUpdateSchema = rankingSchema.partial()

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().max(200).optional(),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().max(500).nullable().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().nullable().optional(),
  images: z.array(z.string()).default([]),
  category: z.string().min(1, "Category is required").max(100),
  inStock: z.boolean().default(true),
  stock: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
})

export const productUpdateSchema = productSchema.partial()

export const orderSchema = z.object({
  total: z.number().positive("Total must be positive"),
  status: z.string().max(50).default("pending"),
  customerName: z.string().min(1, "Customer name is required").max(200),
  customerEmail: emailSchema,
  customerPhone: z.string().max(50).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
})

export const orderUpdateSchema = orderSchema.partial()

export const resourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().max(200).optional(),
  description: z.string().min(1, "Description is required"),
  content: z.string().default(""),
  category: z.string().min(1, "Category is required").max(100),
  image: z.string().max(500).nullable().optional(),
  authorId: z.string().nullable().optional(),
  readTime: z.string().max(50).nullable().optional(),
  published: z.boolean().default(false),
})

export const resourceUpdateSchema = resourceSchema.partial()

export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  logo: z.string().default(""),
  description: z.string().min(1, "Description is required"),
  website: z.string().max(500).nullable().optional(),
  type: z.string().min(1, "Type is required").max(100),
  tier: z.string().max(100).nullable().optional(),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
})

export const partnerUpdateSchema = partnerSchema.partial()

export const gallerySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(500).nullable().optional(),
  coverImage: z.string().default(""),
  images: z.array(z.string()).default([]),
  date: z.string().or(z.date()).optional(),
  type: z.string().max(50).default("photos"),
})

export const galleryUpdateSchema = gallerySchema.partial()

export const donationSchema = z.object({
  donorName: z.string().min(1, "Donor name is required").max(200),
  donorEmail: emailSchema,
  amount: z.number().positive("Amount must be positive"),
  message: z.string().max(2000).nullable().optional(),
  anonymous: z.boolean().default(false),
  status: z.string().max(50).default("completed"),
})

export const donationUpdateSchema = donationSchema.partial()

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  bio: z.string().default(""),
  avatar: z.string().max(500).nullable().optional(),
  socialLinks: z.record(z.string()).nullable().optional(),
  order: z.number().int().default(0),
})

export const teamMemberUpdateSchema = teamMemberSchema.partial()

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: emailSchema,
  subject: z.string().min(1, "Subject is required").max(300),
  message: z.string().min(1, "Message is required").max(5000),
})

export const newsletterSchema = z.object({
  email: emailSchema,
})

export const settingsSchema = z.record(z.string(), z.string())

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(1, "Name is required").max(200),
  email: emailSchema,
  phone: z.string().max(50).nullable().optional(),
  school: z.string().max(200).nullable().optional(),
})
