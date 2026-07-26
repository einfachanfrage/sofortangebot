import { describe, expect, it } from 'vitest'
import { DEFAULT_PRICES } from '@/lib/default-prices'
import { findePreisposition, type PreisPosition } from '@/lib/preis-matcher'

const preise: PreisPosition[] = DEFAULT_PRICES.map((p, i) => ({ ...p, id: String(i) }))

describe('betriebliche Preiszuordnung', () => {
  it.each([
    ['Wandflächen streichen — Wohnzimmer', 'm²'],
    ['Deckenfläche streichen — Schlafzimmer', 'm²'],
    ['Boden schützen — Flur', 'm²'],
    ['Sockelleisten abkleben — Büro', 'lfdm'],
    ['Vliestapete tapezieren — Kinderzimmer', 'm²'],
    ['Tapete entfernen — Küche', 'm²'],
    ['Laminat verlegen inkl. 10% Verschnitt — Wohnzimmer', 'm²'],
    ['Klick-Vinyl verlegen inkl. 10% Verschnitt — Küche', 'm²'],
    ['Vinyl-Boden verlegen inkl. 10% Verschnitt — Wohnzimmer', 'm²'],
    ['Fertigparkett verlegen inkl. 15% Verschnitt — Salon', 'm²'],
    ['Teppichboden verlegen — Schlafzimmer', 'm²'],
    ['Altbelag entfernen — Flur', 'm²'],
    ['Sockelleisten montieren — Flur', 'lfdm'],
    ['Untergrundvorbereitung / Ausgleich — Flur', 'm²'],
    ['Epoxidharz-Feuchtigkeitssperre aufwalzen — Keller', 'm²'],
    ['Parkett schleifen — Wohnzimmer', 'm²'],
    ['Voranstrich / Grundierung — Schlafzimmer', 'm²'],
    ['Wände spachteln / glätten — Schlafzimmer', 'm²'],
    ['Spachtelarbeiten Q2 — Wohnzimmer', 'm²'],
    ['Holzvertäfelung / Wandbelag abkleben — Wohnzimmer', 'm²'],
    ['Kniestockwände streichen — Dachgeschoss', 'm²'],
    ['Dachschrägen streichen — Dachgeschoss', 'm²'],
    ['Akzentwand Vliestapete — Wohnzimmer', 'm²'],
    ['Schimmelbehandlung / Grundierung', 'm²'],
    ['Kalkputz aufbringen', 'm²'],
    ['Silikatfarbe auftragen (2×)', 'm²'],
    ['Nikotinsperre auftragen', 'm²'],
    ['Rissverschluss mit Gewebe', 'm²'],
    ['Heizkörper schleifen und lackieren', 'Stück'],
    ['Fußleisten schleifen und lackieren', 'lfdm'],
    ['Anti-Schimmel-Anstrich', 'm²'],
    ['Spachteltechnik (Betonoptik)', 'm²'],
    ['Versiegelung / Schutzanstrich', 'm²'],
    ['Holzbalken anschleifen', 'lfdm'],
    ['Lasur auftragen (transparent)', 'lfdm'],
  ])('findet %s ausschließlich im Katalog', (beschreibung, einheit) => {
    const treffer = findePreisposition(beschreibung, einheit, preise)
    expect(treffer, `${beschreibung} ist nicht abgedeckt`).not.toBeNull()
    expect(treffer!.position.unit_price).toBeGreaterThan(0)
  })

  it('lehnt unbekannte Leistungen statt eines geratenen Preises ab', () => {
    expect(findePreisposition('Marsboden mit Antimaterie beschichten', 'm²', preise)).toBeNull()
  })

  it('findet Spachtel Q2 innerhalb des Maler-Katalogs', () => {
    const maler = preise.filter(preis => preis.category.startsWith('Maler'))
    expect(findePreisposition('Spachtelarbeiten Q2 — Wohnzimmer', 'm²', maler)).not.toBeNull()
  })

  it('findet Vinyl-Boden innerhalb des Boden-Katalogs', () => {
    const boden = preise.filter(preis => preis.category.startsWith('Boden'))
    expect(findePreisposition('Vinyl-Boden verlegen inkl. 10% Verschnitt — Wohnzimmer', 'm²', boden)).not.toBeNull()
  })

  it('ordnet Malervlies dem Malervlies-Preis und nicht einer Fototapete zu', () => {
    const maler = preise.filter(preis => preis.category.startsWith('Maler'))
    const treffer = findePreisposition('Malervlies tapezieren — Schlafzimmer', 'm²', maler)
    expect(treffer?.position.title).toContain('Malervlies')
    expect(treffer?.position.unit_price).toBe(15)
  })

  it('ordnet einen expliziten 2x-Wandanstrich nicht dem 1x-Preis zu', () => {
    const maler = preise.filter(preis => preis.category.startsWith('Maler'))
    const treffer = findePreisposition('Wandflächen streichen 2x — Wohnzimmer', 'm²', maler)
    expect(treffer?.position.title).toContain('2x Anstrich')
    expect(treffer?.position.unit_price).toBe(9.5)
  })

  it('bevorzugt die passende 2x-Variante vor einem generischen persönlichen Preis', () => {
    const varianten: PreisPosition[] = [
      { id: 'generic', title: 'Wandflächen streichen', category: 'Maler', unit: 'm²', unit_price: 4.5 },
      { id: '2x', title: 'Wandflächen streichen 2x Anstrich', category: 'Maler', unit: 'm²', unit_price: 9.5 },
    ]
    const treffer = findePreisposition('Wandflächen streichen 2x — Wohnzimmer', 'm²', varianten)
    expect(treffer?.position.id).toBe('2x')
    expect(treffer?.position.unit_price).toBe(9.5)
  })
})
