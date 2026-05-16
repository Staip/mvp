import type { Locale } from "@/lib/i18n"
import type { StepKind } from "@/lib/types"

export type HelpScope =
  | "main_input"
  | "step"
  | "document_field"
  | "document_step"
  | "upload"
  | "visit_location"
  | "booking_date"
  | "booking_time"
  | "booking_step"

export type HelpContext = {
  locale: Locale
  scope: HelpScope
  processTitle?: string
  processSummary?: string
  userRequest?: string
  step?: {
    id: string
    title: string
    description: string
    kind: StepKind
  }
  field?: {
    id: string
    label: string
    placeholder?: string
  }
  documentName?: string
  location?: {
    name: string
    address: string
  }
  booking?: {
    durationMinutes: number
    officeName: string
  }
}

export type HelpChatMessage = {
  role: "user" | "assistant"
  content: string
}
