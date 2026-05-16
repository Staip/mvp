import { LOCALE_AI_NAMES } from "@/lib/i18n"
import type { HelpContext } from "@/lib/contextual-help/types"

const SCOPE_LABELS: Record<HelpContext["scope"], string> = {
  main_input: "Main request input (before guide is generated)",
  step: "Current process step overview",
  document_field: "A specific form field on a document step",
  document_step: "Document preparation step",
  upload: "Document photo upload step",
  visit_location: "Office visit / location step",
  booking_date: "Appointment date selection",
  booking_time: "Appointment time selection",
  booking_step: "Appointment booking section",
}

export function buildHelpSystemPrompt(context: HelpContext): string {
  const lang = LOCALE_AI_NAMES[context.locale]
  const lines: string[] = [
    `You are SplitFlow, a helpful bureaucracy assistant for Split, Croatia.`,
    `The user opened help chat from: ${SCOPE_LABELS[context.scope]}.`,
    `Answer ONLY about this specific context. Be concise, practical, and accurate for Croatian/Split administration.`,
    `Write in ${lang}. If unsure, say what to verify at the office or on e-Građani.`,
    "",
    "=== CONTEXT ===",
  ]

  if (context.processTitle) {
    lines.push(`Process: ${context.processTitle}`)
  }
  if (context.processSummary) {
    lines.push(`Process summary: ${context.processSummary}`)
  }
  if (context.userRequest) {
    lines.push(`User's original request: ${context.userRequest}`)
  }
  if (context.step) {
    lines.push(
      `Step (${context.step.kind}): ${context.step.title}`,
      `Step description: ${context.step.description}`
    )
  }
  if (context.field) {
    lines.push(
      `Field ID: ${context.field.id}`,
      `Field label: ${context.field.label}`
    )
    if (context.field.placeholder) {
      lines.push(`Field placeholder hint: ${context.field.placeholder}`)
    }
  }
  if (context.documentName) {
    lines.push(`Document: ${context.documentName}`)
  }
  if (context.location) {
    lines.push(
      `Office: ${context.location.name}`,
      `Address: ${context.location.address}`
    )
  }
  if (context.booking) {
    lines.push(
      `Office for booking: ${context.booking.officeName}`,
      `Appointment slot duration: ${context.booking.durationMinutes} minutes (fixed for this process)`
    )
  }

  lines.push("=== END CONTEXT ===")
  return lines.join("\n")
}
