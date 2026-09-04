import { NextResponse } from "next/server";
import { requireRole } from "@/lib/admin/api-registry";
import { getBlobConfigStatus } from "@/lib/uploads/config";

/**
 * Server-only diagnostic endpoint: reports whether Vercel Blob storage is
 * configured in the current runtime WITHOUT ever exposing the token value.
 * Use this to confirm whether the deployed function can see BLOB_READ_WRITE_TOKEN.
 */
export const runtime = "nodejs";

export async function GET() {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const status = getBlobConfigStatus();

  return NextResponse.json({
    blobConfigured: status.configured,
    backend: status.backend,
    runtime: "nodejs",
    vercel: process.env.VERCEL === "1",
    nodeEnv: process.env.NODE_ENV,
    // NOTE: never include process.env.BLOB_READ_WRITE_TOKEN here.
  });
}
