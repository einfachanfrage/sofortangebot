import { describe, expect, it } from 'vitest'
import { normalisiereExtraktion } from '../extraktion-normalisierer'
import { generiereRueckfragen } from '../rueckfragen-generator'

// CoS-E-073 (Befund des Product Designers aus PD-019 Punkt 1):
// `prompt-extraktion-v4.ts` sagt nirgends allgemein, wann `vage: true` zu
// setzen ist. Die einzige Stelle, die `raum_ohne_masse` nennt, steht im
// Zweig „Wohnung/Haus als Ganzes" (DC-040). Für einen normal benannten Raum
// ohne jedes Maß („Wohnzimmer streichen.") gibt es keine Regel.
//
// Folge: ist `vage` falsch, entsteht keine Rückfrage — keine Rückfrage heißt
// keine Position und kein Eintrag (die Fehlerform von PM-113).
//
// Die Regel steht ab jetzt im Prompt UND wird im Normalisierer deterministisch
// nachgezogen. Der Prompt allein ist eine Bitte an ein Sprachmodell; die
// Nachziehung ist die Zusicherung. Hier abgesichert ist die Nachziehung —
// den Prompt kann kein Prüfstand grün machen.

function raum(over: Record<string, unknown> = {}) {
  return {
    name: 'Wohnzimmer', laenge: null, breite: null, hoehe: null, flaeche: null,
    umfang: null, wandflaeche_direkt: null, deckflaeche_direkt: null,
    fenster: [], tueren: [], arbeiten: ['wände streichen'],
    vage: false, vage_typ: null, vage_beschreibung: null,
    ...over,
  }
}

function norm(raeume: Record<string, unknown>[]) {
  return normalisiereExtraktion({ gewerk: 'maler', raeume })
}

describe('CoS-E-073 — Raum mit Arbeiten, aber ohne jedes Maß ist vage', () => {
  it('1. „Wohnzimmer streichen." — kein Maß, also vage: true / raum_ohne_masse', () => {
    const r = norm([raum()]).raeume[0]
    expect(r.vage).toBe(true)
    expect(r.vage_typ).toBe('raum_ohne_masse')
  })

  it('2. aus dem vagen Raum entsteht eine Maßfrage', () => {
    const fragen = generiereRueckfragen(norm([raum()]))
    expect(fragen).toHaveLength(1)
    expect(fragen[0].typ).toBe('masse_einzel')
    expect(fragen[0].frage).toContain('Wohnzimmer')
  })

  // --- Gegenproben: jedes einzelne Maß genügt, der Raum bleibt unangetastet ---

  it('3. laenge + breite genügen — bleibt vage: false', () => {
    const r = norm([raum({ laenge: 5, breite: 4 })]).raeume[0]
    expect(r.vage).toBe(false)
    expect(r.vage_typ).toBeNull()
  })

  it('4. flaeche allein genügt', () => {
    expect(norm([raum({ flaeche: 22 })]).raeume[0].vage).toBe(false)
  })

  it('5. wandflaeche_direkt allein genügt (DC-040, „Wohnung als Ganzes")', () => {
    expect(norm([raum({ name: 'Wohnung', wandflaeche_direkt: 95 })]).raeume[0].vage).toBe(false)
  })

  it('6. deckflaeche_direkt allein genügt', () => {
    expect(norm([raum({ deckflaeche_direkt: 18 })]).raeume[0].vage).toBe(false)
  })

  it('7. umfang allein genügt (Sockelleisten-Fall)', () => {
    expect(norm([raum({ umfang: 14, arbeiten: ['sockelleisten montieren'] })]).raeume[0].vage).toBe(false)
  })

  it('8. Dachgeschoss-Maße genügen — dachschraege_je_seite_m2 ohne laenge/breite', () => {
    expect(norm([raum({ dachschraege_je_seite_m2: 12, deckenspiegel_m2: 20 })]).raeume[0].vage).toBe(false)
  })

  it('9. hoehe allein ist KEIN Maß — aus der Höhe folgt keine Fläche', () => {
    const r = norm([raum({ hoehe: 2.5 })]).raeume[0]
    expect(r.vage).toBe(true)
    expect(r.vage_typ).toBe('raum_ohne_masse')
  })

  // --- Gegenproben: die Nachziehung greift nur, wo sie soll ---

  it('10. Raum ohne Arbeiten wird nicht vage — es ist nichts zu tun, also nichts zu fragen', () => {
    const r = norm([raum({ arbeiten: [] })]).raeume[0]
    expect(r.vage).toBe(false)
    expect(generiereRueckfragen(norm([raum({ arbeiten: [] })]))).toHaveLength(0)
  })

  it('11. ein von GPT gesetztes vage_typ wird NICHT überschrieben', () => {
    const r = norm([raum({ vage: true, vage_typ: 'plural_ohne_zahl', vage_beschreibung: 'beide Schlafzimmer' })]).raeume[0]
    expect(r.vage_typ).toBe('plural_ohne_zahl')
    expect(r.vage_beschreibung).toBe('beide Schlafzimmer')
  })

  it('12. GPT hat vage: true ohne vage_typ geliefert — Typ wird ergänzt, nicht verworfen', () => {
    const r = norm([raum({ vage: true, vage_typ: null })]).raeume[0]
    expect(r.vage).toBe(true)
    expect(r.vage_typ).toBe('raum_ohne_masse')
  })

  it('13. vage_beschreibung bleibt leer, wenn GPT keine geliefert hat — nichts erfinden', () => {
    expect(norm([raum()]).raeume[0].vage_beschreibung).toBeNull()
  })

  it('14. Maß 0 zählt nicht als Maß', () => {
    expect(norm([raum({ flaeche: 0, laenge: 0, breite: 0 })]).raeume[0].vage).toBe(true)
  })

  it('15. mehrere Räume werden einzeln beurteilt', () => {
    const { raeume } = norm([raum(), raum({ name: 'Küche', laenge: 3, breite: 4 })])
    expect(raeume[0].vage).toBe(true)
    expect(raeume[1].vage).toBe(false)
  })
})
