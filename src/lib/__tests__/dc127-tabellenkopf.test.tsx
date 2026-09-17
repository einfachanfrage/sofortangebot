// DC-127 (Product Designer, 17.09.2026) — Vorschau und Papier zeigen
// denselben Tabellenkopf.
//
// Der Befund des Chief of Staff: die zwei Vorschauen malten über die
// Spaltentitel einen dunklen Balken (#2C2C2C bzw. `bg-anthracite`, weiße
// Fettschrift), das fertige PDF druckt an derselben Stelle kleine graue
// Versalien über einer dünnen Linie. Zwei Darstellungen desselben Dings.
//
// Die Auflage lautete: nur EINE der beiden Seiten ändern. Geändert wurden die
// Vorschauen, denn das Papier ist das, was der Kunde in die Hand bekommt —
// eine Vorschau, die anders aussieht als ihr Gegenstand, ist keine.
//
// Diese Datei hält drei Dinge fest, damit der Balken nicht zurückkommt:
//   1. Der Kopf der Dokument-Vorschau trägt keine dunkle Fläche mehr.
//   2. Er trägt die Wörter des Papiers, nicht eigene Abkürzungen.
//   3. Der Kopf des PDFs ist unverändert — die geänderte Seite ist die andere.
import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AngebotVorschau from '@/components/AngebotVorschau'
import type { Company, Quote, QuoteItem } from '@/lib/types'

function firma(): Company {
  return {
    id: 'x', user_id: 'x', name: 'Holm GmbH', address: 'Musterstr. 1\n12345 Berlin',
    phone: null, contact_email: null, website: null, tax_number: null, iban: null,
    logo_url: null, signature_url: null,
    vat_rate: 19, payment_days: 14, language: 'de',
    accounting_software: 'none', abrechnungs_modus: 'inapp', angebot_struktur: 'raeume',
    widerruf_aktiv: false, widerruf_text: null, gewerke: ['maler'],
    created_at: new Date().toISOString(),
    angebot_gueltig_tage: 30, onboarding_completed: true,
  } as Company
}

function angebot(): Quote & { items: QuoteItem[] } {
  const item: QuoteItem = {
    id: 'i1', quote_id: 'q1', position: 1, title: 'Wandfläche streichen 2x — Wohnzimmer',
    description: null, quantity: 40, unit: 'm²', unit_price: 12.5, total_price: 500,
    vob_norm: null, din_normen: null,
  } as QuoteItem
  return {
    id: 'q1', company_id: 'x', customer_id: null, status: 'draft',
    created_at: new Date().toISOString(), valid_until: null,
    total_net: 500, total_vat: 95, total_gross: 595, notes: null,
    signed_at: null, signed_by: null, angebotsnummer: 'AG-2026-004',
    briefpapier_id: null, revision: 1, original_id: null, items: [item],
  } as Quote & { items: QuoteItem[] }
}

function markup() {
  return renderToStaticMarkup(createElement(AngebotVorschau, {
    quote: angebot(), company: firma(), quoteNumber: 'AG-2026-004', briefpapier: null,
  }))
}

const quelle = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')

describe('DC-127 — die Dokument-Vorschau zeigt den Kopf des Papiers', () => {
  it('kein dunkler Balken mehr über den Spaltentiteln', () => {
    const html = markup()
    const kopf = html.slice(html.indexOf('Bezeichnung') - 400, html.indexOf('Bezeichnung'))
    expect(kopf).not.toContain('bg-anthracite')
    expect(kopf).not.toContain('text-white')
  })

  it('die Spaltentitel heißen wie auf dem Papier, nicht abgekürzt', () => {
    const html = markup()
    for (const wort of ['Pos', 'Bezeichnung', 'Menge', 'Einheit', 'Einzelpreis', 'Gesamtpreis']) {
      expect(html).toContain(`>${wort}</span>`)
    }
    // Die alten Abkürzungen kennt das Dokument nicht.
    expect(html).not.toContain('>Einh.</span>')
    expect(html).not.toContain('>Einzelpr.</span>')
  })

  it('der Kopf ist kleiner als die Zeilen darunter — wie im PDF (7 zu 9)', () => {
    // Genau das schafft den Platz für die ausgeschriebenen Wörter in
    // denselben Spaltenbreiten. Fällt das weg, passen sie nicht mehr.
    const html = markup()
    const kopf = html.slice(html.indexOf('Bezeichnung') - 400, html.indexOf('Bezeichnung'))
    expect(kopf).toContain('text-[7px]')
    expect(kopf).toContain('uppercase')
    expect(kopf).toContain('border-b')
  })
})

describe('DC-127 — die andere Seite bleibt, wie sie ist', () => {
  it('der Tabellenkopf im PDF ist weiter grau über einer dünnen Linie', () => {
    const pdf = quelle('src/lib/pdf.tsx')
    const block = pdf.slice(pdf.indexOf('tableHeader: {'), pdf.indexOf('tableRow: {'))
    expect(block).toContain("borderBottom: '1 solid #AAAAAA'")
    expect(block).toContain("color: '#999999'")
    expect(block).toContain("textTransform: 'uppercase'")
    // Keine Füllfläche: react-pdf würde sie als backgroundColor schreiben.
    expect(block).not.toContain('backgroundColor')
  })

  it('die Briefpapier-Kachel hat den Balken ebenfalls verloren', () => {
    const kachel = quelle('src/app/(app)/einstellungen/briefpapier/[id]/page.tsx')
    expect(kachel).not.toContain("background: '#2C2C2C'")
  })
})
