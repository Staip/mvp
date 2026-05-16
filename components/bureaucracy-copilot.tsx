"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Clock,
  Coins,
  FileText,
  Loader2,
  MapPin,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VoiceInputButton } from "@/components/voice-input-button"
import type { ProcessGuide } from "@/lib/types"

type Phase = "input" | "loading" | "guide"

export function BureaucracyCopilot() {
  const { locale, t } = useLocale()
  const [phase, setPhase] = useState<Phase>("input")
  const [request, setRequest] = useState("")
  const [guide, setGuide] = useState<ProcessGuide | null>(null)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
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

      setGuide(data.guide)
      setPhase("guide")
    } catch (e) {
      setError(e instanceof Error ? e.message : t.copilot.errors.generic)
      setPhase("input")
    }
  }

  function reset() {
    setPhase("input")
    setGuide(null)
    setChecked({})
    setError(null)
  }

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
          <CardContent className="space-y-4">
            {guide.steps.map((step, index) => {
              const isChecked = !!checked[step.id]
              return (
                <div
                  key={step.id}
                  className={`flex gap-3 rounded-lg border p-4 transition-colors ${
                    isChecked
                      ? "border-primary/30 bg-muted/50 opacity-80"
                      : "border-border"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(v) =>
                      setChecked((prev) => ({ ...prev, [step.id]: v }))
                    }
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      <span className="text-muted-foreground mr-2 text-xs">
                        {index + 1}.
                      </span>
                      {step.title}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4" />
                {g.documentsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {guide.documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-start justify-between gap-2 rounded-lg border border-dashed p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-muted-foreground text-xs">{doc.note}</p>
                  </div>
                  <Button variant="outline" size="xs" className="shrink-0" disabled>
                    {g.view}
                  </Button>
                </div>
              ))}
              <p className="text-muted-foreground text-xs">{g.documentsNote}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4" />
                {g.mapTitle}
              </CardTitle>
              <CardDescription>{g.mapDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative overflow-hidden rounded-lg border bg-muted/30">
                <iframe
                  title={g.mapIframeTitle}
                  className="h-36 w-full border-0 grayscale-30"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=16.42%2C43.50%2C16.47%2C43.52&layer=mapnik&marker=43.508%2C16.440"
                />
              </div>
              {guide.locations.map((loc) => (
                <div key={loc.name} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{loc.name}</p>
                  <p className="text-muted-foreground text-xs">{loc.address}</p>
                  <p className="text-primary mt-1 text-xs">{loc.purpose}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
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

      <p className="text-primary text-center text-sm font-medium tracking-wide uppercase">
        {t.copilot.whatDoYouNeed}
      </p>

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
