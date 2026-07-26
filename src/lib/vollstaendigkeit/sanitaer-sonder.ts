import type { BerechnetePosition } from '../mengen/types'
import { hat } from './helpers'

export function pruefeWaermepumpe(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatWP =
    lower.includes('wärmepumpe') ||
    lower.includes('waermepumpe') ||
    lower.includes('wärmepumpenanlage') ||
    lower.includes('luft-wasser') ||
    lower.includes('sole-wasser')
  if (!hatWP) return
  if (hat(ergaenzt, 'wärmepumpe', 'waermepumpe')) return

  fehlende.push('Wärmepumpe montieren')
  fehlende.push('Kältemittelkreislauf / Befüllung')
  fehlende.push('Inbetriebnahme Wärmepumpe')
}

export function pruefeBoiler(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatBoiler =
    lower.includes('boiler') ||
    lower.includes('warmwasserspeicher') ||
    lower.includes('durchlauferhitzer') ||
    lower.includes('warmwasserbereiter')
  if (!hatBoiler) return
  if (hat(ergaenzt, 'boiler', 'warmwasser', 'durchlauferhitzer')) return

  const hatTausch =
    lower.includes('tausch') || lower.includes('erneuern') || lower.includes('neu') || lower.includes('ersetzen')
  if (hatTausch) fehlende.push('Demontage Boiler (alt)')

  fehlende.push('Boiler / Warmwasserspeicher montieren')
  fehlende.push('Anschluss Zu- und Abwasser')
}

export function pruefeFBHSanitaer(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatFBH =
    lower.includes('fußbodenheizung') ||
    lower.includes('fussbodenheizung') ||
    /\bfbh\b/.test(lower) ||
    lower.includes('flächenheizung')
  if (!hatFBH) return
  if (hat(ergaenzt, 'fußbodenheizung', 'fussbodenheizung', 'fbh', 'heizkreis', 'flächenheizung')) return

  fehlende.push('Fußbodenheizung verlegen')
  fehlende.push('Verteiler / Heizkreisverteiler')
  fehlende.push('Einregulierung / Druckprobe')
}
