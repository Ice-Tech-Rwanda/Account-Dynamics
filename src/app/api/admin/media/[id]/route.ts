import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";
import { logAudit } from "@/lib/audit";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("EDITOR");
  if (error) return error;

  const { id } = await params;
  const media = await prisma.media.findUnique({
    where: { id },
    include: { uploader: { select: { id: true, name: true } } },
  });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(media);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  try {
    const media = await prisma.media.findUnique({ where: { id } });

    // Best-effort: remove the object from Vercel Blob if present.
    if (media?.url?.includes("blob.vercel-storage.com")) {
      try {
        const { del } = await import("@vercel/blob");
        await del(media.url);
      } catch { /* ignore blob deletion errors */ }
    }

    await prisma.media.delete({ where: { id } });
    await logAudit({ userId: session.user.id, action: "media:delete", entity: "Media", entityId: id });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
