import { describe, it, expect } from 'vitest'
import { bodenEngine } from '../../mengen/gewerke/boden'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import { erkenneBelag } from '../../boden-normalisierer'

// Beta-Test 2 (echter Prod-Fall, Flur): deckte drei Bugs auf, die alle Test-Prod-Drift waren:
//  1) normalisiereGewerk liefert 'boden_parkett' — Dispatch prüfte nur 'boden' → Boden-
//     Vollständigkeit lief in Prod NIE.
//  2) Whisper: "Klick-Vinyl" → "Glykvenyl" → Belag nicht erkannt → Kette blockiert.
//  3) Engine legt "Altbelag entfernen" an → pruefeAltbelag brach ab → Kleberreste fehlten;
//     Sockelleisten ohne Maße landeten stumm in "fehlende".
describe('Boden Prod-Fall — Flur mit verklebtem Teppich + garbeltem Klick-Vinyl', () => {
  const t = 'Im Flur soll der alte Teppich raus, der ist verklebt, Kleberreste abschleifen. ' +
    'Danach Glykvenyl rein, 18 Quadratmeter, Sockelleisten neu.'
  const positionen = (() => {
    const eng = bodenEngine({ transkript: t, raeume: [{ name: 'Flur', flaeche: 18, belag: 'glykvenyl', altbelag_entfernen: true, sockelleisten: true, arbeiten: ['glykvenyl verlegen', 'teppich entfernen', 'kleberreste abschleifen', 'sockelleisten'] }] })
    // WICHTIG: gewerk 'boden_parkett' (wie in Prod), nicht 'boden'
    return pruefeUndErgaenzeVollstaendigkeit('boden_parkett', eng.positionen, t).positionen
  })()
  const namen = positionen.map(p => p.beschreibung.toLowerCase())

  it('garbeltes "glykvenyl" wird als Vinyl erkannt', () => {
    expect(erkenneBelag('glykvenyl')).toBe('vinyl')
    expect(namen.some(n => n.includes('vinyl'))).toBe(true)
    expect(namen.some(n => n.includes('glykvenyl'))).toBe(false)
  })

  it('Kleberreste abschleifen taucht als Position auf (trotz Engine-Altbelag)', () => {
    expect(namen.some(n => n.includes('kleberreste'))).toBe(true)
  })

  it('Sockelleisten aus Fläche geschätzt (~17 lfdm)', () => {
    const sockel = positionen.find(p => p.beschreibung.toLowerCase().includes('sockelleisten'))
    expect(sockel).toBeDefined()
    expect(sockel!.menge).toBeGreaterThan(14)
    expect(sockel!.menge).toBeLessThan(20)
  })
})
