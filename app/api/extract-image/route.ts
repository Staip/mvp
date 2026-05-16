import { NextResponse } from "next/server"
import {
  getDemoFallbackFields,
  getVehicleDemoFallback,
} from "@/lib/demo/demo-fields"
import { getVehiclePaperFallback } from "@/lib/demo/vehicle-paper-fields"
import { LOCALE_AI_NAMES, isLocale } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

type ExtractMode = "id_front" | "id_back" | "vehicle" | "vehicle_papers"

function isVehicleDocument(name: string) {
  return /insurance|osigur|technical|pregled|vehicle|vozil|registration|promet|invoice|račun|racun|car|auto|vin|homolog|polic|certifikat|potvrda/i.test(
    name
  )
}

function resolveMode(
  side: "front" | "back" | undefined,
  documentName: string,
  context?: string
): ExtractMode {
  if (context === "vehicle_papers") return "vehicle_papers"
  if (side === "back") return "id_back"
  if (side === "front") return "id_front"
  if (isVehicleDocument(documentName)) return "vehicle"
  return "id_front"
}

function schemaForMode(mode: ExtractMode) {
  if (mode === "id_back") {
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
  if (mode === "vehicle_papers") {
    return {
      type: "object",
      properties: {
        vin: { type: "string" },
        fuelType: { type: "string" },
        vehicleMass: { type: "string" },
      },
      required: ["vin", "fuelType", "vehicleMass"],
      additionalProperties: false,
    }
  }
  if (mode === "vehicle") {
    return {
      type: "object",
      properties: {
        vin: { type: "string" },
        make: { type: "string" },
        model: { type: "string" },
        year: { type: "string" },
        color: { type: "string" },
        registrationNumber: { type: "string" },
        engineNumber: { type: "string" },
        fuelType: { type: "string" },
        insurancePolicy: { type: "string" },
        insuranceValidUntil: { type: "string" },
      },
      required: [
        "vin",
        "make",
        "model",
        "year",
        "color",
        "registrationNumber",
        "engineNumber",
        "fuelType",
        "insurancePolicy",
        "insuranceValidUntil",
      ],
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

const MODE_KEYS: Record<ExtractMode, readonly string[]> = {
  id_front: ["fullName", "dateOfBirth", "idCardNumber", "nationality"],
  id_back: ["oib", "address", "issueDate", "expiryDate", "issuedBy"],
  vehicle_papers: ["vin", "fuelType", "vehicleMass"],
  vehicle: [
    "vin",
    "make",
    "model",
    "year",
    "color",
    "registrationNumber",
    "engineNumber",
    "fuelType",
    "insurancePolicy",
    "insuranceValidUntil",
  ],
}

function pickFields(
  raw: Record<string, unknown>,
  mode: ExtractMode
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of MODE_KEYS[mode]) {
    const v = raw[key]
    if (typeof v === "string" && v.trim()) out[key] = v.trim()
  }
  return out
}

function fallbackForMode(mode: ExtractMode, locale: Locale) {
  if (mode === "vehicle_papers") return getVehiclePaperFallback(locale)
  if (mode === "vehicle") return getVehicleDemoFallback(locale)
  if (mode === "id_back") return getDemoFallbackFields("back", locale)
  return getDemoFallbackFields("front", locale)
}

function systemPrompt(mode: ExtractMode, lang: string, documentName: string) {
  if (mode === "vehicle_papers") {
    return `You extract text from Croatian vehicle registration papers (prometna dozvola / technical record) for Split administration. Document: ${documentName}. ${lang}. Return JSON keys only: vin (chassis/VIN), fuelType (petrol/diesel/LPG etc.), vehicleMass (kerb mass in kg as digits). Use empty string if not visible.`
  }
  if (mode === "vehicle") {
    return `You extract text from vehicle-related documents (registration card, insurance policy, technical inspection) for Croatian administration in Split. Document: ${documentName}. Return JSON with visible fields only; empty string if missing. Language context: ${lang}. Keys: vin, make, model, year, color, registrationNumber, engineNumber, fuelType, insurancePolicy, insuranceValidUntil.`
  }
  if (mode === "id_back") {
    return `You extract text from Croatian osobna iskaznica BACK side. ${lang}. Keys: oib (11-digit on back), address, issueDate, expiryDate, issuedBy.`
  }
  return `You extract text from Croatian osobna iskaznica FRONT side. ${lang}. Keys: fullName, dateOfBirth, idCardNumber (NOT OIB), nationality.`
}

export async function POST(req: Request) {
  let locale: Locale = "en"
  let side: "front" | "back" | undefined
  let mode: ExtractMode = "id_front"

  try {
    const body = await req.json()
    const image =
      typeof body.image === "string" ? body.image.trim() : ""
    const documentName =
      typeof body.documentName === "string" ? body.documentName : "Document"
    side =
      body.side === "front" || body.side === "back" ? body.side : undefined
    const context =
      typeof body.context === "string" ? body.context : undefined
    mode = resolveMode(side, documentName, context)

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
      return NextResponse.json({ fields: fallbackForMode(mode, locale) })
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
            content: systemPrompt(mode, lang, documentName),
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
            schema: schemaForMode(mode),
          },
        },
        max_tokens: 500,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("[extract-image] OpenAI error:", res.status, errText)
      return NextResponse.json({
        fields: fallbackForMode(mode, locale),
        fallback: true,
      })
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return NextResponse.json({
        fields: fallbackForMode(mode, locale),
        fallback: true,
      })
    }

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(content) as Record<string, unknown>
    } catch {
      console.error("[extract-image] Invalid JSON from model:", content)
      return NextResponse.json({
        fields: fallbackForMode(mode, locale),
        fallback: true,
      })
    }

    const fields = {
      ...fallbackForMode(mode, locale),
      ...pickFields(parsed, mode),
    }
    return NextResponse.json({ fields })
  } catch (e) {
    console.error("[extract-image]", e)
    return NextResponse.json({
      fields: fallbackForMode(mode, locale),
      fallback: true,
    })
  }
}
