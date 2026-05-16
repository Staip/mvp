const KEY = "splitflow-vehicle-papers"

export type VehiclePaperData = {
  fields: Record<string, string>
  done: boolean
}

export function loadVehiclePaperExtracted(): VehiclePaperData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as VehiclePaperData
  } catch {
    return null
  }
}

export function saveVehiclePaperExtracted(fields: Record<string, string>) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(
    KEY,
    JSON.stringify({ fields, done: true } satisfies VehiclePaperData)
  )
}

export function clearVehiclePaperExtracted() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(KEY)
}

export function isVehiclePaperScanComplete() {
  return !!loadVehiclePaperExtracted()?.done
}
