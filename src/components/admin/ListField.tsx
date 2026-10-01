"use client"

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/admin/ImageUpload"

/**
 * Parses a Prisma JSON-text column into an array of strings.
 * Tolerates null/empty strings, JSON arrays, comma/newline separated text,
 * and single strings so partially-migrated rows still render.
 */
export function parseStringList(raw: unknown): string[] {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw.map((v) => String(v ?? "")).filter(Boolean)
  if (typeof raw !== "string") return []
  const trimmed = raw.trim()
  if (!trimmed) return []
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed.map((v) => String(v ?? "")).filter(Boolean)
    } catch {
      // fall through to delimiter split
    }
  }
  return trimmed
    .split(/\r?\n|,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Parses a Prisma JSON-text column into an array of objects. */
export function parseObjectList<T extends Record<string, any>>(raw: unknown, keys: string[]): T[] {
  if (raw == null) return []
  let parsed: unknown = raw
  if (typeof raw === "string") {
    const trimmed = raw.trim()
    if (!trimmed) return []
    if (!trimmed.startsWith("[")) return []
    try {
      parsed = JSON.parse(trimmed)
    } catch {
      return []
    }
  }
  if (!Array.isArray(parsed)) return []
  return parsed
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const out: Record<string, any> = {}
      for (const key of keys) out[key] = (item as Record<string, any>)[key] ?? ""
      return out as T
    })
}

interface StringListFieldProps {
  label: string
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  itemLabel?: string
  addLabel?: string
}

/** Editable list of plain strings (highlights, inclusions, exclusions, ...). */
export function StringListField({
  label,
  value,
  onChange,
  placeholder,
  itemLabel = "item",
  addLabel = "Add",
}: StringListFieldProps) {
  const update = (index: number, next: string) => {
    const copy = [...value]
    copy[index] = next
    onChange(copy)
  }
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index))
  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= value.length) return
    const copy = [...value]
    const [moved] = copy.splice(index, 1)
    copy.splice(target, 0, moved)
    onChange(copy)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-lg gap-1 text-xs"
          onClick={() => onChange([...value, ""])}
        >
          <Plus className="size-3" /> {addLabel} {itemLabel}
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="mt-1.5 text-[11px] text-slate-400">
          No {itemLabel}s yet. Use “{addLabel} {itemLabel}” to create one.
        </p>
      ) : (
        <div className="mt-2 space-y-2">
          {value.map((entry, index) => (
            <div key={index} className="flex items-start gap-1.5">
              <span className="mt-2 w-5 shrink-0 text-center text-[10px] font-bold text-slate-400">
                {index + 1}
              </span>
              <textarea
                value={entry}
                onChange={(e) => update(index, e.target.value)}
                placeholder={placeholder}
                rows={2}
                className="flex-1 resize-y rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="flex shrink-0 flex-col gap-0.5">
                <button
                  type="button"
                  aria-label="Move up"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-800"
                >
                  <ArrowUp className="size-3" />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  onClick={() => move(index, 1)}
                  disabled={index === value.length - 1}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-800"
                >
                  <ArrowDown className="size-3" />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${itemLabel}`}
                  onClick={() => remove(index)}
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ImageListFieldProps {
  label: string
  value: string[]
  onChange: (next: string[]) => void
  addLabel?: string
}

/** Editable gallery of image URLs with per-item upload support. */
export function ImageListField({ label, value, onChange, addLabel = "Add image" }: ImageListFieldProps) {
  const update = (index: number, next: string) => {
    const copy = [...value]
    copy[index] = next
    onChange(copy)
  }
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index))
  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= value.length) return
    const copy = [...value]
    const [moved] = copy.splice(index, 1)
    copy.splice(target, 0, moved)
    onChange(copy)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-lg gap-1 text-xs"
          onClick={() => onChange([...value, ""])}
        >
          <Plus className="size-3" /> {addLabel}
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-[11px] text-slate-400">No images yet. Add one to build the gallery.</p>
      ) : (
        <div className="space-y-3">
          {value.map((url, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Image {index + 1}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-700"
                  >
                    <ArrowUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                    className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-700"
                  >
                    <ArrowDown className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => remove(index)}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
              <ImageUpload
                label={`Image ${index + 1}`}
                value={url}
                onChange={(next) => update(index, next)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export interface ObjectListSubField {
  name: string
  label: string
  type?: "text" | "textarea"
  placeholder?: string
}

interface ObjectListFieldProps<T extends Record<string, any>> {
  label: string
  value: T[]
  onChange: (next: T[]) => void
  subFields: ObjectListSubField[]
  addLabel?: string
  itemLabel?: string
}

/** Editable list of objects (e.g. itinerary days with heading + body). */
export function ObjectListField<T extends Record<string, any>>({
  label,
  value,
  onChange,
  subFields,
  addLabel = "Add",
  itemLabel = "entry",
}: ObjectListFieldProps<T>) {
  const blank = () =>
    subFields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {} as Record<string, any>)

  const update = (index: number, field: string, next: string) => {
    const copy = [...value]
    copy[index] = { ...(copy[index] ?? (blank() as T)), [field]: next }
    onChange(copy)
  }
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index))
  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= value.length) return
    const copy = [...value]
    const [moved] = copy.splice(index, 1)
    copy.splice(target, 0, moved)
    onChange(copy)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-lg gap-1 text-xs"
          onClick={() => onChange([...value, blank() as T])}
        >
          <Plus className="size-3" /> {addLabel} {itemLabel}
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="mt-1.5 text-[11px] text-slate-400">
          No {itemLabel}s yet. Use “{addLabel} {itemLabel}” to create one.
        </p>
      ) : (
        <div className="mt-2 space-y-2.5">
          {value.map((entry, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {itemLabel} {index + 1}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-700"
                  >
                    <ArrowUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                    className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30 dark:hover:bg-slate-700"
                  >
                    <ArrowDown className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${itemLabel}`}
                    onClick={() => remove(index)}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {subFields.map((f) =>
                  f.type === "textarea" ? (
                    <div key={f.name}>
                      <Label className="text-[10px] font-medium text-slate-500">{f.label}</Label>
                      <textarea
                        value={(entry as Record<string, any>)[f.name] ?? ""}
                        onChange={(e) => update(index, f.name, e.target.value)}
                        placeholder={f.placeholder}
                        rows={3}
                        className="mt-1 block w-full resize-y rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  ) : (
                    <div key={f.name}>
                      <Label className="text-[10px] font-medium text-slate-500">{f.label}</Label>
                      <Input
                        value={(entry as Record<string, any>)[f.name] ?? ""}
                        onChange={(e) => update(index, f.name, e.target.value)}
                        placeholder={f.placeholder}
                        className="mt-1 h-8 rounded-lg text-xs"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}