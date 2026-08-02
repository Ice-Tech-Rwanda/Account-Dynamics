import { JoinHero } from "@/domains/join/components/JoinHero";
import { MembershipBenefits } from "@/domains/join/components/MembershipBenefits";
import { MembershipTypes } from "@/domains/join/components/MembershipTypes";
import { VolunteerRoles } from "@/domains/join/components/VolunteerRoles";
import { ClubFeatures } from "@/domains/join/components/ClubFeatures";
import { JoinTabs } from "@/domains/join/components/JoinTabs";

export default function JoinPage() {
  return (
    <main>
      <JoinHero />
      <MembershipBenefits />
      <MembershipTypes />
      <ClubFeatures />
      <VolunteerRoles />
      <JoinTabs />
    </main>
  );
}

export const metadata = {
  title: "Join Us",
  description:
    "Become a member, volunteer, or start a club. Sign up as an individual, volunteer, school or university club.",
  openGraph: {
    title: "Join Us",
    description: "Become a member, volunteer, or start a club.",
    images: ["/hero/join-og.jpg"],
  },
}
