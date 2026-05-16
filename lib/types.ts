export type ProcessDocument = {
  name: string
  note: string
}

export type ProcessStepLocation = {
  name: string
  address: string
}

export type StepKind = "document" | "upload" | "visit"

export type StepQuestion = {
  id: string
  label: string
  placeholder: string
}

export type ProcessStep = {
  id: string
  title: string
  description: string
  kind: StepKind
  document?: ProcessDocument
  questions?: StepQuestion[]
  uploadHint?: string
  location?: ProcessStepLocation
  openingHours?: string
  /** Office slot length in minutes — defined per process step, not chosen by user */
  appointmentDurationMinutes?: number
  uploadVariant?: "id_card_two_sided" | "vehicle_papers"
  /** Form + supporting document photo in one step */
  requiresAttachmentUpload?: boolean
}

/** @deprecated Legacy flat location — normalized into steps */
export type ProcessLocation = {
  name: string
  address: string
  purpose: string
}

export type ProcessGuide = {
  title: string
  summary: string
  estimatedDuration: string
  estimatedCost: string
  steps: ProcessStep[]
  documents?: ProcessDocument[]
  locations?: ProcessLocation[]
}
