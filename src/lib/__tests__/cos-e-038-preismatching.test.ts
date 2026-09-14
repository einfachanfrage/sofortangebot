// CoS-E-037/038 — „Preise kommen nicht aus meiner Preisliste"
// (Manfreds Prio 4, TN-092/093/094, 11.09.2026)
//
// Der Katalog unten ist NICHT erfunden: Es sind die echten Zeilen aus dem
// Testkonto, mit denen Manfred gearbeitet hat. Die gesuchten Titel sind die
// echten `quote_items.title` aus seinen beiden Angeboten. Beides aus der
// Produktionsdatenbank abgefragt, bevor eine Zeile Code geändert wurde —
// dieselbe Methode wie beim Preisdatenbank-Audit im August („echte Extraktion
// als Fixture"), weil ein ausgedachtes Beispiel genau die Eigenart verfehlt
// hätte, die den Fehler ausgelöst hat.
import { describe, it, expect } from 'vitest'
import { findePreisposition, anstrichzahlAusTitel, type PreisPosition } from '../preis-matcher'

const p = (id: string, title: string, unit_price: number, category = 'Maler – Anstrich Innen'): PreisPosition =>
  ({ id, title, category, unit: 'm²', unit_price })

const KATALOG: PreisPosition[] = [
  p('1', 'Decke streichen 1x Anstrich', 7.00),
  p('2', 'Decke streichen 2x Anstrich', 11.00),
  p('3', 'Decke streichen 3x Anstrich', 15.00),
  p('4', 'Dachschrägen streichen 1x', 7.50),
  p('5', 'Dachschrägen streichen 2x', 11.50),
  p('6', 'Kniestockwände streichen 1x', 7.50),
  p('7', 'Kniestockwände streichen 2x', 11.50),
  p('8', 'Wand mit Latexfarbe streichen 2x', 13.00),
  p('9', 'Wand mit Silikatfarbe streichen 2x', 14.00),
  p('10', 'Wand streichen 1x Anstrich', 6.00),
  p('11', 'Wand streichen 2x Anstrich', 9.50),
  p('12', 'Wand streichen 3x Anstrich (Vollton / Dunkelfarbe)', 13.00),
]

const preisFuer = (titel: string) => findePreisposition(titel, 'm²', KATALOG)?.position.unit_price ?? null

describe('TN-093 — die Anstrichzahl hinter dem Gedankenstrich ging verloren', () => {
  // Im Angebot stand „Deckenfläche streichen — 2× Anstrich — 7,00 €".
  // 7,00 € ist der 1x-Preis. Ursache: Der Titel wurde am „ — " abgeschnitten
  // (dort steht normalerweise der Raum), damit fiel die Anstrichzahl weg,
  // und unter 1x/2x/3x gewann der alphabetisch erste.
  it('„Deckenfläche streichen — 2× Anstrich" bekommt den 2x-Preis', () => {
    expect(preisFuer('Deckenfläche streichen — 2× Anstrich')).toBe(11.00)
  })

  it('auch mit dem Raum dazwischen', () => {
    expect(preisFuer('Deckenfläche streichen — 2× Anstrich — Wohnzimmer')).toBe(11.00)
  })

  it('liest die Anstrichzahl unabhängig von ihrer Stelle im Titel', () => {
    expect(anstrichzahlAusTitel('Deckenfläche streichen — 2× Anstrich')).toBe('2')
    expect(anstrichzahlAusTitel('Wandflächen streichen 2x — Wohnzimmer')).toBe('2')
    expect(anstrichzahlAusTitel('Wände zweifach streichen')).toBe('2')
    expect(anstrichzahlAusTitel('Decke streichen')).toBeUndefined()
  })
})

describe('TN-094 — „Kniestockwände" schlug „Wand"', () => {
  // Manfred: „Fischer 9,50 €, Krüger 11,50 €. Gleicher Betrieb, gleiche
  // Position, zwei Preise. Preise werden irgendwo ausgewürfelt."
  // Es war kein Zufall: „kniestockflaeche streichen 2x" enthielt den
  // gesuchten Text „flaeche streichen 2x" mitten im Wort und bekam dieselben
  // 0,94 wie der richtige Eintrag — bei Gleichstand gewann K vor W.
  it('Wandflächen 2x bekommt den Wand-Preis, nicht den Kniestock-Preis', () => {
    expect(preisFuer('Wandflächen streichen 2x — Wohnzimmer')).toBe(9.50)
    expect(preisFuer('Wandfläche streichen 2x — Wohnzimmer')).toBe(9.50)
  })

  it('dasselbe bei 1x', () => {
    expect(preisFuer('Wandflächen streichen 1x — Flur')).toBe(6.00)
  })

  it('beide Angebote bekommen denselben Preis — kein Würfeln mehr', () => {
    expect(preisFuer('Wandflächen streichen 2x — Wohnzimmer'))
      .toBe(preisFuer('Wandflächen streichen 2x — Küche'))
  })

  it('der Kniestock findet weiterhin seinen eigenen Preis', () => {
    expect(preisFuer('Kniestockwände streichen 2x — Dachgeschoss')).toBe(11.50)
    expect(preisFuer('Dachschrägen streichen 2x — Dachgeschoss')).toBe(11.50)
  })
})

describe('Die alte Regel 1 gilt unverändert — nur greift sie jetzt auch', () => {
  it('ein 2x-Auftrag bekommt nie einen 1x-Preis', () => {
    const nur1x = [p('1', 'Wand streichen 1x Anstrich', 6.00)]
    expect(findePreisposition('Wandflächen streichen 2x — Flur', 'm²', nur1x)).toBeNull()
  })

  it('… auch wenn die Anstrichzahl hinter dem Gedankenstrich steht', () => {
    const nur1x = [p('1', 'Decke streichen 1x Anstrich', 7.00)]
    expect(findePreisposition('Deckenfläche streichen — 2× Anstrich', 'm²', nur1x)).toBeNull()
  })
})

describe('Zusammensetzungen bleiben gültige Treffer (PM-018-Regel)', () => {
  // „feinspachteln" enthält „spachteln" mitten im Wort und meint dieselbe
  // Arbeit. Ein Mitten-im-Wort-Treffer ist deshalb nicht falsch, nur
  // schwächer als einer an der Wortgrenze.
  it('„Spachtelarbeiten" findet „Fläche feinspachteln"', () => {
    const katalog = [p('1', 'Fläche feinspachteln (Q3, streichfertig)', 14.00, 'Maler – Untergrundvorbereitung')]
    expect(findePreisposition('Spachtelarbeiten Q3 — Arbeitszimmer', 'm²', katalog)?.position.unit_price).toBe(14.00)
  })

  it('aber der Treffer an der Wortgrenze gewinnt gegen den im Wortinneren', () => {
    const katalog = [
      p('1', 'Kniestockwände streichen 2x', 11.50),
      p('2', 'Wand streichen 2x Anstrich', 9.50),
    ]
    const t = findePreisposition('Wandflächen streichen 2x — Wohnzimmer', 'm²', katalog)
    expect(t?.position.title).toBe('Wand streichen 2x Anstrich')
  })
})
