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
    id: 'fliesen',
    name: 'Fliesen & Naturstein',
    emoji: '🪟',
    beschreibung: 'Böden, Wände, Bäder, Terrassen, Naturstein',
    farbe: '#2C2C2C',
    positionen_count: 91,
    typische_auftraege: [
      'Bad neu fliesen',
      'Küchenspiegel',
      'Terrassenfliesen',
      'Natursteinarbeiten',
    ],
  },
  {
    id: 'trockenbau',
    name: 'Trockenbau',
    emoji: '🧱',
    beschreibung: 'Rigips, Ständerwände, Unterdecken, Verkleidungen',
    farbe: '#2C2C2C',
    positionen_count: 88,
    typische_auftraege: [
      'Trennwände einziehen',
      'Unterdecke absenken',
      'Dachschräge verkleiden',
      'Vorwandinstallation',
    ],
  },
  {
    id: 'boden_parkett',
    name: 'Bodenbeläge & Parkett',
    emoji: '🏠',
    beschreibung: 'Laminat, Vinyl, Parkett, Teppich, Kork, Linoleum',
    farbe: '#2C2C2C',
    positionen_count: 101,
    typische_auftraege: [
      'Parkett verlegen',
      'Laminat verlegen',
      'Vinyl / Designboden',
      'Teppich verlegen',
    ],
  },
  {
    id: 'sanitaer_heizung',
    name: 'Sanitär & Heizung',
    emoji: '🚿',
    beschreibung: 'Bad, WC, Heizung, Rohrleitungen, Armaturen',
    farbe: '#2C2C2C',
    positionen_count: 192,
    typische_auftraege: [
      'Bad komplett erneuern',
      'Heizung modernisieren',
      'Rohre erneuern',
      'Armaturen tauschen',
    ],
  },
  {
    id: 'elektro',
    name: 'Elektro',
    emoji: '⚡',
    beschreibung: 'Leitungen, Steckdosen, Verteilung, Smart Home',
    farbe: '#2C2C2C',
    positionen_count: 175,
    typische_auftraege: [
      'Wohnung neu verkabeln',
      'Unterverteilung',
      'Steckdosen nachrüsten',
      'Smart Home',
    ],
  },
] as const

export type AktivesGewerk = (typeof AKTIVE_GEWERKE)[number]

export const ALLE_GEWERKE_IDS = AKTIVE_GEWERKE.map(g => g.id)

// Gewerke-IDs die in der Positionsdatenbank existieren,
// aber im UI nicht angezeigt werden.
export const INAKTIVE_GEWERKE_IDS = [
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
// (Die Positionsdatenbank nutzt Kategorie-Präfixe wie "Maler –", "Fliesen –" etc.)
export const GEWERK_KATEGORIE_PREFIXE: Record<string, string[]> = {
  maler:            ['Maler'],
  fliesen:          ['Fliesen'],
  trockenbau:       ['Trockenbau'],
  boden_parkett:    ['Boden'],
  sanitaer_heizung: ['SHK'],
  elektro:          ['Elektro'],
}
