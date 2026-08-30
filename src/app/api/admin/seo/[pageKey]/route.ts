import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { seoSettingSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

export async function GET(_request: Request, { params }: { params: Promise<{ pageKey: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { pageKey } = await params;
  const seo = await prisma.seoSetting.findUnique({ where: { pageKey } });
  if (!seo) return NextResponse.json({ pageKey, title: null, description: null, ogImage: null, canonicalUrl: null, indexable: true });
  return NextResponse.json(seo);
}

export async function PUT(request: Request, { params }: { params: Promise<{ pageKey: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { pageKey } = await params;
  const body = await request.json();
  const parsed = seoSettingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  }

  try {
    const seo = await prisma.seoSetting.upsert({
      where: { pageKey },
      update: parsed.data,
      create: { pageKey, ...parsed.data },
    });

    await logAudit({ userId: session.user.id, action: "seo:update", entity: "SeoSetting", entityId: seo.id, details: pageKey });

    return NextResponse.json(seo);
  } catch (error) {
    console.error("[admin:seo] update error", error);
    return NextResponse.json({ error: "Failed to update SEO settings" }, { status: 500 });
  }
}
