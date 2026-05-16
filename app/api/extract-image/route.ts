import { NextResponse } from "next/server"
import { LOCALE_AI_NAMES, getMessages, isLocale } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export async function POST(req: Request) {
  let locale: Locale = "en"
  try {
    const body = await req.json()
    const image =
      typeof body.image === "string" ? body.image.trim() : ""
    const documentName =
      typeof body.documentName === "string" ? body.documentName : "Document"

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
        fields: {
          fullName: "Demo User",
          documentType: documentName,
          extractedNote: "Add OPENAI_API_KEY for live OCR extraction.",
        },
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
            content: `Extract text fields from this document image for Croatian administration. Return JSON only with string values. Labels in ${lang}. Include: fullName, address, dateOfBirth, documentNumber, oib, issueDate, expiryDate, notes.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Document type: ${documentName}. Extract all visible fields.`,
              },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "extracted_fields",
            strict: false,
            schema: {
              type: "object",
              additionalProperties: { type: "string" },
            },
          },
        },
        max_tokens: 500,
      }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: getMessages(locale).api.serverError },
        { status: 500 }
      )
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    const fields = content ? JSON.parse(content) : {}
    return NextResponse.json({ fields })
  } catch {
    return NextResponse.json(
      { error: getMessages(locale).api.serverError },
      { status: 500 }
    )
  }
}
