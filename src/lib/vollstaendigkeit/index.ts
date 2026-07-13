import type { BerechnetePosition } from '../mengen/types'
import { baueVerstaendnis } from '../auftrags-verstaendnis'
import { pruefeMaler } from './maler'
import { pruefeFliesen } from './fliesen'
import { pruefeSanitaer } from './sanitaer'
import { pruefeTrockenbau } from './trockenbau'
import { pruefeBoden } from './boden'
import { pruefeElektro } from './elektro'

interface CheckErgebnis {
  fehlende: string[]
  positionen: BerechnetePosition[]
}

export function hat(positionen: BerechnetePosition[], ...begriffe: string[]): boolean {
  return positionen.some(p => p.beschreibung != null && begriffe.some(b => p.beschreibung.toLowerCase().includes(b)))
}

export function pruefeUndErgaenzeVollstaendigkeit(
  gewerk: string,
  positionen: BerechnetePosition[],
  transkript: string,
  meta?: { fensterAnzahl?: number; tuerenAnzahl?: number },
): CheckErgebnis {
  const lower = transkript.toLowerCase()
  const fehlende: string[] = []
  const ergaenzt: BerechnetePosition[] = [...positionen]

  // Typisierter Auftrags-Vertrag: EINMAL aus dem Transkript bauen (heute per
  // Normalisierer, Etappe 2: direkt von der KI). Downstream liest den Vertrag.
  const verstaendnis = baueVerstaendnis(transkript)

  if (gewerk === 'maler') {
    pruefeMaler(ergaenzt, fehlende, lower, transkript, positionen, verstaendnis, meta)
  }
  if (gewerk === 'fliesen') {
    pruefeFliesen(ergaenzt, fehlende, lower)
  }
  if (gewerk === 'sanitaer_heizung') {
    pruefeSanitaer(ergaenzt, fehlende, lower)
  }
  if (gewerk === 'trockenbau') {
    pruefeTrockenbau(ergaenzt, fehlende, lower)
  }
  if (gewerk === 'boden') {
    pruefeBoden(ergaenzt, fehlende, lower)
  }
  if (gewerk === 'elektro') {
    pruefeElektro(ergaenzt, fehlende, lower)
  }

  return { fehlende, positionen: ergaenzt }
}
