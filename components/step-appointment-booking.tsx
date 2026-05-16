"use client"

import { useMemo, useState } from "react"
import { CalendarClock, CheckCircle2, Clock } from "lucide-react"

import {
  FieldLabelWithHelp,
  HelpChatButton,
} from "@/components/contextual-help/help-chat-button"
import { useUserData } from "@/components/user-data-provider"
import { Button } from "@/components/ui/button"
import {
  formatDateInputValue,
  getNextWeekdays,
  getTimeSlots,
} from "@/lib/appointment-slots"
import type { Messages } from "@/lib/i18n"
import type { ProcessStep } from "@/lib/types"

type StepAppointmentBookingProps = {
  step: ProcessStep
  labels: Messages["copilot"]["guide"]
  stepId: string
  processId: string
  processTitle: string
  stepTitle: string
  officeName: string
  officeAddress: string
  durationMinutes: number
}

export function StepAppointmentBooking({
  step,
  labels,
  stepId,
  processId,
  processTitle,
  stepTitle,
  officeName,
  officeAddress,
  durationMinutes,
}: StepAppointmentBookingProps) {
  const { addAppointment } = useUserData()
  const weekdays = useMemo(() => getNextWeekdays(10), [])
  const [date, setDate] = useState(() => formatDateInputValue(weekdays[0]))
  const [time, setTime] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  const slots = useMemo(
    () => getTimeSlots(durationMinutes),
    [durationMinutes]
  )

  const durationLabel = labels.slotDuration.replace(
    "{minutes}",
    String(durationMinutes)
  )

  function confirm() {
    if (!date || !time) return
    addAppointment({
      processId,
      processTitle,
      stepTitle,
      officeName,
      officeAddress,
      date,
      time,
      intervalMinutes: durationMinutes,
    })
    setConfirmed(true)
  }

  if (confirmed) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-800 dark:text-emerald-200">
        <CheckCircle2 className="size-4 shrink-0" />
        <span>
          {labels.bookingConfirmed}: {date} · {time}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium">
          <CalendarClock className="size-4 text-primary" />
          {labels.bookAppointment}
        </p>
        <HelpChatButton
          scope="booking_step"
          step={step}
          booking={{ durationMinutes, officeName }}
        />
      </div>

      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Clock className="size-3.5 shrink-0" />
        {durationLabel}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <FieldLabelWithHelp
          label={labels.selectDate}
          labelClassName="text-muted-foreground text-xs"
          scope="booking_date"
          step={step}
          booking={{ durationMinutes, officeName }}
        >
          <input
            type="date"
            value={date}
            min={formatDateInputValue(weekdays[0])}
            max={formatDateInputValue(weekdays[weekdays.length - 1])}
            onChange={(e) => {
              setDate(e.target.value)
              setTime("")
            }}
            className="border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-3 text-sm focus-visible:ring-3 focus-visible:outline-none"
          />
        </FieldLabelWithHelp>

        <FieldLabelWithHelp
          label={labels.selectTime}
          labelClassName="text-muted-foreground text-xs"
          scope="booking_time"
          step={step}
          booking={{ durationMinutes, officeName }}
        >
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-3 text-sm focus-visible:ring-3 focus-visible:outline-none"
          >
            <option value="">—</option>
            {slots.map((slot) => (
              <option key={`${stepId}-${slot}`} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </FieldLabelWithHelp>
      </div>

      <Button
        type="button"
        size="sm"
        className="w-full sm:w-auto"
        disabled={!date || !time}
        onClick={confirm}
      >
        {labels.confirmBooking}
      </Button>
      <p className="text-muted-foreground text-xs">{labels.bookingDemoNote}</p>
    </div>
  )
}
