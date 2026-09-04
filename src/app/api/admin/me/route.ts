import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

const ALLOWED_FIELDS = new Set(["name", "phone", "bio", "image"]);

function cleanString(value: unknown, max: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  return String(value).trim().slice(0, max);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, phone: true, bio: true, image: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const data: Record<string, any> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) {
        data[key] = key === "bio" ? cleanString(body[key], 1000) : cleanString(body[key], 200);
      }
    }

    // Allow clearing optional fields with an empty/null value.
    for (const key of ["phone", "bio", "image"]) {
      if (key in body && (body[key] === null || body[key] === "")) {
        data[key] = null;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, name: true, email: true, role: true, phone: true, bio: true, image: true },
    });

    await logAudit({
      userId: session.user.id,
      action: "profile:update",
      entity: "User",
      entityId: user.id,
      details: JSON.stringify({ updatedFields: Object.keys(data) }),
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[admin:me] update error", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
