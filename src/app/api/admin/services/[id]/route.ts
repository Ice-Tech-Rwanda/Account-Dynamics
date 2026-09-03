import { prisma } from "@/lib/prisma";
import { serviceUpdateSchema } from "@/lib/validation";
import { createGetHandler, createDeleteHandler } from "@/lib/admin/api-registry";
import { requireRole } from "@/lib/admin/api-registry";
import { NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";

const config = {
  name: "Service",
  createSchema: serviceUpdateSchema,
  updateSchema: serviceUpdateSchema,
  requiredRole: "ADMIN" as const,
  contentTags: ["services"],
  include: {
    category: true,
    benefits: { orderBy: { displayOrder: "asc" } },
  },
};

export const GET = createGetHandler(prisma.service, config);
export const DELETE = createDeleteHandler(prisma.service, config);

// Custom PATCH: `benefits` is a relation (ServiceBenefit[]), so it cannot be
// passed through the generic JSON-stringify serializer. It must be handled as
// a nested deleteMany + createMany so displayOrder can be re-sequenced.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const { id } = await params;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = serviceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
    }

    const { benefits, ...scalarData } = parsed.data;

    const updateData: any = {};
    for (const [key, value] of Object.entries(scalarData)) {
      if (value !== undefined) updateData[key] = value;
    }
    if (benefits !== undefined) {
      updateData.benefits = {
        deleteMany: {},
        createMany: {
          data: benefits.map((text: string, i: number) => ({ text, displayOrder: i })),
        },
      };
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    const record = await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        benefits: { orderBy: { displayOrder: "asc" } },
      },
    });

    await logAudit({
      userId: session.user.id,
      action: "service:update",
      entity: "Service",
      entityId: id,
      details: JSON.stringify({ updatedFields: Object.keys(updateData) }),
    });

    try {
      const { revalidateSite } = await import("@/lib/revalidate");
      revalidateSite();
    } catch { /* best-effort */ }

    return NextResponse.json(record);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "A service with this slug already exists in this category." }, { status: 409 });
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    console.error("[admin:Service] update error", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}
