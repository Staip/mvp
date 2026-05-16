import type { Locale } from "@/lib/i18n"
import type { StepQuestion } from "@/lib/types"

export const MANUAL_QUESTION_IDS = new Set(["contactPhone", "contactEmail"])

/** Not shown on generated PDFs */
export const PDF_EXCLUDED_QUESTION_IDS = new Set(["oib", "address"])

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

/** Autofill from ID front scan */
const IDENTITY_BY_LOCALE: Record<Locale, StepQuestion[]> = {
  en: [
    { id: "fullName", label: "Your full name", placeholder: "e.g. Ana Horvat" },
    {
      id: "dateOfBirth",
      label: "Date of birth",
      placeholder: "e.g. 15.03.1992.",
    },
    {
      id: "idCardNumber",
      label: "ID card number",
      placeholder: "e.g. 123456789",
    },
    {
      id: "nationality",
      label: "Nationality",
      placeholder: "e.g. Croatian",
    },
  ],
  hr: [
    { id: "fullName", label: "Ime i prezime", placeholder: "npr. Ana Horvat" },
    { id: "dateOfBirth", label: "Datum rođenja", placeholder: "npr. 15.03.1992." },
    {
      id: "idCardNumber",
      label: "Broj osobne iskaznice",
      placeholder: "npr. 123456789",
    },
    { id: "nationality", label: "Državljanstvo", placeholder: "npr. Hrvatsko" },
  ],
  de: [
    {
      id: "fullName",
      label: "Vollständiger Name",
      placeholder: "z. B. Ana Horvat",
    },
    { id: "dateOfBirth", label: "Geburtsdatum", placeholder: "z. B. 15.03.1992." },
    {
      id: "idCardNumber",
      label: "Ausweisnummer",
      placeholder: "z. B. 123456789",
    },
    { id: "nationality", label: "Staatsangehörigkeit", placeholder: "z. B. Kroatisch" },
  ],
  it: [
    { id: "fullName", label: "Nome completo", placeholder: "es. Ana Horvat" },
    { id: "dateOfBirth", label: "Data di nascita", placeholder: "es. 15.03.1992." },
    {
      id: "idCardNumber",
      label: "Numero carta d'identità",
      placeholder: "es. 123456789",
    },
    { id: "nationality", label: "Cittadinanza", placeholder: "es. Croata" },
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
    if (PDF_EXCLUDED_QUESTION_IDS.has(q.id)) continue
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
      !manual.some((m) => m.id === q.id) &&
      !PDF_EXCLUDED_QUESTION_IDS.has(q.id)
    ) {
      result.push(q)
    }
  }
  for (const m of manual) {
    result.push(byId.get(m.id) ?? m)
  }
  return result
}
