"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitErrorMessage, isDuplicateSubmit } from "@/lib/client/submit-errors";
import { Button } from "@/components/ui/button";
import { CountryFlag } from "@/components/shared/CountryFlag";
import {
  CountryFlagCards,
  buildCountryOptions,
  countryDemonym,
} from "@/components/shared/CountryFlagCards";
import { cn } from "@/lib/utils";
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
  Users,
  MapPin,
  Wallet,
  Package,
} from "lucide-react";

interface TripInquiryOption {
  title: string;
  category?: string | null;
}

interface TripInquiryFormProps {
  destinations?: string[];
  packages?: TripInquiryOption[];
}

type FormState = "idle" | "loading" | "success" | "error";
type FieldName = keyof typeof initialForm;

const initialForm = {
  name: "",
  email: "",
  phone: "",
  country: "",
  travelDate: "",
  duration: "",
  travelers: "",
  preferredPackage: "",
  budget: "",
  destination: "",
  message: "",
  company: "", // honeypot
};

const inputBase =
  "w-full rounded-xl border bg-white text-slate-900 placeholder-slate-400 text-sm pl-11 pr-4 py-3 transition-all focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 dark:bg-slate-800 dark:text-white";
const inputOk = "border-slate-200 dark:border-slate-700";
const inputErr = "border-red-400 dark:border-red-500/60 focus:ring-red/10";

export function TripInquiryForm({ destinations = [], packages = [] }: TripInquiryFormProps) {
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    ...initialForm,
    preferredPackage: searchParams.get("package") ?? "",
    destination: searchParams.get("destination") ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState(() => {
    const preselected = searchParams.get("package");
    return packages.find((p) => p.title === preselected)?.category ?? "";
  });
  const idempotencyKeyRef = useRef<string | null>(null);

  const countryOptions = buildCountryOptions(packages);

  const visiblePackages = countryFilter
    ? packages.filter((p) => p.category === countryFilter)
    : packages;

  function handleCountrySelect(country: string) {
    setCountryFilter(country);
    setErrors((prev) => {
      if (!prev.preferredPackage) return prev;
      const next = { ...prev };
      delete next.preferredPackage;
      return next;
    });
    setFormData((prev) => {
      if (!prev.preferredPackage || prev.preferredPackage === "Custom / tailor-made") return prev;
      const stillVisible = packages.some(
        (p) => p.title === prev.preferredPackage && (!country || p.category === country)
      );
      return stillVisible ? prev : { ...prev, preferredPackage: "" };
    });
  }

  function idempotencyKey() {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
      requestAnimationFrame(() => document.getElementById("trip-" + Object.keys(validationErrors)[0])?.focus());
      return;
    }
    setErrors({});
    setErrorMessage(null);
    setFormState("loading");

    try {
      const res = await fetch("/api/trip-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          country: formData.country || null,
          travelDate: formData.travelDate || null,
          duration: formData.duration || null,
          travelers: formData.travelers || null,
          preferredPackage: formData.preferredPackage || null,
          budget: formData.budget || null,
          destination: formData.destination || null,
          message: formData.message.slice(0, 5000) || null,
          idempotencyKey: idempotencyKey(),
        }),
      });

      if (!res.ok) {
        throw new Error(
          await submitErrorMessage(res, "Your request could not be sent. Please try again.")
        );
      }

      if (await isDuplicateSubmit(res)) {
        setFormState("success");
        return;
      }

      setFormState("success");
    } catch (err) {
      console.error("Trip inquiry submission failed", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Your request could not be sent. Please try again."
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
      <div role="status" aria-live="polite" className="flex min-h-[420px] flex-col items-center justify-center py-16 text-center">
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
          Request Received!
        </h2>
        <p className="mt-3 max-w-md leading-relaxed text-slate-500 dark:text-slate-400">
          Thank you for telling us about your trip. A member of our team will be
          in touch to help plan your journey. This is an inquiry, not a confirmed booking.
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
          <Send className="size-4" /> Plan Another Trip
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand dark:bg-brand/10 dark:text-accent">
          Plan Your Trip
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Tell Us About Your Dream Trip
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Share a few details and we&apos;ll design a personalised itinerary and
          quote for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <CountryFlagCards
          options={countryOptions}
          selected={countryFilter}
          onSelect={handleCountrySelect}
        />

        <div className="inquiry-form-heading">
          <h3 className="text-xl">A little about you &amp; your journey</h3>
          <p>Only your name and email are required. Share as much or as little as you know.</p>
        </div>
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="trip-company">Company</label>
          <input
            type="text"
            name="company"
            id="trip-company"
            tabIndex={-1}
            autoComplete="off"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="trip-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="trip-name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "trip-name-error" : undefined}
                required
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                placeholder="John Smith"
              />
            </div>
            {errors.name && (
              <p id="trip-name-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="trip-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="trip-email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "trip-email-error" : undefined}
                required
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p id="trip-email-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="trip-phone" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Phone / WhatsApp
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="trip-phone"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "trip-phone-error" : undefined}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                placeholder="+250 700 000 000"
              />
            </div>
            {errors.phone && (
              <p id="trip-phone-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3" /> {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="trip-date" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Preferred Travel Date
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="trip-date"
                name="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="trip-duration" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Trip Duration
            </label>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="trip-duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="e.g. 5 days / 4 nights"
              />
            </div>
          </div>

          <div>
            <label htmlFor="trip-travelers" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Number of Travelers
            </label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="trip-travelers"
                name="travelers"
                type="text"
                value={formData.travelers}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="e.g. 2 adults, 1 child"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="trip-destination" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Destination of Interest
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />
              <select
                id="trip-destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className={`${inputBase} ${inputOk} appearance-none pr-10`}
              >
                <option value="">Select a destination...</option>
                {destinations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value="Not sure yet">Not sure yet</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <label htmlFor="trip-package" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Preferred Tour Package
              </label>
              {countryFilter && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand dark:bg-accent/15 dark:text-accent">
                  <CountryFlag country={countryFilter} alt="" className="h-2.5 w-4 rounded-[1px]" />
                  {countryFilter} only · {visiblePackages.length}
                </span>
              )}
            </div>
            <div className="relative">
              <Package className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />
              <select
                id="trip-package"
                name="preferredPackage"
                value={formData.preferredPackage}
                onChange={handleChange}
                className={cn(
                  inputBase,
                  inputOk,
                  "appearance-none pr-10",
                  countryFilter && "border-brand ring-4 ring-brand/10"
                )}
              >
                <option value="">
                  {countryFilter
                    ? `Select a ${countryDemonym(countryFilter)} package...`
                    : "Select a package..."}
                </option>
                {visiblePackages.map((p) => (
                  <option key={p.title} value={p.title}>
                    {p.title}
                  </option>
                ))}
                <option value="Custom / tailor-made">Custom / tailor-made</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="trip-country" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Country of Residence
            </label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="trip-country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="e.g. Rwanda, Uganda, USA"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <label htmlFor="trip-budget" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Estimated Budget (optional)
            </label>
            <div className="relative">
              <Wallet className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="trip-budget"
                name="budget"
                type="text"
                value={formData.budget}
                onChange={handleChange}
                className={`${inputBase} ${inputOk}`}
                placeholder="e.g. $2,000 per person"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="trip-message" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tell Us More
          </label>
          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" />
            <textarea
              id="trip-message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className={`${inputBase} ${inputOk} resize-none pt-3`}
              placeholder="Interests, special requests, questions..."
            />
          </div>
        </div>

        {formState === "error" && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{errorMessage || "Your request could not be sent. Please try again."}</span>
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
              <Send className="size-4" /> Send Trip Request
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
