import { describe, it, expect } from 'vitest'
import { sekundaerGewerk, berechneUndPruefeAlleGewerke } from '../mehrgewerk'

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
  // Der Beta-Fall: "Im Flur streichen (Wände+Decke) UND neuen Vinylboden, alter Teppich raus"
  const extraktion = {
    gewerk: 'maler',
    transkript: 'im flur wird gestrichen, wände und decke, 15 quadratmeter, 2,60 hoch. neuer vinylboden, alter teppich raus.',
    raeume: [{
      name: 'Flur', flaeche: 15, hoehe: 2.6,
      arbeiten: ['wände streichen', 'decke streichen', 'teppich entfernen', 'vinyl verlegen'],
      belag: 'vinyl', altbelag_entfernen: true, sockelleisten: true,
    }],
  }
  const { positionen } = berechneUndPruefeAlleGewerke(
    extraktion as never,
    extraktion.transkript,
    {},
    { arbeitenTexte: extraktion.raeume[0].arbeiten, belagText: 'vinyl', altbelagEntfernen: true },
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
})
