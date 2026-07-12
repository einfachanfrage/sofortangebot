import type { BerechnetePosition } from '../mengen/types'
import { hat, add, filtereArray } from './helpers'
import { erkenneScope, hatArbeit } from '../arbeiten-normalisierer'

// "nur X"-Filter: entfernt widersprechende Positionen aus der Engine-Liste
export function wendeNurXFilterAn(ergaenzt: BerechnetePosition[], lower: string): {
  nurDecke: boolean
  nurWaende: boolean
  nurBoden: boolean
} {
  // Scope zentral — deckt Flexionen (Wände) + Synonyme + "ohne Decke" ab
  const { nurWaende, nurDecke, nurBoden } = erkenneScope(lower)

  if (nurDecke) {
    filtereArray(ergaenzt, p => {
      const d = p.beschreibung.toLowerCase()
      return !d.includes('sockel') && !d.includes('wand')
    })
  }
  if (nurWaende) {
    filtereArray(ergaenzt, p => {
      const d = p.beschreibung.toLowerCase()
      const istBodenSchutz = d.includes('boden schütz') || d.includes('boden abkl') || d.includes('abdeck')
      return !d.includes('decke') && (!d.includes('boden') || istBodenSchutz)
    })
  }
  if (nurBoden) {
    filtereArray(ergaenzt, p => {
      const d = p.beschreibung.toLowerCase()
      return !d.includes('wand') && !d.includes('decke') && !d.includes('sockel')
    })
  }

  return { nurDecke, nurWaende, nurBoden }
}

// Streichen-Basis: Wand, Decke, Boden schützen, Sockel abkleben
export function pruefeStreichenBasis(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  nurDecke: boolean,
  nurWaende: boolean,
  nurBoden: boolean,
): void {
  if (!hatArbeit(lower, 'streichen')) return

  if (!nurDecke && !nurBoden && !hat(ergaenzt, 'wand', 'wandfläche')) add(ergaenzt, fehlende, 'Wandflächen streichen')
  if (!nurWaende && !nurBoden && !hat(ergaenzt, 'decke', 'deckenfläche')) add(ergaenzt, fehlende, 'Deckenfläche streichen')
  if (!nurDecke && !hat(ergaenzt, 'boden schütz', 'abdeck', 'abdecken')) add(ergaenzt, fehlende, 'Boden schützen / Abdecken')
  if (!nurDecke && !nurBoden && !hat(ergaenzt, 'sockel', 'abkleben')) add(ergaenzt, fehlende, 'Sockelleisten abkleben')
}

// Grundierung: Neubau/Erstanstrich triggert automatisch
export function pruefeGrundierung(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatGrundierung = hatArbeit(lower, 'grundieren') || lower.includes('tiefengrund')
    || lower.includes('neubau') || lower.includes('erstanstrich') || lower.includes('rohbau')

  if (!hatArbeit(lower, 'streichen') || !hatGrundierung) return
  if (hat(ergaenzt, 'grundier', 'voranstrich', 'tiefengrund')) return

  const wandPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
  if (wandPos) {
    ergaenzt.unshift({
      beschreibung: 'Voranstrich / Grundierung',
      menge: wandPos.menge,
      einheit: 'm²',
      konfidenz: 'high',
      berechnungsweg: `Gleiche Fläche wie Wandflächen (${wandPos.menge} m²)`,
      annahmen: [],
    })
  } else {
    add(ergaenzt, fehlende, 'Voranstrich / Grundierung')
  }
}
