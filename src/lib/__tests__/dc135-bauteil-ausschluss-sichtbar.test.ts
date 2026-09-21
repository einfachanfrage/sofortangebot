// ── DC-135 · Die stumme Bremse bekommt eine Stimme (PD-024) ────────────────
//
// Gemessen vom Prüfmeister (PM-134, 21.09.2026):
//
//   „Flur, 6 mal 1,50, 2,50 hoch. An den Wänden machen wir nichts.
//    Wände und Decke zweimal weiß."
//
// Die Wand (37,50 m², 356,25 €) fällt aus dem Angebot — und das Blatt sagt
// mit keinem Zeichen, dass dort einmal etwas stand. Der Beleg-Satz wird in
// `bauteil-ausschluss.ts` gebildet und fallen gelassen; außerhalb der Datei
// liest ihn niemand.
//
// Diese Datei sichert die Kette ab, die den Satz jetzt trägt — dieselbe, die
// DC-128 für den zeitlichen Ausschluss gebaut hat:
//   bauteilAusschlussHinweis()  →  vollstaendigkeit (`fehlende`)
//   →  mehrgewerk (streift „⚠ ")  →  berechneBewertung (setzt „⚠ " wieder)
//   →  Route hängt die Zeile an `warnungen`
//   →  Entwurfsseite zerlegt sie in Aussage + Beleg-Zitat
//
// Die zwei Zusicherungen, auf die es ankommt:
//   Nr. 4 — Erzeuger und Leser müssen denselben Wortlaut haben.
//   Nr. 8 — ein Ausschluss, der NICHTS gekostet hat, schweigt. Lärm im
//           Bernsteinbanner macht die echten Hinweise unsichtbar.
//
// Ausdrücklich NICHT Gegenstand dieser Datei: ob der Ausschluss in PM-134
// überhaupt greifen darf (die Selbstkorrektur „erst nichts, dann doch").
// Das ist PM-134-A und liegt bei Engineering. Hier wird nur sichtbar, was
// die Bremse tut — richtig oder falsch.
//
// Product Designer · 21.09.2026
import { describe, expect, it } from 'vitest'
import { berechneBewertung } from '../mengen/bewertung'
import { berechneUndPruefeAlleGewerke } from '../mengen/mehrgewerk'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import {
  bauteilAusschlussHinweis,
  entferneAusgeschlosseneBauteileMitHinweisen,
  istBauteilAusschlussHinweis,
  zerlegeBauteilAusschlussHinweis,
} from '../bauteil-ausschluss'
import { istZeitAusschlussHinweis, zeitAusschlussHinweis } from '../zeit-ausschluss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

const FLUR = () => raum('Flur', {
  laenge: 6, breite: 1.5, hoehe: 2.5,
  arbeiten: ['wände streichen', 'decke streichen'], sockelleisten: true,
})

/** PM-134, wörtlich. */
const T_134 = 'Flur, 6 mal 1,50, 2,50 hoch. An den Wänden machen wir nichts. '
  + 'Wände und Decke zweimal weiß.'

/** Derselbe Auftrag ohne Ausschlusssatz — die Gegenprobe. */
const T_OHNE = 'Flur, 6 mal 1,50, 2,50 hoch. Wände und Decke zweimal weiß.'

/** Derselbe Lauf wie in `dc128-zeit-ausschluss-sichtbar.test.ts`. */
function bewertungAus(transkript: string) {
  const raeume = [FLUR()]
  const text = ersetzeZahlenWorte(transkript)
  const erg = berechneUndPruefeAlleGewerke(
    { gewerk: 'maler', raeume, transkript },
    text,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { raeume: raeume.map((r: any) => ({ name: r.name, hoehe: r.hoehe })) },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arbeitenTexte: raeume.flatMap((r: any) => r.arbeiten ?? []),
      belagText: null,
      altbelagEntfernen: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      raeume: raeume.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten })),
    } as never,
  )
  return { bewertung: berechneBewertung({ gewerk: 'maler', raeume, transkript } as never, erg.mengenRoh), erg }
}

/**
 * Was die Route tut, in vier Zeilen — bewusst hier nachgebaut statt
 * importiert: eine Next-Route lässt sich im Prüfstand nicht ohne Supabase
 * aufrufen. Ändert sich die Regel dort, muss sie hier mitgeändert werden,
 * und dann fällt genau diese Zusicherung auf.
 */
function warnungenDerRoute(bewertungFehlende: string[], massHinweise: string[]): string[] {
  const warnungen = [...massHinweise]
  for (const zeile of bewertungFehlende) {
    const istHinweis = istZeitAusschlussHinweis(zeile) || istBauteilAusschlussHinweis(zeile)
    if (istHinweis && !warnungen.includes(zeile)) warnungen.push(zeile)
  }
  return warnungen
}

const pos = (beschreibung: string) => ({ beschreibung })

describe('DC-135 · der abbestellte Bauteil-Wegfall wird sichtbar', () => {
  it('1 · die Bewertung trägt die Zeile — mit Warnzeichen, genau einmal', () => {
    const { bewertung } = bewertungAus(T_134)
    const zeilen = bewertung.fehlende_angaben.filter(z => istBauteilAusschlussHinweis(z))
    expect(zeilen).toHaveLength(1)
    expect(zeilen[0].startsWith('⚠')).toBe(true)
    expect(zeilen[0]).toMatch(/an den Wänden/)
  })

  it('2 · und die Route hängt genau diese Zeile an die Warnungen', () => {
    const { bewertung } = bewertungAus(T_134)
    const warnungen = warnungenDerRoute(bewertung.fehlende_angaben, [])
    expect(warnungen.some(w => istBauteilAusschlussHinweis(w))).toBe(true)
    // Nur die Hinweiszeile, nicht die ganze Bewertung: „Fehlende Angaben"
    // hat auf diesem Banner nichts verloren, es ist kein Mängelbericht.
    expect(warnungen).toHaveLength(1)
  })

  it('3 · die Wand ist wirklich weg — der Hinweis erklärt einen echten Wegfall', () => {
    const { erg } = bewertungAus(T_134)
    const titel = erg.positionen.map(p => p.beschreibung.toLowerCase())
    expect(titel.some(t => /w[äa]nd/.test(t) && !/⚠/.test(t))).toBe(false)
    expect(titel.some(t => /decke/.test(t))).toBe(true)
  })

  it('4 · Erzeuger und Leser sind sich einig — Ort, Arbeiten und Beleg getrennt', () => {
    const { bewertung } = bewertungAus(T_134)
    const zeile = bewertung.fehlende_angaben.find(z => istBauteilAusschlussHinweis(z))!
    const teile = zerlegeBauteilAusschlussHinweis(zeile)
    expect(teile).not.toBeNull()
    expect(teile!.raum).toBe('Flur')
    expect(teile!.arbeiten).toBe('an den Wänden')
    expect(teile!.satz).toMatch(/machen wir nichts/)
    // Kein Warnzeichen und keine Anführungszeichen mehr in den Teilen — die
    // Oberfläche setzt beides selbst (Symbol im Banner, Zitat im Text).
    expect(teile!.raum).not.toMatch(/[⚠„"]/)
    expect(teile!.arbeiten).not.toMatch(/[⚠„"]/)
  })

  it('5 · der Rundlauf über den echten Erzeuger, nicht über eine abgetippte Zeile', () => {
    const zeile = bauteilAusschlussHinweis('Bad', ['decke', 'wand'], 'an Wand und Decke nichts')
    // Feste Reihenfolge: Wand vor Decke, egal wie sie hereinkommen.
    expect(zeile).toMatch(/Arbeiten an den Wänden und an der Decke sind nicht im Angebot/)
    expect(zerlegeBauteilAusschlussHinweis(zeile)).toEqual({
      raum: 'Bad',
      arbeiten: 'an den Wänden und an der Decke',
      satz: 'an Wand und Decke nichts',
    })
  })

  it('6 · ein Raumname mit Komma und ein Beleg mit Anführungszeichen überleben', () => {
    const zeile = bauteilAusschlussHinweis('Bad, oben', ['boden'], 'am Boden nichts — „gar nichts", sagte er')
    const teile = zerlegeBauteilAusschlussHinweis(zeile)
    expect(teile!.raum).toBe('Bad, oben')
    expect(teile!.arbeiten).toBe('am Boden')
    expect(teile!.satz).toBe('am Boden nichts — „gar nichts", sagte er')
  })

  it('7 · ein Satz ohne Raum steht ohne Ort da, und wird nicht zu einem leeren Namen', () => {
    const zeile = bauteilAusschlussHinweis(null, ['wand'], 'überall an den Wänden nichts')
    expect(zeile.startsWith('⚠ Arbeiten an den Wänden')).toBe(true)
    expect(zerlegeBauteilAusschlussHinweis(zeile)!.raum).toBeNull()
  })

  it('8 · ein Ausschluss, der nichts gekostet hat, schweigt', () => {
    // Der Satz greift, aber im Angebot steht gar keine Wandzeile. Ein Hinweis
    // darüber wäre kein Hinweis, sondern Lärm — und Lärm im Banner macht die
    // echten Hinweise unsichtbar.
    const nurDecke = entferneAusgeschlosseneBauteileMitHinweisen(
      [pos('Decke streichen 2x — Flur')], T_134, ['Flur'],
    )
    expect(nurDecke.positionen).toHaveLength(1)
    expect(nurDecke.hinweise).toHaveLength(0)

    // Dieselbe Eingabe MIT Wandzeile: jetzt hat der Satz etwas gekostet.
    const mitWand = entferneAusgeschlosseneBauteileMitHinweisen(
      [pos('Wände streichen 2x — Flur'), pos('Decke streichen 2x — Flur')], T_134, ['Flur'],
    )
    expect(mitWand.positionen).toHaveLength(1)
    expect(mitWand.hinweise).toHaveLength(1)
    expect(mitWand.hinweise[0]).toMatch(/„Flur": Arbeiten an den Wänden/)
  })

  it('9 · ohne Ausschlusssatz bleibt das Banner leer', () => {
    const { bewertung } = bewertungAus(T_OHNE)
    expect(warnungenDerRoute(bewertung.fehlende_angaben, [])).toHaveLength(0)
  })

  it('10 · fremde Hinweiszeilen mit Warnzeichen werden NICHT eingesammelt', () => {
    for (const fremd of [
      '⚠ Flur: Keine Maße angegeben',
      '⚠ Kabelmeter nicht angegeben — Pauschale wird verwendet',
      '⚠ Arbeiten an den Wänden sind nicht im Angebot',
      'Arbeiten an den Wänden sind nicht im Angebot — gesagt: „nichts"',
      '⚠ „Flur": Arbeiten sind nicht im Angebot — gesagt: „nichts"',
    ]) {
      expect(istBauteilAusschlussHinweis(fremd)).toBe(false)
      expect(warnungenDerRoute([fremd], [])).toHaveLength(0)
    }
  })

  it('11 · die zwei Bremsen verwechseln ihre Zeilen nicht', () => {
    const zeit = zeitAusschlussHinweis('Küche', 'kommt später')
    const bauteil = bauteilAusschlussHinweis('Küche', ['wand'], 'an den Wänden nichts')
    expect(istBauteilAusschlussHinweis(zeit)).toBe(false)
    expect(istZeitAusschlussHinweis(bauteil)).toBe(false)
    expect(zerlegeBauteilAusschlussHinweis(zeit)).toBeNull()
  })

  it('12 · die Hinweiszeile wird nie zu einer 0,00-€-Position', () => {
    // `mehrgewerk.ts` verwandelt jeden `fehlende`-Eintrag ohne „⚠ " in eine
    // Platzhalter-Position. Genau dieser Satz hätte auf dem Kundenpapier
    // nichts verloren — dort steht nur, was angeboten wird.
    const { erg } = bewertungAus(T_134)
    expect(erg.positionen.some(p => /nicht im Angebot/.test(p.beschreibung))).toBe(false)
    expect(erg.positionen.some(p => p.beschreibung.startsWith('⚠'))).toBe(false)
  })

  it('13 · leere und kaputte Eingaben ergeben null, nicht halbe Teile', () => {
    for (const murks of [
      '', '   ', '⚠',
      '⚠ „": Arbeiten an den Wänden sind nicht im Angebot — gesagt: „x"',
      '⚠ „Flur": Arbeiten an den Wänden sind nicht im Angebot — gesagt: „"',
      '⚠ „Flur": Arbeiten  sind nicht im Angebot — gesagt: „x"',
    ]) {
      expect(zerlegeBauteilAusschlussHinweis(murks)).toBeNull()
    }
  })
})
