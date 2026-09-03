import { describe, it, expect } from 'vitest'
import { erkenneTeilflaechen, saetzeJeRaum } from '../teilflaeche'
import { bodenEngine } from '../mengen/gewerke/boden'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'

// PM-036 (Prüfmeister, 02.09.2026) — Teilfläche nach Wasserschaden neben
// einem kompletten Raum. Der Text unten ist NICHT nachgebaut: das ist das
// echte `transkript_verarbeitet` der Aufnahme aus der Produktionsdatenbank
// (entwurf_aufnahmen, 03.09.2026), also exakt das, was unser Code zu sehen
// bekommt — inklusive der Whisper-Eigenheit „nur 1 Ecke" statt „nur eine
// Ecke".
const PM036_TRANSKRIPT =
  'Wasserschaden. Im Wohnzimmer muss nur 1 Ecke neu. Ungefähr 6 Quadratmeter. ' +
  'Der Rest vom Parkett bleibt liegen. Das Zimmer selbst ist 5 mal 4. ' +
  'Im Flur daneben 4 mal 1.50 kommt der Boden komplett neu. Gleiches Parkett. ' +
  'Im Flur muss der alte Belag raus. Im Wohnzimmer nur die Ecke ausbauen. ' +
  'Sockelleisten im Flur neu. Im Wohnzimmer bleiben sie.'

// Ebenfalls 1:1 aus der Produktionsdatenbank (voll_extraktion.result.raeume):
// Das Wohnzimmer kommt mit flaeche: null an — die sechs Quadratmeter tauchen
// in der KI-Extraktion überhaupt nicht auf. Genau deshalb reicht eine
// Rangfolge in der Engine nicht.
function pm036Raeume() {
  return [
    {
      name: 'Wohnzimmer', laenge: 5, breite: 4, hoehe: null, flaeche: null,
      belag: 'parkett', verlegerichtung: 'standard',
      arbeiten: ['parkett ausbauen', 'parkett verlegen'],
      altbelag_entfernen: true, sockelleisten: false,
      ausgleich: false, teilflaeche: null as number | null,
      fenster: [], tueren: [],
    },
    {
      name: 'Flur', laenge: 4, breite: 1.5, hoehe: null, flaeche: null,
      belag: 'parkett', verlegerichtung: 'standard',
      arbeiten: ['altbelag entfernen', 'parkett verlegen', 'sockelleisten erneuern'],
      altbelag_entfernen: true, sockelleisten: true,
      ausgleich: false, teilflaeche: null as number | null,
      fenster: [], tueren: [],
    },
  ]
}

describe('PM-036 — Satzzuordnung je Raum', () => {
  it('ordnet Sätze ohne Raumnamen dem zuletzt genannten Raum zu', () => {
    const zuordnung = saetzeJeRaum(PM036_TRANSKRIPT, ['Wohnzimmer', 'Flur'])
    const wohnzimmer = zuordnung.get('Wohnzimmer') ?? []
    expect(wohnzimmer.some(s => s.includes('6 Quadratmeter'))).toBe(true)
    expect((zuordnung.get('Flur') ?? []).some(s => s.includes('6 Quadratmeter'))).toBe(false)
  })

  it('springt zurück, wenn ein späterer Satz den anderen Raum nennt', () => {
    const zuordnung = saetzeJeRaum(PM036_TRANSKRIPT, ['Wohnzimmer', 'Flur'])
    expect((zuordnung.get('Wohnzimmer') ?? []).some(s => s.includes('nur die Ecke ausbauen'))).toBe(true)
    expect((zuordnung.get('Flur') ?? []).some(s => s.includes('alte Belag raus'))).toBe(true)
  })

  it('lässt sich von „Das Zimmer selbst" nicht als Raumname täuschen', () => {
    const zuordnung = saetzeJeRaum('Im Flur 2 mal 3. Das Zimmer selbst ist 5 mal 4.', ['Wohnzimmer', 'Flur'])
    expect(zuordnung.has('Wohnzimmer')).toBe(false)
  })
})

describe('PM-036 — Teilfläche erkennen', () => {
  it('holt die 6 m² zurück, die die KI-Extraktion weggeworfen hat', () => {
    const raeume = pm036Raeume()
    const { funde } = erkenneTeilflaechen(PM036_TRANSKRIPT, raeume)
    expect(funde).toHaveLength(1)
    expect(funde[0].raum).toBe('Wohnzimmer')
    expect(funde[0].flaeche).toBe(6)
    expect(funde[0].raumflaeche).toBe(20)
    expect(raeume[0].teilflaeche).toBe(6)
  })

  it('lässt den vollständig neu belegten Flur unangetastet', () => {
    const raeume = pm036Raeume()
    erkenneTeilflaechen(PM036_TRANSKRIPT, raeume)
    expect(raeume[1].teilflaeche).toBeNull()
  })

  it('sagt sichtbar, mit welcher Zahl gerechnet wird — nichts still', () => {
    const { hinweise } = erkenneTeilflaechen(PM036_TRANSKRIPT, pm036Raeume())
    expect(hinweise).toHaveLength(1)
    expect(hinweise[0]).toContain('Wohnzimmer')
    expect(hinweise[0]).toContain('6 m²')
    expect(hinweise[0]).toContain('20 m²')
    expect(hinweise[0]).toContain('nur 1 Ecke neu')
  })

  it('greift NICHT ohne Einschränkungs-Signal (Fläche als reine Zusatzangabe)', () => {
    const raeume = [{
      name: 'Wohnzimmer', laenge: 5, breite: 4, flaeche: null,
      arbeiten: ['parkett verlegen'], altbelag_entfernen: false,
      teilflaeche: null as number | null,
    }]
    const { funde } = erkenneTeilflaechen(
      'Im Wohnzimmer 5 mal 4 kommt Parkett rein. Die Terrasse davor hat 6 Quadratmeter.',
      raeume,
    )
    // Die 6 m² gehören zur Terrasse — ohne „nur"/„Rest"/„Ecke" wird nichts gekürzt.
    expect(funde).toHaveLength(0)
    expect(raeume[0].teilflaeche).toBeNull()
  })

  it('rät nicht, wenn mehrere kleinere Flächen im Raum stehen — sondern meldet es', () => {
    const raeume = [{
      name: 'Wohnzimmer', laenge: 5, breite: 4, flaeche: null,
      arbeiten: ['parkett verlegen'], altbelag_entfernen: false,
      teilflaeche: null as number | null,
    }]
    const { funde, hinweise } = erkenneTeilflaechen(
      'Im Wohnzimmer 5 mal 4 muss nur ein Teil neu, vorne 6 Quadratmeter und hinten nochmal 3 Quadratmeter.',
      raeume,
    )
    expect(funde).toHaveLength(0)
    expect(raeume[0].teilflaeche).toBeNull()
    expect(hinweise[0]).toContain('mehrere Flächen')
  })

  it('nimmt keine Fläche, die so groß ist wie der Raum', () => {
    const raeume = [{
      name: 'Wohnzimmer', laenge: 5, breite: 4, flaeche: null,
      arbeiten: ['parkett verlegen'], altbelag_entfernen: false,
      teilflaeche: null as number | null,
    }]
    erkenneTeilflaechen('Im Wohnzimmer 5 mal 4, nur der Boden, also 20 Quadratmeter.', raeume)
    expect(raeume[0].teilflaeche).toBeNull()
  })

  it('greift nicht ohne echte Raummaße — dann IST die Fläche schon die Arbeitsfläche', () => {
    const raeume = [{
      name: 'Wohnzimmer', laenge: null, breite: null, flaeche: 6,
      arbeiten: ['parkett verlegen'], altbelag_entfernen: false,
      teilflaeche: null as number | null,
    }]
    const { funde } = erkenneTeilflaechen('Im Wohnzimmer nur eine Ecke, ungefähr 6 Quadratmeter.', raeume)
    expect(funde).toHaveLength(0)
  })

  it('verwechselt „Decke" nicht mit „Ecke"', () => {
    const raeume = [{
      name: 'Wohnzimmer', laenge: 5, breite: 4, flaeche: null,
      arbeiten: ['parkett verlegen'], altbelag_entfernen: false,
      teilflaeche: null as number | null,
    }]
    erkenneTeilflaechen('Im Wohnzimmer 5 mal 4 Parkett verlegen, die Decke hat 6 Quadratmeter Stuck.', raeume)
    expect(raeume[0].teilflaeche).toBeNull()
  })
})

describe('PM-036 — Boden-Engine rechnet mit der Teilfläche', () => {
  function rechne() {
    const raeume = pm036Raeume()
    erkenneTeilflaechen(PM036_TRANSKRIPT, raeume)
    return bodenEngine({ raeume, transkript: PM036_TRANSKRIPT })
  }

  it('Wohnzimmer: 6,30 m² Parkett statt 21,00 m² — der Soll-Wert des Prüfmeisters', () => {
    const pos = rechne().positionen.find(p => p.beschreibung.includes('verlegen') && p.beschreibung.includes('Wohnzimmer'))
    expect(pos?.menge).toBe(6.3)
  })

  it('Wohnzimmer: Altbelag entfernen 6,00 m² statt 20,00 m² — ohne Verschnitt', () => {
    const pos = rechne().positionen.find(p => p.beschreibung.startsWith('Altbelag entfernen — Wohnzimmer'))
    expect(pos?.menge).toBe(6)
  })

  it('Flur bleibt vollflächig: 6,30 m² verlegen, 6,00 m² Altbelag', () => {
    const positionen = rechne().positionen
    expect(positionen.find(p => p.beschreibung.includes('verlegen') && p.beschreibung.includes('Flur'))?.menge).toBe(6.3)
    expect(positionen.find(p => p.beschreibung.startsWith('Altbelag entfernen — Flur'))?.menge).toBe(6)
  })

  it('Sockelleisten laufen weiter um den GANZEN Raum, nicht um die Teilfläche', () => {
    const pos = rechne().positionen.find(p => p.beschreibung.startsWith('Sockelleisten montieren — Flur'))
    expect(pos?.menge).toBe(11)
  })

  it('keine Sockelleisten im Wohnzimmer (ausdrücklich ausgeschlossen)', () => {
    expect(rechne().positionen.some(p => p.beschreibung.startsWith('Sockelleisten montieren — Wohnzimmer'))).toBe(false)
  })

  it('die Teilfläche steht als Annahme an der Position — der Kunde sieht, warum', () => {
    const pos = rechne().positionen.find(p => p.beschreibung.includes('verlegen') && p.beschreibung.includes('Wohnzimmer'))
    expect(pos?.annahmen.some(a => a.includes('Teilfläche'))).toBe(true)
  })

  it('die 20,00 m² Raumfläche des Wohnzimmers taucht in KEINER Menge auf', () => {
    const mengen = rechne().positionen
      .filter(p => p.beschreibung.includes('Wohnzimmer'))
      .map(p => p.menge)
    expect(mengen).not.toContain(20)
    expect(mengen).not.toContain(21)
  })

  it('Untergrund-Ausgleich rechnet ebenfalls mit der Teilfläche', () => {
    const raeume = pm036Raeume()
    raeume[0].ausgleich = true
    erkenneTeilflaechen(PM036_TRANSKRIPT, raeume)
    const pos = bodenEngine({ raeume, transkript: PM036_TRANSKRIPT }).positionen
      .find(p => p.beschreibung.startsWith('Untergrundvorbereitung'))
    expect(pos?.menge).toBe(6)
  })

  it('Gesamtsumme der Boden-Mengen liegt beim Soll, nicht beim Doppelten', () => {
    const summe = rechne().positionen
      .filter(p => p.einheit === 'm²')
      .reduce((s, p) => s + p.menge, 0)
    // 6,30 + 6,00 (Wohnzimmer) + 6,30 + 6,00 (Flur) = 24,60
    expect(Math.round(summe * 100) / 100).toBe(24.6)
  })
})

// ── Der ganze Weg, nicht nur die Engine ───────────────────────────────────
// Ab hier läuft der ECHTE gesprochene Satz durch die komplette Pipeline —
// inklusive Zahlwort-Ersetzung („sechs Quadratmeter" → „6 Quadratmeter",
// „fünf mal vier" → „5 mal 4"). Der Grund für diesen Test: Die PM-034-
// Korrektur hing zuerst hinter der Pipeline und hat deshalb zwar die
// gespeicherten Maße korrigiert, aber nicht die Mengen. Solche Fixes will
// ich nicht noch einmal bauen, deshalb wird hier das Ergebnis geprüft, das
// am Ende im Angebot steht.
describe('PM-036 — durch die komplette Pipeline, mit gesprochenen Zahlwörtern', () => {
  const GESPROCHEN =
    'Wasserschaden. Im Wohnzimmer muss nur eine Ecke neu. Ungefähr sechs Quadratmeter. ' +
    'Der Rest vom Parkett bleibt liegen. Das Zimmer selbst ist fünf mal vier. ' +
    'Im Flur daneben vier mal 1,50 kommt der Boden komplett neu. Gleiches Parkett. ' +
    'Im Flur muss der alte Belag raus. Im Wohnzimmer nur die Ecke ausbauen. ' +
    'Sockelleisten im Flur neu. Im Wohnzimmer bleiben sie.'

  function lauf() {
    const result = {
      gewerk: 'boden_parkett',
      raeume: pm036Raeume(),
      bereiche: [], waende: [], decken: [], objekte: [], annahmen: [],
      transkript: GESPROCHEN,
    }
    return verarbeiteExtraktion(GESPROCHEN, { result } as never)
  }

  it('liefert exakt die Soll-Liste des Prüfmeisters', () => {
    const positionen = lauf().mengen.positionen.map(p => `${p.beschreibung} = ${p.menge} ${p.einheit}`)
    expect(positionen).toEqual([
      'Fertigparkett verlegen inkl. 5% Verschnitt — Wohnzimmer = 6.3 m²',
      'Altbelag entfernen — Wohnzimmer = 6 m²',
      'Fertigparkett verlegen inkl. 5% Verschnitt — Flur = 6.3 m²',
      'Altbelag entfernen — Flur = 6 m²',
      'Sockelleisten montieren — Flur = 11 lfdm',
    ])
  })

  it('der Hinweis erreicht die Anzeige (mass_hinweise), nicht nur das Log', () => {
    const hinweise = lauf().mass_hinweise
    expect(hinweise).toHaveLength(1)
    expect(hinweise[0]).toContain('Teilfläche von 6 m²')
    expect(hinweise[0]).toContain('nicht der ganze Raum (20 m²)')
  })

  it('das Angebot ist nicht mehr doppelt so teuer: keine Position über 6,30 m²', () => {
    const groesste = Math.max(...lauf().mengen.positionen.filter(p => p.einheit === 'm²').map(p => p.menge))
    expect(groesste).toBe(6.3)
  })
})
