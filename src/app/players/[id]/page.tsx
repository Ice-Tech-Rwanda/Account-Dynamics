import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { rankingsService } from "@/domains/rankings/service.server";
import { ArrowLeft, Trophy, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Player Profile",
};

export default async function PlayerDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const { profile, member } = await rankingsService.getPlayerDetail(id);

  const profileData = profile ?? member?.playerProfile;
  const memberData = member ?? profile?.member;

  if (!profileData || !memberData) notFound();

  const titles = JSON.parse(profileData.titles || "[]") as string[];
  const tournamentHistory = JSON.parse(profileData.tournamentHistory || "[]") as { id: string; tournamentName: string; date: string; position: number; prize?: string }[];
  const achievements = JSON.parse(profileData.achievements || "[]") as { id: string; title: string; date: string; icon: string }[];

  const name = memberData.name;
  const avatar = "/team/placeholder.jpg";

  const ranking = member?.ranking ?? null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Link
          href="/rankings"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Rankings
        </Link>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="relative h-40 sm:h-48 bg-gradient-to-br from-brand/20 to-accent/10" />
          <div className="relative px-6 pb-6 -mt-16">
            <div className="flex items-end gap-5 mb-6">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-800 shadow-lg">
                <Image src={avatar} alt={name} fill className="object-cover" sizes="112px" loading="eager" />
              </div>
              <div className="flex-1 pt-12">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{name}</h1>
                <p className="text-sm text-accent font-medium">{memberData.category === "admin" ? "Admin" : memberData.category === "volunteer" ? "Volunteer" : "Player"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Rating", value: ranking?.rating ?? (memberData as any).rating ?? 0, color: "text-accent" },
                { label: "Rank", value: ranking ? `#${ranking.rank}` : "#--", color: "text-brand" },
                { label: "Win Rate", value: ranking ? `${Math.round(ranking.winRate ?? 0)}%` : "0%", color: "text-blue-500" },
                { label: "Tournaments", value: profileData.totalTournaments, color: "text-purple-500" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className={`text-lg sm:text-xl font-black ${stat.color} mt-0.5`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Career Stats</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: "Games Played", value: ranking?.gamesPlayed ?? memberData.gamesPlayed ?? 0 },
                      { label: "Wins", value: ranking?.wins ?? memberData.wins ?? 0 },
                      { label: "Losses", value: ranking?.losses ?? (memberData.gamesPlayed ? (memberData.gamesPlayed - (memberData.wins ?? 0)) : 0) },
                      { label: "Best Word", value: profileData.bestWord || "—", highlight: true },
                      { label: "Best Score", value: profileData.bestScore ?? "—" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-[11px] text-slate-500">{s.label}</span>
                        <span className={`text-xs font-bold ${s.highlight ? "text-accent" : "text-slate-900 dark:text-white"}`}>
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {titles.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Titles</h3>
                    <div className="space-y-2">
                      {titles.map((title, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg border border-accent/10 bg-gradient-to-r from-accent/5 to-transparent px-3 py-2">
                          <Trophy className="size-3.5 text-accent flex-shrink-0" />
                          <span className="text-xs font-medium text-slate-900 dark:text-white">{title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {achievements.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Achievements</h3>
                    <div className="grid gap-2">
                      {achievements.map((a) => (
                        <div key={a.id} className="flex items-center gap-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 px-3 py-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10">
                            <Trophy className="size-3.5 text-brand" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-900 dark:text-white">{a.title}</p>
                            <p className="text-[10px] text-slate-400">{formatDate(a.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {tournamentHistory.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tournament History</h3>
                    <div className="space-y-2">
                      {tournamentHistory.map((t) => (
                        <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-200/60 dark:border-slate-800 px-3 py-2">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{t.tournamentName}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="size-2.5" /> {formatDate(t.date)}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-3">
                            <span className={`inline-flex items-center justify-center h-5 min-w-[1.25rem] rounded text-[10px] font-bold ${
                              t.position === 1 ? "bg-accent/15 text-accent" :
                              t.position <= 3 ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300" :
                              "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            }`}>
                              #{t.position}
                            </span>
                            {t.prize && <p className="text-[10px] text-accent font-medium mt-0.5">{t.prize}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
