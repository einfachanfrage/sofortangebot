import type { BerechnetePosition } from '../mengen/types'
import { erkenneSanitaerObjekte, pruefeDemontage, pruefeSilikon } from './sanitaer-basis'
import { pruefeHeizkörper, pruefeBadKomplett } from './sanitaer-heizung'
import { pruefeWaermepumpe, pruefeBoiler, pruefeFBHSanitaer } from './sanitaer-sonder'

export function pruefeSanitaer(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const objekte = erkenneSanitaerObjekte(lower)
  pruefeDemontage(ergaenzt, fehlende, lower, objekte)
  pruefeSilikon(ergaenzt, fehlende, objekte)
  pruefeHeizkörper(ergaenzt, fehlende, lower)
  pruefeBadKomplett(ergaenzt, fehlende, lower)
  pruefeWaermepumpe(ergaenzt, fehlende, lower)
  pruefeBoiler(ergaenzt, fehlende, lower)
  pruefeFBHSanitaer(ergaenzt, fehlende, lower)
}
