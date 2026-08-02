import { z } from "zod"

export const ProductCategories = ["boards", "books", "merch", "accessories"] as const
export type ProductCategory = (typeof ProductCategories)[number]

export interface ProductReview {
  id: string
  author: string
  avatar?: string
  rating: number
  date: string
  text: string
  verified: boolean
}

export interface ProductVariant {
  id: string
  label: string
  value: string
  priceModifier?: number
  inStock?: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  inStock: boolean
  stock?: number
  featured?: boolean
  rating: number
  reviewCount: number
  reviews: ProductReview[]
  variants?: ProductVariant[]
  details?: string[]
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().optional(),
  images: z.string().default("[]"),
  category: z.string().min(1, "Category is required"),
  inStock: z.boolean().default(true),
  stock: z.coerce.number().default(0),
  featured: z.boolean().default(false),
})
