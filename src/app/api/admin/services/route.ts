import { prisma } from "@/lib/prisma";
import { serviceSchema, serviceUpdateSchema } from "@/lib/validation";
import {
  createListHandler,
  createCreateHandler,
} from "@/lib/admin/api-registry";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

const config = {
  name: "Service",
  createSchema: serviceSchema,
  updateSchema: serviceUpdateSchema,
  requiredRole: "ADMIN" as const,
  searchFields: ["name", "slug", "description"],
  orderBy: { displayOrder: "asc" },
  contentTags: ["services"],
  include: {
    category: true,
    benefits: { orderBy: { displayOrder: "asc" } },
  },
};

export const GET = createListHandler(prisma.service, config);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { serviceSchema: schema } = await import("@/lib/validation");
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
    }

    const { benefits, ...data } = parsed.data as any;

    const record = await prisma.service.create({
      data: {
        ...data,
        benefits: benefits?.length
          ? { create: benefits.map((text: string, i: number) => ({ text, displayOrder: i })) }
          : undefined,
      },
      include: { benefits: true, category: true },
    });

    await logAudit({
      userId: session.user.id,
      action: "service:create",
      entity: "Service",
      entityId: record.id,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ error: "A service with this slug already exists in this category." }, { status: 409 });
    console.error("[admin:Service] create error", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
