// G6 — Wertersatz-Erklärung im Widerrufs-PDF
// (Head of Legal & Compliance, freigegeben von Sandy als S-2 am 01.09.2026)
//
// Ohne dieses Feld schuldet der Verbraucher nach § 357a Abs. 2 BGB KEINEN
// Wertersatz für vor dem Widerruf erbrachte Leistungen. Der Betrieb streicht
// drei Tage, der Kunde widerruft am zehnten — und bekommt alles zurück.
//
// Drei Bedingungen entscheiden über die Wirksamkeit, und genau die prüfen
// diese Tests: freiwillig (nicht vorangekreuzt), separat (eigene
// Unterschrift), und nur dort, wo überhaupt ein Widerrufsrecht besteht.
import { describe, it, expect } from 'vitest'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { inflateSync } from 'node:zlib'
import { AngebotPDF } from '@/lib/pdf'
import type { Quote, QuoteItem, Company, Customer } from '@/lib/types'
import {
  WERTERSATZ_ERKLAERUNG,
  WERTERSATZ_HINWEIS,
  braucheWiderrufsbelehrung,
} from '@/lib/widerrufsbelehrung'

function firma(widerrufAktiv: boolean): Company {
  return {
    id: 'x', user_id: 'x', name: 'Malerbetrieb Holm', address: 'Wielandstr. 11\n12159 Berlin',
    phone: '030 123', contact_email: 'hallo@sofortangebot.app', website: null, tax_number: null,
    iban: null, logo_url: null, signature_url: null, vat_rate: 19, payment_days: 14, language: 'de',
    accounting_software: 'none', abrechnungs_modus: 'inapp', angebot_struktur: 'raeume',
    widerruf_aktiv: widerrufAktiv, widerruf_text: null, gewerke: ['maler'],
    created_at: new Date().toISOString(), lexware_api_key: null, lexoffice_api_key: null,
    sevdesk_api_key: null, fastbill_api_key: null, fastbill_email: null, billomat_api_key: null,
    billomat_subdomain: null, papierkram_api_key: null, easybill_api_key: null, ust_id: null,
    agb_url: null, plan: null, reminder_days: null, regionaler_preisfaktor_prozent: 0,
    angebot_gueltig_tage: 30, materialpreis_hinweis_aktiv: false, mindestauftragswert: 0,
    e_rechnung_aktiv: false, onboarding_completed: true, onboarding_step: 8,
    kleinmaterial_config: null, anfahrt_config: null,
  } as unknown as Company
}

function angebot(istUnternehmen: boolean | null): Quote & { items: QuoteItem[]; customer: Customer } {
  const item = {
    id: 'i1', quote_id: 'q1', position: 1, title: 'Wandfläche streichen 2x — Wohnzimmer',
    description: null, quantity: 40, unit: 'm²', unit_price: 12.5, total_price: 500,
    vob_norm: null, din_normen: null,
  } as unknown as QuoteItem
  return {
    id: 'q1', company_id: 'x', customer_id: 'c1', status: 'draft',
    created_at: new Date().toISOString(), valid_until: null, total_net: 500, total_vat: 95,
    total_gross: 595, notes: null, signed_at: null, signed_by: null, angebotsnummer: '2026-0042',
    briefpapier_id: null, revision: 1, original_id: null, items: [item],
    customer: { id: 'c1', name: 'Familie Beispiel', address: 'Beispielweg 3\n12159 Berlin', ist_unternehmen: istUnternehmen },
  } as unknown as Quote & { items: QuoteItem[]; customer: Customer }
}

async function pdfText(quote: Quote & { items: QuoteItem[] }, company: Company) {
  // @ts-expect-error react-pdf typing
  const buf: Buffer = await renderToBuffer(createElement(AngebotPDF, { quote, company, quoteNumber: '2026-0042' }))
  const roh = buf.toString('latin1')
  let streams = ''
  const reStream = /stream\r?\n([\s\S]*?)endstream/g
  let m: RegExpExecArray | null
  while ((m = reStream.exec(roh)) !== null) {
    try { streams += inflateSync(Buffer.from(m[1], 'latin1')).toString('latin1') } catch { /* Font */ }
  }
  let klartext = ''
  const reHex = /<([0-9a-fA-F]+)>/g
  let h: RegExpExecArray | null
  while ((h = reHex.exec(streams)) !== null) {
    if (h[1].length % 2 === 0) klartext += Buffer.from(h[1], 'hex').toString('latin1')
  }
  return klartext
}

describe('Wertersatz-Feld auf dem Kunden-PDF', () => {
  it('steht auf dem PDF eines Privatkunden', async () => {
    const text = await pdfText(angebot(false), firma(true))
    expect(text).toMatch(/Widerrufsbelehrung/)
    expect(text).toMatch(/verlange ausdr/)
    expect(text).toMatch(/Wertersatz/)
  }, 30000)

  it('nennt die Freiwilligkeit ausdrücklich — sonst ist die Erklärung angreifbar', async () => {
    const text = await pdfText(angebot(false), firma(true))
    expect(text).toMatch(/freiwillig/i)
    expect(WERTERSATZ_HINWEIS).toMatch(/freiwillig/i)
  }, 30000)

  it('hat eine EIGENE Unterschriftszeile, getrennt von der Auftragsunterschrift', async () => {
    const text = await pdfText(angebot(false), firma(true))
    // „Unterschrift Auftraggeber" steht dann zweimal im Dokument: einmal unter
    // den Positionen, einmal unter dieser Erklärung. Zusammengelegt wäre sie
    // nach § 357a Abs. 2 BGB unwirksam.
    const treffer = text.match(/Unterschrift Auftraggeber/g) ?? []
    expect(treffer.length).toBe(2)
  }, 30000)

  it('ist nicht vorangekreuzt — im Text steht kein gesetztes Häkchen', () => {
    expect(WERTERSATZ_ERKLAERUNG).not.toMatch(/[☑✓✔x]\s/i)
    expect(WERTERSATZ_ERKLAERUNG.startsWith('Ich verlange')).toBe(true)
  })

  it('fehlt bei einem Geschäftskunden — dort gibt es kein Widerrufsrecht', async () => {
    const text = await pdfText(angebot(true), firma(true))
    expect(text).not.toMatch(/Widerrufsbelehrung/)
    expect(text).not.toMatch(/verlange ausdr/)
  }, 30000)

  it('fehlt, wenn der Betrieb die Belehrung abgeschaltet hat', async () => {
    const text = await pdfText(angebot(false), firma(false))
    expect(text).not.toMatch(/verlange ausdr/)
  }, 30000)

  it('erscheint zusammen mit der Belehrung — nie ohne sie', () => {
    // Das Feld hängt an derselben Bedingung wie die Belehrung. Eine
    // Wertersatz-Erklärung ohne Belehrung wäre wirkungslos.
    expect(braucheWiderrufsbelehrung({ widerrufAktiv: true, kundeIstUnternehmen: false })).toBe(true)
    expect(braucheWiderrufsbelehrung({ widerrufAktiv: false, kundeIstUnternehmen: false })).toBe(false)
    expect(braucheWiderrufsbelehrung({ widerrufAktiv: true, kundeIstUnternehmen: true })).toBe(false)
  })
})
