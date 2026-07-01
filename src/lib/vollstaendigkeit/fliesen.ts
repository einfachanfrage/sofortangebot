import type { BerechnetePosition } from '../mengen/types'
import { erkenneFliesenBereich, pruefeVerfugungPflicht, pruefeEntsorgung, pruefeFugenersatz } from './fliesen-basis'
import { pruefeAbdichtung, pruefeBodengleicheDusche } from './fliesen-nassbereich'
import { pruefeDiagonalFliesen, pruefeMosaik, pruefeNaturstein } from './fliesen-sonder'

export function pruefeFliesen(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const bereich = erkenneFliesenBereich(ergaenzt, lower)

  pruefeVerfugungPflicht(ergaenzt, fehlende, bereich)
  pruefeAbdichtung(ergaenzt, fehlende, lower, bereich)
  pruefeBodengleicheDusche(ergaenzt, fehlende, lower)
  pruefeEntsorgung(ergaenzt, fehlende, lower)
  pruefeFugenersatz(ergaenzt, fehlende, lower)
  pruefeDiagonalFliesen(ergaenzt, fehlende, lower)
  pruefeMosaik(ergaenzt, fehlende, lower)
  pruefeNaturstein(ergaenzt, fehlende, lower)
}
