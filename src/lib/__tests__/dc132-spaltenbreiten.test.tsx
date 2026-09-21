// DC-132 (Product Designer, 21.09.2026) — die Vorschau ist ein Maßstabsmodell
// des Blattes, nicht ein eigenes Blatt in Panelbreite.
//
// Herkunft: DC-127 hat den Tabellenkopf der Vorschau auf den des Papiers
// gebracht, die Spaltenbreiten aber ausdrücklich liegen gelassen — „ein
// eigener Befund, gehört in ein eigenes Ticket". Der Grund, warum sie nicht
// zusammenpassten, lag nicht an den Prozenten: die Vorschau lief in
// Panelbreite (bei 375 px Gerätebreite rund 477 px Seitenbreite) und trug
// dabei die Schriftgrößen des Papiers (7/9/10) unverändert. Auf 78 % Breite
// mit 100 % Typografie können die Prozente des Papiers nicht aufgehen —
// gemessen lief „GESAMTPREIS" schon bei 375 px über seine Spalte hinaus.
//
// Diese Datei hält drei Dinge fest:
//   1. Das Blatt ist so breit wie das Blatt (595 = A4 in pt).
//   2. Die sechs Spaltenbreiten der Vorschau sind die aus lib/pdf.tsx —
//      gelesen, nicht abgeschrieben, damit sie nicht wieder auseinanderlaufen.
//   3. Die feste 133 % / 0,75-Annahme im Rahmen ist weg.
import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AngebotVorschau from '@/components/AngebotVorschau'
import { LOGO_PT_ZU_PX, LOGO_HOEHE_PT, logoKopfVorschau } from '@/lib/briefpapier-logo'
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

/** Liest die sechs Spaltenbreiten aus lib/pdf.tsx — der Quelle, nicht aus dem Kopf. */
function breitenAusPdf(): string[] {
  const pdf = quelle('src/lib/pdf.tsx')
  return ['cPos', 'cBez', 'cMenge', 'cEinh', 'cEinzel', 'cGes'].map(name => {
    const treffer = pdf.match(new RegExp(`${name}:\\s*\\{[^}]*width:\\s*'(\\d+)%'`))
    expect(treffer, `Spaltenbreite ${name} nicht in lib/pdf.tsx gefunden`).toBeTruthy()
    return treffer![1] + '%'
  })
}

describe('DC-132 — die Vorschau ist ein Maßstabsmodell des Blattes', () => {
  it('das Blatt ist 595 breit — A4 in pt, damit 1 px = 1 pt gilt', () => {
    expect(markup()).toContain('width:595px')
  })

  it('die sechs Spaltenbreiten sind die aus lib/pdf.tsx', () => {
    const html = markup()
    // Kopfzeile: dieselbe Reihenfolge wie im PDF.
    const kopf = html.slice(html.indexOf('>Pos</span>') - 200, html.indexOf('>Gesamtpreis</span>') + 40)
    const [pos, bez, menge, einh, einzel, ges] = breitenAusPdf()
    expect(kopf).toContain(`width:${pos}`)
    expect(kopf).toContain(`width:${bez}`)
    expect(kopf).toContain(`width:${menge}`)
    expect(kopf).toContain(`width:${einh}`)
    expect(kopf).toContain(`width:${einzel}`)
    expect(kopf).toContain(`width:${ges}`)
    // Und die Summe der sechs ist 100 % — sonst rutscht die Zeile.
    const summe = [pos, bez, menge, einh, einzel, ges].reduce((a, b) => a + parseInt(b, 10), 0)
    expect(summe).toBe(100)
  })

  it('die Positionszeile trägt dieselben Breiten wie der Kopf', () => {
    // Sonst steht der Spaltentitel nicht über seiner Spalte — der Fehler,
    // den man erst auf dem fertigen Angebot sieht.
    const src = quelle('src/components/AngebotVorschau.tsx')
    for (const b of breitenAusPdf()) {
      // je einmal in der Zeile und einmal im Kopf
      const treffer = src.split(`width: '${b}'`).length - 1
      expect(treffer, `Breite ${b} kommt ${treffer}× vor, erwartet mindestens 2×`).toBeGreaterThanOrEqual(2)
    }
  })

  it('die alten Breiten der Vorschau sind weg', () => {
    const src = quelle('src/components/AngebotVorschau.tsx')
    for (const alt of ["width: '6%'", "width: '40%'", "width: '12%'", "width: '10%'", "width: '16%'"]) {
      expect(src).not.toContain(alt)
    }
  })

  it('auf einem maßstäblichen Blatt ist 1 pt = 1 px — auch für das Logo', () => {
    // Die Folge aus der Blattbreite, nicht eine zweite Entscheidung:
    // solange die Vorschau kein A4 war, brauchte das Logo einen erfundenen
    // pt→px-Faktor (DC-121/DC-123: 48 px für 42 pt). Jetzt gibt es den
    // richtigen, und er ist 1.
    expect(LOGO_PT_ZU_PX).toBe(1)
    expect(logoKopfVorschau(null).hoehePx).toBe(LOGO_HOEHE_PT.mittel)
  })

  it('der Rahmen rät den Maßstab nicht mehr (kein 133 % / 0,75 mehr)', () => {
    const rahmen = quelle('src/components/VorschauUndVersand.tsx')
    // Geprüft wird der Code, nicht das Wort: die Begründung oben in der
    // Datei nennt den alten Maßstab absichtlich beim Namen.
    expect(rahmen).not.toContain("transform: 'scale(")
    expect(rahmen).not.toContain("width: '133%'")
    expect(rahmen).toContain('BLATT_BREITE = 595')
  })
})

describe('DC-132 — die andere Seite bleibt, wie sie ist', () => {
  it('lib/pdf.tsx ist nicht angefasst: die Breiten stehen dort unverändert', () => {
    expect(breitenAusPdf()).toEqual(['5%', '44%', '9%', '14%', '14%', '14%'])
  })
})
