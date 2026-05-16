import type { Messages } from "../types"

export const hr: Messages = {
  brand: {
    tagline: "AI suputnik za birokraciju u Splitu",
    hackathon: "Grad Split Hackathon 2026",
  },
  footer:
    "Demo MVP · Bez integracije s državom · Samo AI smjernice",
  language: {
    label: "Jezik",
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
        "Označite svaki korak kad ga obavite — napredak se ažurira uživo.",
      documentsTitle: "Potrebni dokumenti",
      documentsNote:
        "Pregled dokumenata je simulacija za demo — ponesite originale u ured.",
      view: "Pogledaj",
      mapTitle: "Gdje u Splitu",
      mapDesc: "Simulirana karta — lokacije za vaš postupak",
      mapIframeTitle: "Karta Splita",
    },
  },
  api: {
    requestRequired: "Molimo opišite s čime vam treba pomoć.",
    requestTooLong: "Upit je predugačak. Maksimalno 500 znakova.",
    serverError: "Nešto je pošlo po krivu. Pokušajte ponovno.",
  },
}
