"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"

type CopilotHomeContextValue = {
  goHome: () => void
  registerGoHome: (handler: () => void) => () => void
}

const CopilotHomeContext = createContext<CopilotHomeContextValue | null>(null)

export function CopilotHomeProvider({ children }: { children: React.ReactNode }) {
  const handlerRef = useRef<(() => void) | null>(null)

  const goHome = useCallback(() => {
    handlerRef.current?.()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const registerGoHome = useCallback((handler: () => void) => {
    handlerRef.current = handler
    return () => {
      if (handlerRef.current === handler) handlerRef.current = null
    }
  }, [])

  return (
    <CopilotHomeContext.Provider value={{ goHome, registerGoHome }}>
      {children}
    </CopilotHomeContext.Provider>
  )
}

export function useCopilotHome() {
  const ctx = useContext(CopilotHomeContext)
  if (!ctx) {
    throw new Error("useCopilotHome must be used within CopilotHomeProvider")
  }
  return ctx
}

export function useRegisterCopilotHome(handler: () => void) {
  const { registerGoHome } = useCopilotHome()
  useEffect(() => registerGoHome(handler), [registerGoHome, handler])
}
