import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const membershipSchema = z.object({
  title: z.string().max(300).optional(),
  subtitle: z.string().max(500).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
});

const membershipPlanSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(300),
  price: z.string().max(50).nullable().optional(),
  period: z.string().max(100).nullish().optional(),
  description: z.string().max(1000).nullable().optional(),
  features: z.array(z.string().max(500)).optional(),
  highlighted: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).optional(),
});

export async function GET() {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  const membership = await prisma.membership.findFirst({ where: { status: "PUBLISHED" } });
  if (!membership) return NextResponse.json({ membership: null, plans: [] });

  const plans = await prisma.membershipPlan.findMany({
    where: { membershipId: membership.id },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ membership, plans });
}

export async function PATCH(request: Request) {
  const { session, error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const body = await request.json();
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const membershipRaw = body.membership ?? {};
    const membershipParsed = membershipSchema.safeParse(membershipRaw);
    if (!membershipParsed.success) {
      return NextResponse.json({ error: "Invalid membership data" }, { status: 400 });
    }
    const membershipData = Object.fromEntries(
      Object.entries(membershipParsed.data).filter(([, v]) => v !== undefined)
    );

    const plansRaw = body.plans ?? [];
    if (!Array.isArray(plansRaw)) {
      return NextResponse.json({ error: "plans must be an array" }, { status: 400 });
    }
    const plansParsed: any[] = [];
    for (const plan of plansRaw) {
      const r = membershipPlanSchema.safeParse(plan);
      if (!r.success) {
        return NextResponse.json({ error: "Invalid plan data" }, { status: 400 });
      }
      plansParsed.push(r.data);
    }

    if (Object.keys(membershipData).length === 0 && plansParsed.length === 0) {
      return NextResponse.json({ error: "No data provided to update" }, { status: 400 });
    }

    let membershipRecord = await prisma.membership.findFirst({ where: { status: "PUBLISHED" } });
    if (Object.keys(membershipData).length > 0) {
      if (membershipRecord) {
        membershipRecord = await prisma.membership.update({
          where: { id: membershipRecord.id },
          data: membershipData,
        });
      } else {
        membershipRecord = await prisma.membership.create({ data: { title: membershipData.title ?? "Membership", ...membershipData } });
      }
    }

    if (plansParsed.length > 0 && membershipRecord) {
      // Non-destructive: upsert plans by id, delete only plans not present in the payload
      const submittedIds = plansParsed.filter((p) => p.id).map((p) => p.id);
      await prisma.membershipPlan.deleteMany({
        where: { membershipId: membershipRecord.id, id: { notIn: submittedIds } },
      });
      for (const plan of plansParsed) {
        const { id, features, ...planData } = plan;
        const data = {
          ...planData,
          features: features ? JSON.stringify(features) : JSON.stringify([]),
        };
        if (id) {
          await prisma.membershipPlan.update({ where: { id }, data }).catch(() => {
            return prisma.membershipPlan.create({ data: { ...data, membershipId: membershipRecord!.id } });
          });
        } else {
          await prisma.membershipPlan.create({ data: { ...data, membershipId: membershipRecord.id } });
        }
      }
    }

    await logAudit({ userId: session.user.id, action: "membership:update", entity: "Membership", entityId: membershipRecord?.id });

    try {
      const { revalidateSite } = await import("@/lib/revalidate");
      revalidateSite();
    } catch { /* best-effort */ }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin:membership] update error", err);
    return NextResponse.json({ error: "Failed to update membership" }, { status: 500 });
  }
}
