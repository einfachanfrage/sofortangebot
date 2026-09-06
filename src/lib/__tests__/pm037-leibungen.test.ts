import { describe, it, expect } from 'vitest'
import { erkenneLeibungen, leibungsTiefeAusText } from '../leibungen'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { berechneMengen } from '../mengen/engine'

// ── PM-037 (Prüfmeister, 04.09.2026) ──────────────────────────────────────
//
// „Zwei Fenster, jeweils eins zwanzig mal einen Meter, die Leibungen werden
// mitgestrichen, fünfundzwanzig Zentimeter tief. Die Fensterbänke werden
// auch gestrichen." → Im Angebot: drei Positionen statt fünf.
//
// Zwei unabhängige Defekte, die sich gegenseitig verdeckt haben:
//   1. `leibungen[]` wurde nie gefüllt — das Feld stand nicht einmal im
//      Extraktions-Vertrag. Der VOB-013-Fix war unerreichbar.
//   2. Die Fensterbank-Prüfung stand auf `includes('fensterbank')`. Gesagt
//      wurde „Fensterbänke" — Plural mit Umlaut, kein Treffer. Selbst mit
//      gefüllten Leibungen wäre die Bank ausgefallen.

const RAUM = {
  name: 'Büro', laenge: 5, breite: 4, hoehe: 2.6,
  tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
  fenster: [{ breite: 1.2, hoehe: 1.0, anzahl: 2 }],
  arbeiten: ['wände streichen'],
}

const DIKTAT = 'Büro, 5 mal 4 Meter, Höhe 2,60. Wände zweimal streichen. Zwei Fenster, jeweils eins '
  + 'zwanzig mal einen Meter, die Leibungen werden mitgestrichen, fünfundzwanzig Zentimeter tief. '
  + 'Die Fensterbänke werden auch gestrichen. Eine Tür, Normalmaß.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (text: string, raum: any = RAUM) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = verarbeiteExtraktion(text, { result: { gewerk: 'maler', raeume: [raum], transkript: text } as any })
  return { extraktion: p.extraktion, positionen: berechneMengen('maler', p.extraktion).positionen, hinweise: p.mass_hinweise ?? [] }
}
const menge = (pos: { beschreibung: string; menge: number }[], muster: RegExp) =>
  pos.find(x => muster.test(x.beschreibung))?.menge

describe('PM-037 — der Originalfall, Ende zu Ende', () => {
  it('erzeugt Leibungen mit 1,60 m² (dreiseitig, VOB-013)', () => {
    // 2 × (1,20 + 2×1,00) × 0,25 = 2 × 3,20 × 0,25 = 1,60
    expect(menge(lauf(DIKTAT).positionen, /leibungen streichen/i)).toBe(1.6)
  })

  it('erzeugt Fensterbänke mit 0,60 m² — trotz Umlaut im Plural', () => {
    expect(menge(lauf(DIKTAT).positionen, /fensterbänke streichen/i)).toBe(0.6)
  })

  it('lässt die drei bereits korrekten Positionen unverändert', () => {
    const p = lauf(DIKTAT).positionen
    expect(menge(p, /wandflächen streichen/i)).toBe(46.8)
    expect(menge(p, /boden schützen/i)).toBe(20)
    expect(menge(p, /sockelleisten abkleben/i)).toBe(18)
  })

  it('die Tiefe kommt aus dem Diktat, nicht aus einer Annahme', () => {
    const leib = lauf(DIKTAT).extraktion.leibungen ?? []
    expect(leib[0]?.tiefe).toBe(0.25)
    const pos = lauf(DIKTAT).positionen.find(x => /leibungen streichen/i.test(x.beschreibung))
    expect(pos?.annahmen ?? []).toEqual([])
  })
})

describe('PM-037 — die Fensterbank überlebt jede Schreibweise', () => {
  for (const wort of ['Die Fensterbänke werden auch gestrichen', 'Die Fensterbank wird mitgestrichen', 'Fensterbaenke streichen']) {
    it(wort, () => {
      const text = DIKTAT.replace('Die Fensterbänke werden auch gestrichen.', wort + '.')
      expect(menge(lauf(text).positionen, /fensterbänke streichen/i)).toBe(0.6)
    })
  }

  it('ohne Fensterbank im Diktat gibt es auch keine Position', () => {
    const text = DIKTAT.replace('Die Fensterbänke werden auch gestrichen.', '')
    const p = lauf(text).positionen
    expect(menge(p, /leibungen streichen/i)).toBe(1.6)
    expect(p.some(x => /fensterbänke/i.test(x.beschreibung))).toBe(false)
  })
})

describe('PM-037 — nichts wird erfunden', () => {
  it('ohne „Leibung" im Diktat entsteht keine Leibungsposition', () => {
    const text = 'Büro, 5 mal 4 Meter, Höhe 2,60. Wände zweimal streichen. Zwei Fenster, eine Tür.'
    expect(lauf(text).positionen.some(x => /leibung/i.test(x.beschreibung))).toBe(false)
  })

  it('genannte, aber nicht gestrichene Leibungen erzeugen keine Position', () => {
    // CoS-042, Punkt 4 — die Entscheidung liegt weiter allein bei der Engine.
    const text = 'Büro, 5 mal 4 Meter, Höhe 2,60. Wände streichen. Zwei Fenster, jeweils 1,20 mal 1 Meter. '
      + 'Die Leibungen bleiben, die werden nur gedämmt.'
    expect(lauf(text).positionen.some(x => /leibungen streichen/i.test(x.beschreibung))).toBe(false)
  })

  it('ohne Fenstermaße wird nicht geraten, sondern gesagt', () => {
    const ohneMasse = { ...RAUM, fenster: [{ anzahl: 2 }] }
    const r = lauf(DIKTAT, ohneMasse)
    expect(r.positionen.some(x => /leibung/i.test(x.beschreibung))).toBe(false)
    expect(r.hinweise.join(' ')).toMatch(/keine Fenster- oder Türmaße/)
  })

  it('fehlende Tiefe wird zur sichtbaren Annahme, nicht zur stillen Zahl', () => {
    const text = DIKTAT.replace(', fünfundzwanzig Zentimeter tief', '')
    const r = lauf(text)
    expect(menge(r.positionen, /leibungen streichen/i)).toBe(1.6) // 25 cm Standard
    expect(r.positionen.find(x => /leibungen streichen/i.test(x.beschreibung))?.annahmen.join(' '))
      .toMatch(/25cm Standard/)
    expect(r.hinweise.join(' ')).toMatch(/Leibungstiefe wurde nicht genannt/)
  })
})

describe('PM-037 — Bausteine', () => {
  it('liest die Tiefe in Zentimetern und in Metern', () => {
    expect(leibungsTiefeAusText('die leibungen 25 zentimeter tief')).toBe(0.25)
    expect(leibungsTiefeAusText('die leibungen 30 cm tief')).toBe(0.3)
    expect(leibungsTiefeAusText('leibungstiefe 0,25 m')).toBe(0.25)
  })

  it('verwirft unplausible Tiefen — 2,60 m ist die Raumhöhe, keine Leibung', () => {
    expect(leibungsTiefeAusText('die leibungen streichen, höhe 2,60 m')).toBeNull()
  })

  it('fasst gleich große Fenster zusammen und trennt verschiedene', () => {
    const { leibungen } = erkenneLeibungen(
      'die leibungen werden mitgestrichen, 25 cm tief',
      [{ fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1 }, { anzahl: 1, breite: 0.6, hoehe: 0.8 }] }],
      [],
    )
    expect(leibungen).toHaveLength(2)
    expect(leibungen[0]).toMatchObject({ anzahl: 2, breite: 1.2, typ: 'fenster_innen' })
    expect(leibungen[1]).toMatchObject({ anzahl: 1, breite: 0.6, typ: 'fenster_innen' })
  })

  it('eine Fassade bekommt Außenleibungen, kein Fensterbank-Anhängsel', () => {
    const { leibungen } = erkenneLeibungen(
      'fassade streichen, die leibungen werden mitgestrichen, 25 cm tief',
      [], [{ fenster: [{ anzahl: 3, breite: 1.2, hoehe: 1.4 }] }],
    )
    expect(leibungen[0].typ).toBe('fenster')
  })

  it('respektiert eine bereits gefüllte Extraktion — das Modell hat Vorrang', () => {
    const p = verarbeiteExtraktion(DIKTAT, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result: { gewerk: 'maler', raeume: [RAUM], transkript: DIKTAT, leibungen: [{ anzahl: 9, breite: 1, hoehe: 1, tiefe: 0.2, typ: 'fenster_innen' }] } as any,
    })
    expect(p.extraktion.leibungen?.[0].anzahl).toBe(9)
  })
})
