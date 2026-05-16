"use client"

import { useRef, useState } from "react"
import { Camera, Download, Loader2, Sparkles } from "lucide-react"

import { HelpChatButton } from "@/components/contextual-help/help-chat-button"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { saveUploadSnapshot } from "@/lib/application-data-storage"
import {
  buildRegistrationPacket,
  labelForField,
  snapshotFromUploadStep,
} from "@/lib/build-registration-packet"
import { downloadRegistrationPacket } from "@/lib/download-pdf"
import type { Messages } from "@/lib/i18n"
import type { ProcessGuide, ProcessStep } from "@/lib/types"

type StepUploadPanelProps = {
  processId: string
  guide: ProcessGuide
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  processTitle: string
}

export function StepUploadPanel({
  processId,
  guide,
  step,
  labels,
}: StepUploadPanelProps) {
  const { locale } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)
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
        const extracted = data.fields ?? {}
        setFields(extracted)
        saveUploadSnapshot(processId, snapshotFromUploadStep(step, extracted))
      } catch (e) {
        setError(e instanceof Error ? e.message : labels.uploadFailed)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function downloadPacket() {
    if (!fields) return
    setGeneratingPdf(true)
    saveUploadSnapshot(processId, snapshotFromUploadStep(step, fields))
    const packet = buildRegistrationPacket({
      guide,
      currentStep: step,
      currentUploadFields: fields,
      locale,
      labels: {
        applicantSection: labels.pdfApplicantSection,
        vehicleSection: labels.pdfVehicleSection,
        priorUploadsSection: labels.pdfPriorUploadsSection,
        attachmentsSection: labels.pdfAttachmentsSection,
        idSubsection: labels.pdfIdSubsection,
        footer: labels.downloadFooter,
      },
    })
    downloadRegistrationPacket(packet)
    setTimeout(() => setGeneratingPdf(false), 600)
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
              <div
                key={key}
                className="flex justify-between gap-2 border-b border-border/50 pb-2 last:border-0"
              >
                <dt className="text-muted-foreground">
                  {labelForField(key, locale)}
                </dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <Button
            type="button"
            className="w-full gap-2"
            disabled={generatingPdf}
            onClick={downloadPacket}
          >
            {generatingPdf ? (
              <span className="animate-pulse">{labels.generatingPdf}</span>
            ) : (
              <>
                <Download className="size-4" />
                {labels.downloadPackagePdf}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
