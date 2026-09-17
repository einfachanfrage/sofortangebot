// DC-125 (Product Designer, 17.09.2026) — Die Nullzeile als Produktregel.
//
// Entscheidung des Chief of Staff (17.09., 11:32 UTC): „Eine Zeile ohne
// Betrag darf ein Kundenangebot nicht verlassen." Die Ursache — dass sechs
// von neun Positionen eines gewöhnlichen Badangebots keinen Preis finden —
// liegt bei Engineering (PM-117 / CoS-E-078). Diese Datei hält das Netz
// darunter fest: Auch wenn die nächste Katalog-Lücke kommt, darf sie nicht
// wieder als „0,00 €" beim Kunden landen.
//
// Drei Zusicherungen, und die dritte ist die, auf die es ankommt:
//
//   1. Die Bedingung ist dieselbe wie im Versand-Wächter — ein Preis fehlt
//      genau dann, wenn kein Katalogeintrag hängt UND 0,00 € dasteht. Eine
//      bewusste 0-€-Kulanzleistung hängt an einem echten Preiseintrag und
//      bleibt unberührt. Das ist die Grenze der Regel.
//   2. Keine Betragsspalte zeigt für so eine Zeile eine Zahl.
//   3. Auf dem Kundenpapier steht dann GAR KEINE Summe — nicht die falsche,
//      nicht die halbe. Der Prüfmeister in PD-022: „Eine Liste mit sechs
//      Nullen und einer Summe, die offensichtlich falsch ist, ist schlimmer
//      als gar keine Summe."
//
// Was hier ausdrücklich NICHT geprüft wird, weil es ausdrücklich nicht
// passiert: dass die unbepreiste Zeile verschwindet. Sie bleibt stehen —
// sonst führte der Handwerker Arbeit aus, die er nie berechnet hat (dieselbe
// Begründung wie in versandbereit.ts und in DC-113).
import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import AngebotVorschau from '@/components/AngebotVorschau'
import {
  preisFehlt, unbepreistePositionen, idsOhnePreis,
  fehlendePreiseSatz, PREIS_FEHLT_KURZ, versandHindernisse,
} from '@/lib/versandbereit'
import type { Company, Quote, QuoteItem } from '@/lib/types'
import { AKZENT_VORGABE } from '@/lib/briefpapier-farbe'

// ── Die Regel selbst ──────────────────────────────────────────────────────

describe('DC-125 — wann ein Preis fehlt', () => {
  it('kein Katalogeintrag und 0,00 € — das ist die Lücke', () => {
    expect(preisFehlt({ title: 'Wand spachteln', unit_price: 0, price_item_id: null })).toBe(true)
    expect(preisFehlt({ title: 'Wand spachteln', unit_price: 0 })).toBe(true)
  })

  it('eine bewusste 0-€-Leistung bleibt unberührt — sie hängt an einem Katalogeintrag', () => {
    // „Mache ich mit" ist eine Entscheidung des Handwerkers, kein Loch.
    expect(preisFehlt({ title: 'Boden schützen', unit_price: 0, price_item_id: 'pi-7' })).toBe(false)
  })

  it('eine bepreiste Position ist nie betroffen', () => {
    expect(preisFehlt({ title: 'Fliesen', unit_price: 48.5, price_item_id: null })).toBe(false)
  })

  it('dieselbe Bedingung wie der Versand-Wächter — eine Quelle, nicht zwei', () => {
    const items = [
      { id: 'a', title: 'A', unit_price: 0, price_item_id: null },
      { id: 'b', title: 'B', unit_price: 12, price_item_id: null },
      { id: 'c', title: 'C', unit_price: 0, price_item_id: 'pi-1' },
    ]
    expect(unbepreistePositionen(items).map(i => i.id)).toEqual(['a'])
    expect([...idsOhnePreis(items)]).toEqual(['a'])
    // Und der Satz, der das Senden sperrt, spricht über dieselbe Zeile.
    expect(versandHindernisse({ hatKunden: true, items })).toEqual([
      'Bei „A" fehlt noch der Preis.',
    ])
  })
})

describe('DC-125 — der Satz, der die Summe ersetzt', () => {
  it('nennt die Zahl, damit der Handwerker den Umfang sieht', () => {
    expect(fehlendePreiseSatz(6, 9)).toBe('Bei 6 von 9 Positionen fehlt noch der Preis.')
  })
  it('eine einzelne Zeile bekommt keinen Zahlensalat', () => {
    expect(fehlendePreiseSatz(1, 9)).toBe('Bei einer Position fehlt noch der Preis.')
  })
  it('wenn gar nichts bepreist ist, steht das auch so da', () => {
    expect(fehlendePreiseSatz(9, 9)).toBe('Bei allen 9 Positionen fehlt noch der Preis.')
  })
  it('ohne Lücke gibt es nichts zu sagen', () => {
    expect(fehlendePreiseSatz(0, 9)).toBe('')
  })
})

// ── Das Kundenpapier ──────────────────────────────────────────────────────

function firma(over: Partial<Company> = {}): Company {
  return {
    id: 'x', user_id: 'x', name: 'Holm GmbH', address: 'Musterstr. 1\n12345 Berlin',
    phone: null, contact_email: null, website: null, tax_number: null, iban: null,
    logo_url: null, signature_url: null,
    vat_rate: 19, payment_days: 14, language: 'de',
    accounting_software: 'none', abrechnungs_modus: 'inapp', angebot_struktur: 'raeume',
    widerruf_aktiv: false, widerruf_text: null, gewerke: ['maler'],
    created_at: new Date().toISOString(),
    angebot_gueltig_tage: 30, onboarding_completed: true,
    ...over,
  } as Company
}

function pos(over: Partial<QuoteItem>): QuoteItem {
  return {
    id: 'i', quote_id: 'q1', position: 1, title: 'Position',
    description: null, quantity: 1, unit: 'm²', unit_price: 0, total_price: 0,
    price_item_id: null, vob_norm: null, din_normen: null,
    ...over,
  } as QuoteItem
}

function angebot(items: QuoteItem[]): Quote & { items: QuoteItem[] } {
  const netto = Math.round(items.reduce((s, i) => s + i.total_price, 0) * 100) / 100
  return {
    id: 'q1', company_id: 'x', customer_id: null, status: 'draft',
    created_at: new Date().toISOString(), valid_until: null,
    total_net: netto, total_vat: Math.round(netto * 19) / 100,
    total_gross: Math.round(netto * 119) / 100,
    notes: null, signed_at: null, signed_by: null, angebotsnummer: 'AG-2026-004',
    briefpapier_id: null, revision: 1, original_id: null, items,
  } as Quote & { items: QuoteItem[] }
}

/**
 * Das Badangebot aus PM-117, so wie der Prüfmeister es gemessen hat: neun
 * Positionen, sechs davon ohne Preis, Summe 543,84 € statt 2.980,44 €.
 */
const BAD = [
  pos({ id: '1', position: 1, title: 'Fliesenspiegel abschlagen — Bad', quantity: 12, unit: 'm²', unit_price: 0, total_price: 0 }),
  pos({ id: '2', position: 2, title: 'Wandfläche spachteln — Bad', quantity: 28.4, unit: 'm²', unit_price: 0, total_price: 0 }),
  pos({ id: '3', position: 3, title: 'Wandfläche grundieren — Bad', quantity: 28.4, unit: 'm²', unit_price: 0, total_price: 0 }),
  pos({ id: '4', position: 4, title: 'Wandfläche streichen 2x — Bad', quantity: 28.4, unit: 'm²', unit_price: 0, total_price: 0 }),
  pos({ id: '5', position: 5, title: 'Decke streichen 2x — Bad', quantity: 6.2, unit: 'm²', unit_price: 9.5, total_price: 58.9, price_item_id: 'pi-decke' }),
  pos({ id: '6', position: 6, title: 'Heizkörper lackieren — Bad', quantity: 1, unit: 'Stück', unit_price: 0, total_price: 0 }),
  pos({ id: '7', position: 7, title: 'Silikonfugen erneuern — Bad', quantity: 14, unit: 'lfdm', unit_price: 0, total_price: 0 }),
  pos({ id: '8', position: 8, title: 'An- und Abfahrt', quantity: 1, unit: 'Pauschale', unit_price: 45, total_price: 45, price_item_id: 'pi-fahrt' }),
  pos({ id: '9', position: 9, title: 'Kleinmaterial und Verbrauchsmaterial', quantity: 1, unit: 'Pauschale', unit_price: 439.94, total_price: 439.94, price_item_id: 'pi-klein' }),
]

const VOLLSTAENDIG = BAD.map(i =>
  preisFehlt(i) ? pos({ ...i, unit_price: 12, total_price: Math.round(i.quantity * 12 * 100) / 100, price_item_id: 'pi-x' }) : i,
)

function markup(items: QuoteItem[]) {
  return renderToStaticMarkup(createElement(AngebotVorschau, {
    quote: angebot(items), company: firma(), quoteNumber: 'AG-2026-004',
  }))
}

const wieOft = (html: string, teil: string) => html.split(teil).length - 1

describe('DC-125 — das Badangebot aus PM-117 auf dem Kundenpapier', () => {
  it('keine einzige Position behauptet, sie koste 0,00 €', () => {
    // Das ist der ganze Punkt: „0,00 €" ist die Aussage, diese Arbeit sei
    // umsonst — genau die, die der Handwerker am Ende ausführen müsste.
    expect(markup(BAD)).not.toContain('0,00 &#x20AC;')
    expect(markup(BAD)).not.toContain('0,00 €')
  })

  it('stattdessen steht „fehlt" da — in beiden Betragsspalten jeder betroffenen Zeile', () => {
    // Sechs Zeilen × zwei Spalten (Einzelpreis, Gesamtpreis).
    expect(wieOft(markup(BAD), `>${PREIS_FEHLT_KURZ}<`)).toBe(12)
  })

  it('die sechs Zeilen bleiben im Angebot stehen — sie verschwinden nicht', () => {
    // Wegzulassen wäre schlimmer als die Nullzeile: der Handwerker führte
    // die Arbeit aus, ohne sie berechnet zu haben (versandbereit.ts).
    const html = markup(BAD)
    for (const t of ['Fliesenspiegel abschlagen', 'Wandfläche spachteln', 'Silikonfugen erneuern']) {
      expect(html).toContain(t)
    }
  })

  it('es steht KEINE Summe auf dem Blatt — auch keine Zwischensumme und keine Steuer', () => {
    const html = markup(BAD)
    expect(html).not.toContain('543,84')                 // die falsche Summe
    expect(html).not.toContain('>Nettobetrag<')
    expect(html).not.toContain('MwSt. 19%')
    expect(wieOft(html, '>Gesamtbetrag<')).toBe(0)
  })

  it('an ihrer Stelle steht, woran es liegt und wie viele Zeilen betroffen sind', () => {
    const html = markup(BAD)
    expect(html).toContain('Gesamtbetrag noch offen')
    expect(html).toContain(fehlendePreiseSatz(6, 9))
  })
})

describe('DC-125 — die Gegenproben', () => {
  it('ein vollständig bepreistes Angebot sieht aus wie immer', () => {
    const html = markup(VOLLSTAENDIG)
    expect(wieOft(html, `>${PREIS_FEHLT_KURZ}<`)).toBe(0)
    expect(html).toContain('>Gesamtbetrag<')
    expect(html).toContain('>Nettobetrag<')
    expect(html).not.toContain('Gesamtbetrag noch offen')
  })

  it('eine bewusste 0-€-Kulanzleistung druckt weiterhin 0,00 € — und die Summe bleibt', () => {
    // Die Grenze der Regel. „Boden schützen, mache ich mit" hängt an einem
    // echten Preiseintrag; das ist eine Entscheidung und keine Lücke.
    const mitKulanz = [
      ...VOLLSTAENDIG,
      pos({ id: '10', position: 10, title: 'Boden schützen — Bad', quantity: 1, unit: 'Pauschale', unit_price: 0, total_price: 0, price_item_id: 'pi-kulanz' }),
    ]
    const html = markup(mitKulanz)
    expect(html).toContain('0,00 €')
    expect(html).toContain('>Gesamtbetrag<')
    expect(wieOft(html, `>${PREIS_FEHLT_KURZ}<`)).toBe(0)
  })

  it('auf dem unvollständigen Blatt bleibt genau EINE Akzentlinie — die zweite gehörte zur Summe', () => {
    // DC-122 nagelt fest, dass ein fertiges Angebot genau zwei Linien in der
    // Akzentfarbe trägt: unter dem Briefkopf und über der Gesamtsumme. Gibt
    // es keine Gesamtsumme, gibt es auch die zweite Linie nicht — aber der
    // Abschluss-Block trägt sie an derselben Stelle wie im PDF, sonst liefe
    // die Vorschau wieder vom Papier weg (DC-049/DC-055).
    expect(wieOft(markup(VOLLSTAENDIG), AKZENT_VORGABE)).toBe(2)
    expect(wieOft(markup(BAD), AKZENT_VORGABE)).toBe(2)
  })

  it('eine einzige Lücke reicht schon — die Summe ist dann keine Summe mehr', () => {
    const eineLuecke = [...VOLLSTAENDIG.slice(0, 8), pos({ ...VOLLSTAENDIG[8], unit_price: 0, total_price: 0, price_item_id: null })]
    const html = markup(eineLuecke)
    expect(wieOft(html, '>Gesamtbetrag<')).toBe(0)
    expect(html).toContain(fehlendePreiseSatz(1, 9))
  })
})
