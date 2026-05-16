import { NextResponse } from "next/server"
import { LOCALE_AI_NAMES, getMessages, isLocale } from "@/lib/i18n"
import { getMockProcessGuide } from "@/lib/i18n/mock-guides"
import { normalizeProcessGuide } from "@/lib/normalize-guide"
import type { Locale } from "@/lib/i18n"
import type { ProcessGuide } from "@/lib/types"

const stepSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    kind: { type: "string", enum: ["document", "upload", "visit"] },
    document: {
      type: "object",
      properties: {
        name: { type: "string" },
        note: { type: "string" },
      },
      required: ["name", "note"],
      additionalProperties: false,
    },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          placeholder: { type: "string" },
        },
        required: ["id", "label", "placeholder"],
        additionalProperties: false,
      },
    },
    uploadHint: { type: "string" },
    location: {
      type: "object",
      properties: {
        name: { type: "string" },
        address: { type: "string" },
      },
      required: ["name", "address"],
      additionalProperties: false,
    },
    openingHours: { type: "string" },
    appointmentDurationMinutes: {
      type: "number",
      description:
        "For visit steps only: slot length in minutes (15, 30, or 45) based on how long this appointment type takes at the office.",
    },
  },
  required: ["id", "title", "description", "kind"],
  additionalProperties: false,
} as const

const JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    estimatedDuration: { type: "string" },
    estimatedCost: { type: "string" },
    steps: { type: "array", items: stepSchema },
  },
  required: [
    "title",
    "summary",
    "estimatedDuration",
    "estimatedCost",
    "steps",
  ],
  additionalProperties: false,
} as const

function systemPrompt(locale: Locale): string {
  const lang = LOCALE_AI_NAMES[locale]
  return `You are SplitFlow, an AI bureaucracy copilot for Split, Croatia.
The app ALWAYS prepends a mandatory two-sided ID card scan as step 1 ("Scan your ID card") — never add any step about scanning, photographing, or uploading an ID card, osobna iskaznica, or identity document.
Create the remaining steps (3–5 steps). Each step has exactly ONE kind:
- "document": user answers short questions; we generate a downloadable form/PDF. Include document {name, note} and 2–3 questions (use ids fullName, oib, address when relevant).
- "upload": user uploads ONE photo of a specific document (not ID). Include document {name, note} and uploadHint.
- "visit": user visits ONE office with booking. Include location {name, address}, openingHours, and appointmentDurationMinutes (15 quick, 30 standard, 45 complex).
End with a visit step when the user must submit in person. Use real Split offices. Write ALL text in ${lang}.
Respond ONLY with valid JSON matching the schema.`
}

async function generateWithOpenAI(
  request: string,
  locale: Locale
): Promise<ProcessGuide> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured")
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt(locale) },
        { role: "user", content: request },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "process_guide",
          strict: false,
          schema: JSON_SCHEMA,
        },
      },
      temperature: 0.4,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `OpenAI error ${res.status}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("Empty AI response")

  return JSON.parse(content) as ProcessGuide
}

export async function POST(req: Request) {
  let locale: Locale = "en"

  try {
    const body = await req.json()
    const request =
      typeof body.request === "string" ? body.request.trim() : ""

    if (typeof body.locale === "string" && isLocale(body.locale)) {
      locale = body.locale
    }

    const msg = getMessages(locale).api

    if (!request || request.length < 3) {
      return NextResponse.json({ error: msg.requestRequired }, { status: 400 })
    }

    if (request.length > 500) {
      return NextResponse.json({ error: msg.requestTooLong }, { status: 400 })
    }

    let guide: ProcessGuide
    let source: "ai" | "mock" = "ai"

    try {
      guide = await generateWithOpenAI(request, locale)
    } catch {
      guide = getMockProcessGuide(request, locale)
      source = "mock"
    }

    guide = normalizeProcessGuide(guide, locale)

    return NextResponse.json({ guide, source })
  } catch {
    return NextResponse.json(
      { error: getMessages(locale).api.serverError },
      { status: 500 }
    )
  }
}
