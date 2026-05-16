"use client"

import { BureaucracyCopilot } from "@/components/bureaucracy-copilot"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLocale } from "@/components/locale-provider"
import { MapPin, Sparkles } from "lucide-react"

export function AppShell() {
  const { t } = useLocale()

  return (
    <div className="flex min-h-full flex-col">
      <header className="relative z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight">SplitFlow</p>
              <p className="text-muted-foreground text-xs">{t.brand.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="text-muted-foreground hidden items-center gap-1.5 text-xs lg:flex">
              <MapPin className="size-3.5" />
              {t.brand.hackathon}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col items-center px-4 py-10 md:py-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/8 absolute -top-24 left-1/2 h-72 w-[min(100%,42rem)] -translate-x-1/2 rounded-full blur-3xl" />
        </div>
        <div className="relative flex w-full justify-center">
          <BureaucracyCopilot />
        </div>
      </main>

      <footer className="border-t border-border/60 py-6 text-center">
        <p className="text-muted-foreground text-xs">{t.footer}</p>
      </footer>
    </div>
  )
}
