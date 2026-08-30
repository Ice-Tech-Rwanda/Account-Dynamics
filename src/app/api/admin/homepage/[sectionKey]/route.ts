import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { homepageSectionSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

export async function GET(_request: Request, { params }: { params: Promise<{ sectionKey: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { sectionKey } = await params;
  const section = await prisma.homepageSection.findUnique({ where: { sectionKey } });
  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(section);
}

export async function PUT(request: Request, { params }: { params: Promise<{ sectionKey: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { sectionKey } = await params;
  const body = await request.json();
  const parsed = homepageSectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  }

  // Serialize items array to JSON string for Prisma text field
  const prismaData: Record<string, any> = { ...parsed.data };
  if (prismaData.items && Array.isArray(prismaData.items)) {
    prismaData.items = JSON.stringify(prismaData.items);
  }
  // Remove undefined values
  for (const [key, val] of Object.entries(prismaData)) {
    if (val === undefined) delete prismaData[key];
  }

  try {
    const section = await prisma.homepageSection.upsert({
      where: { sectionKey },
      update: prismaData,
      create: { sectionKey, ...prismaData },
    });

    await logAudit({ userId: session.user.id, action: "homepage:update", entity: "HomepageSection", entityId: section.id, details: sectionKey });

    try {
      const { revalidateSite } = await import("@/lib/revalidate");
      revalidateSite();
    } catch { /* best-effort */ }

    return NextResponse.json(section);
  } catch (error) {
    console.error("[admin:homepage] update error", error);
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}
