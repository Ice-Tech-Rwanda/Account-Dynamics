import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  for (const row of rows) settings[row.key] = row.value;
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Settings must be an object" }, { status: 400 });
  }

  const entries = Object.entries(body).filter(([k, v]) => typeof k === "string" && typeof v === "string");
  if (!entries.length) {
    return NextResponse.json({ error: "No valid settings provided" }, { status: 400 });
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
