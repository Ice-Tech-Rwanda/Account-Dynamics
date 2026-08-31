import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to protect admin routes.
 * Checks for session cookie presence only — no JWT decryption.
 * The auth() call in admin/layout.tsx provides defense-in-depth.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Auth.js v5 session cookie presence check
  const hasSession =
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("authjs.session-token");

  // Protect admin pages — redirect to login if no session cookie
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !hasSession
  ) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin API routes — return 401 if no session cookie
  if (pathname.startsWith("/api/admin") && !hasSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect logged-in users away from the login page
  if (pathname === "/admin/login" && hasSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path+", "/api/admin/:path+"],
};
