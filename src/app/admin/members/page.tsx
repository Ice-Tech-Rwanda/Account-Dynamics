import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import AdminMembersClient from "../../../components/admin/AdminMembersClient";
import logger from "../../../lib/logger";

export const dynamic = "force-dynamic";

async function loadMembers() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/auth/login");

  const members = await prisma.member.findMany({ orderBy: { createdAt: "desc" }, take: 25 });
  return members.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }));
}

export default async function Page() {
  let safe;
  try {
    safe = await loadMembers();
  } catch (err: any) {
    logger.error("Failed to render admin members page", { err: String(err) });
    return <div className="p-6">Failed to load members.</div>;
  }

  return <AdminMembersClient initialData={safe} />;
}
