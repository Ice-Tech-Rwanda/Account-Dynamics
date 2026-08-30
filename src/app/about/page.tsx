import { siteConfig } from "@/lib/site";
import { getTeam } from "@/lib/content/service.server";
import { AboutHero } from "@/domains/about/components/AboutHero";
import { FounderProfile } from "@/domains/about/components/FounderProfile";
import { VisionSection } from "@/domains/about/components/VisionSection";
import { TeamGrid } from "@/domains/about/components/TeamGrid";
import { CTASection } from "@/domains/home/components/CTASection";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Account Dynamics — a Canadian accounting, tax, advisory and business analytics firm founded by Joseph P. Mathews.",
  openGraph: {
    title: "About Us | Account Dynamics",
    description:
      "Learn about Account Dynamics — a Canadian accounting, tax, advisory and business analytics firm.",
    url: "/about",
  },
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const team = await getTeam();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || siteConfig.siteUrl;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
    logo: siteUrl + "/logo.png",
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "55 Baywood Road, 2nd Floor",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      postalCode: "M9V 3Y8",
      addressCountry: "CA",
    },
    telephone: siteConfig.phone,
  };

  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutHero />
      <FounderProfile founder={team.founder} />
      <VisionSection />
      <TeamGrid members={team.members} />
      <CTASection />
    </div>
  );
}
