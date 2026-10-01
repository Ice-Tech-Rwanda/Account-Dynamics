"use client";

import { useRef, useState } from "react";
import { submitErrorMessage, isDuplicateSubmit } from "@/lib/client/submit-errors";
import { PROGRAM_TYPE_VALUES, PROGRAM_TYPE_LABELS } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Send,
  CheckCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  CalendarDays,
  Clock,
  GraduationCap,
  BookOpen,
} from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";
type FieldName = keyof typeof initialForm;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  country: "",
  institution: "",
  fieldOfStudy: "",
  program: "",
  startDate: "",
  duration: "",
  experience: "",
  message: "",
  company: "", // honeypot
};

const inputBase =
  "w-full rounded-xl border bg-white text-slate-900 placeholder-slate-400 text-sm pl-11 pr-4 py-3 transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 dark:bg-slate-800 dark:text-white";
const inputOk = "border-slate-200 dark:border-slate-700";
const inputErr = "border-red-400 dark:border-red-500/60 focus:ring-red/10";

const programOptions = PROGRAM_TYPE_VALUES.map((value) => ({
  value,
  label: PROGRAM_TYPE_LABELS[value],
}));

export function TrainingApplicationForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  function idempotencyKey() {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `ta-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    return idempotencyKeyRef.current;
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) next.name = "Please enter your name";
    if (!formData.email.trim()) next.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Please enter a valid email address";
    if (formData.phone.trim() && !/^[+()\-.\s\d]{7,20}$/.test(formData.phone.trim()))
      next.phone = "Please enter a valid phone number";
    if (!formData.program) next.program = "Please select a programme";
    if (!formData.message.trim()) next.message = "Please tell us about your goals";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.company.trim()) {
      setFormState("success");
      return;
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      requestAnimationFrame(() =>
        document.getElementById("ta-" + Object.keys(validationErrors)[0])?.focus()
      );
      return;
    }
    setErrors({});
    setErrorMessage(null);
    setFormState("loading");

    try {
      const res = await fetch("/api/internship-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          country: formData.country || null,
          university: formData.institution || null,
          fieldOfStudy: formData.fieldOfStudy || null,
          programType: formData.program || null,
          preferredStartDate: formData.startDate || null,
          duration: formData.duration || null,
          experience: formData.experience || null,
          message: formData.message,
          idempotencyKey: idempotencyKey(),
        }),
      });

      if (!res.ok) {
        throw new Error(
          await submitErrorMessage(res, "Your application could not be sent. Please try again.")
        );
      }

      if (await isDuplicateSubmit(res)) {
        setFormState("success");
        return;
      }

      setFormState("success");
    } catch (err) {
      console.error("Training application submission failed", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Your application could not be sent. Please try again."
      );
      setFormState("error");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const name = e.target.name as FieldName;
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  if (formState === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[420px] flex-col items-center justify-center py-16 text-center"
      >
        <div className="relative">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-brand/10">
            <CheckCircle className="size-10 text-brand" />
          </div>
          <span className="absolute -right-1 -top-1 flex size-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-5 rounded-full bg-accent" />
          </span>
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Application Received!
        </h2>
        <p className="mt-3 max-w-md leading-relaxed text-slate-500 dark:text-slate-400">
          Thank you for applying to our training program. A member of our team
          will review your application and be in touch with next steps.
        </p>
        <Button
          variant="outline"
          className="mt-8 gap-2 rounded-xl"
          onClick={() => {
            setFormState("idle");
            setErrorMessage(null);
            idempotencyKeyRef.current = null;
            setFormData({ ...initialForm });
          }}
        >
          <Send className="size-4" /> Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand dark:bg-brand/10 dark:text-accent">
          Apply Now
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Training Application Form
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Complete the form below and our team will review your application and
          guide you through the next steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div className="inquiry-form-heading">
          <h3 className="text-xl">Your Details</h3>
          <p>Only your name, email and program selection are required.</p>
        </div>

        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="ta-company">Company</label>
          <input
            type="text"
            name="company"
            id="ta-company"
            tabIndex={-1}
            autoComplete="off"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ta-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="ta-name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "ta-name-error" : undefined}
                required
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                placeholder="Your full name"
              />
            </div>
            {errors.name && (
              <p id="ta-name-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ta-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="ta-email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "ta-email-error" : undefined}
                required
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p id="ta-email-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ta-phone" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Phone / WhatsApp
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="ta-phone"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "ta-phone-error" : undefined}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                placeholder="+250 700 000 000"
              />
            </div>
            {errors.phone && (
              <p id="ta-phone-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ta-country" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Country of Residence
            </label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="ta-country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="e.g. Rwanda, Uganda, Kenya"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ta-institution" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Institution / University
            </label>
            <div className="relative">
              <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="ta-institution"
                name="institution"
                type="text"
                value={formData.institution}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="Your school or university"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ta-field" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Field of Study
            </label>
            <div className="relative">
              <BookOpen className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="ta-field"
                name="fieldOfStudy"
                type="text"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="e.g. Tourism, Hospitality"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ta-program" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Programme Type <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />
              <select
                id="ta-program"
                aria-invalid={Boolean(errors.program)}
                aria-describedby={errors.program ? "ta-program-error" : undefined}
                required
                name="program"
                value={formData.program}
                onChange={handleChange}
                className={`${inputBase} ${errors.program ? inputErr : inputOk} appearance-none pr-10`}
              >
                <option value="">Select a programme...</option>
                {programOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
            {errors.program && (
              <p id="ta-program-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.program}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ta-start" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Preferred Start Date
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="ta-start"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ta-duration" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Preferred Duration
            </label>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="ta-duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="e.g. 3 months, 6 months"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ta-experience" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Relevant Experience
            </label>
            <div className="relative">
              <BookOpen className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="ta-experience"
                name="experience"
                type="text"
                value={formData.experience}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="e.g. Volunteer guide, hospitality work"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="ta-message" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Your Goals & Motivation <span className="text-brand">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" />
            <textarea
              id="ta-message"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "ta-message-error" : undefined}
              required
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className={`${inputBase} ${errors.message ? inputErr : inputOk} resize-none pt-3`}
              placeholder="Tell us why you want to join this program and what you hope to achieve..."
            />
          </div>
          {errors.message && (
            <p id="ta-message-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="size-3" /> {errors.message}
            </p>
          )}
        </div>

        {formState === "error" && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{errorMessage || "Your application could not be sent. Please try again."}</span>
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
              <Loader2 className="size-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Send className="size-4" /> Submit Application
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
