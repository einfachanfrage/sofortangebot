import type { BerechnetePosition } from '../mengen/types'
import { hat, add, addMitMenge } from './helpers'

export function pruefeWallbox(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatWallbox =
    lower.includes('wallbox') ||
    lower.includes('ladestation') ||
    lower.includes('e-auto laden') ||
    lower.includes('elektroauto laden') ||
    lower.includes('ladesäule') ||
    lower.includes('ladeeinrichtung')
  if (!hatWallbox) return
  if (hat(ergaenzt, 'wallbox')) return

  fehlende.push('Wallbox montieren')

  const m =
    lower.match(/(\d+)\s*(?:meter|m|lfdm)\s*(?:zuleitung|kabel|leitung)/i) ??
    lower.match(/(?:zuleitung|kabel|leitung)\s*(\d+)\s*(?:meter|m)/i)
  if (m) {
    addMitMenge(ergaenzt, 'Zuleitung Wallbox', parseInt(m[1]), 'lfdm', `${m[1]} lfdm aus Transkript`)
  } else {
    fehlende.push('Zuleitung Wallbox (Meter prüfen)')
  }

  fehlende.push('Absicherung Wallbox')
  fehlende.push('Inbetriebnahme / Einmessen')
}

export function pruefeSmartHome(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): boolean {
  const hatSmartHome =
    lower.includes('smart home') ||
    lower.includes('smarthome') ||
    lower.includes('alexa') ||
    lower.includes('homekit') ||
    lower.includes('home assistant') ||
    lower.includes('zigbee') ||
    lower.includes('z-wave') ||
    lower.includes('bus-system') ||
    lower.includes('knx')
  if (!hatSmartHome) return false
  if (!hat(ergaenzt, 'smart', 'aktor')) {
    fehlende.push('Smart-Schalter / Aktor (statt normaler Schalter)')
  }
  return true
}

export function pruefeUnterverteilung(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatVerteilung =
    lower.includes('verteilung') ||
    lower.includes('sicherungskasten') ||
    lower.includes('unterverteiler') ||
    lower.includes('zählerschrank')
  if (!hatVerteilung) return

  const hatErneuern =
    lower.includes('erneuern') ||
    lower.includes('tauschen') ||
    lower.includes('ersetzen') ||
    (lower.includes('neu') && (lower.includes('verteilung') || lower.includes('sicherungskasten')))

  if (hatErneuern && !hat(ergaenzt, 'demontage')) {
    fehlende.push('Demontage alte Unterverteilung')
  }
  if (!hat(ergaenzt, 'unterverteilung', 'sicherungskasten', 'verteiler')) {
    fehlende.push('Neue Unterverteilung montieren')
  }
  if (!hat(ergaenzt, 'fi-schutz', 'fi schutz', 'fehlerstrom')) {
    fehlende.push('FI-Schutzschalter')
  }
}

export function pruefeHerdanschluss(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatKueche =
    lower.includes('küche') || lower.includes('kueche') || lower.includes('küchenzeile')
  const hatNeu =
    lower.includes('neu') ||
    lower.includes('renovier') ||
    lower.includes('umbau') ||
    lower.includes('einbau') ||
    lower.includes('montier')
  if (!hatKueche || !hatNeu) return
  if (hat(ergaenzt, 'herd', 'ceran', 'induktion', 'herdanschluss')) return
  fehlende.push('Rückfrage: Herdanschluss / Kochfeldzuleitung benötigt?')
}
