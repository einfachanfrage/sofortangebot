import { describe, expect, it } from 'vitest'
import {
  ermittleHandaenderungen,
  trenneGeschuetzte,
  handaenderungsHinweis,
  positionsSchluessel,
} from '../manuelle-positionen'

function pos(id: string, title: string, extra: Partial<{ quantity: number; unit: string; unit_price: number; description: string | null }> = {}) {
  return {
    id,
    title,
    description: extra.description ?? null,
    quantity: extra.quantity ?? 10,
    unit: extra.unit ?? 'm²',
    unit_price: extra.unit_price ?? 12.5,
  }
}

describe('CoS-014 – welche Positionen hat der Handwerker angefasst', () => {
  // Das ist der wichtigste Test der Datei: `saveEdits` schreibt beim Speichern
  // JEDE Zeile neu. Ohne echten Vorher-/Nachher-Vergleich wäre nach einmal
  // „Bearbeiten → Speichern" das komplette Angebot eingefroren, und eine
  // Neu-Berechnung könnte nie wieder etwas ergänzen.
  it('meldet nichts, wenn nur gespeichert und nichts geändert wurde', () => {
    const stand = [pos('1', 'Wandflächen streichen — Flur'), pos('2', 'Deckenfläche streichen — Flur')]
    expect(ermittleHandaenderungen(stand, [...stand])).toEqual([])
  })

  it('ignoriert Cent- und Rundungsrauschen', () => {
    const original = [pos('1', 'Wandflächen streichen — Flur', { quantity: 33.33, unit_price: 12.5 })]
    const bearbeitet = [pos('1', 'Wandflächen streichen — Flur', { quantity: 33.33000001, unit_price: 12.5 })]
    expect(ermittleHandaenderungen(original, bearbeitet)).toEqual([])
  })

  it('merkt sich eine geänderte Menge', () => {
    const original = [pos('1', 'Wandflächen streichen — Flur', { quantity: 32 })]
    const bearbeitet = [pos('1', 'Wandflächen streichen — Flur', { quantity: 28 })]
    expect(ermittleHandaenderungen(original, bearbeitet)).toEqual(['Wandflächen streichen — Flur'])
  })

  it('merkt sich einen geänderten Preis', () => {
    const original = [pos('1', 'Wandflächen streichen — Flur', { unit_price: 12.5 })]
    const bearbeitet = [pos('1', 'Wandflächen streichen — Flur', { unit_price: 15 })]
    expect(ermittleHandaenderungen(original, bearbeitet)).toEqual(['Wandflächen streichen — Flur'])
  })

  it('merkt sich eine gelöschte Position', () => {
    const original = [pos('1', 'Wandflächen streichen — Flur'), pos('2', 'Boden schützen / Abdecken')]
    const bearbeitet = [pos('1', 'Wandflächen streichen — Flur')]
    expect(ermittleHandaenderungen(original, bearbeitet)).toEqual(['Boden schützen / Abdecken'])
  })

  it('merkt sich eine selbst hinzugefügte Position', () => {
    const original = [pos('1', 'Wandflächen streichen — Flur')]
    const bearbeitet = [...original, pos('new-1', 'Kaffee für den Bauherrn')]
    expect(ermittleHandaenderungen(original, bearbeitet)).toEqual(['Kaffee für den Bauherrn'])
  })

  it('merkt sich bei umbenanntem Titel BEIDE Fassungen', () => {
    // Der alte Titel ist der, unter dem die Engine die Position wieder
    // anlegen würde — der neue der, den der Handwerker jetzt sieht.
    const original = [pos('1', 'Wandflächen streichen — Flur')]
    const bearbeitet = [pos('1', 'Wände streichen inkl. Ecken — Flur')]
    expect(ermittleHandaenderungen(original, bearbeitet)).toEqual([
      'Wandflächen streichen — Flur',
      'Wände streichen inkl. Ecken — Flur',
    ])
  })
})

describe('CoS-014 – Neu-Berechnung respektiert Handänderungen', () => {
  it('lässt alles durch, wenn nichts von Hand geändert wurde', () => {
    const neue = [{ title: 'Wandflächen streichen — Flur' }, { title: 'Deckenfläche streichen — Flur' }]
    expect(trenneGeschuetzte(neue, []).behalten).toHaveLength(2)
    expect(trenneGeschuetzte(neue, null).behalten).toHaveLength(2)
  })

  it('hält genau die angefasste Position zurück, den Rest nicht', () => {
    const neue = [{ title: 'Wandflächen streichen — Flur' }, { title: 'Deckenfläche streichen — Flur' }]
    const { behalten, geschuetzt } = trenneGeschuetzte(neue, ['Wandflächen streichen — Flur'])
    expect(behalten.map(i => i.title)).toEqual(['Deckenfläche streichen — Flur'])
    expect(geschuetzt.map(i => i.title)).toEqual(['Wandflächen streichen — Flur'])
  })

  it('trifft denselben Raum, aber nicht die anderen Räume', () => {
    const neue = [{ title: 'Wandflächen streichen — Flur' }, { title: 'Wandflächen streichen — Küche' }]
    const { behalten } = trenneGeschuetzte(neue, ['Wandflächen streichen — Flur'])
    expect(behalten.map(i => i.title)).toEqual(['Wandflächen streichen — Küche'])
  })

  it('lässt sich von Groß/Kleinschreibung und Doppel-Leerzeichen nicht austricksen', () => {
    const neue = [{ title: 'Wandflächen  streichen — FLUR' }]
    expect(trenneGeschuetzte(neue, ['wandflächen streichen — flur']).behalten).toEqual([])
    expect(positionsSchluessel('  Wandflächen  streichen — FLUR ')).toBe('wandflächen streichen — flur')
  })
})

describe('CoS-014 – der Handwerker erfährt davon', () => {
  it('sagt nichts, wenn nichts zurückgehalten wurde', () => {
    expect(handaenderungsHinweis([])).toBeNull()
  })

  it('nennt die einzelne Position beim Namen', () => {
    const text = handaenderungsHinweis([{ title: 'Wandflächen streichen — Flur' }])
    expect(text).toContain('Wandflächen streichen — Flur')
    expect(text).toContain('deine Fassung bleibt stehen')
  })

  it('fasst bei vielen Positionen zusammen, statt eine Textwand zu bauen', () => {
    const text = handaenderungsHinweis([
      { title: 'A' }, { title: 'B' }, { title: 'C' }, { title: 'D' }, { title: 'E' },
    ])
    expect(text).toContain('A, B, C')
    expect(text).toContain('2 weitere')
  })
})
