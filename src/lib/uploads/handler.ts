/**
 * Upload handler: validates files and stores them.
 *
 * Backends:
 *  - Vercel Blob (@vercel/blob) when BLOB_READ_WRITE_TOKEN is set (Vercel/production).
 *  - Local filesystem under public/uploads when Blob is not configured (local dev /
 *    self-hosted), preserving the previous behavior.
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

function isImage(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.has(file.type) && file.type !== "image/svg+xml";
}

/** Read image dimensions with sharp (best-effort, optional). */
async function imageDimensions(buffer: Buffer): Promise<{ width?: number; height?: number }> {
  try {
    const sharp = (await import("sharp")).default;
    const meta = await sharp(buffer).metadata();
    return { width: meta.width, height: meta.height };
  } catch {
    return {};
  }
}

function isBlobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Store an uploaded file and return metadata for the Media record.
 * Uses Vercel Blob when configured, otherwise the local filesystem.
 */
export async function processUpload(file: File): Promise<UploadResult> {
  const filename = generateUniqueFilename(file.name);
  const dims = isImage(file) ? await imageDimensions(Buffer.from(await file.arrayBuffer())) : {};

  if (isBlobEnabled()) {
    const { put } = await import("@vercel/blob");
    const { url } = await put(`uploads/${filename}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return { url, name: file.name, mimeType: file.type, size: file.size, ...dims };
  }

  // Local filesystem fallback (local dev / self-hosted).
  const buffer = Buffer.from(await file.arrayBuffer());
  const now = new Date();
  const subDir = path.join("uploads", String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
  const absDir = path.join(process.cwd(), "public", subDir);
  await mkdir(absDir, { recursive: true });

  let finalBuffer: Buffer = buffer;
  let finalMime = file.type;

  if (isImage(file) && file.type !== "image/gif") {
    try {
      const sharp = (await import("sharp")).default;
      const image = sharp(buffer);
      const metadata = await image.metadata();
      const maxDim = 2048;
      if (metadata.width && metadata.height && (metadata.width > maxDim || metadata.height > maxDim)) {
        image.resize({ width: maxDim, height: maxDim, fit: "inside", withoutEnlargement: true });
      }
      finalBuffer = await image.webp({ quality: 85 }).toBuffer();
      finalMime = "image/webp";
    } catch {
      // Fall through to raw write
    }
  }

  const writeName =
    finalMime === "image/webp" && filename.toLowerCase().endsWith(".webp") === false
      ? filename.replace(/\.[^.]+$/, ".webp")
      : filename;
  const filePath = path.join(absDir, writeName);
  await writeFile(filePath, finalBuffer);

  const url = `/${subDir}/${writeName}`;
  return { url, name: file.name, mimeType: finalMime, size: finalBuffer.length, width: dims.width, height: dims.height };
}
