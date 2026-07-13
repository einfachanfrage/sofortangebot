import type { BerechnetePosition } from '../mengen/types'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'
import { pruefeBodenBasis } from './boden-basis'
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
  v: AuftragsVerstaendnis,
): void {
  const belag = v.belag
  if (!belag) return

  const { nurOhneSockel } = pruefeBodenBasis(ergaenzt, fehlende, lower, belag, v)
  pruefeAltbelag(ergaenzt, fehlende, lower, v)
  pruefeFeuchtigkeitssperre(ergaenzt, fehlende, lower)
  pruefeFischgraet(ergaenzt, fehlende, lower, v)
  pruefeVollflaechigeVerklebung(ergaenzt, fehlende, lower)
  pruefeSockelleisten(ergaenzt, fehlende, lower, nurOhneSockel)
  pruefeUebergangsprofil(ergaenzt, fehlende, lower)
  pruefeDiagonalBoden(ergaenzt, fehlende, lower)
  pruefeFBHBoden(ergaenzt, fehlende, lower)
  pruefeParkettSchleifen(ergaenzt, fehlende, lower, v)
  pruefeFugenVerschweissen(ergaenzt, fehlende, lower)
  pruefeTrittschalldaemmung(ergaenzt, fehlende, lower)
  pruefeStosskanten(ergaenzt, fehlende, lower)
  pruefeTreppenBoden(ergaenzt, fehlende, lower, v)
}
