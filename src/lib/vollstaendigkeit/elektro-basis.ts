import type { BerechnetePosition } from '../mengen/types'
import { hat, add, addMitMenge } from './helpers'

export type UPAP = 'up' | 'ap' | null

export function erkenneElektroTrigger(lower: string): boolean {
  return (
    lower.includes('steckdose') ||
    lower.includes('lichtschalter') ||
    lower.includes('schalter') ||
    lower.includes('leitungen verlegen') ||
    lower.includes('kabel verlegen') ||
    lower.includes('kabelkanal') ||
    lower.includes('unterputz') ||
    lower.includes('aufputz') ||
    lower.includes('sicherung') ||
    lower.includes('elektro') ||
    lower.includes('wallbox') ||
    lower.includes('ladestation') ||
    lower.includes('verteilung') ||
    lower.includes('sicherungskasten')
  )
}

export function erkenneUPAP(lower: string): UPAP {
  if (lower.includes('unterputz') || /\bup\b/.test(lower)) return 'up'
  if (lower.includes('aufputz') || /\bap\b/.test(lower)) return 'ap'
  return null
}

export function pruefeSteckdosen(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  upAp: UPAP,
): void {
  if (!lower.includes('steckdose')) return
  if (hat(ergaenzt, 'steckdose')) return

  const m =
    lower.match(/(\d+)\s*steckdosen/i) ??
    lower.match(/(\d+)\s*steckdose/i) ??
    lower.match(/steckdosen?\s+(\d+)/i)
  const anzahl = m ? parseInt(m[1]) : 0
  const suffix = upAp ? ` (${upAp.toUpperCase()})` : ''

  if (anzahl > 0) {
    addMitMenge(ergaenzt, `Steckdose montieren${suffix}`, anzahl, 'Stück', `${anzahl} Stück aus Transkript`)
  } else {
    fehlende.push(`Steckdose montieren${suffix} (Anzahl prüfen)`)
  }
}

export function pruefeSchalter(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  upAp: UPAP,
): void {
  const hatLichtschalter =
    lower.includes('lichtschalter') ||
    lower.includes('schalter einbauen') ||
    lower.includes('schalter setzen') ||
    lower.includes('schalter nachrüsten') ||
    lower.includes('schalter verlegen')
  if (!hatLichtschalter) return
  if (hat(ergaenzt, 'schalter', 'lichtschalter')) return

  const m =
    lower.match(/(\d+)\s*(?:licht)?schalter/i) ??
    lower.match(/schalter\s+(\d+)/i)
  const anzahl = m ? parseInt(m[1]) : 0
  const suffix = upAp ? ` (${upAp.toUpperCase()})` : ''

  if (anzahl > 0) {
    addMitMenge(ergaenzt, `Lichtschalter montieren${suffix}`, anzahl, 'Stück', `${anzahl} Stück aus Transkript`)
  } else {
    fehlende.push(`Lichtschalter montieren${suffix} (Anzahl prüfen)`)
  }
}

export function pruefeLeitungen(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatLeitung =
    lower.includes('leitungen verlegen') ||
    lower.includes('kabel verlegen') ||
    lower.includes('kabelkanal') ||
    lower.includes('installation verlegen')
  if (!hatLeitung) return
  if (hat(ergaenzt, 'leitungen', 'kabel verlegen', 'kabelkanal')) return

  const m =
    lower.match(/(\d+)\s*(?:laufende meter|lfm|lfdm|m)\s*(?:leitungen?|kabel)/i) ??
    lower.match(/leitungen?\s+(\d+)\s*(?:meter|m|lfdm)/i)
  if (m) {
    addMitMenge(ergaenzt, 'Leitungen verlegen', parseInt(m[1]), 'lfdm', `${m[1]} lfdm aus Transkript`)
  } else {
    add(ergaenzt, fehlende, 'Leitungen verlegen (Meter prüfen)')
  }
}
