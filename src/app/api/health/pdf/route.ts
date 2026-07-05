import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { AngebotPDF } from '@/lib/pdf'
import type { Quote, QuoteItem, Company } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET() {
  try {
    const dummyCompany: Company = {
      id: 'health-check',
      user_id: 'health-check',
      name: 'Health Check GmbH',
      address: 'Musterstraße 1\n12345 Berlin',
      phone: null,
      contact_email: null,
      website: null,
      tax_number: '123/456/789',
      iban: null,
      logo_url: null,
      signature_url: null,
      vat_rate: 19,
      payment_days: 14,
      language: 'de',
      accounting_software: 'none',
      gewerke: [],
      created_at: new Date().toISOString(),
      lexware_api_key: null,
      lexoffice_api_key: null,
      sevdesk_api_key: null,
      fastbill_api_key: null,
      fastbill_email: null,
      billomat_api_key: null,
      billomat_subdomain: null,
      papierkram_api_key: null,
      easybill_api_key: null,
      ust_id: null,
      agb_url: null,
      plan: null,
      reminder_days: null,
      regionaler_preisfaktor_prozent: 0,
      angebot_gueltig_tage: 30,
      materialpreis_hinweis_aktiv: false,
      mindestauftragswert: 0,
      e_rechnung_aktiv: false,
      onboarding_completed: true,
      onboarding_step: 8,
      kleinmaterial_config: null,
      anfahrt_config: null,
    }

    const dummyItem: QuoteItem = {
      id: 'health-1',
      quote_id: 'health-check',
      position: 1,
      title: 'Health Check Position',
      description: null,
      quantity: 1,
      unit: 'Stk',
      unit_price: 10,
      vob_norm: null,
      din_normen: null,
      total_price: 10,
    }

    const dummyQuote: Quote & { items: QuoteItem[] } = {
      id: 'health-check',
      company_id: 'health-check',
      customer_id: null,
      status: 'draft',
      created_at: new Date().toISOString(),
      valid_until: null,
      total_net: 10,
      total_vat: 1.9,
      total_gross: 11.9,
      notes: null,
      signed_at: null,
      signed_by: null,
      angebotsnummer: 'HEALTH-001',
      briefpapier_id: null,
      revision: 1,
      original_id: null,
      items: [dummyItem],
    }

    // @ts-expect-error react-pdf typing
    const buffer: Buffer = await renderToBuffer(createElement(AngebotPDF, {
      quote: dummyQuote,
      company: dummyCompany,
      quoteNumber: 'HEALTH-001',
    }))

    return NextResponse.json({ status: 'ok', size_bytes: buffer.length })
  } catch (error) {
    console.error('PDF health check failed:', error)
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 503 })
  }
}
