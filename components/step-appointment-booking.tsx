"use client"

import { useMemo, useState } from "react"
import { CalendarClock, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  formatDateInputValue,
  getNextWeekdays,
  getTimeSlots,
} from "@/lib/appointment-slots"
import type { Messages } from "@/lib/i18n"

type StepAppointmentBookingProps = {
  labels: Messages["copilot"]["guide"]
  stepId: string
}

export function StepAppointmentBooking({
  labels,
  stepId,
}: StepAppointmentBookingProps) {
  const weekdays = useMemo(() => getNextWeekdays(10), [])
  const [date, setDate] = useState(() => formatDateInputValue(weekdays[0]))
  const [interval, setInterval] = useState<15 | 30>(30)
  const [time, setTime] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  const slots = useMemo(() => getTimeSlots(interval), [interval])

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
      <p className="flex items-center gap-2 text-sm font-medium">
        <CalendarClock className="size-4 text-primary" />
        {labels.bookAppointment}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-muted-foreground text-xs font-medium">
            {labels.selectDate}
          </span>
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
        </label>

        <label className="space-y-1.5">
          <span className="text-muted-foreground text-xs font-medium">
            {labels.selectTime}
          </span>
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
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs">Interval:</span>
        <Button
          type="button"
          size="xs"
          variant={interval === 15 ? "default" : "outline"}
          onClick={() => {
            setInterval(15)
            setTime("")
          }}
        >
          {labels.interval15}
        </Button>
        <Button
          type="button"
          size="xs"
          variant={interval === 30 ? "default" : "outline"}
          onClick={() => {
            setInterval(30)
            setTime("")
          }}
        >
          {labels.interval30}
        </Button>
      </div>

      <Button
        type="button"
        size="sm"
        className="w-full sm:w-auto"
        disabled={!date || !time}
        onClick={() => setConfirmed(true)}
      >
        {labels.confirmBooking}
      </Button>
      <p className="text-muted-foreground text-xs">{labels.bookingDemoNote}</p>
    </div>
  )
}
