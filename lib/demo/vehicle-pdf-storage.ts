const KEY = "splitflow-vehicle-pdf-previewed"

export function markVehiclePdfPreviewed() {
  if (typeof window === "undefined") return
  sessionStorage.setItem(KEY, "1")
}

export function isVehiclePdfPreviewed() {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem(KEY) === "1"
}

export function clearVehiclePdfPreviewed() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(KEY)
}
