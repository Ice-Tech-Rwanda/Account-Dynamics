"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

type Props = { initial?: Record<string, any> };

export default function AdminSettingsClient({ initial = {} }: Props) {
  const [form, setForm] = useState<Record<string, any>>(initial ?? {});
  const [prevInitial, setPrevInitial] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const timer = useRef<number | null>(null);

  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setForm(initial ?? {});
  }

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) { const txt = await res.text(); toast.error('Save failed: ' + txt); }
      else { toast.success('Settings saved'); setUnsaved(false); }
    } catch (err: any) { toast.error(err?.message ?? 'Save failed'); }
    setSaving(false);
  }, [form]);

  useEffect(() => {
    // autosave after 1.5s of inactivity
    if (timer.current) window.clearTimeout(timer.current);
    if (!unsaved) return;
    timer.current = window.setTimeout(() => {
      handleSave();
    }, 1500) as unknown as number;
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [form, unsaved, handleSave]);

  const update = (k: string, v: any) => { setForm((s) => { const n = { ...s, [k]: v }; setUnsaved(true); return n; }); };

  const fields = [
    { key: "companyName", label: "Company Name" },
    { key: "tagline", label: "Tagline" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "whatsapp", label: "WhatsApp Link" },
    { key: "facebook", label: "Facebook URL" },
    { key: "twitter", label: "Twitter URL" },
    { key: "instagram", label: "Instagram URL" },
    { key: "youtube", label: "YouTube URL" },
  ];

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">General Information</h2>
        {fields.slice(0, 5).map((f) => (
          <div key={f.key}>
            <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">{f.label}</Label>
            <Input
              type={f.type ?? 'text'}
              value={form[f.key] ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
              className="mt-1 rounded-xl"
            />
          </div>
        ))}

        <h2 className="text-sm font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-800">Social Links</h2>
        {fields.slice(5).map((f) => (
          <div key={f.key}>
            <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">{f.label}</Label>
            <Input
              type="url"
              value={form[f.key] ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
              className="mt-1 rounded-xl"
              placeholder="https://"
            />
          </div>
        ))}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {saving ? <Loader2 className="size-4 animate-spin text-brand" /> : unsaved ? <span className="text-xs text-yellow-600">Unsaved changes</span> : <span className="text-xs text-slate-500">All saved</span>}
          </div>
          <Button variant="brand" className="rounded-xl gap-2" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
