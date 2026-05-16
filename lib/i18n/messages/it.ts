import type { Messages } from "../types"

export const it: Messages = {
  brand: {
    tagline: "Copilota burocratico per Spalato",
    hackathon: "Hackathon Città di Spalato 2026",
  },
  footer:
    "MVP demo · Nessuna integrazione governativa · Solo guida assistita da IA",
  language: {
    label: "Lingua",
  },
  copilot: {
    heroTitle: "Trasforma la burocrazia in una",
    heroHighlight: "checklist chiara",
    heroSubtitle:
      "Descrivi cosa ti serve in parole semplici. L'IA crea in pochi secondi passi, documenti, costi e sedi degli uffici.",
    whatDoYouNeed: "Cosa devi fare?",
    placeholder: 'es. "Voglio immatricolare un\'auto a Spalato"',
    voice: {
      start: "Parla",
      stop: "Stop",
      listening: "In ascolto…",
      hint: "Tocca il microfono e descrivi cosa ti serve — senza digitare.",
      unsupported:
        "Input vocale non supportato in questo browser. Usa Chrome o Edge, oppure scrivi.",
      denied:
        "Accesso al microfono bloccato. Consenti il microfono nelle impostazioni del browser.",
      failed: "Non ti abbiamo sentito bene. Riprova o scrivi la richiesta.",
    },
    generate: "Genera la mia guida",
    submitHint: "Parla, scrivi o Ctrl+Invio · Con IA",
    popular: {
      title: "Più cercati a Spalato",
      subtitle: "Tocca ciò che cercano gli altri — parti subito",
      searchesLabel: "ricerche",
      items: [
        {
          label: "Immatricolare un'auto",
          prompt: "Voglio immatricolare un'auto a Spalato",
          searches: "2,4k",
        },
        {
          label: "Permesso di soggiorno UE",
          prompt: "Richiedere residenza temporanea a Spalato come cittadino UE",
          searches: "1,9k",
        },
        {
          label: "Avviare un'attività",
          prompt: "Aprire un piccolo caffè a Spalato",
          searches: "1,6k",
        },
        {
          label: "Copia atto di nascita",
          prompt: "Ottenere copia ufficiale dell'atto di nascita a Spalato",
          searches: "1,3k",
        },
        {
          label: "Permesso edilizio",
          prompt: "Richiedere permesso di ristrutturazione a Spalato",
          searches: "1,1k",
        },
        {
          label: "Cambio di residenza",
          prompt: "Comunicare cambio di indirizzo di residenza a Spalato",
          searches: "980",
        },
      ],
    },
    errors: {
      tooShort:
        "Descrivi cosa ti serve — es. immatricolazione auto o avvio attività.",
      generic: "Qualcosa è andato storto.",
      generationFailed: "Generazione non riuscita",
    },
    loading: {
      title: "L'IA sta creando la tua guida",
      messages: [
        "Analisi della richiesta…",
        "Mappatura dei passaggi amministrativi a Spalato…",
        "Preparazione della checklist personalizzata…",
      ],
    },
    guide: {
      newRequest: "Nuova richiesta",
      aiBadge: "Guida generata dall'IA",
      yourProgress: "I tuoi progressi",
      allDone:
        "Sei pronto a completare la pratica negli uffici indicati sotto.",
      checklistTitle: "Checklist passo dopo passo",
      checklistDesc:
        "Spunta ogni passo completato — i progressi si aggiornano in tempo reale.",
      documentsTitle: "Documenti richiesti",
      documentsNote:
        "Anteprima documenti simulata per demo — porta gli originali in ufficio.",
      view: "Vedi",
      mapTitle: "Dove andare a Spalato",
      mapDesc: "Mappa demo — sedi per la tua pratica",
      mapIframeTitle: "Mappa di Spalato",
    },
  },
  api: {
    requestRequired: "Descrivi di cosa hai bisogno.",
    requestTooLong: "Richiesta troppo lunga. Massimo 500 caratteri.",
    serverError: "Qualcosa è andato storto. Riprova.",
  },
}
