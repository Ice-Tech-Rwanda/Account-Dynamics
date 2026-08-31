// Simple CSRF Origin/Referer validator for mutating API routes
export function validateOrigin(req: Request): { ok: boolean; reason?: string } {
  const allowedOrigins = new Set<string>();

  // Add NEXTAUTH_URL
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl) {
    try {
      allowedOrigins.add(new URL(nextAuthUrl).origin);
    } catch { /* ignore invalid URL */ }
  }

  // Add NEXT_PUBLIC_APP_URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      allowedOrigins.add(new URL(appUrl).origin);
    } catch { /* ignore invalid URL */ }
  }

  // In development, also allow localhost on any port
  const isDev = process.env.NODE_ENV !== "production";

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (origin) {
    try {
      const o = new URL(origin);
      if (allowedOrigins.has(o.origin)) return { ok: true };
      if (isDev && o.hostname === "localhost") return { ok: true };
      return { ok: false, reason: `Origin ${o.origin} not allowed` };
    } catch {
      return { ok: false, reason: "Invalid Origin header" };
    }
  }

  if (referer) {
    try {
      const r = new URL(referer);
      if (allowedOrigins.has(r.origin)) return { ok: true };
      if (isDev && r.hostname === "localhost") return { ok: true };
      return { ok: false, reason: `Referer ${r.origin} not allowed` };
    } catch {
      return { ok: false, reason: "Invalid Referer header" };
    }
  }

  return { ok: false, reason: "No Origin or Referer header" };
}
