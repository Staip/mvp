import type { Locale } from "@/lib/i18n"
import type { ProcessGuide, ProcessStep } from "@/lib/types"

export const ID_SCAN_STEP_ID = "splitflow-id-scan"

const COPY: Record<
  Locale,
  {
    title: string
    description: string
    hint: string
    docName: string
    docNote: string
  }
> = {
  en: {
    title: "Scan your ID card",
    description:
      "Required first step for every process. Upload the front of your ID — AI extracts your details for all forms below.",
    hint: "Hold the card flat, good lighting, all corners visible.",
    docName: "Croatian ID card",
    docNote: "Front side only",
  },
  hr: {
    title: "Skenirajte osobnu iskaznicu",
    description:
      "Obavezni prvi korak za svaki postupak. Učitajte prednju stranu osobne — AI popunjava podatke u obrascima ispod.",
    hint: "Držite iskaznicu ravno, dobro osvjetljenje, svi kutovi vidljivi.",
    docName: "Osobna iskaznica",
    docNote: "Samo prednja strana",
  },
  de: {
    title: "Personalausweis scannen",
    description:
      "Pflichtschritt für jedes Verfahren. Vorderseite hochladen — die KI füllt alle Formulare aus.",
    hint: "Karte flach halten, gute Beleuchtung.",
    docName: "Personalausweis",
    docNote: "Nur Vorderseite",
  },
  it: {
    title: "Scansiona la carta d'identità",
    description:
      "Primo passo obbligatorio per ogni pratica. Carica il fronte della carta d'identità — l'IA compila i moduli.",
    hint: "Tieni la carta piatta, buona luce.",
    docName: "Carta d'identità",
    docNote: "Solo fronte",
  },
}

export function buildIdScanStep(locale: Locale): ProcessStep {
  const c = COPY[locale]
  return {
    id: ID_SCAN_STEP_ID,
    title: c.title,
    description: c.description,
    kind: "upload",
    uploadVariant: "id_card_two_sided",
    document: { name: c.docName, note: c.docNote },
    uploadHint: c.hint,
  }
}

/** Steps the app replaces with the canonical two-sided ID scan (step 1). */
export function isRedundantIdScanStep(step: ProcessStep): boolean {
  if (step.id === ID_SCAN_STEP_ID || step.uploadVariant === "id_card_two_sided") {
    return true
  }

  const text = [
    step.title,
    step.description,
    step.document?.name,
    step.document?.note,
    step.uploadHint,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  const mentionsIdCard =
    /osobn[a-z\u0107\u010d\u0161\u017e]*\s*iskaznic|hrvatsk[a-z]*\s*iskaznic|croatian\s*id|identity\s*card|personalausweis|carta\s*d'identit|\bid\s*card\b|\bosobna\b/.test(
      text
    )
  const mentionsScanOrUpload =
    /scan|upload|photo|skenir|fotograf|scansion|nachweis|slik/.test(text)

  if (mentionsIdCard && (step.kind === "upload" || mentionsScanOrUpload)) {
    return true
  }

  return (
    mentionsScanOrUpload &&
    /\b(id|iskaznic|ausweis|identity)\b/.test(text) &&
    step.kind === "upload"
  )
}

export function prependIdScanStep(
  guide: Omit<ProcessGuide, "steps"> & { steps: ProcessStep[] },
  locale: Locale
): ProcessGuide {
  const rest = guide.steps.filter((s) => !isRedundantIdScanStep(s))
  return {
    ...guide,
    steps: [buildIdScanStep(locale), ...rest],
  }
}

export function isIdScanStep(step: ProcessStep) {
  return (
    step.id === ID_SCAN_STEP_ID || step.uploadVariant === "id_card_two_sided"
  )
}
