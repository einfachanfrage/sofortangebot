// ── DC-128 · Der DC-116-Hinweis wird sichtbar ─────────────────────────────
//
// Gemessen am 17.09.2026: Der Zeit-Ausschluss (CoS-E-074) nimmt den
// ausgenommenen Bauabschnitt korrekt aus dem Angebot — aber der Hinweis
// darauf kam auf keinem Bildschirm an. `bewertung` wurde von
// `generiere-positionen/route.ts` nicht gelesen, und
// `KalkulationsBewertungCard.tsx` hat im ganzen Produkt keine Render-Stelle.
// Damit verschwanden in PM-116 305,40 € Küche, ohne dass es jemand erfuhr —
// genau die Hälfte, die DC-116 als die schlimmere der beiden bezeichnet
// („Weglassen ohne Hinweis wäre der schlimmere Fehler von beiden").
//
// Diese Datei sichert die Kette ab, die den Satz jetzt trägt:
//   zeitAusschlussHinweis()  →  mehrgewerk (streift „⚠ ")
//   →  berechneBewertung (setzt „⚠ " wieder)
//   →  Route liest `bewertung.fehlende_angaben`, hängt die Zeile an
//      `warnungen` (die EINZIGE Hinweisliste mit Bildschirm)
//   →  Entwurfsseite zerlegt sie in Überschrift + Beleg-Zitat
//
// Die Zusicherung, auf die es ankommt, ist Nr. 4: Erzeuger und Leser müssen
// denselben Wortlaut haben. Wer oben ein Wort ändert und hier nicht, macht
// aus der zweizeiligen Karte wieder einen rohen Satz — und merkt es nicht.
//
// Product Designer · 17.09.2026
import { describe, expect, it } from 'vitest'
import { berechneBewertung } from '../mengen/bewertung'
import { berechneUndPruefeAlleGewerke } from '../mengen/mehrgewerk'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import {
  istZeitAusschlussHinweis,
  zeitAusschlussHinweis,
  zerlegeZeitAusschlussHinweis,
} from '../zeit-ausschluss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

const WZ = () => raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen'] })
const KUECHE = () => raum('Küche', { laenge: 3, breite: 3, hoehe: 2.5, arbeiten: ['wände streichen'] })

const T_116 = 'Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. '
  + 'Zweiter Bauabschnitt Küche drei mal drei, das kommt später und wird extra angeboten.'

/** Derselbe Lauf wie in `cos-e-074-zeit-ausschluss.test.ts`, bis zur Bewertung. */
function bewertungAus(transkript: string) {
  const raeume = [WZ(), KUECHE()]
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
  return berechneBewertung(
    { gewerk: 'maler', raeume, transkript } as never,
    erg.mengenRoh,
  )
}

/**
 * Was die Route tut, in drei Zeilen — bewusst hier nachgebaut statt
 * importiert: eine Next-Route lässt sich im Prüfstand nicht ohne Supabase
 * aufrufen. Ändert sich die Regel dort, muss sie hier mitgeändert werden,
 * und dann fällt genau diese Zusicherung auf.
 */
function warnungenDerRoute(bewertungFehlende: string[], massHinweise: string[]): string[] {
  const warnungen = [...massHinweise]
  for (const zeile of bewertungFehlende) {
    if (istZeitAusschlussHinweis(zeile) && !warnungen.includes(zeile)) warnungen.push(zeile)
  }
  return warnungen
}

describe('DC-128 · der weggelassene Bauabschnitt wird sichtbar', () => {
  it('1 · die Bewertung trägt die Zeile — mit Warnzeichen, genau einmal', () => {
    const b = bewertungAus(T_116)
    const zeilen = b.fehlende_angaben.filter(z => /steht nicht in diesem Angebot/.test(z))
    expect(zeilen).toHaveLength(1)
    expect(zeilen[0].startsWith('⚠')).toBe(true)
  })

  it('2 · und die Route hängt genau diese Zeile an die Warnungen', () => {
    const b = bewertungAus(T_116)
    const warnungen = warnungenDerRoute(b.fehlende_angaben, [])
    expect(warnungen.some(w => istZeitAusschlussHinweis(w))).toBe(true)
    // Nur die Hinweiszeilen, nicht die ganze Bewertung: „Fehlende Angaben"
    // hat auf diesem Banner nichts verloren, es ist kein Mängelbericht.
    expect(warnungen).toHaveLength(1)
  })

  it('3 · die Maß-Hinweise stehen weiter drin und bleiben unzerlegt', () => {
    const b = bewertungAus(T_116)
    const roh = 'Raumseite 350 als 3,50 m gelesen'
    const warnungen = warnungenDerRoute(b.fehlende_angaben, [roh])
    expect(warnungen).toContain(roh)
    expect(zerlegeZeitAusschlussHinweis(roh)).toBeNull()
  })

  it('4 · Erzeuger und Leser sind sich einig — Raumname und Beleg-Satz getrennt', () => {
    const b = bewertungAus(T_116)
    const zeile = b.fehlende_angaben.find(z => istZeitAusschlussHinweis(z))!
    const teile = zerlegeZeitAusschlussHinweis(zeile)
    expect(teile).not.toBeNull()
    expect(teile!.raum).toBe('Küche')
    expect(teile!.satz).toMatch(/extra angeboten/)
    // Kein Warnzeichen und keine Anführungszeichen mehr in den Teilen — die
    // Oberfläche setzt beides selbst (Symbol im Banner, Zitat im Text).
    expect(teile!.raum).not.toMatch(/[⚠„"]/)
  })

  it('5 · der Rundlauf über den echten Erzeuger, nicht über eine abgetippte Zeile', () => {
    const zeile = zeitAusschlussHinweis('Obergeschoss', 'das kommt später und wird getrennt abgerechnet')
    expect(zerlegeZeitAusschlussHinweis(zeile)).toEqual({
      raum: 'Obergeschoss',
      satz: 'das kommt später und wird getrennt abgerechnet',
    })
  })

  it('6 · ein Raumname mit Komma und ein Beleg-Satz mit Anführungszeichen überleben', () => {
    // Der Raumname kommt aus dem Diktat, nicht aus einer Liste. Das Muster
    // greift deshalb den KÜRZESTEN Namen und den LÄNGSTEN Satz — sonst
    // zerschneidet ein Komma im Beleg den Raumnamen.
    const zeile = zeitAusschlussHinweis('Bad, oben', 'kommt später — „zweiter Abschnitt", sagte er')
    const teile = zerlegeZeitAusschlussHinweis(zeile)
    expect(teile!.raum).toBe('Bad, oben')
    expect(teile!.satz).toBe('kommt später — „zweiter Abschnitt", sagte er')
  })

  it('7 · fremde Hinweiszeilen mit Warnzeichen werden NICHT eingesammelt', () => {
    // `bewertung.fehlende_angaben` ist voll von „⚠ …"-Zeilen (jede Warnung
    // der Mengenengine bekommt eines). Nur der Zeit-Ausschluss darf auf
    // dieses Banner — alles andere wäre ein Mängelbericht über dem Entwurf.
    for (const fremd of [
      '⚠ Küche: Keine Maße angegeben',
      '⚠ Kabelmeter nicht angegeben — Pauschale wird verwendet',
      '⚠ „Küche" steht nicht in diesem Angebot',
      'Küche steht nicht in diesem Angebot — gesagt: „kommt später"',
    ]) {
      expect(istZeitAusschlussHinweis(fremd)).toBe(false)
      expect(warnungenDerRoute([fremd], [])).toHaveLength(0)
    }
  })

  it('8 · ohne Ausschlusssatz bleibt das Banner leer', () => {
    const b = bewertungAus(
      'Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. '
      + 'Zweiter Bauabschnitt Küche drei mal drei, Wände streichen.',
    )
    expect(warnungenDerRoute(b.fehlende_angaben, [])).toHaveLength(0)
  })

  it('9 · leere und kaputte Eingaben ergeben null, nicht halbe Teile', () => {
    for (const murks of ['', '   ', '⚠', '⚠ „" steht nicht in diesem Angebot — gesagt: „x"',
      '⚠ „Küche" steht nicht in diesem Angebot — gesagt: „"']) {
      expect(zerlegeZeitAusschlussHinweis(murks)).toBeNull()
    }
  })
})
