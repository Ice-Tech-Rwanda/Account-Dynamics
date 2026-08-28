import { auth } from "@/lib/auth"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized")
  }
  return session
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}
