import type { UserDataState } from "./types"

const STORAGE_KEY = "splitflow-user-data"

const EMPTY: UserDataState = {
  processes: [],
  appointments: [],
  notifications: [],
}

export function loadUserData(): UserDataState {
  if (typeof window === "undefined") return EMPTY
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as UserDataState
    return {
      processes: parsed.processes ?? [],
      appointments: parsed.appointments ?? [],
      notifications: parsed.notifications ?? [],
    }
  } catch {
    return EMPTY
  }
}

export function saveUserData(state: UserDataState) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function processProgress(checked: Record<string, boolean>, stepCount: number) {
  if (!stepCount) return 0
  const done = Object.values(checked).filter(Boolean).length
  return Math.round((done / stepCount) * 100)
}
