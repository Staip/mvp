"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, Languages } from "lucide-react"

import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import {
  LOCALE_FLAGS,
  LOCALE_LABELS,
  LOCALES,
  type Locale,
} from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number }>()
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  function updateMenuPosition() {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    setMenuStyle({
      top: rect.bottom + 6,
      left: rect.right,
      width: Math.max(rect.width, 176),
    })
  }

  useEffect(() => {
    if (!open) return
    updateMenuPosition()
    window.addEventListener("resize", updateMenuPosition)
    window.addEventListener("scroll", updateMenuPosition, true)
    return () => {
      window.removeEventListener("resize", updateMenuPosition)
      window.removeEventListener("scroll", updateMenuPosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onEscape)
    }
  }, [open])

  function selectLocale(code: Locale) {
    setLocale(code)
    setOpen(false)
  }

  const menu =
    open && menuStyle ? (
      <ul
        ref={menuRef}
        role="listbox"
        aria-label={t.language.label}
        style={{
          position: "fixed",
          top: menuStyle.top,
          left: menuStyle.left,
          width: menuStyle.width,
          transform: "translateX(-100%)",
        }}
        className="z-[200] overflow-hidden rounded-lg border border-border bg-card p-1 text-card-foreground shadow-xl"
      >
        {LOCALES.map((code) => {
          const selected = locale === code
          return (
            <li key={code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                  selected
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => selectLocale(code)}
              >
                <span aria-hidden className="text-base leading-none">
                  {LOCALE_FLAGS[code]}
                </span>
                <span className="flex-1">{LOCALE_LABELS[code]}</span>
                {selected ? (
                  <Check className="size-3.5 shrink-0 text-primary" />
                ) : (
                  <span className="size-3.5 shrink-0" />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    ) : null

  return (
    <div ref={triggerRef} className={cn("relative inline-block", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 bg-background font-normal"
        aria-label={t.language.label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Languages className="size-3.5 text-muted-foreground" />
        <span aria-hidden>{LOCALE_FLAGS[locale]}</span>
        <span>{LOCALE_LABELS[locale]}</span>
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </Button>

      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  )
}
