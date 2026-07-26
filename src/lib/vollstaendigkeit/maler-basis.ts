import type { BerechnetePosition } from '../mengen/types'
import { hat, add, filtereArray } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

// "nur X"-Filter: entfernt widersprechende Positionen aus der Engine-Liste
export function wendeNurXFilterAn(ergaenzt: BerechnetePosition[], v: AuftragsVerstaendnis): {
  nurDecke: boolean
  nurWaende: boolean
  nurBoden: boolean
} {
  // Scope aus dem typisierten Vertrag — deckt Flexionen + Synonyme + "ohne Decke" ab
  const { nurWaende, nurDecke, nurBoden } = v.scope

  if (nurDecke) {
    filtereArray(ergaenzt, p => {
      const d = p.beschreibung.toLowerCase()
      return !d.includes('sockel') && !d.includes('wand')
    })
  }
  if (nurWaende) {
    filtereArray(ergaenzt, p => {
      const d = p.beschreibung.toLowerCase()
      const istBodenSchutz = d.includes('boden schütz') || d.includes('boden abkl') || d.includes('abdeck')
      return !d.includes('decke') && (!d.includes('boden') || istBodenSchutz)
    })
  }
  if (nurBoden) {
    filtereArray(ergaenzt, p => {
      const d = p.beschreibung.toLowerCase()
      return !d.includes('wand') && !d.includes('decke') && !d.includes('sockel')
    })
  }

  return { nurDecke, nurWaende, nurBoden }
}

// Streichen-Basis: Wand, Decke, Boden schützen, Sockel abkleben
export function pruefeStreichenBasis(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  v: AuftragsVerstaendnis,
  nurDecke: boolean,
  nurWaende: boolean,
  nurBoden: boolean,
  lower: string,
): void {
  if (!v.hatArbeit('streichen')) return

  const waendeAusdruecklich = /w(?:a|ä)nd|wandfl(?:a|ä)che/i.test(lower)
  const deckeAusdruecklich = /decke|deckenfl(?:a|ä)che/i.test(lower)
  if (waendeAusdruecklich && !nurDecke && !nurBoden && !hat(ergaenzt, 'wand', 'wandfläche')) {
    add(ergaenzt, fehlende, 'Wandflächen streichen')
  }
  if (deckeAusdruecklich && !nurWaende && !nurBoden && !hat(ergaenzt, 'decke', 'deckenfläche')) {
    add(ergaenzt, fehlende, 'Deckenfläche streichen')
  }
  // Schutz- und Abklebearbeiten nur ausgeben, wenn sie im Auftrag tatsächlich
  // genannt wurden. Keine ungefragten Zusatzpositionen erzeugen.
  const bodenSchutzGenannt = /(?:boden|böden).{0,35}(?:schütz|abdeck|vlies)|(?:schütz|abdeck|vlies).{0,35}(?:boden|böden)/i.test(lower)
  const sockelAbklebenGenannt = /sockel(?:leisten)?.{0,35}(?:abkl|abgekl)|(?:abkl|abgekl).{0,35}sockel(?:leisten)?/i.test(lower)
  if (!nurBoden && bodenSchutzGenannt && !hat(ergaenzt, 'boden schütz', 'boden abdeck', 'abdeckfolie')) {
    add(ergaenzt, fehlende, 'Boden schützen / Abdecken')
  }
  if (!nurDecke && !nurBoden && sockelAbklebenGenannt && !hat(ergaenzt, 'sockelleisten abkl')) {
    add(ergaenzt, fehlende, 'Sockelleisten abkleben')
  }
}

// Grundierung: Neubau/Erstanstrich triggert automatisch
export function pruefeGrundierung(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  v: AuftragsVerstaendnis,
  lower: string,
): void {
  // grundieren/streichen aus dem Vertrag; distinktive Nomen weiter aus dem Text
  const hatGrundierung = v.hatArbeit('grundieren') || lower.includes('tiefengrund')
    || lower.includes('neubau') || lower.includes('erstanstrich') || lower.includes('rohbau')

  if (!v.hatArbeit('streichen') || !hatGrundierung) return
  if (hat(ergaenzt, 'grundier', 'voranstrich', 'tiefengrund')) return

  const wandPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
  if (wandPos) {
    ergaenzt.unshift({
      beschreibung: 'Voranstrich / Grundierung',
      menge: wandPos.menge,
      einheit: 'm²',
      konfidenz: 'high',
      berechnungsweg: `Gleiche Fläche wie Wandflächen (${wandPos.menge} m²)`,
      annahmen: [...wandPos.annahmen],
    })
  } else {
    add(ergaenzt, fehlende, 'Voranstrich / Grundierung')
  }
}
