"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Clock,
  Coins,
  Loader2,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRegisterCopilotHome } from "@/components/copilot-home"
import { GuideHelpProvider } from "@/components/contextual-help/contextual-help-provider"
import { HelpChatButton } from "@/components/contextual-help/help-chat-button"
import { GuideStepList } from "@/components/guide-step-list"
import { useUserData } from "@/components/user-data-provider"
import { VoiceInputButton } from "@/components/voice-input-button"
import { normalizeProcessGuide } from "@/lib/normalize-guide"
import type { ProcessGuide } from "@/lib/types"

type Phase = "input" | "loading" | "guide"

export function BureaucracyCopilot() {
  const { locale, t } = useLocale()
  const {
    saveProcess,
    resumeProcessId,
    clearResume,
    processes,
    addStepCompletedNotification,
  } = useUserData()
  const [phase, setPhase] = useState<Phase>("input")
  const [request, setRequest] = useState("")
  const [guide, setGuide] = useState<ProcessGuide | null>(null)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [processId, setProcessId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingIndex, setLoadingIndex] = useState(0)

  const loadingMessage = t.copilot.loading.messages[loadingIndex]

  useEffect(() => {
    if (phase !== "loading") return
    setLoadingIndex(0)
    const interval = setInterval(() => {
      setLoadingIndex((i) => (i + 1) % t.copilot.loading.messages.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [phase, t.copilot.loading.messages])

  const progress = useMemo(() => {
    if (!guide?.steps.length) return 0
    const done = guide.steps.filter((s) => checked[s.id]).length
    return Math.round((done / guide.steps.length) * 100)
  }, [guide, checked])

  const allDone = guide ? progress === 100 : false

  useEffect(() => {
    if (!resumeProcessId) return
    const saved = processes.find((p) => p.id === resumeProcessId)
    if (saved) {
      setProcessId(saved.id)
      setRequest(saved.request)
      setGuide(saved.guide)
      setChecked(saved.checked)
      setPhase("guide")
      setError(null)
    }
    clearResume()
  }, [resumeProcessId, processes, clearResume])

  useEffect(() => {
    if (phase !== "guide" || !guide || !processId) return
    saveProcess({
      id: processId,
      request,
      guide,
      checked,
      locale,
    })
  }, [phase, guide, checked, request, locale, processId, saveProcess])

  async function handleGenerate(text?: string) {
    const q = (text ?? request).trim()
    if (q.length < 3) {
      setError(t.copilot.errors.tooShort)
      return
    }

    setError(null)
    setRequest(q)
    setPhase("loading")
    setChecked({})
    setProcessId(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: q, locale }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? t.copilot.errors.generationFailed)
      }

      const normalized = normalizeProcessGuide(data.guide, locale)
      const id = saveProcess({
        request: q,
        guide: normalized,
        checked: {},
        locale,
      })
      setProcessId(id)
      setGuide(normalized)
      setPhase("guide")
    } catch (e) {
      setError(e instanceof Error ? e.message : t.copilot.errors.generic)
      setPhase("input")
    }
  }

  const reset = useCallback(() => {
    setPhase("input")
    setGuide(null)
    setChecked({})
    setProcessId(null)
    setError(null)
  }, [])

  useRegisterCopilotHome(reset)

  if (phase === "loading") {
    return (
      <div className="flex w-full max-w-lg flex-col items-center gap-6 py-16 text-center">
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <Loader2 className="size-8 animate-spin text-primary" />
          <Sparkles className="absolute -right-1 -top-1 size-5 text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold">{t.copilot.loading.title}</p>
          <p className="text-muted-foreground mt-2 text-sm">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  if (phase === "guide" && guide) {
    const g = t.copilot.guide
    return (
      <GuideHelpProvider
        processTitle={guide.title}
        processSummary={guide.summary}
        userRequest={request}
        guide={guide}
      >
      <div className="w-full max-w-3xl space-y-6">
        <Button variant="ghost" size="sm" onClick={reset} className="-ml-2 gap-1.5">
          <ArrowLeft className="size-4" />
          {g.newRequest}
        </Button>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              <Sparkles className="mr-1 size-3" />
              {g.aiBadge}
            </Badge>
            <Badge variant="secondary">
              <Clock className="mr-1 size-3" />
              {guide.estimatedDuration}
            </Badge>
            <Badge variant="secondary">
              <Coins className="mr-1 size-3" />
              {guide.estimatedCost}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {guide.title}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            {guide.summary}
          </p>
        </div>

        <Card className="border-primary/20 bg-primary/2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base">{g.yourProgress}</CardTitle>
              <span className="text-sm font-semibold tabular-nums">{progress}%</span>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          {allDone && (
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                {g.allDone}
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{g.checklistTitle}</CardTitle>
            <CardDescription>{g.checklistDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <GuideStepList
              processId={processId ?? ""}
              guide={guide}
              labels={g}
              checked={checked}
              onCheckedChange={(stepId, value) =>
                setChecked((prev) => ({ ...prev, [stepId]: value }))
              }
              onStepCompleted={(step) => {
                if (!processId) return
                addStepCompletedNotification(
                  processId,
                  guide.title,
                  step.title
                )
              }}
            />
          </CardContent>
        </Card>
      </div>
      </GuideHelpProvider>
    )
  }

  return (
    <div className="w-full max-w-xl space-y-8">
      <section className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl md:leading-tight">
          {t.copilot.heroTitle}{" "}
          <span className="text-primary">{t.copilot.heroHighlight}</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-lg text-base leading-relaxed">
          {t.copilot.heroSubtitle}
        </p>
      </section>

      <div className="flex items-center justify-center gap-2">
        <p className="text-primary text-center text-sm font-medium tracking-wide uppercase">
          {t.copilot.whatDoYouNeed}
        </p>
        <HelpChatButton scope="main_input" />
      </div>

      <Card className="shadow-lg shadow-primary/5">
        <CardContent className="space-y-4 pt-6">
          <div className="flex gap-2">
            <Textarea
              placeholder={t.copilot.placeholder}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              rows={3}
              className="min-h-[5.5rem] flex-1 resize-none text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  void handleGenerate()
                }
              }}
            />
            <VoiceInputButton
              locale={locale}
              labels={t.copilot.voice}
              onTranscript={(text) => {
                setRequest(text)
                setError(null)
              }}
              onError={(message) => setError(message)}
            />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t.copilot.voice.hint}
          </p>
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => void handleGenerate()}
          >
            <Sparkles className="size-4" />
            {t.copilot.generate}
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            {t.copilot.submitHint}
          </p>
        </CardContent>
      </Card>

      <section className="space-y-3" aria-labelledby="popular-requests-heading">
        <div className="text-center">
          <h2
            id="popular-requests-heading"
            className="text-foreground flex items-center justify-center gap-1.5 text-sm font-semibold"
          >
            <TrendingUp className="size-4 text-primary" aria-hidden />
            {t.copilot.popular.title}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t.copilot.popular.subtitle}
          </p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {t.copilot.popular.items.map((item, index) => (
            <li key={item.prompt}>
              <Button
                type="button"
                variant="outline"
                className="h-auto w-full justify-between gap-3 px-3 py-3 text-left"
                onClick={() => {
                  setRequest(item.prompt)
                  void handleGenerate(item.prompt)
                }}
              >
                <span className="min-w-0">
                  <span className="text-muted-foreground block text-[0.65rem] font-medium uppercase tracking-wide">
                    #{index + 1}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium leading-snug">
                    {item.label}
                  </span>
                </span>
                <Badge variant="secondary" className="shrink-0 tabular-nums">
                  {item.searches}
                </Badge>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
