"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Lock,
  MapPin,
} from "lucide-react"

import { StepAppointmentBooking } from "@/components/step-appointment-booking"
import { Button } from "@/components/ui/button"
import type { Messages } from "@/lib/i18n"
import type { ProcessGuide, ProcessStep } from "@/lib/types"
import { cn } from "@/lib/utils"

type GuideStepListProps = {
  guide: ProcessGuide
  labels: Messages["copilot"]["guide"]
  checked: Record<string, boolean>
  onCheckedChange: (stepId: string, value: boolean) => void
}

export function GuideStepList({
  guide,
  labels,
  checked,
  onCheckedChange,
}: GuideStepListProps) {
  const currentStepIndex = useMemo(() => {
    const idx = guide.steps.findIndex((s) => !checked[s.id])
    return idx === -1 ? guide.steps.length : idx
  }, [guide.steps, checked])

  const [activeStepId, setActiveStepId] = useState<string | null>(null)

  useEffect(() => {
    if (currentStepIndex < guide.steps.length) {
      setActiveStepId(guide.steps[currentStepIndex].id)
    } else {
      setActiveStepId(null)
    }
  }, [currentStepIndex, guide.steps])

  function completeStep(step: ProcessStep, index: number) {
    onCheckedChange(step.id, true)
    const next = guide.steps[index + 1]
    setActiveStepId(next?.id ?? null)
  }

  return (
    <div className="space-y-3">
      {guide.steps.map((step, index) => {
        const isCompleted = !!checked[step.id]
        const isCurrent = index === currentStepIndex && !isCompleted
        const isLocked = index > currentStepIndex
        const isActive = isCurrent && activeStepId === step.id

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
                <div className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  {index + 1}
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
                  <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-primary text-xs font-semibold uppercase tracking-wide">
                      {labels.stepCurrent}
                    </p>
                    <p className="mt-0.5 font-medium leading-snug">
                      {step.title}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {step.description}
                    </p>
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
                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <FileText className="size-4" />
                    {labels.documentsForStep}
                  </h3>
                  <ul className="space-y-2">
                    {step.documents.map((doc) => (
                      <li
                        key={doc.name}
                        className="flex items-start justify-between gap-2 rounded-lg border border-dashed bg-background p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {doc.note}
                          </p>
                        </div>
                        <Button variant="outline" size="xs" disabled>
                          {labels.view}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="size-4" />
                      {labels.location}
                    </h3>
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-sm font-medium">{step.location.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {step.location.address}
                      </p>
                      <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
                        <Clock className="size-3.5" />
                        {labels.openingHours}: {step.openingHours}
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border bg-muted/30">
                    <iframe
                      title={labels.mapIframeTitle}
                      className="h-32 w-full border-0 grayscale-30 sm:h-full sm:min-h-32"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=16.42%2C43.50%2C16.47%2C43.52&layer=mapnik&marker=43.508%2C16.440"
                    />
                  </div>
                </section>

                <StepAppointmentBooking labels={labels} stepId={step.id} />

                <Button
                  type="button"
                  size="lg"
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-600/90"
                  onClick={() => completeStep(step, index)}
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
