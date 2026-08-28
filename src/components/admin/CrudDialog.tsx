import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface Field {
  name: string
  label: string
  type?: "text" | "email" | "number" | "textarea" | "select" | "date"
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
  const [form, setForm] = useState<Record<string, any>>(initial ?? {})
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="size-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {fields.map((f) => (
            <div key={f.name}>
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
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={onClose}>Cancel</Button>
          <Button variant="brand" size="sm" className="rounded-xl" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
