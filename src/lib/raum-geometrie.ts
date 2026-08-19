// Geometrie für Raum-Aufmaß — unterstützt vier Eingabe-Modi:
//   'rechteck'  — Breite × Länge (Standard)
//   'flaeche'   — Wand- und/oder Bodenfläche direkt in m² (für L-Räume, Nischen…)
//   'grundriss' — rechtwinkliger Polygonzug (Wandlängen + Abbiegungen)
//   'wand'      — einzelne Wand/Fassade: Länge × Höhe, kein Raum (keine Breite,
//                 kein Boden, keine Decke, kein Umfang). PM-008/PD-003: eine
//                 Fassade wurde bisher wie ein unvollständiger Raum behandelt
//                 (Breite fehlt immer) statt wie ein eigener Objekttyp —
//                 dieser Modus macht "hat keine Breite" zu einem echten
//                 Zustand statt einer Fehlanzeige.
//
// Kernidee: Die WANDFLÄCHE braucht nur den Umfang (Summe der Wandlängen) × Höhe,
// ist also formunabhängig. Die BODENFLÄCHE braucht die echte Form (Eckpunkte).

export type RaumModus = 'rechteck' | 'flaeche' | 'grundriss' | 'wand'

/** Eine Wand im Grundriss: Länge in Metern + Abbiegung an ihrer Startecke. */
export interface Wand {
  laenge: number
  /** Abbiegung VOR dieser Wand (relativ zur vorherigen). Bei der ersten Wand ignoriert. */
  turn?: 'L' | 'R'
}

export interface RaumDimension {
  modus?: RaumModus
  // Rechteck:
  breite?: number
  // Rechteck UND Wand (modus 'wand': Wandlänge, keine Breite):
  laenge?: number
  // Gemeinsam:
  hoehe?: number
  tueren?: number
  fenster?: number
  // PM-008-Nachtest 6 (2026-08-19): echte Öffnungsflächen aus der Extraktion,
  // falls bekannt (z.B. ein Fenster 1,20×1,40m statt Standardmaß). Wenn
  // gesetzt, ERSETZT dieser Wert den Abzug aus tueren/fenster × Standardmaß
  // unten — exakt dieselbe Formel wie die Mengen-Engine (maler.ts:
  // anzahl × (breite ?? Standard) × (hoehe ?? Standard)), damit die
  // "So gerechnet"-Anzeige beim Bearbeiten wieder zur tatsächlich
  // abgerechneten Position passt. Ohne diese Felder (Normalfall: nur eine
  // Stückzahl bekannt, keine Maße) bleibt das bisherige Verhalten
  // unverändert — Fallback auf tueren/fenster × Standardmaß.
  tuerFlaeche?: number
  fensterFlaeche?: number
  // Direkte Flächen (modus 'flaeche'):
  wandflaeche?: number
  bodenflaeche?: number
  // Grundriss (modus 'grundriss'):
  grundriss?: Wand[]
}

const STANDARD_HOEHE = 2.5
// Dieselben Standardmaße wie die Mengen-Engine. Abweichende Konstanten hier
// würden beim Bearbeiten still andere Mengen und Angebotssummen erzeugen.
const TUER_FLAECHE = 1.89   // 0,90 × 2,10 m
const FENSTER_FLAECHE = 1.20 // 1,20 × 1,00 m
const TUER_BREITE = 0.9    // lfdm Abzug Sockelleiste pro Tür

export interface GrundrissErgebnis {
  umfang: number
  flaeche: number
  /** Polygon-Eckpunkte für die Flächenberechnung (ohne Duplikat des Startpunkts). */
  punkte: { x: number; y: number }[]
  /** Voller Pfad inkl. Endpunkt — für die SVG-Vorschau (zeigt auch offene Formen). */
  pfad: { x: number; y: number }[]
  geschlossen: boolean
}

/**
 * Rechnet einen rechtwinkligen Polygonzug aus.
 * Start Richtung Osten (+x). 'R' dreht im Uhrzeigersinn (nach Süden, +y),
 * 'L' gegen den Uhrzeigersinn (nach Norden, −y). Bildschirm-Koordinaten (y nach unten).
 */
export function berechneGrundriss(waende: Wand[]): GrundrissErgebnis {
  const gueltige = waende.filter(w => w.laenge > 0)
  const umfang = round2(gueltige.reduce((s, w) => s + w.laenge, 0))

  // Voller Pfad: Startpunkt + Position nach jeder Wand
  const dirs = [ { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 } ] // O S W N
  let dir = 0, x = 0, y = 0
  const pfad: { x: number; y: number }[] = [{ x: 0, y: 0 }]
  gueltige.forEach((w, i) => {
    if (i > 0) {
      if (w.turn === 'R') dir = (dir + 1) % 4
      else if (w.turn === 'L') dir = (dir + 3) % 4
    }
    x += dirs[dir].x * w.laenge
    y += dirs[dir].y * w.laenge
    pfad.push({ x: round2(x), y: round2(y) })
  })

  if (gueltige.length < 3) {
    return { umfang, flaeche: 0, punkte: [], pfad, geschlossen: false }
  }

  const geschlossen = Math.abs(x) < 0.05 && Math.abs(y) < 0.05
  const punkte = pfad.slice(0, -1) // letzten (= Startpunkt bei geschlossener Form) weglassen
  const flaeche = geschlossen ? round2(shoelace(punkte)) : 0

  return { umfang, flaeche, punkte, pfad, geschlossen }
}

/** Fläche eines Polygons per Gauß'scher Trapezformel (Betrag). */
function shoelace(p: { x: number; y: number }[]): number {
  if (p.length < 3) return 0
  let sum = 0
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length]
    sum += a.x * b.y - b.x * a.y
  }
  return Math.abs(sum) / 2
}

export interface RaumMasse {
  wandflaeche: number | null   // Netto (nach Öffnungsabzug)
  bodenflaeche: number | null
  umfang: number | null
  hoehe: number
}

/** Leitet aus den Rohdaten (je nach Modus) die abgeleiteten Maße ab. */
export function berechneRaumMasse(dim: RaumDimension): RaumMasse {
  const hoehe = dim.hoehe && dim.hoehe > 0 ? dim.hoehe : STANDARD_HOEHE
  const t = dim.tueren ?? 0
  const f = dim.fenster ?? 0
  // PM-008-Nachtest 6: echte Fläche bevorzugen, falls bekannt (siehe
  // Kommentar bei tuerFlaeche/fensterFlaeche oben) — sonst wie bisher
  // Stückzahl × Standardmaß.
  const tuerAbzug = dim.tuerFlaeche ?? (t * TUER_FLAECHE)
  const fensterAbzug = dim.fensterFlaeche ?? (f * FENSTER_FLAECHE)
  const oeffnungsabzug = tuerAbzug + fensterAbzug
  const modus = dim.modus ?? 'rechteck'

  if (modus === 'flaeche') {
    return {
      // Direkt eingegebene Wandfläche gilt als fertige Netto-Fläche (ohne erneuten Abzug).
      wandflaeche: dim.wandflaeche != null && dim.wandflaeche > 0 ? round2(dim.wandflaeche) : null,
      bodenflaeche: dim.bodenflaeche != null && dim.bodenflaeche > 0 ? round2(dim.bodenflaeche) : null,
      umfang: null, // aus reiner Fläche nicht ableitbar
      hoehe,
    }
  }

  if (modus === 'grundriss') {
    const g = berechneGrundriss(dim.grundriss ?? [])
    if (g.umfang <= 0) return { wandflaeche: null, bodenflaeche: null, umfang: null, hoehe }
    return {
      wandflaeche: Math.max(0, round2(g.umfang * hoehe - oeffnungsabzug)),
      bodenflaeche: g.flaeche > 0 ? g.flaeche : null,
      umfang: g.umfang,
      hoehe,
    }
  }

  if (modus === 'wand') {
    // Einzelne Wand/Fassade: nur Länge × Höhe, keine Raumtiefe. Bewusst kein
    // Umfang (keine Sockelleisten an einer Fassade) und keine Bodenfläche
    // (keine Decke/kein Boden) — siehe Kommentar zu maler.ts, Zeile "Keine
    // Decke, kein Boden, kein Umfang für Fassaden", derselbe Fachgrund gilt
    // hier für die Bearbeiten-Ansicht.
    if (!dim.laenge || dim.laenge <= 0) return { wandflaeche: null, bodenflaeche: null, umfang: null, hoehe }
    return {
      wandflaeche: Math.max(0, round2(dim.laenge * hoehe - oeffnungsabzug)),
      bodenflaeche: null,
      umfang: null,
      hoehe,
    }
  }

  // rechteck
  if (!dim.breite || !dim.laenge) return { wandflaeche: null, bodenflaeche: null, umfang: null, hoehe }
  const umfang = round2(2 * (dim.breite + dim.laenge))
  return {
    wandflaeche: Math.max(0, round2(umfang * hoehe - oeffnungsabzug)),
    bodenflaeche: round2(dim.breite * dim.laenge),
    umfang,
    hoehe,
  }
}

/** Menge für eine konkrete Position anhand ihres Titels + Einheit. */
export function berechneQuantityFuerItem(titleDisplay: string, unit: string, dim: RaumDimension): number | null {
  const m = berechneRaumMasse(dim)
  const titel = titleDisplay.toLowerCase()

  if (unit === 'm²') {
    // Alle Leistungen, die auf derselben Wandfläche aufbauen, müssen beim
    // Bearbeiten gemeinsam neu berechnet werden. Zuvor wurde nur die Position
    // mit "Wand" im Titel aktualisiert; Spachteln, Schleifen, Grundieren und
    // Tapete blieben auf der alten Menge stehen.
    // PM-008/PD-003: "fassade" ergänzt — die Maler-Engine nennt die Position
    // einer Wand/Fassade "Fassadenfläche streichen …", nicht "Wandfläche …".
    // Ohne diese Erweiterung hätte eine Änderung an den neuen Wand-Maßen
    // (modus 'wand') die zugehörige Position beim Bearbeiten NICHT
    // aktualisiert — dieselbe Familie von Bug wie der ursprüngliche Fund
    // oben (Spachteln/Schleifen/Grundieren blieben auf alter Menge stehen).
    const istBodenSchleifen = /boden|parkett|estrich|kleber/.test(titel)
    const istWandLeistung = /wand|tapete|raufaser|spachtel|grundier|voranstrich|fassade/.test(titel)
      || (!istBodenSchleifen && /^schleifen(?:\s|$)/.test(titel))
    if (istWandLeistung) return m.wandflaeche
    if (titel.includes('deck')) return m.bodenflaeche
    if (titel.includes('boden') || titel.includes('fliesen') || titel.includes('laminat') || titel.includes('parkett') || titel.includes('vinyl')) {
      return m.bodenflaeche
    }
  }
  if (unit === 'lfdm') {
    if (titel.includes('sockel') || titel.includes('leiste')) {
      if (m.umfang == null) return null
      const t = dim.tueren ?? 0
      return Math.max(0, round2(m.umfang - t * TUER_BREITE))
    }
  }
  return null
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
