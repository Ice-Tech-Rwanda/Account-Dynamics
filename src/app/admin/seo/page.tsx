"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PAGES = ["home", "about", "services", "industries", "contact", "book", "why-choose-us"];

export default function AdminSeoPage() {
  const [activePage, setActivePage] = useState("home");
  const [seoData, setSeoData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all(PAGES.map(p => fetch(`/api/admin/seo/${p}`).then(r => r.ok ? r.json() : null).catch(() => null)))
      .then(results => {
        const map: Record<string, any> = {};
        PAGES.forEach((p, i) => { map[p] = results[i] || { pageKey: p }; });
        setSeoData(map);
        setLoading(false);
      });
  }, []);

  const savePage = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/seo/${activePage}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(seoData[activePage] || {}) });
    setSaving(false);
    if (res.ok) toast.success(`SEO updated for ${activePage}`);
    else toast.error("Failed to save");
  };

  const seo = seoData[activePage] || {};
  const update = (field: string, value: any) => setSeoData(prev => ({ ...prev, [activePage]: { ...prev[activePage], [field]: value } }));

  return (
    <AdminPageShell title="SEO Settings" subtitle="Manage meta tags and SEO for each page" loading={loading}>
      <div className="flex gap-6">
        <div className="w-40 shrink-0">
          <div className="space-y-0.5">
            {PAGES.map(p => (
              <button key={p} onClick={() => setActivePage(p)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activePage === p ? "bg-brand/10 text-brand" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50 p-6 space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white capitalize">{activePage}</h2>
          <div><Label>Title Tag</Label><Input value={seo.title ?? ""} onChange={e => update("title", e.target.value)} className="mt-1" placeholder="Page title for search engines" /></div>
          <div><Label>Meta Description</Label><textarea value={seo.description ?? ""} onChange={e => update("description", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" placeholder="Brief description for search results" /></div>
          <div><Label>OG Image URL</Label><Input value={seo.ogImage ?? ""} onChange={e => update("ogImage", e.target.value)} className="mt-1" /></div>
          <div><Label>Canonical URL</Label><Input value={seo.canonicalUrl ?? ""} onChange={e => update("canonicalUrl", e.target.value)} className="mt-1" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" checked={seo.indexable ?? true} onChange={e => update("indexable", e.target.checked)} className="rounded" /><Label>Indexable by search engines</Label></div>
          <div className="flex justify-end pt-4"><Button variant="brand" className="rounded-xl" onClick={savePage} disabled={saving}>{saving ? "Saving..." : "Save SEO"}</Button></div>
        </div>
      </div>
    </AdminPageShell>
  );
}
