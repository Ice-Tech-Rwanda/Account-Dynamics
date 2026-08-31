import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSignedToken } from "@/lib/uploads/signer";
import { requireRole } from "@/lib/admin/api-registry";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  const { id } = await params;

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const token = generateSignedToken(media.url, 3600);
    const signedUrl = `${media.url}?token=${token}`;

    return NextResponse.json({ url: signedUrl, expires: Date.now() + 3600000 });
  } catch {
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}
