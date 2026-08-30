"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SETTING_GROUPS = [
  { label: "Company", fields: ["companyName", "shortName", "tagline", "description"] },
  { label: "Contact", fields: ["email", "phone", "phoneSecondary", "addressLine1", "addressLine2", "city", "province", "postalCode", "country"] },
  { label: "Hours", fields: ["businessHoursLine1", "businessHoursLine2"] },
  { label: "Social", fields: ["linkedin", "facebook", "instagram", "youtube"] },
  { label: "WhatsApp", fields: ["whatsappNumber", "whatsappMessage"] },
  { label: "Booking", fields: ["bookingUrl"] },
  { label: "Footer", fields: ["copyright", "designerCredit", "adminEmail"] },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.ok ? r.json() : {}).then(setSettings).finally(() => setLoading(false));
  }, []);

  const saveAll = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSaving(false);
    if (res.ok) toast.success("Settings saved");
    else toast.error("Failed to save");
  };

  const update = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <AdminPageShell title="Site Settings" subtitle="Configure your website settings" loading={loading}>
      <div className="max-w-3xl space-y-8">
        {SETTING_GROUPS.map(group => (
          <div key={group.label} className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50 p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{group.label}</h2>
            {group.fields.map(field => (
              <div key={field}>
                <Label className="capitalize">{field.replace(/([A-Z])/g, " $1").trim()}</Label>
                <Input value={settings[field] ?? ""} onChange={e => update(field, e.target.value)} className="mt-1" />
              </div>
            ))}
          </div>
        ))}
        <div className="flex justify-end"><Button variant="brand" className="rounded-xl" onClick={saveAll} disabled={saving}>{saving ? "Saving..." : "Save All Settings"}</Button></div>
      </div>
    </AdminPageShell>
  );
}
