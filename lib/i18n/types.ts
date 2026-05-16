export type Locale = "en" | "hr" | "de" | "it"

export type Messages = {
  brand: {
    tagline: string
    hackathon: string
    home: string
  }
  footer: string
  helpChat: {
    buttonLabel: string
    close: string
    send: string
    placeholder: string
    thinking: string
    error: string
    contextHint: string
    titleMain: string
    titleStep: string
    titleField: string
    titleDocument: string
    titleUpload: string
    titleVisit: string
    titleBooking: string
    titleBookingDate: string
    titleBookingTime: string
    titleDefault: string
    welcomeMain: string
    welcomeStep: string
    welcomeField: string
    welcomeDefault: string
  }
  language: {
    label: string
  }
  hub: {
    processes: string
    notifications: string
    appointments: string
    processesTitle: string
    notificationsTitle: string
    appointmentsTitle: string
    noOpenProcesses: string
    noNotifications: string
    noAppointments: string
    continue: string
    completedNote: string
    markAllRead: string
    itemActions: string
    delete: string
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
      stepCurrent: string
      stepDone: string
      stepLocked: string
      openStep: string
      completeStep: string
      stepKind: {
        document: string
        upload: string
        visit: string
      }
      questionsIntro: string
      generateDocument: string
      downloadDocument: string
      downloadFooter: string
      uploadIntro: string
      uploadPhoto: string
      uploadAgain: string
      uploadAnalyzing: string
      uploadInvalid: string
      uploadFailed: string
      extractedFields: string
      visitIntro: string
      location: string
      openingHours: string
      bookAppointment: string
      selectDate: string
      selectTime: string
      slotDuration: string
      confirmBooking: string
      bookingConfirmed: string
      bookingDemoNote: string
      view: string
      mapIframeTitle: string
      idStepFront: string
      idStepBack: string
      idUploadFront: string
      idUploadBack: string
      idScanning: string
      idExtracted: string
      idContinueBack: string
      idComplete: string
      idRetake: string
      autofillFromId: string
      downloadPdf: string
      generatingPdf: string
      downloadPackagePdf: string
      pdfApplicantSection: string
      pdfVehicleSection: string
      pdfPriorUploadsSection: string
      pdfAttachmentsSection: string
      pdfIdSubsection: string
      completeIdScanFirst: string
    }
  }
  api: {
    requestRequired: string
    requestTooLong: string
    serverError: string
  }
}
