"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SECTIONS = ["hero", "services", "advisory", "about", "whyChoose", "whoWeServe", "technology", "faq", "finalCta"];

export default function AdminHomepagePage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all(SECTIONS.map(s => fetch(`/api/admin/homepage/${s}`).then(r => r.ok ? r.json() : null).catch(() => null)))
      .then(results => {
        const map: Record<string, any> = {};
        SECTIONS.forEach((s, i) => { map[s] = results[i] || { sectionKey: s }; });
        setSections(map);
        setLoading(false);
      });
  }, []);

  const saveSection = async (key: string) => {
    setSaving(true);
    const data = sections[key] || {};
    const res = await fetch(`/api/admin/homepage/${key}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    if (res.ok) toast.success(`${key} section updated`);
    else toast.error("Failed to save");
  };

  const updateField = (key: string, field: string, value: any) => {
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const section = sections[activeSection] || {};

  return (
    <AdminPageShell title="Homepage" subtitle="Edit homepage sections and content" loading={loading}>
      <div className="flex gap-6">
        <div className="w-48 shrink-0">
          <div className="space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === s
                    ? "bg-brand/10 text-brand"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {s.replace(/([A-Z])/g, " $1").trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50 p-6 space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white capitalize">
            {activeSection.replace(/([A-Z])/g, " $1").trim()} Section
          </h2>

          <div><Label>Eyebrow</Label><Input value={section.eyebrow ?? ""} onChange={e => updateField(activeSection, "eyebrow", e.target.value)} className="mt-1" /></div>
          <div><Label>Title</Label><Input value={section.title ?? ""} onChange={e => updateField(activeSection, "title", e.target.value)} className="mt-1" /></div>
          <div><Label>Subtitle</Label><textarea value={section.subtitle ?? ""} onChange={e => updateField(activeSection, "subtitle", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" /></div>
          <div><Label>Description</Label><textarea value={section.description ?? ""} onChange={e => updateField(activeSection, "description", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>CTA Label</Label><Input value={section.ctaLabel ?? ""} onChange={e => updateField(activeSection, "ctaLabel", e.target.value)} className="mt-1" /></div>
            <div><Label>CTA URL</Label><Input value={section.ctaUrl ?? ""} onChange={e => updateField(activeSection, "ctaUrl", e.target.value)} className="mt-1" /></div>
          </div>
          <div><Label>Image Key</Label><Input value={section.image ?? ""} onChange={e => updateField(activeSection, "image", e.target.value)} className="mt-1" placeholder="e.g. about, advisory" /></div>

          <div className="flex justify-end pt-4">
            <Button variant="brand" className="rounded-xl" onClick={() => saveSection(activeSection)} disabled={saving}>
              {saving ? "Saving..." : "Save Section"}
            </Button>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
