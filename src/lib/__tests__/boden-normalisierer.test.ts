import { describe, it, expect } from 'vitest'
import { erkenneBelag, erkenneBelagName, hatBodenArbeit } from '../boden-normalisierer'

describe('erkenneBelag', () => {
  it.each([
    ['neues Fertigparkett verlegen', 'parkett'],
    ['Eichendielen abschleifen', 'parkett'],
    ['Massivholzboden', 'parkett'],
    ['Laminat im Wohnzimmer', 'laminat'],
    ['Klick-Vinyl verlegen', 'vinyl'],
    ['Designboden LVT', 'vinyl'],
    ['Korkboden', 'kork'],
    ['Linoleum Bahnenware', 'linoleum'],
    ['Nadelvlies-Teppichboden', 'teppich'],
    ['alter Teppich raus', 'teppich'],
  ] as const)('"%s" → %s', (text, belag) => {
    expect(erkenneBelag(text)).toBe(belag)
  })

  it('kein Belag erkannt → null', () => {
    expect(erkenneBelag('nur den Estrich grundieren')).toBe(null)
  })

  it('Parkett hat Vorrang vor Dielen-Synonym', () => {
    expect(erkenneBelag('Fertigparkett-Dielen')).toBe('parkett')
  })
})

describe('erkenneBelagName — spezifische Namen', () => {
  it.each([
    ['Klick-Vinyl im Bad', 'vinyl', 'Klick-Vinyl'],
    ['Designboden verlegen', 'vinyl', 'Designboden'],
    ['normales Vinyl', 'vinyl', 'Vinyl-Boden'],
    ['Nadelvlies verkleben', 'teppich', 'Nadelvlies-Teppichboden'],
    ['Teppich verlegen', 'teppich', 'Teppichboden'],
    ['Fertigparkett', 'parkett', 'Fertigparkett'],
    ['Eichenparkett schleifen', 'parkett', 'Eichenparkett'],
  ] as const)('"%s" → %s', (text, belag, name) => {
    expect(erkenneBelagName(text, belag)).toBe(name)
  })
})

describe('erkenneBodenArbeiten — altbelag_entfernen (alle Flexionen/Partizipien)', () => {
  it.each([
    'alten Teppich entfernen',
    'der alte Boden muss raus',
    'Altbelag rausreißen',
    'den alten Belag rausgerissen',        // Partizip
    'alter Teppich wird abgerissen',        // Partizip — vom alten includes('abreiß') verpasst
    'der alte Laminatboden wurde abgebrochen', // Partizip — von includes('abbrech') verpasst
    'uralter Teppichboden, alles weg',
    'PVC demontieren',
    'alten Bodenbelag abnehmen',
  ])('"%s" → altbelag_entfernen', (text) => {
    expect(hatBodenArbeit(text, 'altbelag_entfernen')).toBe(true)
  })

  it('bloß "neuen Boden verlegen" → KEIN Entfernen', () => {
    expect(hatBodenArbeit('neuen Boden verlegen', 'altbelag_entfernen')).toBe(false)
  })

  it('Subjekt und Aktion in verschiedenen Sätzen → NICHT', () => {
    expect(hatBodenArbeit('Der Boden ist schön. Die Möbel müssen weg.', 'altbelag_entfernen')).toBe(false)
  })
})
