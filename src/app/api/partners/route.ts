import { NextRequest } from "next/server"
import { partnersService } from "@/domains/partners/service.server"
import { ok, created, serverError, parseParams } from "@/lib/api-helpers"
import { partnerSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get("page") ?? "1", 10) || 1
    const limit = parseInt(searchParams.get("limit") ?? "50", 10) || 50
    const result = await partnersService.list({ page, limit })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch partners", { error: String(error) })
    return serverError()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseParams(partnerSchema, body)
    if (!parsed.success) return parsed.error
    const partner = await prisma.partner.create({ data: parsed.data as any })
    return created(partner)
  } catch (error) {
    logger.error("Failed to create partner", { error: String(error) })
    return serverError()
  }
}
