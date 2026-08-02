import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { z } from "zod";

export const settingsSchema = z.object({
  clubName: z.string().min(1).optional(),
  tagline: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  whatsapp: z.string().url().optional(),
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  youtube: z.string().url().optional(),
});

export type Settings = z.infer<typeof settingsSchema>;

export async function getSettings(): Promise<Settings> {
  const rows = await prisma.setting.findMany();
  const out: any = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function upsertSettings(data: Settings, userId?: string) {
  try {
    const parsed = settingsSchema.partial().parse(data);
    const ops = Object.entries(parsed).map(([key, value]) => prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } }));
    await Promise.all(ops);
    await prisma.auditLog.create({ data: { userId: userId ?? undefined, action: 'settings:update', entity: 'Setting', details: JSON.stringify(parsed) } });
    return { ok: true, data: parsed };
  } catch (err) {
    logger.error('upsertSettings failed', { err: String(err), data });
    throw err;
  }
}
