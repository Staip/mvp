import type { Locale } from "@/lib/i18n"
import type { ProcessGuide } from "@/lib/types"

export type SavedProcess = {
  id: string
  request: string
  guide: ProcessGuide
  checked: Record<string, boolean>
  locale: Locale
  updatedAt: string
}

export type BookedAppointment = {
  id: string
  processId: string
  processTitle: string
  stepTitle: string
  officeName: string
  officeAddress: string
  date: string
  time: string
  intervalMinutes: number
  createdAt: string
}

export type AppNotification = {
  id: string
  type: "process" | "step" | "appointment"
  title: string
  body: string
  read: boolean
  createdAt: string
  processId?: string
}

export type UserDataState = {
  processes: SavedProcess[]
  appointments: BookedAppointment[]
  notifications: AppNotification[]
}
