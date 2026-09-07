import { describe, it, expect } from 'vitest'
import {
  nichtStreichbarerWerkstoff, brauchtVorlack, farbtonWieWand, sockelIstMineralisch,
} from '../lack-untergrund'
import { materialFuerPosition } from '../material-mapping'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit'
import { malerEngine } from '../mengen/gewerke/maler'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import type { BerechnetePosition } from '../mengen/types'

// ── Antwort des Prüfmeisters, 07.09.2026 ──────────────────────────────────
//
// „Der Farbwunsch bestimmt den Farbton. Der Untergrund bestimmt das Material."
//
// Vier Positionen, vier Materialien — heute hatte keine davon eine passende
// Zeile: Für „Sockelleisten streichen" und „Fensterbänke streichen" gab es
// gar keine Regel, die Leibungsregel schickte beide Richtungen auf Wandfarbe,
// und die Auffangregel /\blackier/ hätte „Lack" mit Einheit *Stück* geliefert.

describe('Die vier Materialzeilen aus der Entscheidung', () => {
  const soll: Array<[string, string, string]> = [
    ['Sockelleisten streichen — Esszimmer', 'Lack (Weißlack / Buntlack)', 'lfdm'],
    ['Fensterbänke streichen — Büro', 'Lack', 'm²'],
    ['Fenster Innenleibungen streichen — Büro', 'Wandfarbe', 'm²'],
    ['Fensterleibungen streichen — Nordseite', 'Fassadenfarbe', 'm²'],
  ]

  for (const [titel, name, unit] of soll) {
    it(`${titel.split(' — ')[0]} → ${name} (${unit})`, () => {
      expect(materialFuerPosition(titel)).toEqual({ name, unit })
    })
  }

  // Die Türleibung ist innen, auch wenn „Fenster" nicht im Titel steht.
  it('Türleibungen sind innen und bekommen Wandfarbe', () => {
    expect(materialFuerPosition('Türleibungen streichen — Flur')?.name).toBe('Wandfarbe')
  })

  // Die Zuordnung hängt an den Titeln, die maler.ts erzeugt. Ändert dort
  // jemand ein Wort, kippt hier still das Material — deshalb dieser Wächter.
  it('die drei Engine-Titel treffen genau ihr Material', () => {
    expect(materialFuerPosition('Fenster Innenleibungen streichen')?.name).toBe('Wandfarbe')
    expect(materialFuerPosition('Türleibungen streichen')?.name).toBe('Wandfarbe')
    expect(materialFuerPosition('Fensterleibungen streichen')?.name).toBe('Fassadenfarbe')
  })

  // Innen wie außen 45,00 €/m²: Der Unterschied in der Zugänglichkeit ist ein
  // Erschwernis und steckt schon im Zuschlag „Raumhöhe > 3 m", der bei der
  // Fassade ohnehin greift. Zweimal dieselbe Erschwernis wäre doppelt.
  it('der Satz bleibt innen wie außen gleich', () => {
    const katalog = DEFAULT_PRICES.map((p, i) => ({
      id: String(i), title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
    }))
    const preis = (t: string) => findePreisposition(t, 'm²', katalog)?.position.unit_price
    expect(preis('Fenster Innenleibungen streichen — Büro')).toBe(45)
    expect(preis('Fensterleibungen streichen — Nordseite')).toBe(45)
  })
})

describe('Die beiden Ausnahmen, damit die Regel nicht zu breit wird', () => {
  it('ein geputzter Sockel ist kein Holzbauteil und bekommt Dispersion', () => {
    expect(sockelIstMineralisch('Der Sockel ist geputzt, wird mitgestrichen.')).toBe(true)
    expect(materialFuerPosition('Sockelleisten streichen — Flur', 'Sockel ist geputzt/gespachtelt, kein Holzbauteil'))
      .toEqual({ name: 'Wandfarbe', unit: 'lfdm' })
  })

  it('folierte, PVC- und Natursteinteile werden erkannt', () => {
    expect(nichtStreichbarerWerkstoff('Die Sockelleisten sind foliert, sollen gestrichen werden.')).toBeTruthy()
    expect(nichtStreichbarerWerkstoff('Die Fensterbänke aus Naturstein werden auch gestrichen.')).toBeTruthy()
    expect(nichtStreichbarerWerkstoff('Fensterbänke aus PVC streichen.')).toBeTruthy()
  })

  // Satzweise geprüft, damit ein Werkstoff nicht in einen fremden Raum blutet
  // — dieselbe Lehre wie PM-033.
  it('ein Werkstoff drei Sätze weiter zählt nicht', () => {
    expect(nichtStreichbarerWerkstoff('Im Bad liegt Naturstein. Die Fensterbänke im Büro werden gestrichen.'))
      .toBeNull()
  })

  it('normales Holz löst nichts aus', () => {
    expect(nichtStreichbarerWerkstoff('Fensterbänke streichen, ganz normal Holz.')).toBeNull()
    expect(sockelIstMineralisch('Die Sockelleisten werden mitgestrichen.')).toBe(false)
  })
})

describe('Vorlack auf rohem Holz', () => {
  it('roh, abgelaugt und neu lösen den Vorlack aus', () => {
    expect(brauchtVorlack('Neue Sockelleisten montieren und danach streichen.')).toBe(true)
    expect(brauchtVorlack('Die Sockelleisten sind abgelaugt und werden gestrichen.')).toBe(true)
    expect(brauchtVorlack('Fensterbänke aus rohem Holz streichen.')).toBe(true)
  })

  it('vorhandene, lackierte Leisten brauchen keinen', () => {
    expect(brauchtVorlack('Die Sockelleisten bleiben und werden mitgestrichen.')).toBe(false)
  })

  // Bei der Fensterbank entsteht eine eigene Vorschlagsposition — dieselbe
  // Fachlogik und dieselbe Kennzeichnung wie die Grundierung nach einer
  // Q2-Vollflächenspachtelung. Einheit m², passend zum Katalogeintrag.
  it('die Fensterbank bekommt „Holzbauteil grundieren" als Vorschlag', () => {
    const positionen = malerEngine({
      transkript: 'Büro, 5 mal 4 Meter, Höhe 2,60. Wände zweimal streichen. Zwei Fenster, jeweils eins '
        + 'zwanzig mal einen Meter, die Leibungen werden mitgestrichen, fünfundzwanzig Zentimeter tief. '
        + 'Die Fensterbänke sind aus rohem Holz und werden auch gestrichen.',
      raeume: [{
        name: 'Büro', laenge: 5, breite: 4, hoehe: 2.6,
        fenster: [{ breite: 1.2, hoehe: 1.0, anzahl: 2 }], tueren: [],
        arbeiten: ['wände streichen'],
        leibungen: [{ anzahl: 2, breite: 1.2, hoehe: 1.0, tiefe: 0.25, typ: 'fenster_innen' }],
      }],
      leibungen: [{ anzahl: 2, breite: 1.2, hoehe: 1.0, tiefe: 0.25, typ: 'fenster_innen' }],
    } as never).positionen

    const bank = positionen.find(p => /fensterbänke streichen/i.test(p.beschreibung))
    const grund = positionen.find(p => /holzbauteil grundieren/i.test(p.beschreibung))
    expect(bank?.menge).toBe(0.6)
    expect(grund?.menge).toBe(bank?.menge)
    expect(grund?.einheit).toBe('m²')
    expect(grund?.automatisch_ergaenzt).toBe(true)
  })

  it('ohne rohes Holz entsteht keine Grundierung', () => {
    const positionen = malerEngine({
      transkript: 'Büro, 5 mal 4 Meter, Höhe 2,60. Wände zweimal streichen. Zwei Fenster, die Leibungen '
        + 'werden mitgestrichen, 25 cm tief. Die Fensterbänke werden auch gestrichen.',
      raeume: [{
        name: 'Büro', laenge: 5, breite: 4, hoehe: 2.6,
        fenster: [{ breite: 1.2, hoehe: 1.0, anzahl: 2 }], tueren: [], arbeiten: ['wände streichen'],
      }],
      leibungen: [{ anzahl: 2, breite: 1.2, hoehe: 1.0, tiefe: 0.25, typ: 'fenster_innen' }],
    } as never).positionen
    expect(positionen.some(p => /holzbauteil grundieren/i.test(p.beschreibung))).toBe(false)
  })
})

describe('PM-012 — „Sockel in Wandfarbe" wird erfüllt, aber mit Lack', () => {
  const PM012 = 'Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber. '
    + 'Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, die NICHT demontiert — '
    + 'die sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand.'

  const basis: BerechnetePosition[] = [
    { beschreibung: 'Wandflächen streichen 2x — Esszimmer', menge: 38.25, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
    { beschreibung: 'Sockelleisten abkleben — Esszimmer', menge: 15, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
  ]

  it('der Farbwunsch steht als Notiz an der Position', () => {
    expect(farbtonWieWand(PM012.toLowerCase())).toBe(true)
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', basis, PM012, undefined,
      { arbeitenTexte: ['wände streichen', 'sockelleisten streichen'] })
    const p = positionen.find(x => /sockelleisten streichen/i.test(x.beschreibung))
    expect(p?.annahmen?.join(' ')).toMatch(/Farbton wie die Wandfläche/)
    expect(p?.annahmen?.join(' ')).toMatch(/Buntlack/)
  })

  it('das Material bleibt trotzdem Lack — der Untergrund entscheidet', () => {
    expect(materialFuerPosition('Sockelleisten streichen — Esszimmer', PM012)?.name)
      .toMatch(/Lack/)
  })
})
