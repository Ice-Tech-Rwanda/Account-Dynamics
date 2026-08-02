import crypto from "crypto";

const SECRET = process.env.UPLOADS_SIGNING_SECRET ?? process.env.NEXTAUTH_SECRET ?? "local-dev-secret";

export function generateSignedToken(filename: string, expiresInSeconds = 300) {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = `${filename}:${expires}`;
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${hmac}.${expires}`;
}

export function verifySignedToken(filename: string, token: string) {
  try {
    const [hmac, expiresStr] = token.split(".");
    const expires = parseInt(expiresStr, 10);
    if (isNaN(expires) || expires < Math.floor(Date.now() / 1000)) return false;
    const payload = `${filename}:${expires}`;
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac));
  } catch {
    return false;
  }
}
