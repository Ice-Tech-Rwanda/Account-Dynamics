"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, Building2, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AdminInquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/inquiries/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setInquiry)
      .catch(() => toast.error("Failed to load inquiry"))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setInquiry((prev: any) => ({ ...prev, status }));
      toast.success(`Status updated to ${status}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;
  if (!inquiry) return <div className="p-8 text-center text-slate-400">Inquiry not found</div>;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/inquiries" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand mb-4">
        <ArrowLeft className="size-4" /> Back to Inquiries
      </Link>

      <div className="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">{inquiry.name}</h1>
            <p className="text-sm text-slate-500">{inquiry.email}</p>
          </div>
          <Badge className="border-0 text-[10px] font-bold">{inquiry.status}</Badge>
        </div>

        <div className="px-6 py-4 space-y-3">
          {inquiry.company && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Building2 className="size-4" /> {inquiry.company}
            </div>
          )}
          {inquiry.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Phone className="size-4" /> {inquiry.phone}
            </div>
          )}
          {inquiry.service && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <User className="size-4" /> Service: {inquiry.service}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="size-4" /> {new Date(inquiry.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Message</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{inquiry.message}</p>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {["NEW", "CONTACTED", "IN_PROGRESS", "QUALIFIED", "CONVERTED", "CLOSED", "SPAM"].map((s) => (
              <Button
                key={s}
                variant={inquiry.status === s ? "brand" : "outline"}
                size="sm"
                className="rounded-xl text-[11px]"
                onClick={() => updateStatus(s)}
              >
                {s.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
