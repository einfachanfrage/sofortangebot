import { istProzentZuschlag } from './zuschlag-basis'
import { sortiereNachAusfuehrung } from './ausfuehrungs-stufen'

const DASH = /\s+[-–—]\s+/

// ── Was ist ein Raum? (CoS-E-022 / TN-053, 13.09.2026) ────────────────────
//
// Hier stand eine **Stichwortliste** mit 32 Raumwörtern. Sie ist viermal
// erweitert worden, jedes Mal wegen desselben Fehlers und jedes Mal erst,
// nachdem er passiert war: PM-005 (Speisekammer), PM-019 (Gästeklo), DC-040
// (Wohnung/Haus/Etage). Eine Liste, die man erweitern muss, sobald ein Kunde
// ein Zimmer anders nennt, ist keine Regel, sondern eine Wartungsaufgabe ohne
// Ende.
//
// Gemessen am 13.09.2026 mit 52 Raumnamen, die in einem Angebot vorkommen
// können: **21 wurden nicht erkannt** — darunter Atelier, Salon, Wintergarten,
// Ankleide, Praxis, Werkstatt-Nebenräume, „Schlafraum“, „Vorraum“ und
// „Raum 2“. Das Wort „Raum“ selbst stand nicht in der Liste.
//
// Und die Folge war schlimmer als „landet unter Allgemein“: Erkennt die
// Gruppierung **gar keinen** Raum, gibt sie null zurück und das ganze Angebot
// wird flach angezeigt. Bei einem Auftrag „Atelier und Salon streichen“ war
// die Raumstruktur komplett weg.
//
// Deshalb jetzt in dieser Reihenfolge:
//
//   1. **Die Wahrheit, wenn wir sie haben.** Das Angebot kennt seine Räume
//      (`quote.raum_details`). Steht der Name dort, ist es ein Raum — fertig.
//      Kein Raten über Wortbestandteile.
//   2. **Sonst die Form, nicht das Vokabular.** Ein Raumname sieht aus wie
//      ein Name: ein bis drei Wörter, Buchstaben, keine Klammern, keine
//      Maßangaben. Was dahinter steht und NICHT so aussieht, ist eine
//      Ausführungsangabe („2× Anstrich“, „Schicht 2“) — die kennen wir
//      abschließend, denn die Engine erzeugt sie selbst.
//
// Der Unterschied ist grundsätzlich: Die alte Regel musste jeden möglichen
// Raumnamen kennen. Die neue muss nur die endlich vielen Dinge kennen, die
// KEIN Raum sind.

/**
 * Angaben, die hinter dem Gedankenstrich stehen können, ohne ein Raum zu
 * sein. Die Engine erzeugt genau diese Formen — sie sind abzählbar, im
 * Gegensatz zu den Namen, die sich ein Kunde für sein Zimmer ausdenkt.
 */
const KEIN_RAUM = /anstrich|\bgang\b|\bschicht\b|\blage\b|\bq[1-4]\b|vollton|dunkelfarbe|schwimmend|verklebt|geschliffen|grundiert/i

/**
 * Maße, Klammern, Schrägstriche, Kommas — das ist eine Beschreibung, kein
 * Zimmer. Das Komma steht hier, weil `(Klick-System, Standard)` als Suffix
 * sonst als Raum durchging: Ein Raum heißt nie „irgendwas, irgendwas“.
 */
const SPEZIFIKATION = /[()\[\],;/%€]|\d\s*(?:mm|cm|dm|m²|m2|qm|m³|km|kwp|kw|x|×)\b/i

function istRaumName(name: string): boolean {
  const n = (name ?? '').trim()
  if (n.length < 2 || n.length > 40) return false
  if (SPEZIFIKATION.test(n)) return false
  if (KEIN_RAUM.test(n)) return false
  // Höchstens drei Wörter („Bad oben", „1. OG links") und mindestens zwei
  // Buchstaben — eine reine Zahl ist kein Name.
  if (n.split(/\s+/).length > 3) return false
  return (n.match(/[\p{L}]/gu) ?? []).length >= 2
}

/**
 * Ist dieser Titel-Suffix ein Raum?
 *
 * `bekannt` sind die Raumnamen des Angebots selbst, wenn der Aufrufer sie
 * hat. Sie gewinnen immer — gegen jede Formregel.
 */
function istEchterRaum(name: string, bekannt?: Set<string>): boolean {
  const n = (name ?? '').trim().toLowerCase()
  if (bekannt?.has(n)) return true
  return istRaumName(name)
}

// Nur DAS gehört wirklich unter "Allgemein" — alles andere ist raumbezogene Arbeit
// (z.B. "Türen lackieren" gehört in den Raum, nicht in den Allgemein-Topf).
// DC-056 (2026-09-11): „nebenleistungen" ist die Sammelzeile der
// zusammengefassten Kleinbeträge (src/lib/kleinbetraege.ts). Sie gehört aus
// demselben Grund hierher wie Anfahrt und Kleinmaterial: sie stammt aus
// mehreren Räumen und lässt sich keinem einzelnen zuordnen. Ohne diesen
// Eintrag würde sie in der Gliederung „nach Arbeitsablauf" bei der
// Hauptarbeit landen.
const ALLGEMEIN_MUSTER = /an-?\s*und\s*abfahrt|anfahrt|abfahrt|fahrtkosten|kleinmaterial|verbrauchsmaterial|nebenleistungen|aufma(ß|ss)|entsorgung|schuttcontainer|gerüst|baustelleneinrichtung|besichtigung/i

export function istAllgemeinPosition(titel: string): boolean {
  return ALLGEMEIN_MUSTER.test(titel ?? '')
}

const RAUM_EMOJIS: Record<string, string> = {
  wohnzimmer:    '🛋',
  schlafzimmer:  '🛏',
  kinderzimmer:  '🧸',
  küche:         '🍳',
  bad:           '🚿',
  badezimmer:    '🚿',
  toilette:      '🚽',
  klo:           '🚽',
  flur:          '🚪',
  diele:         '🚪',
  arbeitszimmer: '💼',
  büro:          '💼',
  keller:        '📦',
  speisekammer:  '📦',
  abstellraum:   '📦',
  dachboden:     '🏚',
  garage:        '🚗',
  treppenhaus:   '📐',
  esszimmer:     '🍽',
  terrasse:      '🌿',
  balkon:        '🌿',
  fassade:       '🏠',
  außen:         '🏠',
  // DC-040: eigenes Symbol statt sich das generische 🏠-Fallback mit Fassade
  // zu teilen — macht die Wohnung-als-Ganzes-Position auf einen Blick
  // unterscheidbar. "Haus"/"Etage"/"Geschoss"/"Stockwerk" bekommen bewusst
  // KEINEN eigenen Eintrag hier: "haus" ist Teilstring von "treppenhaus",
  // ein eigener Key würde dank `getRaumEmoji()`s Teilstring-Suche (statt
  // Vollwort-Vergleich) je nach Objekt-Reihenfolge Treppenhaus fälschlich
  // dieses Emoji zuweisen — sie fallen absichtlich auf das 🏠-Fallback
  // zurück (unverändertes Verhalten, kein Regressionsrisiko).
  wohnung:       '🏡',
}

function getRaumEmoji(raumName: string): string {
  const lower = raumName.toLowerCase()
  const key = Object.keys(RAUM_EMOJIS).find(k => lower.includes(k))
  return key ? RAUM_EMOJIS[key] : '🏠'
}

export interface GruppenItem {
  id: string
  title: string
  titleDisplay: string
  description: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  position: number
}

export interface RaumGruppe {
  raumName: string
  emoji: string
  items: GruppenItem[]
  summe: number
}

export interface GruppierungsErgebnis {
  raeume: RaumGruppe[]
  allgemein: GruppenItem[]
  hatMehrereRaeume: boolean
  gesamtsumme: number
}

/**
 * Die Räume, die das Angebot selbst kennt.
 *
 * `raum_details` wird beim Aufmaß geschrieben; die Schlüssel sind die
 * Raumnamen, wie der Handwerker sie gesagt hat. Das ist die verlässlichste
 * Quelle, die es gibt — besser als jede Regel über Titel.
 *
 * Defensiv, weil das Feld bei alten Angeboten fehlen kann: Dann kommt eine
 * leere Liste zurück und die Gruppierung fällt auf die Formregel zurück.
 */
export function raeumeAusQuote(quote: { raum_details?: unknown } | null | undefined): string[] {
  const d = quote?.raum_details
  if (!d || typeof d !== 'object' || Array.isArray(d)) return []
  return Object.keys(d as Record<string, unknown>).filter(k => k.trim().length > 0)
}

export function gruppiereNachRaum<T extends {
  id: string
  title: string
  description?: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  position: number
}>(items: T[], bekannteRaeume?: readonly string[]): GruppierungsErgebnis | null {
  // Die Räume des Angebots selbst, wenn der Aufrufer sie mitgibt
  // (`quote.raum_details`). Sie sind die Wahrheit; alles andere ist Form.
  const bekannt = bekannteRaeume && bekannteRaeume.length > 0
    ? new Set(bekannteRaeume.map(r => r.trim().toLowerCase()))
    : undefined
  const raumMap = new Map<string, GruppenItem[]>()
  const allgemein: GruppenItem[] = []
  let hatRaeume = 0

  // PM-119 / L-06 (23.09.2026): stufenweise sortieren, BEVOR gruppiert wird.
  //
  // Die Grundreihenfolge stimmt seit L-06 schon beim Erzeugen. Hier steht
  // die Sortierung ein zweites Mal, und zwar aus zwei Gründen, die beide
  // gemessen sind: **Angebote, die vor dem Bau erzeugt wurden**, liegen mit
  // ihrer alten Reihenfolge in der Datenbank — sie kommen nur über diesen
  // Weg noch richtig aufs Papier. Und der **Erschwerniszuschlag** ist keine
  // Allgemein-Position, sondern eine echte Zeile im Raum (DC-073/DC-144 §4b);
  // ohne die Sortierung hier stünde er dort, wo die Vollständigkeitsprüfung
  // ihn angehängt hat, statt am Ende seiner Raumgruppe.
  //
  // Es wird ausschließlich umsortiert: keine Zeile kommt hinzu, keine fällt
  // weg, `total_price` und Summen bleiben unberührt. Innerhalb einer Stufe
  // bleibt die bestehende Reihenfolge stehen.
  for (const item of sortiereNachAusfuehrung(items, i => i.title)) {
    const m = item.title.match(DASH)
    if (m) {
      const raum = item.title.slice(m.index! + m[0].length).trim()
      const titleDisplay = item.title.slice(0, m.index).trim()
      // Nur echte Räume gruppieren — "1. Anstrich" o.ä. geht in Allgemein
      if (istEchterRaum(raum, bekannt)) {
        if (!raumMap.has(raum)) raumMap.set(raum, [])
        raumMap.get(raum)!.push({
          id: item.id,
          title: item.title,
          titleDisplay,
          description: item.description ?? null,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.total_price,
          position: item.position,
        })
        hatRaeume++
      } else {
        // Suffix kein Raum → als Allgemein-Item ohne Suffix anzeigen
        allgemein.push({
          id: item.id,
          title: item.title,
          titleDisplay,
          description: item.description ?? null,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.total_price,
          position: item.position,
        })
      }
    } else {
      allgemein.push({
        id: item.id,
        title: item.title,
        titleDisplay: item.title,
        description: item.description ?? null,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.total_price,
        position: item.position,
      })
    }
  }

  // Kein einziges Item hat Raum-Marker → kein Grouping
  if (hatRaeume === 0) return null

  const raeume: RaumGruppe[] = Array.from(raumMap.entries()).map(([raumName, raumItems]) => ({
    raumName,
    emoji: getRaumEmoji(raumName),
    items: raumItems,
    summe: raumItems.reduce((s, i) => s + i.total_price, 0),
  }))

  // Echte Allgemein-Positionen (Anfahrt, Kleinmaterial, Aufmaß …) bleiben IMMER
  // unter Allgemein. Raumbezogene Arbeiten ohne Suffix (z.B. "Türen lackieren")
  // gehören in den Raum — bei genau einem Raum eindeutig zuordenbar.
  let verbleibendAllgemein = allgemein.filter(i => istAllgemeinPosition(i.title))
  const raumbezogenOhneSuffix = allgemein.filter(i => !istAllgemeinPosition(i.title))

  if (raeume.length === 1 && raumbezogenOhneSuffix.length > 0) {
    raeume[0].items = [...raeume[0].items, ...raumbezogenOhneSuffix]
    raeume[0].summe = raeume[0].items.reduce((s, i) => s + i.total_price, 0)
  } else if (raumbezogenOhneSuffix.length > 0) {
    // Mehrere Räume → nicht eindeutig zuordenbar, bleibt sichtbar bei Allgemein
    verbleibendAllgemein = [...raumbezogenOhneSuffix, ...verbleibendAllgemein]
  }

  const gesamtsumme = items.reduce((s, i) => s + i.total_price, 0)

  return {
    raeume,
    allgemein: verbleibendAllgemein,
    hatMehrereRaeume: raeume.length > 1,
    gesamtsumme,
  }
}

// ── PD-018 Punkt 2 (Prüfmeister, 16.09.2026, aus Sandys Live-Lauf) ─────────
//
// Auf dem Fassaden-Entwurf standen zwei Zeilen, die nichts sagen:
//
//   Voranstrich / Grundierung      0 Stück × 25,00 €   0,00 €
//   Erschwerniszuschlag Raumhöhe   15 %    ×  0,00 €   0,00 €
//
// Beide lesen sich wie ein Fehler, und beide sind einer. Der Prüfmeister:
// „Eine Position mit Menge 0 kommt nicht auf das Angebot."
//
// Die Regel ist bewusst eng gefasst, weil direkt daneben eine Regel liegt,
// die das Gegenteil verlangt (`src/lib/versandbereit.ts`): eine Position
// OHNE Preis darf nie stillschweigend verschwinden — sonst führt der
// Handwerker eine Arbeit aus, die er nicht berechnet hat. Erfasst sind
// deshalb nur die zwei Fälle, in denen nachweislich keine Arbeit hinter der
// Zeile steht:
//
//   1. Menge 0. Kein Stück, kein Meter, kein Quadratmeter — es ist nichts
//      zu tun. Der Einzelpreis steht ja da (25,00 €); die Position ist also
//      nicht „unbepreist", sie ist leer.
//   2. Prozent-Zuschlag auf 0,00 €. Nach `wendeProzentZuschlaegeAn()` ist
//      `unit_price` der Euro-Betrag je Prozentpunkt — 0,00 € heißt, die
//      Bemessungsgrundlage war 0. Ein Zuschlag auf nichts ist nichts. Ohne
//      Katalogtreffer bleibt die Zeile unangetastet (dann ist `unit_price`
//      der Prozentsatz und der Gesamtpreis nicht 0), der „Preis fehlt"-Weg
//      greift also weiterhin.
//
// Eine unbepreiste echte Position (12 m² × 0,00 €) fällt unter keinen der
// beiden Fälle und bleibt sichtbar. Das ist die Grenze der Regel und der
// Grund für ihre Enge.
//
// Geld bewegt sich dabei nie: entfernt wird ausschließlich, was 0,00 €
// beiträgt. Angebotssumme, Zwischensummen und Steuer bleiben gleich.
//
// Angewendet wird die Regel auf den ANZEIGE-Wegen (Ansicht, Vorschau, PDF),
// nicht im Bearbeiten-Modus: dort muss die Zeile sichtbar und löschbar
// bleiben, sonst liegt sie unsichtbar in der Datenbank. Der Editor markiert
// sie stattdessen mit „Nicht im Angebot".
//
// Nebenwirkung auf die Gruppierung, und sie ist beabsichtigt: Ein Raum, in
// dem nach dieser Regel keine Zeile übrig bleibt, erzeugt gar keine
// Raum-Gruppe mehr — genau der „🏠 Raum · 0,00 €"-Block ohne Maße, den
// Sandys Live-Lauf gezeigt hat. Die Maße dieses Raums bleiben im
// Bearbeiten-Modus sichtbar und änderbar.

export interface NullzeilenPruefung {
  quantity: number
  unit: string
  total_price: number
}

/** Trägt diese Zeile nachweislich keine Arbeit und kein Geld? */
export function istNullzeile(item: NullzeilenPruefung): boolean {
  // Cent-genau statt === 0: Gesamtpreise entstehen aus Multiplikationen.
  if (Math.abs(item.total_price) >= 0.005) return false
  if (item.quantity === 0) return true
  return istProzentZuschlag(item.unit)
}

/** Dieselbe Liste ohne die Zeilen, die nichts sagen. */
export function ohneNullzeilen<T extends NullzeilenPruefung>(items: T[]): T[] {
  return items.filter(i => !istNullzeile(i))
}
