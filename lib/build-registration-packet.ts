import {
  DEMO_BACK_FIELDS,
  DEMO_FRONT_FIELDS,
  fieldLabel,
} from "@/lib/demo/demo-fields"
import { loadDemoExtracted } from "@/lib/demo/demo-storage"
import {
  loadApplicationData,
  type StepDocumentSnapshot,
  type StepUploadSnapshot,
} from "@/lib/application-data-storage"
import type { Locale } from "@/lib/i18n"
import type { ProcessGuide, ProcessStep } from "@/lib/types"
import type { PdfSection, RegistrationPacketPdfInput } from "@/lib/download-pdf"

const UPLOAD_LABELS: Record<string, Record<Locale, string>> = {
  vin: {
    en: "VIN (chassis number)",
    hr: "Broj šasije (VIN)",
    de: "Fahrgestellnummer (FIN)",
    it: "Numero di telaio (VIN)",
  },
  make: {
    en: "Make",
    hr: "Marka vozila",
    de: "Marke",
    it: "Marca",
  },
  model: {
    en: "Model",
    hr: "Model",
    de: "Modell",
    it: "Modello",
  },
  year: {
    en: "Year of manufacture",
    hr: "Godina proizvodnje",
    de: "Baujahr",
    it: "Anno di produzione",
  },
  color: {
    en: "Colour",
    hr: "Boja",
    de: "Farbe",
    it: "Colore",
  },
  registrationNumber: {
    en: "Registration number",
    hr: "Registarska oznaka",
    de: "Zulassungsnummer",
    it: "Numero di immatricolazione",
  },
  plateNumber: {
    en: "Plate number",
    hr: "Registarska oznaka",
    de: "Kennzeichen",
    it: "Targa",
  },
  engineNumber: {
    en: "Engine number",
    hr: "Broj motora",
    de: "Motornummer",
    it: "Numero motore",
  },
  fuelType: {
    en: "Fuel type",
    hr: "Vrsta goriva",
    de: "Kraftstoff",
    it: "Carburante",
  },
  firstRegistration: {
    en: "First registration date",
    hr: "Datum prve registracije",
    de: "Erstzulassung",
    it: "Prima immatricolazione",
  },
  insurancePolicy: {
    en: "Insurance policy no.",
    hr: "Broj police osiguranja",
    de: "Versicherungsnummer",
    it: "Numero polizza assicurativa",
  },
  insuranceValidUntil: {
    en: "Insurance valid until",
    hr: "Osiguranje vrijedi do",
    de: "Versicherung gültig bis",
    it: "Assicurazione valida fino al",
  },
}

function humanizeKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase())
}

export function labelForField(key: string, locale: Locale): string {
  const fromUpload = UPLOAD_LABELS[key]?.[locale]
  if (fromUpload) return fromUpload
  const fromId = [...DEMO_FRONT_FIELDS, ...DEMO_BACK_FIELDS].find(
    (f) => f.key === key
  )
  if (fromId) return fieldLabel(fromId, locale)
  return humanizeKey(key)
}

function rowsFromRecord(
  fields: Record<string, string>,
  locale: Locale
): Array<{ label: string; value: string }> {
  return Object.entries(fields)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => ({ label: labelForField(k, locale), value: v.trim() }))
}

function documentRows(
  snap: StepDocumentSnapshot
): Array<{ label: string; value: string }> {
  return snap.questions
    .map((q) => ({
      label: q.label,
      value: (snap.answers[q.id] ?? "").trim(),
    }))
    .filter((r) => r.value)
}

export type PacketLabels = {
  applicantSection: string
  vehicleSection: string
  priorUploadsSection: string
  attachmentsSection: string
  idSubsection: string
  footer: string
}

export function buildRegistrationPacket(input: {
  guide: ProcessGuide
  currentStep: ProcessStep
  currentUploadFields: Record<string, string>
  locale: Locale
  labels: PacketLabels
}): RegistrationPacketPdfInput {
  const { guide, currentStep, currentUploadFields, locale, labels } = input
  const store = loadApplicationData()
  const idFields = loadDemoExtracted()?.fields ?? {}
  const stepIndex = guide.steps.findIndex((s) => s.id === currentStep.id)

  const sections: PdfSection[] = []

  const idRows = rowsFromRecord(idFields, locale)
  if (idRows.length > 0) {
    sections.push({
      title: `${labels.applicantSection} — ${labels.idSubsection}`,
      rows: idRows,
    })
  }

  for (const step of guide.steps.slice(0, stepIndex)) {
    if (step.kind !== "document") continue
    const snap = store.documents.find((d) => d.stepId === step.id)
    if (!snap) continue
    const rows = documentRows(snap)
    if (rows.length === 0) continue
    sections.push({
      title: `${labels.applicantSection} — ${snap.documentName}`,
      subtitle: snap.stepTitle,
      rows,
    })
  }

  for (const step of guide.steps.slice(0, stepIndex)) {
    if (step.kind !== "upload" || step.id === currentStep.id) continue
    const snap = store.uploads.find((u) => u.stepId === step.id)
    if (!snap) continue
    const rows = rowsFromRecord(snap.fields, locale)
    if (rows.length === 0) continue
    sections.push({
      title: labels.priorUploadsSection,
      subtitle: `${snap.documentName} · ${snap.stepTitle}`,
      rows,
    })
  }

  const vehicleRows = rowsFromRecord(currentUploadFields, locale)
  if (vehicleRows.length > 0) {
    sections.push({
      title: labels.vehicleSection,
      subtitle: currentStep.document?.name ?? currentStep.title,
      rows: vehicleRows,
    })
  }

  const attachmentItems = guide.steps
    .slice(0, stepIndex + 1)
    .filter((s) => s.kind === "document" || s.kind === "upload")
    .map((s) => s.document?.name ?? s.title)

  if (attachmentItems.length > 0) {
    sections.push({
      title: labels.attachmentsSection,
      checklist: attachmentItems,
      rows: [],
    })
  }

  const ref = `MU-SPL-${Date.now().toString().slice(-8)}`
  const submittedAt = new Date().toLocaleDateString(
    locale === "hr" ? "hr-HR" : locale === "de" ? "de-DE" : locale === "it" ? "it-IT" : "en-GB",
    { day: "2-digit", month: "2-digit", year: "numeric" }
  )

  return {
    processTitle: guide.title,
    referenceNumber: ref,
    submittedAt,
    sections,
    footer: labels.footer,
    locale,
  }
}

export function snapshotFromUploadStep(
  step: ProcessStep,
  fields: Record<string, string>
): StepUploadSnapshot {
  return {
    stepId: step.id,
    stepTitle: step.title,
    documentName: step.document?.name ?? step.title,
    fields,
  }
}
