// ── DC-142 · Der Wortlaut der Rückfrage und ihr Platz im Banner (PM-136) ───
//
// Engineering hat am 21.09.2026 (Commit `6778b6a`) eine zweite Sorte Zeile ins
// Bernsteinbanner gebracht und zwei Dinge ausdrücklich offengelassen:
//
//   1. den WORTLAUT in `bauteilUnklarHinweis()`,
//   2. die ANZEIGE-ENTSCHEIDUNG, ob eine offene Rückfrage so schwer wiegt wie
//      ein fertiger Wegfall (Engineering hatte beide gleich eingeordnet).
//
// Beides ist in DC-142 entschieden. Diese Datei ist die Zusicherung dazu — sie
// wird im Kopfkommentar von `hinweis-rang.ts` namentlich genannt, und ein
// Kommentar, der auf eine Datei zeigt, die es nicht gibt, ist schlimmer als
// gar keiner (CoS, 23.09.2026).
//
// Was hier zugesichert wird, und warum es ohne Test nicht hält:
//
//   Nr. 1–3 · Der Wortlaut spiegelt die Nachbarzeile. „bleiben im Angebot" ↔
//     „sind nicht im Angebot": gleicher Satzbau, der Unterschied steckt im
//     Verb. Ändert jemand nur eine der beiden Zeilen, verschwindet genau
//     dieser Unterschied — und der Betrieb muss ihn auf einen Blick sehen.
//   Nr. 4–5 · Erzeuger und Leser müssen denselben Wortlaut haben (die
//     DC-125-Lehre). Die Zeile reist als EIN Stück Text bis auf den Schirm;
//     passt das Lesemuster nicht mehr, fällt sie stumm in den Rohtext-Zweig.
//   Nr. 6 · Die zwei Sorten dürfen einander nicht erkennen. Sonst zeigt das
//     Banner die Rückfrage als Wegfall — also das Gegenteil der Wahrheit.
//   Nr. 7–9 · Die Rangfolge. Sie ist eine Anzeige-Entscheidung und war bis
//     DC-142 eine lokale Funktion in der Seite, also nicht messbar.
//   Nr. 10 · Der Weg von der Bremse bis zur fertigen Zeile — damit der
//     Wortlaut nicht nur für sich stimmt, sondern auch dort ankommt.
//
// Ausdrücklich NICHT Gegenstand dieser Datei: ob die Bremse in PM-136 richtig
// entscheidet, nichts wegzunehmen. Das ist gemessen und gehört Engineering;
// hier geht es nur darum, was der Betrieb davon zu sehen bekommt.
//
// Product Designer · 23.09.2026
import { describe, expect, it } from 'vitest'
import {
  bauteilAusschlussHinweis,
  bauteilUnklarHinweis,
  entferneAusgeschlosseneBauteileMitHinweisen,
  istBauteilAusschlussHinweis,
  istBauteilUnklarHinweis,
  zerlegeBauteilUnklarHinweis,
} from '../bauteil-ausschluss'
import { zeitAusschlussHinweis } from '../zeit-ausschluss'
import { hinweisRang, sortiereHinweise } from '../hinweis-rang'

const SATZ = 'An den Wänden machen wir nichts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pos = (beschreibung: string): any => ({ beschreibung })

describe('DC-142 · der Wortlaut der Rückfrage (PM-136)', () => {
  it('1 · sagt zuerst, was mit dem Angebot ist — und erst danach, was zu tun ist', () => {
    const zeile = bauteilUnklarHinweis(['wand'], SATZ)
    expect(zeile).toBe(
      '⚠ Arbeiten an den Wänden bleiben im Angebot. '
      + `Zu welchem Raum galt das? — gesagt: „${SATZ}"`,
    )

    // Die Folge steht vor der Frage: bis zum Fragezeichen weiß der Betrieb
    // schon, dass nichts fehlt. Umgekehrt herum liest er erst eine Aufgabe
    // und muss weiterlesen, um zu erfahren, ob sein Blatt stimmt.
    expect(zeile.indexOf('bleiben im Angebot')).toBeLessThan(zeile.indexOf('Zu welchem Raum'))
  })

  it('2 · spiegelt die Nachbarzeile — derselbe Satzbau, das Gegenteil im Verb', () => {
    const offen = bauteilUnklarHinweis(['wand'], SATZ)
    const weg = bauteilAusschlussHinweis('Flur', ['wand'], SATZ)

    expect(offen).toContain('Arbeiten an den Wänden bleiben im Angebot')
    expect(weg).toContain('Arbeiten an den Wänden sind nicht im Angebot')

    // Gleicher Auftakt, gleicher Beleg-Anhang, gleiche Aufzählung.
    for (const zeile of [offen, weg]) {
      expect(zeile.startsWith('⚠ ')).toBe(true)
      expect(zeile).toContain(`gesagt: „${SATZ}"`)
    }

    // „entfernt" beschreibt, was der Code getan hat — der Betrieb fragt
    // danach, ob die Arbeit auf dem Blatt steht.
    expect(offen).not.toContain('entfernt')
  })

  it('3 · die Rückfrage nennt keinen Raum — genau das ist ihr Inhalt', () => {
    const zeile = bauteilUnklarHinweis(['wand', 'decke'], SATZ)
    expect(zeile).toContain('Arbeiten an den Wänden und an der Decke bleiben im Angebot')
    // Die Nachbarzeile trägt den Raum vorn („Flur": …). Diese hier darf es
    // nicht, sonst behauptet sie die Zuordnung, nach der sie gerade fragt.
    expect(zeile).not.toMatch(/^⚠\s*„/)
  })

  it('4 · Erzeuger und Leser haben denselben Wortlaut', () => {
    const zerlegt = zerlegeBauteilUnklarHinweis(bauteilUnklarHinweis(['wand'], SATZ))
    expect(zerlegt).not.toBeNull()
    expect(zerlegt!.arbeiten).toBe('an den Wänden')
    expect(zerlegt!.satz).toBe(SATZ)
  })

  it('5 · leere und kaputte Eingaben ergeben null, nicht halbe Teile', () => {
    for (const murks of [
      '', '   ', '⚠',
      '⚠ Arbeiten  bleiben im Angebot. Zu welchem Raum galt das? — gesagt: „x"',
      '⚠ Arbeiten an den Wänden bleiben im Angebot. Zu welchem Raum galt das? — gesagt: „"',
      '⚠ Arbeiten an den Wänden sind nicht im Angebot — gesagt: „x"',
    ]) {
      expect(zerlegeBauteilUnklarHinweis(murks)).toBeNull()
    }
  })

  it('6 · die zwei Sorten erkennen einander nicht', () => {
    const offen = bauteilUnklarHinweis(['wand'], SATZ)
    const weg = bauteilAusschlussHinweis('Flur', ['wand'], SATZ)

    expect(istBauteilUnklarHinweis(offen)).toBe(true)
    expect(istBauteilAusschlussHinweis(offen)).toBe(false)

    expect(istBauteilAusschlussHinweis(weg)).toBe(true)
    expect(istBauteilUnklarHinweis(weg)).toBe(false)
  })
})

describe('DC-142 · die Rangfolge im Bernsteinbanner', () => {
  const offen = bauteilUnklarHinweis(['wand'], SATZ)
  const raumWeg = zeitAusschlussHinweis('Bad', 'Das Bad machen wir später')
  const bauteilWeg = bauteilAusschlussHinweis('Flur', ['wand'], SATZ)
  const mass = 'Deckenhöhe auf 2,50 m korrigiert'

  it('7 · offen steht über abgeschlossen — die Rückfrage ganz oben', () => {
    expect(hinweisRang(offen)).toBe(3)
    expect(hinweisRang(raumWeg)).toBe(2)
    expect(hinweisRang(bauteilWeg)).toBe(1)
    expect(hinweisRang(mass)).toBe(0)
  })

  it('8 · sortiert wird nach Folge, nicht nach Reihenfolge im Diktat', () => {
    const sortiert = sortiereHinweise([mass, bauteilWeg, raumWeg, offen])
    expect(sortiert).toEqual([offen, raumWeg, bauteilWeg, mass])
  })

  it('9 · gleicher Rang behält die Reihenfolge, in der die Zeilen entstanden sind', () => {
    const a = bauteilUnklarHinweis(['wand'], 'An den Wänden machen wir nichts')
    const b = bauteilUnklarHinweis(['decke'], 'An der Decke machen wir nichts')
    expect(sortiereHinweise([a, b])).toEqual([a, b])
    expect(sortiereHinweise([b, a])).toEqual([b, a])

    // Und die Vorlage wird nicht angefasst — die Seite sortiert bei jedem
    // Zeichnen neu, ohne den Zustand darunter zu verschieben.
    const vorlage = [mass, offen]
    sortiereHinweise(vorlage)
    expect(vorlage).toEqual([mass, offen])
  })
})

describe('DC-142 · der Wortlaut kommt auch dort an, wo er entsteht', () => {
  it('10 · zwei Räume mit Wandarbeit, ein Satz ohne Raum: nichts fällt weg, die Frage steht da', () => {
    const transkript =
      'Flur, Wände streichen. Wohnzimmer, Wände streichen. An den Wänden machen wir nichts.'
    const { positionen, hinweise } = entferneAusgeschlosseneBauteileMitHinweisen(
      [pos('Wände streichen — Flur'), pos('Wände streichen — Wohnzimmer')],
      transkript,
      ['Flur', 'Wohnzimmer'],
    )

    // Die Bremse rät nicht: beide Zeilen stehen noch auf dem Blatt.
    expect(positionen).toHaveLength(2)

    const rueckfragen = hinweise.filter(istBauteilUnklarHinweis)
    expect(rueckfragen).toHaveLength(1)
    expect(rueckfragen[0]).toContain('Arbeiten an den Wänden bleiben im Angebot')
    expect(zerlegeBauteilUnklarHinweis(rueckfragen[0])!.satz)
      .toBe('An den Wänden machen wir nichts')

    // Kein Wegfall gemeldet — es ist ja keiner passiert.
    expect(hinweise.filter(istBauteilAusschlussHinweis)).toHaveLength(0)
  })

  it('11 · zu einem Bauteil, das auf keinem Blatt steht, wird nicht gefragt', () => {
    const transkript =
      'Flur, Boden verlegen. Wohnzimmer, Boden verlegen. An den Wänden machen wir nichts.'
    const { hinweise } = entferneAusgeschlosseneBauteileMitHinweisen(
      [pos('Bodenbelag verlegen — Flur'), pos('Bodenbelag verlegen — Wohnzimmer')],
      transkript,
      ['Flur', 'Wohnzimmer'],
    )
    expect(hinweise.filter(istBauteilUnklarHinweis)).toHaveLength(0)
  })
})
