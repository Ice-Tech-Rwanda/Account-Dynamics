import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, parseParams } from "@/lib/api-helpers"
import { resourceUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const resource = await prisma.article.findUnique({ where: { id } })
    if (!resource) return notFound()
    return ok(resource)
  } catch (error) {
    logger.error("Failed to fetch resource", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const body = await request.json()
    const parsed = parseParams(resourceUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) return notFound()
    const data: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.published && !existing.publishedAt) data.publishedAt = new Date()
    const resource = await prisma.article.update({ where: { id }, data })
    return ok(resource)
  } catch (error) {
    logger.error("Failed to update resource", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.article.delete({ where: { id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete resource", { error: String(error) })
    return serverError()
  }
}
