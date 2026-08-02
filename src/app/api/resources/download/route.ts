import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import fs from "fs";
import path from "path";

const MIME: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  zip: "application/zip",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

function safeJoin(base: string, target: string) {
  const targetPath = 
    path.normalize(path.join(base, target));
  if (!targetPath.startsWith(path.normalize(base))) throw new Error("Invalid path");
  return targetPath;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const resourceId = searchParams.get("resourceId");
    if (!resourceId) return NextResponse.json({ message: "resourceId required" }, { status: 400 });

    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource || !resource.fileUrl) return NextResponse.json({ message: "File not found" }, { status: 404 });

    const fileUrl: string = resource.fileUrl;

    // If the fileUrl is an external URL, proxy the request and stream it back with safe headers
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      const upstream = await fetch(fileUrl);
      if (!upstream.ok) return NextResponse.json({ message: "Upstream file unavailable" }, { status: 502 });

      const headers = new Headers(upstream.headers);
      // set download disposition and safe content-type if missing
      const ext = path.extname(new URL(fileUrl).pathname).split(".").pop() || "";
      const contentType = headers.get("content-type") || MIME[ext.toLowerCase()] || "application/octet-stream";
      headers.set("content-type", contentType);
      headers.set("content-disposition", `attachment; filename=\"${resource.slug || resource.title || resource.id}\"`);
      headers.set("x-content-proxy", "it-proxy");

      // NOTE: for virus scanning, integrate scanner here before streaming to client.

      return new NextResponse(upstream.body, { status: upstream.status, headers });
    }

    // Otherwise treat fileUrl as a local path under public/ or uploads/ (prevent path traversal)
    const publicBase = path.join(process.cwd(), "public");
    let rel = fileUrl.replace(/^\//, "");
    const abs = safeJoin(publicBase, rel);
    if (!fs.existsSync(abs)) return NextResponse.json({ message: "File not found" }, { status: 404 });

    const ext = path.extname(abs).split('.').pop() || '';
    const contentType = MIME[ext.toLowerCase()] || "application/octet-stream";
    const fileBuffer = await fs.promises.readFile(abs);

    const headers = new Headers();
    headers.set("content-type", contentType);
    headers.set("content-disposition", `attachment; filename=\"${path.basename(abs)}\"`);
    headers.set("content-length", String(fileBuffer.length));
    headers.set("x-content-proxy", "it-proxy");

    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (err) {
    logger.error("download.error", { error: String(err) });
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
