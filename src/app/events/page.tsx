import Link from "next/link";
import { ArrowRight, Calendar, Trophy, GraduationCap, School, BookOpen } from "lucide-react";
import { eventsService } from "@/domains/events/service.server";
import { EventHero } from "@/domains/events/components/EventHero";
import { EventFiltersClient } from "@/domains/events/components/EventFiltersClient";
import { EventCard } from "@/domains/events/components/EventCard";
import { EventCalendar } from "@/domains/events/components/EventCalendar";
import { EventTimeline } from "@/domains/events/components/EventTimeline";

const catIconMap: Record<string, React.ElementType> = {
  Calendar, Trophy, GraduationCap, School, BookOpen,
};

export default async function EventsPage(props: { searchParams?: Promise<Record<string, string | string[]>> }) {
  const searchParams = await props.searchParams;
  const params = new URLSearchParams(typeof searchParams === 'object' ? Object.entries(searchParams as Record<string,string>).map(([k,v])=>[k, String(v)]) : undefined);
  const page = Number(params.get('page') || '1');
  const limit = Number(params.get('limit') || '10');
  const q = (params.get('q') || params.get('search') || '').toString();
  const categoryFilter = (params.get('category') || '').toString();

  const [eventsResult, categories, pastEventsResult] = await Promise.all([
    eventsService.list({ page, limit, search: q || undefined, category: categoryFilter || undefined, status: 'upcoming' }),
    eventsService.getCategories(),
    eventsService.list({ page: 1, limit: 20, status: 'completed' }),
  ]);

  const upcomingEvents = (eventsResult.events ?? []).map((e: any) => ({ ...e, startDate: e.startDate, endDate: e.endDate }));
  const pastEvents = (pastEventsResult.events ?? []).map((e: any) => ({ ...e, startDate: e.startDate, endDate: e.endDate }));
  const totalParticipants = upcomingEvents.reduce((s: number, e: any) => s + (e.currentParticipants || 0), 0);

  const structuredEvents = upcomingEvents.map((e) => ({
    "@type": "Event",
    name: e.title,
    startDate: e.startDate,
    endDate: e.endDate || undefined,
    location: { "@type": "Place", name: e.location },
    description: e.description,
    url: `/events/${e.slug}`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: structuredEvents.map((ev, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: ev,
    })),
  };

  const currentParams = params;
  const feedJsonUrl = `/api/events/feed/json?${currentParams.toString()}`;
  const feedIcalUrl = `/api/events/feed/ical?${currentParams.toString()}`;

  const hasNext = upcomingEvents.length === Number(params.get('limit') || String(10));
  const hasPrev = Number(params.get('page') || '1') > 1;

  return (
    <div className="overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EventHero upcomingCount={upcomingEvents.length} pastCount={pastEvents.length} totalParticipants={totalParticipants} />

      <div className="max-w-6xl mx-auto mt-4 px-4 flex items-center justify-end gap-3">
        <a href={feedJsonUrl} className="text-xs text-slate-500 hover:underline">Events JSON Feed</a>
        <a href={feedIcalUrl} className="text-xs text-slate-500 hover:underline">Subscribe (.ics)</a>
      </div>

      {/* Upcoming Events */}
      <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Events</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
                Upcoming Events
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl">
                Register now for upcoming events and secure your spot.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <EventFiltersClient categories={categories} />
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="size-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="mt-3 text-sm text-slate-500">No events match your filters.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {hasPrev ? (
              <a href={`/events?${new URLSearchParams(Array.from(currentParams.entries())).toString().replace(/(^|&)page=\d+/,'').concat(currentParams.toString() ? `&page=${Math.max(1, Number(params.get('page') || '1') - 1)}` : `page=${Math.max(1, Number(params.get('page') || '1') - 1)}`)}`} className="px-3 py-2 rounded-md border text-sm">Previous</a>
            ) : (
              <span className="px-3 py-2 rounded-md border text-sm opacity-50">Previous</span>
            )}

            <span className="text-sm text-slate-600">Page {params.get('page') || '1'}</span>

            {hasNext ? (
              <a href={`/events?${new URLSearchParams(Array.from(currentParams.entries())).toString().replace(/(^|&)page=\d+/,'').concat(currentParams.toString() ? `&page=${Number(params.get('page') || '1') + 1}` : `page=2`)}`} className="px-3 py-2 rounded-md border text-sm">Next</a>
            ) : (
              <span className="px-3 py-2 rounded-md border text-sm opacity-50">Next</span>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Categories</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Event Types
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              We organize events for every level of player.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((cat) => {
              const Icon = catIconMap[cat.icon] || Calendar;
              return (
                <Link
                  key={cat.id}
                  href={`/events?category=${cat.slug}`}
                  className="group relative rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 text-center hover:border-brand/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 mb-3 group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/20 transition-all duration-300">
                    <Icon className="size-4 sm:size-5 text-brand group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="mt-2 inline-flex text-[10px] font-bold text-brand">{cat.count} events</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calendar + Timeline */}
      <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Schedule</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Event Calendar & Timeline
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Plan your Scrabble season with our interactive calendar.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <EventCalendar events={upcomingEvents} />
            <EventTimeline events={upcomingEvents} />
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Archive</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
                Past Events
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Relive the highlights from our previous events.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {pastEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/gallery">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-soft transition-colors">
                View event photos in our gallery <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
