import { describe, it, expect } from "vitest";
import { validateFile, ALL_ALLOWED_TYPES } from "@/lib/uploads/handler";

function createMockFile(name: string, type: string, size: number): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe("Upload Handler - validateFile", () => {
  it("accepts valid image files", () => {
    const file = createMockFile("photo.jpg", "image/jpeg", 1024);
    expect(validateFile(file)).toEqual({ ok: true, mimeType: "image/jpeg" });
  });

  it("accepts PNG images", () => {
    const file = createMockFile("photo.png", "image/png", 2048);
    expect(validateFile(file)).toEqual({ ok: true, mimeType: "image/png" });
  });

  it("accepts WebP images", () => {
    const file = createMockFile("photo.webp", "image/webp", 1024);
    expect(validateFile(file)).toEqual({ ok: true, mimeType: "image/webp" });
  });

  it("accepts PDF documents", () => {
    const file = createMockFile("doc.pdf", "application/pdf", 50000);
    expect(validateFile(file)).toEqual({ ok: true, mimeType: "application/pdf" });
  });

  it("infers MIME from extension when the browser sends an empty type", () => {
    const file = createMockFile("logo.png", "", 1024);
    expect(validateFile(file)).toEqual({ ok: true, mimeType: "image/png" });
  });

  it("infers JPG MIME from extension when type is empty", () => {
    const file = createMockFile("banner.jpg", "", 2048);
    const result = validateFile(file);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.mimeType).toBe("image/jpeg");
  });

  it("rejects files whose extension maps to no known type", () => {
    const file = createMockFile("data.xyz", "", 1024);
    const result = validateFile(file);
    expect(result.ok).toBe(false);
  });

  it("rejects files exceeding max size", () => {
    const file = createMockFile("huge.jpg", "image/jpeg", 10 * 1024 * 1024);
    const result = validateFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("File too large");
    }
  });

  it("rejects disallowed file types", () => {
    const file = createMockFile("script.exe", "application/x-executable", 1024);
    const result = validateFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("not allowed");
    }
  });

  it("rejects unknown MIME types", () => {
    const file = createMockFile("file.xyz", "application/x-unknown", 1024);
    const result = validateFile(file);
    expect(result.ok).toBe(false);
  });
});

describe("ALL_ALLOWED_TYPES", () => {
  it("includes common image types", () => {
    expect(ALL_ALLOWED_TYPES.has("image/jpeg")).toBe(true);
    expect(ALL_ALLOWED_TYPES.has("image/png")).toBe(true);
    expect(ALL_ALLOWED_TYPES.has("image/webp")).toBe(true);
    expect(ALL_ALLOWED_TYPES.has("image/gif")).toBe(true);
  });

  it("excludes SVG (stored-XSS risk when served same-origin)", () => {
    expect(ALL_ALLOWED_TYPES.has("image/svg+xml")).toBe(false);
  });

  it("includes common document types", () => {
    expect(ALL_ALLOWED_TYPES.has("application/pdf")).toBe(true);
    expect(ALL_ALLOWED_TYPES.has("text/plain")).toBe(true);
  });
});
