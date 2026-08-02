import { z } from "zod"

export const PartnerTiers = ["platinum", "gold", "silver", "bronze"] as const
export const PartnerTypes = ["sponsor", "partner", "media"] as const
export type PartnerTier = (typeof PartnerTiers)[number]
export type PartnerType = (typeof PartnerTypes)[number]

export interface Partner {
  id: string
  name: string
  logo: string
  description: string
  website?: string
  type: string
  tier?: string
  spotlight?: boolean
  yearEstablished?: number
  stats?: { label: string; value: string }[]
}

export interface SponsorshipPackage {
  id: string
  name: string
  price: number
  description: string
  benefits: string[]
  popular?: boolean
}

export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().min(1, "Logo URL is required"),
  description: z.string().min(1, "Description is required"),
  website: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  tier: z.string().optional(),
  order: z.coerce.number().optional(),
  active: z.boolean().default(true),
})

export const sponsorshipPackageSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  description: z.string().min(1),
  benefits: z.string().default("[]"),
  popular: z.boolean().default(false),
  order: z.coerce.number().optional(),
})
