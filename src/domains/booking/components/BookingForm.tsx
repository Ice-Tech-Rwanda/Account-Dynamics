"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, Loader2 } from "lucide-react";

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

export function BookingForm() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.service.trim()) newErrors.service = "Please select a service";
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setFormState("loading");

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
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      setFormState("success");
    } catch (err) {
      console.error("Booking form submission failed", err);
      setFormState("error");
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

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-6">
          <CheckCircle className="size-8 text-brand" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Booking Request Received!
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md">
          Thank you for choosing Account Dynamics. We&apos;ll review your
          requested time and confirm your consultation by email or phone within
          one business day.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setFormState("idle");
            setFormData({
              name: "",
              email: "",
              phone: "",
              service: "",
              date: "",
              time: "",
              notes: "",
            });
          }}
        >
          Make Another Booking
        </Button>
      </div>
    );
  }

  const inputClass = (error?: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors ${
      error ? "border-red-400" : "border-slate-200 dark:border-slate-700"
    }`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        Book a Consultation
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Choose a service and a preferred time, and we&apos;ll confirm the
        details with you shortly.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
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
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
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
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
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

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Preferred Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={inputClass()}
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Preferred Time
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={inputClass()}
            >
              <option value="">Select a time...</option>
              {timeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Notes / Details
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            className={`${inputClass()} resize-none`}
            placeholder="Tell us a little about your accounting needs..."
          />
        </div>

        {formState === "error" && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          >
            We couldn&apos;t submit your booking. Please try again in a moment,
            or contact us directly by phone or email.
          </div>
        )}

        <Button
          type="submit"
          variant="brand"
          size="lg"
          disabled={formState === "loading"}
          className="w-full gap-2 rounded-xl"
        >
          {formState === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Send className="size-4" /> Request Booking
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
