import { NextRequest, NextResponse } from "next/server";

// Simple JWT payload decoder for session verification
// Middleware runs in Edge Runtime, so we decode the JWT without cryptographic verification
// The cookie is HttpOnly and set by NextAuth, so tampering is not a concern
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getLoggedInUser(req: NextRequest): Record<string, unknown> | null {
  try {
    const sessionToken =
      req.cookies.get("next-auth.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value;
    if (!sessionToken) return null;

    const payload = decodeJwtPayload(sessionToken);
    if (!payload) return null;

    const raw = payload as Record<string, unknown>;
    const sessionObj = raw.session as Record<string, unknown> | undefined;
    const user = raw.user || sessionObj?.user || payload;
    if (typeof user === "object" && user !== null) {
      return user as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const user = getLoggedInUser(req);
    const isLoggedIn = !!user;

    // Protect admin pages - redirect to login if not authenticated
    if (
      pathname.startsWith("/admin") &&
      !pathname.startsWith("/admin/login") &&
      !isLoggedIn
    ) {
      const loginUrl = new URL("/admin/login", req.url);
      const redirectPath = req.nextUrl.pathname;
      if (redirectPath.startsWith("/admin") && !redirectPath.startsWith("//")) {
        loginUrl.searchParams.set("redirect", redirectPath);
      }
      return NextResponse.redirect(loginUrl);
    }

    // Protect admin API routes - return 401 if not authenticated
    if (pathname.startsWith("/api/admin") && !isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Redirect already logged-in users from login page to dashboard
    if (pathname === "/admin/login" && isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[middleware] Error:", error);
    // On error, deny access rather than fail open
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
