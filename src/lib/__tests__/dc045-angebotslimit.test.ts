import { describe, it, expect } from 'vitest'
import { istProPlan, monatsStartISO, limitNachricht, pruefeAngebotsLimit } from '../plan-limit'
import { PRICING } from '../pricing'

// ── DC-045, Sandys Entscheidung vom 06.09.2026: harte Grenze ──────────────
//
// „Ab dem 4. Angebot geht es erst nach dem Upgrade weiter."
//
// Eine Sperre ist die gefährlichste Sorte Fix: Sie fällt erst auf, wenn
// jemand vor einem Kunden steht und nicht weiterkommt. Deshalb sind hier
// nicht nur die Grenze, sondern vor allem ihre AUSNAHMEN festgehalten.

/** Minimaler Supabase-Doppelgänger — zählt, was die Filter zulassen. */
function fakeSupabase(zeilen: Array<{ created_at: string; original_id: string | null }>) {
  return {
    from() {
      const filter: { seit?: string; nurOriginale?: boolean } = {}
      const kette = {
        select: () => kette,
        eq: () => kette,
        gte: (_s: string, wert: string) => { filter.seit = wert; return kette },
        is: () => { filter.nurOriginale = true; return kette },
        then: (aufloesen: (v: { count: number; error: null }) => void) => {
          const treffer = zeilen.filter(z =>
            (!filter.seit || z.created_at >= filter.seit) &&
            (!filter.nurOriginale || z.original_id === null))
          aufloesen({ count: treffer.length, error: null })
        },
      }
      return kette
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}

const jetzt = new Date()
const imMonat = (tag: number) => new Date(jetzt.getFullYear(), jetzt.getMonth(), tag, 12).toISOString()
const letzterMonat = new Date(jetzt.getFullYear(), jetzt.getMonth() - 1, 15).toISOString()

describe('DC-045 — die Grenze greift, aber nur wo sie soll', () => {
  it('drei Angebote sind erlaubt, das vierte nicht', async () => {
    const zwei = await pruefeAngebotsLimit(fakeSupabase([
      { created_at: imMonat(2), original_id: null },
      { created_at: imMonat(3), original_id: null },
    ]), 'c1', 'starter')
    expect(zwei.erreicht).toBe(false)

    const drei = await pruefeAngebotsLimit(fakeSupabase([
      { created_at: imMonat(2), original_id: null },
      { created_at: imMonat(3), original_id: null },
      { created_at: imMonat(4), original_id: null },
    ]), 'c1', 'starter')
    expect(drei.anzahl).toBe(3)
    expect(drei.erreicht).toBe(true)
  })

  it('Pro wird nie gesperrt', async () => {
    const viele = Array.from({ length: 50 }, (_, i) => ({ created_at: imMonat(1), original_id: null as string | null }))
    const stand = await pruefeAngebotsLimit(fakeSupabase(viele), 'c1', 'pro')
    expect(stand.erreicht).toBe(false)
    expect(stand.limit).toBeNull()
  })

  it('der letzte Monat zählt nicht mehr mit', async () => {
    const stand = await pruefeAngebotsLimit(fakeSupabase([
      { created_at: letzterMonat, original_id: null },
      { created_at: letzterMonat, original_id: null },
      { created_at: letzterMonat, original_id: null },
      { created_at: imMonat(1), original_id: null },
    ]), 'c1', 'starter')
    expect(stand.anzahl).toBe(1)
    expect(stand.erreicht).toBe(false)
  })

  it('Überarbeitungen zählen NICHT mit — sonst kostet ein Änderungswunsch den Monat', async () => {
    const stand = await pruefeAngebotsLimit(fakeSupabase([
      { created_at: imMonat(2), original_id: null },
      { created_at: imMonat(3), original_id: 'q-1' },
      { created_at: imMonat(4), original_id: 'q-1' },
      { created_at: imMonat(5), original_id: 'q-1' },
    ]), 'c1', 'starter')
    expect(stand.anzahl).toBe(1)
    expect(stand.erreicht).toBe(false)
  })

  it('ein leerer Monat ist nicht erreicht', async () => {
    expect((await pruefeAngebotsLimit(fakeSupabase([]), 'c1', 'starter')).erreicht).toBe(false)
  })
})

describe('DC-045 — eine Zahl, nicht drei', () => {
  it('die Grenze kommt aus der Preisliste, nicht aus dem Code', async () => {
    const stand = await pruefeAngebotsLimit(fakeSupabase([]), 'c1', 'starter')
    expect(stand.limit).toBe(PRICING.freeAngeboteProMonat)
    expect(stand.limit).toBe(3)
  })

  it('der Text nennt dieselbe Zahl und sagt, was weiter geht', () => {
    const text = limitNachricht(PRICING.freeAngeboteProMonat)
    expect(text).toContain('3 Angebote pro Monat')
    // Die wichtigste Zusage: niemand bleibt beim Kunden hängen.
    expect(text).toMatch(/weiter bearbeiten und versenden/)
  })
})

describe('DC-045 — Hilfsfunktionen', () => {
  it('istProPlan: alles außer starter ist unbegrenzt', () => {
    expect(istProPlan('starter')).toBe(false)
    expect(istProPlan(null)).toBe(false)
    expect(istProPlan(undefined)).toBe(false)
    expect(istProPlan('pro')).toBe(true)
    expect(istProPlan('enterprise')).toBe(true)
  })

  it('monatsStartISO liegt auf dem Monatsersten', () => {
    const start = new Date(monatsStartISO(new Date(2026, 8, 17, 23, 30)))
    expect(start.getDate()).toBe(1)
    expect(start.getMonth()).toBe(8)
  })
})
