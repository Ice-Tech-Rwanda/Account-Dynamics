import { NextRequest } from "next/server"
import { eventsService } from "@/domains/events/service.server"
import { prisma } from "@/lib/prisma"
import { ok, created, serverError, parseParams } from "@/lib/api-helpers"
import { eventSchema, parsePagination } from "@/lib/validation"
import { slugify } from "@/lib/utils"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const { page, limit } = parsePagination(searchParams)
    const result = await eventsService.list({ page, limit })
    return ok(result)
  } catch (error) {
    logger.error("Failed to fetch events", { error: String(error) })
    return serverError()
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseParams(eventSchema, body)
    if (!parsed.success) return parsed.error
    const data = {
      ...parsed.data,
      slug: parsed.data.slug ?? slugify(parsed.data.title),
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    }
    const event = await prisma.event.create({ data })
    return created(event)
  } catch (error) {
    logger.error("Failed to create event", { error: String(error) })
    return serverError()
  }
}
