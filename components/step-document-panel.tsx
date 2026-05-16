"use client"

import { useEffect, useState } from "react"
import { Download, FileText, Sparkles } from "lucide-react"

import {
  FieldLabelWithHelp,
  HelpChatButton,
} from "@/components/contextual-help/help-chat-button"
import { Button } from "@/components/ui/button"
import { saveDocumentSnapshot } from "@/lib/application-data-storage"
import { downloadTextDocument } from "@/lib/download-document"
import { downloadApplicationPdf } from "@/lib/download-pdf"
import { loadDemoExtracted } from "@/lib/demo/demo-storage"
import { valueForQuestion } from "@/lib/map-extracted-fields"
import type { Messages } from "@/lib/i18n"
import type { ProcessStep } from "@/lib/types"
import { cn } from "@/lib/utils"

type StepDocumentPanelProps = {
  processId: string
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  processTitle: string
}

export function StepDocumentPanel({
  processId,
  step,
  labels,
  processTitle,
}: StepDocumentPanelProps) {
  const questions = step.questions ?? []
  const doc = step.document!
  const extracted = loadDemoExtracted()?.fields ?? {}
  const hasIdData = Object.keys(extracted).length > 0

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [highlighted, setHighlighted] = useState<Record<string, boolean>>({})
  const [autofillDone, setAutofillDone] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  useEffect(() => {
    if (!hasIdData) return

    const keys = questions
      .map((q) => q.id)
      .filter((id) => valueForQuestion(questions.find((q) => q.id === id)!, extracted))

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
    setTimeout(() => {
      setGeneratingPdf(false)
      setGenerated(true)
    }, 500)
  }

  const canSubmit = questions.every((q) => (answers[q.id] ?? "").trim().length > 0)

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
        {questions.map((q) => (
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
              value={answers[q.id] ?? ""}
              onChange={(e) => {
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                setHighlighted((prev) => ({ ...prev, [q.id]: false }))
              }}
              placeholder={q.placeholder}
              disabled={!hasIdData}
              className={cn(
                "border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-3 text-sm transition-all duration-500 focus-visible:ring-3 focus-visible:outline-none disabled:opacity-60",
                highlighted[q.id] &&
                  "border-emerald-500/50 bg-emerald-500/10 ring-2 ring-emerald-500/25"
              )}
            />
          </FieldLabelWithHelp>
        ))}
      </div>

      {!generated ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="flex-1 gap-2"
            disabled={!canSubmit || !hasIdData || generatingPdf}
            onClick={downloadPdf}
          >
            {generatingPdf ? (
              <span className="animate-pulse">{labels.generatingPdf}</span>
            ) : (
              <>
                <Download className="size-4" />
                {labels.downloadPdf}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={!canSubmit || !hasIdData}
            onClick={() => {
              downloadTxt()
              setGenerated(true)
            }}
          >
            {labels.generateDocument}
          </Button>
        </div>
      ) : (
        <Button type="button" className="w-full gap-2" onClick={downloadPdf}>
          <Download className="size-4" />
          {labels.downloadPdf}
        </Button>
      )}
    </div>
  )
}
