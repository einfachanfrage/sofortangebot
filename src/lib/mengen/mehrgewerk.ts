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
import { erkenneBelag, hatBodenArbeit } from '../boden-normalisierer'

type RaumLike = { arbeiten?: string[]; belag?: string | null; altbelag_entfernen?: boolean; sockelleisten?: boolean }

const MALER_ARBEIT = /streich|anstrich|tapete|tapezier|raufaser|spachtel|glätt|lackier|grundier|voranstrich/i
const BODEN_ARBEIT = /verleg|vinyl|laminat|parkett|dielen|kork|linoleum|teppich|nadelvlies|bodenbelag|altbelag|trittschall|estrich/i
// Im Rohtext: distinktive Boden-Signale (NICHT bloßes "boden" — "Boden schützen" ist Maler)
const BODEN_TEXT = /vinyl|laminat|parkett|diele|kork|linoleum|nadelvlies|designboden|teppich|bodenbelag|\bverleg|trittschall/i
const MALER_TEXT = /streich|anstrich|tapete|tapezier|raufaser|spachtel|glätt|lackier|grundier/i

function raeumeAllerArt(extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }): RaumLike[] {
  return [...(extraktion.raeume ?? []), ...(extraktion.bereiche ?? [])]
}

/** Boden-Anteil — aus der Struktur ODER dem Rohtext (KI packt Boden oft nicht in die Struktur).
 *  PM-010: `sockelleisten` zählt bewusst mit dazu — reine Sockelleisten-Arbeiten
 *  (montieren/streichen, ohne neuen Belag) laufen technisch über die Boden-Engine
 *  (sockelleisten.ts), auch wenn kein Belag gewechselt wird. Die Engine selbst
 *  entscheidet dann separat (siehe boden.ts hatEchtenBodenAuftrag), ob sie
 *  zusätzlich "X verlegen" anlegt — das hier ist nur die Aktivierung. */
function hatBodenAnteil(extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }, transkript: string): boolean {
  const inStruktur = raeumeAllerArt(extraktion).some(r =>
    r.belag != null || r.altbelag_entfernen === true || r.sockelleisten === true ||
    (r.arbeiten ?? []).some(a => BODEN_ARBEIT.test(a)))
  return inStruktur || BODEN_TEXT.test(transkript)
}

function hatMalerAnteil(extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }, transkript: string): boolean {
  const inStruktur = raeumeAllerArt(extraktion).some(r => (r.arbeiten ?? []).some(a => MALER_ARBEIT.test(a)))
  return inStruktur || MALER_TEXT.test(transkript)
}

/**
 * Zweites Gewerk, das zusätzlich zum primären berechnet werden soll — oder null.
 * Erkennt auch am Rohtext (nicht nur an der Struktur), weil die KI bei
 * gewerk=maler die Boden-Arbeiten oft gar nicht in raeume[] ablegt.
 */
export function sekundaerGewerk(primaer: string, extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }, transkript = ''): string | null {
  if (primaer === 'maler' && hatBodenAnteil(extraktion, transkript)) return 'boden_parkett'
  if (primaer === 'boden_parkett' && hatMalerAnteil(extraktion, transkript)) return 'maler'
  return null
}

/** Reichert die Räume mit Boden-Infos aus dem Rohtext an (Belag/Altbelag), damit
 *  die Boden-Engine "Vinyl verlegen" statt "Bodenbelag verlegen" liefert. */
function reichereBodenAn<E extends { raeume?: RaumLike[]; bereiche?: RaumLike[] }>(extraktion: E, transkript: string): E {
  const belag = erkenneBelag(transkript)
  const altbelag = hatBodenArbeit(transkript, 'altbelag_entfernen')
  const anreichern = (r: RaumLike): RaumLike => ({
    ...r,
    belag: r.belag ?? belag ?? undefined,
    altbelag_entfernen: r.altbelag_entfernen ?? altbelag,
  })
  return {
    ...extraktion,
    raeume: (extraktion.raeume ?? []).map(anreichern),
    bereiche: (extraktion.bereiche ?? []).map(anreichern),
  }
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
  const sekundaer = sekundaerGewerk(primaer, extraktion, textMitZahlen)

  // 1) Engines (Mengen)
  const mengenPrimaer = berechneMengen(primaer, extraktion)
  let rohPositionen = mengenPrimaer.positionen
  if (sekundaer) {
    // Für die Boden-Engine die Räume mit Belag/Altbelag aus dem Text anreichern
    const sekExtraktion = sekundaer === 'boden_parkett'
      ? reichereBodenAn({ ...extraktion, gewerk: sekundaer }, textMitZahlen)
      : { ...extraktion, gewerk: sekundaer }
    const mengenSek = berechneMengen(sekundaer, sekExtraktion)
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

  // 3) "Boden schützen" (Maler) ist überflüssig, wenn im selben Raum ein neuer
  //    Boden verlegt wird — man schützt keinen Boden, den man ersetzt.
  positionen = entferneRedundantenBodenschutz(positionen)
  positionen = entferneRedundantesSockelAbkleben(positionen)

  // 4) Finaler Exakt-Dedup: identische Position (gleicher Titel + gleiche Menge)
  //    kann nie doppelt gewollt sein (verschiedene Räume tragen ihr "— Raum"-Suffix)
  positionen = dedupExakt(positionen)

  return { positionen, fehlende, mengenRoh: { ...mengenPrimaer, positionen: rohPositionen } }
}

/** Entfernt exakte Duplikate (gleicher Titel + gleiche Menge), erste Position bleibt. */
function dedupExakt(positionen: BerechnetePosition[]): BerechnetePosition[] {
  const seen = new Set<string>()
  return positionen.filter(p => {
    const key = `${p.beschreibung.toLowerCase().trim()}|${p.menge}|${p.einheit}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const BODENSCHUTZ_POSITION = /boden\s*(?:schütz|schuetz)|boden[^—–]*(?:abdeck|schutz)/i
const BODEN_VERLEGEN_POSITION = /\bverleg(?:en|ung)\b/i

function raumSuffix(beschreibung: string): string | null {
  const match = beschreibung.match(/\s[—–]\s*(.+)$/)
  return match?.[1]?.trim().toLocaleLowerCase('de-DE') || null
}

/**
 * Entfernt Bodenschutz nur bei eindeutig gleicher Raumzuordnung. Eine
 * pauschale Schutzposition ohne Raum-Suffix bleibt bestehen, weil sie sich auf
 * andere Flächen oder Laufwege beziehen kann.
 */
export function entferneRedundantenBodenschutz(positionen: BerechnetePosition[]): BerechnetePosition[] {
  const raeumeMitNeuemBoden = new Set(
    positionen
      .filter(p => BODEN_VERLEGEN_POSITION.test(p.beschreibung))
      .map(p => raumSuffix(p.beschreibung))
      .filter((raum): raum is string => raum !== null)
  )

  if (raeumeMitNeuemBoden.size === 0) return positionen

  return positionen.filter(position => {
    if (!BODENSCHUTZ_POSITION.test(position.beschreibung)) return true
    const raum = raumSuffix(position.beschreibung)
    return !raum || !raeumeMitNeuemBoden.has(raum)
  })
}

export function entferneRedundantesSockelAbkleben(positionen: BerechnetePosition[]): BerechnetePosition[] {
  const raeumeMitMontage = new Set(
    positionen
      .filter(p => /sockelleisten montieren/i.test(p.beschreibung))
      .map(p => raumSuffix(p.beschreibung))
      .filter((raum): raum is string => raum !== null)
  )
  return positionen.filter(position => {
    if (!/sockelleisten abkleben/i.test(position.beschreibung)) return true
    const raum = raumSuffix(position.beschreibung)
    return !raum || !raeumeMitMontage.has(raum)
  })
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
