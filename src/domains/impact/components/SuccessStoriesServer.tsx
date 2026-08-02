import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function SuccessStoriesServer({ stories }: { stories: any[] }) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">Success Stories</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Real People, Real Impact</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">Meet the members whose lives have been transformed through {siteConfig.name}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <article key={story.id} className="group relative bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
              <div className="relative h-56 overflow-hidden">
                <Image src={story.image || `/team/placeholder.jpg`} alt={story.name} fill className="object-cover" priority={i < 2} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{story.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{story.age ? `${story.age} years old` : ''}{story.school ? ` - ${story.school}` : ''}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">“{story.story}”</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
