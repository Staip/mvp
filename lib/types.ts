export type ProcessDocument = {
  name: string
  note: string
}

export type ProcessStepLocation = {
  name: string
  address: string
}

export type ProcessStep = {
  id: string
  title: string
  description: string
  documents: ProcessDocument[]
  location: ProcessStepLocation
  openingHours: string
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
