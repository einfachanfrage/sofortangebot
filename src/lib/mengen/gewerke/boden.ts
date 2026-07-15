import type { MengenErgebnis, BerechnetePosition } from '../types'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function belagLabel(belag: string | undefined): string {
  if (!belag) return 'Bodenbelag'
  const b = belag.toLowerCase()
  if (b.includes('klick-vinyl') || (b.includes('klick') && /v[ie]nyl/.test(b))) return 'Klick-Vinyl'
  if (/v[ie]nyl/.test(b) || b.includes('designboden') || b.includes('lvt')) return 'Vinyl-Boden'
  if (b.includes('laminat')) return 'Laminat'
  if (b.includes('parkett') || b.includes('fertigparkett')) return 'Fertigparkett'
  if (b.includes('kork')) return 'Kork'
  if (b.includes('linoleum')) return 'Linoleum'
  if (b.includes('nadelvlies')) return 'Nadelvlies-Teppichboden'
  if (b.includes('teppich')) return 'Teppichboden'
  return belag
}

function standardVerschnitt(belag: string | undefined): number {
  if (!belag) return 0.10
  const b = belag.toLowerCase()
  if (b.includes('laminat') || /v[ie]nyl/.test(b) || b.includes('linoleum') || b.includes('lvt') || b.includes('klick')) return 0.10
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

    const verschnitt = verlegerichtung === 'diagonal' ? 0.15 : standardVerschnitt(belag)
    const label = belagLabel(belag)
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
      positionen.push({
        beschreibung: `Sockelleisten montieren — ${name}`,
        menge: umfang,
        einheit: 'lfdm',
        konfidenz: 'high',
        berechnungsweg: `Umfang: ${umfang} lfm`,
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
