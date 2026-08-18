import { describe, it, expect } from 'vitest'
import { berechneGrundriss, berechneRaumMasse, berechneQuantityFuerItem, type Wand } from '../raum-geometrie'

describe('berechneGrundriss — rechtwinklige Polygone', () => {
  it('Quadrat 4×4 schließt, Umfang 16, Fläche 16', () => {
    const waende: Wand[] = [
      { laenge: 4 }, { laenge: 4, turn: 'R' }, { laenge: 4, turn: 'R' }, { laenge: 4, turn: 'R' },
    ]
    const g = berechneGrundriss(waende)
    expect(g.geschlossen).toBe(true)
    expect(g.umfang).toBe(16)
    expect(g.flaeche).toBe(16)
  })

  it('Rechteck 5×3 schließt, Umfang 16, Fläche 15', () => {
    const g = berechneGrundriss([
      { laenge: 5 }, { laenge: 3, turn: 'R' }, { laenge: 5, turn: 'R' }, { laenge: 3, turn: 'R' },
    ])
    expect(g.geschlossen).toBe(true)
    expect(g.umfang).toBe(16)
    expect(g.flaeche).toBe(15)
  })

  it('L-Form (5×4 mit 2×2-Ausschnitt): Umfang 18, Fläche 16', () => {
    // Im Uhrzeigersinn: O5, R S2, R W2, L S2, R W3, R N4
    const g = berechneGrundriss([
      { laenge: 5 },
      { laenge: 2, turn: 'R' },
      { laenge: 2, turn: 'R' },
      { laenge: 2, turn: 'L' },
      { laenge: 3, turn: 'R' },
      { laenge: 4, turn: 'R' },
    ])
    expect(g.geschlossen).toBe(true)
    expect(g.umfang).toBe(18)
    expect(g.flaeche).toBe(16)
  })

  it('Nicht geschlossene Form wird als geschlossen=false gemeldet', () => {
    const g = berechneGrundriss([
      { laenge: 4 }, { laenge: 4, turn: 'R' }, { laenge: 4, turn: 'R' }, { laenge: 2, turn: 'R' },
    ])
    expect(g.geschlossen).toBe(false)
  })

  it('Weniger als 3 Wände → keine Fläche', () => {
    const g = berechneGrundriss([{ laenge: 4 }, { laenge: 4, turn: 'R' }])
    expect(g.flaeche).toBe(0)
    expect(g.geschlossen).toBe(false)
  })

  it('U-Form (6×4 mit 2×2-Einschnitt oben): geschlossen, Umfang 24, Fläche 20', () => {
    const g = berechneGrundriss([
      { laenge: 2 }, { laenge: 2, turn: 'R' }, { laenge: 2, turn: 'L' }, { laenge: 2, turn: 'L' },
      { laenge: 2, turn: 'R' }, { laenge: 4, turn: 'R' }, { laenge: 6, turn: 'R' }, { laenge: 4, turn: 'R' },
    ])
    expect(g.geschlossen).toBe(true)
    expect(g.umfang).toBe(24)
    expect(g.flaeche).toBe(20)
  })
})

describe('berechneRaumMasse — Modi', () => {
  it('rechteck: Wand = Umfang×H − Öffnungen, Boden = b×l', () => {
    const m = berechneRaumMasse({ modus: 'rechteck', breite: 5, laenge: 4, hoehe: 2.6, tueren: 1, fenster: 2 })
    // Umfang 18, ×2.6 = 46.8, − (1×1.89 + 2×1.20=4.29) = 42.51
    expect(m.umfang).toBe(18)
    expect(m.wandflaeche).toBe(42.51)
    expect(m.bodenflaeche).toBe(20)
  })

  it('rechteck ohne Höhe nutzt Standard 2,5 m', () => {
    const m = berechneRaumMasse({ modus: 'rechteck', breite: 4, laenge: 4 })
    expect(m.hoehe).toBe(2.5)
    expect(m.wandflaeche).toBe(40) // 16 × 2.5, keine Öffnungen
  })

  it('flaeche: direkte Wand-/Bodenfläche werden 1:1 übernommen (kein Abzug)', () => {
    const m = berechneRaumMasse({ modus: 'flaeche', wandflaeche: 52.5, bodenflaeche: 23, tueren: 3, fenster: 4 })
    expect(m.wandflaeche).toBe(52.5)
    expect(m.bodenflaeche).toBe(23)
    expect(m.umfang).toBeNull()
  })

  it('grundriss: L-Form ergibt Wand aus Umfang, Boden aus Fläche', () => {
    const m = berechneRaumMasse({
      modus: 'grundriss', hoehe: 2.5, tueren: 1, fenster: 1,
      grundriss: [
        { laenge: 5 }, { laenge: 2, turn: 'R' }, { laenge: 2, turn: 'R' },
        { laenge: 2, turn: 'L' }, { laenge: 3, turn: 'R' }, { laenge: 4, turn: 'R' },
      ],
    })
    // Umfang 18 × 2.5 = 45, − (1.89 + 1.20) = 41.91
    expect(m.umfang).toBe(18)
    expect(m.wandflaeche).toBe(41.91)
    expect(m.bodenflaeche).toBe(16)
  })

  it('wand (PM-008/PD-003): Länge × Höhe − Fenster, kein Boden, kein Umfang', () => {
    const m = berechneRaumMasse({ modus: 'wand', laenge: 12, hoehe: 6, fenster: 3 })
    // 12 × 6 = 72, − 3 × 1.20 = 68.4
    expect(m.wandflaeche).toBe(68.4)
    expect(m.bodenflaeche).toBeNull()
    expect(m.umfang).toBeNull()
  })

  it('wand: eine Tür wird genauso abgezogen wie bei einem Raum', () => {
    const m = berechneRaumMasse({ modus: 'wand', laenge: 10, hoehe: 3, tueren: 1 })
    // 10 × 3 = 30, − 1.89 = 28.11
    expect(m.wandflaeche).toBe(28.11)
  })

  it('wand ohne Länge → keine Fläche berechenbar (echte Lücke, kein Rechenfehler)', () => {
    const m = berechneRaumMasse({ modus: 'wand', hoehe: 6 })
    expect(m.wandflaeche).toBeNull()
  })

  it('wand ohne Höhe nutzt Standard 2,5 m, genau wie rechteck', () => {
    const m = berechneRaumMasse({ modus: 'wand', laenge: 8 })
    expect(m.hoehe).toBe(2.5)
    expect(m.wandflaeche).toBe(20)
  })
})

describe('berechneQuantityFuerItem — Positions-Mapping', () => {
  const rechteck = { modus: 'rechteck' as const, breite: 5, laenge: 4, hoehe: 2.5, tueren: 1, fenster: 2 }

  it('Wandflächen streichen → Wandfläche', () => {
    expect(berechneQuantityFuerItem('Wandflächen streichen', 'm²', rechteck)).toBe(40.71) // 18×2.5=45 −4.29
  })

  it('nutzt für 5,20 × 4,10 × 2,70 mit zwei Fenstern und einer Tür exakt 45,93 m²', () => {
    const dim = { modus: 'rechteck' as const, breite: 4.1, laenge: 5.2, hoehe: 2.7, tueren: 1, fenster: 2 }
    expect(berechneRaumMasse(dim).wandflaeche).toBe(45.93)
    for (const titel of [
      'Wandflächen streichen 2x',
      'Spachtelarbeiten Q2',
      'Schleifen',
      'Voranstrich / Grundierung',
      'Tapete entfernen',
    ]) {
      expect(berechneQuantityFuerItem(titel, 'm²', dim), titel).toBe(45.93)
    }
  })
  it('Deckenfläche streichen → Bodenfläche', () => {
    expect(berechneQuantityFuerItem('Deckenfläche streichen', 'm²', rechteck)).toBe(20)
  })
  it('Sockelleisten → Umfang − Türen', () => {
    expect(berechneQuantityFuerItem('Sockelleisten abkleben', 'lfdm', rechteck)).toBe(17.1) // 18 − 0.9
  })
  it('flaeche-Modus: Sockelleisten nicht berechenbar (kein Umfang)', () => {
    expect(berechneQuantityFuerItem('Sockelleisten abkleben', 'lfdm', { modus: 'flaeche', wandflaeche: 40 })).toBeNull()
  })
  it('flaeche-Modus: Wand nimmt direkte Fläche', () => {
    expect(berechneQuantityFuerItem('Wandflächen streichen', 'm²', { modus: 'flaeche', wandflaeche: 37.5 })).toBe(37.5)
  })

  it('wand-Modus: "Fassadenfläche streichen" nimmt die Wandfläche', () => {
    const dim = { modus: 'wand' as const, laenge: 12, hoehe: 6, fenster: 3 }
    expect(berechneQuantityFuerItem('Fassadenfläche streichen 2x — Südseite', 'm²', dim)).toBe(68.4)
  })

  it('wand-Modus: Grundierung folgt derselben Fläche wie die Fassade', () => {
    const dim = { modus: 'wand' as const, laenge: 12, hoehe: 6, fenster: 3 }
    expect(berechneQuantityFuerItem('Grundierung — Südseite', 'm²', dim)).toBe(68.4)
  })

  it('wand-Modus: Sockelleisten nicht berechenbar (kein Umfang an einer Fassade)', () => {
    const dim = { modus: 'wand' as const, laenge: 12, hoehe: 6 }
    expect(berechneQuantityFuerItem('Sockelleisten abkleben', 'lfdm', dim)).toBeNull()
  })
})
