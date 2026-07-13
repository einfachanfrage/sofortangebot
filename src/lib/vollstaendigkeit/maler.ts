import type { BerechnetePosition } from '../mengen/types'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'
import { wendeNurXFilterAn, pruefeStreichenBasis, pruefeGrundierung } from './maler-basis'
import { pruefeTuerenLackieren, pruefeFensterLackieren, pruefeHeizkLackieren } from './maler-lackieren'
import { pruefeBodenAbdecken, pruefeFliesenspiegel, pruefeLampenAbkleben, pruefeHeizkAbkleben, pruefeTreppenhausGelaender } from './maler-abkleben'
import {
  pruefeSchimmel, pruefeWasserflecken, pruefeFeuchtraum, pruefeAbwaschbar, pruefeChlor,
  pruefeBetonwand, pruefeKalkputz, pruefeDachschraege,
} from './maler-sonder'
import {
  pruefeErschwerniszuschlagHoehe, pruefeGraffiti, pruefeAltbau, pruefeDenkmalschutz,
  pruefeSpachteln, pruefeSpachtelarbeiten, pruefeEstrich, pruefeGaragenboden,
  pruefeGeruest, pruefeBewohnt, pruefeBalkon, pruefeHolzOelen, pruefeBrandschutzfarbe,
  pruefeStuckleisten, pruefeStuck, pruefeTuerrahmen,
} from './maler-extras'
import {
  pruefeSockelleistenLackieren, pruefeSockelleistenStreichen,
  pruefeTapeteWegDannStreich, pruefeTapezieren, pruefeFassade,
} from './maler-tapete'

export function pruefeMaler(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  transkript: string,
  positionen: BerechnetePosition[],
  verstaendnis: AuftragsVerstaendnis,
  meta?: { fensterAnzahl?: number; tuerenAnzahl?: number },
): void {
  const { nurDecke, nurWaende, nurBoden } = wendeNurXFilterAn(ergaenzt, verstaendnis)

  pruefeStreichenBasis(ergaenzt, fehlende, verstaendnis, nurDecke, nurWaende, nurBoden)
  pruefeGrundierung(ergaenzt, fehlende, verstaendnis, lower)

  pruefeTuerenLackieren(ergaenzt, lower, meta)
  pruefeFensterLackieren(ergaenzt, lower, meta)
  const hatHeizkLackierenFlag = pruefeHeizkLackieren(ergaenzt, lower)

  pruefeBodenAbdecken(ergaenzt, fehlende, lower)
  pruefeFliesenspiegel(ergaenzt, fehlende, lower)
  pruefeLampenAbkleben(ergaenzt, lower)
  pruefeErschwerniszuschlagHoehe(ergaenzt, lower)
  pruefeSockelleistenLackieren(ergaenzt, fehlende, lower)
  pruefeDachschraege(ergaenzt, fehlende, lower)
  pruefeStuckleisten(ergaenzt, fehlende, lower)
  pruefeGraffiti(ergaenzt, fehlende, lower)
  pruefeAltbau(ergaenzt, lower)
  pruefeSpachteln(ergaenzt, fehlende, lower)
  pruefeDenkmalschutz(ergaenzt, lower)
  pruefeStuck(ergaenzt, lower)
  pruefeBetonwand(ergaenzt, fehlende, lower)
  pruefeEstrich(ergaenzt, fehlende, lower)
  pruefeGaragenboden(ergaenzt, fehlende, lower)
  pruefeGeruest(ergaenzt, lower)
  pruefeHeizkAbkleben(ergaenzt, lower, hatHeizkLackierenFlag)
  pruefeBewohnt(ergaenzt, fehlende, lower)
  pruefeBalkon(ergaenzt, fehlende, lower)
  pruefeHolzOelen(ergaenzt, fehlende, lower)
  pruefeTreppenhausGelaender(ergaenzt, lower)
  const hatSchimmelFlag = pruefeSchimmel(ergaenzt, fehlende, lower)
  pruefeWasserflecken(ergaenzt, fehlende, lower, hatSchimmelFlag)
  pruefeFeuchtraum(ergaenzt, lower)
  pruefeAbwaschbar(ergaenzt, lower)
  pruefeChlor(ergaenzt, lower)
  pruefeBrandschutzfarbe(ergaenzt, fehlende, lower)
  pruefeKalkputz(ergaenzt, fehlende, lower)
  pruefeSpachtelarbeiten(ergaenzt, fehlende, lower)
  pruefeTuerrahmen(ergaenzt, lower)
  pruefeSockelleistenStreichen(ergaenzt, fehlende, lower)
  const hatTapeteWegFlag = pruefeTapeteWegDannStreich(ergaenzt, fehlende, lower)
  pruefeTapezieren(ergaenzt, fehlende, lower, transkript, positionen, hatTapeteWegFlag)
  pruefeFassade(ergaenzt, lower, transkript)
}
