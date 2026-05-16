import type { Locale } from "@/lib/i18n"

export type PdfSection = {
  title: string
  subtitle?: string
  rows: Array<{ label: string; value: string }>
  checklist?: string[]
}

export type RegistrationPacketPdfInput = {
  processTitle: string
  referenceNumber: string
  submittedAt: string
  sections: PdfSection[]
  footer: string
  locale: Locale
}

const FORM_REF: Record<Locale, string> = {
  en: "Form MU-S-VD-01 · Vehicle registration",
  hr: "Obrazac MU-S-VD-01 · Registracija vozila",
  de: "Formular MU-S-VD-01 · Fahrzeugzulassung",
  it: "Modulo MU-S-VD-01 · Immatricolazione veicolo",
}

const OFFICE: Record<Locale, string> = {
  en: "Police Administration Split · Vehicle desk",
  hr: "Policijska uprava Split · Sektor vozila",
  de: "Polizeiverwaltung Split · Fahrzeugabteilung",
  it: "Polizia di Spalato · Ufficio veicoli",
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function openPrintHtml(html: string, filename: string) {
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

/** Legacy simple table PDF (document steps). */
export function downloadApplicationPdf(
  filename: string,
  title: string,
  rows: Array<{ label: string; value: string }>,
  footer: string
) {
  downloadRegistrationPacket({
    processTitle: title,
    referenceNumber: `SF-${Date.now().toString().slice(-8)}`,
    submittedAt: new Date().toLocaleDateString(),
    sections: [{ title: title, rows }],
    footer,
    locale: "en",
  })
}

export type BuildPacketHtmlOptions = {
  /** When true, opens browser print dialog on load (download flow). */
  autoPrint?: boolean
}

export function buildRegistrationPacketHtml(
  input: RegistrationPacketPdfInput,
  options: BuildPacketHtmlOptions = {}
): string {
  const { processTitle, referenceNumber, submittedAt, sections, footer, locale } =
    input
  const { autoPrint = false } = options

  const sectionsHtml = sections
    .map((sec) => {
      const rowsHtml =
        sec.rows.length > 0
          ? `<table class="fields">
        ${sec.rows
          .map(
            (r) =>
              `<tr>
            <td class="label">${escapeHtml(r.label)}</td>
            <td class="value">${escapeHtml(r.value)}</td>
          </tr>`
          )
          .join("")}
      </table>`
          : ""

      const checklistHtml =
        sec.checklist && sec.checklist.length > 0
          ? `<ul class="checklist">
        ${sec.checklist
          .map(
            (item) =>
              `<li><span class="box checked"></span>${escapeHtml(item)}</li>`
          )
          .join("")}
      </ul>`
          : ""

      return `<section class="block">
      <h2>${escapeHtml(sec.title)}</h2>
      ${sec.subtitle ? `<p class="sub">${escapeHtml(sec.subtitle)}</p>` : ""}
      ${rowsHtml}
      ${checklistHtml}
    </section>`
    })
    .join("")

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(processTitle)} — ${escapeHtml(referenceNumber)}</title>
  <style>
    @page { size: A4; margin: 14mm 16mm; }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      color: #1a1a1a;
      line-height: 1.35;
      margin: 0;
      padding: 0;
    }
    .page { max-width: 210mm; margin: 0 auto; padding: 8mm 0; }
    .masthead {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      border-bottom: 3px solid #1e4d7b;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .crest {
      width: 52px; height: 52px;
      border: 2px solid #1e4d7b;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 11px; color: #1e4d7b;
      flex-shrink: 0;
    }
    .masthead h1 {
      margin: 0;
      font-size: 13pt;
      font-weight: 700;
      color: #1e4d7b;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .masthead .office { margin: 4px 0 0; font-size: 10pt; color: #444; }
    .masthead .form-ref { margin: 2px 0 0; font-size: 9pt; color: #666; }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 24px;
      background: #f4f6f8;
      border: 1px solid #c5cdd6;
      padding: 10px 14px;
      margin-bottom: 18px;
      font-size: 9.5pt;
    }
    .meta-bar strong { color: #1e4d7b; }
    .block { margin-bottom: 18px; page-break-inside: avoid; }
    .block h2 {
      margin: 0 0 6px;
      font-size: 10.5pt;
      font-weight: 700;
      color: #fff;
      background: #1e4d7b;
      padding: 6px 10px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .block .sub {
      margin: 0 0 8px;
      font-size: 9pt;
      color: #555;
      font-style: italic;
    }
    table.fields {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
    }
    table.fields td {
      border: 1px solid #b8c4ce;
      padding: 7px 10px;
      vertical-align: top;
    }
    table.fields .label {
      width: 42%;
      background: #f8fafb;
      color: #333;
      font-weight: 500;
    }
    table.fields .value {
      font-weight: 600;
      color: #111;
    }
    ul.checklist {
      list-style: none;
      margin: 0;
      padding: 0;
      border: 1px solid #b8c4ce;
    }
    ul.checklist li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-bottom: 1px solid #dde4ea;
      font-size: 10pt;
    }
    ul.checklist li:last-child { border-bottom: none; }
    .box {
      width: 14px; height: 14px;
      border: 1.5px solid #1e4d7b;
      flex-shrink: 0;
      position: relative;
    }
    .box.checked::after {
      content: "✓";
      position: absolute;
      inset: -2px 0 0 1px;
      font-size: 12px;
      font-weight: 700;
      color: #1e4d7b;
    }
    .signatures {
      display: flex;
      gap: 24px;
      margin-top: 28px;
      page-break-inside: avoid;
    }
    .sig {
      flex: 1;
      border-top: 1px solid #333;
      padding-top: 6px;
      font-size: 8.5pt;
      color: #555;
    }
    .stamp {
      width: 90px; height: 90px;
      border: 2px dashed #aaa;
      border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 8pt; color: #999;
      text-align: center;
      margin-left: auto;
    }
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ccc;
      font-size: 8pt;
      color: #777;
    }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="masthead">
      <div class="crest">RH</div>
      <div>
        <h1>Republika Hrvatska</h1>
        <p class="office">${escapeHtml(OFFICE[locale])}</p>
        <p class="form-ref">${escapeHtml(FORM_REF[locale])}</p>
      </div>
    </header>

    <div class="meta-bar">
      <span><strong>Predmet / Subject:</strong> ${escapeHtml(processTitle)}</span>
      <span><strong>Ur.broj / Ref.:</strong> ${escapeHtml(referenceNumber)}</span>
      <span><strong>Datum / Date:</strong> ${escapeHtml(submittedAt)}</span>
    </div>

    ${sectionsHtml}

    <div class="signatures">
      <div class="sig">Potpis podnositelja / Applicant signature</div>
      <div class="sig">Datum / Date: _______________</div>
      <div class="stamp">Pečat<br/>ureda</div>
    </div>

    <p class="footer">${escapeHtml(footer)} · SplitFlow demo · ${escapeHtml(referenceNumber)}</p>
  </div>
  ${autoPrint ? `<script>window.onload=function(){setTimeout(function(){window.print()},400)}</script>` : ""}
</body>
</html>`

  return html
}

export function printRegistrationPacketHtml(html: string, filename: string) {
  openPrintHtml(html, filename)
}

export function downloadRegistrationPacket(input: RegistrationPacketPdfInput) {
  const html = buildRegistrationPacketHtml(input, { autoPrint: true })
  const safeName = input.processTitle
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40)
  openPrintHtml(html, `${safeName || "registration-packet"}.pdf`)
}
