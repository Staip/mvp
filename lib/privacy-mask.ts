/** Mask sensitive ID numbers for on-screen display (keeps first/last digits). */
export function maskIdCardNumber(value: string): string {
  const raw = value.trim()
  if (!raw) return ""
  const compact = raw.replace(/\s+/g, "")
  if (compact.length <= 4) return "••••"
  const visibleStart = Math.min(2, compact.length - 3)
  const visibleEnd = 2
  const hidden = Math.max(compact.length - visibleStart - visibleEnd, 1)
  return (
    compact.slice(0, visibleStart) +
    "•".repeat(Math.min(hidden, 10)) +
    compact.slice(-visibleEnd)
  )
}

export function maskSensitiveFieldValue(
  fieldKey: string,
  value: string
): string {
  if (fieldKey === "idCardNumber") return maskIdCardNumber(value)
  return value
}
