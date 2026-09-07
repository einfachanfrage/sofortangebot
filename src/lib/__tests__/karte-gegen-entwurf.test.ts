import { describe, it, expect } from 'vitest'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { berechneUndPruefeAlleGewerke } from '../mengen/mehrgewerk'
import { ergaenzeChipsUmAutomatischeNebenpositionen } from '../chips-vervollstaendigung'

// ── Sammelbefund „Karte ≠ Entwurf" (Prüfmeister, 05.09.2026) ──────────────
//
// Fünf Belege in zwei Tagen. Vier davon sind ADDITIONEN — Positionen, die erst
// in der Vollständigkeitsprüfung entstehen (Dehnungsfuge, Trittschall,
// Sockelleisten streichen). Die Karte kann sie gar nicht kennen: Ihr fehlen
// die Raummaße, die erst die volle Extraktion liefert. Das ist strukturell
// und harmlos, und die Anzeige sagt es seit dem 07.09. ehrlich.
//
// PM-030 war die EINZIGE Subtraktion — und die war kein Strukturunterschied,
// sondern ein Logikfehler: „Sockelleisten abkleben" hing im
// Dachgeschoss-Zweig an `wandflaecheNettoM2 !== null`, einer Größe des
// Normal-Zweigs. Im Dachgeschoss ist die null, also fiel die Position aus.
// Nichts hat sie zusammengelegt, nichts hat sie ersetzt — sie war weg, 13,60 €
// ohne Spur.
//
// Sandys Frage vom 07.09. trifft genau den Punkt: Eine ehrliche Formulierung
// darf einen echten Verlust nicht freundlich umetikettieren. Deshalb steht
// hier ein Wächter statt eines Satzes — für PM-030 müssen Karte und Entwurf
// dieselben Positionen zeigen. Fällt die Position je wieder aus, schlägt
// dieser Test an und nicht der Prüfmeister.

const PM030 = 'Dachzimmer, vier Meter fünfzig mal vier Meter. Kniestock ist eins Meter hoch. '
  + 'Die Dachschrägen zusammen ergeben achtzehn Quadratmeter. Ein Dachfenster drin, normale Größe. '
  + 'Wände, Schrägen und Kniestock alles zweimal streichen.'

const RAUM_PM030 = {
  name: 'Dachzimmer', laenge: 4.5, breite: 4,
  kniestockhoehe: 1, dachschraege_flaeche_m2: 18,
  dachfenster: [{ anzahl: 1, annahme: true }], tueren: [], fenster: [],
  arbeiten: ['wände streichen', 'dachschrägen streichen', 'kniestock streichen'],
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function entwurf(text: string, raum: any) {
  const p = verarbeiteExtraktion(text, { result: { gewerk: 'maler', raeume: [raum], transkript: text } as any })
  return berechneUndPruefeAlleGewerke(
    p.extraktion as any,
    text,
    { raeume: [{ name: raum.name, hoehe: raum.hoehe ?? null }] } as any,
    { arbeitenTexte: raum.arbeiten ?? [], raeume: [{ name: raum.name, arbeiten: raum.arbeiten }] } as any,
  ).positionen
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Titel ohne „— Raum"-Suffix, damit Karte (raumlos) und Entwurf vergleichbar sind. */
const ohneRaum = (t: string) => t.replace(/\s+[—–]\s+.+$/, '').trim()

describe('PM-030 — die Position verschwindet nicht mehr zwischen Karte und Entwurf', () => {
  const karteChips = [
    { titel: 'Kniestockwände streichen 2x', menge: 17, einheit: 'm²' },
    { titel: 'Dachschrägen streichen 2x', menge: 18, einheit: 'm²' },
    { titel: 'Boden schützen', menge: 18, einheit: 'm²' },
    { titel: 'Sockelleisten abkleben', menge: 17, einheit: 'lfdm' },
  ]

  it('der Entwurf enthält alle vier Positionen mit den Soll-Mengen', () => {
    const p = entwurf(PM030, RAUM_PM030).map(x => `${ohneRaum(x.beschreibung)} ${x.menge}`)
    expect(p).toContain('Kniestockwände streichen 2x 17')
    expect(p).toContain('Dachschrägen streichen 2x 18')
    expect(p).toContain('Boden schützen 18')
    expect(p).toContain('Sockelleisten abkleben 17')
  })

  it('Karte und Entwurf zeigen dieselben Positionen — keine fällt weg', () => {
    const ausKarte = (ergaenzeChipsUmAutomatischeNebenpositionen(karteChips, PM030) as { titel: string }[])
      .map(x => ohneRaum(x.titel)).sort()
    const ausEntwurf = entwurf(PM030, RAUM_PM030).map(x => ohneRaum(x.beschreibung)).sort()
    expect(ausEntwurf).toEqual(ausKarte)
  })

  // Der eigentliche Regressionswächter: Die Bedingung darf nie wieder an einer
  // Größe des Normal-Zweigs hängen. Ein Dachgeschossraum hat keine.
  it('die Sockelleiste hängt nicht an der gewöhnlichen Wandfläche', () => {
    const nurSchraegen = { ...RAUM_PM030, arbeiten: ['dachschrägen streichen', 'kniestock streichen'] }
    const p = entwurf(PM030, nurSchraegen).map(x => ohneRaum(x.beschreibung))
    expect(p).toContain('Sockelleisten abkleben')
  })
})

// Die Gegenrichtung, damit der Wächter nicht das Falsche festhält: Der Entwurf
// DARF mehr enthalten als die Karte — das ist der harmlose Normalfall, den die
// neue Formulierung beschreibt. Er darf nur nichts spurlos verlieren.
describe('Additionen zwischen Karte und Entwurf bleiben erlaubt', () => {
  it('PM-013: die Dehnungsfuge entsteht erst im Entwurf und ist kein Fehler', () => {
    const text = 'Wohnzimmer, acht mal vier fünfzig, Eichenparkett, Fischgrät verlegt. '
      + 'Da muss wahrscheinlich eine Dehnungsfuge rein, macht das bitte mit rein.'
    const p = entwurf(text, {
      name: 'Wohnzimmer', laenge: 8, breite: 4.5, belag: 'parkett', verlegerichtung: 'fischgrät',
      tueren: [], fenster: [], arbeiten: ['eichenparkett verlegen'],
    }).map(x => ohneRaum(x.beschreibung))
    expect(p.some(x => /fertigparkett verlegen/i.test(x))).toBe(true)
    expect(p.some(x => /aufpreis fischgr/i.test(x))).toBe(true)
  })
})
