"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Send } from "lucide-react";

interface EventRegistrationFormProps {
  price?: number
  currentParticipants?: number
  maxParticipants?: number
}

export function EventRegistrationForm({ price, currentParticipants = 0, maxParticipants = 0 }: EventRegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sticky top-24">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">You&apos;re Registered!</h3>
        <div className="text-center py-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 mb-3">
            <Check className="size-5 text-brand" />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">Registration confirmed!</p>
          <p className="text-xs text-slate-500 mt-1">We&apos;ve sent details to {email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sticky top-24">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Register for This Event</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
            placeholder="your@email.com"
          />
        </div>
        <Button type="submit" variant="brand" className="w-full rounded-xl text-xs h-9 gap-1.5">
          <Send className="size-3.5" /> Register Now
        </Button>
        {price && (
          <p className="text-[10px] text-slate-400 text-center">Entry fee: RWF {price.toLocaleString()}</p>
        )}
        <p className="text-[10px] text-slate-400 text-center">
          {currentParticipants}/{maxParticipants} spots filled
        </p>
      </form>
    </div>
  );
}
