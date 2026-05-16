export function downloadTextDocument(
  filename: string,
  lines: string[]
) {
  const body = lines.filter(Boolean).join("\n\n")
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
