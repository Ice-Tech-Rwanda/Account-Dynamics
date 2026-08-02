import { z } from "zod"

export const DonationStatuses = ["pending", "completed"] as const
export type DonationStatus = (typeof DonationStatuses)[number]

export interface Donation {
  id: string
  donorName: string
  donorEmail: string
  amount: number
  message?: string
  anonymous: boolean
  date: string
  status: DonationStatus
}

export const donationSchema = z.object({
  donorName: z.string().min(1, "Name is required"),
  donorEmail: z.string().email("Valid email is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  message: z.string().optional(),
  anonymous: z.boolean().default(false),
  status: z.enum(DonationStatuses).default("pending"),
})
