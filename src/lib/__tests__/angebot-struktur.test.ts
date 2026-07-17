import { describe, it, expect } from 'vitest'
import { gruppiereNachStruktur } from '../angebot-struktur'

function item(id: string, title: string, preis = 100) {
  return { id, title, description: null, quantity: 1, unit: 'm²', unit_price: preis, total_price: preis, position: Number(id) }
}

const MALER_JOB = [
  item('1', 'Sockelleisten abkleben — Wohnzimmer'),
  item('2', 'Tapete entfernen — Wohnzimmer'),
  item('3', 'Wände spachteln / glätten — Wohnzimmer'),
  item('4', 'Wandflächen streichen — Wohnzimmer'),
  item('5', 'Kleinmaterial und Verbrauchsmaterial'),
]

const GEMISCHT = [
  item('1', 'Wandflächen streichen — Flur'),
  item('2', 'Tapete entfernen — Flur'),
  item('3', 'Vinyl-Boden verlegen — Flur'),
  item('4', 'Altbelag entfernen — Flur'),
  item('5', 'Sockelleisten montieren — Flur'),
  item('6', 'An- und Abfahrt'),
]

describe('gruppiereNachStruktur — nach Räumen (Default)', () => {
  it('gruppiert wie bisher nach Raum', () => {
    const g = gruppiereNachStruktur(MALER_JOB, 'raeume')!
    expect(g.raeume[0].raumName).toBe('Wohnzimmer')
    expect(g.allgemein.map(i => i.title)).toEqual(['Kleinmaterial und Verbrauchsmaterial'])
  })
})

describe('gruppiereNachStruktur — nach Arbeitsablauf', () => {
  const g = gruppiereNachStruktur(MALER_JOB, 'arbeitsablauf')!

  it('Reihenfolge: Vorarbeiten → Hauptarbeit → Abschluss', () => {
    expect(g.raeume.map(r => r.raumName)).toEqual(['Vorarbeiten', 'Hauptarbeit'])
  })
  it('Abkleben/Tapete/Spachteln sind Vorarbeiten', () => {
    const vor = g.raeume.find(r => r.raumName === 'Vorarbeiten')!.items.map(i => i.title)
    expect(vor).toEqual(expect.arrayContaining([
      'Sockelleisten abkleben — Wohnzimmer',
      'Tapete entfernen — Wohnzimmer',
      'Wände spachteln / glätten — Wohnzimmer',
    ]))
  })
  it('Streichen ist Hauptarbeit', () => {
    const haupt = g.raeume.find(r => r.raumName === 'Hauptarbeit')!.items.map(i => i.title)
    expect(haupt).toContain('Wandflächen streichen — Wohnzimmer')
  })
  it('Kleinmaterial bleibt Allgemein', () => {
    expect(g.allgemein.map(i => i.title)).toEqual(['Kleinmaterial und Verbrauchsmaterial'])
  })
  it('Sockelleisten MONTIEREN ist Abschluss (nicht Vorarbeit-Abkleben)', () => {
    const g2 = gruppiereNachStruktur([item('1', 'Sockelleisten montieren — Flur')], 'arbeitsablauf')!
    expect(g2.raeume[0].raumName).toBe('Abschluss')
  })
})

describe('gruppiereNachStruktur — nach Gewerk', () => {
  const g = gruppiereNachStruktur(GEMISCHT, 'gewerk')!

  it('trennt Maler- und Bodenarbeiten, Maler zuerst', () => {
    expect(g.raeume.map(r => r.raumName)).toEqual(['Malerarbeiten', 'Bodenarbeiten'])
  })
  it('Streichen/Tapete → Maler', () => {
    const maler = g.raeume.find(r => r.raumName === 'Malerarbeiten')!.items.map(i => i.title)
    expect(maler).toEqual(expect.arrayContaining(['Wandflächen streichen — Flur', 'Tapete entfernen — Flur']))
  })
  it('Verlegen/Altbelag/Sockelleisten montieren → Boden', () => {
    const boden = g.raeume.find(r => r.raumName === 'Bodenarbeiten')!.items.map(i => i.title)
    expect(boden).toEqual(expect.arrayContaining([
      'Vinyl-Boden verlegen — Flur',
      'Altbelag entfernen — Flur',
      'Sockelleisten montieren — Flur',
    ]))
  })
  it('Anfahrt bleibt Allgemein', () => {
    expect(g.allgemein.map(i => i.title)).toEqual(['An- und Abfahrt'])
  })
})
