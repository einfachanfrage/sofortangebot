import type { ExtrahierteDaten } from './types'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

type RaumMit = ExtrahierteDaten['raeume'][number] & {
  vage?: boolean
  vage_typ?: string | null
  vage_beschreibung?: string | null
  vage_quelle?: string
  anzahl?: number
}

export function verarbeiteAntworten(
  extraktion: ExtrahierteDaten & { raeume: RaumMit[] },
  antworten: Record<string, { wert: number | number[]; einheit: string } | null>
): ExtrahierteDaten & { raeume: RaumMit[] } {
  const angereichert = {
    ...extraktion,
    raeume: extraktion.raeume.map(r => ({ ...r })) as RaumMit[],
  }

  for (const raum of angereichert.raeume) {
    if (!raum.vage) continue
    const name = raum.name || 'Raum'

    // Länge × Breite
    const masseAntwort = antworten[`raum_${name}_masse`]
    if (masseAntwort) {
      if (Array.isArray(masseAntwort.wert) && masseAntwort.wert.length === 2) {
        raum.laenge = masseAntwort.wert[0]
        raum.breite = masseAntwort.wert[1]
        raum.flaeche = round2(masseAntwort.wert[0] * masseAntwort.wert[1])
      } else if (typeof masseAntwort.wert === 'number') {
        raum.flaeche = masseAntwort.wert
      }
      raum.vage = false
      raum.vage_quelle = 'nutzer_antwort'
    }

    // Höhe
    const hoeheAntwort = antworten[`raum_${name}_hoehe`]
    if (hoeheAntwort && typeof hoeheAntwort.wert === 'number') {
      raum.hoehe = hoeheAntwort.wert
      raum.vage = false
      raum.vage_quelle = 'nutzer_antwort'
    }

    // Anzahl (Plural → Raum duplizieren)
    const anzahlAntwort = antworten[`plural_${name}_anzahl`]
    if (anzahlAntwort && typeof anzahlAntwort.wert === 'number') {
      raum.anzahl = anzahlAntwort.wert
    }

    // Mehrere Räume mit individuellen Maßen
    const mehrereAntwort = antworten[`raum_${name}_masse_mehrere`]
    if (mehrereAntwort && Array.isArray(mehrereAntwort.wert)) {
      raum.anzahl = Math.floor(mehrereAntwort.wert.length / 2)
    }
  }

  // Plural-Räume expandieren
  const expandierteRaeume: RaumMit[] = []
  for (const raum of angereichert.raeume) {
    const name = raum.name || 'Raum'
    const mehrereAntwort = antworten[`raum_${name}_masse_mehrere`]

    if (raum.anzahl && raum.anzahl > 1) {
      // Individuelle Maße pro Zimmer aus masse_mehrere
      const massenArray: Array<{ laenge: number; breite: number }> = []
      if (mehrereAntwort && Array.isArray(mehrereAntwort.wert)) {
        // wert ist [l1, b1, l2, b2, ...] flach
        const flat = mehrereAntwort.wert as number[]
        for (let i = 0; i < flat.length; i += 2) {
          if (flat[i] && flat[i + 1]) massenArray.push({ laenge: flat[i], breite: flat[i + 1] })
        }
      }
      for (let i = 0; i < raum.anzahl; i++) {
        const masse = massenArray[i]
        expandierteRaeume.push({
          ...raum,
          name: `${name} ${i + 1}`,
          laenge: masse?.laenge ?? raum.laenge,
          breite: masse?.breite ?? raum.breite,
          flaeche: masse ? round2(masse.laenge * masse.breite) : raum.flaeche,
          anzahl: undefined,
          vage: false,
          vage_quelle: 'nutzer_antwort',
        })
      }
    } else {
      expandierteRaeume.push(raum)
    }
  }

  angereichert.raeume = expandierteRaeume
  return angereichert
}
