import type { BerechnetePosition } from '../mengen/types'
import { hat, add } from './helpers'

export type SanitaerObjekte = {
  hatWC: boolean
  hatWaschtisch: boolean
  hatDusche: boolean
  hatWanne: boolean
  hatArmatur: boolean
}

export function erkenneSanitaerObjekte(lower: string): SanitaerObjekte {
  const nurWC = lower.includes('nur wc') || lower.includes('nur die toilette')
  const nurWaschtisch = lower.includes('nur waschtisch') || lower.includes('nur waschbecken')
  return {
    hatWC: !nurWaschtisch && (lower.includes('wc') || lower.includes('toilette') || lower.includes('klo')),
    hatWaschtisch: !nurWC && (lower.includes('waschtisch') || lower.includes('waschbecken')),
    hatDusche: lower.includes('dusche') || lower.includes('duschwanne'),
    hatWanne: lower.includes('badewanne') || (lower.includes('wanne') && !lower.includes('duschwanne')),
    hatArmatur: lower.includes('armatur') || lower.includes('wasserhahn') || lower.includes('mischbatterie'),
  }
}

export function pruefeDemontage(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  objekte: SanitaerObjekte,
): void {
  const hatTausch =
    lower.includes('tausch') ||
    lower.includes('wechsel') ||
    lower.includes('erneuern') ||
    lower.includes('ersetzen') ||
    lower.includes('neu einbau') ||
    lower.includes('auswechsel')
  if (!hatTausch) return
  if (hat(ergaenzt, 'demon', 'ausbauen', 'entfernen', 'demontage')) return

  // Separate Demontage je Objekt — nicht alles als "Altanlage" pauschal
  if (objekte.hatWC) fehlende.push('Demontage WC (alt)')
  if (objekte.hatWaschtisch) fehlende.push('Demontage Waschtisch (alt)')
  if (objekte.hatDusche || objekte.hatWanne) fehlende.push('Demontage Dusche / Wanne (alt)')
  if (!objekte.hatWC && !objekte.hatWaschtisch && !objekte.hatDusche && !objekte.hatWanne) {
    add(ergaenzt, fehlende, 'Demontage Altanlage')
  }
}

export function pruefeSilikon(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  objekte: SanitaerObjekte,
): void {
  const hatObjekt =
    objekte.hatWC ||
    objekte.hatWaschtisch ||
    objekte.hatDusche ||
    objekte.hatWanne ||
    objekte.hatArmatur
  if (!hatObjekt) return
  if (hat(ergaenzt, 'silikon')) return
  add(ergaenzt, fehlende, 'Silikon Anschlussfugen')
}
