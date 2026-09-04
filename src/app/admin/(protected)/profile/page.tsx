"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Mail, ShieldCheck } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setProfile)
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: string, value: any) =>
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const payload = {
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        bio: profile.bio ?? "",
        image: profile.image ?? "",
      };
      const res = await fetch("/api/admin/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        toast.success("Profile updated");
      } else {
        const e = await res.json().catch(() => ({}));
        toast.error(e.error || "Failed to update profile");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageShell
      title="My Profile"
      subtitle="Edit your account information"
      loading={loading}
      actions={
        <Button variant="brand" size="sm" className="rounded-xl gap-1.5" onClick={handleSave} disabled={saving || !profile}>
          <Save className="size-3.5" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      {profile && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-5 dark:bg-slate-900 dark:border-slate-700/50">
            <div>
              <ImageUpload
                label="Profile Picture"
                value={profile.image ?? ""}
                onChange={(url) => update("image", url)}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Full Name</Label>
              <Input
                value={profile.name ?? ""}
                onChange={(e) => update("name", e.target.value)}
                className="rounded-xl"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email</Label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 dark:bg-slate-800 dark:border-slate-700">
                <Mail className="size-3.5" />
                {profile.email ?? "—"}
                <span className="ml-auto flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <ShieldCheck className="size-3" />
                  {profile.role ?? "EDITOR"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Email cannot be changed.</p>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Phone Number (optional)</Label>
              <Input
                value={profile.phone ?? ""}
                onChange={(e) => update("phone", e.target.value)}
                className="rounded-xl"
                placeholder="+1 416-748-2042"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Bio / About (optional)</Label>
              <textarea
                value={profile.bio ?? ""}
                onChange={(e) => update("bio", e.target.value)}
                className="w-full min-h-[90px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="A short introduction about you"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="brand" size="sm" className="rounded-xl px-5" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}
