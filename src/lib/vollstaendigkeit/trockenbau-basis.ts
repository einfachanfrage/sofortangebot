import type { BerechnetePosition } from '../mengen/types'
import { hat, add } from './helpers'

export type TrockenbauTyp = {
  hatWand: boolean
  hatDecke: boolean
}

export function erkenneTrockenbauTyp(lower: string): TrockenbauTyp {
  return {
    hatWand:
      lower.includes('wand') ||
      lower.includes('ständerwand') ||
      lower.includes('staenderwand') ||
      lower.includes('rigips') ||
      lower.includes('gk') ||
      lower.includes('trockenbau') ||
      lower.includes('gipskarton'),
    hatDecke:
      lower.includes('abgehängte decke') ||
      lower.includes('abgehaengte decke') ||
      lower.includes('unterdecke') ||
      lower.includes('deckensegel') ||
      lower.includes('akustikdecke') ||
      (lower.includes('decke') && lower.includes('trockenbau')),
  }
}

export function pruefeStaenderwerk(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
): void {
  if (hat(ergaenzt, 'ständer', 'staender', 'unterkonstruktion')) return
  add(ergaenzt, fehlende, 'Ständerwerk')
}

export function pruefeBeplankung(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): { lagen: number } {
  let lagen = 1
  if (
    lower.includes('zweilagig') ||
    lower.includes('2-lagig') ||
    lower.includes('doppelt beplankt') ||
    lower.includes('2 lagen') ||
    lower.includes('zweimal beplankt') ||
    lower.includes('doppelbeplankt')
  ) {
    lagen = 2
  }

  if (!hat(ergaenzt, 'beplankung', 'gipskarton verlegen', 'gk verlegen')) {
    const bez = lagen > 1 ? `GK-Beplankung ${lagen}-lagig` : 'GK-Beplankung 1-lagig'
    add(ergaenzt, fehlende, bez)
  }

  return { lagen }
}

export function pruefeSpachtelarbeitenTb(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
): void {
  if (hat(ergaenzt, 'spachtel')) return
  add(ergaenzt, fehlende, 'Spachtelarbeiten Q2')
}
