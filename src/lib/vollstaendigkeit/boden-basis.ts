import type { BerechnetePosition } from '../mengen/types'
import { hat, add } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'
// Belag-Erkennung zentral im boden-normalisierer (eine Quelle, getestet).
// Re-Export, damit bestehende Importe aus './boden-basis' unverändert bleiben.
import type { BelagTyp } from '../boden-normalisierer'
import { erkenneBelag, belagBezeichnung, erkenneBelagName, verschnittFuerVerlegung } from '../boden-normalisierer'
import { extrahiereBodenflaeche, extrahiereStreichflaeche } from '@/lib/extraktion-masse'
import { erkenneSockelleistenAusschluss } from '../sockelleisten-ausschluss'
import { verlegeartZusatz } from '../verlegeart'
export type { BelagTyp }
export { erkenneBelag, belagBezeichnung, erkenneBelagName }

// ── Ausgleichsmasse: die Stärke entscheidet den Preis ─────────────────────
//
// Der Katalog staffelt die Ausgleichsmasse in drei Stärken, und die Preise
// liegen weit auseinander:
//
//   `Ausgleichsmasse bis 3 mm einbringen`    10,00 €/m²
//   `Ausgleichsmasse 3–10 mm einbringen`     16,00 €/m²
//   `Ausgleichsmasse 10–30 mm einbringen`    26,00 €/m²
//
// Die Engine schrieb bisher `Ausgleichsmasse einbringen (bis 10mm)` — eine
// Schreibweise, die im Katalog nicht vorkommt. Der Preis-Matcher warf die
// Klammer weg, und ALLE drei Stärken bekamen den 3-mm-Preis: 10,00 € statt
// 16,00 € oder 26,00 €. Der Prüfmeister über diese Fehlerklasse: *„Das sind
// die leisesten von allen."* Bei 60 m² Estrich sind 16,00 € Unterschied pro
// Quadratmeter knapp tausend Euro, die niemandem auffallen.
//
// Seit die Staffeln ein Filter sind (Gruppe `Staffel` in
// preis-aufwandswoerter.ts; hieß bis zum 12.09.2026 `Maßschwelle`), ist der
// falsche Preis immerhin weg — die Position stand aber mit 0,00 € da. Das
// war richtig und trotzdem unbrauchbar: Der Katalog HAT die Zeile, sie hieß
// nur anders. Deshalb hier die Staffel wörtlich wie im Katalog.
//
// Über 30 mm bleibt bewusst ohne Staffel: Der Boden-Katalog hört dort auf
// (weiter geht es nur unter „Estrich – Ausgleich & Spachtelung", einem
// anderen Gewerk). Lieber sichtbar ohne Preis als still der 26-€-Satz für
// eine Schicht, die doppelt so dick ist — PM-018.
export function ausgleichsmasseTitel(mm: number | null): string {
  if (mm === null || !Number.isFinite(mm)) return 'Ausgleichsmasse einbringen'
  if (mm <= 3) return 'Ausgleichsmasse bis 3 mm einbringen'
  if (mm <= 10) return 'Ausgleichsmasse 3–10 mm einbringen'
  if (mm <= 30) return 'Ausgleichsmasse 10–30 mm einbringen'
  return `Ausgleichsmasse einbringen (${mm} mm)`
}

/**
 * Bodenfläche aus dem Rohtext — die Grundlage für ALLE hier ergänzten
 * Bodenpositionen.
 *
 * Live-Fund (Sandy, 2026-08-30): Die Regel nahm die ERSTE m²-Zahl im ganzen
 * Transkript. Bei „120 Quadratmeter Wandfläche gestrichen und 55 Quadratmeter
 * Laminat verlegt" war das die WANDfläche — im Angebot standen 132 m² Laminat
 * (120 + 10 % Verschnitt) statt 60,5 m². Mehr als das Doppelte, ohne Warnung.
 *
 * Jetzt in dieser Reihenfolge:
 *   1. Eine Zahl, die ausdrücklich zum Boden gehört ("55 m² Laminat").
 *   2. Sonst die erste m²-Zahl, die NICHT als Wand-/Deckenfläche ausgewiesen
 *      ist — so bleiben die vielen Fälle ohne Belagswort ("Zimmer, 20 qm")
 *      unverändert.
 *   3. Sonst nichts. Lieber keine Menge als eine falsche: eine fehlende
 *      Position fällt beim Prüfen auf, eine doppelt so hohe nicht.
 */
export function extrahiereFlaeche(lower: string): number | null {
  const boden = extrahiereBodenflaeche(lower)
  if (boden !== null) return boden

  // Eine Zahl, die am Streichen hängt ("35 m² gestrichen"), ist eine
  // Wandfläche, auch ohne das Wort "Wand" — siehe DC-040.
  const streichflaeche = extrahiereStreichflaeche(lower)
  const WAND_ODER_DECKE = /\b(wand|wände|waende|wandfl|decke|deckenfl)/
  const treffer = [...lower.matchAll(/(\d+[\.,]?\d*)\s*(?:m²|qm|quadratmeter)/g)]
  for (const m of treffer) {
    const start = m.index ?? 0
    const umfeld = lower.slice(Math.max(0, start - 30), start + m[0].length + 30)
    if (WAND_ODER_DECKE.test(umfeld)) continue
    const wert = parseFloat(m[1].replace(',', '.'))
    if (streichflaeche !== null && wert === streichflaeche) continue
    return wert
  }
  return null
}

// Fläche aus "X Meter lang und Y Meter breit" ODER "X mal Y Meter" berechnen
export function extrahiereFlaecheAusAbmessungen(lower: string): number | null {
  const m = lower.match(/(\d+[\.,]?\d*)\s*m(?:eter)?\s+lang\s+und\s+(\d+[\.,]?\d*)\s*m(?:eter)?\s+breit/)
    // "4 mal 4 meter", "3 x 5 m" — "meter/m" am Ende verhindert Fehltreffer wie "3 mal streichen"
    ?? lower.match(/(\d+(?:[.,]\d+)?)\s*(?:mal|x|×)\s*(\d+(?:[.,]\d+)?)\s*m(?:eter)?\b/)
  if (!m) return null
  const l = parseFloat(m[1].replace(',', '.'))
  const b = parseFloat(m[2].replace(',', '.'))
  if (l <= 0 || b <= 0 || l > 100 || b > 100) return null
  return Math.round(l * b * 100) / 100
}

// Expliziten Verschnitt-Prozentsatz aus Transkript lesen
export function extrahiereVerschnitt(lower: string): number | null {
  const m = lower.match(/(\d+)\s*(?:prozent|%)\s*(?:verschnitt|aufschlag|mehr)/)
    ?? lower.match(/verschnitt[^.]*?(\d+)\s*(?:prozent|%)/)
  if (m) return parseInt(m[1]) / 100
  return null
}

// Standard-Verschnitt je Belagstyp (0 = kein Standard)


function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function bodenNettoflaecheAusPositionen(positionen: BerechnetePosition[]): number | null {
  const verlegen = positionen.find(p => /verlegen/i.test(p.beschreibung) && p.einheit === 'm²')
  if (!verlegen) return null
  const ausRechenweg = verlegen.berechnungsweg?.match(/(\d+(?:[.,]\d+)?)\s*m²/i)
  if (ausRechenweg) return parseFloat(ausRechenweg[1].replace(',', '.'))
  if (/15\s*%\s*verschnitt/i.test(verlegen.beschreibung)) return round2(verlegen.menge / 1.15)
  if (/10\s*%\s*verschnitt/i.test(verlegen.beschreibung)) return round2(verlegen.menge / 1.1)
  return verlegen.menge
}

export function pruefeBodenBasis(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  belag: BelagTyp,
  v: AuftragsVerstaendnis,
): { nurOhneSockel: boolean } {
  // PM-033, Befund 2 (03.09.2026): Diese Prüfung kannte genau drei
  // Formulierungen. „Sockelleisten bleiben überall, wie sie sind" war nicht
  // dabei — und genau daran ist eine erfundene 22-lfdm-Position vorbeigelaufen.
  // Die Sprechweise liest jetzt sockelleisten-ausschluss.ts, satzweise.
  const nurOhneSockel =
    lower.includes('ohne sockelleisten') ||
    lower.includes('nur boden ohne') ||
    lower.includes('keine sockelleisten') ||
    erkenneSockelleistenAusschluss(lower).global

  // PM-034, Befund 5: Die Grundierung im Esszimmer fehlte, weil dieser Block
  // seine Fläche ausschließlich aus dem TEXT las — und die gesprochene Form
  // („vier mal drei fünfzig") dort nicht als Maßpaar ankam. Seit die Prüfung
  // je Raum läuft (siehe boden.ts), ist die Verlegefläche DIESES Raums
  // eindeutig und die bessere Quelle: sie steht schon berechnet in seiner
  // eigenen Position, inklusive korrekt herausgerechnetem Verschnitt.
  const m2 = extrahiereFlaeche(lower)
    ?? extrahiereFlaecheAusAbmessungen(lower)
    ?? bodenNettoflaecheAusPositionen(ergaenzt)
  const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }

  // ── Untergrundvorbereitung ───────────────────────────────────────────────
  const hatGrundieren = v.hatArbeit('grundieren')
  const hatAusgleich = lower.includes('ausgleich') || lower.includes('ausgleichsmasse')
  const hatSperre = lower.includes('feuchtigkeitssperre') || lower.includes('epoxidharz')
  const hatUntergrundpruefung = /untergrund.{0,30}(?:prüf|kontroll|beurteil)|(?:prüf|kontroll|beurteil).{0,30}untergrund/i.test(lower)

  if (hatUntergrundpruefung && !hat(ergaenzt, 'untergrundprüfung', 'untergrund prüfen')) {
    ergaenzt.push({
      beschreibung: 'Untergrundprüfung (Ebenheit, Feuchte, Tragfähigkeit)',
      menge: 1,
      einheit: 'Pauschale',
      berechnungsweg: 'Untergrundprüfung ausdrücklich beauftragt',
      ...mk,
    })
  }

  if (!hatSperre && !hat(ergaenzt, 'ausgleich', 'spachtelmasse', 'grundier')) {
    if (hatGrundieren) {
      if (m2) {
        // ── Estrich grundieren = Haftgrund, 6,00 € (Manfred, 12.09.2026) ──
        //
        // *„Sechs. Nicht viereinhalb. Der Grund ist das Material, nicht die
        // Arbeit: Tiefengrund ist Wasser mit ein bisschen Bindemittel.
        // Haftgrund für Estrich ist gefüllt, mit Quarzsand, damit die
        // Ausgleichsmasse greift — der Eimer kostet das Drei- bis Vierfache,
        // und du brauchst mehr davon pro Quadratmeter, weil der Estrich
        // saugt."*
        //
        // Ich hatte diese Zeile kurz mit 4,50 € stehen lassen und das
        // „sichtbar statt still" genannt. Manfred hat das zerlegt, und er
        // hat recht: *„Für dich ist das sichtbar, weil du's weißt. Für den
        // Betrieb steht da ‚Estrich grundieren (Haftgrund)' mit 4,50 € — und
        // er denkt, das ist sein Preis. Das ist still, nur anders."*
        //
        // Gelöst über die Grundierungsart als Filter am Rohtitel
        // (preis-aufwandswoerter.ts) — dieselbe Bauweise wie Q-Stufe und
        // Anstrichzahl. Der Titel trifft jetzt `Grundieren (Haftgrund /
        // Sperrgrund)` für 6,00 €, mit Klammer und ohne Eingriff in die
        // Normalisierung.
        //
        // Offen bleibt nur die eigene Katalogzeile `Estrich grundieren
        // (Haftgrund)` — gleicher Betrag, schönerer Name, kommt mit dem
        // Katalog-Zug. Und `Estrich sperren (Epoxi)` (~10 €) als EIGENE
        // Position, wenn der Estrich feucht ist; das ist ausdrücklich nicht
        // dieselbe Arbeit.
        ergaenzt.push({ beschreibung: 'Estrich grundieren (Haftgrund)', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
      } else {
        fehlende.push('Estrich grundieren (Haftgrund)')
      }
      if (hatAusgleich) {
        // Stärke aus Transkript: "3 Millimeter" o.ä.
        const mmMatch = lower.match(/(\d+)\s*m(?:illimeter|m)/)
        const titel = ausgleichsmasseTitel(mmMatch ? Number(mmMatch[1]) : null)
        if (m2) {
          ergaenzt.push({ beschreibung: titel, menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        } else {
          fehlende.push(titel)
        }
      }
    }
  }

  // ── Belag verlegen ───────────────────────────────────────────────────────
  const vorhandeneVerlegung = ergaenzt.find(position => /verlegen|verkleben/i.test(position.beschreibung))
  const vollflaechigVerklebt = /vollflächig.{0,25}verkleb|verkleb.{0,25}vollflächig/i.test(lower)
  if (vorhandeneVerlegung && vollflaechigVerklebt && /fertigparkett/i.test(lower)) {
    const suffix = vorhandeneVerlegung.beschreibung.match(/\s[—–-]\s*(.+)$/)?.[0] ?? ''
    vorhandeneVerlegung.beschreibung = `Fertigparkett verlegen vollflächig verklebt${suffix}`
    vorhandeneVerlegung.berechnungsweg = `${bodenNettoflaecheAusPositionen([vorhandeneVerlegung]) ?? vorhandeneVerlegung.menge} m² vollflächig verklebt`
  }
  if (hat(ergaenzt, 'verlegen', belag ?? 'bodenbelag', 'verkleb', 'fischgrät')) return { nurOhneSockel }

  const spezName = erkenneBelagName(lower, belag)
  const istBahnenware = lower.includes('bahnenware') || lower.includes('bahnen')

  // Fischgrät wird in boden-sonder.ts behandelt
  if (lower.includes('fischgrät') || lower.includes('fischgraet')) return { nurOhneSockel }

  // Vollflächig verkleben (Bahnenware, Nadelvlies) — in boden-sonder.ts
  const hatVollflaechigeVerklebung = (lower.includes('vollflächig') || lower.includes('vollstaendig') || lower.includes('vollflächig verkleb'))
    && (istBahnenware || belag === 'teppich' || belag === 'linoleum')
  if (hatVollflaechigeVerklebung) return { nurOhneSockel }

  const explizitVerschnitt = extrahiereVerschnitt(lower)
  const verschnitt = explizitVerschnitt ?? verschnittFuerVerlegung(belag, lower)

  // G.2: Verlegeart in den Titel, wo sie feststeht — siehe verlegeart.ts.
  // Hier gibt es keinen Raumtext, es gilt der ganze Auftragstext.
  const verlegeart = verlegeartZusatz(spezName, lower)

  if (m2) {
    const mengeMitVerschnitt = verschnitt > 0 ? round2(m2 * (1 + verschnitt)) : m2
    const pct = Math.round(verschnitt * 100)
    const verschnittSuffix = verschnitt > 0 ? ` inkl. ${pct}% Verschnitt` : ''
    ergaenzt.push({
      beschreibung: `${spezName} verlegen${verlegeart}${verschnittSuffix}`,
      menge: mengeMitVerschnitt,
      einheit: 'm²',
      berechnungsweg: verschnitt > 0 ? `${m2} m² × ${1 + verschnitt} = ${mengeMitVerschnitt} m²` : `${m2} m²`,
      ...mk,
    })
  } else {
    add(ergaenzt, fehlende, `${spezName} verlegen${verlegeart}`)
  }

  return { nurOhneSockel }
}
