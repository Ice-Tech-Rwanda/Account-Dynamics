import { NextRequest } from "next/server"
import { partnersService } from "@/domains/partners/service.server"
import { ok, serverError } from "@/lib/api-helpers"
import { parsePagination } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const result = await partnersService.getSponsorshipPackages({ page, limit })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch sponsorship packages", { error: String(error) })
    return serverError()
  }
}
