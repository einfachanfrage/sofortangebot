// Verschnitt-Angleich (Sandys Entscheidung 2026-08-30, PM-027): Die
// Vollständigkeitsprüfung rechnete hier 10 % Verschnitt, die Mengen-Engine
// dagegen 5 % — dieselbe Leistung ergab je nach Weg eine andere Menge im
// Angebot. Maßgeblich ist PM-004 (gerade Verlegung ≈ 5 %); die Regel steht
// jetzt einmal in `boden-normalisierer.ts`. Erwartungswerte unten deshalb von
// ×1,10 auf ×1,05 gezogen. Muster-/Diagonalverlegung bleibt bei 15 %.
import { describe, it, expect } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import type { BerechnetePosition } from '../../mengen/types'

function find(positionen: BerechnetePosition[], substr: string) {
  return positionen.find(p => p.beschreibung.toLowerCase().includes(substr.toLowerCase()))
}

describe('Boden – 10 Integrationstests', () => {
  it('ergänzt bei Klickvinyl die notwendige Trittschalldämmung', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'boden_parkett',
      [{ beschreibung: 'Klick-Vinyl verlegen inkl. 10% Verschnitt — Wohnzimmer', menge: 23.45, einheit: 'm²', konfidenz: 'high', berechnungsweg: '21.32 m² + 10% Verschnitt', annahmen: [] }],
      'Klickvinyl im Wohnzimmer verlegen',
    )
    const trittschall = positionen.find(position => /trittschall/i.test(position.beschreibung))
    expect(trittschall?.menge).toBe(21.32)
  })

  it('Test 1: Klick-Vinyl 34 m² + 10% Verschnitt + Estrich grundieren + Ausgleichsmasse 3mm', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      'Wohnzimmer mit Klick-Vinyl auslegen. Bodenfläche 34 Quadratmeter. 10 Prozent Verschnitt. Estrich grundieren und Ausgleichsmasse glattgezogen, 3 Millimeter stark.'
    )

    const grundieren = find(positionen, 'estrich grundieren')
    expect(grundieren).toBeDefined()
    expect(grundieren?.menge).toBe(34)

    const ausgleich = find(positionen, 'ausgleichsmasse')
    expect(ausgleich).toBeDefined()
    expect(ausgleich?.menge).toBe(34)
    expect(ausgleich?.beschreibung).toContain('3mm')

    const vinyl = find(positionen, 'klick-vinyl')
    expect(vinyl).toBeDefined()
    expect(vinyl?.menge).toBeCloseTo(37.4, 1)
    expect(vinyl?.beschreibung).toContain('10%')
  })

  it('Test 2: Parkett schleifen 3-fach + Fugen verkitten + 3× Parkettlack', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      'Altes Eichenparkett im Salon, 42 Quadratmeter. Dreimal komplett abgeschliffen, von grob bis feinst. Danach Unreinheiten verkitten. Dreimal mit hochabriebfestem seidenmatten Parkettlack versiegeln.'
    )

    const schleifen = find(positionen, 'parkett schleifen 3-fach')
    expect(schleifen).toBeDefined()
    expect(schleifen?.menge).toBe(42)

    const kitten = find(positionen, 'verkitten')
    expect(kitten).toBeDefined()
    expect(kitten?.menge).toBe(42)

    const lack1 = find(positionen, 'parkettlack versiegeln 1.')
    const lack2 = find(positionen, 'parkettlack versiegeln 2.')
    const lack3 = find(positionen, 'parkettlack versiegeln 3.')
    expect(lack1?.menge).toBe(42)
    expect(lack2?.menge).toBe(42)
    expect(lack3?.menge).toBe(42)
  })

  it('Test 3: Nadelvlies-Teppich vollflächig verklebt, L×B = 5,50×4,00 = 22 m²', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      'Nadelvlies-Teppichboden. Raum ist 5,50 Meter lang und 4,00 Meter breit. Bahnenware vollflächig verklebt mit Öko-Klebstoff.'
    )

    expect(find(positionen, 'untergrundvorbereitung')).toBeUndefined()

    const teppich = find(positionen, 'nadelvlies')
    expect(teppich).toBeDefined()
    expect(teppich?.menge).toBeCloseTo(22, 1)
    expect(teppich?.beschreibung.toLowerCase()).toContain('öko')
  })

  it('Test 4: Verklebter Teppich entfernen + Kleberreste abschleifen + Designboden 18×1,05=18,90 m²', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      'Alter vollflächig verklebter Teppichboden auf Anhydritestrich, 18 Quadratmeter. Mühsam mit dem Stripper rausreißen und Kleberreste komplett abschleifen. Danach Designboden verlegen.'
    )

    const entfernen = find(positionen, 'teppichboden entfernen (verklebt)')
    expect(entfernen).toBeDefined()
    expect(entfernen?.menge).toBe(18)

    const kleberreste = find(positionen, 'untergrund schleifen')
    expect(kleberreste).toBeDefined()
    expect(kleberreste?.menge).toBe(18)

    const design = find(positionen, 'designboden')
    expect(design).toBeDefined()
    expect(design?.menge).toBeCloseTo(18.9, 1)   // 18 × 1,05
  })

  it('Test 5: Epoxidharz-Feuchtigkeitssperre + Quarzsand + Laminat 28×1,05=29,40 m²', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      'Souterrain, Estrich hat zu viel Restfeuchte. Fläche 28 Quadratmeter. Epoxidharz-Feuchtigkeitssperre aufwalzen und Quarzsand absanden. Erst dann Laminat drauf.'
    )

    const sperre = find(positionen, 'epoxidharz')
    expect(sperre).toBeDefined()
    expect(sperre?.menge).toBe(28)

    const quarzsand = find(positionen, 'quarzsand')
    expect(quarzsand).toBeDefined()
    expect(quarzsand?.menge).toBe(28)

    const laminat = find(positionen, 'laminat')
    expect(laminat).toBeDefined()
    expect(laminat?.menge).toBeCloseTo(29.4, 1)  // 28 × 1,05
  })

  it('Test 6: Vinyl 12 m² + Hamburger Profilleiste 16 lfdm + Alu-Übergangsprofil 2 Stück', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      'Vinyl-Boden im Flur, 12 Quadratmeter. Hamburger Profilleisten aus MDF weiß foliert, 16 laufende Meter, unsichtbar geklippt. An den zwei Zimmertüren Alu-Übergangsprofil in Silber.'
    )

    const vinyl = find(positionen, 'vinyl')
    expect(vinyl).toBeDefined()
    expect(vinyl?.menge).toBeCloseTo(12.6, 1)    // 12 × 1,05

    const leiste = find(positionen, 'hamburger profilleiste')
    expect(leiste).toBeDefined()
    expect(leiste?.menge).toBe(16)
    expect(leiste?.einheit).toBe('lfdm')

    const profil = find(positionen, 'alu-übergangsprofil silber')
    expect(profil).toBeDefined()
    expect(profil?.menge).toBe(2)
    expect(profil?.einheit).toBe('Stück')
  })

  it('Test 7: Treppe 14 Stufen → Trittstufen + Setzstufen verkleiden + Treppenkantenprofil Alu', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      'Holztreppe mit dem gleichen Laminat verkleiden wie der Flur. Genau 14 gerade Stufen. Trittstufen und Setzstufen sauber verkleiden, an jeder Vorderkante rutschhemmendes Treppenkantenprofil aus Alu anbringen.'
    )

    const tritt = find(positionen, 'trittstufen')
    expect(tritt).toBeDefined()
    expect(tritt?.menge).toBe(14)
    expect(tritt?.einheit).toBe('Stück')
    expect(tritt?.beschreibung.toLowerCase()).toContain('verkleid')

    const setz = find(positionen, 'setzstufen')
    expect(setz).toBeDefined()
    expect(setz?.menge).toBe(14)
    expect(setz?.einheit).toBe('Stück')

    const kante = find(positionen, 'treppenkantenprofil')
    expect(kante).toBeDefined()
    expect(kante?.menge).toBe(14)
    expect(kante?.einheit).toBe('Stück')
    expect(kante?.beschreibung.toLowerCase()).toContain('alu')
  })

  it('Test 8: Linoleum 65 m² + Untergrundvorbereitung + Verschnitt 68,25 m² + Fugen fräsen + verschweißen 50 lfdm', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      'Arztpraxis: 65 Quadratmeter Linoleum verlegen. Thermisches Verschweißen der Fugen mit passendem Schweißdraht. Schätzungsweise 50 laufende Meter Fuge, die gefräst und verschweißt werden müssen.'
    )

    expect(find(positionen, 'untergrundvorbereitung')).toBeUndefined()

    const lino = find(positionen, 'linoleum')
    expect(lino).toBeDefined()
    expect(lino?.menge).toBeCloseTo(68.25, 1)    // 65 × 1,05

    const fraesen = find(positionen, 'fugen fräsen')
    expect(fraesen).toBeDefined()
    expect(fraesen?.menge).toBe(50)
    expect(fraesen?.einheit).toBe('lfdm')

    const schweissen = find(positionen, 'thermisch verschweißen')
    expect(schweissen).toBeDefined()
    expect(schweissen?.menge).toBe(50)
    expect(schweissen?.einheit).toBe('lfdm')
  })

  it('Test 9: Laminat 55 m² + Trittschalldämmung hochwertig PUR + Stoßkanten + Verschnitt 57,75 m²', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      'Laminat im Obergeschoss, 55 Quadratmeter. Hochwertige Trittschalldämmung, 3 Millimeter PUR-Schaum mit Alufolie kaschiert, inklusive Stoßkanten verkleben.'
    )

    const daemmung = find(positionen, 'trittschalldämmung hochwertig')
    expect(daemmung).toBeDefined()
    expect(daemmung?.menge).toBe(55)
    expect(daemmung?.beschreibung.toLowerCase()).toContain('pur')

    const stosskanten = find(positionen, 'stoßkanten')
    expect(stosskanten).toBeDefined()
    expect(stosskanten?.menge).toBe(55)

    const laminat = find(positionen, 'laminat')
    expect(laminat).toBeDefined()
    expect(laminat?.menge).toBeCloseTo(57.75, 1) // 55 × 1,05
  })

  it('Test 10: Fertigparkett Fischgrät 50 m² + 15% Verschnitt = 57,50 m²', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [],
      '50 Quadratmeter Fertigparkett, klassisches Fischgrät-Muster vollflächig verklebt. Verschnitt 15 Prozent.'
    )

    expect(find(positionen, 'untergrundvorbereitung')).toBeUndefined()

    const fischgraet = find(positionen, 'fischgrät')
    expect(fischgraet).toBeDefined()
    expect(fischgraet?.menge).toBeCloseTo(57.5, 1)
    expect(fischgraet?.beschreibung.toLowerCase()).toContain('vollflächig')
  })
})

// Stückzahl der Übergangsprofile — Funde aus dem Code-Review vom 2026-08-31.
// Die Zahl muss aus DEM Satz kommen, in dem der Übergang steht, und darf weder
// ein Raummaß aus einem anderen Satz einsammeln noch an einem Komma verloren
// gehen. Alle drei Fälle haben echtes Geld auf der Rechnung.
describe('Übergangsprofil — Stückzahl', () => {
  const anzahlFuer = (text: string) => {
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], text)
    const p = positionen.find(x => /übergangs(?:profil|schiene)|alu-übergangsprofil/i.test(x.beschreibung))
    return p ? p.menge : (fehlende.some(f => /überg/i.test(f)) ? 'nachfragen' : null)
  }

  it('nimmt kein Raummaß aus einem anderen Satz als Stückzahl (PM-009)', () => {
    // „Flur, vier mal eins achtzig." → früher vier Schienen statt einer.
    expect(anzahlFuer('Vinylboden im Flur, vier mal eins achtzig. Am Übergang zum Wohnzimmer brauchen wir noch ne Übergangsschiene.')).toBe(1)
  })

  it('verliert die Stückzahl nicht am Komma', () => {
    expect(anzahlFuer('Vinylboden im Flur, 12 Quadratmeter. An den zwei Zimmertüren, Alu-Übergangsprofil in Silber.')).toBe(2)
  })

  it('rät bei unbezifferter Mehrzahl nicht auf eins, sondern fragt nach', () => {
    expect(anzahlFuer('Vinylboden im Flur, 12 Quadratmeter. An allen Türübergängen Übergangsprofile.')).toBe('nachfragen')
  })
})
