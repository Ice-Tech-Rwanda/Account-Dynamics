import { z } from "zod"

export const OrderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const
export type OrderStatus = (typeof OrderStatuses)[number]

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  customerName: string
  customerEmail: string
  customerPhone?: string
  address?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product?: { name: string; slug: string }
}

export const orderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().positive(),
    price: z.coerce.number().positive(),
  })).min(1, "At least one item is required"),
})
