"use client";

/**
 * Admin API fetch helper.
 *
 * In addition to a plain fetch it watches for 401 responses — meaning the
 * session has expired or become invalid — and bounces the user back to the
 * login page with an `expired=1` flag so the login screen can explain what
 * happened instead of the admin being stranded mid-action.
 *
 * A hard navigation (`window.location.assign`) is used on purpose: it resets
 * all in-memory state and server-side middleware re-protects the route.
 */
export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired. Please sign in again.");
    this.name = "SessionExpiredError";
  }
}

export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 401 && typeof window !== "undefined") {
    const current = window.location.pathname + window.location.search;
    const target = new URL("/admin/login", window.location.origin);
    if (current && current !== "/admin/login") {
      target.searchParams.set("redirect", current);
    }
    target.searchParams.set("expired", "1");
    window.location.assign(target.toString());
    throw new SessionExpiredError();
  }

  return res;
}