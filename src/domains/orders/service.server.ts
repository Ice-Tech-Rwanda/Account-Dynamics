import { prisma } from "@/lib/prisma"
import type { Order, OrderStatus } from "./domain"

type PrismaOrder = {
  id: string; total: number; status: string; customerName: string;
  customerEmail: string; customerPhone: string | null; address: string | null;
  notes: string | null; createdAt: Date; updatedAt: Date;
}

function toOrder(o: PrismaOrder): Order {
  return {
    id: o.id, items: [], total: o.total, status: o.status as OrderStatus,
    customerName: o.customerName, customerEmail: o.customerEmail,
    customerPhone: o.customerPhone ?? undefined, address: o.address ?? undefined,
    notes: o.notes ?? undefined, createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }
}

export const ordersService = {
  async list(params: { page?: number; limit?: number; status?: string } = {}) {
    const { page = 1, limit = 20, status } = params
    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const [rows, total] = await Promise.all([
      prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.order.count({ where }),
    ])
    return { data: rows.map(toOrder), total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async getById(id: string) {
    const o = await prisma.order.findUnique({ where: { id } })
    return o ? toOrder(o) : null
  },

  async create(data: { customerName: string; customerEmail: string; customerPhone?: string; address?: string; notes?: string; total: number }) {
    const created = await prisma.order.create({
      data: { customerName: data.customerName, customerEmail: data.customerEmail, customerPhone: data.customerPhone ?? null, address: data.address ?? null, notes: data.notes ?? null, total: data.total, status: "pending" },
    })
    return toOrder(created)
  },
}
