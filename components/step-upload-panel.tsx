"use client"

import { useRef, useState } from "react"
import { Camera, Download, Loader2, Sparkles } from "lucide-react"

import { HelpChatButton } from "@/components/contextual-help/help-chat-button"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { downloadTextDocument } from "@/lib/download-document"
import type { Messages } from "@/lib/i18n"
import type { ProcessStep } from "@/lib/types"

type StepUploadPanelProps = {
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  processTitle: string
}

export function StepUploadPanel({
  step,
  labels,
  processTitle,
}: StepUploadPanelProps) {
  const { locale } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const doc = step.document!

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError(labels.uploadInvalid)
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      setLoading(true)
      setFields(null)
      try {
        const res = await fetch("/api/extract-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: dataUrl,
            documentName: doc.name,
            locale,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? labels.uploadFailed)
        setFields(data.fields ?? {})
      } catch (e) {
        setError(e instanceof Error ? e.message : labels.uploadFailed)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function downloadPrefilled() {
    if (!fields) return
    const lines = [
      `SPLITFLOW — ${processTitle}`,
      `Prefilled from photo: ${doc.name}`,
      "",
      ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`),
      "",
      labels.downloadFooter,
    ]
    downloadTextDocument("prefilled-document.txt", lines)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          {step.uploadHint ?? labels.uploadIntro}
        </p>
        <HelpChatButton scope="upload" step={step} documentName={doc.name} />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />

      {!preview ? (
        <Button
          type="button"
          variant="outline"
          className="h-auto w-full flex-col gap-2 py-8"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="size-8 text-primary" />
          <span>{labels.uploadPhoto}</span>
        </Button>
      ) : (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className="max-h-40 w-full rounded-lg border object-contain"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setPreview(null)
              setFields(null)
              if (inputRef.current) inputRef.current.value = ""
            }}
          >
            {labels.uploadAgain}
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-4 text-sm">
          <Loader2 className="size-4 animate-spin" />
          {labels.uploadAnalyzing}
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      {fields && !loading && (
        <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-primary" />
            {labels.extractedFields}
          </p>
          <dl className="space-y-2 text-sm">
            {Object.entries(fields).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-2 border-b border-border/50 pb-2 last:border-0">
                <dt className="text-muted-foreground capitalize">{key}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <Button type="button" className="w-full gap-2" onClick={downloadPrefilled}>
            <Download className="size-4" />
            {labels.downloadDocument}
          </Button>
        </div>
      )}
    </div>
  )
}
