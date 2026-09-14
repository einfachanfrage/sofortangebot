import { DEFAULT_PRICES } from '@/lib/default-prices'
import { GEWERK_KATEGORIE_PREFIXE } from '@/lib/gewerke-config'

// Dieselbe Zuordnung stand bisher zweimal im Code — hier und als
// `GEWERK_KATEGORIE_PREFIXE` in `gewerke-config.ts`. Die beiden waren
// auseinandergelaufen: Diese Liste kannte `fliesen` und `sanitaer_heizung`
// NICHT, also genau zwei der sechs Gewerke, die die Extraktion überhaupt
// vergeben darf. Folge: bei einem Fliesen- oder SHK-Auftrag griff der
// Gewerke-Filter vor dem Preis-Matcher gar nicht (`praefixe?.length` leer →
// "passt zu allem"), und bei Positionen, die in mehreren Gewerken denselben
// Titel tragen (Anfahrt, Kleinstauftrag, Möbel rücken …), gewann der
// alphabetisch erste Katalogeintrag — praktisch immer "Abbruch".
// Jetzt ist die kanonische Liste die Basis; hier stehen nur noch die
// zusätzlichen Alt-/Onboarding-IDs, die es dort nicht gibt.
const KATEGORIE_PRAEFIXE: Record<string, string[]> = {
  ...GEWERK_KATEGORIE_PREFIXE,
  malerarbeiten: ['Maler'],
  maler_fassade: ['Maler'],
  fliesenleger: ['Fliesen'],
  'bodenbeläge': ['Boden'],
  putz_stuck: ['Putz'],
  estrich: ['Estrich'],
  elektro: ['Elektro'],
  'sanitär': ['SHK', 'Sanitär'],
  schreiner: ['Schreiner', 'Tischler'],
  dachdecker: ['Dach'],
  'fenster_türen': ['Fenster', 'Türen'],
  'entrümpelung': ['Entrümpelung'],
  garten: ['Garten'],
  reinigung: ['Reinigung'],
  abbruch: ['Abbruch'],
}

export function preisKategoriePasstZuGewerk(category: string, gewerk?: string | null): boolean {
  if (!gewerk || gewerk === 'allrounder') return true
  const praefixe = KATEGORIE_PRAEFIXE[gewerk]
  if (!praefixe?.length) return true
  const kategorie = category.toLocaleLowerCase('de-DE')
  return praefixe.some(praefix => kategorie.startsWith(praefix.toLocaleLowerCase('de-DE')))
}

export function standardpreiseFuerGewerke(gewerke: string[]) {
  if (gewerke.length === 0 || gewerke.includes('allrounder')) return DEFAULT_PRICES
  const praefixe = new Set(gewerke.flatMap(gewerk => KATEGORIE_PRAEFIXE[gewerk] ?? []))
  return DEFAULT_PRICES.filter(preis => [...praefixe].some(praefix =>
    preis.category.toLocaleLowerCase('de-DE').startsWith(praefix.toLocaleLowerCase('de-DE'))
  ))
}

// Head of Product Engineering (2026-08-19, PM-016): DEFAULT_PRICES-Einträge
// haben zwei unterschiedliche Objekt-Formen — normale Positionen haben nur
// {category, title, unit, unit_price}, Erschwerniszuschlag-Positionen haben
// zusätzlich {ist_erschwerniszuschlag, erschwerniszuschlag_fuer, zuschlag_typ,
// vob_norm, din_normen}. Supabase-js berechnet bei einem Array-Insert die
// Spaltenliste als Vereinigung aller Objekt-Keys im Batch (?columns=... an
// PostgREST) — Objekten, denen ein Key fehlt, wird dafür NULL statt des
// Tabellen-Defaults eingefügt. Ein Batch, der beide Formen mischt (praktisch
// immer der Fall, da jedes Gewerk auch Zuschlag-Positionen enthält), lässt
// darum den KOMPLETTEN Insert mit "null value in column
// "ist_erschwerniszuschlag" violates not-null constraint" scheitern — live
// gefunden über den Fehler "Die Standardpreise konnten nicht vollständig
// ergänzt werden." auf /preise, und (rückblickend über die Postgres-Logs
// bestätigt) derselbe Grund, warum "Lisa Schein Malerbetrieb" schon beim
// Onboarding nur 5 generische Posten statt eines Basis-Katalogs bekam.
// Fix: jede Zeile bekommt explizit alle Spalten mit denselben Keys
// (fehlende optionale Felder als null bzw. false), damit die von
// Supabase-js berechnete Spaltenliste nie zwischen Zeilen variiert.
export function zuPriceItemRows(preise: typeof DEFAULT_PRICES, companyId: string) {
  return preise.map(p => ({
    company_id: companyId,
    category: p.category,
    title: p.title,
    unit: p.unit,
    unit_price: p.unit_price,
    vob_norm: p.vob_norm ?? null,
    din_normen: p.din_normen ?? null,
    ist_erschwerniszuschlag: p.ist_erschwerniszuschlag ?? false,
    erschwerniszuschlag_fuer: p.erschwerniszuschlag_fuer ?? null,
    zuschlag_typ: p.zuschlag_typ ?? null,
  }))
}

/**
 * Eine Zeile, ein Preis — der Schlüssel, der eine Katalogzeile identifiziert.
 *
 * CoS-E-052: Bis zum 14.09.2026 gab es beim Onboarding ZWEI Preisquellen, die
 * beide in `price_items` schrieben: den Basis-Katalog (`DEFAULT_PRICES`,
 * gefiltert nach Gewerk) und die Onboarding-Vorlagen (`GEWERK_PREISE`), in
 * denen der Handwerker seine eigenen Zahlen eintippt. 41 der 83 Maler-Vorlagen
 * tragen denselben Titel wie eine Basiszeile — sie landeten als ZWEITE Zeile
 * daneben.
 *
 * Und dann entschied nichts mehr. Der Matcher nimmt bei Gleichstand den
 * ersten Treffer (`score > bestScore`), geladen wird mit
 * `.order('category').order('title')` — bei identischer Kategorie UND
 * identischem Titel gibt Postgres keine definierte Reihenfolge. Ob der
 * Handwerker seinen eingetippten Preis oder den Marktpreis im Angebot sieht,
 * wäre damit von Abfrage zu Abfrage offen gewesen. Das ist Manfreds
 * „Preise werden ausgewürfelt" (TN-094) — diesmal wirklich gewürfelt.
 *
 * Passiert ist es bisher nicht, aus einem unschönen Grund: Die Vorlagen
 * wurden wegen der falschen Gewerk-Kennungen nie gefunden, Manfred bekam
 * fünf Felder statt 83. Der erste Teil von CoS-E-052 (die Zuordnungstabelle)
 * hätte die Falle also erst scharf gemacht. Deshalb gehört dieser Teil davor,
 * nicht danach.
 *
 * Die Lösung ist nicht Entdoppeln nach dem Einfügen, sondern gar nicht erst
 * zwei Zeilen erzeugen: Der Basis-Katalog liefert die Zeilen, die eigenen
 * Zahlen überschreiben den Preis darin. Siehe `mischeEigenePreise`.
 */
export function preisSchluessel(p: { category: string; title: string; unit: string }): string {
  return `${p.category}::${p.title}::${p.unit}`
}

export interface EigenerPreis {
  category: string
  title: string
  unit: string
  unit_price: number
}

/**
 * Legt die im Onboarding eingetippten Preise auf den Basis-Katalog.
 *
 * Gibt zwei Listen zurück:
 * - `zeilen`: der Basis-Katalog, in dem jede Zeile, für die der Handwerker
 *   eine eigene Zahl genannt hat, DIESE Zahl trägt.
 * - `zusaetzlich`: seine Einträge, zu denen es im Basis-Katalog keine Zeile
 *   gibt — die kommen als neue Zeilen dazu.
 *
 * Zusammen ergibt das genau eine Zeile je (Kategorie, Titel, Einheit).
 */
export function mischeEigenePreise<T extends { category: string; title: string; unit: string; unit_price: number }>(
  basis: T[],
  eigene: EigenerPreis[],
): { zeilen: T[]; zusaetzlich: EigenerPreis[] } {
  const eigenePreise = new Map(eigene.map(e => [preisSchluessel(e), e.unit_price]))
  const imBasis = new Set(basis.map(preisSchluessel))

  const zeilen = basis.map(zeile => {
    const eigenerPreis = eigenePreise.get(preisSchluessel(zeile))
    return eigenerPreis === undefined ? zeile : { ...zeile, unit_price: eigenerPreis }
  })

  return { zeilen, zusaetzlich: eigene.filter(e => !imBasis.has(preisSchluessel(e))) }
}

/**
 * Wie viele Positionen bringt der Basiskatalog für dieses Gewerk mit?
 *
 * CoS-E-052: In `gewerke-config.ts` stand dafür eine feste Zahl (164 bzw.
 * 177). Sie wurde nirgends angezeigt und stimmte mit nichts überein — der
 * Katalog liefert andere Werte. Eine Zahl, die niemand nachrechnet, wird
 * trotzdem geglaubt; diese ist als Tatsache in ein Ticket gewandert.
 *
 * Deshalb hier und nicht dort: Der Katalog liegt in dieser Datei ohnehin auf
 * dem Tisch. `gewerke-config.ts` wird von der Oberfläche geladen und soll
 * nicht 440 KB Katalog mit in jedes Bündel ziehen.
 */
export function positionenImKatalog(gewerkId: string): number {
  return DEFAULT_PRICES.filter(p => preisKategoriePasstZuGewerk(p.category, gewerkId)).length
}
