/**
 * Generic Admin CRUD API Registry
 *
 * Creates typed Next.js Route Handlers for any Prisma model with:
 * - RBAC gating (ADMIN+ or SUPER_ADMIN)
 * - Zod validation on create/update
 * - Pagination, search, sorting on list
 * - Audit logging on mutations
 * - Cache revalidation after content changes
 */
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import type { z } from "zod";
import { Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegistryConfig<TCreate, TUpdate> {
  /** Display name for audit logs, e.g. "ServiceCategory" */
  name: string;
  /** Zod schema for create input */
  createSchema: z.ZodType<TCreate>;
  /** Zod schema for update input (partial) */
  updateSchema: z.ZodType<TUpdate>;
  /** Minimum role required for create/update. Default: "ADMIN" */
  requiredRole?: "ADMIN" | "SUPER_ADMIN";
  /** Minimum role required for delete. Defaults to "SUPER_ADMIN" for safety. */
  deleteRole?: "ADMIN" | "SUPER_ADMIN";
  /** Minimum role required for reads (list/get). Default: "EDITOR" (any authenticated admin) */
  readRole?: "EDITOR" | "ADMIN" | "SUPER_ADMIN";
  /** Prisma model include option */
  include?: Record<string, any>;
  /** Fields searchable via ?q= query param */
  searchFields?: string[];
  /** Default orderBy for list endpoint */
  orderBy?: Record<string, string> | Record<string, string>[];
  /** Content tags to revalidate after mutations. Empty = no revalidation. */
  contentTags?: string[];
  /** Custom list filter (receives the base where clause) */
  listFilter?: (where: Record<string, any>) => Record<string, any>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROLE_RANK: Record<string, number> = { EDITOR: 1, ADMIN: 2, SUPER_ADMIN: 3 };

async function getSession(requiredRole: string = "ADMIN") {
  const session = await auth();
  if (!session?.user) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = session.user.role as string;
  if ((ROLE_RANK[role] ?? 0) < (ROLE_RANK[requiredRole] ?? 0)) {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const, session };
}

/**
 * Quick auth check for route handlers. Returns null on success,
 * or a NextResponse (401/403) on failure.
 */
export async function requireRole(requiredRole: string = "ADMIN"): Promise<{ session: any; error: null } | { session: null; error: NextResponse }> {
  const session = await auth();
  if (!session?.user) {
    console.error("[auth] No session user found");
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = session.user.role as string;
  const userRank = ROLE_RANK[role] ?? 0;
  const requiredRank = ROLE_RANK[requiredRole] ?? 0;
  if (userRank < requiredRank) {
    console.error(`[auth] Forbidden: user role=${role} (rank=${userRank}), required=${requiredRole} (rank=${requiredRank})`);
    return { session: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, error: null };
}

function parseZod<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return { success: false, error: msg };
  }
  return { success: true, data: result.data };
}

// ---------------------------------------------------------------------------
// Route handler factories
// ---------------------------------------------------------------------------

/**
 * GET /api/admin/[resource] — List with pagination, search, sort
 */
export function createListHandler<TCreate, TUpdate>(
  modelDelegate: any,
  config: RegistryConfig<TCreate, TUpdate>
) {
  return async function GET(request: Request) {
    const authCheck = await getSession(config.readRole ?? "EDITOR");
    if (!authCheck.ok) return authCheck.response;

    try {
      const { searchParams } = new URL(request.url);
      const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
      const q = searchParams.get("q")?.trim() || undefined;
      const sort = searchParams.get("sort") || "createdAt";
      const order = searchParams.get("order") === "asc" ? "asc" : "desc";
      const skip = (page - 1) * limit;

      let where: Record<string, any> = {};

      // Search
      if (q && config.searchFields?.length) {
        where.OR = config.searchFields.map((field) => ({
          [field]: { contains: q, mode: "insensitive" },
        }));
      }

      // Custom filter
      if (config.listFilter) {
        where = config.listFilter(where);
      }

      // Dynamic sort
      const orderBy: Record<string, string> = {};
      orderBy[sort] = order;

      const [data, total] = await Promise.all([
        modelDelegate.findMany({
          where,
          orderBy: config.orderBy ?? orderBy,
          skip,
          take: limit,
          ...(config.include ? { include: config.include } : {}),
        }),
        modelDelegate.count({ where }),
      ]);

      return NextResponse.json({
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error(`[admin:${config.name}] list error`, error);
      return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
    }
  };
}

/**
 * POST /api/admin/[resource] — Create
 */
export function createCreateHandler<TCreate, TUpdate>(
  modelDelegate: any,
  config: RegistryConfig<TCreate, TUpdate>
) {
  return async function POST(request: Request) {
    const authCheck = await getSession(config.requiredRole);
    if (!authCheck.ok) return authCheck.response;

    try {
      const body = await request.json();
      const parsed = parseZod(config.createSchema, body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }

      // Serialize arrays/objects to JSON strings for Prisma text fields
      const data = serializeForPrisma(parsed.data);

      const record = await modelDelegate.create({ data });

      // Audit
      await logAudit({
        userId: authCheck.session.user.id,
        action: `${config.name.toLowerCase()}:create`,
        entity: config.name,
        entityId: record.id,
        details: JSON.stringify({ created: record.id }),
      });

      // Revalidate
      if (config.contentTags?.length) {
        try {
          const { revalidateSite } = await import("@/lib/revalidate");
          revalidateSite();
        } catch { /* best-effort */ }
      }

      return NextResponse.json(record, { status: 201 });
    } catch (error: any) {
      if (error?.code === "P2002") {
        return NextResponse.json({ error: "A record with this value already exists." }, { status: 409 });
      }
      console.error(`[admin:${config.name}] create error`, error);
      return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
    }
  };
}

/**
 * GET /api/admin/[resource]/[id] — Get single
 */
export function createGetHandler<TCreate, TUpdate>(
  modelDelegate: any,
  config: RegistryConfig<TCreate, TUpdate>
) {
  return async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authCheck = await getSession(config.readRole ?? "EDITOR");
    if (!authCheck.ok) return authCheck.response;

    try {
      const { id } = await params;
      const record = await modelDelegate.findUnique({
        where: { id },
        ...(config.include ? { include: config.include } : {}),
      });

      if (!record) {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }

      return NextResponse.json(record);
    } catch (error) {
      console.error(`[admin:${config.name}] get error`, error);
      return NextResponse.json({ error: "Failed to fetch record" }, { status: 500 });
    }
  };
}

/**
 * PATCH /api/admin/[resource]/[id] — Partial update
 */
export function createUpdateHandler<TCreate, TUpdate>(
  modelDelegate: any,
  config: RegistryConfig<TCreate, TUpdate>
) {
  return async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authCheck = await getSession(config.requiredRole);
    if (!authCheck.ok) return authCheck.response;

    try {
      const { id } = await params;
      const body = await request.json();
      const parsed = parseZod(config.updateSchema, body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }

      const data = serializeForPrisma(parsed.data);
      if (Object.keys(data).length === 0) {
        return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
      }

      // Check record exists
      const existing = await modelDelegate.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }

      const record = await modelDelegate.update({ where: { id }, data });

      await logAudit({
        userId: authCheck.session.user.id,
        action: `${config.name.toLowerCase()}:update`,
        entity: config.name,
        entityId: id,
        details: JSON.stringify({ updatedFields: Object.keys(data) }),
      });

      if (config.contentTags?.length) {
        try {
          const { revalidateSite } = await import("@/lib/revalidate");
          revalidateSite();
        } catch { /* best-effort */ }
      }

      return NextResponse.json(record);
    } catch (error: any) {
      if (error?.code === "P2025") {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }
      console.error(`[admin:${config.name}] update error`, error);
      return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }
  };
}

/**
 * DELETE /api/admin/[resource]/[id] — Delete
 */
export function createDeleteHandler<TCreate, TUpdate>(
  modelDelegate: any,
  config: RegistryConfig<TCreate, TUpdate>
) {
  return async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const role = config.deleteRole ?? "SUPER_ADMIN";
    const authCheck = await getSession(role);
    if (!authCheck.ok) return authCheck.response;

    try {
      const { id } = await params;

      const existing = await modelDelegate.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }

      await modelDelegate.delete({ where: { id } });

      await logAudit({
        userId: authCheck.session.user.id,
        action: `${config.name.toLowerCase()}:delete`,
        entity: config.name,
        entityId: id,
        details: JSON.stringify({ deleted: true }),
      });

      if (config.contentTags?.length) {
        try {
          const { revalidateSite } = await import("@/lib/revalidate");
          revalidateSite();
        } catch { /* best-effort */ }
      }

      return new NextResponse(null, { status: 204 });
    } catch (error: any) {
      if (error?.code === "P2025") {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }
      console.error(`[admin:${config.name}] delete error`, error);
      return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
    }
  };
}

// ---------------------------------------------------------------------------
// Serialize helper: convert arrays/objects in data to JSON strings for
// Prisma text fields that store JSON (e.g. expertise, services, benefits)
// ---------------------------------------------------------------------------

function serializeForPrisma(data: any): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data ?? {})) {
    if (value !== undefined) {
      // Convert arrays/objects to JSON strings for Prisma text fields
      if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
        result[key] = JSON.stringify(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}
