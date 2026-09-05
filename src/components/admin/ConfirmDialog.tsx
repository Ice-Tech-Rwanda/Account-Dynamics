"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const [busy, setBusy] = useState(false)

  const handleConfirm = async () => {
    if (busy) return
    setBusy(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent className="max-w-sm p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-500/10">
            <AlertTriangle className="size-5 text-red-500" />
          </div>
          <div className="flex-1">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-2">{message}</DialogDescription>
          </div>
        </div>
        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="rounded-xl">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" size="sm" className="rounded-xl" onClick={handleConfirm} disabled={busy}>
            {busy ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}