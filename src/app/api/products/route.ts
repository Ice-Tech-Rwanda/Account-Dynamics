import { NextRequest } from "next/server"
import { shopService } from "@/domains/shop/service.server"
import { prisma } from "@/lib/prisma"
import { ok, created, serverError, parseParams } from "@/lib/api-helpers"
import { productSchema, parsePagination } from "@/lib/validation"
import { slugify } from "@/lib/utils"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const result = await shopService.list({ page, limit })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch products", { error: String(error) })
    return serverError()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseParams(productSchema, body)
    if (!parsed.success) return parsed.error
    const data = {
      ...parsed.data,
      slug: parsed.data.slug ?? slugify(parsed.data.name),
      images: JSON.stringify(parsed.data.images),
    }
    const product = await prisma.product.create({ data })
    return created({ ...product, images: JSON.parse(product.images) })
  } catch (error) {
    logger.error("Failed to create product", { error: String(error) })
    return serverError()
  }
}
