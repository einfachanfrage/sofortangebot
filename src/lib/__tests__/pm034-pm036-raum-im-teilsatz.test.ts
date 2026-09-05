import { describe, it, expect } from 'vitest'
import { bodenEngine } from '../mengen/gewerke/boden'
import { erkenneSockelleistenAusschluss, SOCKEL_WORT } from '../sockelleisten-ausschluss'
import { saetzeJeRaum } from '../satz-raum'

// ── PM-034 / PM-036, Nachtest vom 04.09.2026 ──────────────────────────────
//
// Beide Befunde stammen aus echten Produktionsdiktaten (Supabase,
// entwurf_aufnahmen vom 05.09.2026) und haben dieselbe Wurzel: Ein Satz
// nennt ZWEI Räume, getrennt nur durch ein Komma. Die Raumzuordnung nahm
// bisher den zuletzt genannten Raum für den GANZEN Satz.
//
//   PM-036: „Sockelleisten im Flur neu, im Wohnzimmer bleiben sie."
//           → ganzer Satz landete im Wohnzimmer, dort stand „Sockelleisten
//             … neu" im Raumtext → erfundene Position, 10 lfdm.
//   PM-034: „… Zockelleisten in Küche und Esszimmer neu, je 1 Tür."
//           → zusätzlich: Whisper schreibt „Zockelleisten" mit Z, das
//             Textsignal-Gate der Engine suchte „sockelleist" → die
//             Leistung fiel für BEIDE Räume komplett aus (28,20 lfdm).

const PM036 = 'Wasserschaden. Im Wohnzimmer muss nur 1 Ecke neu, ungefähr 6 Quadratmeter. Der Rest vom Parkett bleibt liegen. Das Zimmer selbst ist 5 x 4. Im Flur daneben 4 x 1.50, kommt der Boden komplett neu, gleiches Parkett. Im Flur muss der alte Belag raus, im Wohnzimmer nur die Ecke ausbauen. Sockelleisten im Flur neu, im Wohnzimmer bleiben sie.'

const PM034 = 'Küche, 360 x 3, da liegen alte Fliesen, die müssen raus und danach muss der Boden gespachtelt werden. Ausgleichsmasse, der ist ziemlich uneben. Dann Click-Vinyl drauf, gerade verlegt. Esszimmer daneben, 4 x 350, der Untergrund ist in Ordnung, da reicht Grundierung. Dann dasselbe Vinyl, im Flur machen wir nichts am Boden, der bleibt wie er ist, Zockelleisten in Küche und Esszimmer neu, je 1 Tür.'

describe('PM-036: zwei Räume in einem Satz, durch Komma getrennt', () => {
  it('ordnet den Ausschluss dem Wohnzimmer zu, nicht dem Flur', () => {
    const a = erkenneSockelleistenAusschluss(PM036.toLowerCase(), ['Wohnzimmer', 'Flur'])
    expect(a.global).toBe(false)
    expect(a.raeume.has('Wohnzimmer')).toBe(true)
    expect(a.raeume.has('Flur')).toBe(false)
  })

  it('gibt dem Wohnzimmer keinen Satz mit „Sockelleisten … neu"', () => {
    const zu = saetzeJeRaum(PM036.toLowerCase(), ['Wohnzimmer', 'Flur'])
    expect((zu.get('Wohnzimmer') ?? []).join(' ')).not.toMatch(/sockelleist/)
    expect((zu.get('Flur') ?? []).join(' ')).toMatch(/sockelleisten im flur neu/)
  })

  it('lässt die Teilflächen-Erkennung unberührt (Marker und Fläche im selben Satz)', () => {
    const zu = saetzeJeRaum(PM036.toLowerCase(), ['Wohnzimmer', 'Flur'])
    const wz = (zu.get('Wohnzimmer') ?? []).join('. ')
    expect(wz).toMatch(/nur 1 ecke neu, ungefähr 6 quadratmeter/)
  })
})

describe('PM-034: „Zockelleisten" (Hörfehler) für zwei Räume in einem Satz', () => {
  const daten = {
    transkript: PM034,
    raeume: [
      { name: 'Küche', laenge: 3.6, breite: 3, belag: 'click-vinyl', sockelleisten: true, altbelag_entfernen: true, ausgleich: true, tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }], arbeiten: ['fliesen entfernen', 'boden spachteln', 'click-vinyl verlegen', 'sockelleisten erneuern'] },
      { name: 'Esszimmer', laenge: 4, breite: 3.5, belag: 'click-vinyl', sockelleisten: true, tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }], arbeiten: ['grundierung', 'click-vinyl verlegen', 'sockelleisten erneuern'] },
      { name: 'Flur', vage: true, arbeiten: [] },
    ],
  }

  it('legt die Sockelleisten in BEIDEN genannten Räumen an', () => {
    const p = bodenEngine(daten).positionen.filter(x => /sockelleisten montieren/i.test(x.beschreibung))
    const kueche = p.find(x => /Küche/.test(x.beschreibung))
    const esszimmer = p.find(x => /Esszimmer/.test(x.beschreibung))
    expect(kueche?.menge).toBe(13.2)
    expect(esszimmer?.menge).toBe(15)
    expect(p).toHaveLength(2)
  })

  it('erkennt keinen Sockelleisten-Ausschluss (der Flur betrifft nur den Boden)', () => {
    const a = erkenneSockelleistenAusschluss(PM034.toLowerCase(), ['Küche', 'Esszimmer', 'Flur'])
    expect(a.global).toBe(false)
    expect(a.raeume.size).toBe(0)
  })

  it('ordnet den Sockelleisten-Teilsatz beiden genannten Räumen zu', () => {
    const zu = saetzeJeRaum(PM034.toLowerCase(), ['Küche', 'Esszimmer', 'Flur'])
    expect((zu.get('Küche') ?? []).join(' ')).toMatch(/zockelleisten in küche und esszimmer neu/)
    expect((zu.get('Esszimmer') ?? []).join(' ')).toMatch(/zockelleisten in küche und esszimmer neu/)
    expect((zu.get('Flur') ?? []).join(' ')).not.toMatch(/ockelleisten/)
  })
})

// ── Ende-zu-Ende: Engine + Vollständigkeitsprüfung, wie im Betrieb ────────
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit'

describe('PM-036 durchgehend: kein erfundener Sockel im abbestellten Raum', () => {
  const daten = {
    transkript: PM036,
    raeume: [
      { name: 'Wohnzimmer', laenge: 5, breite: 4, teilflaeche: 6, belag: 'parkett', sockelleisten: false, altbelag_entfernen: true, tueren: [], arbeiten: ['parkett ausbessern'] },
      { name: 'Flur', laenge: 4, breite: 1.5, belag: 'parkett', sockelleisten: true, altbelag_entfernen: true, tueren: [], arbeiten: ['parkett verlegen', 'altbelag entfernen', 'sockelleisten erneuern'] },
    ],
  }

  it('legt Sockelleisten nur im Flur an — und nirgends 10 lfdm', () => {
    const engine = bodenEngine(daten).positionen
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'boden_parkett', engine, PM036, undefined,
      { raeume: daten.raeume.map(r => ({ name: r.name, arbeiten: r.arbeiten })) },
    )
    const sockel = positionen.filter(p => /sockelleisten montieren/i.test(p.beschreibung))
    expect(sockel.map(p => p.beschreibung)).toEqual(['Sockelleisten montieren — Flur'])
    expect(sockel[0].menge).toBe(11)
    expect(positionen.some(p => /Wohnzimmer/.test(p.beschreibung) && /sockel/i.test(p.beschreibung))).toBe(false)
  })
})

describe('PM-036, zweite Wurzel: Umfang nie aus einer Teilfläche schätzen', () => {
  it('erfindet keine 4 × √Teilfläche-Länge', () => {
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit(
      'boden_parkett',
      [{ beschreibung: 'Altbelag entfernen', menge: 6, einheit: 'm²', konfidenz: 'high', berechnungsweg: 'Teilfläche: 6 m²', annahmen: [] }],
      'Im Wohnzimmer nur die Ecke, ungefähr 6 Quadratmeter Parkett neu. Sockelleisten dazu.',
    )
    const sockel = positionen.find(p => /sockelleisten montieren/i.test(p.beschreibung))
    expect(sockel?.menge).not.toBe(10)
    expect(sockel === undefined || !/√6/.test(sockel.berechnungsweg ?? '')).toBe(true)
    expect(sockel !== undefined || fehlende.some(f => /Sockelleisten montieren/.test(f))).toBe(true)
  })
})

describe('Sockelleisten-Wort: Hörfehler und Synonyme', () => {
  it('erkennt Zockelleisten, Fußleisten und getrennte Schreibung', () => {
    for (const wort of ['Zockelleisten', 'Sockel-Leisten', 'Sockel Leisten', 'Fußleisten', 'Fussleisten', 'Scheuerleisten']) {
      expect(SOCKEL_WORT.test(`Im Flur ${wort} neu`)).toBe(true)
    }
    expect(SOCKEL_WORT.test('Im Bad wird der Sockel gefliest')).toBe(false)
  })
})

describe('Rückbezug bleibt eng: „sie" darf kein anderes Hauptwort verdecken', () => {
  it('„im Wohnzimmer bleiben die Möbel stehen" ist kein Sockelleisten-Ausschluss', () => {
    const t = 'sockelleisten im flur neu, im wohnzimmer bleiben die möbel stehen'
    const a = erkenneSockelleistenAusschluss(t, ['Wohnzimmer', 'Flur'])
    expect(a.raeume.size).toBe(0)
    expect(a.global).toBe(false)
  })

  it('„in Küche und Esszimmer bleiben sie" bestellt in BEIDEN Räumen ab', () => {
    const t = 'sockelleisten im flur neu, in küche und esszimmer bleiben sie'
    const a = erkenneSockelleistenAusschluss(t, ['Küche', 'Esszimmer', 'Flur'])
    expect(a.raeume.has('Küche')).toBe(true)
    expect(a.raeume.has('Esszimmer')).toBe(true)
    expect(a.raeume.has('Flur')).toBe(false)
  })
})

describe('Dezimalkomma überlebt die Teilsatz-Trennung', () => {
  it('trennt nicht mitten in „4 x 1,50"', () => {
    const zu = saetzeJeRaum('Im Flur daneben 4 x 1,50, kommt der Boden komplett neu.', ['Flur'])
    expect((zu.get('Flur') ?? []).join(' ')).toMatch(/4 x 1,50/)
  })
})

// ── Was die Teilsatz-Trennung fast gekostet hätte ─────────────────────────
// „Im Flur muss der alte Belag raus, im Wohnzimmer nur die Ecke ausbauen."
// Solange das EIN Stück Text war, trug die erste Hälfte die zweite mit.
// Getrennt steht beim Wohnzimmer nur noch „nur die Ecke ausbauen" — und der
// Altbelag-Ausbau fiel dort still aus. Genau die Sorte Verlust, die dieser
// Umbau abstellen sollte, nicht erzeugen.
import { hatBodenArbeit } from '../boden-normalisierer'

describe('„ausbauen" ist eine Altbelag-Demontage, wenn es einen Gegenstand hat', () => {
  it('erkennt „im Wohnzimmer nur die Ecke ausbauen"', () => {
    expect(hatBodenArbeit('im wohnzimmer nur die ecke ausbauen', 'altbelag_entfernen')).toBe(true)
  })
  it('erkennt „den alten Boden ausbauen"', () => {
    expect(hatBodenArbeit('den alten boden ausbauen', 'altbelag_entfernen')).toBe(true)
  })
  it('erkennt NICHT „die Küche ausbauen"', () => {
    expect(hatBodenArbeit('die küche ausbauen', 'altbelag_entfernen')).toBe(false)
  })
  it('erkennt NICHT, wenn ausdrücklich liegen gelassen wird', () => {
    expect(hatBodenArbeit('die ecke bleibt liegen, nichts ausbauen', 'altbelag_entfernen')).toBe(false)
  })
})

describe('PM-036 durchgehend: der Wohnzimmer-Altbelag bleibt im Angebot', () => {
  it('legt Altbelag entfernen im Wohnzimmer an (6 m² Teilfläche)', () => {
    const daten = {
      transkript: PM036,
      raeume: [
        { name: 'Wohnzimmer', laenge: 5, breite: 4, teilflaeche: 6, belag: 'parkett', sockelleisten: false, tueren: [], arbeiten: ['parkett ausbessern'] },
        { name: 'Flur', laenge: 4, breite: 1.5, belag: 'parkett', sockelleisten: true, altbelag_entfernen: true, tueren: [], arbeiten: ['parkett verlegen', 'altbelag entfernen', 'sockelleisten erneuern'] },
      ],
    }
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'boden_parkett', bodenEngine(daten).positionen, PM036, undefined,
      { raeume: daten.raeume.map(r => ({ name: r.name, arbeiten: r.arbeiten })) },
    )
    const wz = positionen.find(p => /altbelag entfernen — wohnzimmer/i.test(p.beschreibung))
    expect(wz?.menge).toBe(6)
  })
})
