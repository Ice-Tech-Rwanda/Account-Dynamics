import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { hkdf } from "@panva/hkdf";

const enc = "A256CBC-HS512";

/**
 * Derive the encryption key the same way Auth.js does.
 * Auth.js uses HKDF-SHA512 with the secret and salt (cookie name) to derive
 * the encryption key for JWE tokens.
 */
async function deriveKey(secret: string, salt: string): Promise<Uint8Array> {
  const length = enc === "A256CBC-HS512" ? 64 : 32;
  return await hkdf(
    "sha256",
    secret,
    salt,
    `Auth.js Generated Encryption Key (${salt})`,
    length
  );
}

/**
 * Decrypt an Auth.js JWE session token and return the payload.
 */
async function decryptSessionToken(
  token: string,
  secret: string,
  salt: string
): Promise<Record<string, unknown> | null> {
  try {
    const key = await deriveKey(secret, salt);
    const { payload } = await jwtDecrypt(token, key, {
      clockTolerance: 15,
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: [enc],
    });
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Get the session token from cookies and decrypt it.
 */
async function getSessionUser(
  req: NextRequest,
  secureCookie: boolean
): Promise<Record<string, unknown> | null> {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  const cookieName = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = req.cookies.get(cookieName)?.value;
  if (!token) return null;

  return await decryptSessionToken(token, secret, cookieName);
}

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const secureCookie = req.url.startsWith("https://");
    const session = await getSessionUser(req, secureCookie);
    const isLoggedIn = !!session;
    const cookieName = secureCookie
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    // Debug endpoint
    if (pathname === "/admin/debug-auth") {
      return NextResponse.json({
        isLoggedIn,
        session,
        cookieName,
        hasCookie: !!req.cookies.get(cookieName),
        secureCookie,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
      });
    }

    // Protect admin pages - redirect to login if not authenticated
    if (
      pathname.startsWith("/admin") &&
      !pathname.startsWith("/admin/login") &&
      !isLoggedIn
    ) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
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
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
