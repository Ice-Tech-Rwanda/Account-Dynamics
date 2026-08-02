export function ImpactTimelineServer({ milestones }: { milestones: any[] }) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">Our Journey</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Impact Timeline</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">From small beginnings to national impact — key milestones in our story.</p>
        </div>

        <div role="list" className="space-y-8">
          {milestones.map((m) => (
            <div key={m.year} role="listitem" tabIndex={0} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <strong className="text-brand text-xl font-black">{m.year}</strong>
                <span className="text-sm text-slate-500">{m.title}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
