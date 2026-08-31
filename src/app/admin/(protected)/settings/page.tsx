"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Building2, Phone, Clock, Share2, MessageCircle, Calendar, Shield, Save } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingField {
  key: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "textarea";
}

interface SettingGroup {
  id: string;
  label: string;
  icon: any;
  description: string;
  fields: SettingField[];
}

const SETTING_GROUPS: SettingGroup[] = [
  {
    id: "company",
    label: "Company & Brand",
    icon: Building2,
    description: "Firm identity, tagline, and descriptive metadata",
    fields: [
      { key: "companyName", label: "Official Company Name", placeholder: "Account Dynamics" },
      { key: "shortName", label: "Short Brand Name", placeholder: "Account Dynamics" },
      {
        key: "tagline",
        label: "Tagline / Slogan",
        placeholder: "Tax | Cloud Accounting | Advisory | Business Data Analysts",
      },
      {
        key: "description",
        label: "Firm Description",
        type: "textarea",
        placeholder: "Professional tax, accounting and advisory firm...",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact & Location",
    icon: Phone,
    description: "Office address, phone numbers, and communication channels",
    fields: [
      { key: "email", label: "Public Inquiries Email", placeholder: "info@accountdynamics.com" },
      { key: "phone", label: "Primary Phone Number", placeholder: "416-748-2042" },
      { key: "phoneSecondary", label: "Secondary / Mobile Phone", placeholder: "416-450-5639" },
      { key: "addressLine1", label: "Street Address", placeholder: "55 Baywood Road, 2nd Floor" },
      { key: "city", label: "City", placeholder: "Toronto" },
      { key: "province", label: "Province / State", placeholder: "Ontario" },
      { key: "postalCode", label: "Postal Code", placeholder: "M9V 3Y8" },
      { key: "country", label: "Country", placeholder: "Canada" },
    ],
  },
  {
    id: "hours",
    label: "Business Hours",
    icon: Clock,
    description: "Operational schedule displayed in header, footer, and contact section",
    fields: [
      { key: "businessHoursLine1", label: "Days of Operation", placeholder: "Monday – Friday" },
      { key: "businessHoursLine2", label: "Operating Hours", placeholder: "9:00 AM – 4:00 PM" },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp Integration",
    icon: MessageCircle,
    description: "Floating chat widget and direct client messaging configuration",
    fields: [
      {
        key: "whatsappNumber",
        label: "WhatsApp Number (International format without + or spaces)",
        placeholder: "14167482042",
        description: "Enter in international format (e.g. 14167482042 for Canada/US). Used by the website floating WhatsApp button.",
      },
      {
        key: "whatsappMessage",
        label: "Default Pre-filled Message",
        type: "textarea",
        placeholder: "Hello Account Dynamics, I would like to learn more about your accounting and advisory services.",
        description: "Initial message shown to visitors when opening WhatsApp chat.",
      },
    ],
  },
  {
    id: "booking",
    label: "Consultation & Booking",
    icon: Calendar,
    description: "Appointment scheduling and external booking link integration",
    fields: [
      {
        key: "bookingUrl",
        label: "Booking URL / Path",
        placeholder: "/book",
        description: "Internal page (/book) or external calendar link (e.g. Calendly / Microsoft Bookings).",
      },
    ],
  },
  {
    id: "social",
    label: "Social Media Links",
    icon: Share2,
    description: "Links to verified official firm social profiles",
    fields: [
      { key: "linkedin", label: "LinkedIn Company URL", placeholder: "https://linkedin.com/company/..." },
      { key: "facebook", label: "Facebook Page URL", placeholder: "https://facebook.com/..." },
      { key: "instagram", label: "Instagram Profile URL", placeholder: "https://instagram.com/..." },
      { key: "youtube", label: "YouTube Channel URL", placeholder: "https://youtube.com/..." },
    ],
  },
  {
    id: "footer",
    label: "Footer & Legal Credits",
    icon: Shield,
    description: "Copyright line and administrative email recipient",
    fields: [
      { key: "copyright", label: "Copyright Notice", placeholder: "© 2026 Account Dynamics. All rights reserved." },
      { key: "designerCredit", label: "Design & Development Credit", placeholder: "Ice Tech Rwanda" },
      {
        key: "adminEmail",
        label: "Lead Notification Recipient Email",
        placeholder: "info@accountdynamics.com",
        description: "Email address that receives alerts whenever visitors submit contact forms, quotes, or consultations.",
      },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("company");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : {}))
      .then(setSettings)
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const saveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Website settings updated successfully");
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to save settings");
      }
    } catch {
      toast.error("Network error while saving settings");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const currentGroup = SETTING_GROUPS.find((g) => g.id === activeTab) || SETTING_GROUPS[0];
  const CurrentIcon = currentGroup.icon;

  return (
    <AdminPageShell
      title="Website Settings"
      subtitle="Manage firm contact details, business hours, WhatsApp integration, and global configurations"
      loading={loading}
      actions={
        <Button
          variant="brand"
          size="sm"
          className="rounded-xl gap-1.5"
          onClick={saveAll}
          disabled={saving}
        >
          <Save className="size-3.5" />
          {saving ? "Saving Changes..." : "Save Changes"}
        </Button>
      }
    >
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl">
        {/* Navigation tabs */}
        <div className="w-full md:w-60 shrink-0 space-y-1">
          {SETTING_GROUPS.map((group) => {
            const Icon = group.icon;
            const active = activeTab === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveTab(group.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{group.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white p-6 dark:bg-slate-900 dark:border-slate-700/50 space-y-6">
          <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <CurrentIcon className="size-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {currentGroup.label}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{currentGroup.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {currentGroup.fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {field.label}
                </Label>
                {field.type === "textarea" ? (
                  <textarea
                    value={settings[field.key] ?? ""}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white min-h-[90px]"
                  />
                ) : (
                  <Input
                    value={settings[field.key] ?? ""}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="rounded-xl"
                  />
                )}
                {field.description && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                    {field.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="brand"
              size="sm"
              className="rounded-xl px-5"
              onClick={saveAll}
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
