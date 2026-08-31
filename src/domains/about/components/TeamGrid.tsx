"use client";

import type { TeamMember } from "@/lib/content/types";
import { TeamAvatar, type TeamSlug } from "@/domains/team/components/TeamAvatar";

const slugByName: Record<string, TeamSlug> = {
  "Joseph P. Mathews": "founder",
  Rishi: "rishi",
  Amrit: "amrit",
  Yogesh: "yogesh",
  Hari: "hari",
  Nikhil: "nikhil",
};

interface TeamGridProps {
  members: TeamMember[];
}

export function TeamGrid({ members }: TeamGridProps) {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-4">
            Our Team
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Meet the People Behind Account Dynamics
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Our experienced team of accounting professionals is dedicated to
            delivering exceptional service to every client.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => {
            const slug = slugByName[member.name] ?? "founder";
            return (
              <div
                key={member.name}
                className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-brand/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4">
                  <TeamAvatar slug={slug} size={64} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {member.name}
                </h3>
                <p className="text-sm text-brand font-medium">{member.role}</p>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4">
                  {member.bio}
                </p>
                {member.expertise.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {member.expertise.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="inline-block px-2 py-0.5 text-[10px] font-medium bg-brand/5 dark:bg-brand/10 text-brand rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
