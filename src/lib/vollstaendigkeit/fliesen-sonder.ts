import type { BerechnetePosition } from '../mengen/types'
import { hat, add } from './helpers'

export function pruefeDiagonalFliesen(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatDiagonal =
    lower.includes('diagonal') ||
    lower.includes('schräg') ||
    lower.includes('schraeg') ||
    lower.includes('45 grad') ||
    lower.includes('45°')
  if (!hatDiagonal) return
  if (hat(ergaenzt, 'verschnitt', 'diagonal')) return
  fehlende.push('Verschnitt 15 % (Diagonalverlegung)')
}

export function pruefeMosaik(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  if (!lower.includes('mosaik')) return
  if (hat(ergaenzt, 'mosaik')) return
  add(ergaenzt, fehlende, 'Mosaikfliesen verlegen (erhöhter Aufwand)')
}

export function pruefeNaturstein(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatNaturstein =
    lower.includes('naturstein') ||
    lower.includes('marmor') ||
    lower.includes('granit') ||
    lower.includes('schiefer') ||
    lower.includes('travertin') ||
    lower.includes('quarzit')
  if (!hatNaturstein) return
  if (!hat(ergaenzt, 'imprägnierung', 'imprägnier')) {
    fehlende.push('Imprägnierung Naturstein')
  }
  if (!hat(ergaenzt, 'epoxid', 'naturstein-fug', 'fugenmasse')) {
    fehlende.push('Fugenmasse für Naturstein (Epoxid/Spezialmasse)')
  }
}
