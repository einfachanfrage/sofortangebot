import { describe, it, expect } from 'vitest'
import { berechneUndPruefeAlleGewerke } from '../mengen/mehrgewerk'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit'
import { malerEngine } from '../mengen/gewerke/maler'
import { ergaenzeAusAufnahmeHinweisen } from '../mengen/aufnahme-hinweise'
import type { BerechnetePosition } from '../mengen/types'

// ── Stufe 4, erster Block (Prüfmeister, 05.09.2026) ───────────────────────
//
// Zwei Befunde, ein gemeinsamer Kern: Im Angebot stehen zwei Zeilen, die
// sich gegenseitig widersprechen, und der Erste, dem das auffällt, ist der
// Handwerker, der es verschicken soll.
//
//   PM-011  „Erschwerniszuschlag schwieriger Untergrund 10 % = 98,10 €"
//           neben „Spachtelarbeiten Q2 · 36,00 m² · 324,00 €".
//   PM-012  „Sockelleisten abkleben 15,00 lfdm" neben „Sockelleisten
//           streichen 15,00 lfdm".
//
// Die Originaldiktate, wörtlich aus der Einsprechliste.

const PM011 = 'Ähm, Arbeitszimmer, vier mal drei zwanzig, Höhe zwo fünfzig. Ist n Altbau, '
  + 'die Wände sind ordentlich uneben — die müssen komplett gespachtelt werden, Qualitätsstufe Q2, '
  + 'nicht nur ne kleine Ausbesserung, wirklich die ganze Fläche. Danach zweimal streichen. '
  + 'Ein Fenster, Standardmaß, eine Tür, normal. Sockelleisten kleben wir ab, die bleiben wie sie sind.'

const PM012 = 'Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber, '
  + 'ganz normal. Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, '
  + 'die NICHT demontiert — die sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand. '
  + 'Ein Fenster, Standardgröße, eine Tür, normal Maß.'

/* eslint-disable @typescript-eslint/no-explicit-any */
const lauf = (text: string, raum: any) => {
  const p = verarbeiteExtraktion(text, { result: { gewerk: 'maler', raeume: [raum], transkript: text } as any })
  return berechneUndPruefeAlleGewerke(
    p.extraktion as any,
    text,
    { raeume: [{ name: raum.name, hoehe: raum.hoehe }] } as any,
    { arbeitenTexte: raum.arbeiten ?? [], raeume: [{ name: raum.name, arbeiten: raum.arbeiten }] } as any,
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const titel = (p: { beschreibung: string }[]) => p.map(x => x.beschreibung)
const menge = (p: { beschreibung: string; menge: number }[], m: RegExp) => p.find(x => m.test(x.beschreibung))?.menge

const RAUM_PM011 = {
  name: 'Arbeitszimmer', laenge: 4, breite: 3.2, hoehe: 2.5,
  fenster: [{ breite: 1.2, hoehe: 1.3, anzahl: 1 }],
  tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
  arbeiten: ['wände spachteln q2', 'wände streichen'],
}

const RAUM_PM012 = {
  name: 'Esszimmer', laenge: 4.5, breite: 3, hoehe: 2.55,
  fenster: [{ breite: 1.2, hoehe: 1.3, anzahl: 1 }],
  tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
  arbeiten: ['wände streichen', 'sockelleisten streichen'],
  sockelleisten: false,
}

describe('PM-011 — die Erschwernis wird nicht zweimal kassiert', () => {
  it('Originalfall: Q2-Vollflächenspachtelung, also kein Untergrund-Zuschlag', () => {
    const t = titel(lauf(PM011, RAUM_PM011).positionen)
    expect(t.some(x => /spachtelarbeiten q2/i.test(x))).toBe(true)
    expect(t.some(x => /erschwerniszuschlag schwieriger untergrund/i.test(x))).toBe(false)
  })

  it('die Mengen des Prüfmeisters bleiben exakt', () => {
    const p = lauf(PM011, RAUM_PM011).positionen
    expect(menge(p, /wandflächen streichen/i)).toBe(36)
    expect(menge(p, /spachtelarbeiten q2/i)).toBe(36)
    expect(menge(p, /boden schützen/i)).toBe(12.8)
    expect(menge(p, /sockelleisten abkleben/i)).toBe(14.4)
  })

  it('der Altbau-Zuschlag bleibt — der zahlt nicht die Wand, sondern die Baustelle', () => {
    expect(titel(lauf(PM011, RAUM_PM011).positionen).some(x => /erschwerniszuschlag altbau/i.test(x))).toBe(true)
  })
})

// Die Gegenrichtung ist der teurere Fehler: einen berechtigten Zuschlag
// stillschweigend zu schlucken fällt niemandem auf.
describe('PM-011 — ohne Vollflächenspachtelung bleibt der Zuschlag stehen', () => {
  const einraum = (text: string) => {
    const raum = { ...RAUM_PM011, arbeiten: ['wände streichen'] }
    const engine = malerEngine({ transkript: text, raeume: [raum] } as never).positionen
    return titel(pruefeUndErgaenzeVollstaendigkeit('maler', engine, text,
      { raeume: [{ name: 'Arbeitszimmer', hoehe: 2.5 }] }).positionen)
  }

  it('bröckelnder Putz ohne Spachtelposition → Zuschlag', () => {
    const t = einraum('Arbeitszimmer, vier mal drei zwanzig, Höhe zwo fünfzig. Wände zweimal streichen. '
      + 'Der Untergrund ist schwierig, der alte Putz bröckelt.')
    expect(t.some(x => /erschwerniszuschlag schwieriger untergrund/i.test(x))).toBe(true)
  })

  it('punktuelles Spachteln ist keine Vollflächenspachtelung', () => {
    // „Dübellöcher spachteln" beantwortet einen bröckeligen Untergrund nicht.
    // Ein Muster auf blosses „spachtel" hätte den Zuschlag hier verschluckt.
    const t = einraum('Arbeitszimmer, vier mal drei zwanzig, Höhe zwo fünfzig. Wände zweimal streichen. '
      + 'Der Untergrund ist schwierig, der Putz bröckelt. Die Dübellöcher werden gespachtelt.')
    expect(t.some(x => /dübellöcher spachteln/i.test(x))).toBe(true)
    expect(t.some(x => /erschwerniszuschlag schwieriger untergrund/i.test(x))).toBe(true)
  })
})

// Der Aufruf muss HINTER pruefeSpachteln/pruefeSpachtelarbeiten stehen —
// davor ist die Spachtelposition noch gar nicht in der Liste und die Regel
// greift still nie. Dieser Test hält die Reihenfolge fest.
describe('PM-011 — die Regel greift auch, wenn die Spachtelung erst ergänzt wird', () => {
  it('Q3-Spachtelung aus der Vollständigkeitsprüfung schluckt den Zuschlag', () => {
    const text = 'Arbeitszimmer, vier mal drei zwanzig, Höhe zwo fünfzig. Wände zweimal streichen. '
      + 'Die Wände sind uneben, die müssen vollflächig gespachtelt werden in Q3.'
    const raum = { ...RAUM_PM011, arbeiten: ['wände streichen'] }
    const engine = malerEngine({ transkript: text, raeume: [raum] } as never).positionen
    // Die Engine selbst liefert keine Spachtelposition — sie entsteht erst danach.
    expect(titel(engine).some(x => /spachtel/i.test(x))).toBe(false)
    const t = titel(pruefeUndErgaenzeVollstaendigkeit('maler', engine, text,
      { raeume: [{ name: 'Arbeitszimmer', hoehe: 2.5 }] }).positionen)
    expect(t.some(x => /spachtelarbeiten q3/i.test(x))).toBe(true)
    expect(t.some(x => /erschwerniszuschlag schwieriger untergrund/i.test(x))).toBe(false)
  })
})

describe('PM-012 — wer die Leiste streicht, klebt sie nicht ab', () => {
  it('Originalfall über die Pipeline: streichen statt abkleben, 15,00 lfdm', () => {
    const t = titel(lauf(PM012, RAUM_PM012).positionen)
    expect(t.some(x => /sockelleisten streichen/i.test(x))).toBe(true)
    expect(t.some(x => /sockelleisten abkleben/i.test(x))).toBe(false)
    expect(menge(lauf(PM012, RAUM_PM012).positionen, /sockelleisten streichen/i)).toBe(15)
  })

  it('die übrigen Mengen bleiben exakt', () => {
    const p = lauf(PM012, RAUM_PM012).positionen
    expect(menge(p, /wandflächen streichen/i)).toBe(38.25)
    expect(menge(p, /boden schützen/i)).toBe(13.5)
  })
})

// ── Die eigentliche Wurzel ────────────────────────────────────────────────
//
// Die Pipeline oben war schon sauber. Live standen trotzdem beide Zeilen im
// Entwurf, weil „Sockelleisten streichen" an einer DRITTEN Stelle entsteht:
// im Sicherheitsnetz `ergaenzeAusAufnahmeHinweisen`, das in der Route läuft
// — also NACH allem, was mehrgewerk.ts aufräumt. Genau deshalb listete die
// Aufnahme-Karte drei Positionen und der Entwurf vier.
describe('PM-012, Wurzel: das Sicherheitsnetz in der Route räumt jetzt mit auf', () => {
  const karte: BerechnetePosition[] = [
    { beschreibung: 'Wandflächen streichen 2x — Esszimmer', menge: 38.25, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
    { beschreibung: 'Boden schützen — Esszimmer', menge: 13.5, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
    { beschreibung: 'Sockelleisten abkleben — Esszimmer', menge: 15, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
  ]

  it('Karte 3 Positionen → Entwurf 3 Positionen, nicht 4', () => {
    const t = titel(ergaenzeAusAufnahmeHinweisen(karte, ['Wände streichen', 'Sockelleisten streichen'], PM012))
    expect(t).toEqual([
      'Wandflächen streichen 2x — Esszimmer',
      'Boden schützen — Esszimmer',
      'Sockelleisten streichen — Esszimmer',
    ])
  })

  it('PM-010 bleibt wie er war: montieren und streichen, kein Abkleben', () => {
    const t = titel(ergaenzeAusAufnahmeHinweisen(
      [
        { beschreibung: 'Wandflächen streichen 2x — Flur', menge: 30, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
        { beschreibung: 'Sockelleisten abkleben — Flur', menge: 12, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
      ],
      ['Sockelleisten montieren', 'Sockelleisten streichen'],
      'Flur, alte Sockelleisten raus, neue montieren, danach streichen.',
    ))
    expect(t.some(x => /sockelleisten montieren/i.test(x))).toBe(true)
    expect(t.some(x => /sockelleisten streichen/i.test(x))).toBe(true)
    expect(t.some(x => /sockelleisten abkleben/i.test(x))).toBe(false)
  })

  it('ohne Arbeit an der Leiste bleibt das Abkleben stehen — es ist die Regel, kein Rundumschlag', () => {
    const t = titel(ergaenzeAusAufnahmeHinweisen(karte, ['Wände streichen'],
      'Esszimmer, viereinhalb mal drei. Wände streichen, zweimal drüber.'))
    expect(t.some(x => /sockelleisten abkleben/i.test(x))).toBe(true)
    expect(t.some(x => /sockelleisten streichen/i.test(x))).toBe(false)
  })

  it('mehrere Räume: nur der Raum mit der Leisten-Arbeit verliert sein Abkleben', () => {
    const t = titel(ergaenzeAusAufnahmeHinweisen(
      [
        { beschreibung: 'Sockelleisten streichen — Esszimmer', menge: 15, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
        { beschreibung: 'Sockelleisten abkleben — Esszimmer', menge: 15, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
        { beschreibung: 'Sockelleisten abkleben — Flur', menge: 9, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
      ],
      ['Wände streichen'],
      'Esszimmer und Flur streichen.',
    ))
    expect(t).toEqual(['Sockelleisten streichen — Esszimmer', 'Sockelleisten abkleben — Flur'])
  })
})
