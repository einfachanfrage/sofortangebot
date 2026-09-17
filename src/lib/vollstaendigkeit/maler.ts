import type { BerechnetePosition } from '../mengen/types'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'
import { wendeNurXFilterAn, pruefeStreichenBasis, pruefeGrundierung } from './maler-basis'
import { pruefeTuerenLackieren, pruefeFensterLackieren, pruefeHeizkLackieren } from './maler-lackieren'
import { pruefeBodenAbdecken, pruefeFliesenspiegel, pruefeLampenAbkleben, pruefeHeizkAbkleben, pruefeTreppenhausGelaender } from './maler-abkleben'
import {
  pruefeSchimmel, pruefeWasserflecken, pruefeFeuchtraum, pruefeAbwaschbar, pruefeChlor, pruefeNische,
  pruefeBetonwand, pruefeKalkputz, pruefeDachschraege,
} from './maler-sonder'
import {
  pruefeErschwerniszuschlagHoehe, pruefeErschwerniszuschlagUntergrund, pruefeGraffiti, pruefeAltbau, pruefeDenkmalschutz,
  pruefeSpachteln, pruefeSpachtelarbeiten, pruefeEstrich, pruefeGaragenboden,
  pruefeGeruest, pruefeBewohnt, pruefeBalkon, pruefeHolzOelen, pruefeBrandschutzfarbe,
  pruefeStaubschutzwand, pruefeBaustellenreinigung,
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
  meta?: {
    fensterAnzahl?: number
    tuerenAnzahl?: number
    /** CoS-E-058: Türen aus der Aufnahme (raeume[].tueren), Annahmen zählen nicht. */
    tuerenAusAufnahme?: number
    /** CoS-E-058: Fenster aus der Aufnahme (raeume[].fenster), Annahmen zählen nicht. */
    fensterAusAufnahme?: number
    raeume?: Array<{ name?: string; hoehe?: number | null }>
  },
): void {
  const { nurDecke, nurWaende, nurBoden } = wendeNurXFilterAn(ergaenzt, verstaendnis)

  pruefeStreichenBasis(ergaenzt, fehlende, verstaendnis, nurDecke, nurWaende, nurBoden, lower)
  pruefeGrundierung(ergaenzt, fehlende, verstaendnis, lower)

  pruefeTuerenLackieren(ergaenzt, lower, verstaendnis, meta)
  pruefeFensterLackieren(ergaenzt, lower, verstaendnis, meta)
  const hatHeizkLackierenFlag = pruefeHeizkLackieren(ergaenzt, fehlende, lower, verstaendnis)

  pruefeBodenAbdecken(ergaenzt, fehlende, lower)
  pruefeFliesenspiegel(ergaenzt, fehlende, lower)
  pruefeLampenAbkleben(ergaenzt, lower, verstaendnis)
  pruefeErschwerniszuschlagHoehe(ergaenzt, lower, meta?.raeume ?? [])
  pruefeSockelleistenLackieren(ergaenzt, fehlende, lower, verstaendnis)
  pruefeDachschraege(ergaenzt, fehlende, lower)
  pruefeStuckleisten(ergaenzt, fehlende, lower, verstaendnis)
  pruefeGraffiti(ergaenzt, fehlende, lower)
  pruefeAltbau(ergaenzt, lower)
  pruefeSpachteln(ergaenzt, fehlende, lower, verstaendnis)
  pruefeDenkmalschutz(ergaenzt, lower)
  pruefeStuck(ergaenzt, lower)
  pruefeBetonwand(ergaenzt, fehlende, lower)
  pruefeEstrich(ergaenzt, fehlende, lower)
  pruefeGaragenboden(ergaenzt, fehlende, lower)
  pruefeGeruest(ergaenzt, lower)
  pruefeHeizkAbkleben(ergaenzt, lower, verstaendnis, hatHeizkLackierenFlag)
  pruefeBewohnt(ergaenzt, fehlende, lower)
  // PM-090 / PM-109: gehören zur bewohnten Baustelle und stehen deshalb
  // direkt hinter ihr. Beide legen NUR Fehlt-Einträge an, keine Positionen —
  // die Reihenfolge ist damit für das Ergebnis gleichgültig.
  pruefeStaubschutzwand(ergaenzt, fehlende, lower)
  pruefeBaustellenreinigung(ergaenzt, fehlende, lower)
  pruefeBalkon(ergaenzt, fehlende, lower)
  pruefeHolzOelen(ergaenzt, fehlende, lower)
  pruefeTreppenhausGelaender(ergaenzt, lower, verstaendnis)
  const hatSchimmelFlag = pruefeSchimmel(ergaenzt, fehlende, lower)
  pruefeWasserflecken(ergaenzt, fehlende, lower, hatSchimmelFlag)
  pruefeFeuchtraum(ergaenzt, lower)
  pruefeAbwaschbar(ergaenzt, lower)
  pruefeChlor(ergaenzt, lower)
  pruefeBrandschutzfarbe(ergaenzt, fehlende, lower)
  pruefeKalkputz(ergaenzt, fehlende, lower)
  pruefeSpachtelarbeiten(ergaenzt, fehlende, lower, verstaendnis)
  // PM-011: MUSS hinter beiden Spachtel-Prüfungen stehen. Der Zuschlag
  // entfällt, wenn eine Vollflächenspachtelung im Angebot steht — und die
  // entsteht erst hier. Davor geprüft, hätte die Regel still nie gegriffen.
  pruefeErschwerniszuschlagUntergrund(ergaenzt, lower)
  pruefeTuerrahmen(ergaenzt, lower)
  pruefeSockelleistenStreichen(ergaenzt, fehlende, lower, verstaendnis)
  const hatTapeteWegFlag = pruefeTapeteWegDannStreich(ergaenzt, fehlende, verstaendnis)
  pruefeTapezieren(ergaenzt, fehlende, lower, transkript, positionen, hatTapeteWegFlag)
  pruefeFassade(ergaenzt, lower, transkript, verstaendnis)
  // PM-089 / PM-108: MUSS ganz hinten stehen. Die Regel prueft, ob im
  // Angebot ueberhaupt eine Wand gestrichen wird — das steht erst fest,
  // wenn alle Regeln durch sind (pruefeStreichenBasis legt an, die
  // nur-X-Filter nehmen wieder weg).
  pruefeNische(ergaenzt, fehlende, lower)
}
