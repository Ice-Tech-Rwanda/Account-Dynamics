import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { userCreateSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const q = searchParams.get("q")?.trim();
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[admin:users] list error", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) !== "SUPER_ADMIN") return NextResponse.json({ error: "Only SUPER_ADMIN can create users" }, { status: 403 });

  try {
    const body = await request.json();
    const parsed = userCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
    }

    const { password, ...userData } = parsed.data;
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { ...userData, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });

    await logAudit({ userId: session.user.id, action: "user:create", entity: "User", entityId: user.id, details: `role:${user.role}` });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    console.error("[admin:users] create error", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
