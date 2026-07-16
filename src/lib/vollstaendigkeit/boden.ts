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
  // Belag kann null sein (Whisper verstümmelt "Klick-Vinyl" → "Glykvenyl"). Statt am
  // Belag-Wort zu hängen: Ist es überhaupt ein Boden-Auftrag? Erkennbar an Belag,
  // Altbelag-Demontage oder einer bereits erzeugten Verlegen-/Boden-Position.
  const belag = v.belag
  const istBodenAuftrag = belag != null || v.altbelagEntfernen
    || ergaenzt.some(p => /verlegen|bodenbelag|parkett|laminat|v[ie]nyl|teppich|estrich/i.test(p.beschreibung))
  if (!istBodenAuftrag) return

  // Reiner Abschleif-/Refinish-Auftrag: Parkett wird geschliffen, aber KEIN neuer
  // Boden gelegt (kein Verlegen). Dann keine Untergrundvorbereitung/Ausgleich und
  // keine Sockelleisten-Montage — die alten bleiben dran.
  const istRefinish = ergaenzt.some(p => /parkett\s*schleifen|dielen\s*schleifen|holzboden\s*schleifen/i.test(p.beschreibung))
    && !ergaenzt.some(p => /verlegen|verkleben/i.test(p.beschreibung))

  const { nurOhneSockel } = pruefeBodenBasis(ergaenzt, fehlende, lower, belag, v, istRefinish)
  pruefeAltbelag(ergaenzt, fehlende, lower, v)
  pruefeFeuchtigkeitssperre(ergaenzt, fehlende, lower)
  pruefeFischgraet(ergaenzt, fehlende, lower, v)
  pruefeVollflaechigeVerklebung(ergaenzt, fehlende, lower)
  // Bei Refinish nur Sockelleisten, wenn explizit genannt
  if (!istRefinish || lower.includes('sockelleiste')) {
    pruefeSockelleisten(ergaenzt, fehlende, lower, nurOhneSockel)
  }
  pruefeUebergangsprofil(ergaenzt, fehlende, lower)
  pruefeDiagonalBoden(ergaenzt, fehlende, lower)
  pruefeFBHBoden(ergaenzt, fehlende, lower)
  pruefeParkettSchleifen(ergaenzt, fehlende, lower, v)
  pruefeFugenVerschweissen(ergaenzt, fehlende, lower)
  pruefeTrittschalldaemmung(ergaenzt, fehlende, lower)
  pruefeStosskanten(ergaenzt, fehlende, lower)
  pruefeTreppenBoden(ergaenzt, fehlende, lower, v)
}
