import type { BerechnetePosition } from '../mengen/types'
import { hat, add } from './helpers'

export type FliesenBereich = {
  hatBoden: boolean
  hatWand: boolean
  nurBoden: boolean
  nurWand: boolean
}

export function erkenneFliesenBereich(ergaenzt: BerechnetePosition[], lower: string): FliesenBereich {
  const nurBoden = lower.includes('nur boden') || lower.includes('nur bodenfliesen')
  const nurWand = lower.includes('nur wand') || lower.includes('nur wandfliesen')
  return {
    hatBoden:
      hat(ergaenzt, 'bodenfliesen') ||
      lower.includes('bodenfliesen') ||
      lower.includes('boden fliesen') ||
      lower.includes('boden mit fliesen') ||
      lower.includes('fliesen am boden') ||
      lower.includes('fliesen auf dem boden'),
    hatWand:
      hat(ergaenzt, 'wandfliesen') ||
      lower.includes('wandfliesen') ||
      lower.includes('wand fliesen') ||
      lower.includes('fliesen an der wand') ||
      lower.includes('fliesen an die wand'),
    nurBoden,
    nurWand,
  }
}

export function pruefeVerfugungPflicht(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  bereich: FliesenBereich,
): void {
  if (hat(ergaenzt, 'verfug')) return

  // Verfugung ist immer Pflicht — direktes push statt add() um first-2-words-Kollision mit "boden" zu umgehen
  if (!bereich.nurWand && bereich.hatBoden) {
    fehlende.push('Verfugung Boden')
  }
  if (!bereich.nurBoden && bereich.hatWand) {
    fehlende.push('Verfugung Wand')
  }
  // Weder Boden noch Wand spezifiziert → allgemeine Verfugung
  if (!bereich.hatBoden && !bereich.hatWand) {
    fehlende.push('Verfugung')
  }
}

export function pruefeEntsorgung(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatEntfernen =
    lower.includes('entfern') ||
    lower.includes('fliesen raus') ||
    lower.includes('fliesen weg') ||
    lower.includes('abbrech') ||
    lower.includes('abschlage') ||
    lower.includes('alten fliesen')
  if (!hatEntfernen) return
  if (hat(ergaenzt, 'entsorg', 'abbruch', 'altfliesen entfernen')) return
  add(ergaenzt, fehlende, 'Entsorgung Altfliesen (Pauschal)')
}

export function pruefeFugenersatz(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatFugen =
    lower.includes('fugen erneuern') ||
    lower.includes('fugen ersetzen') ||
    lower.includes('verfugung erneuern') ||
    lower.includes('alte fugen')
  if (!hatFugen) return
  if (!hat(ergaenzt, 'fugen ausräumen', 'fugen erneuern')) {
    add(ergaenzt, fehlende, 'Fugen ausräumen (Flex / Fräse)')
    add(ergaenzt, fehlende, 'Neuverfugung')
  }
}
