import type { ProcessGuide } from "@/lib/types"
import type { Locale } from "./types"

type Scenario = "car" | "business" | "generic"

const CAR: Record<Locale, ProcessGuide> = {
  en: {
    title: "Vehicle registration in Split",
    summary:
      "Register your vehicle at the Split Police Administration and pay mandatory fees. Covers documents, inspections, and office visits.",
    estimatedDuration: "3–5 business days",
    estimatedCost: "€45–€120 (fees vary by vehicle)",
    steps: [
      { id: "1", title: "Gather identity & ownership documents", description: "ID/passport, proof of residence in Split, purchase contract, prior registration if from abroad." },
      { id: "2", title: "Obtain compulsory insurance (AO)", description: "Buy mandatory auto liability insurance from a Croatian insurer for registration." },
      { id: "3", title: "Technical inspection (if required)", description: "Foreign or used vehicles may need inspection at an authorized station in Split-Dalmatia County." },
      { id: "4", title: "Visit Police Administration – Vehicle desk", description: "Submit documents at the vehicle counter. Staff verify ownership and assign Croatian plates." },
      { id: "5", title: "Pay registration & eco fees", description: "Pay fees at the counter or by bank transfer. Keep all receipts." },
      { id: "6", title: "Collect plates & registration card", description: "Pick up plates and prometna dozvola when processing is complete." },
    ],
    documents: [
      { name: "Valid ID or passport", note: "Original + copy" },
      { name: "Proof of residence in Split", note: "Utility bill or lease" },
      { name: "Purchase / import documents", note: "Invoice or customs papers" },
      { name: "Compulsory insurance (AO)", note: "Active Croatian policy" },
      { name: "Technical inspection certificate", note: "If applicable" },
    ],
    locations: [
      { name: "Police Administration Split", address: "Gundulićeva 23, 21000 Split", purpose: "Vehicle registration & plates" },
      { name: "Tax Administration Split", address: "Ulica Domovinskog rata 1, Split", purpose: "Tax-related vehicle fees" },
    ],
  },
  hr: {
    title: "Registracija vozila u Splitu",
    summary:
      "Registrirajte vozilo na Policijskoj upravi Split i platite obvezne naknade. Vodič pokriva dokumente, pregled i posjete uredima.",
    estimatedDuration: "3–5 radnih dana",
    estimatedCost: "45–120 € (ovisno o vozilu)",
    steps: [
      { id: "1", title: "Pripremite identifikacijske i vlasničke dokumente", description: "Osobna/isprava, dokaz prebivališta u Splitu, ugovor o kupnji, prijašnja registracija ako iz inozemstva." },
      { id: "2", title: "Sklopite obvezno osiguranje (AO)", description: "Kupite obvezno auto osiguranje kod hrvatskog osiguravatelja za registraciju." },
      { id: "3", title: "Tehnički pregled (ako je potreban)", description: "Strana ili rabljena vozila mogu trebati pregled na ovlaštenoj stanici u Splitsko-dalmatinskoj županiji." },
      { id: "4", title: "Posjet Policijskoj upravi – šalter za vozila", description: "Predajte dokumente na šalteru. Službenici provjeravaju vlasništvo i dodjeljuju hrvatske tablice." },
      { id: "5", title: "Platite registraciju i ekološke naknade", description: "Platite na šalteru ili uplatom. Sačuvajte sve potvrde." },
      { id: "6", title: "Preuzmite tablice i prometnu dozvolu", description: "Preuzmite tablice i prometnu dozvolu kad je postupak gotov." },
    ],
    documents: [
      { name: "Valjana osobna ili putovnica", note: "Original + preslika" },
      { name: "Dokaz prebivališta u Splitu", note: "Račun ili ugovor o najmu" },
      { name: "Dokumenti kupnje / uvoza", note: "Račun ili carina" },
      { name: "Polica obveznog osiguranja (AO)", note: "Aktivna hrvatska polica" },
      { name: "Potvrda tehničkog pregleda", note: "Ako je potrebno" },
    ],
    locations: [
      { name: "Policijska uprava Split", address: "Gundulićeva 23, 21000 Split", purpose: "Registracija vozila i tablice" },
      { name: "Porezna uprava Split", address: "Ulica Domovinskog rata 1, Split", purpose: "Porezne naknade za vozila" },
    ],
  },
  de: {
    title: "Fahrzeuganmeldung in Split",
    summary:
      "Melden Sie Ihr Fahrzeug bei der Polizeiverwaltung Split an und zahlen Sie die Gebühren. Dokumente, Prüfung und Behördengänge im Überblick.",
    estimatedDuration: "3–5 Werktage",
    estimatedCost: "45–120 € (je nach Fahrzeug)",
    steps: [
      { id: "1", title: "Ausweis- und Eigentumsunterlagen sammeln", description: "Personalausweis/Reisepass, Wohnsitznachweis in Split, Kaufvertrag, ggf. frühere Zulassung aus dem Ausland." },
      { id: "2", title: "Pflichtversicherung (AO) abschließen", description: "Kroatische Kfz-Haftpflicht für die Anmeldung abschließen." },
      { id: "3", title: "Technische Prüfung (falls nötig)", description: "Ausländische oder Gebrauchtwagen können eine Prüfung in Split-Dalmatien benötigen." },
      { id: "4", title: "Polizeiverwaltung – Fahrzeugschalter", description: "Unterlagen am Schalter abgeben. Prüfung des Eigentums und Zuweisung kroatischer Kennzeichen." },
      { id: "5", title: "Zulassungs- und Ökogebühren zahlen", description: "Am Schalter oder per Überweisung zahlen. Alle Belege aufbewahren." },
      { id: "6", title: "Kennzeichen und Zulassung abholen", description: "Kennzeichen und Fahrzeugschein (prometna dozvola) nach Abschluss abholen." },
    ],
    documents: [
      { name: "Gültiger Ausweis oder Reisepass", note: "Original + Kopie" },
      { name: "Wohnsitznachweis in Split", note: "Rechnung oder Mietvertrag" },
      { name: "Kauf- / Importunterlagen", note: "Rechnung oder Zollpapiere" },
      { name: "Pflichtversicherung (AO)", note: "Aktive kroatische Police" },
      { name: "Technische Prüfbescheinigung", note: "Falls erforderlich" },
    ],
    locations: [
      { name: "Polizeiverwaltung Split", address: "Gundulićeva 23, 21000 Split", purpose: "Fahrzeuganmeldung & Kennzeichen" },
      { name: "Finanzamt Split", address: "Ulica Domovinskog rata 1, Split", purpose: "Steuerliche Fahrzeuggebühren" },
    ],
  },
  it: {
    title: "Immatricolazione veicolo a Spalato",
    summary:
      "Immatricola il veicolo presso la Polizia di Spalato e paga i diritti obbligatori. Documenti, revisione e visite agli uffici.",
    estimatedDuration: "3–5 giorni lavorativi",
    estimatedCost: "45–120 € (in base al veicolo)",
    steps: [
      { id: "1", title: "Raccogli documenti d'identità e di proprietà", description: "Carta d'identità/passaporto, residenza a Spalato, contratto d'acquisto, precedente immatricolazione se estera." },
      { id: "2", title: "Assicurazione obbligatoria (AO)", description: "Stipula RCA con assicuratore croato per l'immatricolazione." },
      { id: "3", title: "Revisione tecnica (se richiesta)", description: "Veicoli esteri o usati possono richiedere revisione in Spalato-Dalmazia." },
      { id: "4", title: "Visita Polizia – sportello veicoli", description: "Consegna documenti allo sportello. Verifica proprietà e assegnazione targhe croate." },
      { id: "5", title: "Paga tasse di immatricolazione", description: "Paga allo sportello o bonifico. Conserva tutte le ricevute." },
      { id: "6", title: "Ritira targhe e libretto", description: "Ritira targhe e prometna dozvola a pratica conclusa." },
    ],
    documents: [
      { name: "Documento valido o passaporto", note: "Originale + copia" },
      { name: "Prova di residenza a Spalato", note: "Bolletta o contratto affitto" },
      { name: "Documenti acquisto / import", note: "Fattura o dogana" },
      { name: "Polizza obbligatoria (AO)", note: "Polizza croata attiva" },
      { name: "Certificato revisione", note: "Se applicabile" },
    ],
    locations: [
      { name: "Polizia Spalato", address: "Gundulićeva 23, 21000 Split", purpose: "Immatricolazione e targhe" },
      { name: "Agenzia delle Entrate Spalato", address: "Ulica Domovinskog rata 1, Split", purpose: "Tasse veicolo" },
    ],
  },
}

const BUSINESS: Record<Locale, ProcessGuide> = {
  en: {
    title: "Starting a small business in Split",
    summary: "Open obrt or d.o.o. via HGK Split and FINA. Typical for cafés, services, and freelancers.",
    estimatedDuration: "1–2 weeks",
    estimatedCost: "€200–€800 (notary & court fees)",
    steps: [
      { id: "1", title: "Choose business form & activity code", description: "Obrt (sole trader) or d.o.o. (LLC). Pick NKD code for your activity." },
      { id: "2", title: "Reserve company name (if d.o.o.)", description: "Check availability via court registry (FINA e-services)." },
      { id: "3", title: "Register with HGK Split", description: "Submit obrt registration or use notary for d.o.o. incorporation." },
      { id: "4", title: "OIB & business bank account", description: "Ensure personal OIB; open business account after registration." },
      { id: "5", title: "Tax & health registration", description: "Activate VAT if needed at Tax Administration Split; HZMO for pension/health." },
      { id: "6", title: "Municipal permits (if premises)", description: "Apply to City of Split for shop or restaurant location permits." },
    ],
    documents: [
      { name: "Personal ID & OIB", note: "Founder ID" },
      { name: "Proof of registered address", note: "Business or home" },
      { name: "HGK registration application", note: "Obrt or court filing" },
      { name: "Notarized incorporation act", note: "d.o.o. only" },
      { name: "Bank share capital confirmation", note: "d.o.o. only" },
    ],
    locations: [
      { name: "Croatian Chamber of Economy – Split", address: "Ulica Antuna Mihanovića 1, Split", purpose: "Obrt & business registry" },
      { name: "City of Split – Administration", address: "Obala hrvatskog narodnog preporoda 1, Split", purpose: "Municipal permits" },
    ],
  },
  hr: {
    title: "Otvaranje malog obrta u Splitu",
    summary: "Otvorite obrt ili d.o.o. preko HGK Split i FINA-e. Tipično za kafiće, usluge i slobodna zanimanja.",
    estimatedDuration: "1–2 tjedna",
    estimatedCost: "200–800 € (javni bilježnik i sud)",
    steps: [
      { id: "1", title: "Odaberite oblik i šifru djelatnosti", description: "Obrt ili d.o.o. Odaberite NKD šifru za vašu djelatnost." },
      { id: "2", title: "Rezervirajte naziv (za d.o.o.)", description: "Provjerite dostupnost putem sudskog registra (FINA e-usluge)." },
      { id: "3", title: "Registracija u HGK Split", description: "Prijavite obrt ili koristite javnog bilježnika za d.o.o." },
      { id: "4", title: "OIB i poslovni bankovni račun", description: "Osobni OIB; otvorite račun nakon registracije." },
      { id: "5", title: "Porez i zdravstveno mirovinsko", description: "PDV kod Porezne uprave Split ako treba; HZMO za doprinose." },
      { id: "6", title: "Komunalne dozvole (ako imate lokalu)", description: "Grad Split za dozvole za trgovinu ili ugostiteljstvo." },
    ],
    documents: [
      { name: "Osobna i OIB", note: "Osnivač" },
      { name: "Dokaz adrese", note: "Poslovna ili stanovanje" },
      { name: "Prijava HGK", note: "Obrt ili sudski upis" },
      { name: "Osnivački akt kod bilježnika", note: "Samo d.o.o." },
      { name: "Potvrda uplate temeljnog kapitala", note: "Samo d.o.o." },
    ],
    locations: [
      { name: "Hrvatska gospodarska komora – Split", address: "Ulica Antuna Mihanovića 1, Split", purpose: "Obrt i poslovni registar" },
      { name: "Grad Split – Uprava", address: "Obala hrvatskog narodnog preporoda 1, Split", purpose: "Komunalne dozvole" },
    ],
  },
  de: {
    title: "Kleingewerbe in Split gründen",
    summary: "Obrt oder d.o.o. über HGK Split und FINA. Typisch für Cafés, Dienstleistungen und Freiberufler.",
    estimatedDuration: "1–2 Wochen",
    estimatedCost: "200–800 € (Notar & Gericht)",
    steps: [
      { id: "1", title: "Rechtsform & Tätigkeitscode wählen", description: "Obrt (Einzelunternehmen) oder d.o.o. (GmbH). NKD-Code wählen." },
      { id: "2", title: "Firmennamen reservieren (d.o.o.)", description: "Verfügbarkeit im Handelsregister (FINA) prüfen." },
      { id: "3", title: "Anmeldung bei HGK Split", description: "Obrt anmelden oder Notar für d.o.o.-Gründung." },
      { id: "4", title: "OIB & Geschäftskonto", description: "Persönliche OIB; Konto nach Registrierung eröffnen." },
      { id: "5", title: "Steuer & Sozialversicherung", description: "USt bei Finanzamt Split falls nötig; HZMO für Beiträge." },
      { id: "6", title: "Kommunale Genehmigungen (Lokal)", description: "Stadt Split für Laden- oder Restaurantgenehmigungen." },
    ],
    documents: [
      { name: "Ausweis & OIB", note: "Gründer" },
      { name: "Adressnachweis", note: "Geschäft oder Wohnung" },
      { name: "HGK-Anmeldung", note: "Obrt oder Gericht" },
      { name: "Notarieller Gesellschaftsvertrag", note: "nur d.o.o." },
      { name: "Bankbestätigung Stammkapital", note: "nur d.o.o." },
    ],
    locations: [
      { name: "Wirtschaftskammer – Split", address: "Ulica Antuna Mihanovića 1, Split", purpose: "Gewerbe & Register" },
      { name: "Stadt Split – Verwaltung", address: "Obala hrvatskog narodnog preporoda 1, Split", purpose: "Kommunale Genehmigungen" },
    ],
  },
  it: {
    title: "Avviare una piccola attività a Spalato",
    summary: "Apri obrt o d.o.o. tramite HGK Spalato e FINA. Tipico per bar, servizi e liberi professionisti.",
    estimatedDuration: "1–2 settimane",
    estimatedCost: "200–800 € (notaio e tribunale)",
    steps: [
      { id: "1", title: "Scegli forma e codice attività", description: "Obrt (ditta individuale) o d.o.o. (SRL). Codice NKD per l'attività." },
      { id: "2", title: "Prenota il nome (per d.o.o.)", description: "Verifica disponibilità nel registro (FINA)." },
      { id: "3", title: "Registrazione HGK Spalato", description: "Registra obrt o usa notaio per costituzione d.o.o." },
      { id: "4", title: "OIB e conto aziendale", description: "OIB personale; apri conto dopo la registrazione." },
      { id: "5", title: "Fisco e previdenza", description: "IVA presso Agenzia Entrate Spalato se serve; HZMO per contributi." },
      { id: "6", title: "Permessi comunali (locali)", description: "Comune di Spalato per negozio o ristorante." },
    ],
    documents: [
      { name: "Documento e OIB", note: "Fondatore" },
      { name: "Prova indirizzo", note: "Attività o casa" },
      { name: "Domanda HGK", note: "Obrt o tribunale" },
      { name: "Atto costitutivo notarile", note: "solo d.o.o." },
      { name: "Conferma capitale in banca", note: "solo d.o.o." },
    ],
    locations: [
      { name: "Camera di Commercio – Spalato", address: "Ulica Antuna Mihanovića 1, Split", purpose: "Registro imprese" },
      { name: "Città di Spalato – Amministrazione", address: "Obala hrvatskog narodnog preporoda 1, Split", purpose: "Permessi comunali" },
    ],
  },
}

const GENERIC: Record<
  Locale,
  (request: string) => ProcessGuide
> = {
  en: (request) => ({
    title: "Administrative process in Split",
    summary: `Guide for: "${request.slice(0, 120)}". Typical steps for public administration in Split-Dalmatia County.`,
    estimatedDuration: "5–10 business days",
    estimatedCost: "€20–€100",
    steps: [
      { id: "1", title: "Identify the responsible authority", description: "City of Split, county, or national agency (police, FINA, tax)." },
      { id: "2", title: "Collect required documents", description: "Originals and copies of ID, address proof, and specific forms." },
      { id: "3", title: "Visit or book an appointment", description: "Check e-Građani or call whether walk-in is accepted." },
      { id: "4", title: "Submit application & pay fees", description: "Submit at counter; pay fees and keep confirmation." },
      { id: "5", title: "Track status & collect outcome", description: "Note reference number; return when notified." },
    ],
    documents: [
      { name: "Valid ID or passport", note: "Original required" },
      { name: "Proof of address in Split", note: "Within last 3 months" },
      { name: "Completed application form", note: "From authority website" },
    ],
    locations: [
      { name: "City of Split – Citizen Services", address: "Obala hrvatskog narodnog preporoda 1, 21000 Split", purpose: "General municipal requests" },
    ],
  }),
  hr: (request) => ({
    title: "Administrativni postupak u Splitu",
    summary: `Vodič za: "${request.slice(0, 120)}". Tipični koraci za javnu upravu u Splitsko-dalmatinskoj županiji.`,
    estimatedDuration: "5–10 radnih dana",
    estimatedCost: "20–100 €",
    steps: [
      { id: "1", title: "Utvrdite nadležno tijelo", description: "Grad Split, županija ili nacionalna agencija (policija, FINA, porezna)." },
      { id: "2", title: "Prikupite dokumente", description: "Originale i preslike osobne, adrese i obrazaca." },
      { id: "3", title: "Dogovorite termin ili dođite", description: "Provjerite e-Građani ili telefonom je li moguć dolazak bez najave." },
      { id: "4", title: "Predajte zahtjev i platite naknade", description: "Predaja na šalteru; platite i sačuvajte potvrdu." },
      { id: "5", title: "Pratite status i preuzmite rješenje", description: "Zapišite broj predmeta; vratite se po obavijesti." },
    ],
    documents: [
      { name: "Valjana osobna ili putovnica", note: "Original" },
      { name: "Dokaz adrese u Splitu", note: "Zadnja 3 mjeseca" },
      { name: "Ispunjen obrazac", note: "S web stranice tijela" },
    ],
    locations: [
      { name: "Grad Split – Služba za građane", address: "Obala hrvatskog narodnog preporoda 1, 21000 Split", purpose: "Opći gradski upiti" },
    ],
  }),
  de: (request) => ({
    title: "Verwaltungsvorgang in Split",
    summary: `Leitfaden für: "${request.slice(0, 120)}". Typische Schritte der öffentlichen Verwaltung in Split-Dalmatien.`,
    estimatedDuration: "5–10 Werktage",
    estimatedCost: "20–100 €",
    steps: [
      { id: "1", title: "Zuständige Behörde ermitteln", description: "Stadt Split, Kreis oder nationale Stelle (Polizei, FINA, Finanzamt)." },
      { id: "2", title: "Unterlagen sammeln", description: "Originale und Kopien von Ausweis, Adressnachweis und Formularen." },
      { id: "3", title: "Termin oder spontaner Besuch", description: "e-Građani oder Telefon prüfen, ob Walk-in möglich ist." },
      { id: "4", title: "Antrag einreichen & Gebühren zahlen", description: "Am Schalter abgeben; Zahlung und Bestätigung aufbewahren." },
      { id: "5", title: "Status verfolgen & Ergebnis abholen", description: "Aktenzeichen notieren; bei Benachrichtigung wiederkommen." },
    ],
    documents: [
      { name: "Gültiger Ausweis oder Reisepass", note: "Original" },
      { name: "Wohnsitznachweis in Split", note: "Letzte 3 Monate" },
      { name: "Ausgefülltes Antragsformular", note: "Von Behördenwebsite" },
    ],
    locations: [
      { name: "Stadt Split – Bürgerservice", address: "Obala hrvatskog narodnog preporoda 1, 21000 Split", purpose: "Allgemeine städtische Anliegen" },
    ],
  }),
  it: (request) => ({
    title: "Pratica amministrativa a Spalato",
    summary: `Guida per: "${request.slice(0, 120)}". Passi tipici per la pubblica amministrazione a Spalato-Dalmazia.`,
    estimatedDuration: "5–10 giorni lavorativi",
    estimatedCost: "20–100 €",
    steps: [
      { id: "1", title: "Individua l'ufficio competente", description: "Comune di Spalato, regione o agenzia nazionale (polizia, FINA, fisco)." },
      { id: "2", title: "Raccogli i documenti", description: "Originali e copie di documento, residenza e moduli." },
      { id: "3", title: "Prenota o vai senza appuntamento", description: "Verifica su e-Građani o telefono se accettano accessi diretti." },
      { id: "4", title: "Presenta domanda e paga diritti", description: "Consegna allo sportello; conserva la ricevuta di pagamento." },
      { id: "5", title: "Segui lo stato e ritira l'esito", description: "Annota il numero pratica; torna quando notificato." },
    ],
    documents: [
      { name: "Documento valido o passaporto", note: "Originale" },
      { name: "Prova di residenza a Spalato", note: "Ultimi 3 mesi" },
      { name: "Modulo compilato", note: "Dal sito dell'ufficio" },
    ],
    locations: [
      { name: "Città di Spalato – Servizi ai cittadini", address: "Obala hrvatskog narodnog preporoda 1, 21000 Split", purpose: "Richieste comunali generali" },
    ],
  }),
}

function detectScenario(request: string): Scenario {
  const lower = request.toLowerCase()
  if (
    /car|auto|vozil|fahrzeug|vehicle|registr.*auto|immatricol|anmeld.*auto/.test(
      lower
    ) &&
    !/business|obrt|café|cafe|unternehmen|impresa|kafić|gewerbe/.test(lower)
  ) {
    return "car"
  }
  if (
    /business|company|obrt|café|cafe|kafić|unternehmen|impresa|gewerbe|ditta/.test(
      lower
    )
  ) {
    return "business"
  }
  return "generic"
}

export function getMockProcessGuide(
  request: string,
  locale: Locale
): ProcessGuide {
  const scenario = detectScenario(request)
  if (scenario === "car") return CAR[locale]
  if (scenario === "business") return BUSINESS[locale]
  return GENERIC[locale](request)
}
