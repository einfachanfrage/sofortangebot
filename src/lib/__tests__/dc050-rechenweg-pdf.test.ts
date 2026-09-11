// ── DC-050 (Sandy, 11.09.2026) ───────────────────────────────────────────
//
// Echt-Render des PDFs: Steuert `quotes.zeige_rechenweg_auf_pdf`, ob der
// Rechenweg auf dem KUNDEN-Dokument steht?
//
// Der Zielkonflikt dahinter: Das CI-Handbuch fordert ihn „nie versteckt, nie
// eingeklappt" (S. 19), Sandy wollte ihn steuern können. Entschieden wurde
// „pro Angebot fragen". Damit hängt am Wert NULL eine Regel, die man leicht
// falsch herum baut — deshalb steht sie hier fest: **Schweigen blendet
// nichts aus.**
import { describe, it, expect } from 'vitest'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { PDFParse } from 'pdf-parse'
import { AngebotPDF } from '@/lib/pdf'
import type { Quote, QuoteItem, Company } from '@/lib/types'

const RECHENWEG = 'Umfang 18 lfm × 2,5 m = 45 m²'

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

function angebot(zeigeRechenwegAufPdf: boolean | null): Quote & { items: QuoteItem[] } {
  const item = {
    id: 'i1', quote_id: 'q1', position: 1, title: 'Wandflächen streichen 2x — Wohnzimmer',
    description: null, quantity: 45, unit: 'm²', unit_price: 11.5, total_price: 517.5,
    vob_norm: null, din_normen: null, berechnungsweg: RECHENWEG, annahmen: [],
  } as unknown as QuoteItem
  return {
    id: 'q1', company_id: 'x', customer_id: null, status: 'draft', created_at: new Date().toISOString(),
    valid_until: null, total_net: 517.5, total_vat: 98.33, total_gross: 615.83, notes: null,
    signed_at: null, signed_by: null, angebotsnummer: 'A-1', briefpapier_id: null,
    revision: 1, original_id: null, items: [item],
    zeige_rechenweg_auf_pdf: zeigeRechenwegAufPdf,
  } as Quote & { items: QuoteItem[] }
}

async function text(
  quote: Quote & { items: QuoteItem[] },
  struktur: 'raeume' | 'gewerk',
  zeigeRechenweg?: boolean,
) {
  // @ts-expect-error react-pdf typing
  const buf: Buffer = await renderToBuffer(createElement(AngebotPDF, {
    quote, company: firma(struktur), quoteNumber: 'A-1', zeigeRechenweg,
  }))
  const parser = new PDFParse({ data: buf })
  const result = await parser.getText()
  await parser.destroy()
  return result.text
}

// Beide Renderpfade — das PDF gliedert je nach Betriebseinstellung flach oder
// nach Räumen. Der Übermessungs-Test von gestern hat gezeigt, dass ein Fix in
// nur einem der beiden Pfade nicht auffällt.
for (const struktur of ['raeume', 'gewerk'] as const) {
  describe(`DC-050 — Rechenweg im Kunden-PDF (Struktur: ${struktur})`, () => {
    it('Selbsttest: der Extraktor liest überhaupt Text', async () => {
      // Ohne ihn wäre ein kaputter Extraktor nicht von einem fehlenden
      // Rechenweg zu unterscheiden — die Negativprüfung wäre grün und leer.
      expect(await text(angebot(null), struktur)).toMatch(/Wandfl/)
    })

    it('noch nicht gefragt (NULL) → Rechenweg steht drauf', async () => {
      expect(await text(angebot(null), struktur)).toContain(RECHENWEG)
    })

    it('ausdrücklich ja → Rechenweg steht drauf', async () => {
      expect(await text(angebot(true), struktur)).toContain(RECHENWEG)
    })

    it('ausdrücklich nein → Rechenweg fehlt, der Rest bleibt', async () => {
      const t = await text(angebot(false), struktur)
      expect(t).not.toContain(RECHENWEG)
      expect(t).toMatch(/Wandfl/)
      expect(t).toMatch(/517|615/)
    })

    // Die Prop ist der Weg für die Vorschau, in der die Entscheidung noch
    // nicht am Angebot gespeichert ist. Sie sticht den gespeicherten Wert.
    it('die Prop übersteuert das Angebot in beide Richtungen', async () => {
      expect(await text(angebot(true), struktur, false)).not.toContain(RECHENWEG)
      expect(await text(angebot(false), struktur, true)).toContain(RECHENWEG)
    })
  })
}
