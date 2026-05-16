"use client"

import { useEffect, useRef } from "react"
import { Printer, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { printRegistrationPacketHtml } from "@/lib/download-pdf"
import { cn } from "@/lib/utils"

type RegistrationPdfPreviewDialogProps = {
  open: boolean
  onClose: () => void
  html: string
  title: string
  printLabel: string
  closeLabel: string
}

export function RegistrationPdfPreviewDialog({
  open,
  onClose,
  html,
  title,
  printLabel,
  closeLabel,
}: RegistrationPdfPreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none",
        "border-0 bg-black/55 p-0 backdrop:bg-black/40"
      )}
      aria-labelledby="pdf-preview-title"
    >
      <div className="flex h-full flex-col p-3 sm:p-6">
        <div
          className="bg-card mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-xl border shadow-2xl"
          role="document"
        >
          <div className="border-border flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
            <h2 id="pdf-preview-title" className="text-sm font-semibold sm:text-base">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={() => printRegistrationPacketHtml(html, "registration-packet.pdf")}
              >
                <Printer className="size-4" />
                {printLabel}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={onClose}>
                <X className="size-4 sm:mr-1" />
                <span className="hidden sm:inline">{closeLabel}</span>
              </Button>
            </div>
          </div>
          <div className="bg-muted/40 min-h-0 flex-1 overflow-hidden p-2 sm:p-3">
            <iframe
              title={title}
              srcDoc={html}
              className="bg-white h-full w-full rounded-md border shadow-inner"
            />
          </div>
        </div>
      </div>
    </dialog>
  )
}
