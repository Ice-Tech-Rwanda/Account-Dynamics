import { prisma } from "@/lib/prisma"
import { created, parseParams, serverError } from "@/lib/api-helpers"
import { contactSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseParams(contactSchema, body)
    if (!parsed.success) return parsed.error
    const message = await prisma.contactMessage.create({ data: parsed.data })
    return created(message)
  } catch (error) {
    logger.error("Failed to send contact message", { error: String(error) })
    return serverError()
  }
}
