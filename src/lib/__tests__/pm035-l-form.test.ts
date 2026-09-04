import { describe, it, expect } from 'vitest'
import { erkenneLFormen, findeMassPaare, baueLForm } from '../l-form'
import { berechneSockelleistenLaenge } from '../mengen/gewerke/sockelleisten'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'

// PM-035, Befund 1 + 3 (Prüfmeister, 02.09.2026)
//
// Gesagt: „Der Flur ist L-förmig, einmal sechs Meter mal eins zwanzig und der
// kurze Schenkel zwo Meter mal eins zwanzig. Drei Türen gehen da ab."
// Angekommen: ein rechteckiger Flur, zweiter Schenkel spurlos weg.
//
// Der Text unten ist das echte `transkript_verarbeitet` der Aufnahme vom
// 03.09. aus der Produktionsdatenbank — inklusive der Whisper-Eigenheit, aus
// „einmal" ein „1 x" zu machen. Genau daran scheitert ein naiver Zahlen-Scan:
// er findet neben (6 × 1,20) auch das Paar (1 × 6).
const PM035 =
  'Wohnzimmer, 5,20 x 4,10. Das Arbeitszimmer hat 14 Quadratmeter. Die Maße habe ich nicht im Kopf. '
  + 'Der Flur ist L-förmig, 1 x 6 m x 1,20 und der kurze Schenkel 2 m x 1,20. Drei Türen gehen da ab. '
  + 'Überall Landhausdiele gerade verlegt. Trittschalldämmung überall drunter. '
  + 'Sockelleisten nur im Flur neu. In den Zimmern bleiben die alten.'

function pm035Raeume() {
  const basis = {
    hoehe: null, umfang: null as number | null, verlegerichtung: 'standard',
    belag: 'landhausdiele', arbeiten: ['landhausdiele verlegen'], fenster: [],
    altbelag_entfernen: false, nassbereich: false, ausgleich: false,
    feuchtigkeitssperre: false, parkett_schleifen: false, vage: false,
  }
  return [
    { ...basis, name: 'Wohnzimmer', laenge: 5.2 as number | null, breite: 4.1 as number | null, flaeche: null as number | null, tueren: [], sockelleisten: false },
    { ...basis, name: 'Arbeitszimmer', laenge: null as number | null, breite: null as number | null, flaeche: 14 as number | null, tueren: [], sockelleisten: false },
    { ...basis, name: 'Flur', laenge: null as number | null, breite: null as number | null, flaeche: null as number | null, tueren: [{ anzahl: 3, breite: 0.9, hoehe: 2.1, annahme: true }], sockelleisten: true },
  ]
}

describe('PM-035 — die beiden Schenkel aus dem Satz holen', () => {
  it('findet auch das überlappende Paar, das ein naiver Scan verschluckt', () => {
    const paare = findeMassPaare('l-förmig, 1 x 6 m x 1.20 und der kurze schenkel 2 m x 1.20')
    const alsText = paare.map(p => `${p.a}x${p.b}`)
    expect(alsText).toContain('6x1.2')
    expect(alsText).toContain('2x1.2')
  })

  it('wählt die Kombination, die geometrisch ein L sein kann', () => {
    // (1 × 6) und (6 × 1,20) teilen sich die 6 — aber eine 6 m breite Wand mit
    // 1 m langen Schenkeln ist kein Flur. Die geteilte Seite ist die Breite und
    // kann nicht länger sein als die Schenkel.
    const geo = baueLForm(findeMassPaare('l-förmig, 1 x 6 m x 1.20 und der kurze schenkel 2 m x 1.20'))
    expect(geo).not.toBeNull()
    expect(geo!.breite).toBe(1.2)
    expect(geo!.schenkel).toEqual([6, 2])
    expect(geo!.flaeche).toBe(9.6)
    expect(geo!.umfang).toBe(18.4)
  })

  it('rechnet Fläche und Umfang nach der Soll-Vorgabe des Prüfmeisters', () => {
    const raeume = pm035Raeume()
    const { erkannt, hinweise } = erkenneLFormen(PM035.toLowerCase().replace(/,(\d)/g, '.$1'), raeume)
    expect(erkannt.has('Flur')).toBe(true)
    expect(raeume[2].flaeche).toBe(9.6)
    expect(raeume[2].umfang).toBe(18.4)
    // Ein L ist kein Rechteck — Länge/Breite dürfen nicht stehen bleiben.
    expect(raeume[2].laenge).toBeNull()
    expect(raeume[2].breite).toBeNull()
    expect(hinweise[0]).toContain('9,60 m²')
    expect(hinweise[0]).toContain('18,40 m')
  })

  it('lässt die beiden rechteckigen Räume in Ruhe', () => {
    const raeume = pm035Raeume()
    erkenneLFormen(PM035.toLowerCase(), raeume)
    expect(raeume[0].laenge).toBe(5.2)
    expect(raeume[1].flaeche).toBe(14)
  })
})

describe('PM-035 — lieber fragen als raten', () => {
  it('nur ein Schenkel genannt: es wird NICHTS angenommen, aber deutlich gesagt', () => {
    const raeume = [{ name: 'Flur', laenge: null as number | null, breite: null as number | null, flaeche: null as number | null, umfang: null as number | null }]
    const { erkannt, hinweise } = erkenneLFormen('der flur ist l-förmig, 6 m x 1.20.', raeume)
    expect(erkannt.size).toBe(0)
    expect(raeume[0].flaeche).toBeNull()
    expect(hinweise[0]).toContain('nicht eindeutig')
    expect(hinweise[0]).toContain('Form zeichnen')
  })

  it('ohne L-Signal passiert gar nichts', () => {
    const raeume = [{ name: 'Flur', laenge: 6 as number | null, breite: 1.2 as number | null, flaeche: null as number | null, umfang: null as number | null }]
    const { hinweise } = erkenneLFormen('der flur ist 6 m x 1.20 und die küche 3 m x 1.20.', raeume)
    expect(hinweise).toEqual([])
    expect(raeume[0].laenge).toBe(6)
  })

  it('unplausible Kombinationen fallen raus', () => {
    // Zwei Paare ohne gemeinsame Seite ergeben kein L.
    expect(baueLForm(findeMassPaare('l-förmig, 6 m x 1.20 und 2 m x 0.80'))).toBeNull()
  })
})

describe('PM-035, Befund 3 — drei Türen sind drei Türen', () => {
  it('die Stückzahl je Tür-Eintrag zählt mit', () => {
    // VOB-012 (CoS-042, 04.09.2026): Unterbrechungen bis 1 m werden nach
    // DIN 18363/18365 (jeweils 5.3.2) NICHT abgezogen — eine Standardtür
    // (0,90 m) also nie. Die Stückzahl zählt trotzdem, sie entscheidet nur
    // bei Öffnungen ÜBER 1 m.
    expect(berechneSockelleistenLaenge(18.4, [{ anzahl: 3, breite: 0.9 }])).toBe(18.4)
    expect(berechneSockelleistenLaenge(18.4, [{ anzahl: 3, breite: 1.2 }])).toBe(14.8)
    // Ohne Stückzahl dasselbe Bild: 0,90 m bleibt unter der Schwelle.
    expect(berechneSockelleistenLaenge(18.4, [{ breite: 0.9 }])).toBe(18.4)
    expect(berechneSockelleistenLaenge(18.4, [{ breite: 1.2 }, { breite: 1.2 }])).toBe(16)
  })
})

describe('PM-035 — der ganze Fall durch die Pipeline', () => {
  function lauf() {
    const result = {
      gewerk: 'boden_parkett', raeume: pm035Raeume(),
      bereiche: [], waende: [], decken: [], objekte: [], annahmen: [], transkript: PM035,
    }
    return verarbeiteExtraktion(PM035, { result } as never)
  }
  const menge = (p: Array<{ beschreibung: string; menge: number }>, teil: string, raum: string) =>
    p.find(x => x.beschreibung.includes(teil) && x.beschreibung.endsWith(raum))?.menge

  it('liefert exakt die Soll-Mengen', () => {
    const p = lauf().mengen.positionen
    expect(menge(p, 'verlegen', 'Wohnzimmer')).toBe(22.39)
    expect(menge(p, 'verlegen', 'Arbeitszimmer')).toBe(14.7)
    expect(menge(p, 'verlegen', 'Flur')).toBe(10.08)
    expect(menge(p, 'Sockelleisten montieren', 'Flur')).toBe(18.4) // VOB-012: 3 Türen à 0,90 m werden nicht abgezogen
  })

  it('Trittschalldämmung in allen drei Räumen, Summe 44,92 m²', () => {
    const p = lauf().mengen.positionen.filter(x => /Trittschall/i.test(x.beschreibung))
    expect(p).toHaveLength(3)
    expect(Math.round(p.reduce((s, x) => s + x.menge, 0) * 100) / 100).toBe(44.92)
  })

  it('keine Sockelleisten in den Zimmern — „In den Zimmern bleiben die alten"', () => {
    const p = lauf().mengen.positionen
    expect(p.some(x => /Sockelleisten/i.test(x.beschreibung) && /zimmer$/i.test(x.beschreibung))).toBe(false)
  })

  it('die Rechnung steht sichtbar über dem Entwurf', () => {
    expect(lauf().mass_hinweise.join(' ')).toContain('L-Form aus 6,00 × 1,20 m und 2,00 × 1,20 m')
  })
})
