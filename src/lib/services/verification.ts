import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function createVerificationToken(identifier: string, ttlSeconds = 3600) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + ttlSeconds * 1000);
  await prisma.verificationToken.create({ data: { identifier, token, expires } });
  return token;
}

export async function verifyToken(identifier: string, token: string) {
  const rec = await prisma.verificationToken.findUnique({ where: { token } });
  if (!rec) return false;
  if (rec.identifier !== identifier) return false;
  if (rec.expires < new Date()) return false;
  // consume token
  await prisma.verificationToken.delete({ where: { token } });
  return true;
}
