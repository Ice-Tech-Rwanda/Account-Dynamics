import { NextRequest, NextResponse } from "next/server";

/**
 * Simple middleware that checks for session cookie presence.
 * No JWT decryption here — the auth() call in admin/layout.tsx
 * handles proper session verification server-side.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Auth.js v5 session cookie names
  const hasSessionCookie =
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("authjs.session-token");

  // Protect admin pages — redirect to login if no session cookie
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !hasSessionCookie
  ) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin API routes — return 401 if no session cookie
  if (pathname.startsWith("/api/admin") && !hasSessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect logged-in users away from login page
  if (pathname === "/admin/login" && hasSessionCookie) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
