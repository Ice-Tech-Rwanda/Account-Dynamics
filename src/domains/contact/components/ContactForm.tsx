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
  "Other",
];

export function ContactForm() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.message.trim()) newErrors.message = "Message is required";
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
      const subject = [
        formData.service ? `Service: ${formData.service}` : "General Inquiry",
        formData.business ? `Company: ${formData.business}` : "",
      ]
        .filter(Boolean)
        .join(" — ")
        .slice(0, 300);

      const message = [
        formData.phone ? `Phone: ${formData.phone}` : "",
        formData.message,
      ]
        .filter(Boolean)
        .join("\n")
        .slice(0, 5000);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, subject, message }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      setFormState("success");
    } catch (err) {
      console.error("Contact form submission failed", err);
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
          Thank You!
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md">
          Your message has been received. We&apos;ll get back to you within 1
          business day.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setFormState("idle");
            setFormData({ name: "", email: "", phone: "", business: "", service: "", message: "" });
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        Request a Consultation
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Fill out the form below and we&apos;ll get back to you promptly.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {/* Name */}
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
            className={`w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors ${
              errors.name ? "border-red-400" : "border-slate-200 dark:border-slate-700"
            }`}
            placeholder="John Smith"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
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
            className={`w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors ${
              errors.email ? "border-red-400" : "border-slate-200 dark:border-slate-700"
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Phone */}
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
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            placeholder="416-000-0000"
          />
        </div>

        {/* Business */}
        <div>
          <label htmlFor="business" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Business / Company
          </label>
          <input
            id="business"
            name="business"
            type="text"
            value={formData.business}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            placeholder="Your Company Name"
          />
        </div>

        {/* Service */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Service Interested In
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          >
            <option value="">Select a service...</option>
            {serviceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors resize-none ${
              errors.message ? "border-red-400" : "border-slate-200 dark:border-slate-700"
            }`}
            placeholder="Tell us about your accounting needs..."
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
        </div>

        {/* Error state */}
        {formState === "error" && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          >
            We couldn&apos;t send your message. Please try again in a moment, or contact us
            directly by phone or email.
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
              <Loader2 className="size-4 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send className="size-4" /> Request a Consultation
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
