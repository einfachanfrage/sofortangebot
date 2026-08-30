import type { BerechnetePosition } from '../mengen/types'
import { hat, add } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'
// Belag-Erkennung zentral im boden-normalisierer (eine Quelle, getestet).
// Re-Export, damit bestehende Importe aus './boden-basis' unverändert bleiben.
import type { BelagTyp } from '../boden-normalisierer'
import { erkenneBelag, belagBezeichnung, erkenneBelagName } from '../boden-normalisierer'
import { extrahiereBodenflaeche, extrahiereStreichflaeche } from '@/lib/extraktion-masse'
export type { BelagTyp }
export { erkenneBelag, belagBezeichnung, erkenneBelagName }

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
function standardVerschnitt(belag: BelagTyp): number {
  if (belag === 'laminat' || belag === 'vinyl' || belag === 'linoleum') return 0.10
  return 0
}

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
  const nurOhneSockel =
    lower.includes('ohne sockelleisten') ||
    lower.includes('nur boden ohne') ||
    lower.includes('keine sockelleisten')

  const m2 = extrahiereFlaeche(lower) ?? extrahiereFlaecheAusAbmessungen(lower)
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
        ergaenzt.push({ beschreibung: 'Estrich grundieren', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
      } else {
        fehlende.push('Estrich grundieren')
      }
      if (hatAusgleich) {
        // Stärke aus Transkript: "3 Millimeter" o.ä.
        const mmMatch = lower.match(/(\d+)\s*m(?:illimeter|m)/)
        const mmStr = mmMatch ? ` (bis ${mmMatch[1]}mm)` : ''
        if (m2) {
          ergaenzt.push({ beschreibung: `Ausgleichsmasse einbringen${mmStr}`, menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        } else {
          fehlende.push(`Ausgleichsmasse einbringen${mmStr}`)
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
  const verschnitt = explizitVerschnitt ?? standardVerschnitt(belag)

  if (m2) {
    const mengeMitVerschnitt = verschnitt > 0 ? round2(m2 * (1 + verschnitt)) : m2
    const pct = Math.round(verschnitt * 100)
    const verschnittSuffix = verschnitt > 0 ? ` inkl. ${pct}% Verschnitt` : ''
    ergaenzt.push({
      beschreibung: `${spezName} verlegen${verschnittSuffix}`,
      menge: mengeMitVerschnitt,
      einheit: 'm²',
      berechnungsweg: verschnitt > 0 ? `${m2} m² × ${1 + verschnitt} = ${mengeMitVerschnitt} m²` : `${m2} m²`,
      ...mk,
    })
  } else {
    add(ergaenzt, fehlende, `${spezName} verlegen`)
  }

  return { nurOhneSockel }
}
