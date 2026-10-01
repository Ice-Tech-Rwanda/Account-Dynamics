import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Travel With Us",
  description:
    "Discover why travellers choose Global Line Safaris — local expertise, tailor-made itineraries, licensed guides, responsible travel and personal support from first idea to homecoming.",
  alternates: { canonical: "/why-choose-us" },
};

export default function WhyChooseUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
