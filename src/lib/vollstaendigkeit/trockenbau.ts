import type { BerechnetePosition } from '../mengen/types'
import { erkenneTrockenbauTyp, pruefeStaenderwerk, pruefeBeplankung, pruefeSpachtelarbeitenTb } from './trockenbau-basis'
import { pruefeBrandschutzTb, pruefeSchallschutzTb, pruefeDaemmungTb } from './trockenbau-sonder'

export function pruefeTrockenbau(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const typ = erkenneTrockenbauTyp(lower)
  if (!typ.hatWand && !typ.hatDecke) return

  pruefeStaenderwerk(ergaenzt, fehlende)
  pruefeBeplankung(ergaenzt, fehlende, lower)
  pruefeSpachtelarbeitenTb(ergaenzt, fehlende)
  pruefeBrandschutzTb(ergaenzt, fehlende, lower)
  pruefeSchallschutzTb(ergaenzt, fehlende, lower)
  pruefeDaemmungTb(ergaenzt, fehlende, lower)
}
