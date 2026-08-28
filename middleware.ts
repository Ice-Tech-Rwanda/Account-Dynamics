import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { isAllowed } from "./src/lib/localRateLimiter"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Rate limit credential callback POSTs
  if (pathname === "/api/auth/callback/credentials" && req.method === "POST") {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    const key = `login:${ip}`
    if (!isAllowed(key)) {
      return NextResponse.json({ error: "Too many login attempts" }, { status: 429 })
    }
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin") && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Protect admin pages - redirect to login if not authenticated
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.url)
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect already logged-in users from login page to dashboard
  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/api/auth/callback/credentials", "/api/admin/:path*"],
}
