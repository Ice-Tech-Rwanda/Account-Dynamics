import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/layout/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth gate — defense-in-depth in case middleware is bypassed
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

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
