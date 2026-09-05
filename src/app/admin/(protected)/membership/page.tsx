"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ShieldCheck, Sparkles, Check, AlertTriangle, RefreshCw } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { adminFetch } from "@/lib/admin-fetch";

interface Plan {
  id?: string;
  name: string;
  price?: number | null;
  billingFrequency?: string | null;
  description?: string | null;
  features?: string[];
  featured?: boolean;
  displayOrder?: number;
  status?: string;
}

export default function AdminMembershipPage() {
  const [membership, setMembership] = useState<{
    title: string;
    description: string;
    ctaLabel: string;
    ctaUrl: string;
    benefits: string[];
    status: string;
  }>({
    title: "Account Dynamics Membership",
    description: "Predictable, transparent monthly accounting and tax support tailored to your growing business.",
    ctaLabel: "Explore Membership Options",
    ctaUrl: "/book",
    benefits: [],
    status: "PUBLISHED",
  });

  const [benefitInput, setBenefitInput] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadMembership = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/membership");
      if (!res.ok) {
        setLoadError("Failed to load membership data.");
        return;
      }
      const data = await res.json();
      if (data?.membership) {
        let parsedBenefits: string[] = [];
        try {
          parsedBenefits = typeof data.membership.benefits === "string"
            ? JSON.parse(data.membership.benefits)
            : data.membership.benefits || [];
        } catch {
          parsedBenefits = [];
        }
        setMembership({
          title: data.membership.title || "",
          description: data.membership.description || "",
          ctaLabel: data.membership.ctaLabel || "Explore Membership Options",
          ctaUrl: data.membership.ctaUrl || "/book",
          benefits: parsedBenefits,
          status: data.membership.status || "PUBLISHED",
        });
      }
      if (data?.plans) {
        const parsedPlans = data.plans.map((p: any) => ({
          ...p,
          features: typeof p.features === "string" ? JSON.parse(p.features || "[]") : p.features || [],
        }));
        setPlans(parsedPlans);
      }
    } catch {
      setLoadError("Failed to load membership data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembership();
  }, [loadMembership]);

  const reloadMembership = useCallback(() => {
    setLoadError(null);
    setLoading(true);
    loadMembership();
  }, [loadMembership]);

  const addBenefit = () => {
    if (!benefitInput.trim()) return;
    setMembership((prev) => ({
      ...prev,
      benefits: [...prev.benefits, benefitInput.trim()],
    }));
    setBenefitInput("");
  };

  const removeBenefit = (index: number) => {
    setMembership((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addPlan = () => {
    setPlans((prev) => [
      ...prev,
      {
        name: `Plan ${prev.length + 1}`,
        price: null,
        billingFrequency: "month",
        description: "",
        features: [],
        featured: false,
        displayOrder: prev.length + 1,
        status: "DRAFT",
      },
    ]);
  };

  const updatePlan = (index: number, field: string, value: any) => {
    setPlans((prev) =>
      prev.map((plan, i) => (i === index ? { ...plan, [field]: value } : plan))
    );
  };

  const removePlan = (index: number) => {
    setPlans((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/membership", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membership: {
            ...membership,
            benefits: JSON.stringify(membership.benefits),
          },
          plans: plans.map((p, idx) => ({
            ...p,
            displayOrder: idx + 1,
            price: p.price ? Number(p.price) : null,
          })),
        }),
      });

      if (res.ok) {
        toast.success("Membership settings saved successfully");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to save membership");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <AdminPageShell title="Membership Management" subtitle="Manage membership overview, client benefits, and optional pricing tiers">
        <div className="max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700/50 px-6 py-10 text-center">
            <AlertTriangle className="size-7 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-slate-500">{loadError}</p>
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5 mt-4" onClick={reloadMembership}>
              <RefreshCw className="size-3.5" /> Retry
            </Button>
          </div>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="Membership Management"
      subtitle="Manage membership overview, client benefits, and optional pricing tiers"
      loading={loading}
    >
      <div className="max-w-4xl space-y-8">
        {/* Core Overview Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:bg-slate-900 dark:border-slate-700/50 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <Sparkles className="size-4 text-brand" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Membership Overview &amp; Public Display
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={membership.title}
                onChange={(e) => setMembership({ ...membership, title: e.target.value })}
                className="mt-1"
                placeholder="e.g. Account Dynamics Membership"
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={membership.description}
                onChange={(e) => setMembership({ ...membership, description: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white min-h-[90px]"
                placeholder="Describe the membership value proposition..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Call to Action Label</Label>
                <Input
                  value={membership.ctaLabel}
                  onChange={(e) => setMembership({ ...membership, ctaLabel: e.target.value })}
                  className="mt-1"
                  placeholder="e.g. Explore Membership Options"
                />
              </div>
              <div>
                <Label>Call to Action URL</Label>
                <Input
                  value={membership.ctaUrl}
                  onChange={(e) => setMembership({ ...membership, ctaUrl: e.target.value })}
                  className="mt-1"
                  placeholder="e.g. /book or /contact"
                />
              </div>
            </div>

            {/* Benefits List */}
            <div>
              <Label>Membership Benefits / Highlights</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                  placeholder="Add a key benefit (e.g. Unlimited monthly email & phone support)..."
                  className="flex-1"
                />
                <Button variant="brand" size="sm" className="rounded-xl px-4" onClick={addBenefit}>
                  Add
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {membership.benefits.map((benefit, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Check className="size-3 text-emerald-600" />
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(i)}
                      className="ml-1 text-slate-400 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Tier Management (Optional) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:bg-slate-900 dark:border-slate-700/50 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pricing Plans &amp; Packages (Optional)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Only publish plans when verified pricing has been established by firm leadership.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl gap-1" onClick={addPlan}>
              <Plus className="size-3.5" /> Add Plan Tier
            </Button>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No pricing tiers defined. The public site currently defaults to the custom consultation CTA.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                      <Input
                        value={plan.name}
                        onChange={(e) => updatePlan(index, "name", e.target.value)}
                        className="h-8 font-bold text-sm bg-white dark:bg-slate-900 max-w-xs"
                        placeholder="Plan Name (e.g. Essential Accounting)"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={plan.status || "DRAFT"}
                        onChange={(e) => updatePlan(index, "status", e.target.value)}
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removePlan(index)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Price ($ CAD)</Label>
                      <Input
                        type="number"
                        value={plan.price ?? ""}
                        onChange={(e) => updatePlan(index, "price", e.target.value)}
                        className="mt-1 h-8 bg-white dark:bg-slate-900 text-xs"
                        placeholder="Leave blank for custom quote"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Billing Frequency</Label>
                      <Input
                        value={plan.billingFrequency ?? "month"}
                        onChange={(e) => updatePlan(index, "billingFrequency", e.target.value)}
                        className="mt-1 h-8 bg-white dark:bg-slate-900 text-xs"
                        placeholder="e.g. month, year"
                      />
                    </div>
                    <div className="flex items-end pb-1.5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={plan.featured ?? false}
                          onChange={(e) => updatePlan(index, "featured", e.target.checked)}
                          className="rounded border-slate-300 text-brand focus:ring-brand"
                        />
                        Highlight as Featured Tier
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Plan Description</Label>
                    <Input
                      value={plan.description ?? ""}
                      onChange={(e) => updatePlan(index, "description", e.target.value)}
                      className="mt-1 h-8 bg-white dark:bg-slate-900 text-xs"
                      placeholder="Short summary of target business size or scope"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="brand"
            size="lg"
            className="rounded-xl px-6"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save All Membership Settings"}
          </Button>
        </div>
      </div>
    </AdminPageShell>
  );
}
