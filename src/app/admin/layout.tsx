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
  return (
    <AdminLayoutClient user={{ name: null, email: null, role: "EDITOR" }}>
      {children}
    </AdminLayoutClient>
  );
}
