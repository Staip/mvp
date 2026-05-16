"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  ChevronDown,
  Lock,
  Camera,
  FileText,
  MapPin,
} from "lucide-react"

import { IdCardUploadPanel } from "@/components/demo/id-card-upload-panel"
import { isIdScanStep } from "@/lib/id-scan-step"
import { HelpChatButton } from "@/components/contextual-help/help-chat-button"
import { StepDocumentPanel } from "@/components/step-document-panel"
import { StepUploadPanel } from "@/components/step-upload-panel"
import { StepVisitPanel } from "@/components/step-visit-panel"
import { Button } from "@/components/ui/button"
import type { Messages } from "@/lib/i18n"
import type { ProcessGuide, ProcessStep, StepKind } from "@/lib/types"
import { isDemoIdScanComplete } from "@/lib/demo/demo-storage"
import { cn } from "@/lib/utils"

type GuideStepListProps = {
  processId: string
  guide: ProcessGuide
  labels: Messages["copilot"]["guide"]
  checked: Record<string, boolean>
  onCheckedChange: (stepId: string, value: boolean) => void
  onStepCompleted?: (step: ProcessStep) => void
}

const KIND_ICON: Record<StepKind, typeof FileText> = {
  document: FileText,
  upload: Camera,
  visit: MapPin,
}

export function GuideStepList({
  processId,
  guide,
  labels,
  checked,
  onCheckedChange,
  onStepCompleted,
}: GuideStepListProps) {
  const currentStepIndex = useMemo(() => {
    const idx = guide.steps.findIndex((s) => !checked[s.id])
    return idx === -1 ? guide.steps.length : idx
  }, [guide.steps, checked])

  const [activeStepId, setActiveStepId] = useState<string | null>(
    () => guide.steps[0]?.id ?? null
  )
  const [, setScanTick] = useState(0)
  const onIdScanUpdate = useCallback(() => setScanTick((n) => n + 1), [])

  function completeStep(step: ProcessStep) {
    onCheckedChange(step.id, true)
    onStepCompleted?.(step)
    setActiveStepId(null)
  }

  function renderStepPanel(step: ProcessStep) {
    switch (step.kind) {
      case "upload":
        if (isIdScanStep(step)) {
          return (
            <IdCardUploadPanel
              step={step}
              labels={labels}
              processTitle={guide.title}
              onScanUpdate={onIdScanUpdate}
            />
          )
        }
        return (
          <StepUploadPanel
            processId={processId}
            guide={guide}
            step={step}
            labels={labels}
            processTitle={guide.title}
          />
        )
      case "visit":
        return (
          <StepVisitPanel
            step={step}
            labels={labels}
            processId={processId}
            processTitle={guide.title}
          />
        )
      default:
        return (
          <StepDocumentPanel
            processId={processId}
            step={step}
            labels={labels}
            processTitle={guide.title}
          />
        )
    }
  }

  return (
    <div className="space-y-3">
      {guide.steps.map((step, index) => {
        const isCompleted = !!checked[step.id]
        const isCurrent = index === currentStepIndex && !isCompleted
        const isLocked = index > currentStepIndex
        const isActive = isCurrent && activeStepId === step.id
        const KindIcon = KIND_ICON[step.kind]

        if (isCompleted) {
          return (
            <div
              key={step.id}
              className="flex gap-3 rounded-xl border border-emerald-500/35 bg-emerald-500/8 p-4 sm:gap-4 sm:p-5"
            >
              <CheckCircle2
                className="size-10 shrink-0 text-emerald-600 sm:size-11"
                strokeWidth={2}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug text-emerald-950 dark:text-emerald-50">
                  <span className="text-emerald-700/80 dark:text-emerald-300/80 mr-2 text-xs font-semibold uppercase tracking-wide">
                    {labels.stepDone}
                  </span>
                  {step.title}
                </p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          )
        }

        if (isLocked) {
          return (
            <div
              key={step.id}
              className="pointer-events-none rounded-xl border border-border/60 bg-muted/30 p-4 opacity-55 select-none sm:p-5"
              aria-disabled
            >
              <div className="flex gap-3">
                <div className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full">
                  <KindIcon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    <Lock className="size-3" aria-hidden />
                    {labels.stepLocked}
                  </p>
                  <p className="mt-1 font-medium leading-snug">{step.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          )
        }

        return (
          <div
            key={step.id}
            className={cn(
              "overflow-hidden rounded-xl border transition-colors",
              isActive
                ? "border-primary/40 bg-card shadow-sm"
                : "border-primary/25 bg-card"
            )}
          >
            <button
              type="button"
              className="w-full p-3 text-left sm:p-4"
              onClick={() =>
                setActiveStepId((id) => (id === step.id ? null : step.id))
              }
              aria-expanded={isActive}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-3">
                  <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full">
                    <KindIcon className="size-4" aria-hidden />
                  </div>
                  <div>
                    <p className="text-primary text-xs font-semibold uppercase tracking-wide">
                      {labels.stepCurrent} · {labels.stepKind[step.kind]}
                    </p>
                    <p className="mt-0.5 font-medium leading-snug">
                      {step.title}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    {!isActive && (
                      <span className="text-primary mt-2 inline-block text-xs font-medium">
                        {labels.openStep} →
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "text-muted-foreground mt-1 size-5 shrink-0 transition-transform",
                    isActive && "rotate-180 text-primary"
                  )}
                />
              </div>
            </button>

            {isActive && (
              <div className="space-y-4 border-t border-border/80 bg-muted/20 px-3 py-4 sm:px-4">
                <div className="flex justify-end">
                  <HelpChatButton scope="step" step={step} />
                </div>
                {renderStepPanel(step)}

                <Button
                  type="button"
                  size="lg"
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-600/90"
                  disabled={isIdScanStep(step) && !isDemoIdScanComplete()}
                  onClick={() => completeStep(step)}
                >
                  <CheckCircle2 className="size-5" />
                  {labels.completeStep}
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
