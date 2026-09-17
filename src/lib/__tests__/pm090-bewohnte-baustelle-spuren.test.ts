// PM-090 / PM-109 — Staubschutzwand und Abendreinigung hinterlassen eine Spur
// (Head of Product Engineering, 17.09.2026)
//
// Zwei Fälle des Prüfmeisters, dieselbe bewohnte Baustelle, zwei
// Formulierungen:
//
//   PM-090  „Die Wohnung ist bewohnt, wir brauchen eine Staubschutzwand
//            zum Flur, und jeden Abend muss besenrein gereinigt werden."
//   PM-109  „Die Wohnung ist bewohnt, wir brauchen eine Staubschutzwand
//            und räumen jeden Abend auf."
//
// „Bewohnt" allein wirkt heute schon — `Möbel abdecken mit Folie` und der
// `Erschwerniszuschlag bewohnt` entstehen. Die zwei Leistungen, die eine
// bewohnte Baustelle darüber hinaus teuer machen, verschwanden spurlos:
// weder Position noch Fehlt-Eintrag.
//
// GEBAUT SIND ZWEI FEHLT-EINTRÄGE, KEINE POSITIONEN — und das ist bei beiden
// eine eigene Begründung, nicht dieselbe:
//
//   Staubschutzwand: Die Katalogzeile (`Staubschutzwand / Trennwand zu
//     angrenzenden Bereichen`, 14,00 €/m²) liegt im ABBRUCH-Gewerk und ist
//     vom Maler aus nicht erreichbar. `gewerkFuerPosition('Staubschutzwand
//     stellen', 'maler')` liefert trotzdem `maler` — wer hier eine Position
//     baut, bekommt eine Zeile mit 0,00 € auf dem Kundenpapier, das
//     PM-066-Muster. Genau davor hat der Prüfmeister gewarnt (PM-090-D).
//
//   Reinigung: Die Zeilen gibt es im AKTIVEN Malerkatalog
//     (`Baustelle kehren / saugen nach Arbeit`, 40,00 € Pauschale;
//     `Endreinigung Fenster / Böden`, 45,00 €/Stunde). Hier fehlt nicht der
//     Preis, sondern die MENGE: Wie viele Abende, wie viele Stunden je Abend?
//     Beides steht in keinem der beiden Diktate. Eine Pauschale mal 1 wäre
//     eine erfundene Zahl mit dem Aussehen eines Messwerts (Regel H Satz 3).
//
// Block 3 ist der eigentliche Grund für diese Datei: Der Reinigungs-Auslöser
// darf NICHT an jedem Wort mit „reinig" hängen. „Die Fassade muss vorher
// gereinigt werden" ist Fassadenreinigung und hat ihre eigene Regel; „die
// Fliesen reinigen" ist ein anderes Gewerk. Der Auslöser hängt deshalb am
// TAKT („jeden Abend", „täglich") zusammen mit einer Aufräumarbeit — oder am
// eindeutigen Wort „besenrein".
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (ps: any[], m: RegExp) => ps.find(p => m.test(p.beschreibung))
const fehltHat = (f: string[], m: RegExp) => f.some(x => m.test(x))

const WZ = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] })]

const KOPF = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen.'
const T_BEWOHNT = `${KOPF} Die Wohnung ist bewohnt.`
const T_090 = `${KOPF} Die Wohnung ist bewohnt, wir brauchen eine Staubschutzwand zum Flur, `
  + 'und jeden Abend muss besenrein gereinigt werden.'
const T_109 = `${KOPF} Die Wohnung ist bewohnt, wir brauchen eine Staubschutzwand und räumen jeden Abend auf.`

describe('PM-090/PM-109 · die zwei gesagten Leistungen hinterlassen eine Spur', () => {
  it('1 · PM-090-A: die Staubschutzwand steht in der Fehlt-Liste', () => {
    expect(fehltHat(laufVoll('maler', T_090, WZ()).fehlende, /staubschutz|trennwand/i)).toBe(true)
  })

  it('2 · PM-090-B: die Abendreinigung steht in der Fehlt-Liste', () => {
    expect(fehltHat(laufVoll('maler', T_090, WZ()).fehlende, /reinig|besenrein/i)).toBe(true)
  })

  it('3 · PM-109-A: dieselbe Wand, andere Formulierung', () => {
    expect(fehltHat(laufVoll('maler', T_109, WZ()).fehlende, /staubschutz|trennwand/i)).toBe(true)
  })

  it('4 · PM-109-B: „räumen jeden Abend auf" ist derselbe Fall wie „besenrein"', () => {
    expect(fehltHat(laufVoll('maler', T_109, WZ()).fehlende, /reinig|besenrein/i)).toBe(true)
  })
})

describe('PM-090 · keine der beiden wird eine bepreiste Zeile', () => {
  it('5 · die Positionsliste ist Zeile für Zeile dieselbe wie ohne die Zusatzsätze', () => {
    // Das ist die Kontrolle, die aus einem Fehlt-Eintrag keine stille
    // 0,00-€-Zeile werden lässt (PM-066-Muster). PM-090-E des Prüfmeisters
    // sagt dasselbe und bleibt damit grün.
    expect(abbild(lauf(T_090, WZ()))).toBe(abbild(lauf(T_BEWOHNT, WZ())))
    expect(abbild(lauf(T_109, WZ()))).toBe(abbild(lauf(T_BEWOHNT, WZ())))
  })

  it('6 · „bewohnt" allein wirkt unverändert — Möbel und Zuschlag bleiben', () => {
    const p = lauf(T_090, WZ())
    expect(finde(p, /Möbel abdecken/)).toBeDefined()
    expect(finde(p, /Erschwerniszuschlag bewohnt/)).toBeDefined()
  })

  it('7 · Katalog-Beleg: die Wand ist für den Maler gesperrt, die Reinigung nicht', () => {
    // Der Grund, warum die zwei Fehlt-Einträge verschieden begründet sind.
    const wand = DEFAULT_PRICES.find(p => p.title === 'Staubschutzwand / Trennwand zu angrenzenden Bereichen')!
    expect(wand.unit_price).toBe(14)
    expect(preisKategoriePasstZuGewerk(wand.category, 'maler')).toBe(false)

    const kehren = DEFAULT_PRICES.find(p => p.title === 'Baustelle kehren / saugen nach Arbeit'
      && p.category.startsWith('Maler'))!
    expect(kehren.unit_price).toBe(40)
    expect(preisKategoriePasstZuGewerk(kehren.category, 'maler')).toBe(true)
  })
})

describe('PM-090 · Gegenproben — die Auslöser feuern nicht auf gewöhnlichen Sätzen', () => {
  it('8 · „reinigen" ohne Takt löst nichts aus — die Fassade hat ihre eigene Regel', () => {
    const harmlos = [
      'Die Fassade muss vorher gereinigt werden.',
      'Der Untergrund wird gereinigt und grundiert.',
      'Die Reinigungsmittel stellt der Kunde.',
      'Danach die Pinsel reinigen.',
    ]
    for (const satz of harmlos) {
      const erg = laufVoll('maler', `${KOPF} ${satz}`, WZ())
      expect(fehltHat(erg.fehlende, /baustellenreinigung/i)).toBe(false)
    }
  })

  it('9 · „jeden Abend" ohne Aufräumarbeit löst nichts aus', () => {
    const erg = laufVoll('maler', `${KOPF} Der Kunde ist jeden Abend ab sechs zu Hause.`, WZ())
    expect(fehltHat(erg.fehlende, /baustellenreinigung/i)).toBe(false)
  })

  it('10 · eine bloße „Trennwand" ist kein Staubschutz', () => {
    // „Die Trennwand zum Flur wird mitgestrichen" ist eine Wand, die
    // gestrichen wird — kein Baustellenschutz. Der Auslöser hängt deshalb an
    // „Staubschutz"/„Staubwand", nicht an „Trennwand".
    const erg = laufVoll('maler', `${KOPF} Die Trennwand zum Flur wird mitgestrichen.`, WZ())
    expect(fehltHat(erg.fehlende, /staubschutz/i)).toBe(false)
  })

  it('11 · ohne die Zusatzsätze bleibt die Fehlt-Liste frei von beiden', () => {
    const erg = laufVoll('maler', T_BEWOHNT, WZ())
    expect(fehltHat(erg.fehlende, /staubschutz/i)).toBe(false)
    expect(fehltHat(erg.fehlende, /baustellenreinigung/i)).toBe(false)
  })

  it('12 · der Eintrag entsteht je Angebot genau einmal, auch bei zwei Sätzen', () => {
    const t = `${KOPF} Wir brauchen eine Staubschutzwand zum Flur. `
      + 'Zum Schlafzimmer brauchen wir auch eine Staubschutzwand. '
      + 'Jeden Abend besenrein kehren, und am letzten Tag besenrein übergeben.'
    const f = laufVoll('maler', t, WZ()).fehlende
    expect(f.filter(x => /staubschutz/i.test(x))).toHaveLength(1)
    expect(f.filter(x => /baustellenreinigung/i.test(x))).toHaveLength(1)
  })
})
