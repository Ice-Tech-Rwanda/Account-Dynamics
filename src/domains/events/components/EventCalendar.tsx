"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "@/domains/events/domain";

interface EventCalendarProps {
  events: Event[]
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());

  // accessibility: keyboard navigation and description id
  const descId = 'event-calendar-desc';
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
    if (e.key === 'Home') { setMonth(0); setYear(y => y); }
    if (e.key === 'End') { setMonth(11); setYear(y => y); }
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) };

  const eventDays = useMemo(() => {
    const map: Record<number, Event[]> = {};
    events.forEach((ev) => {
      const d = new Date(ev.startDate);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(ev);
      }
      if (ev.endDate) {
        const end = new Date(ev.endDate);
        if (end.getMonth() === month && end.getFullYear() === year && end.getDate() !== d.getDate()) {
          for (let i = d.getDate() + 1; i <= end.getDate(); i++) {
            if (!map[i]) map[i] = [];
            if (!map[i].find(e => e.id === ev.id)) map[i].push(ev);
          }
        }
      }
    });
    return map;
  }, [month, year, events]);

  const cells: { day: number; events: Event[] }[] = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: 0, events: [] });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, events: eventDays[d] || [] });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
      role="region"
      aria-labelledby="event-calendar-title"
      aria-describedby={descId}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <button onClick={prev} aria-label="Previous month" className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
          <ChevronLeft className="size-4 text-slate-500" />
        </button>
        <span id="event-calendar-title" className="text-sm font-bold text-slate-900 dark:text-white">
          {monthName} {year}
        </span>
        <span id={descId} className="sr-only">Use left and right arrow keys to change month; days with events are focusable.</span>
        <button onClick={next} className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
          <ChevronRight aria-label="Next month" className="size-4 text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
            {d}
          </div>
        ))}
        {cells.map((cell, i) => (
          <div key={i} className={`min-h-[60px] sm:min-h-[72px] p-1 border-b border-r border-slate-100 dark:border-slate-800 relative ${cell.day === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}`}>
            {cell.day > 0 && (
              <>
                <div tabIndex={cell.events.length > 0 ? 0 : -1} role={cell.events.length > 0 ? 'button' : undefined} aria-label={cell.events.length > 0 ? `${cell.day} ${monthName} ${year}, ${cell.events.length} events` : `${cell.day} ${monthName} ${year}`} className="focus:outline-none">
                  <span className="text-[10px] font-medium text-slate-400">{cell.day}</span>
                  {cell.events.length > 0 && (
                    <div className="mt-0.5 space-y-0.5">
                      {cell.events.slice(0, 2).map((ev) => (
                        <div key={ev.id} className="h-1.5 rounded-full bg-brand/60" title={ev.title} />
                      ))}
                      {cell.events.length > 2 && (
                        <span className="text-[8px] text-brand font-medium">+{cell.events.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {Object.keys(eventDays).length > 0 && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Events this month</p>
          <div className="space-y-1.5">
            {[...new Set(Object.values(eventDays).flat())].map((ev) => {
              const d = new Date(ev.startDate);
              return (
                <div key={ev.id} className="flex items-center gap-2 text-xs">
                  <span className="flex-shrink-0 text-[10px] font-medium text-brand">{d.getDate()} {d.toLocaleString("default", { month: "short" })}</span>
                  <span className="truncate text-slate-700 dark:text-slate-300">{ev.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}