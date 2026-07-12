import { describe, it, expect } from 'vitest'
import { malerEngine } from '../gewerke/maler'
import type { BerechnetePosition } from '../types'

function find(positionen: BerechnetePosition[], substr: string) {
  return positionen.find(p => p.beschreibung.toLowerCase().includes(substr.toLowerCase()))
}

describe('Maler-Engine – 10 Integrationstests', () => {
  it('Test 1: Schimmel + Panoramafenster → 20,3 m² netto mit Kalkputz + Silikatfarbe', () => {
    const { positionen } = malerEngine({
      transkript: 'Schimmel behandeln, Panoramafenster 3,5 × 2,2 m, Kalkputz und Silikatfarbe',
      raeume: [{
        name: 'Wohnzimmer',
        wandflaeche_direkt: 28,
        wandflaeche_abzug_m2: 7.7,
        arbeiten: ['streichen'],
      }],
      sonder: [
        { typ: 'schimmelbehandlung', m2: 20.3 },
        { typ: 'kalkputz', m2: 20.3 },
        { typ: 'silikatfarbe', m2: 20.3 },
      ],
    })

    const wand = find(positionen, 'wandflächen')
    expect(wand?.menge).toBeCloseTo(20.3, 1)

    const schimmel = find(positionen, 'schimmelbehandlung')
    expect(schimmel).toBeDefined()
    expect(schimmel?.menge).toBeCloseTo(20.3, 1)

    const kalk = find(positionen, 'kalkputz')
    expect(kalk).toBeDefined()
    expect(kalk?.menge).toBeCloseTo(20.3, 1)

    const silikat = find(positionen, 'silikatfarbe')
    expect(silikat).toBeDefined()
    expect(silikat?.menge).toBeCloseTo(20.3, 1)
  })

  it('Test 2: Flur 45 m² − 4 Türen (6,8 m²) = 38,2 m² Dispersionsfarbe', () => {
    const { positionen } = malerEngine({
      transkript: 'Flur streichen, 4 Türen vorhanden',
      raeume: [{
        name: 'Flur',
        wandflaeche_direkt: 45,
        wandflaeche_abzug_m2: 6.8,
        arbeiten: ['streichen'],
      }],
    })

    const wand = find(positionen, 'wandflächen')
    expect(wand).toBeDefined()
    expect(wand?.menge).toBeCloseTo(38.2, 1)
  })

  it('Test 3: Decke 4×5=20 m², Wände 48 m² Vliestapete, keine Abzüge', () => {
    const { positionen } = malerEngine({
      transkript: 'Wände tapezieren Vliestapete 48 m², Decke streichen, keine Abzüge',
      raeume: [{
        name: 'Wohnzimmer',
        laenge: 4,
        breite: 5,
        wandflaeche_direkt: 48,
        wandflaeche_abzug_m2: 0,
        deckflaeche_direkt: 20,
        arbeiten: ['tapezieren', 'decke streichen'],
      }],
    })

    const wand = find(positionen, 'wandflächen')
    expect(wand).toBeDefined()
    expect(wand?.menge).toBe(48)

    const decke = find(positionen, 'deckenfläche')
    expect(decke).toBeDefined()
    expect(decke?.menge).toBe(20)
  })

  it('Test 4: Fassade 12×8=96 m² mit Gerüst + 15 m² Rissverschluss', () => {
    const { positionen } = malerEngine({
      transkript: 'Fassade 12 × 8 m streichen, Gerüst, Rissverschluss mit Gewebe 15 m²',
      raeume: [{
        name: 'Fassade',
        wandflaeche_direkt: 96,
        wandflaeche_abzug_m2: 0,
        arbeiten: ['streichen'],
      }],
      sonder: [
        { typ: 'geruest' },
        { typ: 'rissversschluss', m2: 15 },
      ],
    })

    const wand = find(positionen, 'wandflächen')
    expect(wand?.menge).toBe(96)

    const geruest = find(positionen, 'gerüst')
    expect(geruest).toBeDefined()
    expect(geruest?.menge).toBe(1)
    expect(geruest?.einheit).toBe('Pauschale')

    const riss = find(positionen, 'rissverschluss')
    expect(riss).toBeDefined()
    expect(riss?.menge).toBe(15)
  })

  it('Test 5: Nikotinsperre 32 m², danach 2× deckend weiß matt', () => {
    const { positionen } = malerEngine({
      transkript: 'Nikotinsperre auftragen, dann 2× weiß matt streichen, 32 m²',
      raeume: [{
        name: 'Schlafzimmer',
        wandflaeche_direkt: 32,
        wandflaeche_abzug_m2: 0,
        arbeiten: ['streichen'],
      }],
      sonder: [
        { typ: 'nikotinsperre', m2: 32 },
      ],
    })

    const wand = find(positionen, 'wandflächen')
    expect(wand?.menge).toBe(32)

    const nikotin = find(positionen, 'nikotinsperre')
    expect(nikotin).toBeDefined()
    expect(nikotin?.menge).toBe(32)
  })

  it('Test 6: 2 Heizkörper schleifen+lackieren, 25 lfdm Fußleisten', () => {
    const { positionen } = malerEngine({
      transkript: '2 Heizkörper schleifen und lackieren, 25 lfdm Fußleisten schleifen und lackieren',
      raeume: [],
      sonder: [
        { typ: 'heizkoerper', anzahl: 2 },
        { typ: 'fussleisten', lfdm: 25 },
      ],
    })

    const hk = find(positionen, 'heizkörper')
    expect(hk).toBeDefined()
    expect(hk?.menge).toBe(2)
    expect(hk?.einheit).toBe('Stück')

    const fl = find(positionen, 'fußleisten')
    expect(fl).toBeDefined()
    expect(fl?.menge).toBe(25)
    expect(fl?.einheit).toBe('lfdm')
  })

  it('Test 7: Material bauseits gestellt — nur Wandflächen-Position, keine Materialposition', () => {
    const { positionen } = malerEngine({
      transkript: 'Wände streichen, Material wird bauseits gestellt, nur Arbeitsleistung',
      raeume: [{
        name: 'Küche',
        wandflaeche_direkt: 36,
        wandflaeche_abzug_m2: 0,
        arbeiten: ['streichen'],
      }],
    })

    // Geometrie-Position vorhanden
    const wand = find(positionen, 'wandflächen')
    expect(wand?.menge).toBe(36)

    // Keine Extra-Materialposition durch "bauseits"
    const material = positionen.find(p => p.beschreibung.toLowerCase().includes('material'))
    expect(material).toBeUndefined()
  })

  it('Test 8: Bautrockner 7 Tage, Anti-Schimmel 12 m², Kalken 40 m²', () => {
    const { positionen } = malerEngine({
      transkript: 'Bautrockner 7 Tage, Anti-Schimmel-Anstrich 12 m², Kalken 40 m²',
      raeume: [],
      sonder: [
        { typ: 'bautrockner', tage: 7 },
        { typ: 'antischimmel', m2: 12 },
        { typ: 'kalken', m2: 40 },
      ],
    })

    const trockner = find(positionen, 'bautrockner')
    expect(trockner).toBeDefined()
    expect(trockner?.menge).toBe(7)
    expect(trockner?.einheit).toBe('Tage')

    const schimmel = find(positionen, 'anti-schimmel')
    expect(schimmel).toBeDefined()
    expect(schimmel?.menge).toBe(12)

    const kalken = find(positionen, 'kalken')
    expect(kalken).toBeDefined()
    expect(kalken?.menge).toBe(40)
  })

  it('Test 9: Spachteltechnik Betonoptik 6,5×3,2=20,8 m² mit Versiegelung', () => {
    const { positionen } = malerEngine({
      transkript: 'Spachteltechnik Betonoptik, 6,5 × 3,2 m = 20,8 m², mit Versiegelung',
      raeume: [],
      sonder: [
        { typ: 'spachteltechnik', m2: 20.8 },
        { typ: 'versiegelung_spachtel', m2: 20.8 },
      ],
    })

    const spachtel = find(positionen, 'spachteltechnik')
    expect(spachtel).toBeDefined()
    expect(spachtel?.menge).toBeCloseTo(20.8, 1)

    const versieg = find(positionen, 'versiegelung')
    expect(versieg).toBeDefined()
    expect(versieg?.menge).toBeCloseTo(20.8, 1)
  })

  it('Test 10: 6 Balken × 4 m = 24 lfdm anschleifen + Lasur transparent', () => {
    const { positionen } = malerEngine({
      transkript: '6 Holzbalken je 4 m, anschleifen und Lasur transparent auftragen',
      raeume: [],
      sonder: [
        { typ: 'holzbalken', anzahl: 6, laenge_m: 4 },
      ],
    })

    const schleifen = find(positionen, 'holzbalken anschleifen')
    expect(schleifen).toBeDefined()
    expect(schleifen?.menge).toBe(24)
    expect(schleifen?.einheit).toBe('lfdm')

    const lasur = find(positionen, 'lasur')
    expect(lasur).toBeDefined()
    expect(lasur?.menge).toBe(24)
    expect(lasur?.einheit).toBe('lfdm')
  })
})

// ─── "nur die Wände" (Beta-Bug: Decke kam trotzdem) ─────────────────────────
describe('Maler-Engine – Scope "nur die Wände"', () => {
  it('"Wohnzimmer nur die Wände, 5×4, 2,60 hoch, 2 Fenster 1 Tür" → KEINE Decke', () => {
    const { positionen } = malerEngine({
      transkript: 'Wohnzimmer streichen, nur die Wände, 5 mal 4 Meter, 2 Fenster, 1 Tür, 2,60 hoch',
      raeume: [{
        name: 'Wohnzimmer', breite: 5, laenge: 4, hoehe: 2.6,
        fenster: [{ anzahl: 2 }], tueren: [{ anzahl: 1 }],
        arbeiten: ['streichen'],
      }],
    })
    expect(find(positionen, 'wandflächen')).toBeDefined()
    expect(find(positionen, 'deckenfläche')).toBeUndefined() // <- der Bug
  })

  it('"nur Wände" ohne "die" funktioniert auch', () => {
    const { positionen } = malerEngine({
      transkript: 'Bad, nur Wände streichen, 3 mal 2, 2,50 hoch',
      raeume: [{ name: 'Bad', breite: 3, laenge: 2, hoehe: 2.5, arbeiten: ['streichen'] }],
    })
    expect(find(positionen, 'deckenfläche')).toBeUndefined()
  })

  it('"nur die Decke" → KEINE Wandflächen', () => {
    const { positionen } = malerEngine({
      transkript: 'Flur, nur die Decke streichen, 4 mal 2, 2,50 hoch',
      raeume: [{ name: 'Flur', breite: 4, laenge: 2, hoehe: 2.5, arbeiten: ['streichen'] }],
    })
    expect(find(positionen, 'deckenfläche')).toBeDefined()
    expect(find(positionen, 'wandflächen')).toBeUndefined()
  })
})

// ─── Freies Sprechen (Beta-Feedback Clemens) ────────────────────────────────
// Handwerker sprechen nicht im Schema "5×4 Meter, 2,60 hoch" sondern erzählen:
// "20 qm Bodenfläche, Decke 3 m hoch, Raufaser abnehmen, dann streichen, spachteln"
describe('Maler-Engine – freies Sprechen (Bodenfläche + Höhe statt L×B)', () => {
  const clemensTranskript =
    'Ich hab hier ein Zimmer, da müssen wir erst die Raufasertapete abnehmen und danach wird noch gestrichen. ' +
    'Wir haben hier 20 Quadratmeter Bodenfläche, die Decke ist 3 Meter hoch. ' +
    'Nach dem Raufasertapete abmachen müssen wir auf jeden Fall auch noch ein bisschen spachteln.'

  function pipeline() {
    const { positionen } = malerEngine({
      transkript: clemensTranskript,
      raeume: [{
        name: 'Zimmer',
        flaeche: 20,
        hoehe: 3,
        arbeiten: ['raufasertapete entfernen', 'streichen', 'spachteln'],
      }],
    })
    return positionen
  }

  it('Wandfläche wird per Quadrat-Annahme aus Bodenfläche + Höhe geschätzt', () => {
    const positionen = pipeline()
    const wand = find(positionen, 'wandflächen')
    expect(wand).toBeDefined()
    // Umfang ≈ 4×√20 = 17,89 → 17,89×3 = 53,67 − Std-Fenster 1,2 − Std-Tür 1,89 ≈ 50,6
    expect(wand!.menge).toBeGreaterThan(45)
    expect(wand!.menge).toBeLessThan(55)
    expect(wand!.konfidenz).toBe('medium')
    expect(wand!.annahmen.join(' ')).toContain('geschätzt')
  })

  it('Decke bekommt die echte Bodenfläche (20 m²)', () => {
    const positionen = pipeline()
    const decke = find(positionen, 'deckenfläche')
    expect(decke?.menge).toBe(20)
  })

  it('Vollständigkeits-Check: Raufaser entfernen + Spachteln mit echter Wandfläche, KEIN neu Aufziehen', async () => {
    const { pruefeUndErgaenzeVollstaendigkeit } = await import('../../vollstaendigkeit/index')
    const enginePositionen = pipeline()
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', enginePositionen, clemensTranskript)

    const entfernen = find(positionen, 'tapete entfern')
    expect(entfernen).toBeDefined()
    expect(entfernen!.menge).toBeGreaterThan(45) // Wandfläche, NICHT die 20 m² Bodenfläche

    // Spachteln kommt als "Spachtelarbeiten Q2 — Zimmer" mit echter Wandfläche
    const spachteln = find(positionen, 'spachtel')
    expect(spachteln).toBeDefined()
    expect(spachteln!.menge).toBeGreaterThan(45)

    // Er will NICHT neu tapezieren — nur abnehmen und streichen
    const aufziehen = find(positionen, 'aufziehen')
    expect(aufziehen).toBeUndefined()

    // Keine Position mit Menge 0 oder null
    for (const p of positionen) {
      expect(p.menge, `"${p.beschreibung}" hat keine Menge`).toBeGreaterThan(0)
    }
  })
})
