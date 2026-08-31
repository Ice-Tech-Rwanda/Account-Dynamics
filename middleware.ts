import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware: first line of defense for admin route protection.
 * Checks for Auth.js session cookie presence.
 * Defense-in-depth: the (protected)/layout.tsx also verifies the session server-side.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Auth.js v5 session cookie presence check
  const hasSession =
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("authjs.session-token");

  // ─── Protect admin pages ────────────────────────────────────────
  // /admin/* (except /admin/login) requires a session cookie
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !hasSession
  ) {
    const loginUrl = new URL("/admin/login", req.url);
    // Pass the original path so login can redirect back (validated server-side)
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Protect admin API routes ───────────────────────────────────
  if (pathname.startsWith("/api/admin") && !hasSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ─── Redirect logged-in users away from login page ─────────────
  if (pathname === "/admin/login" && hasSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // ─── Add cache-control headers to admin pages ───────────────────
  // Prevent CDN/edge caching of admin content
  const response = NextResponse.next();
  if (pathname.startsWith("/admin")) {
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
