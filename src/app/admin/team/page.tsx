import { auth } from "@/lib/auth";
import AdminTeamClient from "@/components/admin/AdminTeamClient";

export default async function AdminTeamPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return <div className="py-20 text-center">Unauthorized</div>;

  return (<AdminTeamClient />);
}
