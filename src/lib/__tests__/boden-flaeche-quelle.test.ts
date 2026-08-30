// Live-Fund vom 30.08.2026 (Sandy): „In der ganzen Wohnung müssen 120 m²
// Wandfläche gestrichen werden und 55 m² Laminat verlegt werden" ergab
// 132 m² Laminat — die Bodenregel hatte die WANDfläche genommen (120 + 10 %
// Verschnitt) und die 55 nie gelesen. Mehr als das Doppelte, ohne Warnung.
import { describe, expect, it } from 'vitest'
import { extrahiereFlaeche } from '../vollstaendigkeit/boden-basis'

describe('Bodenfläche aus dem Transkript — welche Zahl gilt?', () => {
  it('nimmt die Bodenzahl, nicht die zuerst genannte Wandzahl (Sandys Live-Fall)', () => {
    expect(extrahiereFlaeche(
      'in der ganzen wohnung müssen 120 quadratmeter wandfläche gestrichen werden und 55 quadratmeter laminat verlegt werden.',
    )).toBe(55)
  })

  it('ignoriert eine Fläche, die am Streichen hängt, auch ohne das Wort Wand', () => {
    expect(extrahiereFlaeche('im wohnzimmer müssen 35 m² gestrichen werden')).toBeNull()
  })

  it('lässt eine Deckenfläche stehen, statt sie als Boden zu verbuchen', () => {
    expect(extrahiereFlaeche('12 qm deckenfläche streichen')).toBeNull()
  })

  it('bleibt bei den bisherigen Fällen ohne Belagswort unverändert', () => {
    expect(extrahiereFlaeche('wohnzimmer, 20 qm, laminat verlegen')).toBe(20)
    expect(extrahiereFlaeche('zimmer ca. 25 m²')).toBe(25)
    expect(extrahiereFlaeche('flur 12 qm parkett')).toBe(12)
  })

  it('liefert lieber nichts als eine falsche Menge', () => {
    // Nur eine Wandzahl im Text — daraus darf keine Bodenmenge entstehen.
    expect(extrahiereFlaeche('120 quadratmeter wandfläche streichen')).toBeNull()
  })
})
