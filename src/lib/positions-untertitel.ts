// Kurzer, passender Untertitel je Position — damit unter jeder Position ein
// hilfreicher Satz steht (nicht der wiederholte Titel). Die KI darf überschreiben;
// dieser deterministische Generator ist der zuverlässige Standard.
//
// Reihenfolge = Priorität: spezifischere Muster zuerst.

interface Regel { test: RegExp; text: string | ((titel: string) => string) }

// ── Sammelfund PM-021 / PM-022 / PM-026 (Prüfmeister, 05.–07.09.2026) ─────
//
// Auf dem Kundenangebot stand:
//   Titel „Wandflächen streichen 1x" · Untertitel „Deckender 2-fach-Anstrich"
//   Titel „Deckenfläche streichen 1x" · Untertitel „Deckenanstrich in 2 Lagen"
//
// Der Preis war jeweils richtig — der Einfach-Satz. Es ist kein Rechenfehler,
// aber der gefährlichere Fehlertyp: Der Kunde liest den Untertitel, nicht die
// Zahl im Titel. Er erwartet zwei Anstriche und bezahlt einen. Der Untertitel
// ist eine Leistungsbeschreibung; widersprechen sich Titel und Beschreibung,
// geht der Zweifel nach § 305c BGB zulasten des Verwenders — und der ist der
// Handwerker, der den Satz nicht einmal selbst geschrieben hat.
//
// Die „2" war fest verdrahtet und stimmte nur, wenn zufällig zweimal
// gestrichen wurde. Dreimal unabhängig belegt (PM-021 Wand, PM-022 Decke,
// PM-026 Decke — dort war die Wandzeile daneben korrekt, was den Befund
// schärft: nicht zufällig falsch, sondern immer dieselbe Zahl).
//
// Jetzt folgt der Untertitel der Zahl im Titel. Steht dort keine, nennt er
// gar keine — lieber nichts versprechen als etwas Falsches.

/** Liest die Anstrichzahl aus dem Titel („Wandflächen streichen 2x"). */
function anstrichZahl(titel: string): number | null {
  const treffer = /\b([1-9])\s*(?:x|fach|-fach)\b/i.exec(titel ?? '')
  if (!treffer) return null
  const n = Number(treffer[1])
  return n >= 1 && n <= 3 ? n : null
}

const LAGEN: Record<number, string> = { 1: 'einlagig', 2: 'zweilagig', 3: 'dreilagig' }

/** „Deckender Anstrich, zweilagig, Kanten…" — ohne Zahl im Titel ohne Lagenangabe. */
function anstrichText(vorne: string, hinten: string) {
  return (titel: string) => {
    const lagen = LAGEN[anstrichZahl(titel) ?? 0]
    return lagen ? `${vorne}, ${lagen}, ${hinten}` : `${vorne}, ${hinten}`
  }
}

const REGELN: Regel[] = [
  // — Maler: Wand/Decke/Boden —
  { test: /wandfläche(n)?\s*streich|wände\s*streich/i, text: anstrichText('Deckender Anstrich', 'Kanten sauber abgeschnitten') },
  { test: /decken(fläche)?\s*streich|decke\s*streich/i, text: anstrichText('Deckenanstrich', 'gleichmäßig deckend') },
  // PM-018, Darstellungsfund 2: Der Untertitel sagte „Wände" auch unter der
  // DECKEN-Spachtelposition — der Text widersprach der Menge. Muss vor der
  // allgemeinen Spachtel-Regel stehen, sonst greift die zuerst.
  // Zwischen „Spachtelarbeiten" und „Decke" steht die Qualitätsstufe
  // („Spachtelarbeiten Q3 Decke") — deshalb ein paar Wörter Abstand erlaubt,
  // dieselbe Form wie `deckeExplizitSpachteln` in maler-extras.ts.
  { test: /(?:spachtel|glätt)\w*(?:\s+\w+){0,3}\s+decke|decke\w*(?:\s+\w+){0,3}\s+(?:spachtel|glätt)/i, text: 'Decke für einen ebenen Untergrund vollflächig spachteln' },
  { test: /spachtel|glätt/i, text: 'Wände für einen ebenen Untergrund vollflächig spachteln' },
  { test: /grundier|voranstrich|tiefengrund/i, text: 'Grundierung für gleichmäßige Saugfähigkeit und Haftung' },
  { test: /tapete\s*(entfern|ablös|abnehm|abreiß)|raufaser\s*(entfern|ab)/i, text: 'Alte Tapete ablösen und fachgerecht entsorgen' },
  { test: /(raufaser|vlies|tapete)\s*(aufzieh|tapezier|aufbring)/i, text: 'Neue Bahnen faltenfrei und stoßgenau aufziehen' },
  { test: /boden\s*(schütz|abdeck)|abdeckvlies|abdeckfolie/i, text: 'Bodenfläche mit Abdeckvlies schützen' },
  { test: /sockelleisten\s*abkleb|sockel\s*abkleb/i, text: 'Sockelleisten und Kanten sauber abkleben' },
  { test: /fenster.*abkleb|abkleb.*fenster|rahmen\s*abkleb/i, text: 'Rahmen und Flächen sauber abkleben' },
  // — Lackieren —
  { test: /türen?\s*lackier|türzarge/i, text: 'Schleifen, grundieren und 2× lackieren' },
  { test: /fenster.*(lackier|anstrich|öl)/i, text: 'Schleifen, grundieren und 2× Lackanstrich' },
  { test: /heizkörper\s*(lackier|streich)/i, text: 'Heizkörper schleifen, grundieren und lackieren' },
  { test: /lackier/i, text: 'Fachgerecht geschliffen, grundiert und lackiert' },
  // — Boden —
  { test: /(vinyl|laminat|parkett|kork|linoleum|teppich|designboden).*verleg|verleg.*(vinyl|laminat|parkett)/i, text: 'Fachgerecht verlegt inklusive Zuschnitt und Verschnitt' },
  { test: /fischgrät.*verkleb|verkleb.*fischgrät/i, text: 'Aufwändiges Verlegemuster, vollflächig verklebt' },
  { test: /vollflächig\s*verkleb/i, text: 'Vollflächig verklebt für dauerhaften Halt' },
  { test: /altbelag\s*entfern|teppichboden\s*entfern|alten\s*teppich/i, text: 'Alten Belag aufnehmen und entsorgen' },
  { test: /kleberreste\s*(abschleif|schleif)/i, text: 'Untergrund von Kleberresten befreien' },
  { test: /untergrund|ausgleich|spachtelmasse/i, text: 'Untergrund vorbereiten und ausgleichen' },
  { test: /sockelleisten\s*montier|sockelleisten\s*(neu|verleg)/i, text: 'Neue Sockelleisten passgenau montieren' },
  { test: /trittschall|dämmung/i, text: 'Trittschalldämmung für angenehme Raumakustik' },
  { test: /parkett\s*schleif/i, text: 'Parkett abschleifen für einen frischen Look' },
  { test: /versiegel/i, text: 'Schützende Versiegelung, strapazierfähig' },
  { test: /übergangs?profil|anschlussprofil/i, text: 'Sauberer Übergang zwischen den Räumen' },
  // — Sonstiges —
  { test: /erschwerniszuschlag/i, text: 'Aufschlag für erschwerte Arbeitsbedingungen' },
  { test: /kleinmaterial|verbrauchsmaterial/i, text: 'Verbrauchsmaterial pauschal' },
  { test: /an-?\s*und\s*abfahrt|anfahrt|abfahrt|fahrtkosten/i, text: 'An- und Abfahrt zur Baustelle' },
]

/** Kurzer Untertitel zur Position, oder null wenn kein passendes Muster. */
export function positionsUntertitel(titel: string): string | null {
  const t = titel ?? ''
  for (const r of REGELN) {
    if (r.test.test(t)) return typeof r.text === 'function' ? r.text(t) : r.text
  }
  return null
}

/**
 * Wählt den finalen Untertitel: deterministischer Generator gewinnt IMMER.
 * Die KI-Beschreibung greift nur, wenn kein Generator-Treffer UND sie ein echter
 * Satz ist — nicht der Titel und keine Mengen-Echo ("47,71 m²").
 * Warum: Im Preis-Modus liefert GPT als description oft nur die Menge zurück.
 */
export function waehleUntertitel(titel: string, kiBeschreibung?: string | null): string | null {
  const gen = positionsUntertitel(titel)
  if (gen) return gen
  const ki = (kiBeschreibung ?? '').trim()
  const istEchterSatz =
    ki.length > 8 &&
    /[a-zäöüß]{4,}/i.test(ki) &&                 // enthält ein echtes Wort
    !/^\d/.test(ki) &&                            // beginnt nicht mit einer Zahl
    !/^[\d.,]+\s*(m²|qm|lfdm|lfm|stück|stk|pauschale)/i.test(ki) && // kein Mengen-Echo
    ki.toLowerCase() !== (titel ?? '').toLowerCase()
  return istEchterSatz ? ki : null
}
