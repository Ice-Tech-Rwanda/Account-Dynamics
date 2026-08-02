import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Clock } from "lucide-react";
import { eventsService } from "@/domains/events/service.server";
import { EventRegistrationForm } from "@/domains/events/components/EventRegistrationForm";
import { formatDate } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  weekly: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  social: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  university: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  workshop: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  school: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

export default async function EventDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const event = await eventsService.getBySlug(slug);

  if (!event) notFound();

  const isPast = event.status === "completed";

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={event.image || "/hero/slide-1.jpg"} alt={event.title} fill className="object-cover" priority sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_50%)]" />

        <div className="relative z-10 w-full px-4 pt-20 pb-12">
          <div className="max-w-5xl mx-auto">
            <Link href="/events" className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="size-3.5" /> Back to Events
            </Link>
            <div className="max-w-3xl">
              <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-3 ${categoryColors[event.category] || "bg-slate-100 text-slate-600"}`}>
                {event.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.06] tracking-[-0.03em] text-white">
                {event.title}
              </h1>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-accent" />{formatDate(event.startDate)}{event.endDate && ` — ${formatDate(event.endDate)}`}</span>
                <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-accent" />{event.location}</span>
                <span className="flex items-center gap-1.5"><Users className="size-3.5 text-accent" />{event.currentParticipants}/{event.maxParticipants} registered</span>
                {event.price != null && <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-accent" />RWF {event.price.toLocaleString()}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">About This Event</h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4">Speakers</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {event.speakers.map((speaker) => (
                    <div
                      key={speaker.id}
                      className="flex items-start gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                    >
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 relative flex-shrink-0 ring-2 ring-slate-100 dark:ring-slate-800">
                        <Image src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{speaker.name}</h4>
                        <p className="text-[11px] text-brand font-medium">{speaker.role}</p>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{speaker.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4">Schedule</h2>
                <div className="relative">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-4">
                    {event.schedule.map((item) => (
                      <div
                        key={item.id}
                        className="relative flex gap-4"
                      >
                        <div className="relative z-10 flex-shrink-0 mt-1">
                          <div className="h-4 w-4 rounded-full border-2 border-brand bg-white dark:bg-slate-900 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                          </div>
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-brand uppercase">{item.time}</span>
                            {item.speaker && <span className="text-[10px] text-slate-400">— {item.speaker}</span>}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.title}</h4>
                          {item.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Prizes */}
            {event.prizes && event.prizes.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4">Prizes</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {event.prizes.map((prize, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-3">
                      <Trophy className="size-5 text-accent flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">{prize}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800"
                    >
                      <Image src={img} alt={`${event.title} photo ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, 33vw" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {!isPast && (
              <EventRegistrationForm
                price={event.price ?? undefined}
                currentParticipants={event.currentParticipants ?? 0}
                maxParticipants={event.maxParticipants ?? 0}
              />
            )}

            {/* Quick Info */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Event Info</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="size-3.5 text-brand flex-shrink-0" />
                  <span className="text-slate-500">{formatDate(event.startDate)}{event.endDate && ` — ${formatDate(event.endDate)}`}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="size-3.5 text-accent flex-shrink-0" />
                  <span className="text-slate-500">{event.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="size-3.5 text-brand flex-shrink-0" />
                  <span className="text-slate-500">{event.currentParticipants}/{event.maxParticipants} participants</span>
                </div>
                {event.price != null && (
                  <div className="flex items-center gap-2.5">
                    <Clock className="size-3.5 text-accent flex-shrink-0" />
                    <span className="text-slate-500">RWF {event.price.toLocaleString()} entry</span>
                  </div>
                )}
              </div>

              {event.speakers && event.speakers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Speakers</p>
                  <div className="space-y-2">
                    {event.speakers.map((s) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative flex-shrink-0">
                          <Image src={s.avatar || "/placeholder.svg"} alt={s.name} fill className="object-cover" sizes="24px" />
                        </div>
                        <div className="truncate">
                          <p className="text-[11px] font-medium text-slate-900 dark:text-white truncate">{s.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{s.role}</p>
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
  );
}
