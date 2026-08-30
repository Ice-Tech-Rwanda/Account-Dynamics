import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const membership = await prisma.membership.findFirst({ where: { status: "PUBLISHED" } });
  if (!membership) return NextResponse.json({ membership: null, plans: [] });

  const plans = await prisma.membershipPlan.findMany({
    where: { membershipId: membership.id },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ membership, plans });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { membership, plans } = body;

    // Upsert membership
    let membershipRecord = await prisma.membership.findFirst({ where: { status: "PUBLISHED" } });
    if (membershipRecord && membership) {
      membershipRecord = await prisma.membership.update({
        where: { id: membershipRecord.id },
        data: membership,
      });
    } else if (membership) {
      membershipRecord = await prisma.membership.create({ data: { title: membership.title ?? "Membership", ...membership } });
    }

    // Replace plans if provided
    if (plans && membershipRecord) {
      await prisma.membershipPlan.deleteMany({ where: { membershipId: membershipRecord.id } });
      for (const plan of plans) {
        await prisma.membershipPlan.create({
          data: { ...plan, membershipId: membershipRecord.id, features: JSON.stringify(plan.features ?? []) },
        });
      }
    }

    await logAudit({ userId: session.user.id, action: "membership:update", entity: "Membership", entityId: membershipRecord?.id });

    try {
      const { revalidateSite } = await import("@/lib/revalidate");
      revalidateSite();
    } catch { /* best-effort */ }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin:membership] update error", error);
    return NextResponse.json({ error: "Failed to update membership" }, { status: 500 });
  }
}
