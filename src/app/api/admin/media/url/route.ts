import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";
import { logAudit } from "@/lib/audit";

const EXTENSION_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function POST(request: Request) {
  const { session, error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const body = await request.json();
    const url = (body?.url ?? "").trim();
    const alt = body?.alt?.trim() || null;

    if (!url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL. Please enter a full http(s) image URL." }, { status: 400 });
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return NextResponse.json({ error: "Only http(s) image URLs are allowed." }, { status: 400 });
    }

    // Infer the image type from the URL path; reject URLs that don't point to an image.
    const ext = parsed.pathname.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/)?.[0] ?? "";
    const mimeType = EXTENSION_MIME[ext];
    if (!mimeType) {
      return NextResponse.json({ error: "That URL does not end in a supported image extension (JPG, PNG, WEBP, GIF)." }, { status: 400 });
    }

    const name = parsed.pathname.split("/").filter(Boolean).pop() || "external-image";
    const media = await prisma.media.create({
      data: {
        name,
        url,
        alt,
        title: body?.title?.trim() || name,
        mimeType,
        size: 0,
        uploadedById: session.user.id,
      },
    });

    await logAudit({
      userId: session.user.id,
      action: "media:add_by_url",
      entity: "Media",
      entityId: media.id,
      details: JSON.stringify({ url }),
    });

    return NextResponse.json(media, { status: 201 });
  } catch (err) {
    console.error("[admin:media:url] error", err);
    return NextResponse.json({ error: "Failed to add media by URL" }, { status: 500 });
  }
}
