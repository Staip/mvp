const KEY = "splitflow-demo-extracted"

export type DemoExtractedData = {
  fields: Record<string, string>
  frontDone: boolean
  backDone: boolean
}

export function loadDemoExtracted(): DemoExtractedData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as DemoExtractedData
  } catch {
    return null
  }
}

export function saveDemoExtracted(data: DemoExtractedData) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(KEY, JSON.stringify(data))
}

export function mergeDemoFields(
  partial: Record<string, string>,
  side: "front" | "back"
) {
  const prev = loadDemoExtracted() ?? {
    fields: {},
    frontDone: false,
    backDone: false,
  }
  const next: DemoExtractedData = {
    fields: { ...prev.fields, ...partial },
    frontDone: side === "front" ? true : prev.frontDone,
    backDone: side === "back" ? true : prev.backDone,
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
  return !!(d?.frontDone && d?.backDone)
}
