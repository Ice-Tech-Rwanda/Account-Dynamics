// "use client"

/**
 * Parse a form submission failure into a user-facing message.
 *
 * Server mutations return `{ error: string }` (with an optional `code`).
 * When that shape is present we surface it verbatim so users see the real
 * reason (validation hint, rate limit, etc.) instead of a generic message.
 */
export async function submitErrorMessage(res: Response, fallback: string): Promise<string> {
  let message = fallback;
  try {
    const data = await res.json();
    if (data && typeof data === "object") {
      const raw = (data as { error?: unknown; message?: unknown }).error;
      if (typeof raw === "string" && raw.length > 0) {
        message = raw;
      } else {
        const m = (data as { message?: unknown }).message;
        if (typeof m === "string" && m.length > 0) message = m;
      }
    }
  } catch {
    /* non-JSON body; keep fallback */
  }
  return message;
}

/** Return true when the response indicates a duplicate (idempotent) submission. */
export function isDuplicateSubmit(res: Response): Promise<boolean> {
  return res
    .json()
    .then((data) => data?.duplicate === true)
    .catch(() => false);
}