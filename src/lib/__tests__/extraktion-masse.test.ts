import { describe, it, expect } from 'vitest'
import {
  extrahiereWandflaeche, extrahiereDeckenflaeche, extrahiereAbzug,
  extrahiereTorMasse, zaehleFenster, zaehleTueren, extrahiereRaumhoehe,
  extrahiereRaumdaten,
} from '../extraktion-masse'

describe('extrahiereWandflaeche', () => {
  it.each([
    ['Wandfläche 40 m²', 40],
    ['40 qm Wandfläche', 40],
    ['die Wände haben 52,5 Quadratmeter', 52.5],
  ] as const)('"%s" → %s', (t, erw) => { expect(extrahiereWandflaeche(t)).toBe(erw) })

  it('Bodenfläche wird NICHT als Wandfläche gelesen', () => {
    expect(extrahiereWandflaeche('24 Quadratmeter Bodenfläche')).toBe(null)
  })
  it('Frust-Ansage: 24 qm Boden + Wände in getrenntem Satz → keine falsche Wandfläche', () => {
    expect(extrahiereWandflaeche('24 Quadratmeter Bodenfläche. Die Wände sind 2,60 hoch.')).toBe(null)
  })
})

describe('extrahiereDeckenflaeche', () => {
  it.each([
    ['die Decke ist 20 m²', 20],
    ['20 qm Deckenfläche', 20],
  ] as const)('"%s" → %s', (t, erw) => { expect(extrahiereDeckenflaeche(t)).toBe(erw) })
})

describe('extrahiereAbzug', () => {
  it.each([
    ['davon 5 m² abziehen', 5],
    ['minus 3,5 qm', 3.5],
    ['abzüglich 8 m²', 8],
  ] as const)('"%s" → %s', (t, erw) => { expect(extrahiereAbzug(t)).toBe(erw) })
})

describe('extrahiereTorMasse', () => {
  it.each([
    ['Garagentor 2,5 mal 2 Meter', { breite: 2.5, hoehe: 2 }],
    ['Tor 3x2,2', { breite: 3, hoehe: 2.2 }],
  ] as const)('"%s"', (t, erw) => { expect(extrahiereTorMasse(t)).toEqual(erw) })
  it('kein Tor → null', () => { expect(extrahiereTorMasse('normale Tür 0,9 x 2,1')).toBe(null) })
})

describe('extrahiereRaumhoehe — robust gegen "2 Meter 60"-Falle', () => {
  it.each([
    ['2,60 m hoch', 2.6],
    ['2,60 hoch', 2.6],
    ['2,60 meter hoch', 2.6],
    ['2 Meter 60 hoch', 2.6],   // Whisper-Kompaktform — DARF nicht 60 werden
    ['2 m 60 hoch', 2.6],
    ['3 meter hoch', 3],
    ['Raumhöhe 4,5', 4.5],
    ['bodenfläche 20qm, 2,60 hoch, eine tür', 2.6],
  ] as const)('"%s" → %s', (t, erw) => { expect(extrahiereRaumhoehe(t)).toBe(erw) })

  it('keine Höhe → null', () => { expect(extrahiereRaumhoehe('20 qm streichen')).toBe(null) })
  it('unplausibel (60 m) → null', () => { expect(extrahiereRaumhoehe('60 m hoch')).toBe(null) })
})

// PM-008: Fassaden haben keine "Raumhöhe", sondern eine Giebel-/Wandhöhe —
// vorher gar nicht erkannt, weil das Schlüsselwort fehlte.
describe('extrahiereRaumhoehe — Fassade (PM-008)', () => {
  it.each([
    ['Giebelhöhe im Schnitt sechs Meter', 6],
    ['Giebelhöhe im Schnitt 6 Meter', 6],
    ['Wandhöhe durchschnittlich 5,5 Meter', 5.5],
    ['Giebelhöhe 6,20 m', 6.2],
  ] as const)('"%s" → %s', (t, erw) => { expect(extrahiereRaumhoehe(t)).toBe(erw) })
})

// PM-008-Nachtest: echter Transkript-Fund aus Sandys Live-Test (2026-08-18).
// Die Aufnahmekarte zeigte "1,20 × 1,40 × 6,00 m" statt der echten Fassade
// (12 m lang, 6 m Giebelhöhe) — das Fenstermaß "1,20 x 1,40" steht im
// Rohtext in einer eigenen, knappen Kommaklausel, "Fenster" selbst eine
// Klausel davor. Ein zu enges Zeichenfenster in der ersten Fix-Version hat
// genau das verpasst (siehe istOeffnungsKontext-Kommentar oben).
describe('extrahiereRaumdaten — Fassaden-Vorschau (PM-008)', () => {
  it('Sandys echtes Test-Transkript: Fenstermaß wird NICHT als Fassadenmaß übernommen', () => {
    const transkript = 'Fassade an der Südseite, 12 Meter lang, Giebelhöhe im Schnitt 6 Meter, 3 Fenster drin, 1,20 x 1,40, Fassadenfarbe zweimal drauf, dazu vorher Grundierung.'
    const ergebnis = extrahiereRaumdaten(transkript)
    // Die Fassadenmaße selbst stehen NICHT im "X mal Y"-Format im Text
    // ("12 Meter lang" + "Giebelhöhe … 6 Meter" getrennt) — die Heuristik
    // zeigt dann lieber nichts als die falschen Fenstermaße.
    expect(ergebnis.laenge).toBe(null)
    expect(ergebnis.breite).toBe(null)
    expect(ergebnis.hoehe).toBe(6)
    expect(ergebnis.fenster).toBe(3)
  })

  it('Gegenprobe: eine echte "X mal Y"-Fassadendimension wird weiter erkannt', () => {
    const ergebnis = extrahiereRaumdaten('Fassade Nordseite, 10 mal 4 Meter, keine Fenster, einfacher Anstrich.')
    expect(ergebnis.laenge).toBe(10)
    expect(ergebnis.breite).toBe(4)
  })

  it('Raummaß bleibt erkannt, wenn kein Fenster/Tür-Kontext in der Nähe steht', () => {
    const ergebnis = extrahiereRaumdaten('Wohnzimmer, 5 mal 4 Meter, 2,60 hoch, zwei Fenster weiter hinten im Text erwähnt.')
    expect(ergebnis.laenge).toBe(5)
    expect(ergebnis.breite).toBe(4)
  })
})

describe('zaehleFenster / zaehleTueren', () => {
  it('2 Fenster, 1 Tür', () => {
    expect(zaehleFenster('2 Fenster')).toBe(2)
    expect(zaehleTueren('1 Tür')).toBe(1)
  })
  it('3 Dachfenster', () => { expect(zaehleFenster('3 Dachfenster')).toBe(3) })
  it('keine Zahl → 0', () => {
    expect(zaehleFenster('mit Fenster')).toBe(0)
    expect(zaehleTueren('eine Tür')).toBe(0)
  })
  // PM-001: Selbstkorrektur — die LETZTE genannte Zahl zählt, nicht die erste.
  it('Selbstkorrektur "1 Fenster — ne halt, 2 Fenster" → 2 (nicht 1)', () => {
    expect(zaehleFenster('1 Fenster — ne halt, 2 Fenster sind da drin, Standardgröße reicht.')).toBe(2)
  })
  it('Selbstkorrektur bei Türen ebenso: letzte Nennung gewinnt', () => {
    expect(zaehleTueren('1 Tür, ach nein warte, 2 Türen sind es.')).toBe(2)
  })
})
