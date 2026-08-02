import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // NOTE: App Router multipart parsing isn't available on Edge runtime. If using Node, set runtime accordingly.
  // This is a template showing server-side validation + sharp processing.

  // Parse multipart (example for Node runtime, not Edge)
  const form = formidable({ multiples: false });

  const parseForm = (req: any) =>
    new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

  try {
    const { files } = await parseForm(req as any);
    const file = files?.file;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Validate size (<= 5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) return NextResponse.json({ error: "File too large" }, { status: 400 });

    // Validate mimetype
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });

    // Process with sharp and save to public/uploads
    const data = fs.readFileSync(file.filepath);
    const outDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const filename = `${Date.now()}-${file.originalFilename}`.replace(/[^a-zA-Z0-9._-]/g, "_");
    const outPath = path.join(outDir, filename);

    await sharp(data).resize({ width: 1600 }).toFile(outPath);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as any).message || "Upload failed" }, { status: 500 });
  }
}
