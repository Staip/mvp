import { NextResponse } from "next/server"
import { buildHelpSystemPrompt } from "@/lib/contextual-help/build-prompt"
import type { HelpChatMessage, HelpContext } from "@/lib/contextual-help/types"
import { isLocale } from "@/lib/i18n"

function isHelpContext(value: unknown): value is HelpContext {
  if (!value || typeof value !== "object") return false
  const c = value as HelpContext
  return typeof c.scope === "string" && isLocale(c.locale)
}

function mockReply(context: HelpContext, question: string): string {
  const field = context.field?.label ?? context.step?.title ?? "this step"
  return `For "${field}": in Split, bring the documents listed in your guide and check opening hours before visiting. (${question.slice(0, 80)}…) — Add OPENAI_API_KEY for live answers.`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const context = body.context
    const messages = body.messages as HelpChatMessage[] | undefined

    if (!isHelpContext(context)) {
      return NextResponse.json({ error: "Invalid context" }, { status: 400 })
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 })
    }

    const last = messages[messages.length - 1]
    if (last.role !== "user" || !last.content.trim()) {
      return NextResponse.json({ error: "Last message must be from user" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        reply: mockReply(context, last.content),
      })
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.35,
        messages: [
          { role: "system", content: buildHelpSystemPrompt(context) },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || `OpenAI error ${res.status}`)
    }

    const data = await res.json()
    const reply =
      data.choices?.[0]?.message?.content?.trim() ??
      "I could not generate an answer. Please try again."

    return NextResponse.json({ reply })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
