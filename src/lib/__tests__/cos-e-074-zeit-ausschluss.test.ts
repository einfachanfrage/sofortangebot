// ── CoS-E-074 · Ausschluss in der ZEIT (DC-116, deckt PM-116 und PM-097) ──
//
// „Das kommt später und wird extra angeboten." Der Satz stand bis heute in
// den Transkripten und wirkte nirgends: In PM-116 standen 305,40 € Küche im
// selben Angebot, in PM-097 eine Summe über beide Bauabschnitte.
//
// Geprüft wird hier, was die beiden Prüfmeister-Sperrklinken NICHT prüfen:
// die Ränder. Die Fälle selbst stehen bei ihm (`pruefmeister-batch-104-116`,
// `pruefmeister-batch-89-97`) und bleiben seine.
//
// Die wichtigste Zusicherung dieser Datei ist Nr. 8: „Zweiter Bauabschnitt"
// allein darf NICHTS auslösen. Gemessen (siehe Kopf von `zeit-ausschluss.ts`)
// hätte ein Auslöser darauf in PM-097 den ERSTEN Bauabschnitt aus dem
// Angebot geworfen — den, der bezahlt werden soll.
//
// Head of Product Engineering · 17.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { berechneUndPruefeAlleGewerke } from '../mengen/mehrgewerk'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import { zeitlichAusgenommeneRaeume } from '../zeit-ausschluss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// Derselbe Aufbau wie in den Prüfmeister-Batches: über die Pipeline, Text
// einmal am Eingang normalisiert (K.2).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufVoll(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = { raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })) }
  return {
    ...pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never),
    extraktion,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (t: string, r: any[]) => laufVoll('maler', t, r).positionen.map(p => p.beschreibung)
const fehlt = (f: string[], m: RegExp) => f.some(x => m.test(x))

const WZ = () => raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen'] })
const KUECHE = () => raum('Küche', { laenge: 3, breite: 3, hoehe: 2.5, arbeiten: ['wände streichen'] })

const T_116 = 'Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. '
  + 'Zweiter Bauabschnitt Küche drei mal drei, das kommt später und wird extra angeboten.'
const T_OHNE = 'Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. '
  + 'Zweiter Bauabschnitt Küche drei mal drei, Wände streichen.'

describe('CoS-E-074 · der Zeit-Ausschluss', () => {
  it('1 · der ausgenommene Raum ist aus den Positionen raus, der andere unberührt', () => {
    const t = titel(T_116, [WZ(), KUECHE()])
    expect(t.some(x => /Küche/.test(x))).toBe(false)
    expect(t.some(x => /Wohnzimmer/.test(x))).toBe(true)
  })

  it('2 · Gegenprobe Zeile für Zeile: der erste Abschnitt bewegt sich nicht', () => {
    // Ohne den Ausschlusssatz stehen beide Räume da. Was danach übrig bleibt,
    // muss Zeichen für Zeichen der Wohnzimmer-Teil davon sein — nicht „so
    // ungefähr dieselbe Liste".
    const mitAusschluss = titel(T_116, [WZ(), KUECHE()])
    const ohneAusschluss = titel(T_OHNE, [WZ(), KUECHE()])
    expect(mitAusschluss).toEqual(ohneAusschluss.filter(x => !/Küche/.test(x)))
  })

  it('3 · das Weglassen wird gezeigt — mit Raumname UND Beleg-Satz (DC-116)', () => {
    const f = laufVoll('maler', T_116, [WZ(), KUECHE()]).fehlende
    const zeile = f.find(x => /Küche/.test(x))
    expect(zeile).toBeDefined()
    expect(zeile).toMatch(/steht nicht in diesem Angebot/)
    expect(zeile).toMatch(/extra angeboten/)
  })

  it('4 · die Maße des ausgenommenen Raums bleiben erhalten („Als eigenes Angebot anlegen")', () => {
    // Der Sinn der ganzen Auflage des Designers: der Raum verschwindet aus
    // dem Angebot, nicht aus der Aufnahme.
    const { extraktion } = laufVoll('maler', T_116, [WZ(), KUECHE()])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kueche = (extraktion.raeume ?? []).find((r: any) => r.name === 'Küche')
    expect(kueche).toBeDefined()
    expect(kueche.laenge).toBe(3)
    expect(kueche.breite).toBe(3)
    expect(kueche.arbeiten).toContain('wände streichen')
  })

  it('5 · PM-097: der Zeit-Ausschluss trifft auch Räume, die Arbeiten HABEN', () => {
    // Genau hier steigt `raum-ausschluss.ts` (PM-034) aus — `hatKeinerleiArbeit`
    // ist falsch, die Küche trägt „wände streichen". Ohne diese Zusicherung
    // wäre der Unterschied zwischen Umfang und Zeit nur eine Behauptung.
    const treffer = zeitlichAusgenommeneRaeume(ersetzeZahlenWorte(T_116), ['Wohnzimmer', 'Küche'])
    expect([...treffer.keys()]).toEqual(['Küche'])
  })

  it('6 · alle vier Wendungen aus DC-116 lösen aus', () => {
    const basis = 'Wohnzimmer vier mal fünf, Wände streichen. Küche drei mal drei, '
    for (const satz of [
      'das kommt später',
      'wird extra angeboten',
      'wird getrennt abgerechnet',
      'das machen wir im zweiten Bauabschnitt',
      'das wird separat berechnet',
      'dafür kommt ein eigenes Angebot',
    ]) {
      const treffer = zeitlichAusgenommeneRaeume(ersetzeZahlenWorte(basis + satz + '.'), ['Wohnzimmer', 'Küche'])
      expect([...treffer.keys()], satz).toEqual(['Küche'])
    }
  })

  it('7 · Gegenprobe: harmlose Sätze mit „später" lösen nichts aus', () => {
    const basis = 'Wohnzimmer vier mal fünf, Wände streichen. Küche drei mal drei, Wände streichen, '
    for (const satz of [
      'wir fangen später an',
      'die Farbe suchen wir später aus',
      'der Kunde meldet sich später',
      'das Material liefern wir extra an',
    ]) {
      const treffer = zeitlichAusgenommeneRaeume(ersetzeZahlenWorte(basis + satz + '.'), ['Wohnzimmer', 'Küche'])
      expect([...treffer.keys()], satz).toEqual([])
    }
  })

  it('8 · „Zweiter Bauabschnitt" ALLEIN löst nichts aus — sonst fiele der erste Abschnitt', () => {
    // Gemessen: `saetzeJeRaum` gibt den Teilsatz „Zweiter Bauabschnitt
    // Obergeschoss" dem zuletzt genannten Raum — dem WOHNZIMMER. Ein
    // Auslöser auf die bloße Wendung hätte in PM-097 den bezahlten ersten
    // Abschnitt aus dem Angebot geworfen. Diese Zeile ist die Bremse dagegen.
    const t = 'Erster Bauabschnitt Erdgeschoss: Wohnzimmer vier mal fünf, Wände streichen. '
      + 'Zweiter Bauabschnitt Küche drei mal drei, Wände streichen.'
    const treffer = zeitlichAusgenommeneRaeume(ersetzeZahlenWorte(t), ['Wohnzimmer', 'Küche'])
    expect([...treffer.keys()]).toEqual([])
    expect(titel(t, [WZ(), KUECHE()]).some(x => /Wohnzimmer/.test(x))).toBe(true)
  })

  it('9 · der Hinweis wird KEINE 0,00-€-Position auf dem Kundenpapier', () => {
    // `mehrgewerk.ts` verwandelt sonst jeden `fehlende`-Eintrag in eine
    // Position mit Menge 0. Dieser Satz gehört in die Hinweisliste, nicht in
    // das Angebot.
    const raeume = [WZ(), KUECHE()]
    const text = ersetzeZahlenWorte(T_116)
    const erg = berechneUndPruefeAlleGewerke(
      { gewerk: 'maler', raeume, transkript: T_116 },
      text,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { raeume: raeume.map((r: any) => ({ name: r.name, hoehe: r.hoehe })) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { arbeitenTexte: raeume.flatMap((r: any) => r.arbeiten ?? []), belagText: null, altbelagEntfernen: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        raeume: raeume.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten })) } as never,
    )
    expect(erg.positionen.some(p => /steht nicht in diesem Angebot/.test(p.beschreibung))).toBe(false)
    expect(erg.positionen.some(p => /Küche/.test(p.beschreibung))).toBe(false)
  })

  it('10 · und er erreicht trotzdem die Hinweisliste (DC-116: Heimat `fehlende_angaben`)', () => {
    const raeume = [WZ(), KUECHE()]
    const text = ersetzeZahlenWorte(T_116)
    const erg = berechneUndPruefeAlleGewerke(
      { gewerk: 'maler', raeume, transkript: T_116 },
      text,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { raeume: raeume.map((r: any) => ({ name: r.name, hoehe: r.hoehe })) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { arbeitenTexte: raeume.flatMap((r: any) => r.arbeiten ?? []), belagText: null, altbelagEntfernen: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        raeume: raeume.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten })) } as never,
    )
    const warnungen = erg.mengenRoh.warnungen ?? []
    expect(warnungen.some(w => /Küche/.test(w) && /steht nicht in diesem Angebot/.test(w))).toBe(true)
    // Das Warnzeichen setzt `berechneBewertung` selbst — hier darf keins mehr stehen.
    expect(warnungen.some(w => w.startsWith('⚠'))).toBe(false)
  })

  it('11 · der Hinweis steht genau einmal da, auch bei zwei Gewerken', () => {
    const raeume = [
      raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen'], belag: 'laminat' }),
      raum('Küche', { laenge: 3, breite: 3, hoehe: 2.5, arbeiten: ['wände streichen'], belag: 'laminat' }),
    ]
    const t = 'Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen und Laminat verlegen. '
      + 'Zweiter Bauabschnitt Küche drei mal drei, das kommt später und wird extra angeboten.'
    const erg = berechneUndPruefeAlleGewerke(
      { gewerk: 'maler', raeume, transkript: t },
      ersetzeZahlenWorte(t),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { raeume: raeume.map((r: any) => ({ name: r.name, hoehe: r.hoehe })) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { arbeitenTexte: raeume.flatMap((r: any) => r.arbeiten ?? []), belagText: 'laminat', altbelagEntfernen: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        raeume: raeume.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten })) } as never,
    )
    const treffer = erg.fehlende.filter(f => /steht nicht in diesem Angebot/.test(f))
    expect(treffer).toHaveLength(1)
    expect(erg.positionen.some(p => /Küche/.test(p.beschreibung))).toBe(false)
  })

  it('12 · der einzige Raum ausgenommen: leeres Angebot — aber niemals stumm', () => {
    // Bewusst festgehalten, nicht repariert: Sagt der Handwerker über seinen
    // einzigen Raum „kommt später", bleibt nichts zu rechnen. Das ist die
    // richtige Lesart des Satzes; die Zusicherung hier ist, dass es NIE ohne
    // Hinweis passiert — weglassen ohne Hinweis ist der schlimmere der
    // beiden Fehler (DC-116).
    const t = 'Küche drei mal drei, Wände streichen, das kommt später und wird extra angeboten.'
    const erg = laufVoll('maler', t, [KUECHE()])
    expect(erg.positionen).toHaveLength(0)
    expect(fehlt(erg.fehlende, /Küche/)).toBe(true)
  })
})
