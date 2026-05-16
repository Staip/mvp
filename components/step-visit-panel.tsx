"use client"

import { Clock, MapPin } from "lucide-react"

import { HelpChatButton } from "@/components/contextual-help/help-chat-button"
import { StepAppointmentBooking } from "@/components/step-appointment-booking"
import type { Messages } from "@/lib/i18n"
import type { ProcessStep } from "@/lib/types"

type StepVisitPanelProps = {
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  processId: string
  processTitle: string
}

export function StepVisitPanel({
  step,
  labels,
  processId,
  processTitle,
}: StepVisitPanelProps) {
  const location = step.location!

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{labels.visitIntro}</p>

      <div className="rounded-lg border bg-background p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="size-4 text-primary" />
            {location.name}
          </p>
          <HelpChatButton
            scope="visit_location"
            step={step}
            location={location}
          />
        </div>
        <p className="text-muted-foreground mt-1 text-xs">{location.address}</p>
        <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5" />
          {labels.openingHours}: {step.openingHours}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-muted/30">
        <iframe
          title={labels.mapIframeTitle}
          className="h-36 w-full border-0 grayscale-30"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.openstreetmap.org/export/embed.html?bbox=16.42%2C43.50%2C16.47%2C43.52&layer=mapnik&marker=43.508%2C16.440"
        />
      </div>

      <StepAppointmentBooking
        step={step}
        labels={labels}
        stepId={step.id}
        processId={processId}
        processTitle={processTitle}
        stepTitle={step.title}
        officeName={location.name}
        officeAddress={location.address}
        durationMinutes={step.appointmentDurationMinutes ?? 30}
      />
    </div>
  )
}
