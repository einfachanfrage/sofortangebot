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

// ══════════════════════════════════════════════════════════════════════════
// DC-108 (aus PM-078) — zwei Sätze ohne „Transkript", die trotzdem nicht aufs
// Kundenpapier gehören. Gebaut an derselben Stelle wie DC-107, aus demselben
// Grund: die Sätze sind für den Betrieb richtig, nur nicht für den Kunden.
// ══════════════════════════════════════════════════════════════════════════

describe('DC-108 A — Arbeitsanweisung an den Betrieb', () => {
  const ANWEISUNG = 'Erkannt, aber Menge nicht sicher berechenbar — bitte manuell ergänzen'

  it('fällt ganz weg (pdf.tsx schreibt dann „Pauschale")', () => {
    expect(kundenRechenweg(ANWEISUNG)).toBe('')
  })

  it('auch ohne Gedankenstrich davor', () => {
    expect(kundenRechenweg('Menge unklar, bitte manuell ergänzen')).toBe('')
  })

  it('eine echte Rechnung verliert nur die Anweisung, nicht die Rechnung', () => {
    expect(kundenRechenweg('46,64 m² × 12,50 €/m² = 583,00 € — Menge bitte prüfen'))
      .toBe('46,64 m² × 12,50 €/m² = 583,00 €')
  })

  it('ohne „bitte" bleibt alles, wie es war', () => {
    expect(kundenRechenweg('3 Zimmer × 2 Anstriche')).toBe('3 Zimmer × 2 Anstriche')
  })
})

describe('DC-108 B — Schätzweg über die Wurzel', () => {
  it('Herleitung raus, Ergebnis bleibt', () => {
    expect(kundenRechenweg('Umfang ≈ 4 × √20 m² = 18 lfdm')).toBe('Umfang ≈ 18 lfdm')
  })

  it('mit Zusatz in Klammern (maler-extras.ts)', () => {
    expect(kundenRechenweg('Umfang ≈ 4 × √20 m² = 18 lfdm (voller Umfang, kein Türabzug)'))
      .toBe('Umfang ≈ 18 lfdm (voller Umfang, kein Türabzug)')
  })

  it('kleine Fläche (boden-vorarbeiten.ts)', () => {
    expect(kundenRechenweg('Umfang ≈ 4 × √6 m² = 10 lfdm')).toBe('Umfang ≈ 10 lfdm')
  })

  it('eine Wurzel in unbekannter Schreibweise kommt gar nicht durch', () => {
    expect(kundenRechenweg('Seitenlänge √49 m')).toBe('')
  })

  it('ist idempotent', () => {
    const einmal = kundenRechenweg('Umfang ≈ 4 × √20 m² = 18 lfdm')
    expect(kundenRechenweg(einmal)).toBe(einmal)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// DC-110 (aus CoS-E-065 Punkt 2) — der neue Wortlaut der Herkunft. Die
// Engines schreiben ihn noch nicht; der Filter kennt ihn trotzdem schon,
// damit zwischen Umbenennung und Filter keine Lücke entsteht, in der die
// neuen Wörter aufs Kundenpapier laufen.
// ══════════════════════════════════════════════════════════════════════════

describe('DC-110 — die neuen Herkunftswörter fallen genauso weg', () => {
  it('streicht „so gesagt" (Türen, Zahl stand im Satz)', () => {
    expect(kundenRechenweg('4 Tür(en) so gesagt')).toBe('4 Tür(en)')
  })

  it('streicht „so gesagt" auch bei Metern (aufnahme-hinweise)', () => {
    expect(kundenRechenweg('12 lfdm so gesagt')).toBe('12 lfdm')
  })

  it('streicht „aus den Raumangaben" (Türen aus dem Raumbestand)', () => {
    expect(kundenRechenweg('4 Tür(en) aus den Raumangaben')).toBe('4 Tür(en)')
  })

  it('lässt den Klammerzusatz stehen', () => {
    expect(kundenRechenweg('3 Fenster aus den Raumangaben (Nordseite)'))
      .toBe('3 Fenster (Nordseite)')
  })

  it('der dritte Türen-Fall, den Engineering ergänzt: „angenommen" bleibt', () => {
    expect(kundenRechenweg('1 Tür(en) angenommen')).toBe('1 Tür(en) (angenommen)')
  })

  it('ein einzelnes „gesagt" im Satz bleibt unangetastet', () => {
    expect(kundenRechenweg('Dehnungsfuge erkannt, keine Stückzahl gesagt — 1 Stück angenommen'))
      .toBe('Dehnungsfuge erkannt, keine Stückzahl gesagt — 1 Stück (angenommen)')
  })

  it('ist idempotent', () => {
    const einmal = kundenRechenweg('4 Tür(en) aus den Raumangaben')
    expect(kundenRechenweg(einmal)).toBe(einmal)
  })

  it('eine echte Rechnung im selben Feld bleibt vollständig', () => {
    expect(kundenRechenweg('46,64 m² × 12,50 €/m² = 583,00 €'))
      .toBe('46,64 m² × 12,50 €/m² = 583,00 €')
  })
})
