import { describe, it, expect } from 'vitest'
import { malerEngine } from '../../mengen/gewerke/maler'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'

// Beta-Frust-Ansage (echter Nutzer): natürliche Sprache, drei Arbeiten.
// Deckte zwei Bugs auf:
//  1) "Tapete ab" + "glattgemacht" wurden nicht erkannt → Arbeiten verschluckt
//  2) "geSTRICHen" enthält den Teilstring "estrich" → includes('estrich')
//     erfand Estrich schleifen + Epoxid-Versiegelung (Phantom-Positionen)
describe('Beta-Frust-Ansage — komplette Pipeline', () => {
  const t = 'hier im Wohnzimmer muss gestrichen werden, 24 Quadratmeter Bodenfläche. ' +
    'Die Wände sind 2,60 hoch. Muss erst die Tapete ab und dann die Wände glattgemacht werden und dann streichen.'

  const positionen = (() => {
    const eng = malerEngine({ transkript: t, raeume: [{ name: 'Wohnzimmer', flaeche: 24, hoehe: 2.60, arbeiten: ['tapete entfernen', 'wände glätten', 'streichen'] }] })
    return pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, t).positionen
  })()
  const namen = positionen.map(p => p.beschreibung.toLowerCase())

  it('erfindet KEINEN Estrich / kein Epoxid (der gestrichen→estrich Bug)', () => {
    expect(namen.some(n => n.includes('estrich'))).toBe(false)
    expect(namen.some(n => n.includes('epoxid'))).toBe(false)
    expect(namen.some(n => n.includes('versiegel'))).toBe(false)
  })

  it('enthält die drei tatsächlich genannten Arbeiten', () => {
    expect(namen.some(n => n.includes('wandflächen streichen'))).toBe(true)
    expect(namen.some(n => n.includes('tapete entfernen'))).toBe(true)
    expect(namen.some(n => n.includes('spachteln') || n.includes('glätten'))).toBe(true)
  })

  it('Wandfläche aus 24 m² Boden + 2,60 Höhe berechnet (~48 m²)', () => {
    const wand = positionen.find(p => p.beschreibung.toLowerCase().includes('wandflächen streichen'))
    expect(wand?.menge).toBeGreaterThan(44)
    expect(wand?.menge).toBeLessThan(52)
  })
})
