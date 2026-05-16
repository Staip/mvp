"use client"

import { MessageCircle } from "lucide-react"

import {
  useContextualHelp,
  useGuideHelp,
} from "@/components/contextual-help/contextual-help-provider"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import type { HelpContext, HelpScope } from "@/lib/contextual-help/types"
import type { ProcessStep } from "@/lib/types"
import { cn } from "@/lib/utils"

type HelpChatButtonProps = {
  scope: HelpScope
  step?: ProcessStep
  field?: { id: string; label: string; placeholder?: string }
  documentName?: string
  location?: { name: string; address: string }
  booking?: HelpContext["booking"]
  className?: string
  size?: "sm" | "xs"
}

export function HelpChatButton({
  scope,
  step,
  field,
  documentName,
  location,
  booking,
  className,
  size = "sm",
}: HelpChatButtonProps) {
  const { t } = useLocale()
  const { openHelp } = useContextualHelp()
  const guide = useGuideHelp()

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const context: Omit<HelpContext, "locale"> = {
      scope,
      processTitle: guide?.processTitle,
      processSummary: guide?.processSummary,
      userRequest: guide?.userRequest,
      step: step
        ? {
            id: step.id,
            title: step.title,
            description: step.description,
            kind: step.kind,
          }
        : undefined,
      field,
      documentName: documentName ?? step?.document?.name,
      location,
      booking,
    }

    openHelp(context)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={size === "xs" ? "icon-xs" : "icon-sm"}
      className={cn(
        "text-primary shrink-0 border-primary/25 bg-primary/5 hover:bg-primary/10",
        className
      )}
      onClick={handleClick}
      aria-label={t.helpChat.buttonLabel}
      title={t.helpChat.buttonLabel}
    >
      <MessageCircle className="size-3.5" />
    </Button>
  )
}

export function FieldLabelWithHelp({
  label,
  labelClassName,
  children,
  ...helpProps
}: HelpChatButtonProps & {
  label: string
  labelClassName?: string
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn("font-medium", labelClassName ?? "text-sm")}
        >
          {label}
        </span>
        <HelpChatButton {...helpProps} size="xs" />
      </div>
      {children}
    </div>
  )
}
