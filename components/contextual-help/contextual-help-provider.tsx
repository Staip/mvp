"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { Loader2, MessageCircle, Send, X } from "lucide-react"

import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import type { HelpChatMessage, HelpContext } from "@/lib/contextual-help/types"
import type { ProcessGuide } from "@/lib/types"

type ContextualHelpContextValue = {
  openHelp: (context: Omit<HelpContext, "locale">) => void
}

const ContextualHelpContext = createContext<ContextualHelpContextValue | null>(
  null
)

type GuideHelpBundle = {
  processTitle: string
  processSummary: string
  userRequest: string
  guide: ProcessGuide
}

const GuideHelpContext = createContext<GuideHelpBundle | null>(null)

export function GuideHelpProvider({
  children,
  processTitle,
  processSummary,
  userRequest,
  guide,
}: GuideHelpBundle & { children: React.ReactNode }) {
  const value = useMemo(
    () => ({ processTitle, processSummary, userRequest, guide }),
    [processTitle, processSummary, userRequest, guide]
  )
  return (
    <GuideHelpContext.Provider value={value}>{children}</GuideHelpContext.Provider>
  )
}

export function useGuideHelp() {
  return useContext(GuideHelpContext)
}

function contextTitle(
  context: HelpContext,
  labels: ReturnType<typeof useLocale>["t"]["helpChat"]
): string {
  switch (context.scope) {
    case "main_input":
      return labels.titleMain
    case "step":
      return labels.titleStep.replace("{step}", context.step?.title ?? "")
    case "document_field":
      return labels.titleField.replace(
        "{field}",
        context.field?.label ?? ""
      )
    case "document_step":
      return labels.titleDocument.replace(
        "{document}",
        context.documentName ?? ""
      )
    case "upload":
      return labels.titleUpload
    case "visit_location":
      return labels.titleVisit
    case "booking_date":
      return labels.titleBookingDate
    case "booking_time":
      return labels.titleBookingTime
    case "booking_step":
      return labels.titleBooking
    default:
      return labels.titleDefault
  }
}

function welcomeMessage(
  context: HelpContext,
  labels: ReturnType<typeof useLocale>["t"]["helpChat"]
): string {
  if (context.scope === "main_input") {
    return labels.welcomeMain
  }
  if (context.field) {
    return labels.welcomeField.replace("{field}", context.field.label)
  }
  if (context.step) {
    return labels.welcomeStep.replace("{step}", context.step.title)
  }
  return labels.welcomeDefault
}

export function ContextualHelpProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { locale, t } = useLocale()
  const labels = t.helpChat
  const [open, setOpen] = useState(false)
  const [context, setContext] = useState<HelpContext | null>(null)
  const [messages, setMessages] = useState<HelpChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const openHelp = useCallback(
    (partial: Omit<HelpContext, "locale">) => {
      const full: HelpContext = { ...partial, locale }
      setContext(full)
      setMessages([
        {
          role: "assistant",
          content: welcomeMessage(full, labels),
        },
      ])
      setInput("")
      setError(null)
      setOpen(true)
    },
    [locale, labels]
  )

  const closeHelp = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, open, loading])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeHelp()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, closeHelp])

  async function send() {
    const text = input.trim()
    if (!text || !context || loading) return

    const nextMessages: HelpChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ]
    setMessages(nextMessages)
    setInput("")
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/help-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, messages: nextMessages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? labels.error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply as string },
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : labels.error)
    } finally {
      setLoading(false)
    }
  }

  const panel =
    open && context ? (
      <div
        className="fixed inset-0 z-[300] flex items-end justify-center sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-chat-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          aria-label={labels.close}
          onClick={closeHelp}
        />
        <div className="relative flex max-h-[min(32rem,92vh)] w-full max-w-md flex-col rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl">
          <div className="flex items-start justify-between gap-2 border-b border-border/80 px-4 py-3">
            <div className="min-w-0">
              <p
                id="help-chat-title"
                className="text-sm font-semibold leading-snug"
              >
                {contextTitle(context, labels)}
              </p>
              <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                {labels.contextHint}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={closeHelp}
              aria-label={labels.close}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div
            ref={listRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
          >
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "mr-6 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm leading-relaxed"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="size-4 animate-spin" />
                {labels.thinking}
              </div>
            )}
          </div>

          {error && (
            <p className="text-destructive px-4 text-xs" role="alert">
              {error}
            </p>
          )}

          <form
            className="flex gap-2 border-t border-border/80 p-3"
            onSubmit={(e) => {
              e.preventDefault()
              void send()
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={labels.placeholder}
              className="border-input bg-background focus-visible:ring-ring/50 h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm focus-visible:ring-3 focus-visible:outline-none"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="size-4" />
              <span className="sr-only">{labels.send}</span>
            </Button>
          </form>
        </div>
      </div>
    ) : null

  return (
    <ContextualHelpContext.Provider value={{ openHelp }}>
      {children}
      {typeof document !== "undefined" && panel
        ? createPortal(panel, document.body)
        : null}
    </ContextualHelpContext.Provider>
  )
}

export function useContextualHelp() {
  const ctx = useContext(ContextualHelpContext)
  if (!ctx) {
    throw new Error(
      "useContextualHelp must be used within ContextualHelpProvider"
    )
  }
  return ctx
}
