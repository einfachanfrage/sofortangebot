import { describe, it, expect } from 'vitest'
import {
  erkenneArbeiten, hatArbeit, erkenneScope,
  erkenneRaumkontext, erkenneOeffnungen, istKomplett, hatAkzentwand,
} from '../arbeiten-normalisierer'

describe('erkenneArbeiten — streichen (Flexionen & Umgangssprache)', () => {
  it.each([
    'Wände streichen',
    'danach wird noch gestrichen',        // Partizip — der Clemens-Bug!
    'wir streichen das Wohnzimmer',
    'ein neuer Anstrich muss her',
    'alles anstreichen bitte',
    'die Decke wird angemalt',
    'wird einmal gepinselt',
    'Farbe drauf und fertig',
    'wir wollen die Küche weißeln',
  ])('"%s" → streichen', (text) => {
    expect(hatArbeit(text, 'streichen')).toBe(true)
  })

  it('erkennt streichen NICHT in "Tapete abnehmen"', () => {
    expect(hatArbeit('Tapete abnehmen und entsorgen', 'streichen')).toBe(false)
  })
})

describe('erkenneArbeiten — tapete_entfernen (Satz-Ko-Okkurrenz)', () => {
  it.each([
    'die Raufasertapete abnehmen',
    'erst die Raufasertapete abnehmen und danach wird gestrichen',
    'die alte Tapete muss runter',
    'Tapete wird abgerissen',
    'wir müssen die Raufaser entfernen',
    'Tapete abmachen, dann weiter',
    'die Tapete kommt ab',
    'alte Tapete abziehen',
  ])('"%s" → tapete_entfernen', (text) => {
    expect(hatArbeit(text, 'tapete_entfernen')).toBe(true)
  })

  it('NICHT wenn Subjekt und Aktion in verschiedenen Sätzen', () => {
    expect(hatArbeit('Die Tapete ist schön. Wir müssen den Teppich entfernen.', 'tapete_entfernen')).toBe(false)
  })

  it('NICHT bei bloßer Tapeten-Erwähnung', () => {
    expect(hatArbeit('die Raufasertapete bleibt dran', 'tapete_entfernen')).toBe(false)
  })
})

describe('erkenneArbeiten — tapezieren (nur echtes Neu-Aufziehen)', () => {
  it.each([
    'neue Raufaser aufziehen',
    'Wände tapezieren mit Vliestapete',
    'wir bringen neue Tapete an',
    'Raufaser neu machen',
  ])('"%s" → tapezieren', (text) => {
    expect(hatArbeit(text, 'tapezieren')).toBe(true)
  })

  it('NICHT bei "abnehmen und neu streichen" (neu ≠ neu tapezieren)', () => {
    const kat = erkenneArbeiten('Raufaser abnehmen und neu streichen')
    expect(kat.has('tapete_entfernen')).toBe(true)
    expect(kat.has('streichen')).toBe(true)
    expect(kat.has('tapezieren')).toBe(false)
  })

  it('erkennt BEIDES bei "alte runter, neue drauf"', () => {
    const kat = erkenneArbeiten('alte Raufaser abnehmen, neue Raufaser aufziehen und streichen')
    expect(kat.has('tapete_entfernen')).toBe(true)
    expect(kat.has('tapezieren')).toBe(true)
  })
})

describe('erkenneArbeiten — spachteln', () => {
  it.each([
    'ein bisschen spachteln müssen wir noch',
    'die Wände werden verspachtelt',
    'alles glätten auf Q3',
    'gespachtelt wird nächste Woche',
  ])('"%s" → spachteln', (text) => {
    expect(hatArbeit(text, 'spachteln')).toBe(true)
  })
})

describe('erkenneArbeiten — lackieren / schleifen / grundieren', () => {
  it.each([
    ['Türen lackieren', 'lackieren'],
    ['die Zargen werden lackiert', 'lackieren'],
    ['Heizkörper neu lacken', 'lackieren'],
    ['Balken mit Lasur behandeln', 'lackieren'],
    ['Fenster abschleifen', 'schleifen'],
    ['erst anschleifen, dann lackieren', 'schleifen'],
    ['Dielen abgeschliffen', 'schleifen'],
    ['Wände grundieren', 'grundieren'],
    ['ein Voranstrich muss drauf', 'grundieren'],
  ] as const)('"%s" → %s', (text, kat) => {
    expect(hatArbeit(text, kat)).toBe(true)
  })
})

describe('erkenneRaumkontext', () => {
  it('Keller', () => { expect(erkenneRaumkontext('im Keller streichen').istKeller).toBe(true) })
  it('Souterrain', () => { expect(erkenneRaumkontext('Souterrain-Wohnung').istKeller).toBe(true) })
  it('Garage', () => { expect(erkenneRaumkontext('Garage weiß streichen').istGarage).toBe(true) })
  it('Dachschräge', () => { expect(erkenneRaumkontext('mit Dachschräge').istDachschraege).toBe(true) })
  it('Mansarde', () => { expect(erkenneRaumkontext('Mansardenzimmer').istDachschraege).toBe(true) })
  it('Fassade', () => { expect(erkenneRaumkontext('Fassade neu').istFassade).toBe(true) })
  it('normaler Raum → nichts', () => {
    const k = erkenneRaumkontext('Wohnzimmer streichen')
    expect(k.istKeller || k.istGarage || k.istDachschraege || k.istFassade).toBe(false)
  })
})

describe('erkenneOeffnungen — kein Fenster / keine Tür', () => {
  it.each(['kein Fenster', 'keine Fenster', 'ohne Fenster', 'fensterlos', '0 Fenster'])(
    '"%s" → keinFenster', (t) => { expect(erkenneOeffnungen(t).keinFenster).toBe(true) })
  it.each(['keine Tür', 'ohne Türen', 'kein Eingang', 'türlos'])(
    '"%s" → keineTuer', (t) => { expect(erkenneOeffnungen(t).keineTuer).toBe(true) })
  it('"2 Fenster, 1 Tür" → keine Negation', () => {
    const o = erkenneOeffnungen('2 Fenster, 1 Tür')
    expect(o.keinFenster).toBe(false)
    expect(o.keineTuer).toBe(false)
  })
})

describe('istKomplett & hatAkzentwand', () => {
  it.each(['komplett streichen', 'alles neu', 'ganze Wohnung', 'vollständig'])(
    '"%s" → komplett', (t) => { expect(istKomplett(t)).toBe(true) })
  it('"nur die Wände" → nicht komplett', () => { expect(istKomplett('nur die Wände')).toBe(false) })
  it.each(['Akzentwand tapezieren', 'eine Wand betonen', '1 Wand anders'])(
    '"%s" → Akzentwand', (t) => { expect(hatAkzentwand(t)).toBe(true) })
})

describe('erkenneScope — nur Wände / Decke / Boden (alle Flexionen)', () => {
  it.each([
    'Wohnzimmer streichen, nur die Wände, 5 mal 4 Meter',  // der Beta-Bug
    'nur Wände streichen',
    'bloß die Wände',
    'lediglich die Wände neu',
    'ausschließlich die Wände',
    'nur an den Wänden was machen',
    'nur die Wand im Flur',
    'Wände streichen, ohne Decke',
    'Wände ja, keine Decke',
  ])('"%s" → nurWaende', (text) => {
    expect(erkenneScope(text).nurWaende).toBe(true)
  })

  it.each([
    'nur die Decke streichen',
    'bloß die Decke',
    'nur Decke',
    'Decke streichen, ohne Wände',
  ])('"%s" → nurDecke', (text) => {
    expect(erkenneScope(text).nurDecke).toBe(true)
  })

  it.each([
    'nur den Boden streichen',
    'nur Boden',
    'bloß der Boden',
  ])('"%s" → nurBoden', (text) => {
    expect(erkenneScope(text).nurBoden).toBe(true)
  })

  it('komplett streichen → keine Einschränkung', () => {
    const s = erkenneScope('Wohnzimmer komplett streichen, Wände und Decke')
    expect(s.nurWaende).toBe(false)
    expect(s.nurDecke).toBe(false)
    expect(s.nurBoden).toBe(false)
  })

  it('"Decke streichen, Wände nicht" wird NICHT fälschlich zu nurWaende', () => {
    // Negation nur bei eindeutigem "ohne/keine X" — nicht bei "... nicht"
    const s = erkenneScope('Decke streichen, Wände nicht')
    expect(s.nurWaende).toBe(false)
  })

  it('widersprüchliche Angaben (nur Wände UND nur Decke) → keine exklusive Wahl', () => {
    const s = erkenneScope('erster Raum nur die Wände, zweiter Raum nur die Decke')
    expect(s.nurWaende).toBe(false)
    expect(s.nurDecke).toBe(false)
  })
})

describe('Clemens-Transkript komplett', () => {
  it('erkennt alle drei Arbeiten, KEIN tapezieren', () => {
    const kat = erkenneArbeiten(
      'Ich hab hier ein Zimmer, da müssen wir erst die Raufasertapete abnehmen und danach wird noch gestrichen. ' +
      'Wir haben hier 20 Quadratmeter Bodenfläche, die Decke ist 3 Meter hoch. ' +
      'Nach dem Raufasertapete abmachen müssen wir auf jeden Fall auch noch ein bisschen spachteln.'
    )
    expect(kat.has('tapete_entfernen')).toBe(true)
    expect(kat.has('streichen')).toBe(true)
    expect(kat.has('spachteln')).toBe(true)
    expect(kat.has('tapezieren')).toBe(false)
  })
})
