"use client";

import { useState, useEffect, useCallback, useActionState } from "react";
import { toast } from "sonner";
import { Save, Mail, ShieldCheck, Lock, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFetch } from "@/lib/admin-fetch";
import { changePasswordAction, type ChangePasswordState } from "./actions";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [pwState, pwFormAction, pwPending] = useActionState<
    ChangePasswordState | undefined,
    FormData
  >(changePasswordAction, undefined);

  const loadProfile = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/me");
      if (!res.ok) {
        setLoadError("Failed to load your profile.");
        return;
      }
      setProfile(await res.json());
    } catch {
      setLoadError("Failed to load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, [loadProfile]);

  const reloadProfile = useCallback(() => {
    setLoadError(null);
    setLoading(true);
    loadProfile();
  }, [loadProfile]);

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
      const res = await adminFetch("/api/admin/me", {
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

  if (loadError) {
    return (
      <AdminPageShell title="My Profile" subtitle="Edit your account information">
        <div className="max-w-2xl">
          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700/50 px-6 py-10 text-center">
            <AlertTriangle className="size-7 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-slate-500">{loadError}</p>
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5 mt-4" onClick={reloadProfile}>
              <RefreshCw className="size-3.5" /> Retry
            </Button>
          </div>
        </div>
      </AdminPageShell>
    );
  }

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

          {/* Change password */}
          <form action={pwFormAction} className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-5 dark:bg-slate-900 dark:border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Lock className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white">Change Password</h2>
                <p className="text-xs text-slate-400 mt-0.5">Minimum 12 characters, at least one letter and one number</p>
              </div>
            </div>

            {pwState?.success && (
              <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="size-4 shrink-0" />
                Password changed successfully.
              </div>
            )}
            {pwState?.error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {pwState.error}
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                required
                placeholder="Enter your current password"
                className="rounded-xl"
                disabled={pwPending}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">New Password</Label>
              <Input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                required
                placeholder="12+ characters, letters and numbers"
                className="rounded-xl"
                disabled={pwPending}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Confirm New Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                placeholder="Repeat your new password"
                className="rounded-xl"
                disabled={pwPending}
              />
            </div>

            <Button type="submit" variant="outline" size="sm" className="rounded-xl gap-1.5" disabled={pwPending}>
              <Lock className="size-3.5" />
              {pwPending ? "Updating..." : "Update Password"}
            </Button>
          </form>

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
