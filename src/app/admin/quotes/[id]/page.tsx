"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AdminQuoteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/quotes/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setQuote)
      .catch(() => toast.error("Failed to load quote"))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/admin/quotes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setQuote((prev: any) => ({ ...prev, status }));
      toast.success(`Status updated to ${status}`);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;
  if (!quote) return <div className="p-8 text-center text-slate-400">Quote not found</div>;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/quotes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand mb-4">
        <ArrowLeft className="size-4" /> Back to Quotes
      </Link>

      <div className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">{quote.name}</h1>
            <p className="text-sm text-slate-500">{quote.email}</p>
          </div>
          <Badge className="border-0 text-[10px] font-bold">{quote.status}</Badge>
        </div>

        <div className="px-6 py-4 space-y-3">
          {quote.company && <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><Building2 className="size-4" /> {quote.company}</div>}
          {quote.phone && <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><Phone className="size-4" /> {quote.phone}</div>}
          {quote.service && <div className="text-sm text-slate-600 dark:text-slate-400">Service: {quote.service}</div>}
          {quote.businessType && <div className="text-sm text-slate-600 dark:text-slate-400">Business Type: {quote.businessType}</div>}
          <div className="text-sm text-slate-600 dark:text-slate-400">Preferred Contact: {quote.preferredContact}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="size-4" /> {new Date(quote.createdAt).toLocaleString()}
          </div>
        </div>

        {quote.message && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{quote.message}</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {["NEW", "REVIEWING", "CONTACTED", "QUOTED", "ACCEPTED", "DECLINED", "CLOSED"].map((s) => (
              <Button key={s} variant={quote.status === s ? "brand" : "outline"} size="sm" className="rounded-xl text-[11px]" onClick={() => updateStatus(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
