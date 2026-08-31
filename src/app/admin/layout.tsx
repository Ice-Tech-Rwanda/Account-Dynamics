import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/layout/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Determine current path so we can skip auth gate on the login page
  const hdrs = await headers();
  const pathname =
    hdrs.get("x-matched-path") || hdrs.get("next-url") || "";
  const isLoginPage = pathname === "/admin/login" ||
    pathname.startsWith("/admin/login?");

  // Server-side auth gate — defense-in-depth in case middleware is bypassed
  let user = null;
  if (!isLoginPage) {
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
  }

  return (
    <AdminLayoutClient user={user ?? { name: null, email: null, role: "EDITOR" }}>
      {children}
    </AdminLayoutClient>
  );
}
