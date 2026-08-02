import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, parseParams } from "@/lib/api-helpers"
import { galleryUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const item = await prisma.gallery.findUnique({ where: { id } })
    if (!item) return notFound()
    return ok({ ...item, images: JSON.parse(item.images) })
  } catch (error) {
    logger.error("Failed to fetch gallery item", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const body = await request.json()
    const parsed = parseParams(galleryUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.gallery.findUnique({ where: { id } })
    if (!existing) return notFound()
    const data: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.images) data.images = JSON.stringify(parsed.data.images)
    if (parsed.data.date) data.date = new Date(parsed.data.date)
    const item = await prisma.gallery.update({ where: { id }, data })
    return ok({ ...item, images: JSON.parse(item.images) })
  } catch (error) {
    logger.error("Failed to update gallery item", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const existing = await prisma.gallery.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.gallery.delete({ where: { id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete gallery item", { error: String(error) })
    return serverError()
  }
}
