import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, parseParams } from "@/lib/api-helpers"
import { eventUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) return notFound()
    return ok(event)
  } catch (error) {
    logger.error("Failed to fetch event", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const body = await request.json()
    const parsed = parseParams(eventUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.event.findUnique({ where: { id } })
    if (!existing) return notFound()
    const data: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.startDate) data.startDate = new Date(parsed.data.startDate)
    if (parsed.data.endDate) data.endDate = parsed.data.endDate ? new Date(parsed.data.endDate) : null
    const event = await prisma.event.update({ where: { id }, data })
    return ok(event)
  } catch (error) {
    logger.error("Failed to update event", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const existing = await prisma.event.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.event.delete({ where: { id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete event", { error: String(error) })
    return serverError()
  }
}
