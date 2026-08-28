import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, serverError } from "@/lib/api-helpers"
import { parsePagination } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const skip = (page - 1) * limit
    const [categories, total] = await Promise.all([
      prisma.eventCategory.findMany({ orderBy: { count: "desc" }, skip, take: limit }),
      prisma.eventCategory.count(),
    ])
    return ok({ data: categories, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    logger.error("Failed to fetch event categories", { error: String(error) })
    return serverError()
  }
}
