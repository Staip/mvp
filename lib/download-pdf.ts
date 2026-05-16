/** Client-side PDF download for demo applications (no extra dependencies). */
export function downloadApplicationPdf(
  filename: string,
  title: string,
  rows: Array<{ label: string; value: string }>,
  footer: string
) {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")

  const rowsHtml = rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border:1px solid #ccc;color:#555;width:40%">${escape(r.label)}</td><td style="padding:8px 12px;border:1px solid #ccc;font-weight:600">${escape(r.value)}</td></tr>`
    )
    .join("")

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escape(title)}</title>
<style>
  body{font-family:Helvetica,Arial,sans-serif;padding:40px;color:#111;max-width:700px;margin:0 auto}
  h1{font-size:20px;color:#0c7ea6;margin:0 0 8px}
  .meta{font-size:11px;color:#666;margin-bottom:24px}
  table{border-collapse:collapse;width:100%;font-size:13px}
  .footer{margin-top:32px;font-size:10px;color:#888;border-top:1px solid #ddd;padding-top:12px}
</style></head>
<body>
  <h1>${escape(title)}</h1>
  <p class="meta">SplitFlow · City of Split · Generated application</p>
  <table>${rowsHtml}</table>
  <p class="footer">${escape(footer)}</p>
  <script>window.onload=function(){window.print()}</script>
</body></html>`

  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const w = window.open(url, "_blank", "noopener,noreferrer")
  if (!w) {
    const a = document.createElement("a")
    a.href = url
    a.download = filename.replace(/\.pdf$/, ".html")
    a.click()
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
