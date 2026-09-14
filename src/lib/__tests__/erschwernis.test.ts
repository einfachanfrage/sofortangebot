// Erschwerniszuschläge — der Betrieb entscheidet, ob er sie will.
//
// ── CoS-E-040 / TN-097 (Manfred) ──────────────────────────────────────────
//
// *„Erschwerniszuschläge ‚Altbau'/‚bewohnt' lassen sich in den Einstellungen
// nirgends abschalten."*
//
// Die Zuschläge entstehen aus dem Diktat: Wer „Altbau" sagt, bekommt einen
// Altbau-Zuschlag vorgeschlagen. Für einen Betrieb, der ausschließlich im
// Altbau arbeitet, ist das Unsinn — bei ihm steckt der Aufwand längst im
// Quadratmeterpreis, und er löscht die Position in jedem Angebot von Hand.
//
// Zwei Dinge müssen dabei zusammen stimmen, und die zweite ist die
// wichtigere:
//   • Abgeschaltet heißt: taucht gar nicht erst auf.
//   • **Nichts eingestellt heißt: alles wie bisher.** Ein Update darf
//     niemandem still einen Zuschlag wegnehmen, den er bisher bekommen hat.
import { describe, expect, it } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { filtereErschwernis, erschwernisAktiv, ERSCHWERNIS_ARTEN } from '../erschwernis'
import type { BerechnetePosition } from '../mengen/types'

const pos = (b: string, m = 45): BerechnetePosition =>
  ({ beschreibung: b, menge: m, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${m} m²`, annahmen: [] })

const TEXT = 'Altbau, bewohnt, Wohnzimmer 4x5, Wände zweimal streichen.'
const lauf = (erschwernis?: Parameters<typeof pruefeUndErgaenzeVollstaendigkeit>[3]) =>
  pruefeUndErgaenzeVollstaendigkeit('maler', [pos('Wand streichen 2x — Wohnzimmer')], TEXT, erschwernis)
    .positionen.map(p => p.beschreibung)

describe('Ohne Einstellung bleibt alles wie bisher', () => {
  it('schlägt Altbau und bewohnt weiter vor', () => {
    // Die Zusicherung gegen den stillen Schaden: Wer die Einstellung nie
    // anfasst, merkt vom ganzen Ticket nichts.
    const titel = lauf()
    expect(titel.some(t => /Erschwerniszuschlag Altbau/.test(t))).toBe(true)
    expect(titel.some(t => /Erschwerniszuschlag bewohnt/.test(t))).toBe(true)
  })

  it('gilt auch für eine Einstellung, die diese Art noch nicht kennt', () => {
    // Kommt eine neue Zuschlagsart dazu, hat ein alter Datensatz dafür
    // keinen Schlüssel. Fehlend heißt an — nicht aus.
    expect(erschwernisAktiv({ bewohnt: false }, 'altbau')).toBe(true)
    expect(erschwernisAktiv(null, 'altbau')).toBe(true)
    expect(erschwernisAktiv({}, 'raumhoehe')).toBe(true)
  })
})

describe('Abgeschaltet heißt: taucht gar nicht erst auf', () => {
  it('entfernt genau den einen Zuschlag', () => {
    const titel = lauf({ erschwernis: { altbau: false } })
    expect(titel.some(t => /Erschwerniszuschlag Altbau/.test(t))).toBe(false)
    // Der andere bleibt — abschalten ist eine Einzelentscheidung.
    expect(titel.some(t => /Erschwerniszuschlag bewohnt/.test(t))).toBe(true)
  })

  it('lässt die Arbeit in Ruhe', () => {
    // Der Filter fasst nur Zuschläge an. Eine Regel, die beim Abschalten
    // eines Zuschlags Arbeitspositionen mitnimmt, wäre unbezahlbar teuer.
    const titel = lauf({ erschwernis: { altbau: false, bewohnt: false } })
    expect(titel.some(t => /Wand streichen 2x/.test(t))).toBe(true)
    expect(titel.some(t => /Erschwerniszuschlag/.test(t))).toBe(false)
  })

  it('schaltet auch den Raumhöhen-Zuschlag ab', () => {
    const hoch = (erschwernis?: Record<string, boolean>) =>
      pruefeUndErgaenzeVollstaendigkeit('maler', [pos('Wand streichen 2x — Wohnzimmer')],
        'Wohnzimmer, Raumhöhe 3,60 m, Wände streichen.',
        { raeume: [{ name: 'Wohnzimmer', hoehe: 3.6 }], ...(erschwernis ? { erschwernis } : {}) },
      ).positionen.map(p => p.beschreibung)
    expect(hoch().some(t => /Erschwerniszuschlag Raumhöhe/.test(t))).toBe(true)
    expect(hoch({ raumhoehe: false }).some(t => /Erschwerniszuschlag Raumhöhe/.test(t))).toBe(false)
  })
})

describe('Der Filter selbst', () => {
  it('fasst ohne Einstellung nichts an', () => {
    const p = [pos('Erschwerniszuschlag Altbau'), pos('Wand streichen 2x')]
    expect(filtereErschwernis(p, null)).toHaveLength(2)
    expect(filtereErschwernis(p, {})).toHaveLength(2)
  })

  it('trifft jede Art über ihren eigenen Titel', () => {
    // Wenn ein Muster nicht zum erzeugten Titel passt, ist der Schalter in
    // den Einstellungen ein Knopf ohne Wirkung — die schlimmste Sorte.
    for (const art of ERSCHWERNIS_ARTEN) {
      const beispiel = {
        altbau: 'Erschwerniszuschlag Altbau',
        denkmalschutz: 'Erschwerniszuschlag Denkmalschutz',
        bewohnt: 'Erschwerniszuschlag bewohnt',
        untergrund: 'Erschwerniszuschlag schwieriger Untergrund',
        raumhoehe: 'Erschwerniszuschlag Raumhöhe > 3m — Büro',
      }[art.id]
      expect(art.titel.test(beispiel), `${art.id}: „${beispiel}"`).toBe(true)
      expect(filtereErschwernis([pos(beispiel)], { [art.id]: false })).toHaveLength(0)
    }
  })

  it('jede Art hat Beschriftung und Erklärung für die Einstellungen', () => {
    for (const art of ERSCHWERNIS_ARTEN) {
      expect(art.label.length, art.id).toBeGreaterThan(2)
      expect(art.erklaerung.length, art.id).toBeGreaterThan(10)
    }
  })
})
