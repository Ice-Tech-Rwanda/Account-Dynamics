"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Send, Sparkles } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(true);
    }
  };

  return (
    <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,168,67,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.03),transparent_30%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-xl mb-6 ring-1 ring-accent/20">
            <Mail className="size-7 text-accent" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.06] tracking-[-0.04em] text-white">
            Stay Connected
          </h2>
          <p className="mt-4 text-base sm:text-lg text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
            Get weekly updates on tournaments, events, and club news delivered to your inbox.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 max-w-lg mx-auto"
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 backdrop-blur-xl px-6 py-5 border border-white/10 shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <CheckCircle className="size-5 text-accent" />
              </div>
              <p className="text-sm font-medium text-white">You&apos;re subscribed! Check your inbox for the next update.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-emerald-300" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-emerald-300/50 focus:border-accent/50 focus:ring-accent/20 backdrop-blur-md shadow-lg"
                />
              </div>
              {error && (
                <p className="text-xs text-red-400 text-center sm:col-span-2">Something went wrong. Try again later.</p>
              )}
              <Button
                type="submit"
                variant="accent"
                className="h-12 rounded-xl gap-2.5 px-6 shadow-xl shadow-accent/25 font-bold text-base"
              >
                Subscribe <Send className="size-3.5" />
              </Button>
            </form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-2 text-[11px] text-emerald-200/50"
        >
          <Sparkles className="size-3" /> No spam, unsubscribe anytime. We publish bi-weekly updates.
        </motion.div>
      </div>
    </section>
  );
}
