export const AKTIVE_GEWERKE = [
  {
    id: 'maler',
    name: 'Maler & Lackierer',
    emoji: '🖌',
    beschreibung: 'Streichen, Spachteln, Tapezieren, Lackieren',
    farbe: '#F5C400',
    positionen_count: 164,
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

// ── Kleinmaterial-Konfiguration ──────────────────────────────────────────────

export interface KleinmaterialConfig {
  aktiv: boolean
  schwelle_eur: number
  betrag_eur: number
  bezeichnung: string
}

export const KLEINMATERIAL_CONFIG: Record<string, KleinmaterialConfig> = {
  maler:            { aktiv: true,  schwelle_eur: 200, betrag_eur: 25, bezeichnung: 'Kleinmaterial und Verbrauchsmaterial' },
  boden_parkett:    { aktiv: true,  schwelle_eur: 300, betrag_eur: 35, bezeichnung: 'Kleinmaterial und Verbrauchsmaterial' },
  fliesen:          { aktiv: true,  schwelle_eur: 300, betrag_eur: 30, bezeichnung: 'Kleinmaterial und Verbrauchsmaterial' },
  trockenbau:       { aktiv: true,  schwelle_eur: 250, betrag_eur: 25, bezeichnung: 'Kleinmaterial und Verbrauchsmaterial' },
  sanitaer_heizung: { aktiv: true,  schwelle_eur: 400, betrag_eur: 40, bezeichnung: 'Kleinmaterial und Verbrauchsmaterial' },
  elektro:          { aktiv: true,  schwelle_eur: 300, betrag_eur: 30, bezeichnung: 'Kleinmaterial und Verbrauchsmaterial' },
}

export function kleinmaterialPosition(
  gewerk: string | null | undefined,
  summeNetto: number,
  betriebsConfig?: Partial<KleinmaterialConfig> | null
): { title: string; description: string; quantity: number; unit: string; unit_price: number; kategorie: string } | null {
  if (!gewerk) return null
  const basis = KLEINMATERIAL_CONFIG[gewerk]
  if (!basis && !betriebsConfig) return null
  // Betriebs-Einstellungen aus companies.kleinmaterial_config überschreiben die Gewerk-Defaults
  const cfg: KleinmaterialConfig = {
    ...(basis ?? { aktiv: true, schwelle_eur: 200, betrag_eur: 25, bezeichnung: 'Kleinmaterial und Verbrauchsmaterial' }),
    ...(betriebsConfig ?? {}),
  }
  if (!cfg.aktiv || summeNetto < cfg.schwelle_eur) return null
  return {
    title: cfg.bezeichnung,
    description: '',
    quantity: 1,
    unit: 'Pauschale',
    unit_price: cfg.betrag_eur,
    kategorie: 'Kleinmaterial',
  }
}

// ── An- und Abfahrt-Konfiguration ───────────────────────────────────────────
// Anders als Kleinmaterial: keine Schwelle (Fahrtkosten hängen nicht von der
// Auftragsgröße ab) und standardmäßig AUS, da nicht jeder Betrieb sie berechnet.

export interface AnfahrtConfig {
  aktiv: boolean
  betrag_eur: number
  bezeichnung: string
}

export const ANFAHRT_DEFAULT: AnfahrtConfig = {
  aktiv: false,
  betrag_eur: 45,
  bezeichnung: 'An- und Abfahrt',
}

export function anfahrtPosition(
  betriebsConfig?: Partial<AnfahrtConfig> | null
): { title: string; description: string; quantity: number; unit: string; unit_price: number; kategorie: string } | null {
  const cfg: AnfahrtConfig = { ...ANFAHRT_DEFAULT, ...(betriebsConfig ?? {}) }
  if (!cfg.aktiv) return null
  return {
    title: cfg.bezeichnung,
    description: '',
    quantity: 1,
    unit: 'Pauschale',
    unit_price: cfg.betrag_eur,
    kategorie: 'Anfahrt',
  }
}

// ── Mapping von alten gewerke.ts IDs → neue Config-IDs
// (Die Positionsdatenbank nutzt Kategorie-Präfixe wie "Maler –", "Boden –" etc.)
export const GEWERK_KATEGORIE_PREFIXE: Record<string, string[]> = {
  maler:            ['Maler'],
  fliesen:          ['Fliesen'],
  trockenbau:       ['Trockenbau'],
  boden_parkett:    ['Boden'],
  sanitaer_heizung: ['SHK'],
  elektro:          ['Elektro'],
}
