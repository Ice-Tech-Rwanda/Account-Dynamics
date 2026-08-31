import { auth } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/layout/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session if available (login page won't have one)
  // The middleware handles redirect for unauthenticated users
  let user = null;
  try {
    const session = await auth();
    if (session?.user) {
      user = {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      };
    }
  } catch {
    // Auth failed — middleware will handle the redirect
  }

  return <AdminLayoutClient user={user!}>{children}</AdminLayoutClient>;
}
