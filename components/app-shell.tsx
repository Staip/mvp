"use client"

import { BureaucracyCopilot } from "@/components/bureaucracy-copilot"
import { ContextualHelpProvider } from "@/components/contextual-help/contextual-help-provider"
import { CopilotHomeProvider, useCopilotHome } from "@/components/copilot-home"
import { HeaderHub } from "@/components/header-hub"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLocale } from "@/components/locale-provider"
import { Sparkles } from "lucide-react"

function AppHeader() {
  const { t } = useLocale()
  const { goHome } = useCopilotHome()

  return (
    <header className="relative z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2.5 rounded-lg text-left transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label={t.brand.home}
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight">SplitFlow</p>
            <p className="text-muted-foreground text-xs">{t.brand.tagline}</p>
          </div>
        </button>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <HeaderHub />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

function AppFooter() {
  const { t } = useLocale()
  return <p className="text-muted-foreground text-xs">{t.footer}</p>
}

export function AppShell() {
  return (
    <CopilotHomeProvider>
      <ContextualHelpProvider>
      <div className="flex min-h-full flex-col">
        <AppHeader />

        <main className="relative flex flex-1 flex-col items-center px-4 py-10 md:py-14">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="bg-primary/8 absolute -top-24 left-1/2 h-72 w-[min(100%,42rem)] -translate-x-1/2 rounded-full blur-3xl" />
          </div>
          <div className="relative flex w-full justify-center">
            <BureaucracyCopilot />
          </div>
        </main>

        <footer className="border-t border-border/60 py-6 text-center">
          <AppFooter />
        </footer>
      </div>
      </ContextualHelpProvider>
    </CopilotHomeProvider>
  )
}
