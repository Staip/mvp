import type { Messages } from "../types"

export const hr: Messages = {
  brand: {
    tagline: "AI suputnik za birokraciju u Splitu",
    hackathon: "Grad Split Hackathon 2026",
    home: "Natrag na početnu",
  },
  footer:
    "Demo MVP · Bez integracije s državom · Samo AI smjernice",
  helpChat: {
    buttonLabel: "Pitaj AI o ovome",
    close: "Zatvori chat",
    send: "Pošalji",
    placeholder: "Postavite pitanje…",
    thinking: "Razmišljam…",
    error: "Nije moguće dobiti odgovor. Pokušajte ponovo.",
    contextHint: "AI zna s kojeg koraka ili polja ste otvorili pomoć.",
    titleMain: "Pomoć · Vaš upit",
    titleStep: "Pomoć · {step}",
    titleField: "Pomoć · {field}",
    titleDocument: "Pomoć · {document}",
    titleUpload: "Pomoć · Učitavanje fotografije",
    titleVisit: "Pomoć · Posjet uredu",
    titleBooking: "Pomoć · Rezervacija termina",
    titleBookingDate: "Pomoć · Odabir datuma",
    titleBookingTime: "Pomoć · Odabir vremena",
    titleDefault: "Kontekstualna pomoć",
    welcomeMain:
      "Pitajte što upisati ovdje — npr. kako formulirati zahtjev ili koje dokumente trebate.",
    welcomeStep:
      "Pitajte o ovom koraku: što znači, što ponijeti ili uobičajene greške za „{step}”.",
    welcomeField:
      "Pitajte o polju „{field}” — što upisati, gdje pronaći podatak ili primjeri formata.",
    welcomeDefault: "Postavite pitanje o ovom dijelu postupka.",
  },
  language: {
    label: "Jezik",
  },
  hub: {
    processes: "Moji postupci",
    notifications: "Obavijesti",
    appointments: "Termini",
    processesTitle: "Otvoreni postupci",
    notificationsTitle: "Obavijesti",
    appointmentsTitle: "Rezervirani termini",
    noOpenProcesses: "Nema otvorenih postupaka. Započnite novi vodič.",
    noNotifications: "Još nema obavijesti.",
    noAppointments: "Još nema rezerviranih termina.",
    continue: "Nastavi",
    completedNote: "{count} dovršenih postupaka",
    markAllRead: "Označi sve pročitano",
  },
  copilot: {
    heroTitle: "Pretvorite birokraciju u",
    heroHighlight: "jasan popis koraka",
    heroSubtitle:
      "Opišite što vam treba jednostavnim jezikom. AI u sekundama izrađuje korake, dokumente, troškove i lokacije ureda.",
    whatDoYouNeed: "Što trebate riješiti?",
    placeholder: 'npr. "Želim registrirati auto u Splitu"',
    voice: {
      start: "Govori",
      stop: "Stop",
      listening: "Slušam…",
      hint: "Pritisnite mikrofon i recite što vam treba — ne morate tipkati.",
      unsupported:
        "Glasovni unos nije podržan u ovom pregledniku. Koristite Chrome ili Edge, ili upišite zahtjev.",
      denied:
        "Pristup mikrofonu je blokiran. Dozvolite mikrofon u postavkama preglednika i pokušajte ponovno.",
      failed: "Nismo jasno čuli. Pokušajte ponovno ili upišite zahtjev.",
    },
    generate: "Generiraj moj vodič",
    submitHint: "Govorite, tipkajte ili Ctrl+Enter · Pokreće AI",
    popular: {
      title: "Najtraženije u Splitu",
      subtitle: "Odaberite što drugi najčešće traže — odmah krenite",
      searchesLabel: "pretraga",
      items: [
        {
          label: "Registracija auta",
          prompt: "Želim registrirati auto u Splitu",
          searches: "2,4k",
        },
        {
          label: "Boravišna dozvola EU",
          prompt: "Prijaviti privremeni boravak u Splitu kao državljanin EU",
          searches: "1,9k",
        },
        {
          label: "Otvaranje obrta",
          prompt: "Otvoriti mali kafić u Splitu",
          searches: "1,6k",
        },
        {
          label: "Preslika rodnog lista",
          prompt: "Dobiti službenu presliku rodnog lista u Splitu",
          searches: "1,3k",
        },
        {
          label: "Građevinska dozvola",
          prompt: "Prijaviti renovaciju stana i građevinsku dozvolu u Splitu",
          searches: "1,1k",
        },
        {
          label: "Prijava promjene adrese",
          prompt: "Prijaviti promjenu prebivališta u Splitu",
          searches: "980",
        },
      ],
    },
    errors: {
      tooShort:
        "Opišite što vam treba — npr. registracija auta ili otvaranje obrta.",
      generic: "Nešto je pošlo po krivu.",
      generationFailed: "Generiranje nije uspjelo",
    },
    loading: {
      title: "AI izrađuje vaš vodič",
      messages: [
        "Analiziram vaš zahtjev…",
        "Mapiram administrativne korake u Splitu…",
        "Pripremam personalizirani popis…",
      ],
    },
    guide: {
      newRequest: "Novi upit",
      aiBadge: "AI generirani vodič",
      yourProgress: "Vaš napredak",
      allDone:
        "Spremni ste dovršiti postupak u uredima navedenim u nastavku.",
      checklistTitle: "Koraci jedan po jedan",
      checklistDesc:
        "Jedna jednostavna radnja po koraku. Otvorite korak kad ste spremni — pitanja, fotografija ili posjet uredu.",
      stepCurrent: "Vaš trenutni korak",
      stepDone: "Gotovo",
      stepLocked: "Prvo dovršite prethodne korake",
      openStep: "Dodirnite za otvaranje koraka",
      completeStep: "Završio/la sam ovaj korak",
      stepKind: {
        document: "Dokument",
        upload: "Fotografija",
        visit: "Posjet uredu",
      },
      questionsIntro: "Odgovorite na dva kratka pitanja — izradit ćemo dokument za preuzimanje.",
      generateDocument: "Izradi dokument",
      downloadDocument: "Preuzmi dokument",
      downloadFooter: "Generirao SplitFlow (demo). Ponesite originale u ured.",
      uploadIntro: "Učitajte jednu jasnu fotografiju. AI je čita i popunjava obrazac.",
      uploadPhoto: "Snimi ili učitaj fotografiju",
      uploadAgain: "Druga fotografija",
      uploadAnalyzing: "Čitam dokument…",
      uploadInvalid: "Odaberite sliku.",
      uploadFailed: "Fotografija nije čitljiva. Pokušajte ponovno.",
      extractedFields: "Pročitano s fotografije",
      visitIntro: "Jedan posjet uredu — rezervirajte termin.",
      location: "Lokacija",
      openingHours: "Radno vrijeme",
      bookAppointment: "Rezerviraj termin",
      selectDate: "Odaberite datum",
      selectTime: "Slobodni termin",
      slotDuration: "Trajanje termina za ovaj postupak: {minutes} min",
      confirmBooking: "Potvrdi rezervaciju",
      bookingConfirmed: "Termin rezerviran (demo)",
      bookingDemoNote: "Simulirana rezervacija za demo — nije stvarni sustav.",
      view: "Pogledaj",
      mapIframeTitle: "Karta ureda",
    },
  },
  api: {
    requestRequired: "Molimo opišite s čime vam treba pomoć.",
    requestTooLong: "Upit je predugačak. Maksimalno 500 znakova.",
    serverError: "Nešto je pošlo po krivu. Pokušajte ponovno.",
  },
}
