import type { Locale } from "@/lib/i18n"
import type { StepQuestion } from "@/lib/types"

export const MANUAL_QUESTION_IDS = new Set(["contactPhone", "contactEmail"])

export function isManualQuestion(q: StepQuestion) {
  return MANUAL_QUESTION_IDS.has(q.id)
}

export function isAutofillableQuestion(q: StepQuestion) {
  return !isManualQuestion(q)
}

const MANUAL_BY_LOCALE: Record<Locale, StepQuestion[]> = {
  en: [
    {
      id: "contactPhone",
      label: "Contact phone",
      placeholder: "e.g. +385 91 123 4567",
    },
    {
      id: "contactEmail",
      label: "E-mail address",
      placeholder: "you@example.com",
    },
  ],
  hr: [
    {
      id: "contactPhone",
      label: "Kontakt telefon",
      placeholder: "npr. +385 91 123 4567",
    },
    {
      id: "contactEmail",
      label: "E-mail adresa",
      placeholder: "vi@primjer.hr",
    },
  ],
  de: [
    {
      id: "contactPhone",
      label: "Telefon",
      placeholder: "z. B. +385 91 123 4567",
    },
    {
      id: "contactEmail",
      label: "E-Mail-Adresse",
      placeholder: "sie@beispiel.de",
    },
  ],
  it: [
    {
      id: "contactPhone",
      label: "Telefono",
      placeholder: "es. +385 91 123 4567",
    },
    {
      id: "contactEmail",
      label: "Indirizzo e-mail",
      placeholder: "tu@esempio.it",
    },
  ],
}

const IDENTITY_BY_LOCALE: Record<Locale, StepQuestion[]> = {
  en: [
    { id: "fullName", label: "Your full name", placeholder: "e.g. Ana Horvat" },
    { id: "oib", label: "OIB (personal ID number)", placeholder: "11 digits" },
    {
      id: "address",
      label: "Your address in Split",
      placeholder: "Street and city",
    },
  ],
  hr: [
    { id: "fullName", label: "Ime i prezime", placeholder: "npr. Ana Horvat" },
    { id: "oib", label: "OIB", placeholder: "11 znamenki" },
    { id: "address", label: "Adresa u Splitu", placeholder: "Ulica i grad" },
  ],
  de: [
    {
      id: "fullName",
      label: "Vollständiger Name",
      placeholder: "z. B. Ana Horvat",
    },
    { id: "oib", label: "OIB", placeholder: "11 Ziffern" },
    { id: "address", label: "Adresse in Split", placeholder: "Straße und Ort" },
  ],
  it: [
    { id: "fullName", label: "Nome completo", placeholder: "es. Ana Horvat" },
    { id: "oib", label: "OIB", placeholder: "11 cifre" },
    { id: "address", label: "Indirizzo a Spalato", placeholder: "Via e città" },
  ],
}

export function mergeDocumentQuestions(
  questions: StepQuestion[] | undefined,
  locale: Locale
): StepQuestion[] {
  const identity = IDENTITY_BY_LOCALE[locale]
  const manual = MANUAL_BY_LOCALE[locale]
  const byId = new Map<string, StepQuestion>()

  for (const q of [...identity, ...(questions ?? []), ...manual]) {
    byId.set(q.id, q)
  }
  for (const m of manual) {
    byId.set(m.id, m)
  }

  const result: StepQuestion[] = []
  for (const q of identity) {
    if (byId.has(q.id)) result.push(byId.get(q.id)!)
  }
  for (const q of byId.values()) {
    if (
      !identity.some((i) => i.id === q.id) &&
      !manual.some((m) => m.id === q.id)
    ) {
      result.push(q)
    }
  }
  for (const m of manual) {
    result.push(byId.get(m.id) ?? m)
  }
  return result
}
