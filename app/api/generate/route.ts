import { NextResponse } from "next/server"
import { LOCALE_AI_NAMES, getMessages, isLocale } from "@/lib/i18n"
import { getMockProcessGuide } from "@/lib/i18n/mock-guides"
import type { Locale } from "@/lib/i18n"
import type { ProcessGuide } from "@/lib/types"

const JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    estimatedDuration: { type: "string" },
    estimatedCost: { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["id", "title", "description"],
        additionalProperties: false,
      },
    },
    documents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          note: { type: "string" },
        },
        required: ["name", "note"],
        additionalProperties: false,
      },
    },
    locations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          purpose: { type: "string" },
        },
        required: ["name", "address", "purpose"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "title",
    "summary",
    "estimatedDuration",
    "estimatedCost",
    "steps",
    "documents",
    "locations",
  ],
  additionalProperties: false,
} as const

function systemPrompt(locale: Locale): string {
  const lang = LOCALE_AI_NAMES[locale]
  return `You are SplitFlow, an AI bureaucracy copilot for Split, Croatia.
Given a citizen's request, produce an accurate, practical step-by-step guide for Croatian/Split public administration.
Use real office types (Police Administration, City of Split, HGK, FINA, Tax Administration) with plausible Split addresses.
Be concise but helpful. Steps must be actionable. Documents must be realistic.
IMPORTANT: Write ALL text fields (title, summary, steps, documents, locations) in ${lang}.
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
          strict: true,
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

    return NextResponse.json({ guide, source })
  } catch {
    return NextResponse.json(
      { error: getMessages(locale).api.serverError },
      { status: 500 }
    )
  }
}
