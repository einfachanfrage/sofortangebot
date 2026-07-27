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

describe('Boden Phase 3 — Entfernen und Entsorgen bleibt sichtbar', () => {
  it('erhält Laminat-Entsorgung, alte Sockelleisten und Untergrundprüfung', () => {
    const t = 'Schlafzimmer 20 Quadratmeter. Laminatboden entfernen und entsorgen, alte Sockelleisten entfernen und entsorgen, Untergrund prüfen und ausgleichen, Trittschalldämmung und Klick-Vinyl verlegen, 18 Meter neue Sockelleisten und zwei Übergangsprofile.'
    const eng = bodenEngine({
      transkript: t,
      raeume: [{ name: 'Schlafzimmer', flaeche: 20, belag: 'vinyl', altbelag_entfernen: true, sockelleisten: true, arbeiten: ['laminat entfernen', 'vinyl verlegen', 'sockelleisten montieren'] }],
    })
    const result = pruefeUndErgaenzeVollstaendigkeit('boden_parkett', eng.positionen, t).positionen
    const namen = result.map(position => position.beschreibung.toLowerCase())

    expect(namen.some(name => name.includes('laminat demontieren und entsorgen'))).toBe(true)
    expect(namen.some(name => name.includes('sockelleisten entfernen'))).toBe(true)
    expect(namen.some(name => name.includes('untergrundprüfung'))).toBe(true)
  })

  it('erhält Teppich-Entsorgung und nutzt Datenbanktitel für Kleberreste und Fischgrät', () => {
    const t = 'Im Wohnzimmer werden 32 Quadratmeter vollflächig verklebter Teppichboden entfernt und entsorgt. Die Kleberreste werden abgeschliffen. Danach wird Eichen-Fertigparkett im Fischgrätmuster vollflächig verklebt. Der Estrich ist trocken und muss nicht ausgeglichen werden. Es werden 24 laufende Meter Sockelleisten montiert.'
    const eng = bodenEngine({
      transkript: t,
      raeume: [{ name: 'Wohnzimmer', flaeche: 32, belag: 'fertigparkett', altbelag_entfernen: true, sockelleisten: true, arbeiten: ['teppich entfernen', 'kleberreste abschleifen', 'fertigparkett verkleben'] }],
    })
    const result = pruefeUndErgaenzeVollstaendigkeit('boden_parkett', eng.positionen, t).positionen
    const namen = result.map(position => position.beschreibung.toLowerCase())

    expect(namen.some(name => name.includes('teppichboden entfernen und entsorgen'))).toBe(true)
    expect(namen.some(name => name.includes('untergrund schleifen') && name.includes('kleberreste'))).toBe(true)
    expect(namen.some(name => name.includes('fertigparkett verlegen vollflächig verklebt'))).toBe(true)
    expect(namen.some(name => name.includes('aufpreis fischgrät-verlegemuster'))).toBe(true)
    expect(namen.some(name => name.includes('versiegelung'))).toBe(false)
    expect(namen.some(name => name.includes('parkett schleifen'))).toBe(false)
    expect(namen.some(name => name.includes('ausgleich'))).toBe(false)
  })

  it('macht eine beantwortete echte Parkett-Rückfrage zur bepreisten Leistung', () => {
    const t = 'Altes Parkett im Wohnzimmer auf 32 Quadratmetern abschleifen.'
    const result = pruefeUndErgaenzeVollstaendigkeit(
      'boden_parkett',
      [],
      t,
      undefined,
      { arbeitenTexte: ['Parkett schleifen', 'versiegeln'], belagText: 'Parkett' },
    ).positionen

    expect(result.some(position => position.beschreibung === 'Parkett versiegeln (Lack, 2-lagig)')).toBe(true)
  })
})
