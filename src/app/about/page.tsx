import { contentService } from "@/domains/content/service.server"
import { teamService } from "@/domains/team/service.server"
import type { HistoryMilestone, CoreValue, Benefit, JourneyMilestone, ContactInfo } from "@/domains/content/domain"
import type { TeamMember } from "@/domains/team/domain"
import { AboutHero } from "@/domains/content/components/AboutHero"
import { HistoryTimeline } from "@/domains/content/components/HistoryTimeline"
import { MissionVisionValues } from "@/domains/content/components/MissionVisionValues"
import { LeadershipTeam } from "@/domains/content/components/LeadershipTeam"
import { ClubJourney } from "@/domains/content/components/ClubJourney"
import { WhyScrabble } from "@/domains/content/components/WhyScrabble"
import { ContactSection } from "@/domains/content/components/ContactSection"
import { siteConfig } from "@/lib/site"

export const metadata = {
  title: "About Us",
  description: "Learn about our mission, history, leadership team, and how to get involved.",
  openGraph: {
    title: "About Us",
    description: "Learn about our mission, history, leadership team, and how to get involved.",
    url: "/about",
  },
};

export default async function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl;

  const [
    historySection,
    coreValuesSection,
    journeySection,
    benefitsSection,
    contactSection,
    teamResult,
  ] = await Promise.all([
    contentService.getSection("historyMilestones"),
    contentService.getSection("coreValues"),
    contentService.getSection("journeyMilestones"),
    contentService.getSection("benefits"),
    contentService.getSection("contactInfo"),
    teamService.list({ limit: 50 }),
  ]);

  const milestones = (historySection?.content ?? []) as HistoryMilestone[];
  const coreValues = (coreValuesSection?.content ?? []) as CoreValue[];
  const journeyMilestones = (journeySection?.content ?? []) as JourneyMilestone[];
  const benefits = (benefitsSection?.content ?? []) as Benefit[];
  const contactInfo = (contactSection?.content ?? {
    email: siteConfig.email,
    phone: siteConfig.phone,
    address: siteConfig.location,
    whatsapp: siteConfig.whatsapp,
  }) as ContactInfo;
  const teamMembers = teamResult.data as TeamMember[];

  const people = teamMembers.map((m) => ({
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    image: siteUrl + m.avatar,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
    logo: siteUrl + "/logo.png",
    member: people,
  };

  return (
    <div className="overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <AboutHero />
      <HistoryTimeline milestones={milestones} />
      <MissionVisionValues coreValues={coreValues} />
      <LeadershipTeam teamMembers={teamMembers} />
      <ClubJourney milestones={journeyMilestones} />
      <WhyScrabble benefits={benefits} />
      <ContactSection contactInfo={contactInfo} />
    </div>
  );
}
