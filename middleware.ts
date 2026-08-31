import { NextRequest, NextResponse } from "next/server";

/**
 * Minimal middleware — pass all requests through.
 * Auth gating is handled by the admin layout (with route group for login).
 */
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
