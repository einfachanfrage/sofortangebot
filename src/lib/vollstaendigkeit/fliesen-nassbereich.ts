import type { BerechnetePosition } from '../mengen/types'
import { hat, add } from './helpers'
import type { FliesenBereich } from './fliesen-basis'

export function pruefeAbdichtung(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  bereich: FliesenBereich,
): void {
  const hatNass =
    lower.includes('bad') ||
    lower.includes('dusche') ||
    lower.includes('nassbereich') ||
    lower.includes('wc') ||
    lower.includes('badezimmer') ||
    lower.includes('feuchtraum') ||
    lower.includes('nassraum')
  if (!hatNass) return
  if (hat(ergaenzt, 'abdicht', 'verbundabdicht')) return

  if (!bereich.nurWand && bereich.hatBoden) {
    fehlende.push('Abdichtung Boden (Nassbereich)')
  }
  if (!bereich.nurBoden && bereich.hatWand) {
    fehlende.push('Abdichtung Wand (Nassbereich)')
  }
  if (!bereich.hatBoden && !bereich.hatWand) {
    fehlende.push('Verbundabdichtung')
  }
}

export function pruefeBodengleicheDusche(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  if (!lower.includes('bodengleich')) return
  if (hat(ergaenzt, 'bodengleich')) return
  add(ergaenzt, fehlende, 'Bodengleiche Dusche einbauen')
}
