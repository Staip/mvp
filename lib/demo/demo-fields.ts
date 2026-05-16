import type { Locale } from "@/lib/i18n"

export type DemoFieldDef = {
  key: string
  label: Record<Locale, string>
}

export const DEMO_FRONT_FIELDS: DemoFieldDef[] = [
  {
    key: "fullName",
    label: {
      en: "Full name",
      hr: "Ime i prezime",
      de: "Vollständiger Name",
      it: "Nome completo",
    },
  },
  {
    key: "dateOfBirth",
    label: {
      en: "Date of birth",
      hr: "Datum rođenja",
      de: "Geburtsdatum",
      it: "Data di nascita",
    },
  },
  {
    key: "idCardNumber",
    label: {
      en: "ID card number",
      hr: "Broj osobne iskaznice",
      de: "Ausweisnummer",
      it: "Numero carta d'identità",
    },
  },
  {
    key: "nationality",
    label: {
      en: "Nationality",
      hr: "Državljanstvo",
      de: "Staatsangehörigkeit",
      it: "Cittadinanza",
    },
  },
]

export const DEMO_BACK_FIELDS: DemoFieldDef[] = [
  {
    key: "oib",
    label: {
      en: "OIB",
      hr: "OIB",
      de: "OIB",
      it: "OIB",
    },
  },
  {
    key: "address",
    label: {
      en: "Registered address",
      hr: "Prebivalište",
      de: "Wohnadresse",
      it: "Indirizzo di residenza",
    },
  },
  {
    key: "issueDate",
    label: {
      en: "Issue date",
      hr: "Datum izdavanja",
      de: "Ausstellungsdatum",
      it: "Data di rilascio",
    },
  },
  {
    key: "expiryDate",
    label: {
      en: "Expiry date",
      hr: "Datum isteka",
      de: "Ablaufdatum",
      it: "Data di scadenza",
    },
  },
  {
    key: "issuedBy",
    label: {
      en: "Issued by",
      hr: "Izdano od",
      de: "Ausgestellt von",
      it: "Rilasciato da",
    },
  },
]

export function getDemoFallbackFields(
  side: "front" | "back",
  locale: Locale
): Record<string, string> {
  if (side === "front") {
    const names: Record<Locale, string> = {
      en: "Ana Horvat",
      hr: "Ana Horvat",
      de: "Ana Horvat",
      it: "Ana Horvat",
    }
    const nat: Record<Locale, string> = {
      en: "Croatian",
      hr: "Hrvatsko",
      de: "Kroatisch",
      it: "Croata",
    }
    return {
      fullName: names[locale],
      dateOfBirth: "15.03.1992.",
      idCardNumber: "123456789",
      nationality: nat[locale],
    }
  }
  const addresses: Record<Locale, string> = {
    en: "Obala hrvatskog narodnog preporoda 12, 21000 Split",
    hr: "Obala hrvatskog narodnog preporoda 12, 21000 Split",
    de: "Obala hrvatskog narodnog preporoda 12, 21000 Split",
    it: "Obala hrvatskog narodnog preporoda 12, 21000 Split",
  }
  const issued: Record<Locale, string> = {
    en: "Ministry of Interior — Split",
    hr: "Ministarstvo unutarnjih poslova — Split",
    de: "Innenministerium — Split",
    it: "Ministero dell'Interno — Spalato",
  }
  return {
    oib: "12345678901",
    address: addresses[locale],
    issueDate: "12.06.2021.",
    expiryDate: "12.06.2031.",
    issuedBy: issued[locale],
  }
}

export function fieldLabel(def: DemoFieldDef, locale: Locale) {
  return def.label[locale]
}
