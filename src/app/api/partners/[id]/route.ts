import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, parseParams } from "@/lib/api-helpers"
import { partnerUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const partner = await prisma.partner.findUnique({ where: { id } })
    if (!partner) return notFound()
    return ok(partner)
  } catch (error) {
    logger.error("Failed to fetch partner", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const body = await request.json()
    const parsed = parseParams(partnerUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.partner.findUnique({ where: { id } })
    if (!existing) return notFound()
    const partner = await prisma.partner.update({ where: { id }, data: parsed.data })
    return ok(partner)
  } catch (error) {
    logger.error("Failed to update partner", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const existing = await prisma.partner.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.partner.delete({ where: { id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete partner", { error: String(error) })
    return serverError()
  }
}
