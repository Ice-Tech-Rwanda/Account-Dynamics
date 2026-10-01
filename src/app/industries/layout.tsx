import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who We Serve",
  description:
    "Global Line Safaris creates tailored safari and tour experiences for wildlife lovers, gorilla trekking travellers, families, students and cultural explorers across Rwanda and East Africa.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
