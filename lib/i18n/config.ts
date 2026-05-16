import type { Locale } from "./types"

export const LOCALES: Locale[] = ["en", "hr", "de", "it"]

export const DEFAULT_LOCALE: Locale = "en"

export const LOCALE_STORAGE_KEY = "splitflow-locale"

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  hr: "Hrvatski",
  de: "Deutsch",
  it: "Italiano",
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  hr: "🇭🇷",
  de: "🇩🇪",
  it: "🇮🇹",
}

export const LOCALE_AI_NAMES: Record<Locale, string> = {
  en: "English",
  hr: "Croatian",
  de: "German",
  it: "Italian",
}

/** BCP-47 codes for Web Speech API recognition */
export const LOCALE_SPEECH_CODES: Record<Locale, string> = {
  en: "en-US",
  hr: "hr-HR",
  de: "de-DE",
  it: "it-IT",
}

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale)
}
