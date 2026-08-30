import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description:
    "Discover why clients trust Account Dynamics — professional expertise, personalized service, technology-enabled accounting, tax & compliance knowledge, business insight and cost-conscious advisory.",
  alternates: { canonical: "/why-choose-us" },
};

export default function WhyChooseUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
