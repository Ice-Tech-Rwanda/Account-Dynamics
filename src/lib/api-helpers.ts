import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import type { z } from "zod"

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 })
}

export function noContent() {
  return new NextResponse(null, { status: 204 })
}

export function badRequest(message = "Bad request") {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function conflict(message = "Conflict") {
  return NextResponse.json({ error: message }, { status: 409 })
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 })
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) return unauthorized()
  if (session.user.role !== "admin") return forbidden()
  return session
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) return unauthorized()
  return session
}

export function parseParams<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; error: ReturnType<typeof badRequest> } {
  const result = schema.safeParse(data)
  if (!result.success) {
    const messages = result.error.issues.map((i: z.ZodIssue) => `${i.path.join(".")}: ${i.message}`).join("; ")
    return { success: false, error: badRequest(messages) }
  }
  return { success: true, data: result.data }
}
