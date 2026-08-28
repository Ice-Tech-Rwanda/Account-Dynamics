import { NextRequest } from "next/server"
import { contentService } from "@/domains/content/service.server"
import { ok, serverError } from "@/lib/api-helpers"
import { parsePagination } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const result = await contentService.getSuccessStories({ page, limit })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch success stories", { error: String(error) })
    return serverError()
  }
}
