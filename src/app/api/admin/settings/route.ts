import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";
import { logAudit } from "@/lib/audit";

/** Only these settings keys can be modified via the admin UI. */
const ALLOWED_KEYS = new Set([
  "companyName", "shortName", "tagline", "description",
  "email", "phone", "phoneSecondary", "adminEmail",
  "addressLine1", "addressLine2", "city", "province", "postalCode", "country",
  "businessHoursLine1", "businessHoursLine2",
  "linkedin", "facebook", "instagram", "youtube",
  "bookingUrl", "whatsappNumber", "whatsappMessage",
  "copyright", "designerCredit",
  "logo", "favicon",
]);

export async function GET() {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  const rows = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  for (const row of rows) settings[row.key] = row.value;
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const { session, error } = await requireRole("ADMIN");
  if (error) return error;

  const body = await request.json();
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Settings must be an object" }, { status: 400 });
  }

  // Filter to only allowed keys
  const entries = Object.entries(body).filter(
    ([k, v]) => typeof k === "string" && typeof v === "string" && ALLOWED_KEYS.has(k)
  );

  if (!entries.length) {
    return NextResponse.json({ error: "No valid settings provided" }, { status: 400 });
  }

  // Blocklist: reject if someone tries to set these via the API
  const blocked = Object.keys(body).filter((k) => !ALLOWED_KEYS.has(k));
  if (blocked.length) {
    logger.warn("Settings update blocked keys", { keys: blocked, userId: session.user.id });
  }

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value: value as string }, create: { key, value: value as string } })
    )
  );

  await logAudit({
    userId: session.user.id,
    action: "settings:update",
    entity: "Setting",
    details: JSON.stringify({ keys: entries.map(([k]) => k) }),
  });

  try {
    const { revalidateSite } = await import("@/lib/revalidate");
    revalidateSite();
  } catch { /* best-effort */ }

  return NextResponse.json({ ok: true, updated: entries.length });
}

import { logger } from "@/lib/logger";
