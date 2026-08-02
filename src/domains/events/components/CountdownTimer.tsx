"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  targetDate: string
}

function pad(n: number) { return n.toString().padStart(2, "0") }

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calc = useCallback(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }, [targetDate]);

  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate, calc]);

  const items = [
    { label: "Days", value: t.days },
    { label: "Hrs", value: t.hours },
    { label: "Min", value: t.minutes },
    { label: "Sec", value: t.seconds },
  ];

  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-lg sm:text-xl font-black text-brand leading-none">{pad(item.value)}</span>
          <span className="text-[8px] uppercase tracking-wider text-slate-400 mt-0.5">{item.label}</span>
        </div>
      ))}
    </div>
  );
}