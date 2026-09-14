// Batch 1 der Manfred-Tickets (CoS-E-004…042, 11.09.2026) — alles, was auf
// dem Papier steht, das der KUNDE bekommt.
//
// Gemeinsamer Nenner der Tickets: Seit der Rechenweg aufs Kunden-PDF ging
// (DC-049/DC-050), rutschte mit ihm alles mit, was intern danebenstand.
// Diese Tests halten die Trennlinie fest:
//   * interne Notizen an den Handwerker → nie auf dem Kundenpapier
//   * der Übermessungs-Hinweis → muss dort stehen bleiben (Legal G5)
//   * Fristen → die, die es auf einem Angebot wirklich gibt
import { describe, it, expect } from 'vitest'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { PDFParse } from 'pdf-parse'
import { AngebotPDF } from '@/lib/pdf'
import { abzugsText } from '@/lib/mengen/gewerke/vob-uebermessung'
import { gueltigBis } from '@/lib/angebot-optionen'
import type { Quote, QuoteItem, Company } from '@/lib/types'

const INTERNE_ANNAHME = 'Zweifacher Anstrich als Standard angenommen — bitte prüfen'
const TRANSKRIPT_ANNAHME = 'Schwieriger/unebener Untergrund im Transkript erkannt'
const UEBERMESSUNG = '3 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen (4.29 m², VOB/C DIN 18363 Übermessung)'

function firma(overrides: Partial<Company> = {}): Company {
  return {
    id: 'x', user_id: 'x', name: 'Test GmbH', address: 'Musterstr. 1\n12345 Berlin',
    phone: null, contact_email: null, website: null, tax_number: null, iban: null,
    logo_url: null, signature_url: null, vat_rate: 19, payment_days: 14, language: 'de',
    accounting_software: 'none', abrechnungs_modus: 'inapp', angebot_struktur: 'raeume',
    widerruf_aktiv: false, widerruf_text: null, gewerke: ['maler'], created_at: new Date().toISOString(),
    lexware_api_key: null, lexoffice_api_key: null, sevdesk_api_key: null, fastbill_api_key: null,
    fastbill_email: null, billomat_api_key: null, billomat_subdomain: null, papierkram_api_key: null,
    easybill_api_key: null, ust_id: null, agb_url: null, plan: null, reminder_days: null,
    regionaler_preisfaktor_prozent: 0, angebot_gueltig_tage: 30, materialpreis_hinweis_aktiv: false,
    mindestauftragswert: 0, e_rechnung_aktiv: false, onboarding_completed: true, onboarding_step: 8,
    kleinmaterial_config: null, anfahrt_config: null,
    ...overrides,
  } as Company
}

function angebot(overrides: Partial<Quote> = {}): Quote & { items: QuoteItem[] } {
  const item: QuoteItem = {
    id: 'i1', quote_id: 'q1', position: 1, title: 'Wandfläche streichen 2x — Wohnzimmer',
    description: null, quantity: 46.64, unit: 'm²', unit_price: 12.5, total_price: 583,
    vob_norm: null, din_normen: null,
    berechnungsweg: 'Umfang 20 lfm × 2.5 m = 50 m²',
    annahmen: [INTERNE_ANNAHME, TRANSKRIPT_ANNAHME, UEBERMESSUNG],
  } as QuoteItem
  return {
    id: 'q1', company_id: 'x', customer_id: null, status: 'draft',
    created_at: '2026-09-11T10:00:00.000Z',
    valid_until: null, total_net: 583, total_vat: 110.77, total_gross: 693.77, notes: null,
    signed_at: null, signed_by: null, angebotsnummer: 'A-1', briefpapier_id: null,
    revision: 1, original_id: null, items: [item],
    ...overrides,
  } as Quote & { items: QuoteItem[] }
}

async function pdfText(quote: Quote & { items: QuoteItem[] }, company = firma()) {
  // @ts-expect-error react-pdf typing
  const buf: Buffer = await renderToBuffer(createElement(AngebotPDF, {
    quote, company, quoteNumber: 'A-1',
  }))
  const parser = new PDFParse({ data: buf })
  const result = await parser.getText()
  await parser.destroy()
  // react-pdf bricht Zeilen um — für "steht der Satz drauf?" reicht der
  // Text ohne Zeilenumbrüche und Mehrfach-Leerzeichen.
  return result.text.replace(/\s+/g, ' ')
}

describe('CoS-E-005/009 — interne Notizen gehören nicht aufs Kundenpapier', () => {
  it('weder "bitte prüfen" noch "Transkript" stehen auf dem PDF', async () => {
    const roh = await pdfText(angebot())
    expect(roh).not.toContain('bitte prüfen')
    expect(roh).not.toContain('Transkript')
  }, 30000)

  it('der Rechenweg selbst bleibt — er ist das Beweisstück für den Kunden', async () => {
    const roh = await pdfText(angebot())
    expect(roh).toContain('Umfang 20 lfm')
  }, 30000)

  it('der Übermessungs-Hinweis überlebt (VOB-004/Legal G5)', async () => {
    const roh = await pdfText(angebot())
    expect(roh).toContain('nicht abgezogen')
    expect(roh).toContain('Aufmaß in Anlehnung an VOB/C')
  }, 30000)
})

describe('CoS-E-006/013/031/042 — Fristen auf dem Angebot', () => {
  it('"Gültig bis" steht auf dem PDF, auch ohne gespeichertes valid_until', async () => {
    const roh = await pdfText(angebot())
    // Der Kopfblock setzt seine Beschriftungen in Versalien (textTransform).
    expect(roh.toLowerCase()).toContain('gültig bis')
    // 11.09.2026 + 30 Tage = 11.10.2026
    expect(roh).toContain('11.10.2026')
  }, 30000)

  it('die eingestellte Gültigkeitsdauer schlägt durch (14 statt 30 Tage)', async () => {
    const roh = await pdfText(angebot(), firma({ angebot_gueltig_tage: 14 }))
    expect(roh).toContain('25.09.2026')
  }, 30000)

  it('ein ausdrücklich gesetztes Datum gewinnt gegen die Rechnung', async () => {
    const roh = await pdfText(angebot({ valid_until: '2026-12-24' }))
    expect(roh).toContain('24.12.2026')
  }, 30000)

  it('kein "Zahlungsziel" mehr im Kopfblock — das ist Rechnungssprache', async () => {
    const roh = await pdfText(angebot())
    expect(roh).not.toContain('Zahlungsziel:')
    // Die Zahlungsbedingungen bleiben, aber als Bedingung im Text.
    expect(roh).toContain('Zahlungsbedingungen: 14 Tage nach Rechnungserhalt')
  }, 30000)
})

describe('gueltigBis() — die Rechnung dahinter', () => {
  it('rechnet Dokumentdatum + eingestellte Tage', () => {
    expect(gueltigBis({ valid_until: null, created_at: '2026-09-11T10:00:00Z' }, 30)).toBe('2026-10-11')
  })
  it('nimmt das gespeicherte Datum, wenn es eins gibt', () => {
    expect(gueltigBis({ valid_until: '2026-12-24', created_at: '2026-09-11T10:00:00Z' }, 30)).toBe('2026-12-24')
  })
  it('gibt null zurück statt zu raten, wenn kein Datum da ist', () => {
    expect(gueltigBis({ valid_until: null, created_at: null }, 30)).toBeNull()
  })
})

describe('CoS-E-010 — kein Abzug von null im Rechenweg', () => {
  it('nennt nichts, wenn nichts abgezogen wurde', () => {
    expect(abzugsText([
      { label: 'Fenster', flaeche: 0 },
      { label: 'Türen', flaeche: 0 },
    ])).toBe('')
  })

  it('nennt nur den Teil, der wirklich abgezogen wurde', () => {
    expect(abzugsText([
      { label: 'Fenster', flaeche: 0 },
      { label: 'Türen', flaeche: 4.2, masse: ' [2×2.1]' },
    ])).toBe(' − Türen 4.2 m² [2×2.1]')
  })

  it('nennt beide, wenn beide abgezogen wurden', () => {
    expect(abzugsText([
      { label: 'Fenster', flaeche: 3.2 },
      { label: 'Türen', flaeche: 4.2 },
    ])).toBe(' − Fenster 3.2 m² − Türen 4.2 m²')
  })
})
