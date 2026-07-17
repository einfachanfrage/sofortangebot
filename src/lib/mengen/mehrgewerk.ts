// Mehr-Gewerk-Verarbeitung: Maler UND Boden im selben Auftrag.
//
// Die KI liefert genau EIN Haupt-Gewerk. Steckt in den Räumen aber auch das
// andere Gewerk (z.B. "Wände streichen" + "Vinyl verlegen" im selben Flur),
// lief bisher nur eine Engine — das zweite Gewerk fiel raus, obwohl erkannt.
// Hier: primäres + (falls vorhanden) sekundäres Gewerk berechnen und mergen.

import type { BerechnetePosition, MengenErgebnis } from './types'
import { berechneMengen } from './engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import type { ExtraktionSignale } from '../auftrags-verstaendnis'

type RaumLike = { arbeiten?: string[]; belag?: string | null; altbelag_entfernen?: boolean }

const MALER_ARBEIT = /streich|anstrich|tapete|tapezier|raufaser|spachtel|glätt|lackier|grundier|voranstrich/i
const BODEN_ARBEIT = /verleg|vinyl|laminat|parkett|dielen|kork|linoleum|teppich|nadelvlies|bodenbelag|altbelag|sockelleisten|trittschall|abschleif|estrich/i

function raeumeAllerArt(extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }): RaumLike[] {
  return [...(extraktion.raeume ?? []), ...(extraktion.bereiche ?? [])]
}

/** Sind Boden-Arbeiten vorhanden? (Belag, Altbelag oder Boden-Verb in arbeiten[]) */
function hatBodenAnteil(extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }): boolean {
  return raeumeAllerArt(extraktion).some(r =>
    r.belag != null || r.altbelag_entfernen === true ||
    (r.arbeiten ?? []).some(a => BODEN_ARBEIT.test(a)))
}

/** Sind Maler-Arbeiten vorhanden? */
function hatMalerAnteil(extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }): boolean {
  return raeumeAllerArt(extraktion).some(r => (r.arbeiten ?? []).some(a => MALER_ARBEIT.test(a)))
}

/**
 * Zweites Gewerk, das zusätzlich zum primären berechnet werden soll — oder null.
 * Nur zwischen Maler ↔ Boden (die häufige Kombi im selben Raum).
 */
export function sekundaerGewerk(primaer: string, extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }): string | null {
  if (primaer === 'maler' && hatBodenAnteil(extraktion)) return 'boden_parkett'
  if (primaer === 'boden_parkett' && hatMalerAnteil(extraktion)) return 'maler'
  return null
}

interface Meta { fensterAnzahl?: number; tuerenAnzahl?: number }

/**
 * Berechnet Mengen + Vollständigkeit über ALLE beteiligten Gewerke und merged.
 * Primär-Gewerk zuerst, dann ggf. das sekundäre; Duplikate (gleicher Titel +
 * gleiche Menge) werden entfernt.
 */
export function berechneUndPruefeAlleGewerke(
  extraktion: { gewerk: string; raeume?: RaumLike[]; bereiche?: RaumLike[]; transkript?: string },
  textMitZahlen: string,
  meta: Meta,
  signale: ExtraktionSignale,
): { positionen: BerechnetePosition[]; fehlende: string[]; mengenRoh: MengenErgebnis } {
  const primaer = extraktion.gewerk
  const sekundaer = sekundaerGewerk(primaer, extraktion)

  // 1) Engines (Mengen)
  const mengenPrimaer = berechneMengen(primaer, extraktion)
  let rohPositionen = mengenPrimaer.positionen
  if (sekundaer) {
    const mengenSek = berechneMengen(sekundaer, extraktion)
    rohPositionen = mergePositionen(rohPositionen, mengenSek.positionen)
  }

  // 2) Vollständigkeit je Gewerk (nacheinander auf den gemergten Positionen)
  const fehlende: string[] = []
  let positionen = rohPositionen
  for (const g of sekundaer ? [primaer, sekundaer] : [primaer]) {
    const res = pruefeUndErgaenzeVollstaendigkeit(g, positionen, textMitZahlen, meta, signale)
    positionen = res.positionen
    fehlende.push(...res.fehlende)
  }

  return { positionen, fehlende, mengenRoh: { ...mengenPrimaer, positionen: rohPositionen } }
}

function mergePositionen(a: BerechnetePosition[], b: BerechnetePosition[]): BerechnetePosition[] {
  const seen = new Set(a.map(p => `${p.beschreibung.toLowerCase()}|${p.menge}`))
  const merged = [...a]
  for (const p of b) {
    const key = `${p.beschreibung.toLowerCase()}|${p.menge}`
    if (!seen.has(key)) { merged.push(p); seen.add(key) }
  }
  return merged
}
