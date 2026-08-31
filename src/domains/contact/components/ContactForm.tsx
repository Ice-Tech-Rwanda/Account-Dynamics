"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  CheckCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

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

type FormState = "idle" | "loading" | "success" | "error";

const inputBase =
  "w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm pl-11 pr-4 py-3 transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10";
const inputOk = "border-slate-200 dark:border-slate-700";
const inputErr = "border-red-400 dark:border-red-500/60 focus:ring-red/10";

type FieldName = "name" | "email" | "phone" | "business" | "service" | "message";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    service: "",
    message: "",
    company: "", // honeypot
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your name";
    if (!formData.email.trim()) newErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (formData.phone.trim() && !/^[+()\-.\s\d]{7,20}$/.test(formData.phone.trim()))
      newErrors.phone = "Please enter a valid phone number";
    if (!formData.message.trim()) newErrors.message = "Please tell us how we can help";
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Honeypot: silently succeed if a bot filled the hidden field.
    if (formData.company.trim()) {
      setFormState("success");
      return;
    }
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
    const name = e.target.name as FieldName;
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 min-h-[420px]">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-brand/10 flex items-center justify-center">
            <CheckCircle className="size-10 text-brand" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-5 w-5 rounded-full bg-accent" />
          </span>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Message Sent Successfully!
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
          Thank you for reaching out. A member of our team will get back to you
          within one business day.
        </p>
        <Button
          variant="outline"
          className="mt-8 gap-2 rounded-xl"
          onClick={() => {
            setFormState("idle");
            setFormData({
              name: "",
              email: "",
              phone: "",
              business: "",
              service: "",
              message: "",
              company: "",
            });
          }}
        >
          <Send className="size-4" /> Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
          Get in Touch
        </span>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Send Us a Message
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Tell us about your needs and we&apos;ll get back to you promptly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {/* Honeypot (hidden from users, visible to bots) */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            name="company"
            id="company"
            tabIndex={-1}
            autoComplete="off"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                placeholder="John Smith"
              />
            </div>
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                placeholder="(416) 000-0000"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Business */}
          <div>
            <label htmlFor="business" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Business / Company
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="business"
                name="business"
                type="text"
                value={formData.business}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="Your Company Name"
              />
            </div>
          </div>
        </div>

        {/* Service */}
        <div>
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Service Interested In
          </label>
          <div className="relative">
            <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={`${inputBase} ${inputOk} appearance-none pr-10`}
            >
              <option value="">Select a service...</option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Message <span className="text-brand">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" />
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className={`${inputBase} ${errors.message ? inputErr : inputOk} resize-none pt-3`}
              placeholder="Tell us about your accounting needs..."
            />
          </div>
          {errors.message && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="size-3" /> {errors.message}
            </p>
          )}
        </div>

        {/* Error state */}
        {formState === "error" && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>
              We couldn&apos;t send your message. Please try again in a moment,
              or contact us directly by phone or email.
            </span>
          </div>
        )}

        <Button
          type="submit"
          variant="brand"
          size="lg"
          disabled={formState === "loading"}
          className="w-full gap-2 rounded-xl py-3 text-base"
        >
          {formState === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send className="size-4" /> Send Message
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
          <ShieldCheck className="size-3.5 text-brand/70" />
          Your information is private and never shared.
        </p>
      </form>
    </div>
  );
}
