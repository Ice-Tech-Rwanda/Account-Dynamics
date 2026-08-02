import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, parseParams } from "@/lib/api-helpers"
import { donationUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const donation = await prisma.donation.findUnique({ where: { id } })
    if (!donation) return notFound()
    return ok(donation)
  } catch (error) {
    logger.error("Failed to fetch donation", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const body = await request.json()
    const parsed = parseParams(donationUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.donation.findUnique({ where: { id } })
    if (!existing) return notFound()
    const donation = await prisma.donation.update({ where: { id }, data: parsed.data })
    return ok(donation)
  } catch (error) {
    logger.error("Failed to update donation", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const existing = await prisma.donation.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.donation.delete({ where: { id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete donation", { error: String(error) })
    return serverError()
  }
}
