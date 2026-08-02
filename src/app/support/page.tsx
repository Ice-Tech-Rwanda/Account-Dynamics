import { supportService } from "@/domains/support/service.server"
import { DonationHero } from "@/domains/support/components/DonationHero";
import { ImpactVisualization } from "@/domains/support/components/ImpactVisualization";
import { DonationTypes } from "@/domains/support/components/DonationTypes";
import { SponsorshipPackages } from "@/domains/support/components/SponsorshipPackages";
import { DonorWall } from "@/domains/support/components/DonorWall";
import { DonationForm } from "@/domains/support/components/DonationForm";

export const metadata = {
  title: "Support Us",
  description: "Help fund tournaments, school programs, and community initiatives. Make a secure donation today.",
  openGraph: {
    title: "Support Us",
    description: "Make a donation today.",
    url: "/support",
  },
}

export default async function SupportPage() {
  const [donationSummary, sponsorshipPackages, donors] = await Promise.all([
    supportService.getDonationSummary(),
    supportService.getSponsorshipPackages(),
    supportService.getDonors(),
  ]);

  return (
    <main>
      <DonationHero summary={donationSummary} />
      <ImpactVisualization />
      <DonationTypes />
      <SponsorshipPackages packages={sponsorshipPackages} />
      <DonorWall donors={donors} />
      <DonationForm />
    </main>
  );
}
