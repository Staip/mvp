import { de } from "./messages/de"
import { en } from "./messages/en"
import { hr } from "./messages/hr"
import { it } from "./messages/it"
import type { Locale, Messages } from "./types"

const messages: Record<Locale, Messages> = { en, hr, de, it }

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.en
}

export type { Locale, Messages }
export {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_AI_NAMES,
  LOCALE_SPEECH_CODES,
  LOCALE_FLAGS,
  LOCALE_LABELS,
  LOCALES,
  LOCALE_STORAGE_KEY,
} from "./config"
