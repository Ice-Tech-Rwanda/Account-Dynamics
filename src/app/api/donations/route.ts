import { NextRequest } from "next/server"
import { donationsService } from "@/domains/donations/service.server"
import { prisma } from "@/lib/prisma"
import { ok, created, serverError, parseParams } from "@/lib/api-helpers"
import { donationSchema, parsePagination } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const parsed = parseParams(donationSchema, body)
    if (!parsed.success) return parsed.error
    const donation = await prisma.donation.create({ data: parsed.data })
    logger.info("donation.created", { id: donation.id, amount: donation.amount, anonymous: donation.anonymous })
    return created({ id: donation.id })
  } catch (err) {
    logger.error("donation.error", { error: String(err) })
    return serverError()
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const result = await donationsService.list({ page, limit })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch donations", { error: String(error) })
    return serverError()
  }
}
