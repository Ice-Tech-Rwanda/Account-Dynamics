import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, notFound, serverError, parseParams } from "@/lib/api-helpers"
import { orderUpdateSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return notFound()
    return ok(order)
  } catch (error) {
    logger.error("Failed to fetch order", { error: String(error) })
    return serverError()
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const body = await request.json()
    const parsed = parseParams(orderUpdateSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) return notFound()
    const order = await prisma.order.update({ where: { id }, data: parsed.data })
    return ok(order)
  } catch (error) {
    logger.error("Failed to update order", { error: String(error) })
    return serverError()
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  try {
    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) return notFound()
    await prisma.order.delete({ where: { id } })
    return ok({ success: true })
  } catch (error) {
    logger.error("Failed to delete order", { error: String(error) })
    return serverError()
  }
}
