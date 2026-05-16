"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import type { Locale } from "@/lib/i18n"
import { processProgress, loadUserData, saveUserData } from "@/lib/user-data/storage"
import type {
  AppNotification,
  BookedAppointment,
  SavedProcess,
} from "@/lib/user-data/types"
import type { ProcessGuide } from "@/lib/types"

type SaveProcessInput = {
  id?: string
  request: string
  guide: ProcessGuide
  checked: Record<string, boolean>
  locale: Locale
}

type BookAppointmentInput = {
  processId: string
  processTitle: string
  stepTitle: string
  officeName: string
  officeAddress: string
  date: string
  time: string
  intervalMinutes: number
}

type UserDataContextValue = {
  ready: boolean
  processes: SavedProcess[]
  openProcesses: SavedProcess[]
  appointments: BookedAppointment[]
  notifications: AppNotification[]
  unreadCount: number
  activeProcessId: string | null
  setActiveProcessId: (id: string | null) => void
  resumeProcessId: string | null
  requestResume: (id: string) => void
  clearResume: () => void
  saveProcess: (input: SaveProcessInput) => string
  addAppointment: (input: BookAppointmentInput) => void
  addStepCompletedNotification: (
    processId: string,
    processTitle: string,
    stepTitle: string
  ) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  deleteProcess: (id: string) => void
}

const UserDataContext = createContext<UserDataContextValue | null>(null)

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [processes, setProcesses] = useState<SavedProcess[]>([])
  const [appointments, setAppointments] = useState<BookedAppointment[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null)
  const [resumeProcessId, setResumeProcessId] = useState<string | null>(null)

  useEffect(() => {
    const data = loadUserData()
    setProcesses(data.processes)
    setAppointments(data.appointments)
    setNotifications(data.notifications)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    saveUserData({ processes, appointments, notifications })
  }, [processes, appointments, notifications, ready])

  const openProcesses = useMemo(
    () =>
      processes.filter(
        (p) => processProgress(p.checked, p.guide.steps.length) < 100
      ),
    [processes]
  )

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "read" | "createdAt">) => {
      setNotifications((prev) => [
        {
          ...n,
          id: newId(),
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
    },
    []
  )

  const saveProcess = useCallback((input: SaveProcessInput) => {
    const id = input.id ?? newId()
    const entry: SavedProcess = {
      id,
      request: input.request,
      guide: input.guide,
      checked: input.checked,
      locale: input.locale,
      updatedAt: new Date().toISOString(),
    }
    setProcesses((prev) => {
      const exists = prev.some((p) => p.id === id)
      if (exists) return prev.map((p) => (p.id === id ? entry : p))
      return [entry, ...prev]
    })
    setActiveProcessId(id)
    return id
  }, [])

  const addAppointment = useCallback(
    (input: BookAppointmentInput) => {
      const appt: BookedAppointment = {
        id: newId(),
        ...input,
        createdAt: new Date().toISOString(),
      }
      setAppointments((prev) => [appt, ...prev])
      addNotification({
        type: "appointment",
        title: input.processTitle,
        body: `${input.stepTitle} — ${input.date} ${input.time}`,
        processId: input.processId,
      })
    },
    [addNotification]
  )

  const addStepCompletedNotification = useCallback(
    (processId: string, processTitle: string, stepTitle: string) => {
      addNotification({
        type: "step",
        title: processTitle,
        body: stepTitle,
        processId,
      })
    },
    [addNotification]
  )

  const value = useMemo(
    () => ({
      ready,
      processes,
      openProcesses,
      appointments,
      notifications,
      unreadCount,
      activeProcessId,
      setActiveProcessId,
      resumeProcessId,
      requestResume: setResumeProcessId,
      clearResume: () => setResumeProcessId(null),
      saveProcess,
      addAppointment,
      addStepCompletedNotification,
      markNotificationRead: (id: string) =>
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        ),
      markAllNotificationsRead: () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
      deleteProcess: (id: string) => {
        setProcesses((prev) => prev.filter((p) => p.id !== id))
        if (activeProcessId === id) setActiveProcessId(null)
      },
    }),
    [
      ready,
      processes,
      openProcesses,
      appointments,
      notifications,
      unreadCount,
      activeProcessId,
      resumeProcessId,
      saveProcess,
      addAppointment,
      addStepCompletedNotification,
    ]
  )

  return (
    <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
  )
}

export function useUserData() {
  const ctx = useContext(UserDataContext)
  if (!ctx) {
    throw new Error("useUserData must be used within UserDataProvider")
  }
  return ctx
}
