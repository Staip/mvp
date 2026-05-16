export type Locale = "en" | "hr" | "de" | "it"

export type Messages = {
  brand: {
    tagline: string
    hackathon: string
  }
  footer: string
  language: {
    label: string
  }
  copilot: {
    heroTitle: string
    heroHighlight: string
    heroSubtitle: string
    whatDoYouNeed: string
    placeholder: string
    voice: {
      start: string
      stop: string
      listening: string
      hint: string
      unsupported: string
      denied: string
      failed: string
    }
    generate: string
    submitHint: string
    popular: {
      title: string
      subtitle: string
      searchesLabel: string
      items: Array<{
        label: string
        prompt: string
        searches: string
      }>
    }
    errors: {
      tooShort: string
      generic: string
      generationFailed: string
    }
    loading: {
      title: string
      messages: [string, string, string]
    }
    guide: {
      newRequest: string
      aiBadge: string
      yourProgress: string
      allDone: string
      checklistTitle: string
      checklistDesc: string
      documentsTitle: string
      documentsNote: string
      view: string
      mapTitle: string
      mapDesc: string
      mapIframeTitle: string
    }
  }
  api: {
    requestRequired: string
    requestTooLong: string
    serverError: string
  }
}
