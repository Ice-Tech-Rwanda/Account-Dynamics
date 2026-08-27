import type { TeamMember } from "@/lib/data/team";

interface FounderProfileProps {
  founder: TeamMember;
}

export function FounderProfile({ founder }: FounderProfileProps) {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-4">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {founder.name}
            </h2>
            <p className="mt-1 text-lg text-brand font-medium">
              {founder.role}
            </p>
            <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>{founder.bio}</p>
            </div>
          </div>

          {/* Expertise & Info */}
          <div>
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Areas of Expertise
              </h3>
              <ul className="space-y-3">
                {founder.expertise.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand mt-2" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Professional Background
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  Since 1999, Joseph has led Joseph Mathews &amp; Associates, and
                  in 2019, he expanded his professional endeavors by founding
                  Account Dynamics.
                </p>
                <p>
                  With over 20 years of practice, Joseph has identified a critical
                  need for advisory services that provide individuals with the
                  necessary information and understanding of the Income Tax Act.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
