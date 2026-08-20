import { describe, it, expect } from 'vitest'
import { ergaenzeChipsUmAutomatischeNebenpositionen } from '../chips-vervollstaendigung'

describe('PM-001 — Aufnahmekarte zeigt automatisch ergänzte Nebentätigkeiten', () => {
  it('ergänzt "Boden schützen" auf der Karte, wenn im Transkript genannt aber vom Chip-Modell nicht extrahiert', () => {
    const chips = [
      { titel: 'Wandflächen streichen — Wohnzimmer', menge: 35, einheit: 'm²', erkannt: true },
    ]
    const transkript = 'Wände im Wohnzimmer streichen, Boden bitte vorher schützen und abdecken.'
    const ergebnis = ergaenzeChipsUmAutomatischeNebenpositionen(chips, transkript) as Array<{ titel: string; automatisch_ergaenzt?: boolean }>
    // Zwei getrennte Regeln greifen hier (maler-basis.ts + maler-abkleben.ts,
    // dieselbe bewusste Redundanz wie in der finalen Kalkulation — siehe
    // "Systemischer Fund" Punkt 1 in pruefmeister-testfaelle.md), darum
    // mindestens ein neuer "Boden schützen"-Eintrag statt exakt einer Zahl.
    expect(ergebnis.length).toBeGreaterThan(chips.length)
    const neu = ergebnis.filter(p => /boden sch/i.test(p.titel))
    expect(neu.length).toBeGreaterThan(0)
    expect(neu.every(p => p.automatisch_ergaenzt)).toBe(true)
  })

  it('PM-001-Originalfall: ergänzt "Boden schützen" auch OHNE jede Erwähnung im Transkript (Wand-/Deckenanstrich reicht)', () => {
    const chips = [
      { titel: 'Wandflächen streichen — Wohnzimmer', menge: 42.21, einheit: 'm²', erkannt: true },
      { titel: 'Sockelleisten abkleben — Wohnzimmer', menge: 17.7, einheit: 'lfdm', erkannt: true },
    ]
    // Exakt Sandys Original-Transkript (PM-001) — "Boden schützen" kommt hier
    // nirgends vor, taucht im fertigen Angebot aber trotzdem auf.
    const transkript = 'Wohnzimmer, fünf zwanzig mal vier zehn, Deckenhöhe zwo fünfzig. Wände komplett streichen, zweimal drüber. Zwei Fenster, Standardgröße. Eine Tür, normal Maß. Die Decke lassen wir, NICHT mitrechnen. Sockelleisten kleben wir noch ab, sind aus Holz, werden mitgestrichen.'
    const ergebnis = ergaenzeChipsUmAutomatischeNebenpositionen(chips, transkript) as Array<{ titel: string; automatisch_ergaenzt?: boolean }>
    const neu = ergebnis.find(p => /boden sch/i.test(p.titel))
    expect(neu).toBeDefined()
    expect(neu?.automatisch_ergaenzt).toBe(true)
  })

  it('ergänzt kein "Boden schützen", wenn im selben Raum ohnehin ein neuer Boden verlegt wird', () => {
    const chips = [
      { titel: 'Wandflächen streichen — Flur', menge: 20, einheit: 'm²', erkannt: true },
      { titel: 'Vinyl verlegen — Flur', menge: 15, einheit: 'm²', erkannt: true },
    ]
    const transkript = 'Wände im Flur streichen, Vinylboden neu verlegen.'
    const ergebnis = ergaenzeChipsUmAutomatischeNebenpositionen(chips, transkript) as Array<{ titel: string }>
    expect(ergebnis.some(p => /boden sch/i.test(p.titel))).toBe(false)
  })

  it('ergänzt "Sockelleisten abkleben" auf der Karte, analog zu Boden schützen', () => {
    const chips = [
      { titel: 'Wandflächen streichen — Büro', menge: 20, einheit: 'm²', erkannt: true },
    ]
    const transkript = 'Wände im Büro streichen, Sockelleisten vorher abkleben.'
    const ergebnis = ergaenzeChipsUmAutomatischeNebenpositionen(chips, transkript) as Array<{ titel: string }>
    expect(ergebnis.some(p => /sockelleisten abkl/i.test(p.titel))).toBe(true)
  })

  it('ergänzt Grundierung bei explizitem Neubau/Erstanstrich', () => {
    const chips = [
      { titel: 'Wandflächen streichen — Wohnzimmer', menge: 40, einheit: 'm²', erkannt: true },
    ]
    const transkript = 'Neubau, Wände im Wohnzimmer streichen, Erstanstrich.'
    const ergebnis = ergaenzeChipsUmAutomatischeNebenpositionen(chips, transkript) as Array<{ titel: string }>
    expect(ergebnis.some(p => /grundier|voranstrich/i.test(p.titel))).toBe(true)
  })

  it('lässt die Chip-Liste unverändert, wenn nichts zu ergänzen ist (Boden-Auftrag, Sockelleisten schon vorhanden)', () => {
    const chips = [
      { titel: 'Vinyl verlegen — Wohnzimmer', menge: 20, einheit: 'm²', erkannt: true },
      { titel: 'Sockelleisten montieren — Wohnzimmer', menge: 18, einheit: 'lfdm', erkannt: true },
    ]
    const transkript = 'Vinylboden im Wohnzimmer verlegen, Sockelleisten neu montieren, sonst nichts.'
    const ergebnis = ergaenzeChipsUmAutomatischeNebenpositionen(chips, transkript)
    expect(ergebnis).toBe(chips) // exakt dieselbe Referenz — kein unnötiges Klonen
  })

  it('ergänzt bei reinem Boden-Auftrag automatisch Sockelleisten montieren, wenn noch nicht auf der Karte', () => {
    const chips = [
      { titel: 'Vinyl verlegen — Wohnzimmer', menge: 20, einheit: 'm²', erkannt: true },
    ]
    const transkript = 'Vinylboden im Wohnzimmer verlegen, sonst nichts.'
    const ergebnis = ergaenzeChipsUmAutomatischeNebenpositionen(chips, transkript) as Array<{ titel: string }>
    expect(ergebnis.some(p => /sockelleisten/i.test(p.titel))).toBe(true)
  })

  it('dupliziert nichts, wenn das Chip-Modell die Nebentätigkeit bereits selbst gefunden hat', () => {
    const chips = [
      { titel: 'Wandflächen streichen — Wohnzimmer', menge: 35, einheit: 'm²', erkannt: true },
      { titel: 'Boden schützen / Abdecken', menge: 0, einheit: 'm²', erkannt: true },
    ]
    const transkript = 'Wände im Wohnzimmer streichen, Boden vorher schützen.'
    const ergebnis = ergaenzeChipsUmAutomatischeNebenpositionen(chips, transkript) as unknown[]
    expect(ergebnis.length).toBe(2)
  })

  it('rührt Gewerke ohne Maler-/Boden-Signal nicht an (z.B. reiner Elektro-Auftrag)', () => {
    const chips = [{ titel: 'Steckdosen setzen — Büro', menge: 4, einheit: 'Stück', erkannt: true }]
    const transkript = 'Vier Steckdosen im Büro setzen.'
    const ergebnis = ergaenzeChipsUmAutomatischeNebenpositionen(chips, transkript)
    expect(ergebnis).toBe(chips)
  })

  it('wirft nie und liefert bei kaputter Eingabe die Original-Liste zurück', () => {
    // @ts-expect-error bewusst kaputte Eingabe für den Fehlerpfad
    expect(ergaenzeChipsUmAutomatischeNebenpositionen(null, 'Wände streichen')).toBe(null)
    expect(ergaenzeChipsUmAutomatischeNebenpositionen([], 'Wände streichen')).toEqual([])
    expect(ergaenzeChipsUmAutomatischeNebenpositionen([{ titel: 'x' }], '')).toEqual([{ titel: 'x' }])
  })
})
