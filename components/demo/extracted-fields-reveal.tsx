"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

type FieldRow = { key: string; label: string; value: string }

type ExtractedFieldsRevealProps = {
  title: string
  fields: FieldRow[]
}

export function ExtractedFieldsReveal({ title, fields }: ExtractedFieldsRevealProps) {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    setVisible(0)
    if (fields.length === 0) return
    let i = 0
    const t = setInterval(() => {
      i += 1
      setVisible(i)
      if (i >= fields.length) clearInterval(t)
    }, 380)
    return () => clearInterval(t)
  }, [fields])

  return (
    <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
      <p className="flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
        <Sparkles className="size-4" />
        {title}
      </p>
      <ul className="space-y-2">
        {fields.map((f, index) => (
          <li
            key={f.key}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md border px-2.5 py-2 text-sm transition-all duration-500",
              index < visible
                ? "border-emerald-500/40 bg-emerald-500/15 shadow-sm ring-1 ring-emerald-500/30"
                : "border-transparent opacity-0"
            )}
          >
            <span className="text-muted-foreground">{f.label}</span>
            <span className="flex items-center gap-1.5 text-right font-semibold">
              {index < visible && (
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
              )}
              {f.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
