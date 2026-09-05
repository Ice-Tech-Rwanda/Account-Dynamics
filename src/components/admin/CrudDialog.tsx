"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/admin/ImageUpload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Field {
  name: string
  label: string
  type?: "text" | "email" | "number" | "textarea" | "select" | "date" | "checkbox" | "image"
  options?: { label: string; value: string }[]
  required?: boolean
  placeholder?: string
  min?: number
}

interface CrudDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: Record<string, string | number | boolean>) => Promise<void>
  fields: Field[]
  initial?: Record<string, any>
  title: string
}

export function CrudDialog({ open, onClose, onSave, fields, initial, title }: CrudDialogProps) {
  if (!open) return null

  // Re-mount the inner form every time the dialog opens so state resets for a
  // create and pre-fills the correct data for an edit (prevents stale data).
  return (
    <CrudDialogInner
      key={initial?.id ?? "create"}
      onClose={onClose}
      onSave={onSave}
      fields={fields}
      initial={initial}
      title={title}
    />
  )
}

function CrudDialogInner({
  onClose,
  onSave,
  fields,
  initial,
  title,
}: Omit<CrudDialogProps, "open">) {
  const [form, setForm] = useState<Record<string, any>>(initial ?? {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = () => {
    for (const f of fields) {
      const value = form[f.name]
      if (f.required && (value === undefined || value === null || value === "")) {
        setError(`${f.label} is required.`)
        return false
      }
    }
    return true
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
      onClose()
    } catch (e: any) {
      setError(e?.message ?? "Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 px-3 py-2 text-xs text-red-700 dark:text-red-300"
            >
              {error}
            </div>
          )}
          {fields.map((f) => (
            <div key={f.name}>
              {f.type === "image" ? (
                <ImageUpload
                  label={f.label}
                  value={form[f.name] ?? ""}
                  onChange={(url) => setForm({ ...form, [f.name]: url })}
                  placeholder={f.placeholder}
                />
              ) : (
                <>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">{f.label}</Label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-brand/50 focus:ring-1 focus:ring-brand/20 outline-none resize-y min-h-[80px]"
                      placeholder={f.placeholder}
                      required={f.required}
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-brand/50 focus:ring-1 focus:ring-brand/20 outline-none"
                      required={f.required}
                    >
                      <option value="">Select...</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : f.type === "checkbox" ? (
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(form[f.name])}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
                        className="size-4 rounded border-slate-300 text-brand focus:ring-brand/30"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{f.label}</span>
                    </div>
                  ) : (
                    <Input
                      type={f.type ?? "text"}
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                      className="mt-1 rounded-xl"
                      placeholder={f.placeholder}
                      required={f.required}
                      min={f.min}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={onClose}>Cancel</Button>
          <Button variant="brand" size="sm" className="rounded-xl" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}