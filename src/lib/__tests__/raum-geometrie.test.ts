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
  // ── Soll korrigiert am 07.09.2026 (PM-031) ───────────────────────────
  // Hier stand 42,51 m² — Umfang × Höhe minus JEDER Öffnung. Das war der
  // Stand vor der VOB-Übermessung (21.08.). Tür 1,89 m² und Fenster je
  // 1,20 m² liegen alle unter 2,5 m² und werden nach DIN 18363 5.2.3 nicht
  // abgezogen. Die Engine rechnet seit August so; diese Datei nicht, und
  // dieser Test hat den alten Stand festgehalten statt ihn zu melden.
  it('rechteck: Öffnungen bis 2,5 m² werden übermessen (DIN 18363 5.2.3)', () => {
    const m = berechneRaumMasse({ modus: 'rechteck', breite: 5, laenge: 4, hoehe: 2.6, tueren: 1, fenster: 2 })
    // Umfang 18 × 2,6 = 46,80 — kein Abzug, alle drei Öffnungen ≤ 2,5 m²
    expect(m.umfang).toBe(18)
    expect(m.wandflaeche).toBe(46.8)
    expect(m.bodenflaeche).toBe(20)
  })

  // Die Gegenrichtung: Eine Öffnung ÜBER der Schwelle wird weiterhin voll
  // abgezogen. Ohne diesen Fall würde der Test nur „zieht nie ab" festhalten.
  it('rechteck: eine Terrassentür über 2,5 m² wird voll abgezogen', () => {
    const m = berechneRaumMasse({
      modus: 'rechteck', breite: 5, laenge: 4, hoehe: 2.6, tueren: 1, fenster: 0, tuerFlaeche: 4.2,
    })
    expect(m.wandflaeche).toBe(42.6) // 46,80 − 4,20
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
    // Umfang 18 × 2,5 = 45,00 — Tür 1,89 und Fenster 1,20 beide übermessen
    expect(m.umfang).toBe(18)
    expect(m.wandflaeche).toBe(45)
    expect(m.bodenflaeche).toBe(16)
  })

  it('wand (PM-008/PD-003): Länge × Höhe, kein Boden, kein Umfang', () => {
    const m = berechneRaumMasse({ modus: 'wand', laenge: 12, hoehe: 6, fenster: 3 })
    // 12 × 6 = 72 — drei Fenster à 1,20 m², alle übermessen
    expect(m.wandflaeche).toBe(72)
    expect(m.bodenflaeche).toBeNull()
    expect(m.umfang).toBeNull()
  })

  it('wand: eine Tür wird genauso behandelt wie bei einem Raum', () => {
    const m = berechneRaumMasse({ modus: 'wand', laenge: 10, hoehe: 3, tueren: 1 })
    expect(m.wandflaeche).toBe(30) // 1,89 m² ≤ 2,5 m², kein Abzug
  })

  // Der Originalfall des Prüfmeisters, Zahl für Zahl.
  it('PM-031: Fassade 10 × 5 mit zwei Fenstern à 1,68 m² ergibt 50,00 m²', () => {
    const m = berechneRaumMasse({ modus: 'wand', laenge: 10, hoehe: 5, fenster: 2, fensterFlaeche: 3.36 })
    expect(m.wandflaeche).toBe(50)
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

  // PM-008-Nachtest 6 (2026-08-19): Sandys Fund — 3 Fenster à echten 1,20×1,40m
  // (= 1,68 m² je Fenster, nicht das Standardmaß 1,20×1,00m = 1,20 m²)
  // rechneten in der Bearbeiten-Ansicht bisher trotzdem mit dem Standardmaß
  // (68,40 statt korrekt 66,96 m²), obwohl die ursprüngliche, korrekt
  // bepreiste Position (Mengen-Engine, maler.ts) die echten Maße kannte.
  // fensterFlaeche/tuerFlaeche geben genau diese echte, schon aufsummierte
  // Fläche weiter und ersetzen dann den Stückzahl×Standard-Abzug.
  // Die echten Maße entscheiden weiterhin — jetzt aber darüber, ob die
  // Schwelle gerissen wird, nicht mehr nur über die Höhe des Abzugs.
  it('wand mit echter fensterFlaeche: 3 × 1,68 m² bleiben unter der Schwelle', () => {
    const mEcht = berechneRaumMasse({
      modus: 'wand', laenge: 12, hoehe: 6, fenster: 3, fensterFlaeche: 3 * 1.2 * 1.4,
    })
    expect(mEcht.wandflaeche).toBe(72)
  })

  it('wand mit drei Schaufenstern à 4,00 m²: über der Schwelle, voll abgezogen', () => {
    const m = berechneRaumMasse({ modus: 'wand', laenge: 12, hoehe: 6, fenster: 3, fensterFlaeche: 12 })
    expect(m.wandflaeche).toBe(60) // 72 − 12
  })

  // Die Einzelgröße entscheidet, nicht die Summe (DIN 18363 5.2.3).
  it('vier Fenster à 1,68 m² sind vier kleine Öffnungen, keine große von 6,72 m²', () => {
    const m = berechneRaumMasse({ modus: 'wand', laenge: 12, hoehe: 6, fenster: 4, fensterFlaeche: 6.72 })
    expect(m.wandflaeche).toBe(72)
  })

  it('rechteck mit echter tuerFlaeche unter der Schwelle: kein Abzug', () => {
    const m = berechneRaumMasse({
      modus: 'rechteck', breite: 5, laenge: 4, hoehe: 2.6, tueren: 1, fenster: 0, tuerFlaeche: 2.2,
    })
    expect(m.wandflaeche).toBe(46.8)
  })
})

describe('berechneQuantityFuerItem — Positions-Mapping', () => {
  const rechteck = { modus: 'rechteck' as const, breite: 5, laenge: 4, hoehe: 2.5, tueren: 1, fenster: 2 }

  it('Wandflächen streichen → Wandfläche', () => {
    expect(berechneQuantityFuerItem('Wandflächen streichen', 'm²', rechteck)).toBe(45) // 18 × 2,5
  })

  // PM-031, der teure Teil: Diese Funktion rechnet die MENGE neu, sobald der
  // Handwerker ein Raummaß korrigiert. Vorher stand hier 45,93 m² — die
  // Engine liefert für denselben Raum 50,22 m². Wer sein Maß nachbesserte,
  // verlor 4,29 m² (rund 49 €) und merkte es nicht.
  it('nach dem Bearbeiten steht dieselbe Menge da wie aus der Engine: 50,22 m²', () => {
    const dim = { modus: 'rechteck' as const, breite: 4.1, laenge: 5.2, hoehe: 2.7, tueren: 1, fenster: 2 }
    expect(berechneRaumMasse(dim).wandflaeche).toBe(50.22)
    for (const titel of [
      'Wandflächen streichen 2x',
      'Spachtelarbeiten Q2',
      'Schleifen',
      'Voranstrich / Grundierung',
      'Tapete entfernen',
    ]) {
      expect(berechneQuantityFuerItem(titel, 'm²', dim), titel).toBe(50.22)
    }
  })
  it('Deckenfläche streichen → Bodenfläche', () => {
    expect(berechneQuantityFuerItem('Deckenfläche streichen', 'm²', rechteck)).toBe(20)
  })
  // VOB-012 (DIN 18363/18365 5.3.2): Unterbrechungen bis 1 m Einzellänge
  // werden nicht abgezogen. Eine Zimmertür ist 0,90 m breit. Vorher zog diese
  // Datei jede Tür ab — 18,00 wurden beim Bearbeiten zu 17,10 lfdm.
  it('Sockelleisten: die Zimmertür wird nicht abgezogen (VOB-012)', () => {
    expect(berechneQuantityFuerItem('Sockelleisten abkleben', 'lfdm', rechteck)).toBe(18)
  })

  it('Sockelleisten: eine Terrassentür über 1 m wird abgezogen', () => {
    // 4,20 m² / 2,10 m Standardhöhe = 2,00 m Breite
    const dim = { ...rechteck, tueren: 1, tuerFlaeche: 4.2 }
    expect(berechneQuantityFuerItem('Sockelleisten abkleben', 'lfdm', dim)).toBe(16)
  })
  it('flaeche-Modus: Sockelleisten nicht berechenbar (kein Umfang)', () => {
    expect(berechneQuantityFuerItem('Sockelleisten abkleben', 'lfdm', { modus: 'flaeche', wandflaeche: 40 })).toBeNull()
  })
  it('flaeche-Modus: Wand nimmt direkte Fläche', () => {
    expect(berechneQuantityFuerItem('Wandflächen streichen', 'm²', { modus: 'flaeche', wandflaeche: 37.5 })).toBe(37.5)
  })

  it('wand-Modus: "Fassadenfläche streichen" nimmt die Wandfläche', () => {
    const dim = { modus: 'wand' as const, laenge: 12, hoehe: 6, fenster: 3 }
    expect(berechneQuantityFuerItem('Fassadenfläche streichen 2x — Südseite', 'm²', dim)).toBe(72)
  })

  it('wand-Modus: Grundierung folgt derselben Fläche wie die Fassade', () => {
    const dim = { modus: 'wand' as const, laenge: 12, hoehe: 6, fenster: 3 }
    expect(berechneQuantityFuerItem('Grundierung — Südseite', 'm²', dim)).toBe(72)
  })

  it('wand-Modus: die echte Fensterfläche entscheidet über die Schwelle (PM-008-Nachtest 6)', () => {
    const klein = { modus: 'wand' as const, laenge: 12, hoehe: 6, fenster: 3, fensterFlaeche: 3 * 1.2 * 1.4 }
    expect(berechneQuantityFuerItem('Fassadenfläche streichen 2x — Südseite', 'm²', klein)).toBe(72)
    const gross = { modus: 'wand' as const, laenge: 12, hoehe: 6, fenster: 3, fensterFlaeche: 12 }
    expect(berechneQuantityFuerItem('Fassadenfläche streichen 2x — Südseite', 'm²', gross)).toBe(60)
  })

  it('wand-Modus: Sockelleisten nicht berechenbar (kein Umfang an einer Fassade)', () => {
    const dim = { modus: 'wand' as const, laenge: 12, hoehe: 6 }
    expect(berechneQuantityFuerItem('Sockelleisten abkleben', 'lfdm', dim)).toBeNull()
  })
})

// ── PM-031: die Bearbeiten-Ansicht darf nie wieder von der Engine abweichen ──
//
// Der eigentliche Schaden war nicht der Erklärtext, sondern dass
// `berechneQuantityFuerItem` beim Korrigieren eines Raummaßes die MENGE ohne
// die VOB-Regeln neu rechnete. Dieser Wächter vergleicht beide Wege direkt:
// Was die Engine beim Anlegen rechnet, muss beim Bearbeiten wieder herauskommen.
import { malerEngine } from '../mengen/gewerke/maler'

describe('PM-031 — Engine und Bearbeiten-Ansicht rechnen dieselbe Menge', () => {
  const faelle = [
    { name: 'Büro', laenge: 5.2, breite: 4.1, hoehe: 2.7, fenster: 2, tueren: 1 },
    { name: 'Küche', laenge: 4.2, breite: 3.6, hoehe: 2.5, fenster: 2, tueren: 1 },
    { name: 'Abstellraum', laenge: 2, breite: 1.5, hoehe: 2.4, fenster: 0, tueren: 1 },
  ]

  for (const f of faelle) {
    it(`${f.name}: Wandfläche und Sockelleisten stimmen auf beiden Wegen überein`, () => {
      const positionen = malerEngine({
        transkript: `${f.name} streichen.`,
        raeume: [{
          name: f.name, laenge: f.laenge, breite: f.breite, hoehe: f.hoehe,
          fenster: f.fenster > 0 ? [{ breite: 1.2, hoehe: 1.0, anzahl: f.fenster }] : [],
          tueren: f.tueren > 0 ? [{ breite: 0.9, hoehe: 2.1, anzahl: f.tueren }] : [],
          arbeiten: ['wände streichen'],
        }],
      } as never).positionen

      const dim = {
        modus: 'rechteck' as const, breite: f.breite, laenge: f.laenge, hoehe: f.hoehe,
        tueren: f.tueren, fenster: f.fenster,
      }
      const ausEngine = (m: RegExp) => positionen.find(p => m.test(p.beschreibung))?.menge
      expect(berechneQuantityFuerItem('Wandflächen streichen 2x', 'm²', dim))
        .toBe(ausEngine(/wandflächen streichen/i))
      expect(berechneQuantityFuerItem('Sockelleisten abkleben', 'lfdm', dim))
        .toBe(ausEngine(/sockelleisten abkleben/i))
    })
  }
})
