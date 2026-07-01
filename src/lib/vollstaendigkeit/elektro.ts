import type { BerechnetePosition } from '../mengen/types'
import { erkenneElektroTrigger, erkenneUPAP, pruefeSteckdosen, pruefeSchalter, pruefeLeitungen } from './elektro-basis'
import { pruefeWallbox, pruefeSmartHome, pruefeUnterverteilung, pruefeHerdanschluss } from './elektro-spezial'

export function pruefeElektro(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  if (!erkenneElektroTrigger(lower)) return

  const upAp = erkenneUPAP(lower)
  pruefeSteckdosen(ergaenzt, fehlende, lower, upAp)
  pruefeSchalter(ergaenzt, fehlende, lower, upAp)
  pruefeLeitungen(ergaenzt, fehlende, lower)
  pruefeWallbox(ergaenzt, fehlende, lower)
  pruefeSmartHome(ergaenzt, fehlende, lower)
  pruefeUnterverteilung(ergaenzt, fehlende, lower)
  pruefeHerdanschluss(ergaenzt, fehlende, lower)
}
