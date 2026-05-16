import type { Messages } from "../types"

export const de: Messages = {
  brand: {
    tagline: "KI-Begleiter für Verwaltung in Split",
    hackathon: "Stadt Split Hackathon 2026",
  },
  footer:
    "Demo-MVP · Keine Behördenanbindung · Nur KI-gestützte Orientierung",
  language: {
    label: "Sprache",
  },
  copilot: {
    heroTitle: "Verwandeln Sie Bürokratie in eine",
    heroHighlight: "klare Checkliste",
    heroSubtitle:
      "Beschreiben Sie Ihr Anliegen in einfachen Worten. Die KI erstellt in Sekunden Schritte, Dokumente, Kosten und Behördenstandorte.",
    whatDoYouNeed: "Was möchten Sie erledigen?",
    placeholder: 'z. B. „Ich möchte ein Auto in Split anmelden"',
    voice: {
      start: "Sprechen",
      stop: "Stopp",
      listening: "Ich höre zu…",
      hint: "Tippen Sie auf das Mikrofon und sagen Sie, was Sie brauchen — ohne Tippen.",
      unsupported:
        "Spracheingabe wird in diesem Browser nicht unterstützt. Bitte Chrome oder Edge nutzen oder tippen.",
      denied:
        "Mikrofonzugriff wurde blockiert. Erlauben Sie das Mikrofon in den Browser-Einstellungen.",
      failed: "Das war nicht verständlich. Bitte erneut versuchen oder tippen.",
    },
    generate: "Leitfaden erstellen",
    submitHint: "Sprechen, tippen oder Strg+Eingabe · Mit KI",
    popular: {
      title: "Am häufigsten gesucht in Split",
      subtitle: "Tippen Sie, wonach andere suchen — sofort starten",
      searchesLabel: "Suchen",
      items: [
        {
          label: "Auto anmelden",
          prompt: "Ich möchte ein Auto in Split anmelden",
          searches: "2,4k",
        },
        {
          label: "EU-Aufenthaltstitel",
          prompt: "Vorübergehenden Aufenthalt in Split als EU-Bürger beantragen",
          searches: "1,9k",
        },
        {
          label: "Gewerbe eröffnen",
          prompt: "Ein kleines Café in Split eröffnen",
          searches: "1,6k",
        },
        {
          label: "Geburtsurkunde Kopie",
          prompt: "Amtliche Kopie einer Geburtsurkunde in Split beantragen",
          searches: "1,3k",
        },
        {
          label: "Baugenehmigung",
          prompt: "Baugenehmigung für Wohnungsrenovierung in Split beantragen",
          searches: "1,1k",
        },
        {
          label: "Adressänderung melden",
          prompt: "Änderung der Meldeadresse in Split melden",
          searches: "980",
        },
      ],
    },
    errors: {
      tooShort:
        "Beschreiben Sie Ihr Anliegen — z. B. Autoanmeldung oder Gewerbe.",
      generic: "Etwas ist schiefgelaufen.",
      generationFailed: "Erstellung fehlgeschlagen",
    },
    loading: {
      title: "KI erstellt Ihren Leitfaden",
      messages: [
        "Ihre Anfrage wird analysiert…",
        "Verwaltungsschritte in Split werden zugeordnet…",
        "Personalisierte Checkliste wird vorbereitet…",
      ],
    },
    guide: {
      newRequest: "Neue Anfrage",
      aiBadge: "KI-generierter Leitfaden",
      yourProgress: "Ihr Fortschritt",
      allDone:
        "Sie können den Vorgang in den unten genannten Ämtern abschließen.",
      checklistTitle: "Schritt-für-Schritt-Checkliste",
      checklistDesc:
        "Erledigen Sie die Schritte der Reihe nach. Nutzen Sie den Button im Schritt, wenn Sie fertig sind.",
      stepCurrent: "Ihr aktueller Schritt",
      stepDone: "Erledigt",
      stepLocked: "Zuerst vorherige Schritte abschließen",
      completeStep: "Diesen Schritt habe ich erledigt",
      documentsForStep: "Dokumente für diesen Schritt",
      location: "Standort",
      openingHours: "Öffnungszeiten",
      bookAppointment: "Termin buchen",
      selectDate: "Datum wählen",
      selectTime: "Freie Uhrzeit",
      interval15: "15 Min",
      interval30: "30 Min",
      confirmBooking: "Buchung bestätigen",
      bookingConfirmed: "Termin reserviert (Demo)",
      bookingDemoNote: "Simulierte Buchung für Demo — kein echtes Behördensystem.",
      view: "Ansehen",
      mapIframeTitle: "Karte des Amts",
    },
  },
  api: {
    requestRequired: "Bitte beschreiben Sie, wobei Sie Hilfe brauchen.",
    requestTooLong:
      "Anfrage zu lang. Bitte unter 500 Zeichen bleiben.",
    serverError: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
  },
}
