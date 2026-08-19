import { DEFAULT_PRICES } from '@/lib/default-prices'

const KATEGORIE_PRAEFIXE: Record<string, string[]> = {
  maler: ['Maler'],
  malerarbeiten: ['Maler'],
  maler_fassade: ['Maler'],
  trockenbau: ['Trockenbau'],
  fliesenleger: ['Fliesen'],
  'bodenbeläge': ['Boden'],
  boden_parkett: ['Boden'],
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
