import { describe, it, expect } from 'vitest'
import { erkenneSockelleistenAusschluss } from '../sockelleisten-ausschluss'
import { bodenEngine } from '../mengen/gewerke/boden'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'

// PM-033, Befund 2 (Prüfmeister, 02.09.2026)
//
// Gesagt: „Sockelleisten bleiben überall, wie sie sind."
// Im Angebot: „Sockelleisten montieren, 22 lfdm, 121,00 €".
//
// Die 22,00 lfdm waren kein Umfang aus zwei Räumen (so die Vermutung im
// Befund), sondern der Fallback „quadratischer Raum" über der Wohnzimmer-
// Verlegefläche INKLUSIVE 15 % Verschnitt: 4 × √31,05 = 22,29 → 22. Der
// eigentliche Fehler liegt davor: Ausgelöst hat ihn das blosse Vorkommen des
// Wortes „sockelleist" — im Satz, der sie abbestellt.

const PM033 =
  'Wohnzimmer, sechs mal vier fünfzig, da kommt Eichenparkett rein, Fischgrät verlegt. ' +
  'Schlafzimmer, vier mal drei sechzig, da wollen die Teppich, Bahnenware. ' +
  'Flur, fünf mal eins fünfzig, da kommt Laminat, ganz normal gerade. ' +
  'An den beiden Türen zum Wohnzimmer und zum Schlafzimmer jeweils eine Übergangsschiene, weil ja unterschiedliche Beläge. ' +
  'Trittschall nur unterm Laminat im Flur. ' +
  'Sockelleisten bleiben überall, wie sie sind.'

describe('PM-033 — den Ausschluss lesen, wie er gesprochen wird', () => {
  it('„Sockelleisten bleiben überall, wie sie sind" gilt für den ganzen Auftrag', () => {
    const a = erkenneSockelleistenAusschluss(PM033, ['Wohnzimmer', 'Schlafzimmer', 'Flur'])
    expect(a.global).toBe(true)
    expect(a.belege[0]).toContain('bleiben überall')
  })

  it('erkennt den Rückbezug „sie" auf den Satz davor — nur für den genannten Raum', () => {
    const a = erkenneSockelleistenAusschluss(
      'Sockelleisten im Flur neu. Im Wohnzimmer bleiben sie.',
      ['Wohnzimmer', 'Flur'],
    )
    expect(a.global).toBe(false)
    expect([...a.raeume]).toEqual(['Wohnzimmer'])
  })

  it('weitere übliche Formulierungen', () => {
    const f = (t: string) => erkenneSockelleistenAusschluss(t).global
    expect(f('An den Sockelleisten machen wir nichts.')).toBe(true)
    expect(f('Keine neuen Sockelleisten.')).toBe(true)
    expect(f('Sockelleisten bleiben dran.')).toBe(true)
    expect(f('Die Sockelleisten sollen nicht erneuert werden.')).toBe(true)
    expect(f('Boden neu, aber ohne Sockelleisten.')).toBe(true)
  })
})

describe('PM-033 — die Gegenrichtung: kein Ausschluss, wo keiner gemeint ist', () => {
  const nicht = (t: string) => {
    const a = erkenneSockelleistenAusschluss(t, ['Wohnzimmer', 'Flur'])
    return !a.global && a.raeume.size === 0
  }

  it('ein echter Auftrag bleibt ein Auftrag', () => {
    expect(nicht('Sockelleisten überall neu, weiße MDF.')).toBe(true)
    expect(nicht('Im Flur werden Sockelleisten montiert.')).toBe(true)
    expect(nicht('Sockelleisten kommen neu rein.')).toBe(true)
  })

  it('„Sockelleisten bleiben nicht" ist das Gegenteil eines Ausschlusses', () => {
    expect(nicht('Die Sockelleisten bleiben nicht, die kommen raus.')).toBe(true)
  })

  it('„raus" ist ein Abbruch-Auftrag, kein Ausschluss', () => {
    expect(nicht('Die alten Sockelleisten müssen raus.')).toBe(true)
  })

  it('ein „nicht" über ein anderes Gewerk zieht die Sockelleisten nicht mit', () => {
    // Der Rückbezugs-Zweig darf hier NICHT greifen, obwohl „Die" und „nicht"
    // im Satz stehen und der Satz davor Sockelleisten nennt.
    expect(nicht('Sockelleisten im Flur neu. Die Türen werden nicht gestrichen.')).toBe(true)
  })

  it('ein Ausschluss im Nachbarsatz gilt nicht drei Sätze weiter', () => {
    const a = erkenneSockelleistenAusschluss(
      'Sockelleisten im Flur neu. Laminat gerade verlegt. Die Fenster bleiben zu.',
      ['Flur'],
    )
    expect(a.global).toBe(false)
    expect(a.raeume.size).toBe(0)
  })
})

describe('PM-033 — im Angebot kommt keine Sockelleisten-Position mehr an', () => {
  function pm033Raeume() {
    return [
      { name: 'Wohnzimmer', laenge: 6, breite: 4.5, hoehe: null, flaeche: null, belag: 'eichenparkett', verlegerichtung: 'fischgrät', arbeiten: ['parkett verlegen'], fenster: [], tueren: [], altbelag_entfernen: false, sockelleisten: true, nassbereich: false },
      { name: 'Schlafzimmer', laenge: 4, breite: 3.6, hoehe: null, flaeche: null, belag: 'teppich', verlegerichtung: 'standard', arbeiten: ['teppich verlegen'], fenster: [], tueren: [], altbelag_entfernen: false, sockelleisten: true, nassbereich: false },
      { name: 'Flur', laenge: 5, breite: 1.5, hoehe: null, flaeche: null, belag: 'laminat', verlegerichtung: 'standard', arbeiten: ['laminat verlegen'], fenster: [], tueren: [], altbelag_entfernen: false, sockelleisten: true, nassbereich: false },
    ]
  }

  it('Engine: trotz gesetztem KI-Flag und Textsignal keine Montage', () => {
    const positionen = bodenEngine({ raeume: pm033Raeume(), transkript: PM033 }).positionen
    expect(positionen.some(p => /sockelleisten/i.test(p.beschreibung))).toBe(false)
  })

  it('Engine: die drei Verschnittsätze bleiben unangetastet (15 / 0 / 5 %)', () => {
    const positionen = bodenEngine({ raeume: pm033Raeume(), transkript: PM033 }).positionen
    const menge = (raum: string) => positionen.find(p => p.beschreibung.includes('verlegen') && p.beschreibung.includes(raum))?.menge
    expect(menge('Wohnzimmer')).toBe(31.05)
    expect(menge('Schlafzimmer')).toBe(14.4)
    expect(menge('Flur')).toBe(7.88)
  })

  it('komplette Pipeline: auch der Vollständigkeits-Fallback erfindet nichts mehr', () => {
    const result = {
      gewerk: 'boden_parkett',
      raeume: pm033Raeume(),
      bereiche: [], waende: [], decken: [], objekte: [], annahmen: [], transkript: PM033,
    }
    const antwort = verarbeiteExtraktion(PM033, { result } as never)
    const sockel = antwort.mengen.positionen.filter(p => /sockelleisten/i.test(p.beschreibung))
    expect(sockel).toEqual([])
  })

  it('und wenn Sockelleisten wirklich bestellt sind, stehen sie auch drin', () => {
    const text = PM033.replace('Sockelleisten bleiben überall, wie sie sind.', 'Sockelleisten überall neu, weiße MDF.')
    const positionen = bodenEngine({ raeume: pm033Raeume(), transkript: text }).positionen
    const sockel = positionen.filter(p => /sockelleisten montieren/i.test(p.beschreibung))
    expect(sockel).toHaveLength(3)
    expect(sockel.map(p => p.menge)).toEqual([21, 15.2, 13])
  })

  it('nur ein Raum ausgeschlossen: der andere behält seine Sockelleisten', () => {
    const text = 'Flur fünf mal eins fünfzig, Laminat. Sockelleisten im Flur neu. Wohnzimmer sechs mal vier fünfzig, Parkett. Im Wohnzimmer bleiben sie.'
    const raeume = [
      { name: 'Flur', laenge: 5, breite: 1.5, hoehe: null, flaeche: null, belag: 'laminat', arbeiten: ['laminat verlegen'], fenster: [], tueren: [], altbelag_entfernen: false, sockelleisten: true, nassbereich: false },
      { name: 'Wohnzimmer', laenge: 6, breite: 4.5, hoehe: null, flaeche: null, belag: 'parkett', arbeiten: ['parkett verlegen'], fenster: [], tueren: [], altbelag_entfernen: false, sockelleisten: true, nassbereich: false },
    ]
    const positionen = bodenEngine({ raeume, transkript: text }).positionen
    const sockel = positionen.filter(p => /sockelleisten montieren/i.test(p.beschreibung))
    expect(sockel.map(p => p.beschreibung)).toEqual(['Sockelleisten montieren — Flur'])
  })
})
