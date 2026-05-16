"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Mic, MicOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LOCALE_SPEECH_CODES, type Locale } from "@/lib/i18n"
import type { Messages } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type SpeechRecognitionCtor = new () => {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult:
    | ((event: {
        results: { length: number; [index: number]: { [index: number]: { transcript: string } } }
      }) => void)
    | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

type VoiceInputButtonProps = {
  locale: Locale
  labels: Messages["copilot"]["voice"]
  disabled?: boolean
  onTranscript: (text: string) => void
  onError: (message: string) => void
  onListeningChange?: (listening: boolean) => void
}

export function VoiceInputButton({
  locale,
  labels,
  disabled,
  onTranscript,
  onError,
  onListeningChange,
}: VoiceInputButtonProps) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(null)

  const setListeningState = useCallback(
    (value: boolean) => {
      setListening(value)
      onListeningChange?.(value)
    },
    [onListeningChange]
  )

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListeningState(false)
  }, [setListeningState])

  useEffect(() => {
    setSupported(!!getSpeechRecognition())
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (listening) {
      recognitionRef.current?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restart with new lang on locale change
  }, [locale])

  function toggleListening() {
    if (disabled) return

    const SpeechRecognitionClass = getSpeechRecognition()
    if (!SpeechRecognitionClass) {
      onError(labels.unsupported)
      return
    }

    if (listening) {
      stopListening()
      return
    }

    const recognition = new SpeechRecognitionClass()
    recognition.lang = LOCALE_SPEECH_CODES[locale]
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      let transcript = ""
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (transcript.trim()) {
        onTranscript(transcript.trim())
      }
    }

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        onError(labels.denied)
      } else if (event.error !== "aborted") {
        onError(labels.failed)
      }
      setListeningState(false)
    }

    recognition.onend = () => {
      setListeningState(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
      setListeningState(true)
    } catch {
      onError(labels.failed)
      setListeningState(false)
    }
  }

  return (
    <Button
      type="button"
      variant={listening ? "default" : "outline"}
      disabled={disabled || !supported}
      className={cn(
        "h-auto min-h-[5.5rem] w-[4.25rem] shrink-0 flex-col gap-1.5 px-2 py-3",
        listening && "ring-3 ring-primary/30"
      )}
      aria-label={listening ? labels.stop : labels.start}
      aria-pressed={listening}
      onClick={toggleListening}
    >
      {listening ? (
        <MicOff className="size-6 shrink-0 animate-pulse" aria-hidden />
      ) : (
        <Mic className="size-6 shrink-0" aria-hidden />
      )}
      <span className="text-center text-[0.65rem] leading-tight font-medium">
        {listening ? labels.listening : labels.start}
      </span>
    </Button>
  )
}
