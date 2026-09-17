// PM-089 / PM-108 — die gesagte Nische hinterlässt eine Spur, und „nische"
// ist ein Wort, kein Wortstamm (Head of Product Engineering, 17.09.2026)
//
// Zwei Fälle des Prüfmeisters, eine Ursache, eine Reparatur:
//
//   PM-089  „… da ist eine Regalnische in der Wand, ein Meter zwanzig
//            breit, die muss mit gestrichen werden."
//   PM-108  „In der Wand ist eine Regalnische, ein mal zwei Meter, die
//            wird mitgestrichen."
//
// Beide Male: null Positionen mehr als ohne den Satz, `fehlende` leer. Der
// Satz verschwand spurlos.
//
// Gebaut ist ein FEHLT-EINTRAG, keine Position. Der Malerkatalog führt die
// Nische nur fürs Tapezieren (6,00 €/lfdm Aufpreis), fürs Streichen keine
// Zeile — gemessen in PM-089-D / PM-108-C. Eine bepreiste Position wäre
// erfunden (K.5), eine Zeile ohne Katalogtreffer wäre die 0,00-€-Zeile auf
// dem Kundenpapier (PM-066).
//
// Die Gegenproben in Block 3 sind der eigentliche Grund für diese Datei:
// „nische" steckt in „technische", „mechanische", „elektronische",
// „hygienische", „spanische". Ein `includes('nische')` hätte in jedem
// zweiten Diktat gefeuert — dieselbe Falle wie PM-064 und PM-074.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { DEFAULT_PRICES } from '../default-prices'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufVoll(gewerk: 'maler', transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen(gewerk, extraktion)
  const r2 = extraktion.raeume ?? raeume
  const text = ersetzeZahlenWorte(transkript)
  const signale = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arbeitenTexte: r2.flatMap((r: any) => r.arbeiten ?? []),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    belagText: r2.find((r: any) => r.belag)?.belag ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    altbelagEntfernen: r2.some((r: any) => r.altbelag_entfernen === true),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten ?? [] })),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(text) || undefined,
    tuerenAnzahl: zaehleTueren(text) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })),
  }
  return pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (t: string, r: any[]) => laufVoll('maler', t, r).positionen
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const abbild = (ps: any[]) => ps.map(p => `${p.beschreibung}|${p.menge}`).join('\n')
const fehltHat = (f: string[], m: RegExp) => f.some(x => m.test(x))

const WZ = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] })]
const KOPF = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen.'

describe('PM-089/PM-108 · die gesagte Nische hinterlässt eine Spur', () => {
  const T089 = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, '
    + 'da ist eine Regalnische in der Wand, ein Meter zwanzig breit, die muss mit gestrichen werden.'
  const T108 = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. '
    + 'In der Wand ist eine Regalnische, ein mal zwei Meter, die wird mitgestrichen.'

  it('1 · PM-089: der Nischensatz erzeugt einen Fehlt-Eintrag', () => {
    expect(fehltHat(laufVoll('maler', T089, WZ()).fehlende, /nische/i)).toBe(true)
  })

  it('2 · PM-108: derselbe Fall, andere Formulierung, dasselbe Ergebnis', () => {
    expect(fehltHat(laufVoll('maler', T108, WZ()).fehlende, /nische/i)).toBe(true)
  })

  it('3 · „Wandnische" und „Mauernische" ebenso', () => {
    for (const wort of ['Wandnische', 'Mauernische', 'Nische']) {
      const t = `${KOPF} In der Wand ist eine ${wort}, die wird mitgestrichen.`
      expect(fehltHat(laufVoll('maler', t, WZ()).fehlende, /nische/i), wort).toBe(true)
    }
  })

  it('4 · Mehrzahl: „zwei Regalnischen"', () => {
    const t = `${KOPF} In der Wand sind zwei Regalnischen, die werden mitgestrichen.`
    expect(fehltHat(laufVoll('maler', t, WZ()).fehlende, /nische/i)).toBe(true)
  })
})

describe('PM-089 · und es entsteht KEINE bepreiste Zeile', () => {
  const T089 = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, '
    + 'da ist eine Regalnische in der Wand, ein Meter zwanzig breit, die muss mit gestrichen werden.'

  it('5 · die Positionsliste ist Zeile für Zeile dieselbe wie ohne den Satz', () => {
    // Die Gegenrichtung zur Sperrklinke PM-089-B. Solange der Katalog fürs
    // Streichen keine Nischenzeile führt, ist das das Soll — PM-108-D des
    // Prüfmeisters verlangt genau dasselbe.
    expect(abbild(lauf(T089, WZ()))).toBe(abbild(lauf(KOPF, WZ())))
  })

  it('6 · Katalog-Beleg: fürs Streichen gibt es die Zeile nicht', () => {
    expect(DEFAULT_PRICES.some(p => /^Maler/.test(p.category) && /nisch/i.test(p.title) && /streich|anstrich/i.test(p.title))).toBe(false)
  })

  it('7 · die Wandfläche bleibt bei 45 m² — die Nische rechnet nichts um', () => {
    const wand = lauf(T089, WZ()).find(p => /Wand streichen/.test(p.beschreibung))
    expect(wand!.menge).toBe(45)
  })
})

describe('PM-089 · „nische" ist ein Wort, kein Wortstamm', () => {
  // Der Grund für diese Datei. Jeder dieser Sätze enthält die Buchstabenfolge
  // „nische" — und keiner spricht von einer Nische.
  const HARMLOS = [
    'Die technische Abnahme macht der Bauleiter.',
    'Die elektronische Rechnung geht per Mail raus.',
    'Eine mechanische Lüftung ist schon drin.',
    'Der Boden hat spanische Fliesen.',
    'Aus hygienischen Gründen wird zweimal gestrichen.',
  ]

  it('8 · kein Fehlt-Eintrag aus „technische", „elektronische", „mechanische", „spanische", „hygienische"', () => {
    for (const satz of HARMLOS) {
      const erg = laufVoll('maler', `${KOPF} ${satz}`, WZ())
      expect(fehltHat(erg.fehlende, /nische/i), satz).toBe(false)
    }
  })

  it('9 · und diese Sätze ändern das Angebot überhaupt nicht', () => {
    const ohne = abbild(lauf(KOPF, WZ()))
    for (const satz of HARMLOS) {
      expect(abbild(lauf(`${KOPF} ${satz}`, WZ())), satz).toBe(ohne)
    }
  })
})

describe('PM-089 · die Bremse greift nicht, wo keine Wand gestrichen wird', () => {
  it('10 · Nische ohne Wandposition im Angebot → kein Fehlt-Eintrag', () => {
    // Nur Decke. Die Nische ist Mehrarbeit an der WAND; ohne Wandarbeit gibt
    // es nichts, wozu sie Mehrarbeit wäre. Bewusst eng gehalten.
    const nurDecke = [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['decke streichen'] })]
    const t = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Nur die Decke streichen. In der Wand ist eine Regalnische.'
    const erg = laufVoll('maler', t, nurDecke)
    expect(erg.positionen.some(p => /Wand streichen/.test(p.beschreibung ?? ''))).toBe(false)
    expect(fehltHat(erg.fehlende, /nische/i)).toBe(false)
  })

  it('11 · ohne Nischensatz bleibt die Fehlt-Liste frei von Nischen', () => {
    expect(fehltHat(laufVoll('maler', KOPF, WZ()).fehlende, /nische/i)).toBe(false)
  })
})
