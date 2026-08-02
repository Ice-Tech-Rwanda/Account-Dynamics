"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Heart, School, GraduationCap, MessageCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/lib/site";

type FormType = "member" | "volunteer" | "school" | "university";

const tabs = [
  { value: "member" as FormType, label: "Individual Member", icon: Users },
  { value: "volunteer" as FormType, label: "Volunteer", icon: Heart },
  { value: "school" as FormType, label: "School Club", icon: School },
  { value: "university" as FormType, label: "University Club", icon: GraduationCap },
];

export function JoinTabs() {
  const [activeTab, setActiveTab] = useState<FormType>("member");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-content?section=contactInfo")
      .then((r) => r.json())
      .then((data) => { setContactInfo(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !contactInfo) return null;

  const handleSubmit = async (formId: string, e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());

    // minimal client-side checks for required fields to reduce friction on mobile
    const errors: Record<string,string> = {};
    if (!data["name"] && formId === "member") errors.name = "Name is required";
    if (!data["email"] && formId === "member") errors.email = "Email is required";
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      // focus first errored field
      const first = Object.keys(errors)[0];
      const el = form.querySelector(`[name="${first}"]`) as HTMLElement | null;
      el?.focus();
      return;
    }

    setSubmitting(formId);

    try {
      // normalize category for member POST
      const payload = { ...data, category: formId === "member" ? "individual" : formId };
      const res = await fetch(`/api/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatusMessage(body?.message || "Failed to submit. Please try again.");
        toast.error("Submission failed");
      } else {
        setStatusMessage("Application submitted successfully. We'll contact you soon.");
        toast.success("Application submitted successfully! We'll contact you soon.");
        form.reset();

        // best-effort analytics ping to server for conversion tracking
        try {
          await fetch(`/api/analytics/event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "membership_signup", category: formId }),
          });
        } catch {
          // ignore analytics errors
        }
      }
    } catch {
      setStatusMessage("Submission failed. Please try again later.");
      toast.error("Submission failed");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <section id="join-forms" className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3 inline-block">
            Apply Now
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Ready to Join?
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Choose the membership type that fits you best and submit your application
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FormType)}>
            <TabsList className="w-full flex h-auto gap-1 bg-transparent p-0 border-b border-slate-200 dark:border-slate-800 rounded-none overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-brand data-[state=active]:border-b-2 data-[state=active]:border-brand rounded-none pb-3 pt-0 px-4 gap-2 text-slate-500"
                  >
                    <Icon className="size-4" />
                    <span className="hidden sm:inline text-xs font-semibold">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.value === "member" && <MemberForm submitting={submitting} onSubmit={(e) => handleSubmit("member", e)} errors={fieldErrors} />}
                  {tab.value === "volunteer" && <VolunteerForm submitting={submitting} onSubmit={(e) => handleSubmit("volunteer", e)} />}
                  {tab.value === "school" && <SchoolForm submitting={submitting} onSubmit={(e) => handleSubmit("school", e)} />}
                  {tab.value === "university" && <UniversityForm submitting={submitting} onSubmit={(e) => handleSubmit("university", e)} />}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Accessible status region */}
          <div aria-live="polite" className="sr-only" role="status">
            {statusMessage}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center p-8 rounded-2xl bg-gradient-to-br from-brand/[0.03] to-accent/[0.03] border border-slate-200/80 dark:border-slate-700/50"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Prefer to connect with us directly?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                <Button variant="brand" className="rounded-xl gap-2">
                  <MessageCircle className="size-4" /> Join WhatsApp Group
                </Button>
              </a>
              <a href={`mailto:${contactInfo.email}`}>
                <Button variant="outline" className="rounded-xl gap-2">
                  <Send className="size-4" /> Email Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function SubmitButton({ label, submitting }: { label: string; submitting: boolean }) {
  return (
    <Button
      type="submit"
      disabled={submitting}
      variant="brand"
      size="xl"
      className="w-full rounded-xl gap-2"
    >
      {submitting ? (
        <>
          <Loader2 className="size-4 animate-spin" /> Submitting...
        </>
      ) : (
        <>
          <Send className="size-4" /> {label}
        </>
      )}
    </Button>
  );
}

function MemberForm({ submitting, onSubmit, errors }: { submitting: string | null; onSubmit: (e: React.FormEvent) => void; errors?: Record<string,string> }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Individual Member Registration</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">Become a registered {siteConfig.name} member and enjoy all club benefits.</p>
      <form onSubmit={onSubmit} className="space-y-5" aria-describedby={errors?.name || errors?.email ? "join-form-errors" : undefined}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Full Name" required>
            <Input name="name" className="h-11" required placeholder="Your full name" aria-invalid={errors?.name ? true : undefined} />
            {errors?.name && <p id="join-form-errors" className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </FormField>
          <FormField label="Email" required>
            <Input name="email" type="email" className="h-11" required placeholder="your@email.com" aria-invalid={errors?.email ? true : undefined} />
            {errors?.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Phone"><Input name="phone" type="tel" className="h-11" placeholder="+250 7XX XXX XXX" /></FormField>
          <FormField label="Scrabble Level">
            <select name="level" className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">Select your level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Competitive</option>
            </select>
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Age Group">
            <select className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">Select age group</option>
              <option>Under 13</option>
              <option>13-18</option>
              <option>19-25</option>
              <option>26-40</option>
              <option>40+</option>
            </select>
          </FormField>
          <FormField label="Location (District)">
            <Input name="location" className="h-11" placeholder="e.g. Kicukiro" />
          </FormField>
        </div>
        <SubmitButton label="Submit Application" submitting={submitting === "member"} />
      </form>
    </div>
  );
}

function VolunteerForm({ submitting, onSubmit }: { submitting: string | null; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Volunteer Application</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">Help us organize events, coach players, and grow the Scrabble community.</p>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Full Name" required><Input name="name" className="h-11" required placeholder="Your full name" /></FormField>
          <FormField label="Email" required><Input name="email" type="email" className="h-11" required placeholder="your@email.com" /></FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Phone"><Input name="phone" type="tel" className="h-11" placeholder="+250 7XX XXX XXX" /></FormField>
          <FormField label="Area of Interest" required>
            <select name="areaOfInterest" className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
              <option value="">Select an area</option>
              <option>Event Organization</option>
              <option>Coaching & Training</option>
              <option>Social Media & Communications</option>
              <option>School Outreach</option>
              <option>Fundraising & Sponsorship</option>
              <option>Tournament Officiating</option>
            </select>
          </FormField>
        </div>
          <FormField label="Why do you want to volunteer?" required>
          <textarea
            name="motivation"
            className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            required
            placeholder="Tell us about your motivation and any relevant experience..."
          />
        </FormField>
        <FormField label="Skills & Availability">
          <textarea
            className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            placeholder="Any relevant skills or time availability you'd like to share..."
          />
        </FormField>
        <SubmitButton label="Submit Application" submitting={submitting === "volunteer"} />
      </form>
    </div>
  );
}

function SchoolForm({ submitting, onSubmit }: { submitting: string | null; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Start a School Scrabble Club</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">Bring Scrabble to your school. We provide resources, training, and support.</p>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="School Name" required><Input name="school" className="h-11" required placeholder="School name" /></FormField>
          <FormField label="School Level" required>
            <select name="schoolLevel" className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
              <option value="">Select level</option>
              <option>Primary</option>
              <option>Secondary</option>
              <option>Both</option>
            </select>
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Teacher/Coordinator Name" required><Input name="coordinator" className="h-11" required placeholder="Full name" /></FormField>
          <FormField label="Email" required><Input name="email" type="email" className="h-11" required placeholder="coordinator@school.edu" /></FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Phone"><Input name="phone" type="tel" className="h-11" placeholder="+250 7XX XXX XXX" /></FormField>
          <FormField label="Estimated Students"><Input name="estimatedStudents" type="number" className="h-11" placeholder="e.g. 30" /></FormField>
        </div>
        <FormField label="Additional Notes">
          <textarea
            className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            placeholder="Any additional information or questions..."
          />
        </FormField>
        <SubmitButton label="Submit Registration" submitting={submitting === "school"} />
      </form>
    </div>
  );
}

function UniversityForm({ submitting, onSubmit }: { submitting: string | null; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Start a University Scrabble Club</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">Join the University Scrabble League and compete against other campuses nationwide.</p>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="University Name" required><Input name="university" className="h-11" required placeholder="University name" /></FormField>
          <FormField label="Campus/Location"><Input name="campus" className="h-11" placeholder="Main campus, branch, etc." /></FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Student Coordinator" required><Input name="coordinator" className="h-11" required placeholder="Full name" /></FormField>
          <FormField label="Email" required><Input name="email" type="email" className="h-11" required placeholder="coordinator@university.edu" /></FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Phone"><Input name="phone" type="tel" className="h-11" placeholder="+250 7XX XXX XXX" /></FormField>
          <FormField label="Faculty Advisor"><Input name="facultyAdvisor" className="h-11" placeholder="Advisor name (optional)" /></FormField>
        </div>
        <FormField label="Estimated Club Members">
          <select className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <option value="">Select estimated size</option>
            <option>Under 10</option>
            <option>10-20</option>
            <option>20-50</option>
            <option>50+</option>
          </select>
        </FormField>
        <SubmitButton label="Submit Registration" submitting={submitting === "university"} />
      </form>
    </div>
  );
}
