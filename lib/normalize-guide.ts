import type { Locale } from "@/lib/i18n"
import { mergeDocumentQuestions } from "@/lib/document-step-questions"
import { isIdScanStep, prependIdScanStep } from "@/lib/id-scan-step"
import type {
  ProcessDocument,
  ProcessGuide,
  ProcessLocation,
  ProcessStep,
  ProcessStepLocation,
  StepKind,
  StepQuestion,
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

const UPLOAD_HINTS: Record<Locale, string> = {
  en: "Take a clear photo of your document or form. AI will read the text and prefill your application.",
  hr: "Fotografirajte dokument ili obrazac. AI će pročitati tekst i popuniti zahtjev.",
  de: "Fotografieren Sie Ihr Dokument oder Formular. Die KI liest den Text und füllt den Antrag vor.",
  it: "Scatta una foto chiara del documento o modulo. L'IA leggerà il testo e compilerà la richiesta.",
}

function inferVisitDurationMinutes(title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase()
  if (/pay|fee|collect|pick|stamp|preuzm|abhol|potvr/.test(text)) return 15
  if (/register|permit|license|passport|residen|dozvol|prijav|immatric/.test(text))
    return 45
  return 30
}

function inferKind(title: string, description: string, index: number): StepKind {
  const text = `${title} ${description}`.toLowerCase()
  if (
    /visit|office|counter|polic|ured|šalter|amt|submit|pay.*fee|collect|preuzm|abhol/.test(
      text
    )
  ) {
    return "visit"
  }
  if (
    /photo|scan|upload|picture|slik|fotograf|bild|insurance|osigur|technical|pregled/.test(
      text
    )
  ) {
    return "upload"
  }
  const rotation: StepKind[] = ["document", "upload", "visit"]
  return rotation[index % 3]
}

function hasNewShape(step: ProcessStep | { id: string; title: string; description: string }): step is ProcessStep {
  return "kind" in step && !!step.kind
}

function toStepLocation(
  loc: ProcessLocation | ProcessStepLocation | undefined,
  fallback: ProcessStepLocation
): ProcessStepLocation {
  if (!loc) return fallback
  if ("purpose" in loc) return { name: loc.name, address: loc.address }
  return loc
}

function pickDocument(
  docs: ProcessDocument[],
  stepIndex: number,
  stepCount: number
): ProcessDocument {
  if (docs.length === 0) {
    return { name: "Application form", note: "Filled via SplitFlow" }
  }
  if (docs.length <= stepCount) {
    return docs[stepIndex] ?? docs[docs.length - 1]
  }
  return docs[stepIndex % docs.length]
}

function buildStep(
  base: { id: string; title: string; description: string },
  index: number,
  locale: Locale,
  docs: ProcessDocument[],
  locs: ProcessStepLocation[],
  fallbacks: ProcessStepLocation[],
  legacy?: Partial<ProcessStep> & { documents?: ProcessDocument[] }
): ProcessStep {
  const kind =
    legacy?.kind ??
    inferKind(base.title, base.description, index)

  if (kind === "visit") {
    const location = toStepLocation(
      legacy?.location ?? locs[index % locs.length],
      fallbacks[index % fallbacks.length]
    )
    return {
      ...base,
      kind: "visit",
      location,
      openingHours: legacy?.openingHours ?? HOURS[locale],
      appointmentDurationMinutes:
        legacy?.appointmentDurationMinutes ??
        inferVisitDurationMinutes(base.title, base.description),
    }
  }

  if (kind === "upload") {
    const doc =
      legacy?.document ??
      pickDocument(legacy?.documents ?? docs, index, docs.length || 6)
    return {
      ...base,
      kind: "upload",
      document: doc,
      uploadHint: legacy?.uploadHint ?? UPLOAD_HINTS[locale],
    }
  }

  const doc =
    legacy?.document ??
    pickDocument(legacy?.documents ?? docs, index, docs.length || 6)
  return {
    ...base,
    kind: "document",
    document: doc,
    questions: mergeDocumentQuestions(legacy?.questions, locale),
  }
}

/** Combine “fill form” document steps with the following upload step. */
function mergeFormWithUpload(steps: ProcessStep[]): ProcessStep[] {
  const out: ProcessStep[] = []
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const next = steps[i + 1]
    if (
      step.kind === "document" &&
      !isIdScanStep(step) &&
      next?.kind === "upload" &&
      !isIdScanStep(next)
    ) {
      out.push({
        ...step,
        requiresAttachmentUpload: true,
        uploadHint: next.uploadHint ?? step.uploadHint,
        document: step.document ?? next.document,
      })
      i++
      continue
    }
    out.push(step)
  }
  return out
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
  const docs = guide.documents ?? []
  const locs: ProcessStepLocation[] =
    guide.locations?.map((l) => ({ name: l.name, address: l.address })) ??
    DEFAULT_LOCATIONS[locale]
  const fallbacks = DEFAULT_LOCATIONS[locale]

  const steps = guide.steps.map((step, i) => {
    if (hasNewShape(step) && step.kind) {
      return buildStep(
        { id: step.id, title: step.title, description: step.description },
        i,
        locale,
        docs,
        locs,
        fallbacks,
        step
      )
    }

    const legacy = step as ProcessStep & {
      documents?: ProcessDocument[]
      location?: ProcessStepLocation
      openingHours?: string
      kind?: StepKind
    }

    return buildStep(
      { id: step.id, title: step.title, description: step.description },
      i,
      locale,
      docs,
      locs,
      fallbacks,
      legacy
    )
  })

  const merged = mergeFormWithUpload(steps)
  const { documents: _d, locations: _l, ...rest } = guide
  return prependIdScanStep({ ...rest, steps: merged }, locale)
}
