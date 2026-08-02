import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, parseParams } from "@/lib/api-helpers"
import { productUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return notFound()
    return ok({ ...product, images: JSON.parse(product.images) })
  } catch (error) {
    logger.error("Failed to fetch product", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const body = await request.json()
    const parsed = parseParams(productUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) return notFound()
    const data: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.images) data.images = JSON.stringify(parsed.data.images)
    const product = await prisma.product.update({ where: { id }, data })
    return ok({ ...product, images: JSON.parse(product.images) })
  } catch (error) {
    logger.error("Failed to update product", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.product.delete({ where: { id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete product", { error: String(error) })
    return serverError()
  }
}
