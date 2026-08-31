import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Debug: return auth info for the debug page
  if (pathname === "/admin/debug-auth") {
    return NextResponse.json({
      isLoggedIn,
      auth: req.auth,
      hasCookie: !!req.cookies.get("__Secure-authjs.session-token"),
      cookieNames: Object.keys(Object.fromEntries(req.cookies)),
    })
  }

  // Protect admin pages - redirect to login if not authenticated
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/debug-auth") &&
    !isLoggedIn
  ) {
    const loginUrl = new URL("/admin/login", req.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Protect admin API routes - return 401 if not authenticated
  if (pathname.startsWith("/api/admin") && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Redirect already logged-in users from login page to dashboard
  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
