import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createVerificationToken } from "@/lib/services/verification";
import { sendEmail } from "@/lib/services/email";
import { unauthorized, serverError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const body = await request.json().catch(() => ({}));
    const { memberId } = body as { memberId?: string };
    if (!memberId) return serverError();

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) return serverError();

    const token = await createVerificationToken(member.email);
    const base = process.env.NEXTAUTH_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
    const url = `${base}/api/members/verify?identifier=${encodeURIComponent(member.email)}&token=${token}`;

    await sendEmail({ to: member.email, subject: "Verify your email", text: `Click to verify: ${url}`, html: `<p>Click <a href="${url}">here</a> to verify your email.</p>` });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return serverError();
  }
}
