"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Globe, Search, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PAGES = [
  { key: "home", label: "Homepage (/)" },
  { key: "about", label: "About Us (/about)" },
  { key: "services", label: "Services (/services)" },
  { key: "industries", label: "Industries (/industries)" },
  { key: "contact", label: "Contact (/contact)" },
  { key: "book", label: "Book Consultation (/book)" },
  { key: "why-choose-us", label: "Why Choose Us (/why-choose-us)" },
];

export default function AdminSeoPage() {
  const [activePage, setActivePage] = useState("home");
  const [seoData, setSeoData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all(
      PAGES.map((p) =>
        fetch(`/api/admin/seo/${p.key}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      const map: Record<string, any> = {};
      PAGES.forEach((p, i) => {
        map[p.key] = results[i] || { pageKey: p.key };
      });
      setSeoData(map);
      setLoading(false);
    });
  }, []);

  const savePage = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/seo/${activePage}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoData[activePage] || {}),
      });
      if (res.ok) {
        toast.success(`SEO metadata updated for ${activePage}`);
      } else {
        toast.error("Failed to save SEO settings");
      }
    } catch {
      toast.error("Network error while saving SEO metadata");
    } finally {
      setSaving(false);
    }
  };

  const seo = seoData[activePage] || {};
  const update = (field: string, value: any) =>
    setSeoData((prev) => ({
      ...prev,
      [activePage]: { ...prev[activePage], [field]: value },
    }));

  const titleLength = (seo.title ?? "").length;
  const descLength = (seo.description ?? "").length;

  return (
    <AdminPageShell
      title="Search Engine Optimization (SEO)"
      subtitle="Manage page titles, meta descriptions, and OpenGraph tags with search preview"
      loading={loading}
    >
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl">
        {/* Page selector */}
        <div className="w-full md:w-56 shrink-0 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5">
            Select Page
          </p>
          {PAGES.map((p) => {
            const active = activePage === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setActivePage(p.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <span>{p.label}</span>
                <Globe className="size-3.5 opacity-60" />
              </button>
            );
          })}
        </div>

        {/* Editor & Search Preview */}
        <div className="flex-1 space-y-6">
          {/* SERP Preview Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:bg-slate-900 dark:border-slate-700/50 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <Search className="size-3.5" />
              <span>Google Search Preview</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 space-y-1">
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                https://accountdynamics.com/{activePage === "home" ? "" : activePage}
              </p>
              <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 line-clamp-1">
                {seo.title || "Account Dynamics | Tax, Accounting & Business Advisory"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {seo.description ||
                  "Professional tax, cloud accounting, bookkeeping and advisory services for individuals and small businesses in Toronto, Canada."}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:bg-slate-900 dark:border-slate-700/50 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-medium">Page Title Tag</Label>
                <span
                  className={`text-[11px] font-semibold ${
                    titleLength >= 50 && titleLength <= 60
                      ? "text-emerald-600"
                      : titleLength > 60
                      ? "text-amber-600"
                      : "text-slate-400"
                  }`}
                >
                  {titleLength}/60 chars (recommended 50–60)
                </span>
              </div>
              <Input
                value={seo.title ?? ""}
                onChange={(e) => update("title", e.target.value)}
                className="rounded-xl"
                placeholder="e.g. Services | Account Dynamics"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-medium">Meta Description</Label>
                <span
                  className={`text-[11px] font-semibold ${
                    descLength >= 140 && descLength <= 160
                      ? "text-emerald-600"
                      : descLength > 160
                      ? "text-amber-600"
                      : "text-slate-400"
                  }`}
                >
                  {descLength}/160 chars (recommended 150–160)
                </span>
              </div>
              <textarea
                value={seo.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white min-h-[90px]"
                placeholder="Concise summary for search engine snippet..."
              />
            </div>

            <div>
              <Label className="text-xs font-medium">OpenGraph / Social Image URL</Label>
              <Input
                value={seo.ogImage ?? ""}
                onChange={(e) => update("ogImage", e.target.value)}
                className="mt-1 rounded-xl"
                placeholder="https://..."
              />
            </div>

            <div>
              <Label className="text-xs font-medium">Canonical URL</Label>
              <Input
                value={seo.canonicalUrl ?? ""}
                onChange={(e) => update("canonicalUrl", e.target.value)}
                className="mt-1 rounded-xl"
                placeholder={`/${activePage === "home" ? "" : activePage}`}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="indexable-toggle"
                type="checkbox"
                checked={seo.indexable ?? true}
                onChange={(e) => update("indexable", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              <label htmlFor="indexable-toggle" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Allow search engines to index this page (Indexable)
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="brand"
                size="sm"
                className="rounded-xl px-5 gap-1.5"
                onClick={savePage}
                disabled={saving}
              >
                <Save className="size-3.5" />
                {saving ? "Saving..." : "Save SEO Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
