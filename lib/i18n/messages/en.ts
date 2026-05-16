import type { Messages } from "../types"

export const en: Messages = {
  brand: {
    tagline: "Bureaucracy copilot for Split",
    hackathon: "City of Split Hackathon 2026",
  },
  footer:
    "Demo MVP · No government integration · AI-assisted guidance only",
  language: {
    label: "Language",
  },
  copilot: {
    heroTitle: "Turn bureaucracy into a",
    heroHighlight: "clear checklist",
    heroSubtitle:
      "Describe what you need in plain language. AI builds your personalized steps, documents, costs, and office locations in seconds.",
    whatDoYouNeed: "What do you need to do?",
    placeholder: 'e.g. "I want to register a car in Split"',
    voice: {
      start: "Speak",
      stop: "Stop",
      listening: "Listening…",
      hint: "Tap the microphone and describe what you need — no typing required.",
      unsupported:
        "Voice input is not supported in this browser. Please use Chrome or Edge, or type your request.",
      denied:
        "Microphone access was blocked. Allow the microphone in your browser settings and try again.",
      failed: "Could not hear you clearly. Please try again or type your request.",
    },
    generate: "Generate my guide",
    submitHint: "Speak, type, or Ctrl+Enter to submit · Powered by AI",
    popular: {
      title: "Most searched in Split",
      subtitle: "Tap what others are looking for — start instantly",
      searchesLabel: "searches",
      items: [
        {
          label: "Register a car",
          prompt: "I want to register a car in Split",
          searches: "2.4k",
        },
        {
          label: "EU residency permit",
          prompt: "Apply for temporary residency in Split as EU citizen",
          searches: "1.9k",
        },
        {
          label: "Start a small business",
          prompt: "Start a small café business in Split",
          searches: "1.6k",
        },
        {
          label: "Birth certificate copy",
          prompt: "Get an official copy of a birth certificate in Split",
          searches: "1.3k",
        },
        {
          label: "Building / renovation permit",
          prompt: "Apply for a building renovation permit in Split",
          searches: "1.1k",
        },
        {
          label: "Report change of address",
          prompt: "Report a change of registered address in Split",
          searches: "980",
        },
      ],
    },
    errors: {
      tooShort:
        "Describe what you need — e.g. register a car or start a business.",
      generic: "Something went wrong.",
      generationFailed: "Generation failed",
    },
    loading: {
      title: "AI is building your guide",
      messages: [
        "Analyzing your request…",
        "Mapping Split administration steps…",
        "Preparing your personalized checklist…",
      ],
    },
    guide: {
      newRequest: "New request",
      aiBadge: "AI-generated guide",
      yourProgress: "Your progress",
      allDone:
        "You're ready to complete your process at the offices listed below.",
      checklistTitle: "Step-by-step checklist",
      checklistDesc:
        "Check off each step as you complete it — your progress updates live.",
      documentsTitle: "Required documents",
      documentsNote:
        "Document preview is simulated for demo — bring originals to the office.",
      view: "View",
      mapTitle: "Where to go in Split",
      mapDesc: "Mock map — locations for your process",
      mapIframeTitle: "Split map",
    },
  },
  api: {
    requestRequired: "Please describe what you need help with.",
    requestTooLong: "Request is too long. Please keep it under 500 characters.",
    serverError: "Something went wrong. Please try again.",
  },
}
