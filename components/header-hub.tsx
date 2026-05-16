"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  Bell,
  CalendarDays,
  ChevronRight,
  FolderOpen,
} from "lucide-react"

import { useLocale } from "@/components/locale-provider"
import { useUserData } from "@/components/user-data-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { processProgress } from "@/lib/user-data/storage"
import { cn } from "@/lib/utils"

type Panel = "processes" | "notifications" | "appointments" | null

export function HeaderHub() {
  const { t } = useLocale()
  const h = t.hub
  const {
    openProcesses,
    processes,
    appointments,
    notifications,
    unreadCount,
    requestResume,
    markNotificationRead,
    markAllNotificationsRead,
  } = useUserData()

  const [panel, setPanel] = useState<Panel>(null)
  const [menuStyle, setMenuStyle] = useState<{
    top: number
    right: number
    width: number
  }>()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const completedCount = processes.length - openProcesses.length

  function openPanel(name: Panel, key: string) {
    const el = triggerRefs.current[key]
    if (!el) return
    const rect = el.getBoundingClientRect()
    setMenuStyle({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
      width: Math.min(360, window.innerWidth - 24),
    })
    setPanel((p) => (p === name ? null : name))
  }

  useEffect(() => {
    if (!panel) return
    function close(e: PointerEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target)) return
      if (document.getElementById("header-hub-menu")?.contains(target)) return
      setPanel(null)
    }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [panel])

  const menu = panel && menuStyle && (
    <div
      id="header-hub-menu"
      style={{
        position: "fixed",
        top: menuStyle.top,
        right: menuStyle.right,
        width: menuStyle.width,
      }}
      className="z-[200] max-h-[min(24rem,70vh)] overflow-y-auto rounded-xl border border-border bg-card p-2 text-card-foreground shadow-xl"
    >
      {panel === "processes" && (
        <div className="space-y-1">
          <p className="text-muted-foreground px-2 py-1.5 text-xs font-semibold uppercase tracking-wide">
            {h.processesTitle}
          </p>
          {openProcesses.length === 0 ? (
            <p className="text-muted-foreground px-2 py-6 text-center text-sm">
              {h.noOpenProcesses}
            </p>
          ) : (
            openProcesses.map((p) => {
              const pct = processProgress(p.checked, p.guide.steps.length)
              return (
                <button
                  key={p.id}
                  type="button"
                  className="hover:bg-muted flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2.5 text-left text-sm transition-colors"
                  onClick={() => {
                    requestResume(p.id)
                    setPanel(null)
                  }}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {p.guide.title}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {pct}% · {h.continue}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 opacity-50" />
                </button>
              )
            })
          )}
          {completedCount > 0 && (
            <p className="text-muted-foreground border-t px-2 pt-2 text-xs">
              {h.completedNote.replace("{count}", String(completedCount))}
            </p>
          )}
        </div>
      )}

      {panel === "notifications" && (
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
              {h.notificationsTitle}
            </p>
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={markAllNotificationsRead}
              >
                {h.markAllRead}
              </Button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground px-2 py-6 text-center text-sm">
              {h.noNotifications}
            </p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={cn(
                  "flex w-full flex-col gap-0.5 rounded-lg px-2 py-2.5 text-left text-sm transition-colors",
                  n.read ? "opacity-70" : "bg-primary/5",
                  "hover:bg-muted"
                )}
                onClick={() => {
                  markNotificationRead(n.id)
                  if (n.processId) {
                    requestResume(n.processId)
                    setPanel(null)
                  }
                }}
              >
                <span className="font-medium">{n.title}</span>
                <span className="text-muted-foreground text-xs">{n.body}</span>
              </button>
            ))
          )}
        </div>
      )}

      {panel === "appointments" && (
        <div className="space-y-1">
          <p className="text-muted-foreground px-2 py-1.5 text-xs font-semibold uppercase tracking-wide">
            {h.appointmentsTitle}
          </p>
          {appointments.length === 0 ? (
            <p className="text-muted-foreground px-2 py-6 text-center text-sm">
              {h.noAppointments}
            </p>
          ) : (
            appointments.map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-border/60 px-2 py-2.5 text-sm"
              >
                <p className="font-medium">{a.processTitle}</p>
                <p className="text-muted-foreground text-xs">{a.stepTitle}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {a.officeName}
                </p>
                <p className="text-primary mt-1 text-xs font-medium">
                  {a.date} · {a.time} ({a.intervalMinutes} min)
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )

  return (
    <div ref={containerRef} className="flex items-center gap-1">
      <div ref={(el) => { triggerRefs.current.processes = el }}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 font-normal"
          onClick={() => openPanel("processes", "processes")}
          aria-expanded={panel === "processes"}
        >
          <FolderOpen className="size-3.5" />
          <span className="hidden sm:inline">{h.processes}</span>
          {openProcesses.length > 0 && (
            <Badge variant="secondary" className="h-5 min-w-5 px-1 text-[0.65rem]">
              {openProcesses.length}
            </Badge>
          )}
        </Button>
      </div>

      <div ref={(el) => { triggerRefs.current.notifications = el }}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative gap-1.5 font-normal"
          onClick={() => openPanel("notifications", "notifications")}
          aria-expanded={panel === "notifications"}
        >
          <Bell className="size-3.5" />
          <span className="hidden sm:inline">{h.notifications}</span>
          {unreadCount > 0 && (
            <span className="bg-destructive absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[0.6rem] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </div>

      <div ref={(el) => { triggerRefs.current.appointments = el }}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 font-normal"
          onClick={() => openPanel("appointments", "appointments")}
          aria-expanded={panel === "appointments"}
        >
          <CalendarDays className="size-3.5" />
          <span className="hidden sm:inline">{h.appointments}</span>
          {appointments.length > 0 && (
            <Badge variant="secondary" className="h-5 min-w-5 px-1 text-[0.65rem]">
              {appointments.length}
            </Badge>
          )}
        </Button>
      </div>

      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  )
}
