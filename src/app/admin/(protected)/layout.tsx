import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Server-side auth guard for all protected admin routes.
 * This layout wraps every admin page EXCEPT /admin/login.
 *
 * If the user has no valid session, they are redirected to /admin/login.
 * This runs on the SERVER before any client-side code executes.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
