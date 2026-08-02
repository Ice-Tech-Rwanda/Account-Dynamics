import { NextRequest } from "next/server"
import { galleryService } from "@/domains/gallery/service.server"
import { ok, serverError } from "@/lib/api-helpers"
import { parsePagination } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const category = searchParams.get("category") || undefined
    const result = await galleryService.list({ page, limit, category })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch gallery", { error: String(error) })
    return serverError()
  }
}
