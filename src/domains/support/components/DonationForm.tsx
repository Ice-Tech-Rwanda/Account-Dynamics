"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { donationSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";

const presetAmounts = [5000, 10000, 25000, 50000, 100000, 250000];
const fundOptions = [
  { value: "general", label: "General Donation" },
  { value: "school", label: "School Fund" },
  { value: "women", label: "Women & Girls Fund" },
  { value: "tournament", label: "Tournament Sponsorship" },
];

export function DonationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", amount: "", fund: "general", message: "", anonymous: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    const payload = {
      donorName: form.name.trim(),
      donorEmail: form.email.trim(),
      amount: Number(form.amount),
      message: form.message.trim() || null,
      anonymous: Boolean(form.anonymous),
    };

    const parsed = donationSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path.join(".")] = i.message;
      });
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.error || "Donation failed, please try again.";
        toast.error(msg);
        setSubmitting(false);
        return;
      }

      // fire a lightweight analytics event
      try { await fetch("/api/analytics/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "donation:completed", amount: payload.amount, anonymous: payload.anonymous }) }); } catch { /* ignore */ }

      toast.success("Thank you for your donation! Redirecting...");
      setForm({ name: "", email: "", amount: "", fund: "general", message: "", anonymous: false });
      // redirect to a friendly thank-you fragment or query
      router.push("/support?donation=success");
    } catch {
      toast.error("Unable to complete donation. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="donate-form" className="py-20 sm:py-28 bg-gradient-to-br from-brand-bg-dark via-brand-bg-dark-mid to-brand relative overflow-hidden">
      <div className="it-hero-glow absolute inset-0 opacity-[0.04]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3 inline-block">
            Make a Donation
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Support Our Mission
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-lg">
            Every contribution, no matter the size, helps us grow Scrabble in Rwanda
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="donorName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="donorName"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5 h-11"
                    aria-invalid={!!errors["donorName"]}
                    aria-describedby={errors["donorName"] ? "err-donorName" : undefined}
                    placeholder="Your name"
                  />
                  {errors["donorName"] && <p id="err-donorName" className="text-xs text-red-500 mt-1">{errors["donorName"]}</p>}
                </div>
                <div>
                  <Label htmlFor="donorEmail" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1.5 h-11"
                    aria-invalid={!!errors["donorEmail"]}
                    aria-describedby={errors["donorEmail"] ? "err-donorEmail" : undefined}
                    placeholder="your@email.com"
                  />
                  {errors["donorEmail"] && <p id="err-donorEmail" className="text-xs text-red-500 mt-1">{errors["donorEmail"]}</p>}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Donation Fund
                </Label>
                <select
                  value={form.fund}
                  onChange={(e) => setForm({ ...form, fund: e.target.value })}
                  className="flex mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {fundOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Amount (FRW) <span className="text-red-400">*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setForm({ ...form, amount: amt.toString() })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${form.amount === amt.toString() ? "bg-brand text-white border-brand" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand/30"}`}
                    >
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="h-11"
                  aria-invalid={!!errors["amount"]}
                  aria-describedby={errors["amount"] ? "err-amount" : undefined}
                  placeholder="Or enter custom amount"
                />
                {errors["amount"] && <p id="err-amount" className="text-xs text-red-500 mt-1">{errors["amount"]}</p>}
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Message (optional)
                </Label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="flex mt-1.5 min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                  placeholder="Share why you're supporting us..."
                />
              </div>

              <label className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.anonymous}
                  onChange={(e) => setForm({ ...form, anonymous: e.target.checked })}
                  className="rounded border-slate-300 size-4"
                />
                Make my donation anonymous
              </label>

              <div role="status" aria-live="polite" className="sr-only">
                {submitting ? "Processing donation" : ""}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                size="xl"
                className="w-full rounded-xl bg-accent hover:bg-accent-soft text-black font-bold gap-2 shadow-lg shadow-accent/25"
              >
                {submitting ? (
                  <><Loader2 className="size-4 animate-spin" /> Processing...</>
                ) : (
                  <><Heart className="size-4" /> Donate Now</>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-brand/5 border border-brand/10 flex items-start gap-3">
              <Shield className="size-5 text-brand shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your donation is secure and processed through trusted payment channels.
                You will receive a confirmation receipt via email. For questions, contact us.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
