/**
 * Upload handler: validates, optimizes (sharp), and stores files locally.
 * Returns metadata for Prisma Media record creation.
 */
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = Number(process.env.RESOURCE_MAX_UPLOAD_BYTES ?? 5 * 1024 * 1024); // 5MB default

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const ALLOWED_DOC_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/markdown",
]);

export const ALL_ALLOWED_TYPES = new Set([...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES]);

export interface UploadResult {
  url: string;
  name: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export function validateFile(file: File): { ok: true } | { ok: false; error: string } {
  if (file.size > MAX_FILE_SIZE) {
    const maxMB = Math.round(MAX_FILE_SIZE / (1024 * 1024));
    return { ok: false, error: `File too large. Maximum size is ${maxMB}MB.` };
  }
  if (!ALL_ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: `File type "${file.type}" is not allowed.` };
  }
  return { ok: true };
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const base = sanitizeFilename(path.basename(originalName, ext));
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${base}-${timestamp}-${random}${ext}`;
}

/**
 * Process and store an uploaded file. For images, applies sharp optimization.
 * Files are stored in public/uploads/{year}/{month}/
 */
export async function processUpload(file: File): Promise<UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const now = new Date();
  const subDir = path.join("uploads", String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
  const absDir = path.join(process.cwd(), "public", subDir);
  await mkdir(absDir, { recursive: true });

  const filename = generateUniqueFilename(file.name);
  const isImage = ALLOWED_IMAGE_TYPES.has(file.type) && file.type !== "image/svg+xml";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let finalBuffer: any = buffer;
  let width: number | undefined;
  let height: number | undefined;
  let finalMime = file.type;

  if (isImage && file.type !== "image/gif") {
    // Optimize non-GIF images with sharp
    try {
      const sharp = (await import("sharp")).default;
      const image = sharp(buffer);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;

      // Resize if larger than 2048px on longest side
      const maxDim = 2048;
      if (width && height && (width > maxDim || height > maxDim)) {
        image.resize({ width: maxDim, height: maxDim, fit: "inside", withoutEnlargement: true });
        const newMeta = await image.clone().metadata();
        width = newMeta.width;
        height = newMeta.height;
      }

      // Convert to WebP for smaller size (keep original extension for URL clarity)
      finalBuffer = await image.webp({ quality: 85 }).toBuffer();
      finalMime = "image/webp";
      // Update extension to .webp
      const webpFilename = filename.replace(/\.[^.]+$/, ".webp");
      const filePath = path.join(absDir, webpFilename);
      await writeFile(filePath, finalBuffer);
      const url = `/${subDir}/${webpFilename}`;
      return { url, name: file.name, mimeType: finalMime, size: finalBuffer.length, width, height };
    } catch {
      // Fall through to raw write
    }
  }

  // Write raw file (documents, SVGs, GIFs, or if sharp failed)
  const filePath = path.join(absDir, filename);
  await writeFile(filePath, finalBuffer);

  if (isImage) {
    // Get dimensions for GIFs
    try {
      const sharp = (await import("sharp")).default;
      const meta = await sharp(buffer).metadata();
      width = meta.width;
      height = meta.height;
    } catch { /* ok */ }
  }

  const url = `/${subDir}/${filename}`;
  return { url, name: file.name, mimeType: finalMime, size: finalBuffer.length, width, height };
}
