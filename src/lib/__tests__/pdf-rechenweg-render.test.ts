// DC-049 "PDF-Schritt" (2026-09-10): Rechenweg war im Kundenangebot bisher
// komplett unsichtbar — CI-Handbuch: "nie versteckt, nie eingeklappt...
// Beweisstück, nicht Feature-Liste". Prüft, dass er jetzt unter jeder
// Position steht — in BEIDEN Renderpfaden (flach und nach Räumen
// gruppiert) — und dass Positionen ohne echten Rechenweg den in
// AngebotDetail.tsx (Schritt c) etablierten "Pauschale"-Fallback zeigen.
import { describe, it, expect } from 'vitest'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { PDFParse } from 'pdf-parse'
import { AngebotPDF } from '@/lib/pdf'
import type { Quote, QuoteItem, Company } from '@/lib/types'

const BERECHNUNGSWEG = '46,64 m² × 12,50 €/m² = 583,00 €'
const ANNAHME = 'Höhe geschätzt anhand Foto, nicht gemessen'

function firma(struktur: 'raeume' | 'gewerk'): Company {
  return {
    id: 'x', user_id: 'x', name: 'Test GmbH', address: 'Musterstr. 1\n12345 Berlin',
    phone: null, contact_email: null, website: null, tax_number: null, iban: null,
    logo_url: null, signature_url: null, vat_rate: 19, payment_days: 14, language: 'de',
    accounting_software: 'none', abrechnungs_modus: 'inapp', angebot_struktur: struktur,
    widerruf_aktiv: false, widerruf_text: null, gewerke: ['maler'], created_at: new Date().toISOString(),
    lexware_api_key: null, lexoffice_api_key: null, sevdesk_api_key: null, fastbill_api_key: null,
    fastbill_email: null, billomat_api_key: null, billomat_subdomain: null, papierkram_api_key: null,
    easybill_api_key: null, ust_id: null, agb_url: null, plan: null, reminder_days: null,
    regionaler_preisfaktor_prozent: 0, angebot_gueltig_tage: 30, materialpreis_hinweis_aktiv: false,
    mindestauftragswert: 0, e_rechnung_aktiv: false, onboarding_completed: true, onboarding_step: 8,
    kleinmaterial_config: null, anfahrt_config: null,
  } as Company
}

function angebot(mitBerechnungsweg: boolean): Quote & { items: QuoteItem[] } {
  const itemMitRechenweg: QuoteItem = {
    id: 'i1', quote_id: 'q1', position: 1, title: 'Wandfläche streichen 2x — Wohnzimmer',
    description: null, quantity: 46.64, unit: 'm²', unit_price: 12.5, total_price: 583,
    vob_norm: null, din_normen: null,
    ...(mitBerechnungsweg ? { berechnungsweg: BERECHNUNGSWEG, annahmen: [ANNAHME] } : {}),
  }
  const itemPauschale: QuoteItem = {
    id: 'i2', quote_id: 'q1', position: 2, title: 'Anfahrt',
    description: null, quantity: 1, unit: 'psch.', unit_price: 45, total_price: 45,
    vob_norm: null, din_normen: null,
  }
  return {
    id: 'q1', company_id: 'x', customer_id: null, status: 'draft', created_at: new Date().toISOString(),
    valid_until: null, total_net: 628, total_vat: 119.32, total_gross: 747.32, notes: null,
    signed_at: null, signed_by: null, angebotsnummer: 'A-1', briefpapier_id: null,
    revision: 1, original_id: null, items: [itemMitRechenweg, itemPauschale],
  } as Quote & { items: QuoteItem[] }
}

async function text(quote: Quote & { items: QuoteItem[] }, struktur: 'raeume' | 'gewerk') {
  // @ts-expect-error react-pdf typing
  const buf: Buffer = await renderToBuffer(createElement(AngebotPDF, {
    quote, company: firma(struktur), quoteNumber: 'A-1',
  }))
  const parser = new PDFParse({ data: buf })
  const result = await parser.getText()
  await parser.destroy()
  return result.text
}

describe('PDF-Render: Rechenweg (DC-049 Schritt "PDF")', () => {
  it('Berechnungsweg und Annahme stehen unter der Position (Raum-Gruppierung)', async () => {
    const roh = await text(angebot(true), 'raeume')
    expect(roh).toContain(BERECHNUNGSWEG)
    expect(roh).toContain(ANNAHME)
  }, 30000)

  it('Berechnungsweg steht auch im zweiten Renderpfad (Gewerk-Gruppierung)', async () => {
    const roh = await text(angebot(true), 'gewerk')
    expect(roh).toContain(BERECHNUNGSWEG)
  }, 30000)

  it('zeigt "Pauschale", wenn eine Position keinen Berechnungsweg hat', async () => {
    const roh = await text(angebot(false), 'raeume')
    expect(roh).toContain('Pauschale')
  }, 30000)

  it('zeigt "Pauschale" auch für die Anfahrt-Position ohne echten Rechenweg', async () => {
    const roh = await text(angebot(true), 'raeume')
    // Position 1 hat einen echten Rechenweg, Position 2 (Anfahrt) nicht —
    // "Pauschale" muss trotzdem einmal für Position 2 erscheinen.
    expect(roh).toContain('Pauschale')
  }, 30000)
})
