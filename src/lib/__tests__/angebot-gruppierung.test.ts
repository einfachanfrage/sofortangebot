import { describe, it, expect } from 'vitest'
import { gruppiereNachRaum, istAllgemeinPosition } from '../angebot-gruppierung'

// Unter "Allgemein" gehören NUR echte Allgemein-Positionen (Anfahrt, Kleinmaterial,
// Aufmaß …). Raumbezogene Arbeiten wie "Türen lackieren" gehören in den Raum.

function item(id: string, title: string, preis = 100) {
  return { id, title, description: null, quantity: 1, unit: 'Stück', unit_price: preis, total_price: preis, position: Number(id) }
}

describe('istAllgemeinPosition', () => {
  it.each([
    'An- und Abfahrt',
    'Anfahrt pauschal (bis 20 km)',
    'Kleinmaterial und Verbrauchsmaterial',
    'Aufmaß vor Ort',
    'Entsorgungsfahrt (Farbreste, Müll)',
    'Gerüst stellen',
  ])('"%s" → allgemein', (t) => { expect(istAllgemeinPosition(t)).toBe(true) })

  it.each([
    'Türen lackieren (2× Anstrich)',
    'Heizkörper abschleifen',
    'Wandflächen streichen',
    'Fenster grundieren',
    'Sockelleisten montieren',
  ])('"%s" → NICHT allgemein (gehört in den Raum)', (t) => { expect(istAllgemeinPosition(t)).toBe(false) })
})

describe('gruppiereNachRaum — Allgemein bleibt sauber', () => {
  it('ein Raum: Türen/Heizkörper in den Raum, Kleinmaterial+Anfahrt bleiben Allgemein', () => {
    const g = gruppiereNachRaum([
      item('1', 'Wandflächen streichen — Wohnzimmer'),
      item('2', 'Türen lackieren (2× Anstrich)'),
      item('3', 'Heizkörper abschleifen'),
      item('4', 'Kleinmaterial und Verbrauchsmaterial'),
      item('5', 'An- und Abfahrt'),
    ])!
    expect(g).not.toBe(null)
    const raumTitel = g.raeume[0].items.map(i => i.title)
    expect(raumTitel).toContain('Türen lackieren (2× Anstrich)')
    expect(raumTitel).toContain('Heizkörper abschleifen')
    // Echte Allgemein-Positionen NICHT in den Raum ziehen
    expect(g.allgemein.map(i => i.title)).toEqual(
      expect.arrayContaining(['Kleinmaterial und Verbrauchsmaterial', 'An- und Abfahrt'])
    )
    expect(raumTitel).not.toContain('Kleinmaterial und Verbrauchsmaterial')
  })

  it('mehrere Räume: Position MIT Raum-Suffix landet im richtigen Raum', () => {
    const g = gruppiereNachRaum([
      item('1', 'Wandflächen streichen — Wohnzimmer'),
      item('2', 'Wandflächen streichen — Küche'),
      item('3', 'Heizkörper lackieren (2× Anstrich) — Wohnzimmer'),
      item('4', 'Kleinmaterial und Verbrauchsmaterial'),
    ])!
    const wohnzimmer = g.raeume.find(r => r.raumName === 'Wohnzimmer')!
    expect(wohnzimmer.items.map(i => i.title)).toContain('Heizkörper lackieren (2× Anstrich) — Wohnzimmer')
    expect(g.allgemein.map(i => i.title)).toEqual(['Kleinmaterial und Verbrauchsmaterial'])
  })

  it('PM-005: Speisekammer bekommt eine eigene Raumgruppe, statt unter Küche zu landen', () => {
    // Live-Nachtest 2026-08-16: Berechnung lieferte korrekt ZWEI Positionen
    // ("Deckenfläche streichen 2× — Küche" und "— Speisekammer"), aber die
    // Anzeige kannte "Speisekammer" nicht als echten Raum, entfernte das
    // Suffix und hängte sie an die einzige erkannte Gruppe (Küche) — sah wie
    // ein Duplikat aus.
    const g = gruppiereNachRaum([
      item('1', 'Wandflächen streichen 2x — Küche', 250),
      item('2', 'Deckenfläche streichen 2x — Küche', 107.80),
      item('3', 'Deckenfläche streichen 2x — Speisekammer', 107.80),
    ])!
    expect(g.hatMehrereRaeume).toBe(true)
    const kueche = g.raeume.find(r => r.raumName === 'Küche')!
    const speisekammer = g.raeume.find(r => r.raumName === 'Speisekammer')!
    expect(kueche).toBeDefined()
    expect(speisekammer).toBeDefined()
    expect(kueche.items).toHaveLength(2)
    expect(speisekammer.items).toHaveLength(1)
    expect(speisekammer.items[0].title).toBe('Deckenfläche streichen 2x — Speisekammer')
    // Kernpunkt: keine doppelte "Deckenfläche" in der Küche-Gruppe
    expect(kueche.items.filter(i => i.title.includes('Deckenfläche'))).toHaveLength(1)
  })
})
