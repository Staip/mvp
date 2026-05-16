"use client"

import { useState } from "react"
import { Download, FileText } from "lucide-react"

import {
  FieldLabelWithHelp,
  HelpChatButton,
} from "@/components/contextual-help/help-chat-button"
import { Button } from "@/components/ui/button"
import { downloadTextDocument } from "@/lib/download-document"
import type { Messages } from "@/lib/i18n"
import type { ProcessStep } from "@/lib/types"

type StepDocumentPanelProps = {
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  processTitle: string
}

export function StepDocumentPanel({
  step,
  labels,
  processTitle,
}: StepDocumentPanelProps) {
  const questions = step.questions ?? []
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [generated, setGenerated] = useState(false)

  const doc = step.document!

  function download() {
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

  const canGenerate = questions.every((q) => (answers[q.id] ?? "").trim().length > 0)

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
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
              placeholder={q.placeholder}
              className="border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-3 text-sm focus-visible:ring-3 focus-visible:outline-none"
            />
          </FieldLabelWithHelp>
        ))}
      </div>

      {!generated ? (
        <Button
          type="button"
          className="w-full"
          disabled={!canGenerate}
          onClick={() => setGenerated(true)}
        >
          {labels.generateDocument}
        </Button>
      ) : (
        <Button type="button" className="w-full gap-2" onClick={download}>
          <Download className="size-4" />
          {labels.downloadDocument}
        </Button>
      )}
    </div>
  )
}
