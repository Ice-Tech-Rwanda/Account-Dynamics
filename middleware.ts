import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Use NextAuth's getToken to properly decode the (possibly encrypted) JWT session token
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
      salt: "authjs.session-token",
    });
    const isLoggedIn = !!token;

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
