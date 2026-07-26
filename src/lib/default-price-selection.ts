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
