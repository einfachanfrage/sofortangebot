import type { BerechnetePosition } from '../mengen/types'
import { hat } from './helpers'

export function pruefeBrandschutzTb(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatBrandschutz =
    lower.includes('brandschutz') ||
    lower.includes('f30') ||
    lower.includes('f60') ||
    lower.includes('f90') ||
    lower.includes('rei ') ||
    lower.includes('feuerschutz')
  if (!hatBrandschutz) return
  if (hat(ergaenzt, 'brandschutz', 'feuerschutz', 'spezialplatte')) return

  fehlende.push('GK-Spezialplatte (Brandschutz F30/F60)')
  fehlende.push('Hinweis: Brandschutzzeugnis / Abnahme erforderlich')
}

export function pruefeSchallschutzTb(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatSchallschutz =
    lower.includes('schallschutz') ||
    lower.includes('schalldämmung') ||
    lower.includes('schalldaemmung') ||
    lower.includes('schallreduzierung') ||
    lower.includes('lärmschutz') ||
    lower.includes('laermschutz')
  if (!hatSchallschutz) return

  if (!hat(ergaenzt, 'schallschutz', 'schall', 'doppelte beplankung', '2-lagig')) {
    fehlende.push('GK-Beplankung 2-lagig (Schallschutz)')
  }
  if (!hat(ergaenzt, 'dämmung', 'daemmung', 'mineralwolle', 'akustik')) {
    fehlende.push('Dämmung / Mineralwolle einlegen')
  }
}

export function pruefeDaemmungTb(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatDaemmung =
    lower.includes('dämmung') ||
    lower.includes('daemmung') ||
    lower.includes('dämmen') ||
    lower.includes('mineralwolle') ||
    lower.includes('wärmedämm')
  if (!hatDaemmung) return
  if (hat(ergaenzt, 'dämmung', 'daemmung', 'mineralwolle', 'dämm')) return
  fehlende.push('Dämmung / Mineralwolle einlegen')
}
