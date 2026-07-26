import { describe, it, expect } from 'vitest'
import {
  sekundaerGewerk,
  berechneUndPruefeAlleGewerke,
  entferneRedundantenBodenschutz,
} from '../mehrgewerk'
import type { BerechnetePosition } from '../types'

function position(beschreibung: string): BerechnetePosition {
  return {
    beschreibung,
    menge: 15,
    einheit: 'm²',
    konfidenz: 'high',
    berechnungsweg: 'Test',
    annahmen: [],
  }
}

describe('sekundaerGewerk — erkennt das zweite Gewerk im Auftrag', () => {
  it('Maler-Primär + Boden-Arbeiten → boden_parkett', () => {
    expect(sekundaerGewerk('maler', {
      raeume: [{ arbeiten: ['wände streichen'], belag: 'vinyl', altbelag_entfernen: true }],
    })).toBe('boden_parkett')
  })
  it('Boden-Primär + Maler-Arbeiten → maler', () => {
    expect(sekundaerGewerk('boden_parkett', {
      raeume: [{ arbeiten: ['vinyl verlegen', 'wände streichen'] }],
    })).toBe('maler')
  })
  it('reiner Maler-Auftrag → kein zweites Gewerk', () => {
    expect(sekundaerGewerk('maler', { raeume: [{ arbeiten: ['wände streichen', 'decke streichen'] }] })).toBe(null)
  })
  it('reiner Boden-Auftrag → kein zweites Gewerk', () => {
    expect(sekundaerGewerk('boden_parkett', { raeume: [{ arbeiten: ['laminat verlegen'], belag: 'laminat' }] })).toBe(null)
  })
})

describe('berechneUndPruefeAlleGewerke — Maler UND Boden im selben Raum', () => {
  // ECHTER Prod-Fall: KI wählte gewerk=maler und legte die Boden-Arbeiten GAR NICHT
  // in raeume[] ab (kein belag, keine Boden-Arbeiten) — nur der Rohtext verrät es.
  const extraktion = {
    gewerk: 'maler',
    transkript: 'im flur wird gestrichen, wände und decke, 15 quadratmeter, 2,60 hoch. und im gleichen flur kommt neuer vinylboden rein, der alte teppich muss vorher raus.',
    raeume: [{
      name: 'Flur', flaeche: 15, hoehe: 2.6,
      arbeiten: ['wände streichen', 'decke streichen'],
    }],
  }
  const { positionen } = berechneUndPruefeAlleGewerke(
    extraktion as never,
    extraktion.transkript,
    {},
    // Signale wie bei Maler-Extraktion: NUR Maler-Arbeiten, kein Belag/Altbelag —
    // der Boden-Anteil muss allein aus dem Rohtext kommen
    { arbeitenTexte: extraktion.raeume[0].arbeiten, belagText: null, altbelagEntfernen: false },
  )
  const namen = positionen.map(p => p.beschreibung.toLowerCase())

  it('enthält die MALER-Arbeiten', () => {
    expect(namen.some(n => n.includes('wandflächen streichen'))).toBe(true)
    expect(namen.some(n => n.includes('deckenfläche streichen'))).toBe(true)
  })
  it('enthält die BODEN-Arbeiten (das war der gedroppte Teil)', () => {
    expect(namen.some(n => n.includes('vinyl') && n.includes('verlegen'))).toBe(true)
    expect(namen.some(n => n.includes('altbelag entfernen') || n.includes('teppich'))).toBe(true)
  })
  it('keine kaputten Mengen, keine exakten Duplikate', () => {
    for (const p of positionen) {
      expect(Number.isFinite(p.menge)).toBe(true)
      expect(p.menge > 0).toBe(true)
    }
    const keys = positionen.map(p => `${p.beschreibung.toLowerCase()}|${p.menge}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
  it('entfernt den überflüssigen Bodenschutz im neu belegten Raum', () => {
    expect(namen.some(n => n.includes('boden schützen') && n.includes('flur'))).toBe(false)
  })
})

describe('Komplettrenovierung mit Maler- und Bodenarbeiten', () => {
  it('behält alle ausdrücklich genannten Arbeitsschritte', () => {
    const text = 'Wohnzimmer fünf Meter zwanzig lang, vier Meter zehn breit und zwei Meter siebzig hoch. Die alte Raufasertapete muss entfernt werden. Danach werden die Wände gespachtelt, geschliffen, grundiert und zweimal gestrichen. Die Decke wird ebenfalls zweimal gestrichen. Der alte Teppichboden wird entfernt und anschließend Klickvinyl mit Trittschalldämmung verlegt. Es werden achtzehn laufende Meter Sockelleisten montiert. Zwei Fenster und eine Tür.'
    const { positionen } = berechneUndPruefeAlleGewerke({
      gewerk: 'maler', transkript: text,
      raeume: [{
        name: 'Wohnzimmer', laenge: 5.2, breite: 4.1, hoehe: 2.7, flaeche: 21.32,
        fenster: [{ anzahl: 2 }], tueren: [{ anzahl: 1 }],
        arbeiten: ['raufasertapete entfernen', 'waende spachteln', 'waende grundieren', 'waende streichen', 'decke streichen'],
      }],
    } as never, text, {}, {
      arbeitenTexte: ['raufasertapete entfernen', 'waende spachteln', 'waende grundieren', 'waende streichen', 'decke streichen'],
      belagText: null, altbelagEntfernen: false,
    })
    const namen = positionen.map(p => p.beschreibung.toLowerCase())
    for (const erwartet of ['wandflächen streichen', 'deckenfläche streichen', 'spachtel', 'schleifen', 'grundier', 'tapete entfernen', 'altbelag entfernen', 'vinyl', 'trittschall', 'sockelleisten montieren']) {
      expect(namen.some(name => name.includes(erwartet)), `fehlt: ${erwartet}`).toBe(true)
    }
    expect(namen.some(name => name.includes('sockelleisten abkleben'))).toBe(false)
    const sockel = positionen.find(p => /sockelleisten montieren/i.test(p.beschreibung))
    expect(sockel?.menge).toBe(18)
    const trittschall = positionen.find(p => /trittschall/i.test(p.beschreibung))
    expect(trittschall?.menge).toBe(21.32)
  })
})

describe('entferneRedundantenBodenschutz', () => {
  it('entfernt Schutz nur im Raum mit einer Verlegeposition', () => {
    const ergebnis = entferneRedundantenBodenschutz([
      position('Boden schützen — Flur'),
      position('Boden schützen — Wohnzimmer'),
      position('Vinyl-Boden verlegen inkl. 10% Verschnitt — Flur'),
    ])

    expect(ergebnis.map(p => p.beschreibung)).toEqual([
      'Boden schützen — Wohnzimmer',
      'Vinyl-Boden verlegen inkl. 10% Verschnitt — Flur',
    ])
  })

  it('behält pauschalen Bodenschutz ohne eindeutige Raumzuordnung', () => {
    const ergebnis = entferneRedundantenBodenschutz([
      position('Boden schützen / Abdecken'),
      position('Laminat verlegen — Flur'),
    ])

    expect(ergebnis).toHaveLength(2)
  })

  it('wertet reine Bodenaufarbeitung nicht als Neuverlegung', () => {
    const ergebnis = entferneRedundantenBodenschutz([
      position('Boden schützen — Flur'),
      position('Parkett schleifen — Flur'),
    ])

    expect(ergebnis).toHaveLength(2)
  })
})
