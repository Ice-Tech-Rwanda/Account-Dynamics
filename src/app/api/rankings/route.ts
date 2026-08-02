import { NextRequest } from "next/server"
import { rankingsService } from "@/domains/rankings/service.server"
import { ok, created, serverError, parseParams } from "@/lib/api-helpers"
import { rankingSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get("page") ?? "1", 10) || 1
    const limit = parseInt(searchParams.get("limit") ?? "20", 10) || 20
    const result = await rankingsService.list({ page, limit })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch rankings", { error: String(error) })
    return serverError()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseParams(rankingSchema, body)
    if (!parsed.success) return parsed.error
    const ranking = await prisma.ranking.create({ data: parsed.data })
    return created(ranking)
  } catch (error) {
    logger.error("Failed to create ranking", { error: String(error) })
    return serverError()
  }
}
