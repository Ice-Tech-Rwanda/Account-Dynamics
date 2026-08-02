import { rankingsService } from "@/domains/rankings/service.server";
import RankingsContent from "./RankingsContent";

export const metadata = {
  title: "Rankings",
  description: "View player rankings, ratings, and player profiles. Leaderboard, rating history, and tournament standings.",
  openGraph: { title: "Rankings", description: "Top players and their ratings", images: ["/og/rankings.jpg"] },
};

export default async function RankingsPage() {
  const [rankings, playerProfiles] = await Promise.all([
    rankingsService.getRankings(200),
    rankingsService.getProfiles(100),
  ]);

  return (
    <>
      {/* JSON-LD structured data for top players to help search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: rankings.slice(0, 10).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/players/${p.playerId}`,
              name: p.playerName,
            })),
          }),
        }}
      />
      <RankingsContent rankings={rankings} playerProfiles={playerProfiles} />
    </>
  );
}