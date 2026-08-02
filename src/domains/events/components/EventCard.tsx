"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight, Clock, X, Trophy } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/domains/events/domain";

const categoryColors: Record<string, string> = {
  weekly: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  social: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  university: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  workshop: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  school: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  tournament: "bg-accent/10 text-accent border-accent/20",
};

interface EventCardProps {
  event: Event
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const [showModal, setShowModal] = useState(false);
  const isPast = event.status === "completed";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
      >
        <div className="group relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="aspect-[16/9] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
            <Image
              src={event.image || "/hero/slide-1.jpg"}
              alt={event.title}
              fill
              className={`object-cover ${isPast ? "" : "group-hover:scale-105"} transition-transform duration-500`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[event.category] || "bg-slate-100 text-slate-600"}`}>
                {event.category}
              </span>
            </div>
            {!isPast && event.startDate && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-md px-2.5 py-1.5 text-center shadow-lg">
                  <span className="text-xs font-black text-brand leading-none">{new Date(event.startDate).getDate()}</span>
                  <span className="text-[9px] font-medium text-slate-500 uppercase leading-none mt-0.5">{new Date(event.startDate).toLocaleString("default", { month: "short" })}</span>
                </span>
              </div>
            )}
            {isPast && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center rounded-lg bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Completed
                </span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-[10px] text-white/80">
              <MapPin className="size-3" /> {event.location}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" /> {formatDate(event.startDate)}
                {event.endDate && ` - ${formatDate(event.endDate)}`}
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3" /> {event.currentParticipants}/{event.maxParticipants}
              </span>
            </div>

            {event.prizes && event.prizes.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-accent">
                <Trophy className="size-3" />
                <span className="truncate">{event.prizes[0]}</span>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              {!isPast && event.startDate ? (
                <CountdownTimer targetDate={event.startDate} />
              ) : (
                <span className="text-[10px] text-slate-400 italic">Event concluded</span>
              )}
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="xs"
                  className="rounded-lg text-[10px] h-7 px-2"
                  onClick={() => setShowModal(true)}
                >
                  Details
                </Button>
                <Link href={`/events/${event.slug}`}>
                  <Button variant="brand" size="xs" className="rounded-lg text-[10px] h-7 px-2 gap-1">
                    {isPast ? "Results" : "Register"} <ArrowRight className="size-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xl"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="size-3.5 text-slate-500" />
              </button>

              <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-4 bg-slate-100">
                <Image src={event.image || "/hero/slide-1.jpg"} alt={event.title} fill className="object-cover" sizes="500px" />
              </div>

              <span className="inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2 bg-brand/10 text-brand border-brand/20">
                {event.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{event.title}</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{event.description}</p>

              <div className="mt-4 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-brand" />
                  {formatDate(event.startDate)}{event.endDate && ` — ${formatDate(event.endDate)}`}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-accent" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-3.5 text-brand" />
                  {event.currentParticipants}/{event.maxParticipants} registered
                </div>
                {event.price && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-accent" />
                    Entry: RWF {event.price.toLocaleString()}
                  </div>
                )}
              </div>

              {event.speakers && event.speakers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Speakers</p>
                  <div className="space-y-2">
                    {event.speakers.map((s) => (
                      <div key={s.id} className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative flex-shrink-0">
                          <Image src={s.avatar || "/placeholder.svg"} alt={s.name} fill className="object-cover" sizes="28px" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-900 dark:text-white">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.schedule && event.schedule.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Schedule</p>
                  <div className="space-y-1.5">
                    {event.schedule.map((s, _i) => (
                      <div key={s.id} className="flex gap-2.5 text-xs">
                        <span className="flex-shrink-0 w-10 text-brand font-medium text-[10px]">{s.time}</span>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-[11px]">{s.title}</p>
                          {s.speaker && <p className="text-[10px] text-slate-400">by {s.speaker}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <Link href={`/events/${event.slug}`} className="flex-1">
                  <Button variant="brand" className="w-full rounded-xl text-xs h-9 gap-1">
                    {isPast ? "View Results" : "Register Now"} <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="rounded-xl text-xs h-9" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}