"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  Bell,
  CalendarDays,
  FolderOpen,
  MoreVertical,
  Trash2,
} from "lucide-react"

import { useLocale } from "@/components/locale-provider"
import { useUserData } from "@/components/user-data-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { processProgress } from "@/lib/user-data/storage"
import { cn } from "@/lib/utils"

type Panel = "processes" | "notifications" | "appointments" | null

const MENU_MARGIN = 12
const MENU_MAX_WIDTH = 360

function HubItemMenu({
  itemId,
  openId,
  onOpenChange,
  onDelete,
  actionsLabel,
  deleteLabel,
}: {
  itemId: string
  openId: string | null
  onOpenChange: (id: string | null) => void
  onDelete: () => void
  actionsLabel: string
  deleteLabel: string
}) {
  const open = openId === itemId

  return (
    <div className="relative shrink-0 self-center">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground size-8 shrink-0"
        aria-label={actionsLabel}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          onOpenChange(open ? null : itemId)
        }}
      >
        <MoreVertical className="size-4" />
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 z-10 mt-0.5 min-w-[7.5rem] rounded-md border border-border bg-card py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="text-destructive hover:bg-muted flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
              onOpenChange(null)
            }}
          >
            <Trash2 className="size-3.5" />
            {deleteLabel}
          </button>
        </div>
      )}
    </div>
  )
}

function computeMenuStyle(rect: DOMRect) {
  const width = Math.min(
    MENU_MAX_WIDTH,
    window.innerWidth - MENU_MARGIN * 2
  )
  // Prefer right edge aligned with trigger; clamp so panel stays on screen
  let left = rect.right - width
  left = Math.max(MENU_MARGIN, left)
  left = Math.min(left, window.innerWidth - MENU_MARGIN - width)

  return {
    top: rect.bottom + 6,
    left,
    width,
  }
}

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
    deleteProcess,
    deleteNotification,
    deleteAppointment,
  } = useUserData()

  const [panel, setPanel] = useState<Panel>(null)
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)
  const [menuStyle, setMenuStyle] = useState<{
    top: number
    left: number
    width: number
  }>()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const completedCount = processes.length - openProcesses.length

  function openPanel(name: Panel, key: string) {
    const el = triggerRefs.current[key]
    if (!el) return
    setMenuStyle(computeMenuStyle(el.getBoundingClientRect()))
    setActionMenuId(null)
    setPanel((p) => (p === name ? null : name))
  }

  useEffect(() => {
    if (!panel) {
      setActionMenuId(null)
      return
    }
    function close(e: PointerEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target)) return
      if (document.getElementById("header-hub-menu")?.contains(target)) return
      setPanel(null)
      setActionMenuId(null)
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
        left: menuStyle.left,
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
                <div
                  key={p.id}
                  className="hover:bg-muted flex items-center gap-0.5 rounded-lg py-0.5 pr-1 pl-2 transition-colors"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 flex-col gap-0.5 py-2 pr-1 text-left text-sm"
                    onClick={() => {
                      requestResume(p.id)
                      setPanel(null)
                    }}
                  >
                    <span className="truncate font-medium">{p.guide.title}</span>
                    <span className="text-muted-foreground text-xs">
                      {pct}% · {h.continue}
                    </span>
                  </button>
                  <HubItemMenu
                    itemId={p.id}
                    openId={actionMenuId}
                    onOpenChange={setActionMenuId}
                    onDelete={() => deleteProcess(p.id)}
                    actionsLabel={h.itemActions}
                    deleteLabel={h.delete}
                  />
                </div>
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
              <div
                key={n.id}
                className={cn(
                  "flex items-center gap-0.5 rounded-lg py-0.5 pr-1 pl-2 transition-colors",
                  n.read ? "opacity-70" : "bg-primary/5",
                  "hover:bg-muted"
                )}
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-1 flex-col gap-0.5 py-2 pr-1 text-left text-sm"
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
                <HubItemMenu
                  itemId={n.id}
                  openId={actionMenuId}
                  onOpenChange={setActionMenuId}
                  onDelete={() => deleteNotification(n.id)}
                  actionsLabel={h.itemActions}
                  deleteLabel={h.delete}
                />
              </div>
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
                className="hover:bg-muted flex items-center gap-0.5 rounded-lg border border-border/60 py-0.5 pr-1 pl-2 transition-colors"
              >
                <div className="min-w-0 flex-1 py-2 pr-1 text-sm">
                  <p className="font-medium">{a.processTitle}</p>
                  <p className="text-muted-foreground text-xs">{a.stepTitle}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {a.officeName}
                  </p>
                  <p className="text-primary mt-1 text-xs font-medium">
                    {a.date} · {a.time} ({a.intervalMinutes} min)
                  </p>
                </div>
                <HubItemMenu
                  itemId={a.id}
                  openId={actionMenuId}
                  onOpenChange={setActionMenuId}
                  onDelete={() => deleteAppointment(a.id)}
                  actionsLabel={h.itemActions}
                  deleteLabel={h.delete}
                />
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
