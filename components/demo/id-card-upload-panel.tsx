"use client"

import { useRef, useState } from "react"
import { Camera, CheckCircle2 } from "lucide-react"

import { ExtractedFieldsReveal } from "@/components/demo/extracted-fields-reveal"
import { IdScanOverlay } from "@/components/demo/id-scan-overlay"
import { HelpChatButton } from "@/components/contextual-help/help-chat-button"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import {
  DEMO_BACK_FIELDS,
  DEMO_FRONT_FIELDS,
  fieldLabel,
  getDemoFallbackFields,
} from "@/lib/demo/demo-fields"
import {
  isDemoIdScanComplete,
  mergeDemoFields,
} from "@/lib/demo/demo-storage"
import type { Messages } from "@/lib/i18n"
import type { ProcessStep } from "@/lib/types"
import { cn } from "@/lib/utils"

const MIN_SCAN_MS = 2400

type IdCardUploadPanelProps = {
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  processTitle: string
  onScanUpdate?: () => void
}

type Side = "front" | "back"

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function IdCardUploadPanel({
  step,
  labels,
  onScanUpdate,
}: IdCardUploadPanelProps) {
  const { locale } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const [side, setSide] = useState<Side>("front")
  const [preview, setPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revealedFields, setRevealedFields] = useState<
    Array<{ key: string; label: string; value: string }>
  >([])
  const [frontDone, setFrontDone] = useState(false)
  const [backDone, setBackDone] = useState(false)
  const doc = step.document!

  async function extractFromImage(dataUrl: string, scanSide: Side) {
    const res = await fetch("/api/extract-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: dataUrl,
        documentName: doc.name,
        locale,
        side: scanSide,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? labels.uploadFailed)
    const fallback = getDemoFallbackFields(scanSide, locale)
    return { ...fallback, ...(data.fields ?? {}) }
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError(labels.uploadInvalid)
      return
    }
    setError(null)
    setRevealedFields([])

    const reader = new FileReader()
    reader.onload = () => {
      void (async () => {
        const dataUrl = reader.result as string
        setPreview(dataUrl)
        setScanning(true)

        const scanSide = side
        try {
          const [fields] = await Promise.all([
            extractFromImage(dataUrl, scanSide),
            delay(MIN_SCAN_MS),
          ])

          const defs = scanSide === "front" ? DEMO_FRONT_FIELDS : DEMO_BACK_FIELDS
          const rows = defs
            .filter((def) => fields[def.key])
            .map((def) => ({
              key: def.key,
              label: fieldLabel(def, locale),
              value: String(fields[def.key]),
            }))

          mergeDemoFields(fields, scanSide)
          onScanUpdate?.()
          setRevealedFields(rows)

          if (scanSide === "front") {
            setFrontDone(true)
            setSide("back")
            setPreview(null)
            if (inputRef.current) inputRef.current.value = ""
          } else {
            setBackDone(true)
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : labels.uploadFailed)
          setPreview(null)
        } finally {
          setScanning(false)
        }
      })()
    }
    reader.readAsDataURL(file)
  }

  const allDone = isDemoIdScanComplete() || (frontDone && backDone)
  const uploadLabel = side === "front" ? labels.idUploadFront : labels.idUploadBack
  const stepLabel = side === "front" ? labels.idStepFront : labels.idStepBack

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          {step.uploadHint ?? labels.uploadIntro}
        </p>
        <HelpChatButton scope="upload" step={step} documentName={doc.name} />
      </div>

      <div className="flex gap-2">
        {(["front", "back"] as const).map((s) => {
          const done = s === "front" ? frontDone : backDone
          const active = side === s && !allDone
          return (
            <div
              key={s}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                done &&
                  "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
                active && !done && "border-primary bg-primary/10 text-primary",
                !done && !active && "border-border text-muted-foreground"
              )}
            >
              {done ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <span className="bg-muted flex size-4 items-center justify-center rounded-full text-[0.6rem]">
                  {s === "front" ? "1" : "2"}
                </span>
              )}
              {s === "front" ? labels.idStepFront : labels.idStepBack}
            </div>
          )
        })}
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

      {!allDone && !preview && (
        <Button
          type="button"
          variant="outline"
          className="h-auto w-full flex-col gap-2 border-dashed border-primary/40 py-8"
          onClick={() => inputRef.current?.click()}
          disabled={scanning}
        >
          <Camera className="size-8 text-primary" />
          <span className="font-medium">{uploadLabel}</span>
          <span className="text-muted-foreground text-xs">{stepLabel}</span>
        </Button>
      )}

      {preview && (
        <div className="relative overflow-hidden rounded-lg border-2 border-primary/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className="max-h-44 w-full object-contain bg-black/5"
          />
          {scanning && <IdScanOverlay scanningLabel={labels.idScanning} />}
          {!scanning && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute right-2 bottom-2"
              onClick={() => {
                setPreview(null)
                setRevealedFields([])
                if (inputRef.current) inputRef.current.value = ""
              }}
            >
              {labels.idRetake}
            </Button>
          )}
        </div>
      )}

      {revealedFields.length > 0 && !scanning && (
        <ExtractedFieldsReveal
          title={labels.idExtracted}
          fields={revealedFields}
        />
      )}

      {frontDone && !backDone && !preview && !scanning && (
        <p className="text-center text-sm font-medium text-primary">
          {labels.idContinueBack} →
        </p>
      )}

      {allDone && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="size-5 shrink-0" />
          {labels.idComplete}
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
