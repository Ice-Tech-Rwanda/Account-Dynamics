"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
}

/**
 * Direct image upload field with a URL fallback.
 * Uploads go through the media library endpoint and return a usable URL.
 * Reuse everywhere an image/photo/logo is required (team, services, logos, etc.).
 */
export function ImageUpload({
  label,
  value,
  onChange,
  placeholder = "/uploads/... or https://...",
  accept = "image/*",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    try {
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errors?.length) {
          toast.error(`${json.errors[0].filename}: ${json.errors[0].error}`);
        } else {
          toast.error(json.error || "Upload failed");
        }
        return;
      }
      const uploaded = json.uploaded?.[0];
      if (uploaded?.url) {
        onChange(uploaded.url);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload succeeded but no URL returned");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const applyDraft = () => {
    const url = draft.trim();
    if (!url) return;
    onChange(url);
    setDraft("");
  };

  return (
    <div>
      <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</Label>

      <div className="mt-1.5 flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="size-5 text-slate-300" />
          )}
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              type="button"
              variant="brand"
              size="sm"
              className="rounded-lg gap-1.5"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="size-3.5" />
              {uploading ? "Uploading..." : "Upload"}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-lg gap-1.5 text-slate-500 hover:text-red-500"
                onClick={() => onChange("")}
              >
                <Trash2 className="size-3.5" /> Clear
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyDraft();
                }
              }}
              placeholder={placeholder}
              className="h-8 rounded-lg text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs"
              onClick={applyDraft}
            >
              Use URL
            </Button>
          </div>
          {value && (
            <p className="text-[10px] text-slate-400 break-all">Current: {value}</p>
          )}
        </div>
      </div>
    </div>
  );
}
