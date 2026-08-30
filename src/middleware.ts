import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public access to /admin/login and API auth routes
  if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Protect admin pages
    "/admin/:path*",
    // Don't protect public API routes (only /api/admin/* needs auth, handled in route handlers)
  ],
};
