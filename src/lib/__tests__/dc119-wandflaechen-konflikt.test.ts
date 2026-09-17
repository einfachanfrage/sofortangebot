/**
 * ── DC-119 · PD-018 Punkt 1 (PM-095) ──────────────────────────────────────
 *
 * „Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. Das
 * Wohnzimmer hat dreißig Quadratmeter Wandfläche."
 *
 * Aus den Maßen sind das 45 m², gesagt werden 30 m². Bis heute gewann die
 * spätere Zahl wortlos — 15 m² × 9,50 € = 142,50 €, ohne dass der Betrieb je
 * erfährt, dass es zwei Zahlen gab.
 *
 * Was hier festgenagelt wird, in dieser Reihenfolge:
 *   1. die Erkennung samt ihrer Schwelle (und was KEIN Widerspruch ist),
 *   2. dass eine Rückfrage entsteht, die beide Zahlen schon mitbringt,
 *   3. dass die Antwort in die richtige Rechenart mündet,
 *   4. dass der Rechenweg der Position beide Zahlen nennt, wenn niemand
 *      antwortet — die harte Grenze des Prüfmeisters: nie wortlos.
 *
 * Die Menge selbst ändert sich NICHT (PM-095-D bleibt 30 m²). Dass die
 * spätere Zahl gewinnt, war nie der Fund.
 */
import { describe, expect, it } from 'vitest'
import {
  findeWandflaechenKonflikt,
  wandflaecheAusGeometrie,
  KONFLIKT_M2,
  KONFLIKT_ANTEIL,
} from '../mengen/wandflaechen-konflikt'
import { analysiereKontext } from '../kontext-analyzer'
import { normalisiereExtraktion } from '../mengen/extraktion-normalisierer'
import { verarbeiteAntworten } from '../mengen/antworten-verarbeiter'
import { berechneMengen } from '../mengen/engine'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (extra: any = {}): any => ({
  name: 'Wohnzimmer', laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

/** Der gemessene Fall aus PM-095. */
const PM095 = () => raum({ laenge: 4, breite: 5, hoehe: 2.5, wandflaeche_direkt: 30 })
const T_WIDER =
  'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. '
  + 'Das Wohnzimmer hat dreißig Quadratmeter Wandfläche.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function angereichert(transkript: string, raeume: any[]) {
  const roh = {
    gewerk: 'maler', confidence_gewerk: 0.95, kunde: { name: null, adresse: null, ort: null },
    raeume, waende: [], decken: [], bereiche: [], altbelag: [], erschwernisse: [],
    anmerkungen: null, fehlende_angaben: [], transkript,
  }
  return analysiereKontext(normalisiereExtraktion(JSON.parse(JSON.stringify(roh)))).extraktion_angereichert
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fragen(transkript: string, raeume: any[]): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((angereichert(transkript, raeume) as any).rueckfragen ?? [])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wandPosition(raeume: any[], transkript = T_WIDER) {
  const ext = {
    gewerk: 'maler', raeume, waende: [], decken: [], bereiche: [], altbelag: [],
    erschwernisse: [], transkript,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
  return berechneMengen('maler', ext).positionen.find(p => /^Wand streichen/.test(p.beschreibung))
}

// ───────────────────────────────────────────────────────────────────────────
// 1. Die Erkennung
// ───────────────────────────────────────────────────────────────────────────
describe('DC-119 · Erkennung — wann sind zwei Zahlen ein Widerspruch', () => {
  it('rechnet die Wandfläche aus den Maßen wortgleich zur Engine (Umfang × Höhe)', () => {
    expect(wandflaecheAusGeometrie({ laenge: 4, breite: 5, hoehe: 2.5 })).toBe(45)
  })

  it('PM-095: 45 m² aus den Maßen gegen 30 m² gesagt → Widerspruch, beide Zahlen bekannt', () => {
    const k = findeWandflaechenKonflikt(PM095())
    expect(k).not.toBeNull()
    expect(k!.geometrie).toBe(45)
    expect(k!.gesagt).toBe(30)
    expect(k!.umfang).toBe(18)
  })

  it('gilt in beide Richtungen — auch wenn die gesagte Zahl größer ist', () => {
    expect(findeWandflaechenKonflikt(raum({ laenge: 4, breite: 5, hoehe: 2.5, wandflaeche_direkt: 60 }))).not.toBeNull()
  })

  it('KEIN Widerspruch: der Betrieb hat seine Öffnungen selbst abgezogen (45 → 41)', () => {
    // 4 m² Unterschied — genau die Größenordnung einer Tür plus eines
    // Fensters. Hier zu fragen hieße, jeden sauber rechnenden Betrieb zu
    // behelligen.
    expect(findeWandflaechenKonflikt(raum({ laenge: 4, breite: 5, hoehe: 2.5, wandflaeche_direkt: 41 }))).toBeNull()
  })

  it('KEIN Widerspruch: prozentual groß, in Quadratmetern winzig', () => {
    // 2 × (1+1) × 2,5 = 10 m² gegen 6 m²: 40 %, aber nur 4 m².
    expect(findeWandflaechenKonflikt(raum({ laenge: 1, breite: 1, hoehe: 2.5, wandflaeche_direkt: 6 }))).toBeNull()
  })

  it('KEIN Widerspruch: in Quadratmetern groß, prozentual im Rauschen', () => {
    // 2 × (20+20) × 2,5 = 200 m² gegen 194 m²: 6 m², aber nur 3 %.
    expect(findeWandflaechenKonflikt(raum({ laenge: 20, breite: 20, hoehe: 2.5, wandflaeche_direkt: 194 }))).toBeNull()
  })

  it('beide Schwellen sind die dokumentierten', () => {
    expect(KONFLIKT_M2).toBe(5)
    expect(KONFLIKT_ANTEIL).toBe(0.1)
  })

  it('ohne vollständige Maße gibt es nichts zu vergleichen', () => {
    expect(findeWandflaechenKonflikt(raum({ laenge: 4, breite: 5, wandflaeche_direkt: 30 }))).toBeNull()
    expect(findeWandflaechenKonflikt(raum({ flaeche: 20, hoehe: 2.5, wandflaeche_direkt: 30 }))).toBeNull()
  })

  it('ohne genannte Wandfläche gibt es keinen Widerspruch', () => {
    expect(findeWandflaechenKonflikt(raum({ laenge: 4, breite: 5, hoehe: 2.5 }))).toBeNull()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// 2. Die Rückfrage
// ───────────────────────────────────────────────────────────────────────────
describe('DC-119 · die Rückfrage bringt beide Zahlen schon mit', () => {
  it('stellt die Frage und bietet genau zwei fertige Zahlen an', () => {
    const frage = fragen(T_WIDER, [PM095()]).find(f => /^wandflaeche_konflikt_/.test(f.id))
    expect(frage).toBeDefined()
    expect(frage.frage).toContain('Zwei Angaben zur Wandfläche')
    expect(frage.typ).toBe('flaeche')
    expect(frage.schnell_antworten.map((s: { wert: number }) => s.wert)).toEqual([45, 30])
    // Der Beleg steht in der Beschriftung — niemand soll nachrechnen müssen.
    expect(frage.schnell_antworten[0].label).toBe('45 m² — aus 4 × 5 m bei 2,5 m Höhe')
    expect(frage.schnell_antworten[1].label).toBe('30 m² — so gesagt')
  })

  it('sagt beim Überspringen, was dann gilt — mit der Zahl, nicht abstrakt', () => {
    const frage = fragen(T_WIDER, [PM095()]).find(f => /^wandflaeche_konflikt_/.test(f.id))
    expect(frage.konsequenz).toContain('30 m²')
  })

  it('unterdrückt die Anschlussfrage nach Türen/Fenstern, solange die Zahl offen ist', () => {
    // DC-040 fragt sonst „sind die 30 m² inklusive Türen und Fenster?" —
    // eine Frage zu einer Zahl, die sich im selben Atemzug noch ändern kann.
    const gestellt = fragen(T_WIDER, [PM095()]).map(f => f.frage)
    expect(gestellt.some(f => /inklusive Türen und Fenster/.test(f))).toBe(false)
  })

  it('Kontrolle: ohne Widerspruch bleibt die DC-040-Frage unverändert stehen', () => {
    const gestellt = fragen('Im Flur sind es 18 m² Wandfläche, zweimal streichen.', [raum({
      name: 'Flur', wandflaeche_direkt: 18,
    })]).map(f => f.frage)
    expect(gestellt.some(f => /inklusive Türen und Fenster/.test(f))).toBe(true)
    expect(gestellt.some(f => /Zwei Angaben zur Wandfläche/.test(f))).toBe(false)
  })

  it('fragt im Dachgeschoss nicht — dort ist die „Wandfläche" die Schräge (PM-007)', () => {
    const gestellt = fragen('Dachzimmer vier mal fünf, Kniestock einssechzig, zwölf Quadratmeter Schräge, streichen.', [raum({
      name: 'Dachzimmer', laenge: 4, breite: 5, hoehe: 2.5, wandflaeche_direkt: 12, kniestockhoehe: 1.6,
    })]).map(f => f.frage)
    expect(gestellt.some(f => /Zwei Angaben zur Wandfläche/.test(f))).toBe(false)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// 3. Die Antwort
// ───────────────────────────────────────────────────────────────────────────
describe('DC-119 · die Antwort mündet in die richtige Rechenart', () => {
  it('„so gesagt" → die genannte Zahl bleibt die Grundlage', () => {
    const erg = verarbeiteAntworten(
      { raeume: [PM095()], transkript: T_WIDER } as never,
      { wandflaeche_konflikt_wohnzimmer: { wert: 30, einheit: 'm²' } },
    )
    expect(erg.raeume[0].wandflaeche_direkt).toBe(30)
  })

  it('„aus den Maßen" → die genannte Zahl fällt weg, damit VOB-Abzug greift', () => {
    // Bliebe `wandflaeche_direkt` auf 45 stehen, käme zwar dieselbe Zahl
    // heraus, aber über den Zweig für genannte Flächen — und der zieht
    // Türen und Fenster nicht nach VOB ab.
    const erg = verarbeiteAntworten(
      { raeume: [PM095()], transkript: T_WIDER } as never,
      { wandflaeche_konflikt_wohnzimmer: { wert: 45, einheit: 'm²' } },
    )
    expect(erg.raeume[0].wandflaeche_direkt).toBeNull()
  })

  it('eine dritte, selbst eingetippte Zahl gilt als genannte Fläche', () => {
    const erg = verarbeiteAntworten(
      { raeume: [PM095()], transkript: T_WIDER } as never,
      { wandflaeche_konflikt_wohnzimmer: { wert: 38.5, einheit: 'm²' } },
    )
    expect(erg.raeume[0].wandflaeche_direkt).toBe(38.5)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// 4. Wenn niemand antwortet: nie wortlos
// ───────────────────────────────────────────────────────────────────────────
describe('DC-119 · der Rechenweg nennt beide Zahlen', () => {
  it('die Menge bleibt bei 30 m² — PM-095-D ändert sich nicht', () => {
    expect(wandPosition([PM095()])!.menge).toBe(30)
  })

  it('der Rechenweg sagt, welche Zahl gewonnen hat, und nennt die andere', () => {
    const weg = wandPosition([PM095()])!.berechnungsweg
    expect(weg).toContain('Gesagt: 30 m²')
    expect(weg).toContain('damit gerechnet')
    expect(weg).toContain('45 m²')
    // Die Geometrie-Gleichung darf NICHT mehr als Rechenweg dastehen —
    // gerechnet wurde nicht mit ihr.
    expect(weg).not.toMatch(/^Umfang/)
  })

  it('der Hinweis steht zusätzlich in den Annahmen (Rechenweg ist oft eingeklappt)', () => {
    const annahmen = wandPosition([PM095()])!.annahmen ?? []
    expect(annahmen.some(a => /Zwei Angaben zur Wandfläche/.test(a))).toBe(true)
    expect(annahmen.some(a => /bitte prüfen/.test(a))).toBe(true)
  })

  it('die Konfidenz sinkt auf „medium" — die Zahl ist nicht zweifelsfrei', () => {
    expect(wandPosition([PM095()])!.konfidenz).toBe('medium')
  })

  it('Kontrolle: ohne Widerspruch bleibt der alte Rechenweg Zeichen für Zeichen', () => {
    const p = wandPosition(
      [raum({ laenge: 4, breite: 5, hoehe: 2.5 })],
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen.',
    )!
    expect(p.menge).toBe(45)
    expect(p.berechnungsweg).toMatch(/^Umfang 18 lfm × 2\.5 m = 45 m²/)
    expect((p.annahmen ?? []).some(a => /Zwei Angaben/.test(a))).toBe(false)
  })
})
