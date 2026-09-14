export const AKTIVE_GEWERKE = [
  {
    id: 'maler',
    name: 'Maler & Lackierer',
    emoji: '🖌',
    beschreibung: 'Streichen, Spachteln, Tapezieren, Lackieren',
    farbe: '#D9A400',
    // CoS-E-052 (14.09.2026): Hier stand `positionen_count: 164`. Die Zahl
    // wurde **nirgends angezeigt** — sie stand nur hier und stimmte mit
    // nichts überein: Der Basiskatalog liefert für dieses Gewerk eine andere
    // Zahl, die Vorlagen eine dritte. Eine Zahl, die niemand rendert und
    // niemand nachrechnet, wird trotzdem geglaubt — sie ist als Tatsache in
    // ein Ticket gewandert. Wer die Zahl braucht, holt sie mit
    // `positionenImKatalog(id)` aus `default-price-selection.ts`, wo der
    // Katalog ohnehin liegt.
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
    farbe: '#D9A400',
    // CoS-E-052 (14.09.2026): Hier stand `positionen_count: 177`. Die Zahl
    // wurde **nirgends angezeigt** — sie stand nur hier und stimmte mit
    // nichts überein: Der Basiskatalog liefert für dieses Gewerk eine andere
    // Zahl, die Vorlagen eine dritte. Eine Zahl, die niemand rendert und
    // niemand nachrechnet, wird trotzdem geglaubt — sie ist als Tatsache in
    // ein Ticket gewandert. Wer die Zahl braucht, holt sie mit
    // `positionenImKatalog(id)` aus `default-price-selection.ts`, wo der
    // Katalog ohnehin liegt.
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

// ── Mindestauftragswert (CoS + Sandy, 07.09.2026) ───────────────────────────
//
// Der Prüfmeister: *„Ein m²-Preis trägt nur, wenn die Fassade ohnehin bearbeitet
// wird. Wer nur die Außenleibungen streicht, verbringt einen halben Tag mit
// Gerüst, Abdecken und Wetter — für 1,60 m². Da ist nicht der Satz zu klein, da
// ist die Positionsform falsch."*
//
// Die Einstellung `companies.mindestauftragswert` gab es schon — sie wurde nur
// **nirgends gelesen**. In den Einstellungen stand sogar, bei Angeboten darunter
// erscheine eine Warnung; passiert ist nie etwas. Dieselbe Familie wie „X
// Positionen erkannt": Die Oberfläche verspricht, der Code schweigt.
//
// ── Was hier bewusst NICHT passiert ────────────────────────────────────────
// Kein stiller Aufschlag auf die m²-Preise. Head of Legal hat den ersten
// Entwurf des CoS genau daran korrigiert: Wird die Summe im Hintergrund
// angehoben, ist das Aufmaß nicht mehr nachrechenbar (dasselbe Problem wie
// VOB-007) und es entsteht ein § 5a-UWG-Risiko. Deshalb eine **eigene,
// benannte Zeile mit dem Differenzbetrag**, die der Handwerker vor dem
// Versenden sieht und entfernen kann — die Software setzt nichts, wofür am
// Ende er geradesteht, ohne es bewusst gewählt zu haben.
//
// Der Zeilentext ist Sandys Entscheidung: **„Anfahrt & Vorbereitung"**, nicht
// „Mindestauftragswert" oder „Kleinauftragszuschlag" — er beschreibt den
// echten Aufwand, statt nach Strafgebühr zu klingen.
//
// Der Schwellenwert bleibt eine **Betriebseinstellung**: Legal hat
// nachgerechnet, dass die Stundensätze regional zwischen 44 € (MV) und 90 €
// (BY/BW) liegen — mehr als doppelt so breit, wie ein fester Wert im Code
// sinnvoll abdecken kann.
//
// 0 heißt AUS, und 0 ist seit dem 14.09.2026 auch der Standard (Sandys
// Entscheidung M-2, TN-142). Vorher trug das Einstellungsformular 180 € als
// Vorschlag ins Feld und schrieb ihn beim Speichern mit — auch dann, wenn der
// Betrieb wegen einer ganz anderen Einstellung dort war. Manfred ist der Wert
// im Onboarding nie begegnet und stand trotzdem in seinen Angeboten:
// *„Das ist das Möbel-abdecken-Problem in neuem Gewand: die App entscheidet,
// ich unterschreib."* Die 180 € leben weiter — aber nur noch als Satz im
// Hilfetext, den der Handwerker lesen und selbst eintragen kann. Ein
// Orientierungswert, der sich selbst einträgt, ist kein Vorschlag mehr,
// sondern eine Entscheidung.
//
// Und die Sequenzierung, die der CoS zurecht angemahnt hat (erst die
// Leibungs-Einheit klären): Sie greift hier nicht. Diese Regel rechnet
// ausschließlich in EURO. Ob eine Leibungsposition in m² oder lfdm geführt
// wird, ändert die Angebotssumme nicht — die Kleinauftragslogik ist
// einheitenblind und muss bei einem Einheitenwechsel nicht angefasst werden.

/**
 * Orientierungswert für den Hilfetext — rund drei Arbeitsstunden.
 *
 * NUR für Text. Diese Zahl darf nirgends als Wert in ein Feld oder in die
 * Datenbank wandern; der Standard ist 0 (M-2). Der Name sagt das absichtlich:
 * Er hieß bis zum 14.09.2026 `…_VORSCHLAG` — und ein Vorschlag, der sich
 * selbst einträgt, war genau der Fehler.
 */
export const MINDESTAUFTRAGSWERT_ORIENTIERUNG = 180

/** Der Zeilentext auf dem Kundenangebot (Sandys Wortlaut, 07.09.2026). */
export const MINDESTAUFTRAG_BEZEICHNUNG = 'Anfahrt & Vorbereitung'

// ── Pauschalzeilen erkennen (CoS-E-041, 11.09.2026) ─────────────────────────
//
// Drei Zeilen entstehen nicht aus dem Diktat, sondern aus einer Einstellung:
// Kleinmaterial, An- und Abfahrt, Mindestauftragswert. Sie haben eine
// Eigenschaft gemeinsam, die man leicht übersieht: **keine von ihnen darf in
// die Bemessungsgrundlage einer anderen zählen.**
//
// Sonst passiert Folgendes: Die Kleinmaterial-Pauschale hebt die Summe über
// den Mindestauftragswert, dessen Zeile schrumpft daraufhin beim nächsten
// Durchlauf, die Summe fällt wieder — und der Handwerker sieht bei jedem
// Neuberechnen andere Zahlen, ohne etwas geändert zu haben. Bei der
// Mindestauftragszeile war das schon bedacht (sie zählte nicht in ihre
// eigene Grundlage); mit zwei weiteren Pauschalen braucht es eine
// gemeinsame Erkennung statt drei Einzelvergleiche.
//
// Bewusst EXAKTER Namensvergleich statt „enthält 'anfahrt'": Die
// Mindestauftragszeile heißt „Anfahrt & Vorbereitung", die Fahrtkosten-
// Pauschale „An- und Abfahrt" — eine Teilstring-Suche würde beide über einen
// Kamm scheren, und eine echte Arbeitsposition „Anfahrtsweg absichern" gleich
// mit. Die Namen sind konfigurierbar, deshalb werden die tatsächlich
// aufgelösten Bezeichnungen übergeben.

/**
 * Erkennt die aus Einstellungen erzeugten Pauschalzeilen.
 * `namen` sind die für diesen Betrieb aufgelösten Bezeichnungen.
 */
export function istPauschalZeile(titel: string | null | undefined, namen: string[]): boolean {
  const t = (titel ?? '').trim().toLocaleLowerCase('de-DE')
  if (!t) return false
  return namen.some(n => n.trim().toLocaleLowerCase('de-DE') === t)
}

/** Die Bezeichnungen aller Pauschalzeilen dieses Betriebs — eine Stelle. */
export function pauschalZeilenNamen(
  gewerk: string | null | undefined,
  kleinConfig?: Partial<KleinmaterialConfig> | null,
  anfahrtConfig?: Partial<AnfahrtConfig> | null,
): string[] {
  const kleinBasis = (gewerk && KLEINMATERIAL_CONFIG[gewerk]) || null
  return [
    MINDESTAUFTRAG_BEZEICHNUNG,
    kleinConfig?.bezeichnung ?? kleinBasis?.bezeichnung ?? 'Kleinmaterial und Verbrauchsmaterial',
    anfahrtConfig?.bezeichnung ?? ANFAHRT_DEFAULT.bezeichnung,
  ]
}

export interface MindestauftragsPosition {
  title: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  kategorie: string
}

/**
 * Die Differenz zum Mindestauftragswert als eigene Position — oder null, wenn
 * der Auftrag ihn ohnehin erreicht, kein Wert gesetzt ist oder noch gar nichts
 * berechnet wurde.
 *
 * `arbeitsSummeNetto` ist die Summe OHNE eine eventuell schon vorhandene
 * Mindestauftrags-Zeile. Sonst würde die Position sich selbst über die
 * Schwelle heben und beim nächsten Durchlauf verschwinden.
 */
export function mindestauftragsPosition(
  arbeitsSummeNetto: number,
  mindestauftragswert: number | null | undefined,
): MindestauftragsPosition | null {
  const schwelle = mindestauftragswert ?? 0
  if (!(schwelle > 0)) return null
  // Ein leeres Angebot ist kein Kleinauftrag, sondern ein leeres Angebot.
  if (!(arbeitsSummeNetto > 0)) return null
  if (arbeitsSummeNetto >= schwelle) return null
  const differenz = Math.round((schwelle - arbeitsSummeNetto) * 100) / 100
  if (differenz <= 0) return null
  return {
    title: MINDESTAUFTRAG_BEZEICHNUNG,
    description: `Anfahrt, Auf- und Abbau sowie Schutzmaßnahmen — bei kleinen Aufträgen fällt dieser `
      + `Aufwand unabhängig von der Fläche an. Mindestauftragswert ${schwelle.toLocaleString('de-DE')} € netto.`,
    quantity: 1,
    unit: 'Pauschale',
    unit_price: differenz,
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
