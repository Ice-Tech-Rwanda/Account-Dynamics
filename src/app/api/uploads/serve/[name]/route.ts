import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await params;
    const width = Number(request.nextUrl.searchParams.get("w")) || null;
    const outDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(outDir, name);
    if (!fs.existsSync(filePath)) return new Response(null, { status: 404 });

    const raw = fs.readFileSync(filePath);
    const buffer = width
      ? await sharp(raw).resize({ width }).toBuffer()
      : raw;

    const headers = new Headers();
    headers.set("Content-Type", getContentType(name));
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(buffer as BodyInit, { status: 200, headers });
  } catch {
    return new Response(null, { status: 500 });
  }
}

function getContentType(name: string) {
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}
