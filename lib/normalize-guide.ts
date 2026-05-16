import type { Locale } from "@/lib/i18n"
import type {
  ProcessDocument,
  ProcessGuide,
  ProcessLocation,
  ProcessStep,
  ProcessStepLocation,
} from "@/lib/types"

const HOURS: Record<Locale, string> = {
  en: "Mon–Fri 08:00–16:00",
  hr: "Pon–Pet 08:00–16:00",
  de: "Mo–Fr 08:00–16:00",
  it: "Lun–Ven 08:00–16:00",
}

const DEFAULT_LOCATIONS: Record<Locale, ProcessStepLocation[]> = {
  en: [
    { name: "City of Split – Citizen Services", address: "Obala hrvatskog narodnog preporoda 1, 21000 Split" },
    { name: "Police Administration Split", address: "Gundulićeva 23, 21000 Split" },
    { name: "Croatian Chamber of Economy – Split", address: "Ulica Antuna Mihanovića 1, Split" },
  ],
  hr: [
    { name: "Grad Split – Služba za građane", address: "Obala hrvatskog narodnog preporoda 1, 21000 Split" },
    { name: "Policijska uprava Split", address: "Gundulićeva 23, 21000 Split" },
    { name: "Hrvatska gospodarska komora – Split", address: "Ulica Antuna Mihanovića 1, Split" },
  ],
  de: [
    { name: "Stadt Split – Bürgerservice", address: "Obala hrvatskog narodnog preporoda 1, 21000 Split" },
    { name: "Polizeiverwaltung Split", address: "Gundulićeva 23, 21000 Split" },
    { name: "Wirtschaftskammer – Split", address: "Ulica Antuna Mihanovića 1, Split" },
  ],
  it: [
    { name: "Città di Spalato – Servizi ai cittadini", address: "Obala hrvatskog narodnog preporoda 1, 21000 Split" },
    { name: "Polizia Spalato", address: "Gundulićeva 23, 21000 Split" },
    { name: "Camera di Commercio – Spalato", address: "Ulica Antuna Mihanovića 1, Split" },
  ],
}

function isEnrichedStep(
  step: ProcessStep | { id: string; title: string; description: string }
): step is ProcessStep {
  return (
    "documents" in step &&
    Array.isArray(step.documents) &&
    step.documents.length > 0 &&
    "location" in step &&
    !!step.location?.name &&
    "openingHours" in step &&
    !!step.openingHours
  )
}

function toStepLocation(
  loc: ProcessLocation | ProcessStepLocation | undefined,
  fallback: ProcessStepLocation
): ProcessStepLocation {
  if (!loc) return fallback
  if ("purpose" in loc) {
    return { name: loc.name, address: loc.address }
  }
  return loc
}

function distributeDocuments(
  docs: ProcessDocument[],
  stepCount: number,
  stepIndex: number
): ProcessDocument[] {
  if (docs.length === 0) {
    return [{ name: "Valid ID or passport", note: "Original required" }]
  }
  if (docs.length <= stepCount) {
    return docs[stepIndex] ? [docs[stepIndex]] : [docs[docs.length - 1]]
  }
  const perStep = Math.max(1, Math.ceil(docs.length / stepCount))
  const start = stepIndex * perStep
  return docs.slice(start, start + perStep)
}

export type GuideInput = {
  title: string
  summary: string
  estimatedDuration: string
  estimatedCost: string
  steps: Array<
    ProcessStep | { id: string; title: string; description: string }
  >
  documents?: ProcessDocument[]
  locations?: ProcessLocation[]
}

export function normalizeProcessGuide(
  guide: GuideInput,
  locale: Locale = "en"
): ProcessGuide {
  if (guide.steps.length > 0 && isEnrichedStep(guide.steps[0])) {
    const steps = (guide.steps as ProcessStep[]).map((s) => ({
      ...s,
      documents: s.documents?.length ? s.documents : [{ name: "—", note: "" }],
      location: s.location ?? DEFAULT_LOCATIONS[locale][0],
      openingHours: s.openingHours || HOURS[locale],
    }))
    return { ...guide, steps }
  }

  const docs = guide.documents ?? []
  const locs: ProcessStepLocation[] =
    guide.locations?.map((l) => ({ name: l.name, address: l.address })) ??
    DEFAULT_LOCATIONS[locale]
  const fallbacks = DEFAULT_LOCATIONS[locale]

  const steps: ProcessStep[] = guide.steps.map((step, i) => {
    const legacy = step as ProcessStep & {
      documents?: ProcessDocument[]
      location?: ProcessStepLocation
      openingHours?: string
    }

    return {
      id: step.id,
      title: step.title,
      description: step.description,
      documents: legacy.documents?.length
        ? legacy.documents
        : distributeDocuments(docs, guide.steps.length, i),
      location: toStepLocation(
        legacy.location ?? locs[i % locs.length],
        fallbacks[i % fallbacks.length]
      ),
      openingHours: legacy.openingHours ?? HOURS[locale],
    }
  })

  const { documents: _d, locations: _l, ...rest } = guide
  return { ...rest, steps }
}
