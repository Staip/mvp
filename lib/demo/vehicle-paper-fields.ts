import type { Locale } from "@/lib/i18n"

export type VehicleFieldDef = {
  key: string
  label: Record<Locale, string>
}

/** Fields shown after scanning vehicle registration / technical papers */
export const VEHICLE_PAPER_FIELDS: VehicleFieldDef[] = [
  {
    key: "vin",
    label: {
      en: "Chassis number (VIN)",
      hr: "Broj šasije (VIN)",
      de: "Fahrgestellnummer (FIN)",
      it: "Numero di telaio (VIN)",
    },
  },
  {
    key: "fuelType",
    label: {
      en: "Fuel type",
      hr: "Vrsta goriva",
      de: "Kraftstoffart",
      it: "Tipo di carburante",
    },
  },
  {
    key: "vehicleMass",
    label: {
      en: "Vehicle mass (kg)",
      hr: "Masa vozila (kg)",
      de: "Fahrzeugmasse (kg)",
      it: "Massa del veicolo (kg)",
    },
  },
]

export function vehicleFieldLabel(def: VehicleFieldDef, locale: Locale) {
  return def.label[locale]
}

export function getVehiclePaperFallback(locale: Locale): Record<string, string> {
  return {
    vin: "WF0XXXGCDX1234567",
    fuelType: locale === "hr" ? "Dizel" : "Diesel",
    vehicleMass: "1420",
  }
}

export function pickVehiclePaperFields(
  raw: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const def of VEHICLE_PAPER_FIELDS) {
    const v = raw[def.key]?.trim()
    if (v) out[def.key] = v
  }
  return out
}
