"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Event } from "@/domains/events/domain";

interface EventTimelineProps {
  events: Event[]
}

export function EventTimeline({ events }: EventTimelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sorted = [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />

      <div className="space-y-6">
        {sorted.map((event, i) => {
          const date = new Date(event.startDate);
          const isActive = activeId === event.id;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                onClick={() => setActiveId(isActive ? null : event.id)}
                className="group relative flex items-start gap-4 w-full text-left"
              >
                <div className="relative z-10 flex-shrink-0 mt-1">
                  <div className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                    isActive ? "border-brand bg-brand scale-125" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-brand"
                  }`} />
                </div>
                <div className={`flex-1 rounded-xl border p-3 sm:p-4 transition-all duration-300 ${
                  isActive
                    ? "border-brand/40 bg-brand/5 dark:bg-brand/10 shadow-md"
                    : "border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand/30 hover:shadow-sm"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                        {date.toLocaleString("default", { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{event.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{event.location}</p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      event.status === "upcoming" ? "bg-brand/10 text-brand" : "bg-slate-100 text-slate-500"
                    }`}>
                      {event.currentParticipants}/{event.maxParticipants}
                    </span>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {event.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}