"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Weekends (Sat/Sun) are not office days and are not bookable. */
const WEEKEND_DAYS = [0, 6];

interface BookingCalendarProps {
  value: string | null;
  onChange: (isoDate: string) => void;
  /** Number of bookable days visible from today. Defaults to ~8 weeks. */
  lookaheadDays?: number;
}

export function BookingCalendar({
  value,
  onChange,
  lookaheadDays = 60,
}: BookingCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(new Date(today))
  );

  // Build the set of bookable ISO dates (weekdays only, within the lookahead window).
  const bookableDates = useMemo(() => {
    const set = new Set<string>();
    const lastDay = addDays(today, lookaheadDays);
    for (let d = addDays(today, 1); d <= lastDay; d = addDays(d, 1)) {
      if (WEEKEND_DAYS.includes(d.getDay())) continue;
      set.add(toIso(d));
    }
    return set;
  }, [today, lookaheadDays]);

  // First weekday offset for the current view month (Sunday-based).
  const gridStartOffset = useMemo(
    () => startOfMonth(viewMonth).getDay(),
    [viewMonth]
  );

  const daysInMonth = daysIn(viewMonth);
  const cells: Array<{ day: number; date: Date | null }> = [];
  for (let i = 0; i < gridStartOffset; i++) cells.push({ day: 0, date: null });
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    cells.push({ day, date });
  }

  const canGoNext = viewMonth < startOfMonth(addDays(today, lookaheadDays));
  const canGoPrev = viewMonth > startOfMonth(today);

  function prevMonth() {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="inline-flex items-center justify-center size-8 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
          {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          aria-label="Next month"
          className="inline-flex items-center justify-center size-8 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-1"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell.date) return <div key={`empty-${i}`} />;

          const iso = toIso(cell.date);
          const bookable = bookableDates.has(iso);
          const selected = value === iso;
          const isToday = toIso(cell.date) === toIso(today);

          return (
            <button
              key={iso}
              type="button"
              disabled={!bookable}
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              aria-label={cell.date.toDateString()}
              className={cn(
                "relative flex items-center justify-center aspect-square rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
                !bookable &&
                  "text-slate-300 dark:text-slate-600 cursor-not-allowed",
                bookable &&
                  !selected &&
                  "text-slate-700 dark:text-slate-200 hover:bg-brand/10 hover:text-brand cursor-pointer",
                selected && "bg-brand text-white shadow-md shadow-brand/20",
                isToday && bookable && !selected &&
                  "ring-1 ring-brand/40"
              )}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded bg-brand/20" /> Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded border border-slate-200 dark:border-slate-600" /> Unavailable
        </span>
      </div>
    </div>
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function daysIn(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}
function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
