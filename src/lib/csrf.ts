// Simple CSRF Origin/Referer validator for mutating API routes
export function validateOrigin(req: Request): { ok: boolean; reason?: string } {
  const allowed = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (origin) {
    try {
      const o = new URL(origin);
      if (o.origin === allowed) return { ok: true };
      return { ok: false, reason: `Origin ${o.origin} not allowed` };
    } catch {
      return { ok: false, reason: "Invalid Origin header" };
    }
  }

  if (referer) {
    try {
      const r = new URL(referer);
      if (r.origin === allowed) return { ok: true };
      return { ok: false, reason: `Referer ${r.origin} not allowed` };
    } catch {
      return { ok: false, reason: "Invalid Referer header" };
    }
  }

  return { ok: false, reason: "No Origin or Referer header" };
}
