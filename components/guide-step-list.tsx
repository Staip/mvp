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
import { VehiclePaperUploadPanel } from "@/components/demo/vehicle-paper-upload-panel"
import { VehiclePdfStepPanel } from "@/components/demo/vehicle-pdf-step-panel"
import { isIdScanStep } from "@/lib/id-scan-step"
import { isVehiclePaperStep, isVehiclePdfStep } from "@/lib/vehicle-paper-step"
import { HelpChatButton } from "@/components/contextual-help/help-chat-button"
import { StepDocumentPanel } from "@/components/step-document-panel"
import { StepUploadPanel } from "@/components/step-upload-panel"
import { StepVisitPanel } from "@/components/step-visit-panel"
import { Button } from "@/components/ui/button"
import type { Messages } from "@/lib/i18n"
import type { ProcessGuide, ProcessStep, StepKind } from "@/lib/types"
import { isDemoIdScanComplete } from "@/lib/demo/demo-storage"
import { isVehiclePaperScanComplete } from "@/lib/demo/vehicle-paper-storage"
import { isVehiclePdfPreviewed } from "@/lib/demo/vehicle-pdf-storage"
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

function StepFlowNode({
  index,
  isCompleted,
  isCurrent,
  isLocked,
  isLast,
}: {
  index: number
  isCompleted: boolean
  isCurrent: boolean
  isLocked: boolean
  isLast: boolean
}) {
  return (
    <div className="flex w-10 shrink-0 flex-col items-center">
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
          isCompleted &&
            "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/25",
          isCurrent &&
            !isCompleted &&
            "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25",
          isLocked && "border-border bg-muted text-muted-foreground",
          !isCompleted &&
            !isCurrent &&
            !isLocked &&
            "border-border bg-background text-muted-foreground"
        )}
        aria-hidden
      >
        {isCompleted ? (
          <CheckCircle2 className="size-4" strokeWidth={2.5} />
        ) : (
          index + 1
        )}
      </div>
      {!isLast && (
        <div
          className={cn(
            "mt-1 w-0.5 min-h-6 flex-1 rounded-full",
            isCompleted ? "bg-emerald-500/50" : "bg-border"
          )}
        />
      )}
    </div>
  )
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

  const [activeStepId, setActiveStepId] = useState<string | null>(null)
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
        if (isVehiclePaperStep(step)) {
          return (
            <VehiclePaperUploadPanel
              processId={processId}
              step={step}
              labels={labels}
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
        if (isVehiclePdfStep(step)) {
          return (
            <VehiclePdfStepPanel
              guide={guide}
              step={step}
              labels={labels}
              onPreviewUpdate={onIdScanUpdate}
            />
          )
        }
        return (
          <StepDocumentPanel
            processId={processId}
            guide={guide}
            step={step}
            labels={labels}
            processTitle={guide.title}
          />
        )
    }
  }

  return (
    <ol className="relative space-y-0">
      {guide.steps.map((step, index) => {
        const isCompleted = !!checked[step.id]
        const isCurrent = index === currentStepIndex && !isCompleted
        const isLocked = index > currentStepIndex
        const isActive = isCurrent && activeStepId === step.id
        const isLast = index === guide.steps.length - 1
        const KindIcon = KIND_ICON[step.kind]

        const stepBody = (() => {
          if (isCompleted) {
            return (
              <div className="flex-1 rounded-xl border border-emerald-500/35 bg-emerald-500/8 p-4 sm:p-5">
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
            )
          }

          if (isLocked) {
            return (
              <div
                className="pointer-events-none flex-1 rounded-xl border border-border/60 bg-muted/30 p-4 opacity-55 select-none sm:p-5"
                aria-disabled
              >
                <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <Lock className="size-3" aria-hidden />
                  {labels.stepLocked}
                </p>
                <p className="mt-1 flex items-center gap-2 font-medium leading-snug">
                  <KindIcon className="text-muted-foreground size-4 shrink-0" />
                  {step.title}
                </p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          }

          return (
            <div
              className={cn(
                "flex-1 overflow-hidden rounded-xl border transition-colors",
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
                  <div className="min-w-0 flex-1">
                    <p className="text-primary text-xs font-semibold uppercase tracking-wide">
                      {labels.stepCurrent} · {labels.stepKind[step.kind]}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 font-medium leading-snug">
                      <KindIcon className="size-4 shrink-0 text-primary" />
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
                    disabled={
                      (isIdScanStep(step) && !isDemoIdScanComplete()) ||
                      (isVehiclePaperStep(step) &&
                        !isVehiclePaperScanComplete()) ||
                      (isVehiclePdfStep(step) && !isVehiclePdfPreviewed())
                    }
                    onClick={() => completeStep(step)}
                  >
                    <CheckCircle2 className="size-5" />
                    {labels.completeStep}
                  </Button>
                </div>
              )}
            </div>
          )
        })()

        return (
          <li key={step.id} className="flex gap-3 pb-2 last:pb-0">
            <StepFlowNode
              index={index}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isLocked={isLocked}
              isLast={isLast}
            />
            {stepBody}
          </li>
        )
      })}
    </ol>
  )
}
