import { describe, expect, it } from 'vitest'
import { DEFAULT_PRICES } from '../default-prices'

const maler = DEFAULT_PRICES.filter(position => position.category.startsWith('Maler – '))
const tapezieren = maler.filter(position => position.category === 'Maler – Tapezieren')

describe('Maler-Standardpreiskatalog', () => {
  // CoS-018 (2026-08-24): Die Zahl war seit dem Preisdatenbank-Audit vom
  // 20.08. (Commit e06b7f5) veraltet — 164 → 208, also exakt die dort
  // bewusst ergänzten 44 Maler-Positionen. Über die Commit-Historie
  // nachgezählt, keine Dopplung (der Dopplungs-Test unten war die ganze Zeit
  // grün). Die Zahl bleibt bewusst hart, damit ein versehentliches Löschen
  // halber Rubriken auffällt — beim nächsten bewussten Katalog-Ausbau hier
  // mit anpassen.
  it('enthält den vollständigen kuratierten Maler-Katalog', () => {
    // 07.09.2026 (PM-037-A): 217 → 220. Drei Leibungs-Einträge ergänzt
    // (Fenster innen, Türen, Fenster außen), je 45,00 €/m². Vorher fand die
    // Engine für „Fenster Innenleibungen streichen" keinen Preis und schrieb
    // auf jedes Angebot mit mitgestrichenen Leibungen eine 0,00-€-Zeile.
    // PD-010 (15.09.2026): 220 → 216. Für EINE Innentür führte der Katalog
    // fünf Zeilen in zwei Rubriken, für die Zarge drei. Vier sind entfallen,
    // eine wurde umbenannt — Entscheidung des Prüfmeisters: eine Arbeit, eine
    // Zeile, und sie steht in den Lackierarbeiten. Die entfallenen lagen in
    // „Anstrich Innen" und waren die billigeren; ein Betrieb ohne
    // Lackier-Haken bekam seine Türen dadurch 15 € zu günstig bepreist.
    expect(maler).toHaveLength(216)
    expect(tapezieren).toHaveLength(22)
  })

  it('enthält keine doppelten Kombinationen aus Bezeichnung und Einheit', () => {
    const keys = maler.map(position =>
      `${position.title.toLocaleLowerCase('de-DE')}::${position.unit.toLocaleLowerCase('de-DE')}`,
    )

    expect(new Set(keys).size).toBe(keys.length)
  })

  it.each([
    'Raufaser tapezieren ohne Anstrich',
    'Vliestapete tapezieren',
    'Papiertapete tapezieren',
    'Vinyltapete tapezieren',
    'Textiltapete tapezieren',
    'Naturwerkstofftapete / Grastapete tapezieren',
    'Metalltapete tapezieren',
    'Fototapete / Digitaldrucktapete tapezieren',
    'Mustertapete mit Rapport tapezieren',
    'Renoviervlies / Malervlies tapezieren',
    'Decke tapezieren (Aufpreis)',
    'Kleinfläche / einzelne Tapetenbahn tapezieren',
  ])('deckt die Tapezierleistung "%s" ab', title => {
    expect(tapezieren.some(position => position.title === title)).toBe(true)
  })

  it.each(['Spachtelung Q1', 'Spachtelung Q2', 'Spachtelung Q3', 'Spachtelung Q4'])(
    'führt die Qualitätsstufe "%s" als eigene Preisposition',
    title => {
      expect(maler.some(position => position.title === title)).toBe(true)
    },
  )
})
