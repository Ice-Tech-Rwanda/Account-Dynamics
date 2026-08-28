import { cookies } from "next/headers";
import AdminDashboardClient from "../../../components/admin/AdminDashboardClient";
import logger from "../../../lib/logger";
import { captureError } from "../../../lib/monitoring";

export const dynamic = "force-dynamic";

async function loadDashboardData(): Promise<any | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const base = process.env.NEXTAUTH_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
    const url = new URL("/api/admin/stats", base).toString();

    // Fetch server-side and forward cookies so server auth (NextAuth) can verify session.
    const res = await fetch(url, {
      headers: { cookie: cookieHeader },
      // sensitive admin data — avoid long caching by default; adjust revalidate as needed
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "<no body>");
      logger.warn("admin stats fetch failed", { status: res.status, body });
      return null;
    }

    return await res.json();
  } catch (err: any) {
    captureError(err instanceof Error ? err : new Error(String(err)));
    logger.error("Failed to load admin dashboard data", { err: String(err) });
    return null;
  }
}

export default async function Page() {
  const data = await loadDashboardData();
  return <AdminDashboardClient data={data} />;
}
