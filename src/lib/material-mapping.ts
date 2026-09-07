import { kontextNenntMineralisch } from './lack-untergrund'

// Ordnet einer Arbeits-Position die passende Material-Position zu.
// z.B. "Wandflächen streichen" → { name: "Wandfarbe", unit: "m²" }.
// Der Nutzer trägt im Untertitel das konkrete Produkt/Farbe ein.
//
// Menge der Material-Position = Menge der Arbeits-Position (gleiche Fläche/Anzahl).
// Preis: aus der Preisdatenbank wenn vorhanden, sonst 0 € (Entscheidung des Nutzers).

export interface MaterialVorschlag {
  name: string
  unit: string
}

interface Regel { test: RegExp; material: MaterialVorschlag }

// ── PM-030-B / PM-025 (Prüfmeister, 07.09.2026) ──────────────────────────
//
// „Dachschrägen streichen 2x" hatte weder Untertitel noch Materialzeile,
// „Kniestockwände streichen 2x" beides. Für 18 m² fehlte damit das Material.
//
// Sein Befund dahinter trifft den Kern: An einem Tag sind sechs neue
// Positionsarten entstanden — Fischgrät, Diagonal-Aufpreis, Leibungen,
// Fensterbänke, Dachschrägen, Sockelleisten streichen. **Jede neue
// Positionsart braucht drei Dinge: eine Menge, einen Katalogpreis und ein
// Material.** Mitgewachsen war nur das erste.
//
// Beim Nachziehen ist ein eigener Fehler von heute aufgefallen: „Aufpreis
// Diagonalverlegung Vinyl" trifft das Muster `verleg.*vinyl` und hätte das
// Belagsmaterial ein ZWEITES Mal erzeugt — der Belag steckt schon in der
// Verlegeposition. Aufpreiszeilen sind reine Arbeitszuschläge und bekommen
// deshalb ausdrücklich kein Material.
const AUFPREIS = /^aufpreis\b/i

const REGELN: Regel[] = [
  // — Maler —
  { test: /wandfläche(n)?\s*streich|wände\s*streich/i, material: { name: 'Wandfarbe', unit: 'm²' } },
  { test: /fassadenfläche(n)?\s*streich|fassade\s*streich/i, material: { name: 'Fassadenfarbe', unit: 'm²' } },
  // Eine Dachschräge wird mit derselben Wandfarbe gestrichen wie der
  // Kniestock daneben — dieselbe Farbe, dieselbe Fläche, dieselbe Zeile.
  { test: /dachschräge(n)?\s*streich|dachfläche(n)?\s*streich/i, material: { name: 'Wandfarbe', unit: 'm²' } },
  // ── Prüfmeister, 07.09.2026: „Der Farbwunsch bestimmt den Farbton. Der
  // Untergrund bestimmt das Material." ──────────────────────────────────
  //
  // Diese Datei schickte JEDE Leibung auf Wandfarbe. Innen stimmt das — die
  // Innenleibung gehört zur Wand und wird mit ihr gestrichen. Außen ist es
  // falsch: Innendispersion auf einer Fassadenleibung hält zwei Winter, dann
  // kreidet und blättert sie; sie ist weder schlagregendicht noch
  // diffusionsoffen genug. Außen gehört dieselbe Fassadenfarbe hin wie auf
  // die Fläche daneben.
  //
  // Der Preis bleibt innen wie außen 45,00 €/m². Der Unterschied in der
  // Zugänglichkeit (Leiter/Gerüst) ist kein anderer Arbeitsschritt, sondern
  // ein Erschwernis — und dafür greift bei der Fassade ohnehin der Zuschlag
  // „Raumhöhe > 3 m". Zweimal dieselbe Erschwernis wäre doppelt gerechnet.
  //
  // ACHTUNG, Kopplung an die Engine: Die drei Titel unten kommen wörtlich aus
  // maler.ts (`posTyp`). „Fensterleibungen streichen" ist dort die AUSSEN-
  // Variante, „Fenster Innenleibungen streichen" die innere. Ein Test hält
  // alle drei fest, damit eine Titeländerung nicht still das Material kippt.
  { test: /innenleibung|innenlaibung|t[üu]r(?:en)?[\s-]?(?:leibung|laibung)/i, material: { name: 'Wandfarbe', unit: 'm²' } },
  { test: /fassadenleibung|au(?:ß|ss)enleibung|fensterleibung|fensterlaibung/i, material: { name: 'Fassadenfarbe', unit: 'm²' } },
  // Ohne Kennzeichnung: innen ist der Normalfall.
  { test: /leibung|laibung/i, material: { name: 'Wandfarbe', unit: 'm²' } },

  // ── Lack, nicht Dispersion (Prüfmeister, 07.09.2026) ──────────────────
  //
  // Für „Sockelleisten streichen" und „Fensterbänke streichen" gab es gar
  // keine Regel — deshalb stand die Position in PM-012 ohne Material da. Die
  // Auffangregel `\blackier` hätte „Lack" mit Einheit *Stück* geliefert und
  // damit weder zu lfdm noch zu m² gepasst.
  //
  // Beide sind Holz- oder MDF-Bauteile und beide werden benutzt: Eine
  // Fensterbank liegt waagerecht — Blumentöpfe, Kondenswasser, Putzlappen,
  // Sonne. Dispersion ist nicht scheuerfest und nicht blockfest, sie klebt
  // bei Feuchte und ein abgestellter Topf reißt sie ab. Sockelleisten werden
  // gesaugt, getreten, gewischt; an der Oberkante ist Wandfarbe in Monaten
  // runter.
  //
  // Zu PM-012 („in der gleichen Farbe wie die Wand"): Das ist ein gängiger
  // Stil und bleibt erfüllt — mit Buntlack im Wandfarbton abgetönt, nicht mit
  // der Wandfarbe. Der Farbton steht im Untertitel, das Material hier.
  { test: /sockelleisten\s*(?:streich|lackier)|fu(?:ß|ss)leisten\s*(?:streich|lackier)/i, material: { name: 'Lack (Weißlack / Buntlack)', unit: 'lfdm' } },
  { test: /fensterb(?:ä|a|ae)nk\w*\s*(?:streich|lackier)/i, material: { name: 'Lack', unit: 'm²' } },
  { test: /decken?(fläche)?\s*streich|decke\s*streich/i, material: { name: 'Deckenfarbe', unit: 'm²' } },
  { test: /grundier|voranstrich|tiefengrund/i, material: { name: 'Tiefengrund / Grundierung', unit: 'm²' } },
  { test: /spachtel|glätt/i, material: { name: 'Spachtelmasse', unit: 'm²' } },
  { test: /(raufaser|vlies|tapete)\s*(aufzieh|tapezier|aufbring)|tapezieren/i, material: { name: 'Tapete / Raufaser', unit: 'm²' } },
  { test: /stuckleisten\s*montier/i, material: { name: 'Stuckleisten (Material)', unit: 'lfdm' } },
  // — Lackieren —
  { test: /türen?\s*lackier|türzarge/i, material: { name: 'Lack (Türen)', unit: 'Stück' } },
  { test: /fenster.*(lackier|anstrich|öl)/i, material: { name: 'Lack (Fenster)', unit: 'Stück' } },
  { test: /heizkörper\s*(lackier|streich)/i, material: { name: 'Heizkörperlack', unit: 'Stück' } },
  { test: /\blackier/i, material: { name: 'Lack', unit: 'Stück' } },
  // — Boden — (Belag aus dem Titel)
  { test: /klick-?vinyl.*verleg|verleg.*klick-?vinyl/i, material: { name: 'Klick-Vinyl (Material)', unit: 'm²' } },
  // PM-025: „Designbelag im Fischgrätmuster kleben" heißt nicht „verlegen"
  // und traf deshalb keine einzige Belagsregel.
  { test: /designbelag|designboden/i, material: { name: 'Vinyl / Designboden (Material)', unit: 'm²' } },
  { test: /v[ie]nyl.*verleg|verleg.*v[ie]nyl|designboden.*verleg/i, material: { name: 'Vinyl / Designboden (Material)', unit: 'm²' } },
  { test: /laminat.*verleg|verleg.*laminat/i, material: { name: 'Laminat (Material)', unit: 'm²' } },
  { test: /parkett.*verleg|verleg.*parkett|fertigparkett/i, material: { name: 'Parkett (Material)', unit: 'm²' } },
  { test: /kork.*verleg|verleg.*kork/i, material: { name: 'Kork (Material)', unit: 'm²' } },
  { test: /linoleum.*verleg|verleg.*linoleum/i, material: { name: 'Linoleum (Material)', unit: 'm²' } },
  { test: /teppich.*verleg|nadelvlies.*verleg/i, material: { name: 'Teppichboden (Material)', unit: 'm²' } },
  { test: /\bverleg/i, material: { name: 'Bodenbelag (Material)', unit: 'm²' } },
  { test: /sockelleisten\s*montier/i, material: { name: 'Sockelleisten (Material)', unit: 'lfdm' } },
  { test: /trittschall|dämmung/i, material: { name: 'Trittschalldämmung (Material)', unit: 'm²' } },
]

/**
 * Passendes Material zur Arbeits-Position, oder null wenn kein Material
 * anfällt. `kontext` ist optional — Diktat oder Untertitel, für die Fälle, in
 * denen der Untergrund nicht im Titel steht.
 */
export function materialFuerPosition(titel: string, kontext?: string | null): MaterialVorschlag | null {
  const t = titel ?? ''
  // Ein Sockel aus Putz oder Beton ist kein Holzbauteil.
  // Der geputzte Sockel ist kein Holzbauteil (Ausnahme des Prüfmeisters). Das
  // Urteil fällt dort, wo der Diktattext ist (lack-untergrund.ts) und steht
  // als Annahme an der Position — hier wird es nur gelesen, nicht wiederholt.
  if (/sockel/i.test(t) && /streich/i.test(t) && kontextNenntMineralisch(kontext)) {
    return { name: 'Wandfarbe', unit: 'lfdm' }
  }
  // Material-Positionen selbst bekommen kein weiteres Material
  if (/\(material\)|wandfarbe|deckenfarbe|fassadenfarbe|tiefengrund|spachtelmasse|heizkörperlack|\black\b/i.test(t)) return null
  // Aufpreiszeilen sind Arbeitszuschläge auf eine Position, die ihr Material
  // schon trägt — sonst steht der Belag zweimal im Angebot.
  if (AUFPREIS.test(t.trim())) return null
  for (const r of REGELN) {
    if (r.test.test(t)) return r.material
  }
  return null
}
