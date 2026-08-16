import type { MengenErgebnis, BerechnetePosition } from '../types'
import type { BelagTyp } from '../../boden-normalisierer'
import { baueVerstaendnis } from '../../auftrags-verstaendnis'
import { berechneSockelleistenLaenge } from './sockelleisten'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// Label und Verschnitt schalten auf den TYPISIERTEN Belag (BelagTyp aus dem
// Vertrag/erkenneBelag) statt auf eine engine-eigene includes()-Kette — Schluss
// mit der dreifachen Belag-Erkennung. Die Label-Strings bleiben bewusst
// unverändert, weil sie als Katalog-Schlüssel dienen (preis-matcher,
// material-mapping erwarten exakt "Fertigparkett"/"Vinyl-Boden").
function belagLabel(belag: string | undefined, typ: BelagTyp): string {
  if (!belag) return 'Bodenbelag'
  const b = belag.toLowerCase()
  switch (typ) {
    case 'vinyl':
      return b.includes('klick-vinyl') || (b.includes('klick') && /v[ie]nyl/.test(b)) ? 'Klick-Vinyl' : 'Vinyl-Boden'
    case 'laminat':  return 'Laminat'
    case 'parkett':  return 'Fertigparkett'
    case 'kork':     return 'Kork'
    case 'linoleum': return 'Linoleum'
    case 'teppich':  return b.includes('nadelvlies') ? 'Nadelvlies-Teppichboden' : 'Teppichboden'
    default:         return belag // unklassifiziert: Rohwert als Katalog-Fallback
  }
}

function standardVerschnitt(belag: string | undefined, typ: BelagTyp): number {
  if (!belag) return 0.10
  // Plattenware (Laminat/Vinyl/Linoleum) hat Schneidverschnitt; Parkett/Kork/
  // Teppich in dieser Konvention nicht.
  if (typ === 'laminat' || typ === 'vinyl' || typ === 'linoleum') return 0.10
  return 0
}

export function bodenEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  for (const raum of (daten.raeume ?? [])) {
    const {
      name = 'Raum',
      laenge, breite,
      flaeche: f,
      belag,
      verlegerichtung,
      tueren = [],
      altbelag_entfernen = false,
      sockelleisten = false,
      ausgleich = false,
      feuchtigkeitssperre = false,
      parkett_schleifen = false,
    } = raum

    let flaeche: number | null = null
    let umfang: number | null = null

    if (laenge && breite) {
      flaeche = round2(laenge * breite)
      umfang = round2(2 * laenge + 2 * breite)
    } else if (f) {
      flaeche = f
    }

    if (!flaeche) continue

    // Typisierter Auftrags-Vertrag: der Belag-Feldwert wird EINMAL zentral über
    // erkenneBelag klassifiziert (belagText-Signal, Etappe 2). Kein Rohtext vom
    // Transkript → kein Cross-Room-Bleed bei mehreren Räumen.
    const belagTyp: BelagTyp = baueVerstaendnis(belag ?? '', { belagText: belag }).belag
    const verschnitt = verlegerichtung === 'diagonal' ? 0.15 : standardVerschnitt(belag, belagTyp)
    const label = belagLabel(belag, belagTyp)
    const pct = Math.round(verschnitt * 100)
    const verschnittSuffix = verschnitt > 0 ? ` inkl. ${pct}% Verschnitt` : ''

    // Verlegen NUR wenn kein reines Abschleif-/Refinish-Auftrag (man legt keinen
    // neuen Boden, wenn der bestehende nur abgeschliffen + versiegelt wird).
    if (!parkett_schleifen) {
      positionen.push({
        beschreibung: `${label} verlegen${verschnittSuffix} — ${name}`,
        menge: round2(flaeche * (1 + verschnitt)),
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `${flaeche} m² + ${pct}% Verschnitt`,
        annahmen: [
          `${pct}% Verschnitt${verlegerichtung === 'diagonal' ? ' (Diagonalverlegung)' : ' (Standard)'}`,
        ],
      })
    }

    if (altbelag_entfernen) {
      positionen.push({
        beschreibung: `Altbelag entfernen — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Bodenfläche: ${flaeche} m²`,
        annahmen: [],
      })
    }

    if (sockelleisten && umfang) {
      // PM-002: Türen unterbrechen die Sockelleiste — genau wie beim Maler
      // (maler.ts), nur bisher hier nie abgezogen worden. Gleiche Funktion
      // wie dort, damit das nicht wieder auseinanderdriftet.
      const effTueren = (tueren as Array<{ breite?: number }>).filter(Boolean)
      const sockelM = effTueren.length > 0 ? berechneSockelleistenLaenge(umfang, effTueren) : umfang
      positionen.push({
        beschreibung: `Sockelleisten montieren — ${name}`,
        menge: sockelM,
        einheit: 'lfdm',
        konfidenz: 'high',
        berechnungsweg: effTueren.length > 0
          ? `Umfang: ${umfang} lfm − Türbreiten: ${round2(umfang - sockelM)} m`
          : `Umfang: ${umfang} lfm`,
        annahmen: [],
      })
    }

    if (feuchtigkeitssperre) {
      positionen.push({
        beschreibung: `Epoxidharz-Feuchtigkeitssperre aufwalzen — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Bodenfläche: ${flaeche} m²`,
        annahmen: [],
      })
    } else if (ausgleich) {
      positionen.push({
        beschreibung: `Untergrundvorbereitung / Ausgleich — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Bodenfläche: ${flaeche} m²`,
        annahmen: [],
      })
    }

    if (parkett_schleifen) {
      positionen.push({
        beschreibung: `Parkett schleifen — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Bodenfläche: ${flaeche} m²`,
        annahmen: [],
      })
    }
  }

  if (positionen.length === 0) {
    warnungen.push('Keine Bodenbelag-Flächen erkannt. Bitte Raummaße angeben.')
  }

  return {
    gewerk: 'boden_parkett',
    quelleText: daten.transkript ?? '',
    objekte: [],
    positionen,
    rueckfragen: [],
    warnungen,
    plausibel: warnungen.length === 0,
  }
}
