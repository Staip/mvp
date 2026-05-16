export type ProcessStep = {
  id: string
  title: string
  description: string
}

export type ProcessDocument = {
  name: string
  note: string
}

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
  documents: ProcessDocument[]
  locations: ProcessLocation[]
}
