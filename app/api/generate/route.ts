import { NextResponse } from "next/server"
import { LOCALE_AI_NAMES, getMessages, isLocale } from "@/lib/i18n"
import {
  detectGuideScenario,
  getMockProcessGuide,
} from "@/lib/i18n/mock-guides"
import { normalizeProcessGuide } from "@/lib/normalize-guide"
import type { Locale } from "@/lib/i18n"
import type { ProcessGuide } from "@/lib/types"

/** Minimal schema — normalize-guide fills documents, locations, and questions. */
const JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    estimatedDuration: { type: "string" },
    estimatedCost: { type: "string" },
    steps: {
      type: "array",
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          kind: { type: "string", enum: ["document", "upload", "visit"] },
        },
        required: ["id", "title", "description", "kind"],
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
  ],
  additionalProperties: false,
} as const

function systemPrompt(locale: Locale): string {
  const lang = LOCALE_AI_NAMES[locale]
  return `SplitFlow — bureaucracy guide for Split, Croatia. Language: ${lang}.
Return JSON only. ID scan is automatic (never add ID upload steps).
Exactly 3 steps: mix document/upload, end with kind "visit". Short titles (≤8 words) and one-sentence descriptions.
Do not include questions, locations, or nested objects — only id, title, description, kind per step.`
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
      temperature: 0.2,
      max_tokens: 700,
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

    const scenario = detectGuideScenario(request)
    let guide: ProcessGuide
    let source: "ai" | "mock" | "template" = "ai"

    if (scenario === "car" || scenario === "business") {
      guide = getMockProcessGuide(request, locale)
      source = "template"
    } else {
      try {
        guide = await generateWithOpenAI(request, locale)
        guide = normalizeProcessGuide(guide, locale)
      } catch {
        guide = getMockProcessGuide(request, locale)
        source = "mock"
      }
      return NextResponse.json({ guide, source })
    }

    return NextResponse.json({ guide, source })
  } catch {
    return NextResponse.json(
      { error: getMessages(locale).api.serverError },
      { status: 500 }
    )
  }
}
