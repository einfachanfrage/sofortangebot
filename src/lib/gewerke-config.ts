export const AKTIVE_GEWERKE = [
  {
    id: 'maler',
    name: 'Maler & Lackierer',
    emoji: '🖌',
    beschreibung: 'Streichen, Spachteln, Tapezieren, Lackieren',
    farbe: '#F5C400',
    positionen_count: 85,
    typische_auftraege: [
      'Wohnung streichen',
      'Fassade streichen',
      'Tapezieren',
      'Lackierarbeiten',
    ],
  },
  {
    id: 'boden_parkett',
    name: 'Bodenbeläge & Parkett',
    emoji: '🏠',
    beschreibung: 'Laminat, Vinyl, Parkett, Teppich, Kork, Linoleum',
    farbe: '#F5C400',
    positionen_count: 101,
    typische_auftraege: [
      'Parkett verlegen',
      'Laminat verlegen',
      'Vinyl / Designboden',
      'Teppich verlegen',
    ],
  },
] as const

export type AktivesGewerk = (typeof AKTIVE_GEWERKE)[number]

export const ALLE_GEWERKE_IDS = AKTIVE_GEWERKE.map(g => g.id)

// Gewerke-IDs die in der Positionsdatenbank existieren,
// aber im UI nicht angezeigt werden.
export const INAKTIVE_GEWERKE_IDS = [
  'fliesen',
  'trockenbau',
  'sanitaer_heizung',
  'elektro',
  'putz_stuck',
  'estrich',
  'schreiner_tischler',
  'dachdecker_zimmerer',
  'fenster_tueren',
  'entruempelung_transport',
  'galabau',
  'gebaeudereinigung',
  'abbruch_rueckbau',
  'fassade',
  'rohbau_maurer',
  'brandschutz',
] as const

// Mapping von alten gewerke.ts IDs → neue Config-IDs
// (Die Positionsdatenbank nutzt Kategorie-Präfixe wie "Maler –", "Boden –" etc.)
export const GEWERK_KATEGORIE_PREFIXE: Record<string, string[]> = {
  maler:            ['Maler'],
  fliesen:          ['Fliesen'],
  trockenbau:       ['Trockenbau'],
  boden_parkett:    ['Boden'],
  sanitaer_heizung: ['SHK'],
  elektro:          ['Elektro'],
}
