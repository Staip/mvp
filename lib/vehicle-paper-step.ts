import type { Locale } from "@/lib/i18n"
import type { ProcessGuide, ProcessStep, ProcessStepLocation } from "@/lib/types"
import { isIdScanStep } from "@/lib/id-scan-step"

export const VEHICLE_PAPER_STEP_ID = "splitflow-vehicle-papers"
export const VEHICLE_PDF_STEP_ID = "splitflow-vehicle-registration-pdf"
export const VEHICLE_VISIT_STEP_ID = "splitflow-vehicle-registration-visit"

const OPENING_HOURS: Record<Locale, string> = {
  en: "Mon–Fri 08:00–16:00",
  hr: "Pon–Pet 08:00–16:00",
  de: "Mo–Fr 08:00–16:00",
  it: "Lun–Ven 08:00–16:00",
}

const POLICE_LOCATION: Record<Locale, ProcessStepLocation> = {
  en: {
    name: "Police Administration Split — Vehicle desk",
    address: "Gundulićeva 23, 21000 Split",
  },
  hr: {
    name: "Policijska uprava Split — šalter za vozila",
    address: "Gundulićeva 23, 21000 Split",
  },
  de: {
    name: "Polizeiverwaltung Split — Fahrzeugschalter",
    address: "Gundulićeva 23, 21000 Split",
  },
  it: {
    name: "Polizia di Spalato — sportello veicoli",
    address: "Gundulićeva 23, 21000 Split",
  },
}

const PDF_COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Create and print your registration packet",
    description:
      "Review the official application PDF with your scanned data, then print it for your office visit.",
  },
  hr: {
    title: "Izradite i ispišite paket za registraciju",
    description:
      "Pregledajte PDF zahtjev s podacima iz skeniranja, zatim ga ispišite za posjet uredu.",
  },
  de: {
    title: "Anmeldungspaket erstellen und drucken",
    description:
      "PDF-Antrag mit Ihren gescannten Daten prüfen und für den Behördengang ausdrucken.",
  },
  it: {
    title: "Crea e stampa il pacchetto di registrazione",
    description:
      "Controlla il PDF con i dati scansionati, poi stampalo per la visita in ufficio.",
  },
}

const VISIT_COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Book appointment — submit registration",
    description:
      "Visit the vehicle registration desk in Split with your documents. Book a time slot below.",
  },
  hr: {
    title: "Rezervirajte termin — predaja registracije",
    description:
      "Posjetite šalter za vozila u Splitu s dokumentima. Rezervirajte termin u nastavku.",
  },
  de: {
    title: "Termin buchen — Anmeldung einreichen",
    description:
      "Besuchen Sie den Fahrzeugschalter in Split mit Ihren Unterlagen. Buchen Sie unten einen Termin.",
  },
  it: {
    title: "Prenota appuntamento — consegna documenti",
    description:
      "Recati allo sportello veicoli a Spalato con i documenti. Prenota un orario qui sotto.",
  },
}

const COPY: Record<
  Locale,
  { title: string; description: string; hint: string; docName: string; docNote: string }
> = {
  en: {
    title: "Upload vehicle registration papers",
    description:
      "Photograph the vehicle registration certificate or technical inspection — AI extracts vehicle data.",
    hint: "Lay the document flat; include VIN, fuel type, and mass if visible.",
    docName: "Vehicle registration document",
    docNote: "Prometna dozvola or technical record",
  },
  hr: {
    title: "Učitajte prometnu dozvolu vozila",
    description:
      "Fotografirajte prometnu dozvolu ili tehnički pregled — AI izvlači podatke o vozilu.",
    hint: "Dokument ravno; vidljivi broj šasije, gorivo i masa vozila.",
    docName: "Prometna dozvola / tehnički list",
    docNote: "Izvod iz prometne dozvole",
  },
  de: {
    title: "Fahrzeugpapiere hochladen",
    description:
      "Foto der Zulassungsbescheinigung oder des TÜV-Berichts — die KI liest Fahrzeugdaten aus.",
    hint: "Dokument flach; FIN, Kraftstoff und Masse sichtbar.",
    docName: "Fahrzeugschein / technischer Bericht",
    docNote: "Zulassungsdokument",
  },
  it: {
    title: "Carica documenti del veicolo",
    description:
      "Fotografa il libretto o la revisione — l'IA estrae i dati del veicolo.",
    hint: "Documento piatto; VIN, carburante e massa visibili.",
    docName: "Documento di circolazione",
    docNote: "Libretto o certificato tecnico",
  },
}

export function buildVehiclePaperStep(locale: Locale): ProcessStep {
  const c = COPY[locale]
  return {
    id: VEHICLE_PAPER_STEP_ID,
    title: c.title,
    description: c.description,
    kind: "upload",
    uploadVariant: "vehicle_papers",
    document: { name: c.docName, note: c.docNote },
    uploadHint: c.hint,
  }
}

export function isVehiclePaperStep(step: ProcessStep) {
  return step.uploadVariant === "vehicle_papers"
}

export function buildVehiclePdfStep(locale: Locale): ProcessStep {
  const c = PDF_COPY[locale]
  return {
    id: VEHICLE_PDF_STEP_ID,
    title: c.title,
    description: c.description,
    kind: "document",
    document: {
      name: locale === "hr" ? "Zahtjev za registraciju vozila" : "Vehicle registration application",
      note: locale === "hr" ? "PDF za ispis" : "PDF for printing",
    },
  }
}

export function isVehiclePdfStep(step: ProcessStep) {
  return step.id === VEHICLE_PDF_STEP_ID
}

export function isVehicleRegistrationGuide(guide: Pick<ProcessGuide, "title" | "summary">) {
  return /vozil|vehicle|car|auto|registr|promet|immatricol|fahrzeug/i.test(
    `${guide.title} ${guide.summary}`
  )
}

/** Step 2 = vehicle papers; drop old personal-form / duplicate upload step. */
export function applyVehiclePaperAsStepTwo(
  steps: ProcessStep[],
  locale: Locale,
  guide: Pick<ProcessGuide, "title" | "summary">
): ProcessStep[] {
  if (!isVehicleRegistrationGuide(guide)) return steps
  if (steps.length < 2 || !isIdScanStep(steps[0])) return steps
  return [steps[0], buildVehiclePaperStep(locale), ...steps.slice(2)]
}

export function buildVehicleRegistrationVisitStep(locale: Locale): ProcessStep {
  const c = VISIT_COPY[locale]
  return {
    id: VEHICLE_VISIT_STEP_ID,
    title: c.title,
    description: c.description,
    kind: "visit",
    location: POLICE_LOCATION[locale],
    openingHours: OPENING_HOURS[locale],
    appointmentDurationMinutes: 45,
  }
}

/**
 * Car registration: exactly 4 steps — ID scan, vehicle papers, PDF print, office visit.
 */
export function finalizeVehicleRegistrationSteps(
  steps: ProcessStep[],
  locale: Locale,
  guide: Pick<ProcessGuide, "title" | "summary">
): ProcessStep[] {
  if (!isVehicleRegistrationGuide(guide)) return steps
  if (steps.length < 2 || !isIdScanStep(steps[0])) return steps

  const idStep = steps[0]
  const vehicleStep = isVehiclePaperStep(steps[1])
    ? steps[1]
    : buildVehiclePaperStep(locale)

  return [
    idStep,
    vehicleStep,
    buildVehiclePdfStep(locale),
    buildVehicleRegistrationVisitStep(locale),
  ]
}
