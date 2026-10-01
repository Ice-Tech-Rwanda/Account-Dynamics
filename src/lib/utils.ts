import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

/**
 * Returns a displayable price, or null when the value is a placeholder.
 * The source site shows "From $0.00" for packages without a published price,
 * so those must never be rendered.
 */
export function displayPackagePrice(price?: string | null): string | null {
  if (!price) return null
  const normalized = price.trim()
  if (!normalized) return null
  const numeric = Number(normalized.replace(/[^0-9.]/g, ""))
  if (Number.isNaN(numeric) || numeric <= 0) return null
  return normalized
}
