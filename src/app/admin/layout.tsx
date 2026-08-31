import { auth } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/layout/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth gate is handled by middleware. This layout only enriches the
  // client layout with the session user — it never redirects itself
  // to avoid self-redirect loops (e.g. the login page is also
  // wrapped by this layout).
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
