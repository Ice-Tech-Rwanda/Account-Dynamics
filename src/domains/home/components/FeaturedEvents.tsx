"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Users, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface FeaturedEvent {
  id: string
  title: string
  slug: string
  description: string
  image?: string
  category: string
  startDate: string | Date
  location: string
  currentParticipants?: number
  maxParticipants?: number
}

export function FeaturedEvents({ events }: { events: FeaturedEvent[] }) {
  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,122,62,0.03),transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-4"
        >
          <div>
            <span className="it-kicker">Events</span>
            <h2 className="it-title">Featured Events</h2>
          </div>
          <Link
            href="/events"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand-soft transition-colors group"
          >
            View All <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="it-copy max-w-2xl mb-10"
        >
          Join us at our next event — from weekly meetups to championship tournaments.
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Calendar className="size-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No upcoming events right now.</p>
              <p className="text-sm text-slate-400 mt-1">Check back soon for new events.</p>
              <Link href="/events" className="inline-block mt-4">
                <Button variant="brand" className="rounded-xl gap-2">
                  View Past Events <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          ) : (
            events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/events/${event.slug}`} className="group block">
                  <div className="relative rounded-[1.75rem] overflow-hidden border border-slate-200/80 bg-white shadow-[0_20px_48px_rgba(0,0,0,0.06)] hover:shadow-[0_28px_64px_rgba(0,0,0,0.10)] transition-all duration-500 hover:-translate-y-1.5">
                    <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-xl border px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md border-white/20 text-slate-700 shadow-lg">
                          {event.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="inline-flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-xl px-3 py-2 text-center shadow-xl border border-white/20">
                          <span className="text-lg font-black text-brand leading-none">
                            {new Date(event.startDate).getDate()}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-500 uppercase leading-none mt-0.5">
                            {new Date(event.startDate).toLocaleString("default", { month: "short" })}
                          </span>
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-[10px] text-white/90">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3" /> {event.location?.split(",")[0] || event.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3" /> {new Date(event.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Users className="size-3" /> {event.currentParticipants}/{event.maxParticipants} registered
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand group-hover:gap-2.5 transition-all">
                          Register <ArrowRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center sm:hidden"
        >
          <Link href="/events">
            <Button variant="brand" className="rounded-xl gap-2 shadow-lg shadow-brand/20">
              View All Events <ArrowRight className="size-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
