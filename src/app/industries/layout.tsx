import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Account Dynamics serves individuals, small businesses, entrepreneurs, accounting & CPA firms and groups of companies across Canada with accounting, tax and advisory services.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
