import { auth } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/layout/AdminLayoutClient";

/**
 * Common admin layout. Wraps ALL admin routes including login.
 * Auth gating is handled by the (protected) route group layout.
 * This layout only enriches the client layout with session data.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    // Auth library error — treat as unauthenticated
  }

  return (
    <AdminLayoutClient user={user ?? { name: null, email: null, role: "EDITOR" }}>
      {children}
    </AdminLayoutClient>
  );
}
