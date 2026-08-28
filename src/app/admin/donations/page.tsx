import { redirect } from "next/navigation";
import AdminDonationsClient from "../../../components/admin/AdminDonationsClient";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import logger from "../../../lib/logger";

export const dynamic = "force-dynamic";

async function loadDonations() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/auth/login");

  const donations = await prisma.donation.findMany({ orderBy: { createdAt: "desc" } });
  // Mask donor PII for anonymous donations.
  return donations.map((d) => ({
    id: d.id,
    donorName: d.anonymous ? null : d.donorName,
    donorEmail: d.anonymous ? null : d.donorEmail,
    amount: d.amount,
    message: d.message,
    anonymous: d.anonymous,
    status: d.status,
    createdAt: d.createdAt.toISOString(),
  }));
}

export default async function Page() {
  let safe;
  try {
    safe = await loadDonations();
  } catch (err: any) {
    logger.error("Failed to render admin donations page", { err: String(err) });
    return <div className="p-6">Failed to load donations.</div>;
  }

  return <AdminDonationsClient initialData={safe} />;
}
