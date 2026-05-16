"use client"

import { useRef, useState } from "react"
import { Camera, CheckCircle2 } from "lucide-react"

import { ExtractedFieldsReveal } from "@/components/demo/extracted-fields-reveal"
import { IdScanOverlay } from "@/components/demo/id-scan-overlay"
import { HelpChatButton } from "@/components/contextual-help/help-chat-button"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { saveUploadSnapshot } from "@/lib/application-data-storage"
import { snapshotFromUploadStep } from "@/lib/build-registration-packet"
import {
  VEHICLE_PAPER_FIELDS,
  getVehiclePaperFallback,
  pickVehiclePaperFields,
  vehicleFieldLabel,
} from "@/lib/demo/vehicle-paper-fields"
import { saveVehiclePaperExtracted } from "@/lib/demo/vehicle-paper-storage"
import type { Messages } from "@/lib/i18n"
import type { ProcessStep } from "@/lib/types"

const MIN_SCAN_MS = 2400

type VehiclePaperUploadPanelProps = {
  processId: string
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  onScanUpdate?: () => void
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function VehiclePaperUploadPanel({
  processId,
  step,
  labels,
  onScanUpdate,
}: VehiclePaperUploadPanelProps) {
  const { locale } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revealedFields, setRevealedFields] = useState<
    Array<{ key: string; label: string; value: string }>
  >([])
  const [done, setDone] = useState(false)
  const doc = step.document!

  async function extractFromImage(dataUrl: string) {
    const res = await fetch("/api/extract-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: dataUrl,
        documentName: doc.name,
        locale,
        context: "vehicle_papers",
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? labels.uploadFailed)
    const fallback = getVehiclePaperFallback(locale)
    return pickVehiclePaperFields({ ...fallback, ...(data.fields ?? {}) })
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

        try {
          const [fields] = await Promise.all([
            extractFromImage(dataUrl),
            delay(MIN_SCAN_MS),
          ])

          const rows = VEHICLE_PAPER_FIELDS.filter((def) => fields[def.key]).map(
            (def) => ({
              key: def.key,
              label: vehicleFieldLabel(def, locale),
              value: String(fields[def.key]),
            })
          )

          saveUploadSnapshot(processId, snapshotFromUploadStep(step, fields))
          saveVehiclePaperExtracted(fields)
          setRevealedFields(rows)
          setDone(true)
          onScanUpdate?.()
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

      {!done && !preview && (
        <Button
          type="button"
          variant="outline"
          className="h-auto w-full flex-col gap-2 border-dashed border-primary/40 py-8"
          onClick={() => inputRef.current?.click()}
          disabled={scanning}
        >
          <Camera className="size-8 text-primary" />
          <span className="font-medium">{labels.uploadPhoto}</span>
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
                setDone(false)
                if (inputRef.current) inputRef.current.value = ""
              }}
            >
              {labels.uploadAgain}
            </Button>
          )}
        </div>
      )}

      {revealedFields.length > 0 && !scanning && (
        <ExtractedFieldsReveal
          title={labels.vehicleExtracted}
          fields={revealedFields}
        />
      )}

      {done && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="size-5 shrink-0" />
          {labels.vehicleComplete}
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
