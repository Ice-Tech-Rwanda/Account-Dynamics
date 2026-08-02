import { prisma } from "@/lib/prisma"
import { created, serverError, conflict, parseParams } from "@/lib/api-helpers"
import { newsletterSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = parseParams(newsletterSchema, body)
    if (!parsed.success) return parsed.error
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: parsed.data.email },
    })
    if (existing) return conflict("This email is already subscribed")
    const subscriber = await prisma.newsletterSubscriber.create({ data: parsed.data })
    return created(subscriber)
  } catch (error) {
    logger.error("Failed to subscribe to newsletter", { error: String(error) })
    return serverError()
  }
}
