import { impactService } from "@/domains/impact/service.server"
import { ImpactHero } from "@/domains/impact/components/ImpactHero";
import { SuccessStoriesServer } from "@/domains/impact/components/SuccessStoriesServer";
import { OutreachPrograms } from "@/domains/impact/components/OutreachPrograms";
import { YouthInitiatives } from "@/domains/impact/components/YouthInitiatives";
import { WomenInScrabble } from "@/domains/impact/components/WomenInScrabble";
import { ImpactTimelineServer } from "@/domains/impact/components/ImpactTimelineServer";
import { PhotoGalleryServer } from "@/domains/impact/components/PhotoGalleryServer";

export const metadata = {
  title: "Impact",
  description: "Community impact: success stories, outreach programs, and donation impact reports.",
};

export default async function ImpactPage() {
  const [stories, gallery, historyMilestones] = await Promise.all([
    impactService.listSuccessStories(6),
    impactService.listGalleryImages(9),
    impactService.getHistoryMilestones(),
  ]);

  return (
    <main>
      <ImpactHero />
      <SuccessStoriesServer stories={stories} />
      <OutreachPrograms />
      <YouthInitiatives />
      <WomenInScrabble />
      <ImpactTimelineServer milestones={historyMilestones} />
      <PhotoGalleryServer images={gallery} />
    </main>
  );
}
