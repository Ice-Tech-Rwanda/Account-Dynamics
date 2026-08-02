import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, serverError, unauthorized } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const donations = await prisma.donation.findMany({ orderBy: { createdAt: "desc" } });
    const safe = donations.map((d) => ({
      id: d.id,
      donorName: d.anonymous ? null : d.donorName,
      donorEmail: d.anonymous ? null : d.donorEmail,
      amount: d.amount,
      message: d.message,
      anonymous: d.anonymous,
      status: d.status,
      createdAt: d.createdAt.toISOString(),
    }));
    return ok({ data: safe });
  } catch {
    return serverError();
  }
}
