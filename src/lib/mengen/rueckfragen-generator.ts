export type RueckfrageTyp =
  | 'masse_einzel'
  | 'flaeche_einzel'
  | 'masse_mehrere'
  | 'anzahl'
  | 'laenge'
  | 'hoehe'
  | 'ja_nein'

export interface SchnellAntwort {
  label: string
  wert: number | number[]
  einheit: string
}

export interface RueckfrageItem {
  id: string
  frage: string
  kontext: string
  typ: RueckfrageTyp
  schnell_antworten: SchnellAntwort[]
  einheit?: string
  plural_count?: number
}

function artikel(name: string): string {
  const weiblich = ['küche', 'toilette', 'dusche', 'treppe', 'garage', 'terrasse']
  const sachlich = ['bad', 'zimmer', 'wohnzimmer', 'schlafzimmer', 'badezimmer', 'esszimmer', 'arbeitszimmer', 'kinderzimmer']
  const lower = name.toLowerCase()
  if (weiblich.some(w => lower.includes(w))) return 'die'
  if (sachlich.some(s => lower.includes(s))) return 'das'
  return 'den'
}

function extraiereAnzahl(text: string): number {
  if (text.includes('beide') || text.includes('zwei')) return 2
  if (text.includes('drei')) return 3
  if (text.includes('vier')) return 4
  const m = text.match(/(\d+)/)
  return m ? parseInt(m[1]) : 2
}

const SCHNELL_MASSE = [
  { label: '3×4 m', wert: [3, 4], einheit: 'm' },
  { label: '4×5 m', wert: [4, 5], einheit: 'm' },
  { label: '5×6 m', wert: [5, 6], einheit: 'm' },
  { label: '5×7 m', wert: [5, 7], einheit: 'm' },
] satisfies SchnellAntwort[]

const SCHNELL_HOEHEN: SchnellAntwort[] = [
  { label: '2,40 m', wert: 2.4, einheit: 'm' },
  { label: '2,50 m', wert: 2.5, einheit: 'm' },
  { label: '2,60 m', wert: 2.6, einheit: 'm' },
  { label: '2,80 m', wert: 2.8, einheit: 'm' },
  { label: '3,00 m', wert: 3.0, einheit: 'm' },
]

const SCHNELL_ANZAHL: SchnellAntwort[] = [
  { label: '1', wert: 1, einheit: 'Stück' },
  { label: '2', wert: 2, einheit: 'Stück' },
  { label: '3', wert: 3, einheit: 'Stück' },
  { label: '4', wert: 4, einheit: 'Stück' },
  { label: '5', wert: 5, einheit: 'Stück' },
]

export function generiereRueckfragen(extraktion: {
  raeume?: Array<{
    name?: string
    laenge?: number | null
    breite?: number | null
    hoehe?: number | null
    flaeche?: number | null
    vage?: boolean
    vage_typ?: string | null
    vage_beschreibung?: string | null
  }>
}): RueckfrageItem[] {
  const fragen: RueckfrageItem[] = []

  for (const raum of extraktion.raeume ?? []) {
    if (!raum.vage) continue

    const name = raum.name || 'Raum'
    const beschreibung = raum.vage_beschreibung || name
    const art = artikel(name)

    switch (raum.vage_typ) {
      case 'raum_ohne_masse': {
        const istPlural =
          beschreibung.includes('beide') ||
          beschreibung.includes('alle') ||
          beschreibung.includes('Schlafzimmer') ||
          beschreibung.includes('zimmer') && (beschreibung.includes('beide') || beschreibung.includes('alle'))

        if (istPlural) {
          const count = extraiereAnzahl(beschreibung)
          fragen.push({
            id: `raum_${name}_masse_mehrere`,
            frage: `Welche Maße haben ${beschreibung}?`,
            kontext: beschreibung,
            typ: 'masse_mehrere',
            plural_count: count,
            schnell_antworten: SCHNELL_MASSE,
            einheit: 'm',
          })
        } else {
          fragen.push({
            id: `raum_${name}_masse`,
            frage: `Wie groß ist ${art} ${name}?`,
            kontext: beschreibung,
            typ: 'masse_einzel',
            schnell_antworten: SCHNELL_MASSE,
            einheit: 'm',
          })
        }
        break
      }

      case 'plural_ohne_zahl':
        fragen.push({
          id: `plural_${name}_anzahl`,
          frage: `Wie viele ${name} sind es?`,
          kontext: beschreibung,
          typ: 'anzahl',
          schnell_antworten: SCHNELL_ANZAHL,
          einheit: 'Stück',
        })
        break

      case 'menge_unbekannt':
        // Höhe fehlt aber Länge/Breite vorhanden
        if (raum.laenge && raum.breite && !raum.hoehe) {
          fragen.push({
            id: `raum_${name}_hoehe`,
            frage: `Wie hoch ist ${art} ${name}?`,
            kontext: `${raum.laenge}×${raum.breite} m, Höhe fehlt`,
            typ: 'hoehe',
            schnell_antworten: SCHNELL_HOEHEN,
            einheit: 'm',
          })
        }
        break

      case 'referenz_ohne_kontext':
        fragen.push({
          id: `raum_${name}_masse`,
          frage: `Wie groß ist ${art} ${name}?`,
          kontext: beschreibung,
          typ: 'masse_einzel',
          schnell_antworten: SCHNELL_MASSE,
          einheit: 'm',
        })
        break
    }
  }

  return fragen
}
