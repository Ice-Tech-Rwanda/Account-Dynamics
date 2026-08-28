import type { NextRequest } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { verifySignedToken } from "@/lib/uploads/signer";
import { auth } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/api-helpers";

export const runtime = "nodejs";

const parseForm = (req: any) =>
  new Promise<{ fields: any; files: any }>((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const { fields, files } = await parseForm(req as any);
    const file = files?.file;
    const token = fields?.token as string;
    const filename = fields?.filename as string || (file?.originalFilename ?? `upload-${Date.now()}`);

    if (!token || !verifySignedToken(filename, token)) return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401, headers: { "Content-Type": "application/json" } });

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) return new Response(JSON.stringify({ error: "File too large" }), { status: 400, headers: { "Content-Type": "application/json" } });

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) return new Response(JSON.stringify({ error: "Unsupported file type" }), { status: 400, headers: { "Content-Type": "application/json" } });

    const data = fs.readFileSync(file.filepath);
    const outDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const safeName = `${Date.now()}-${filename}`.replace(/[^a-zA-Z0-9._-]/g, "_");
    const outPath = path.join(outDir, safeName);

    // Optimize/rescale with sharp
    await sharp(data).resize({ width: 1600 }).toFile(outPath);

    const url = `/uploads/${safeName}`;
    return new Response(JSON.stringify({ url }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch {
    return serverError();
  }
}
