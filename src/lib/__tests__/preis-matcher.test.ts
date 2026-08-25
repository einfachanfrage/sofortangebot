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
    // Head of Product Engineering (2026-08-20): war 'm²', aber die Engine
    // (mengen/gewerke/maler.ts, Wandzonen-Branch) berechnet diese Position
    // immer in laufenden Metern (Raumumfang) — der alte Katalogeintrag hatte
    // ebenfalls fälschlich 'm²', weshalb dieser Test trotz eines echten
    // "Preis fehlt"-Bugs in Produktion grün blieb (beide Seiten falsch,
    // dieselbe falsche Einheit). Jetzt korrigiert, siehe default-prices.ts.
    ['Holzvertäfelung / Wandbelag abkleben — Wohnzimmer', 'lfdm'],
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

  it('ordnet kleine Schadstellen dem Kleinreparatur-Preis zu', () => {
    const maler = preise.filter(preis => preis.category.startsWith('Maler'))
    const treffer = findePreisposition('Risse / Löcher spachteln (kleine Schadstellen)', 'Stück', maler)
    expect(treffer?.position.title).toContain('Risse / Löcher spachteln')
    expect(treffer?.position.unit_price).toBe(8)
  })

  it.each([
    ['Untergrund schleifen (Unebenheiten, Kleberreste)', 'm²', 7],
    ['Aufpreis Fischgrät-Verlegemuster (vollflächig verklebt)', 'm²', 14],
    ['Untergrundprüfung (Ebenheit, Feuchte, Tragfähigkeit)', 'Pauschale', 45],
    ['Fertigparkett verlegen vollflächig verklebt', 'm²', 35],
    ['Laminat demontieren und entsorgen', 'm²', 5],
    ['Teppichboden entfernen und entsorgen', 'm²', 6],
    ['Sockelleisten entfernen (alt)', 'lfdm', 2],
  ])('ordnet Boden-Standardposition %s eindeutig zu', (beschreibung, einheit, preis) => {
    const boden = preise.filter(position => position.category.startsWith('Boden'))
    expect(findePreisposition(beschreibung, einheit, boden)?.position.unit_price).toBe(preis)
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

// ── Anstrich-Varianten: die festgeklopften Regeln (2026-08-24, Sandys „klopf
// fest") ────────────────────────────────────────────────────────────────────
// Aufgedeckt durch PM-007: „Kniestockwände streichen 2x" fand seinen eigenen
// Katalogpreis nicht und stand mit 0,00 € im Angebot, während dieselbe
// Position mit „1x" sauber matchte. Diese Tests halten fest, was gewollt ist —
// und was der Fehler war.
describe('Anstrich-Varianten (1x/2x/3x)', () => {
  const p = (title: string, unit_price: number, unit = 'm²') => ({
    id: title, title, category: 'Maler – Anstrich Innen', unit, unit_price,
  })

  it('gibt einem 2x-Auftrag NIEMALS den 1x-Preis', () => {
    // Die eine Regel, die nicht verhandelbar ist: lieber „Preis fehlt" als
    // eine Position, die zu billig im Angebot steht.
    const katalog = [p('Wandflächen streichen 1x', 7.5)]
    expect(findePreisposition('Wandflächen streichen 2x — Flur', 'm²', katalog)).toBeNull()
  })

  it('gibt einem 1x-Auftrag NIEMALS den 2x-Preis', () => {
    const katalog = [p('Wandflächen streichen 2x', 11.5)]
    expect(findePreisposition('Wandflächen streichen 1x — Flur', 'm²', katalog)).toBeNull()
  })

  it('bevorzugt die passende Variante gegenüber einem Eintrag ohne Anstrichzahl', () => {
    const katalog = [p('Wandflächen streichen', 9), p('Wandflächen streichen 2x', 11.5)]
    const treffer = findePreisposition('Wandflächen streichen 2x — Flur', 'm²', katalog)
    expect(treffer?.position.title).toBe('Wandflächen streichen 2x')
  })

  it('nimmt den Eintrag ohne Anstrichzahl, wenn es keine passende Variante gibt', () => {
    // Ein Katalogeintrag ohne Zusatz ist der eigene Preis des Betriebs für
    // genau diese Arbeit — den zu ignorieren wäre kein Schutz, sondern Verlust.
    const katalog = [p('Kniestockwände streichen', 11)]
    const treffer = findePreisposition('Kniestockwände streichen 2x — Dachzimmer', 'm²', katalog)
    expect(treffer?.position.title).toBe('Kniestockwände streichen')
    expect(treffer?.position.unit_price).toBe(11)
  })

  it('PM-007: ein fremder 2x-Eintrag sperrt den eigenen Katalogpreis nicht mehr', () => {
    // Genau Sandys Live-Katalog. Vorher sorgte allein die Existenz von
    // „Wand streichen 2x Anstrich" dafür, dass „Kniestockwände streichen"
    // gar nicht mehr in Frage kam → 0,00 € im Angebot.
    const katalog = [
      p('Kniestockwände streichen', 11),
      p('Dachschrägen streichen', 11),
      p('Wand streichen 2x Anstrich', 9.5),
    ]
    expect(findePreisposition('Kniestockwände streichen 2x — Dachzimmer', 'm²', katalog)?.position.unit_price).toBe(11)
    expect(findePreisposition('Dachschrägen streichen 2x — Dachzimmer', 'm²', katalog)?.position.unit_price).toBe(11)
  })

  it('behandelt 1x und 2x gleich — keine Asymmetrie mehr', () => {
    const katalog = [p('Dachschrägen streichen', 11), p('Wand streichen 2x Anstrich', 9.5)]
    const einfach = findePreisposition('Dachschrägen streichen 1x — Dachzimmer', 'm²', katalog)
    const zweifach = findePreisposition('Dachschrägen streichen 2x — Dachzimmer', 'm²', katalog)
    expect(einfach?.position.title).toBe('Dachschrägen streichen')
    expect(zweifach?.position.title).toBe('Dachschrägen streichen')
  })
})
