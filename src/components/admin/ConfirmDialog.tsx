import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  title?: string
  message?: string
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete item?",
  message = "This action cannot be undone.",
}: ConfirmDialogProps) {
  if (!open) return null

  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/10">
            <AlertTriangle className="size-5 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="size-4" /></button>
            </div>
            <p className="mt-2 text-xs text-slate-500">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" size="sm" className="rounded-xl" onClick={handleConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  )
}
