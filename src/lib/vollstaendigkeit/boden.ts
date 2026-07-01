import type { BerechnetePosition } from '../mengen/types'
import { erkenneBelag, pruefeBodenBasis } from './boden-basis'
import { pruefeAltbelag, pruefeFeuchtigkeitssperre, pruefeSockelleisten, pruefeUebergangsprofil } from './boden-vorarbeiten'
import {
  pruefeDiagonalBoden, pruefeFBHBoden, pruefeParkettSchleifen, pruefeTreppenBoden,
  pruefeFugenVerschweissen, pruefeTrittschalldaemmung, pruefeStosskanten,
  pruefeFischgraet, pruefeVollflaechigeVerklebung,
} from './boden-sonder'

export function pruefeBoden(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const belag = erkenneBelag(lower)
  if (!belag) return

  const { nurOhneSockel } = pruefeBodenBasis(ergaenzt, fehlende, lower, belag)
  pruefeAltbelag(ergaenzt, fehlende, lower)
  pruefeFeuchtigkeitssperre(ergaenzt, fehlende, lower)
  pruefeFischgraet(ergaenzt, fehlende, lower)
  pruefeVollflaechigeVerklebung(ergaenzt, fehlende, lower)
  pruefeSockelleisten(ergaenzt, fehlende, lower, nurOhneSockel)
  pruefeUebergangsprofil(ergaenzt, fehlende, lower)
  pruefeDiagonalBoden(ergaenzt, fehlende, lower)
  pruefeFBHBoden(ergaenzt, fehlende, lower)
  pruefeParkettSchleifen(ergaenzt, fehlende, lower)
  pruefeFugenVerschweissen(ergaenzt, fehlende, lower)
  pruefeTrittschalldaemmung(ergaenzt, fehlende, lower)
  pruefeStosskanten(ergaenzt, fehlende, lower)
  pruefeTreppenBoden(ergaenzt, fehlende, lower)
}
