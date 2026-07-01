import type { BerechnetePosition } from '../mengen/types'
import { hat, add } from './helpers'

export function pruefeHeizkörper(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatHeizk =
    lower.includes('heizkörper') ||
    lower.includes('heizkoerper') ||
    lower.includes('radiator') ||
    lower.includes('heizung wechsel') ||
    lower.includes('heizung tausch')
  if (!hatHeizk) return

  const hatNeu =
    lower.includes('neu') ||
    lower.includes('tausch') ||
    lower.includes('erneuern') ||
    lower.includes('wechsel') ||
    lower.includes('ersetzen')
  if (!hatNeu) return

  if (!hat(ergaenzt, 'thermostat')) {
    add(ergaenzt, fehlende, 'Thermostatventil montieren')
  }
  if (!hat(ergaenzt, 'demontage heizkörper', 'demontage heizkoerper', 'heizkörper demon')) {
    fehlende.push('Demontage Heizkörper (alt)')
  }
}

export function pruefeBadKomplett(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatBadKomplett =
    lower.includes('bad komplett') ||
    lower.includes('badezimmer komplett') ||
    lower.includes('komplettes bad') ||
    lower.includes('bad sanierung') ||
    lower.includes('badsanierung') ||
    lower.includes('bad renovier') ||
    lower.includes('badrenovierung')
  if (!hatBadKomplett) return
  if (hat(ergaenzt, 'leitungen', 'sanitär-installation', 'rohrinstallation', 'rückfrage')) return
  fehlende.push('Rückfrage: Leitungen (Zu-/Abwasser) auch erneuern?')
}
