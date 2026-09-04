import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";
import { logAudit } from "@/lib/audit";
import { validateFile, processUpload } from "@/lib/uploads/handler";

// The Blob upload handler uses Node-only APIs (fs/path, sharp) and reads the
// server-only BLOB_READ_WRITE_TOKEN from process.env at request time. Pin the
// route to the Node.js runtime so the token is always available and the
// @vercel/blob SDK runs on Node, not the Edge runtime.
export const runtime = "nodejs";

export async function POST(request: Request) {
  const { session, error } = await requireRole("ADMIN");
  if (error) return error;

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const alt = formData.get("alt") as string | null;

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json({ error: "Maximum 10 files per upload" }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.ok) {
        errors.push({ filename: file.name, error: validation.error });
        continue;
      }

      try {
        const uploaded = await processUpload(file, validation.mimeType);

        const media = await prisma.media.create({
          data: {
            name: uploaded.name,
            url: uploaded.url,
            alt: alt || null,
            title: uploaded.name,
            mimeType: uploaded.mimeType,
            size: uploaded.size,
            width: uploaded.width ?? null,
            height: uploaded.height ?? null,
            uploadedById: session.user.id,
          },
        });

        results.push(media);
      } catch (err) {
        console.error("[upload] failed to process file", file.name, err);
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to process file";
        errors.push({ filename: file.name, error: msg });
      }
    }

    await logAudit({
      userId: session.user.id,
      action: "media:upload",
      entity: "Media",
      details: JSON.stringify({ uploaded: results.length, errors: errors.length }),
    });

    return NextResponse.json({
      uploaded: results,
      errors: errors.length ? errors : undefined,
    }, { status: results.length ? 201 : 400 });
  } catch (err) {
    console.error("[admin:media:upload] error", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
