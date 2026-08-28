import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, created, serverError, parseParams } from "@/lib/api-helpers"
import { orderSchema, parsePagination } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const skip = (page - 1) * limit
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.order.count(),
    ])
    return ok({ data: orders, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    logger.error("Failed to fetch orders", { error: String(error) })
    return serverError()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseParams(orderSchema, body)
    if (!parsed.success) return parsed.error
    const order = await prisma.order.create({ data: parsed.data })
    return created(order)
  } catch (error) {
    logger.error("Failed to create order", { error: String(error) })
    return serverError()
  }
}
