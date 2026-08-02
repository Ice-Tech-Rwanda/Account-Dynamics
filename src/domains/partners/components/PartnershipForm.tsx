"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Building2, User, Mail, Phone, MessageSquare, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PartnershipForm() {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    partnershipType: "",
    interests: [] as string[],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const interestOptions = ["Tournament Sponsorship", "School Program", "Media Coverage", "Equipment Donation", "Venue Partnership", "Corporate Social Responsibility"];

  const toggleInterest = (item: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(item) ? f.interests.filter((i) => i !== item) : [...f.interests, item],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 mb-4">
          <Check className="size-6 text-brand" />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Thank You!</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          Your partnership request has been received. Our partnerships team will reach out within 2-3 business days.
        </p>
        <Button variant="outline" className="rounded-xl mt-6 text-xs" onClick={() => { setSubmitted(false); setForm({ companyName: "", contactName: "", email: "", phone: "", partnershipType: "", interests: [], message: "" }) }}>
          Submit Another Request
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Building2 className="size-3.5" /> Organization Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1 block">Company / Organization Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
              placeholder="e.g. BK Group"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1 block">Type of Organization</label>
            <select
              value={form.partnershipType}
              onChange={(e) => setForm({ ...form, partnershipType: e.target.value })}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
              required
            >
              <option value="">Select type...</option>
              <option value="corporate">Corporate</option>
              <option value="educational">Educational Institution</option>
              <option value="media">Media Organization</option>
              <option value="nonprofit">Non-Profit / NGO</option>
              <option value="government">Government Entity</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <User className="size-3.5" /> Contact Details
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1 block">Contact Person</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full h-10 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Full name"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-10 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="email@company.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1 block">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full h-10 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="+250 7XX XXX XXX"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <MessageSquare className="size-3.5" /> Partnership Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((item) => {
            const selected = form.interests.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleInterest(item)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                  selected
                    ? "border-brand bg-brand/10 text-brand shadow-sm"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {selected && <Check className="size-3" />}
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1 block">Additional Message</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full h-28 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 resize-y"
          placeholder="Tell us more about your organization and how you'd like to partner..."
        />
      </div>

      <Button type="submit" variant="brand" size="xl" className="w-full rounded-xl gap-2 text-sm">
        <Send className="size-4" /> Submit Partnership Request
      </Button>
    </form>
  );
}
