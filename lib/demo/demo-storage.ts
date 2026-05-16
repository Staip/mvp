const KEY = "splitflow-demo-extracted"

import { DEMO_FRONT_FIELDS } from "@/lib/demo/demo-fields"

const FRONT_KEYS = new Set(DEMO_FRONT_FIELDS.map((f) => f.key))

export type DemoExtractedData = {
  fields: Record<string, string>
  frontDone: boolean
}

export function loadDemoExtracted(): DemoExtractedData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DemoExtractedData & { backDone?: boolean }
    return {
      fields: parsed.fields ?? {},
      frontDone: !!parsed.frontDone,
    }
  } catch {
    return null
  }
}

export function saveDemoExtracted(data: DemoExtractedData) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(KEY, JSON.stringify(data))
}

export function mergeDemoFields(partial: Record<string, string>) {
  const frontOnly: Record<string, string> = {}
  for (const [key, value] of Object.entries(partial)) {
    if (FRONT_KEYS.has(key) && value?.trim()) frontOnly[key] = value.trim()
  }
  const next: DemoExtractedData = {
    fields: frontOnly,
    frontDone: true,
  }
  saveDemoExtracted(next)
  return next
}

export function clearDemoExtracted() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(KEY)
}

export function isDemoIdScanComplete() {
  const d = loadDemoExtracted()
  return !!d?.frontDone
}
