import { NextResponse } from "next/server"
import { getDemoFallbackFields } from "@/lib/demo/demo-fields"
import { LOCALE_AI_NAMES, getMessages, isLocale } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

function schemaForSide(side: "front" | "back" | undefined) {
  if (side === "back") {
    return {
      type: "object",
      properties: {
        oib: { type: "string" },
        address: { type: "string" },
        issueDate: { type: "string" },
        expiryDate: { type: "string" },
        issuedBy: { type: "string" },
      },
      required: ["oib", "address", "issueDate", "expiryDate", "issuedBy"],
      additionalProperties: false,
    }
  }
  return {
    type: "object",
    properties: {
      fullName: { type: "string" },
      dateOfBirth: { type: "string" },
      idCardNumber: { type: "string" },
      nationality: { type: "string" },
    },
    required: ["fullName", "dateOfBirth", "idCardNumber", "nationality"],
    additionalProperties: false,
  }
}

function pickSideFields(
  raw: Record<string, unknown>,
  side: "front" | "back" | undefined
): Record<string, string> {
  const frontKeys = [
    "fullName",
    "dateOfBirth",
    "idCardNumber",
    "nationality",
  ] as const
  const backKeys = [
    "oib",
    "address",
    "issueDate",
    "expiryDate",
    "issuedBy",
  ] as const
  const keys =
    side === "back" ? backKeys : side === "front" ? frontKeys : [...frontKeys, ...backKeys]

  const out: Record<string, string> = {}
  for (const key of keys) {
    const v = raw[key]
    if (typeof v === "string" && v.trim()) out[key] = v.trim()
  }
  return out
}

function mergeWithFallback(
  fields: Record<string, string>,
  side: "front" | "back" | undefined,
  locale: Locale
): Record<string, string> {
  const fallback = getDemoFallbackFields(side ?? "front", locale)
  return { ...fallback, ...fields }
}

export async function POST(req: Request) {
  let locale: Locale = "en"
  let side: "front" | "back" | undefined

  try {
    const body = await req.json()
    const image =
      typeof body.image === "string" ? body.image.trim() : ""
    const documentName =
      typeof body.documentName === "string" ? body.documentName : "Document"
    side =
      body.side === "front" || body.side === "back" ? body.side : undefined

    if (typeof body.locale === "string" && isLocale(body.locale)) {
      locale = body.locale
    }

    if (!image || !image.startsWith("data:image")) {
      return NextResponse.json(
        { error: "Please upload a valid image." },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        fields: getDemoFallbackFields(side ?? "front", locale),
      })
    }

    const lang = LOCALE_AI_NAMES[locale]
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You extract text from Croatian osobna iskaznica (ID card) photos for administration in Split. Side: ${side ?? "unknown"}. Return JSON with only visible fields. Use empty string for missing keys. Labels/context in ${lang}. FRONT only: fullName, dateOfBirth, idCardNumber (document number on front — NOT OIB), nationality. BACK only: oib (11-digit personal ID on back), address, issueDate, expiryDate, issuedBy.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Document: ${documentName}. Extract all visible fields.`,
              },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "extracted_fields",
            strict: true,
            schema: schemaForSide(side),
          },
        },
        max_tokens: 500,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("[extract-image] OpenAI error:", res.status, errText)
      return NextResponse.json({
        fields: getDemoFallbackFields(side ?? "front", locale),
        fallback: true,
      })
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return NextResponse.json({
        fields: getDemoFallbackFields(side ?? "front", locale),
        fallback: true,
      })
    }

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(content) as Record<string, unknown>
    } catch {
      console.error("[extract-image] Invalid JSON from model:", content)
      return NextResponse.json({
        fields: getDemoFallbackFields(side ?? "front", locale),
        fallback: true,
      })
    }

    const fields = mergeWithFallback(pickSideFields(parsed, side), side, locale)
    return NextResponse.json({ fields })
  } catch (e) {
    console.error("[extract-image]", e)
    return NextResponse.json({
      fields: getDemoFallbackFields(side ?? "front", locale),
      fallback: true,
    })
  }
}
