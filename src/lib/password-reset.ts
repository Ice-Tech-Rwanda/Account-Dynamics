import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Server-only admin password reset support.
 *
 * Tokens are stored HASHED in the VerificationToken table (never in plaintext)
 * using the existing NextAuth model — no schema change required. Each token is
 * single-use and expires after 30 minutes.
 */

const RESET_TTL_MS = 30 * 60 * 1000;
const MAX_REQUESTS_PER_EMAIL_PER_HOUR = 5;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Validates the plaintext token format produced by createPasswordResetToken. */
export function isValidResetTokenShape(token: string): boolean {
  return /^[a-f0-9]{64}$/i.test(token.trim());
}

// Per-instance, in-memory throttle on reset-email sending (defense in depth
// behind email delivery itself). Prevents a single inbox from generating an
// email storm via repeated submissions.
const requestTracker = new Map<string, number[]>();

function canRequestReset(email: string): boolean {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const attempts = (requestTracker.get(email) ?? []).filter((t) => t > hourAgo);
  if (attempts.length >= MAX_REQUESTS_PER_EMAIL_PER_HOUR) return false;
  attempts.push(now);
  requestTracker.set(email, attempts);
  return true;
}

/**
 * Create a single-use password reset token for an EXISTING admin user.
 * Returns the plaintext token (emailed to the user), or null when the email
 * does not belong to a registered admin OR the request was rate-limited.
 * Both failure modes return null so callers can respond identically and avoid
 * leaking which emails have accounts.
 */
export async function createPasswordResetToken(emailRaw: string): Promise<string | null> {
  const email = emailRaw.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  if (!canRequestReset(email)) return null;

  const plain = randomBytes(32).toString("hex");
  const hashed = hashToken(plain);

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashed,
      expires: new Date(Date.now() + RESET_TTL_MS),
    },
  });

  return plain;
}

/**
 * Validate + consume a reset token (single use). Returns true only when the
 * token exists, matches the email, and has not expired.
 */
export async function consumePasswordResetToken(emailRaw: string, plain: string): Promise<boolean> {
  const email = emailRaw.trim().toLowerCase();
  if (!isValidResetTokenShape(plain)) return false;

  const hashed = hashToken(plain);
  const record = await prisma.verificationToken.findUnique({ where: { token: hashed } });
  if (!record || record.identifier !== email) return false;

  await prisma.verificationToken.delete({ where: { token: hashed } }).catch(() => undefined);

  if (record.expires.getTime() < Date.now()) return false;
  return true;
}