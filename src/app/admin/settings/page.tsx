import { auth } from "@/lib/auth";
import { loadSettings } from "@/lib/config";
import AdminSettingsClient from "@/components/admin/AdminSettingsClient";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return <div className="py-20 text-center">Unauthorized</div>;
  }

  const settings = await loadSettings();

  return (<AdminSettingsClient initial={settings} />);
}
