// Echt-Render des PDFs: prüft, dass der Übermessungshinweis im erzeugten
// Dokument landet — in BEIDEN Renderpfaden (flach und nach Räumen gruppiert).
import { describe, it, expect } from 'vitest'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { inflateSync } from 'node:zlib'
import { AngebotPDF } from '@/lib/pdf'
import type { Quote, QuoteItem, Company } from '@/lib/types'
import { berechneOeffnungsabzugVob, vobHinweistext } from '@/lib/mengen/gewerke/vob-uebermessung'

const leer = { abzugFlaeche: 0, rohFlaeche: 0, uebermessenAnzahl: 0, uebermessenFlaeche: 0 }
const HINWEIS = vobHinweistext(berechneOeffnungsabzugVob([{ anzahl: 2, breite: 1.2, hoehe: 1.3 }], 1.2, 1.3), leer)!

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

function angebot(mitHinweis: boolean): Quote & { items: QuoteItem[] } {
  const item: QuoteItem = {
    id: 'i1', quote_id: 'q1', position: 1, title: 'Wandfläche streichen 2x — Wohnzimmer',
    description: null, quantity: 46.64, unit: 'm²', unit_price: 12, total_price: 559.68,
    vob_norm: null, din_normen: null, ...(mitHinweis ? { annahmen: [HINWEIS] } : {}),
  }
  return {
    id: 'q1', company_id: 'x', customer_id: null, status: 'draft', created_at: new Date().toISOString(),
    valid_until: null, total_net: 559.68, total_vat: 106.34, total_gross: 666.02, notes: null,
    signed_at: null, signed_by: null, angebotsnummer: 'A-1', briefpapier_id: null,
    revision: 1, original_id: null, items: [item],
  } as Quote & { items: QuoteItem[] }
}

async function text(quote: Quote & { items: QuoteItem[] }, struktur: 'raeume' | 'gewerk') {
  // @ts-expect-error react-pdf typing
  const buf: Buffer = await renderToBuffer(createElement(AngebotPDF, {
    quote, company: firma(struktur), quoteNumber: 'A-1',
  }))
  // Content-Streams sind Flate-komprimiert; der Text steht darin als
  // Hex-Glyphen in TJ-Arrays (<54><65>… = "Te…"). Beides auspacken, sonst
  // prüft der Test nur, dass ein PDF entstanden ist — nicht, was drinsteht.
  const roh = buf.toString('latin1')
  let streams = ''
  const reStream = /stream\r?\n([\s\S]*?)endstream/g
  let m: RegExpExecArray | null
  while ((m = reStream.exec(roh)) !== null) {
    try { streams += inflateSync(Buffer.from(m[1], 'latin1')).toString('latin1') } catch { /* Font o.ä. */ }
  }
  let klartext = ''
  const reHex = /<([0-9a-fA-F]+)>/g
  let h: RegExpExecArray | null
  while ((h = reHex.exec(streams)) !== null) {
    if (h[1].length % 2 !== 0) continue
    klartext += Buffer.from(h[1], 'hex').toString('latin1')
  }
  return klartext
}

describe('PDF-Render: Übermessungshinweis', () => {
  it('der Textextraktor liest überhaupt Text aus dem PDF (Selbsttest)', async () => {
    // Ohne diesen Test wäre ein kaputter Extraktor nicht von einem fehlenden
    // Hinweis zu unterscheiden — die Negativ-Prüfung unten würde dann grün
    // sein, obwohl sie nichts prüft.
    const roh = await text(angebot(true), 'raeume')
    expect(roh).toMatch(/Wandfl/)
    expect(roh).toMatch(/Gesamtbetrag/)
  }, 30000)

  it('erscheint bei Raum-Gruppierung', async () => {
    const roh = await text(angebot(true), 'raeume')
    expect(roh).toMatch(/nicht abgezogen/)
    expect(roh).toMatch(/Anlehnung an VOB\/C/)
  }, 30000)

  it('erscheint auch bei Gewerk-Gruppierung (zweiter Renderpfad)', async () => {
    const roh = await text(angebot(true), 'gewerk')
    expect(roh).toMatch(/nicht abgezogen/)
    expect(roh).toMatch(/Anlehnung an VOB\/C/)
  }, 30000)

  it('formatiert die Menge deutsch (46,64 statt 46.64)', async () => {
    const roh = await text(angebot(true), 'raeume')
    expect(roh).toMatch(/46,64/)
    expect(roh).not.toMatch(/46\.64/)
  }, 30000)

  it('fehlt komplett, wenn keine Position übermessen wurde', async () => {
    const roh = await text(angebot(false), 'raeume')
    expect(roh).not.toMatch(/nicht abgezogen/)
    expect(roh).not.toMatch(/Anlehnung an VOB\/C/)
  }, 30000)
})
