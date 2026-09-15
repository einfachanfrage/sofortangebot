// DC-107 (aus CoS-E-058) — Rechenweg auf dem Kundendokument.
// Alle Eingaben sind echte Vorlagen aus den Engines, nicht erfunden.
import { describe, it, expect } from 'vitest'
import { kundenRechenweg } from '@/lib/rechenweg-kundentext'

describe('DC-107 — Herkunftsnotiz fällt weg', () => {
  it('streicht „aus Transkript" (maler-lackieren, Türen)', () => {
    expect(kundenRechenweg('4 Tür(en) aus Transkript')).toBe('4 Tür(en)')
  })

  it('streicht „aus Aufnahme" (maler-lackieren, Türen aus dem Raumbestand)', () => {
    expect(kundenRechenweg('4 Tür(en) aus Aufnahme')).toBe('4 Tür(en)')
  })

  it('streicht „aus Aufnahme" auch dort, wo es das Gegenteil meint (aufnahme-hinweise)', () => {
    expect(kundenRechenweg('12 lfdm aus Aufnahme')).toBe('12 lfdm')
  })

  it('lässt den Klammerzusatz stehen (maler-sonder, Schimmel)', () => {
    expect(kundenRechenweg('8 m² aus Transkript (Schimmelbereich)')).toBe('8 m² (Schimmelbereich)')
  })

  it('erwischt auch die zusammengesetzte Aufzählung (maler-abkleben, Leuchten)', () => {
    expect(kundenRechenweg('2 Pendelleuchte(n) + 3 Einbauspot(s) aus Transkript'))
      .toBe('2 Pendelleuchte(n) + 3 Einbauspot(s)')
  })
})

describe('DC-107 — „im Transkript" wird „im Aufmaß"', () => {
  it('Erschwerniszuschlag Altbau', () => {
    expect(kundenRechenweg('Altbau im Transkript erkannt')).toBe('Altbau im Aufmaß erkannt')
  })

  it('Gerüst', () => {
    expect(kundenRechenweg('Gerüst im Transkript erwähnt')).toBe('Gerüst im Aufmaß erwähnt')
  })

  it('Untergrund', () => {
    expect(kundenRechenweg('Schwieriger/unebener Untergrund im Transkript erkannt'))
      .toBe('Schwieriger/unebener Untergrund im Aufmaß erkannt')
  })

  it('Satzform mit Zitat (maler-tapete)', () => {
    expect(kundenRechenweg('Gleiche Länge wie „Sockelleisten montieren" — im Transkript stand keine eigene Meterangabe fürs Streichen'))
      .toBe('Gleiche Länge wie „Sockelleisten montieren" — im Aufmaß stand keine eigene Meterangabe fürs Streichen')
  })

  it('lässt kein „Transkript" stehen', () => {
    expect(kundenRechenweg('Transkript ohne feste Wendung')).not.toContain('Transkript')
  })
})

describe('DC-107 — „angenommen" bleibt und bekommt eine Klammer', () => {
  it('der gemeldete Fall: Fenster ohne jede Zahl', () => {
    expect(kundenRechenweg('1 Fenster angenommen')).toBe('1 Fenster (angenommen)')
  })

  it('Dehnungsfuge: beide Regeln in einem Satz (aufnahme-hinweise)', () => {
    expect(kundenRechenweg('Dehnungsfuge erkannt, keine explizite Stückzahl im Transkript — 1 Stück angenommen'))
      .toBe('Dehnungsfuge erkannt, keine explizite Stückzahl im Aufmaß — 1 Stück (angenommen)')
  })

  it('setzt keine zweite Klammer', () => {
    expect(kundenRechenweg('1 Fenster (angenommen)')).toBe('1 Fenster (angenommen)')
  })
})

describe('DC-107 — alles andere bleibt unangetastet', () => {
  it('die reine Rechnung', () => {
    const rechnung = '46,64 m² × 12,50 €/m² = 583,00 €'
    expect(kundenRechenweg(rechnung)).toBe(rechnung)
  })

  it('Verweise auf andere Positionen', () => {
    const verweis = 'Gleiche Fläche wie Wandflächen (32,40 m²)'
    expect(kundenRechenweg(verweis)).toBe(verweis)
  })

  it('Raumbezug', () => {
    expect(kundenRechenweg('2 Heizkörper in Wohnzimmer')).toBe('2 Heizkörper in Wohnzimmer')
  })

  it('ist idempotent', () => {
    const einmal = kundenRechenweg('4 Tür(en) aus Transkript')
    expect(kundenRechenweg(einmal)).toBe(einmal)
  })

  it('kommt mit leer und null klar', () => {
    expect(kundenRechenweg(null)).toBe('')
    expect(kundenRechenweg(undefined)).toBe('')
    expect(kundenRechenweg('')).toBe('')
  })
})
