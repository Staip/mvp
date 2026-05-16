"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Download, FileText, Sparkles } from "lucide-react"

import { IdScanOverlay } from "@/components/demo/id-scan-overlay"
import {
  FieldLabelWithHelp,
  HelpChatButton,
} from "@/components/contextual-help/help-chat-button"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import {
  saveDocumentSnapshot,
  saveUploadSnapshot,
} from "@/lib/application-data-storage"
import {
  buildRegistrationPacket,
  snapshotFromUploadStep,
} from "@/lib/build-registration-packet"
import { isAutofillableQuestion } from "@/lib/document-step-questions"
import { downloadTextDocument } from "@/lib/download-document"
import { downloadApplicationPdf, downloadRegistrationPacket } from "@/lib/download-pdf"
import { loadDemoExtracted } from "@/lib/demo/demo-storage"
import { valueForQuestion } from "@/lib/map-extracted-fields"
import { maskIdCardNumber } from "@/lib/privacy-mask"
import type { Messages } from "@/lib/i18n"
import type { ProcessGuide, ProcessStep } from "@/lib/types"
import { cn } from "@/lib/utils"

const MIN_SCAN_MS = 2400

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

type StepDocumentPanelProps = {
  processId: string
  guide: ProcessGuide
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  processTitle: string
}

export function StepDocumentPanel({
  processId,
  guide,
  step,
  labels,
  processTitle,
}: StepDocumentPanelProps) {
  const { locale } = useLocale()
  const questions = step.questions ?? []
  const doc = step.document!
  const needsUpload = !!step.requiresAttachmentUpload
  const extracted = loadDemoExtracted()?.fields ?? {}
  const hasIdData = Object.keys(extracted).length > 0

  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [highlighted, setHighlighted] = useState<Record<string, boolean>>({})
  const [autofillDone, setAutofillDone] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [uploadFields, setUploadFields] = useState<Record<string, string> | null>(
    null
  )
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (!hasIdData) return

    const keys = questions
      .filter(
        (q) =>
          isAutofillableQuestion(q) &&
          Boolean(valueForQuestion(q, extracted)?.trim())
      )
      .map((q) => q.id)

    let i = 0
    const run = () => {
      if (i >= keys.length) {
        setAutofillDone(true)
        return
      }
      const key = keys[i]
      const q = questions.find((x) => x.id === key)!
      const value = valueForQuestion(q, extracted) ?? ""
      setAnswers((prev) => ({ ...prev, [key]: value }))
      setHighlighted((prev) => ({ ...prev, [key]: true }))
      i += 1
      setTimeout(run, 480)
    }

    const t = setTimeout(run, 350)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when panel opens with ID data
  }, [hasIdData, questions.length])

  useEffect(() => {
    if (!processId || questions.length === 0) return
    const hasAny = questions.some((q) => (answers[q.id] ?? "").trim())
    if (!hasAny) return
    saveDocumentSnapshot(processId, {
      stepId: step.id,
      stepTitle: step.title,
      documentName: doc.name,
      questions: questions.map((q) => ({ id: q.id, label: q.label })),
      answers,
    })
  }, [answers, processId, step, doc.name, questions])

  async function extractFromImage(dataUrl: string) {
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
    return data.fields ?? {}
  }

  async function handleUploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError(labels.uploadInvalid)
      return
    }
    setUploadError(null)
    setUploadFields(null)

    const reader = new FileReader()
    reader.onload = () => {
      void (async () => {
        const dataUrl = reader.result as string
        setUploadPreview(dataUrl)
        setScanning(true)
        try {
          const [fields] = await Promise.all([
            extractFromImage(dataUrl),
            delay(MIN_SCAN_MS),
          ])
          setUploadFields(fields)
          saveUploadSnapshot(
            processId,
            snapshotFromUploadStep(
              { ...step, kind: "upload", document: doc },
              fields
            )
          )
        } catch (e) {
          setUploadError(e instanceof Error ? e.message : labels.uploadFailed)
          setUploadPreview(null)
          if (uploadInputRef.current) uploadInputRef.current.value = ""
        } finally {
          setScanning(false)
        }
      })()
    }
    reader.readAsDataURL(file)
  }

  function downloadTxt() {
    const lines = [
      `SPLITFLOW — ${processTitle}`,
      `Document: ${doc.name}`,
      "",
      ...questions.map((q) => `${q.label}: ${answers[q.id] ?? ""}`),
      "",
      `Note: ${doc.note}`,
      "",
      labels.downloadFooter,
    ]
    const safeName = doc.name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
    downloadTextDocument(`${safeName || "document"}.txt`, lines)
  }

  function downloadPdf() {
    setGeneratingPdf(true)
    if (needsUpload && uploadFields) {
      const packet = buildRegistrationPacket({
        guide,
        currentStep: { ...step, kind: "upload", document: doc },
        currentUploadFields: uploadFields,
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
    } else {
      const rows = questions.map((q) => ({
        label: q.label,
        value: answers[q.id] ?? "",
      }))
      downloadApplicationPdf(
        "splitflow-application.pdf",
        `${processTitle} — ${doc.name}`,
        rows,
        labels.downloadFooter
      )
    }
    setTimeout(() => {
      setGeneratingPdf(false)
      setGenerated(true)
    }, 500)
  }

  const questionsComplete = questions.every(
    (q) => (answers[q.id] ?? "").trim().length > 0
  )
  const uploadComplete = !needsUpload || !!uploadFields
  const canSubmit = questionsComplete && uploadComplete && hasIdData

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-background p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-medium">
            <FileText className="size-4 text-primary" />
            {doc.name}
          </p>
          <HelpChatButton
            scope="document_step"
            step={step}
            documentName={doc.name}
          />
        </div>
        <p className="text-muted-foreground mt-1 text-xs">{doc.note}</p>
      </div>

      {!hasIdData ? (
        <p className="text-muted-foreground rounded-lg border border-dashed px-3 py-3 text-sm">
          {labels.completeIdScanFirst}
        </p>
      ) : (
        autofillDone && (
          <p className="flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-primary">
            <Sparkles className="size-4 shrink-0 animate-pulse" />
            {labels.autofillFromId}
          </p>
        )
      )}

      <p className="text-muted-foreground text-sm">{labels.questionsIntro}</p>

      <div className="space-y-3">
        {questions.map((q) => {
          const raw = answers[q.id] ?? ""
          const isMaskedId = q.id === "idCardNumber" && raw.length > 0
          return (
            <FieldLabelWithHelp
              key={q.id}
              label={q.label}
              scope="document_field"
              step={step}
              field={{ id: q.id, label: q.label, placeholder: q.placeholder }}
              documentName={doc.name}
            >
              <input
                type="text"
                value={isMaskedId ? maskIdCardNumber(raw) : raw}
                readOnly={isMaskedId}
                onChange={(e) => {
                  if (isMaskedId) return
                  setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  setHighlighted((prev) => ({ ...prev, [q.id]: false }))
                }}
                placeholder={q.placeholder}
                disabled={!hasIdData}
                aria-label={q.label}
                className={cn(
                  "border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-3 text-sm transition-all duration-500 focus-visible:ring-3 focus-visible:outline-none disabled:opacity-60",
                  highlighted[q.id] &&
                    "border-emerald-500/50 bg-emerald-500/10 ring-2 ring-emerald-500/25",
                  isMaskedId && "font-mono tracking-wide"
                )}
              />
            </FieldLabelWithHelp>
          )
        })}
      </div>

      {needsUpload && (
        <div className="space-y-3 border-t border-border/80 pt-4">
          <p className="text-sm font-medium">{labels.documentUploadInStep}</p>
          <p className="text-muted-foreground text-xs">
            {step.uploadHint ?? labels.uploadIntro}
          </p>

          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleUploadFile(file)
            }}
          />

          {!uploadPreview ? (
            <Button
              type="button"
              variant="outline"
              className="h-auto w-full flex-col gap-2 border-dashed py-6"
              disabled={!hasIdData || scanning}
              onClick={() => uploadInputRef.current?.click()}
            >
              <Camera className="size-7 text-primary" />
              <span className="text-sm">{labels.uploadPhoto}</span>
            </Button>
          ) : (
            <div className="relative overflow-hidden rounded-lg border-2 border-primary/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadPreview}
                alt=""
                className="max-h-40 w-full object-contain bg-black/5"
              />
              {scanning && <IdScanOverlay scanningLabel={labels.idScanning} />}
              {!scanning && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 bottom-2"
                  onClick={() => {
                    setUploadPreview(null)
                    setUploadFields(null)
                    if (uploadInputRef.current) uploadInputRef.current.value = ""
                  }}
                >
                  {labels.uploadAgain}
                </Button>
              )}
            </div>
          )}

          {uploadError && (
            <p className="text-destructive text-sm" role="alert">
              {uploadError}
            </p>
          )}

          {uploadFields && !scanning && (
            <p className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
              <Sparkles className="size-3.5" />
              {labels.extractedFields}
            </p>
          )}
        </div>
      )}

      {!generated ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="flex-1 gap-2"
            disabled={!canSubmit || generatingPdf}
            onClick={downloadPdf}
          >
            {generatingPdf ? (
              <span className="animate-pulse">{labels.generatingPdf}</span>
            ) : (
              <>
                <Download className="size-4" />
                {needsUpload ? labels.downloadPackagePdf : labels.downloadPdf}
              </>
            )}
          </Button>
          {!needsUpload && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={!canSubmit}
              onClick={() => {
                downloadTxt()
                setGenerated(true)
              }}
            >
              {labels.generateDocument}
            </Button>
          )}
        </div>
      ) : (
        <Button type="button" className="w-full gap-2" onClick={downloadPdf}>
          <Download className="size-4" />
          {needsUpload ? labels.downloadPackagePdf : labels.downloadPdf}
        </Button>
      )}
    </div>
  )
}
