"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { submitErrorMessage, isDuplicateSubmit } from "@/lib/client/submit-errors";
import { Button } from "@/components/ui/button";
import {
  Send,
  CheckCircle,
  Loader2,
  Calendar,
  Clock,
  Building2,
  User,
  Mail,
  ArrowLeft,
  Info,
} from "lucide-react";
import { BookingCalendar } from "./BookingCalendar";

const serviceOptions = [
  "Small Business Accounting",
  "Personal Taxes",
  "Tax Advisory",
  "Bookkeeping",
  "Payroll",
  "Outsourcing",
  "Business Planning",
  "QuickBooks Onboarding",
  "Membership Plans",
  "Other",
];

const timeOptions = [
  "9:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 1:00 PM",
  "1:00 PM – 2:00 PM",
  "2:00 PM – 3:00 PM",
  "3:00 PM – 4:00 PM",
];

type BookingDetails = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
};

export function BookingForm() {
  const [step, setStep] = useState<"details" | "review" | "success">("details");
  const [formState, setFormState] = useState<"idle" | "loading">("idle");
  const [submitted, setSubmitted] = useState<BookingDetails | null>(null);
  const [formData, setFormData] = useState<BookingDetails>({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const idempotencyKeyRef = useRef<string | null>(null);

  function idempotencyKey() {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `f-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    return idempotencyKeyRef.current;
  }

  function formattedDate(iso: string): string {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function validateDetails() {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.service.trim()) newErrors.service = "Please select a service";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (validateDetails()) {
      setErrors({});
      setStep("review");
    }
  }

  async function handleConfirm() {
    if (formState === "loading") return;
    setFormState("loading");
    setErrors({});
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          service: formData.service,
          date: formData.date || null,
          time: formData.time || null,
          notes: formData.notes || null,
          idempotencyKey: idempotencyKey(),
        }),
      });

      if (!res.ok) {
        throw new Error(await submitErrorMessage(res, "We couldn't submit your booking. Please try again."));
      }

      if (await isDuplicateSubmit(res)) {
        // Same key already created this exact booking; treat as success.
        setSubmitted({ ...formData });
        setStep("success");
        setFormState("idle");
        return;
      }

      setSubmitted({ ...formData });
      setStep("success");
      setFormState("idle");
    } catch (err) {
      console.error("Booking form submission failed", err);
      setFormState("idle");
      setErrors({
        _form: err instanceof Error ? err.message : "We couldn't submit your booking. Please try again.",
      });
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  }

  function reset() {
    setStep("details");
    idempotencyKeyRef.current = null;
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      notes: "",
    });
    setErrors({});
    setSubmitted(null);
  }

  if (step === "success" && submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-10"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-6"
        >
          <CheckCircle className="size-8 text-brand" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Booking Confirmed!
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md">
          Your consultation request has been received. We&apos;ve sent a
          confirmation to your email and will finalize the details within one
          business day.
        </p>

        <div className="mt-8 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 p-5 text-left space-y-3">
          <SummaryRow icon={User} label="Name" value={submitted.name} />
          <SummaryRow icon={Mail} label="Email" value={submitted.email} />
          {submitted.phone && (
            <SummaryRow icon={Clock} label="Phone" value={submitted.phone} />
          )}
          <SummaryRow icon={Building2} label="Service" value={submitted.service} />
          {submitted.date && (
            <SummaryRow icon={Calendar} label="Date" value={formattedDate(submitted.date)} />
          )}
          {submitted.time && (
            <SummaryRow icon={Clock} label="Time" value={submitted.time} />
          )}
        </div>

        <Button
          variant="outline"
          className="mt-8"
          onClick={reset}
        >
          Make Another Booking
        </Button>
      </motion.div>
    );
  }

  const inputClass = (error?: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors ${
      error ? "border-red-400" : "border-slate-200 dark:border-slate-700"
    }`;

  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {step === "details" ? "Book a Consultation" : "Confirm Your Booking"}
        </h2>
        {step === "review" && (
          <button
            type="button"
            onClick={() => setStep("details")}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
          >
            <ArrowLeft className="size-3" /> Back
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {step === "details"
          ? "Choose a date and time, then review before you confirm."
          : "Review your consultation details, then confirm to book."}
      </p>

      {errors._form && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {errors._form}
        </div>
      )}

      {step === "details" ? (
        <form onSubmit={handleContinue} className="mt-8 space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={inputClass(errors.name)}
                placeholder="John Smith"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass()}
                placeholder="416-000-0000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass(errors.email)}
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="service" className={labelClass}>
              Service *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={inputClass(errors.service)}
            >
              <option value="">Select a service...</option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
          </div>

          <div>
            <label className={labelClass}>Select a Date</label>
            <BookingCalendar
              value={formData.date}
              onChange={(iso) =>
                setFormData((prev) => ({ ...prev, date: iso }))
              }
            />
          </div>

          <div>
            <label className={labelClass}>Select a Time</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {timeOptions.map((time) => {
                const active = formData.time === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, time }))
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "border-brand bg-brand text-white shadow-md shadow-brand/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand/50 hover:text-brand"
                    }`}
                  >
                    <Clock className="size-3.5" />
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notes / Details
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className={`${inputClass()} resize-none`}
              placeholder="Tell us a little about your accounting needs..."
            />
          </div>

          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="w-full gap-2 rounded-xl"
          >
            <Send className="size-4" /> Continue to Review
          </Button>
        </form>
      ) : (
        <motion.div
          key="review"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-8 space-y-5"
        >
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 p-5 space-y-3">
            <SummaryRow icon={User} label="Name" value={formData.name} />
            <SummaryRow icon={Mail} label="Email" value={formData.email} />
            {formData.phone && (
              <SummaryRow icon={Clock} label="Phone" value={formData.phone} />
            )}
            <SummaryRow icon={Building2} label="Service" value={formData.service} />
            {formData.date && (
              <SummaryRow icon={Calendar} label="Date" value={formattedDate(formData.date)} />
            )}
            {formData.time && (
              <SummaryRow icon={Clock} label="Time" value={formData.time} />
            )}
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-brand/20 bg-brand/5 dark:bg-brand/10 px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
            <Info className="size-4 text-brand shrink-0 mt-0.5" />
            <span>
              We&apos;ll email you a confirmation and finalize your exact time
              within one business day. Select &ldquo;Confirm Booking&rdquo; to
              submit.
            </span>
          </div>

          <Button
            type="button"
            variant="brand"
            size="lg"
            disabled={formState === "loading"}
            onClick={handleConfirm}
            className="w-full gap-2 rounded-xl"
          >
            {formState === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Confirming...
              </>
            ) : (
              <>
                <CheckCircle className="size-4" /> Confirm Booking
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 flex items-center justify-center text-brand">
        <Icon className="size-4" />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </div>
        <div className="text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
}
