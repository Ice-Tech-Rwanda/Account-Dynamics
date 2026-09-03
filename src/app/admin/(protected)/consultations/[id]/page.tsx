"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  Archive,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  CONTACTED: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  CONFIRMED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  CANCELLED: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
  SPAM: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

export default function AdminConsultationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/consultations/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setItem)
      .catch(() => toast.error("Failed to load consultation"))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/admin/consultations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setItem((prev: any) => ({ ...prev, status }));
      toast.success(`Status updated to ${status}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const toggleArchive = async () => {
    const archived = !item.archived;
    const res = await fetch(`/api/admin/consultations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived }),
    });
    if (res.ok) {
      setItem((prev: any) => ({ ...prev, archived }));
      toast.success(archived ? "Consultation archived" : "Consultation unarchived");
    } else {
      toast.error("Failed to update archive status");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading consultation...</div>;
  if (!item) return <div className="p-8 text-center text-slate-400">Consultation not found</div>;

  const cleanPhone = item.phone ? item.phone.replace(/[^0-9]/g, "") : null;
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${item.name}, confirming your consultation request with Account Dynamics.`)}`
    : null;

  return (
    <div className="max-w-3xl space-y-4">
      <Link
        href="/admin/consultations"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Back to Consultations
      </Link>

      <div className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50 overflow-hidden shadow-sm">
        {/* Header banner */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">{item.name}</h1>
              {item.archived && (
                <Badge className="bg-slate-200 text-slate-700 border-0 text-[10px]">Archived</Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{item.email}</p>
          </div>
          <Badge className={`${STATUS_COLORS[item.status] ?? ""} border-0 text-[11px] font-bold px-3 py-1`}>
            {item.status}
          </Badge>
        </div>

        {/* Action bar */}
        <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 flex flex-wrap gap-2">
          <a
            href={`mailto:${item.email}?subject=Account Dynamics Consultation Confirmation`}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 transition-colors"
          >
            <Mail className="size-3.5 text-blue-500" />
            Email Client
          </a>

          {item.phone && (
            <a
              href={`tel:${item.phone.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 transition-colors"
            >
              <Phone className="size-3.5 text-emerald-500" />
              Call Client
            </a>
          )}

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 transition-colors"
            >
              <MessageCircle className="size-3.5 text-green-500" />
              WhatsApp
            </a>
          )}

          <button
            onClick={toggleArchive}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 transition-colors ml-auto"
          >
            <Archive className="size-3.5 text-slate-400" />
            {item.archived ? "Unarchive" : "Archive"}
          </button>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone</span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {item.phone || "Not provided"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Topic / Service</span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {item.service || "General Consultation"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Preferred Date</span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-brand" />
              {item.preferredDate || "Any date available"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Preferred Time Slot</span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="size-3.5 text-brand" />
              {item.preferredTime || "Flexible"}
            </p>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Submitted At</span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Client message / notes */}
        {item.message && (
          <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Consultation Notes &amp; Topics</span>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {item.message}
            </div>
          </div>
        )}

        {/* Status updates */}
        <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Update Booking Status</span>
          <div className="flex flex-wrap gap-2">
            {["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED", "SPAM"].map((s) => {
              const active = item.status === s;
              return (
                <Button
                  key={s}
                  variant={active ? "brand" : "outline"}
                  size="sm"
                  className="rounded-xl text-[11px]"
                  onClick={() => updateStatus(s)}
                >
                  {active && <CheckCircle2 className="size-3 mr-1" />}
                  {s}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
