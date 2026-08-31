import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Debug: bypass all auth for /admin/debug-auth to test if middleware runs
  if (pathname === "/admin/debug-auth") {
    return NextResponse.json({ hello: "middleware is running", pathname, url: req.url });
  }

  // Simple cookie check without JWT decryption
  const token =
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("authjs.session-token")?.value;
  const isLoggedIn = !!token;

  // Protect admin pages
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !isLoggedIn
  ) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin API routes
  if (pathname.startsWith("/api/admin") && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect logged-in users from login page
  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
