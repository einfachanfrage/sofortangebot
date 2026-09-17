// DC-121 (Product Designer, 17.09.2026) — Das Logo im Angebotskopf.
//
// Der Befund: Im Kopf des Kunden-PDFs stand das Logo in einer festen Box von
// 72 × 36 pt. Ein Bild, das nicht zufällig 2:1 breit war, wurde darin klein —
// ein quadratisches Logo landete bei 36 × 36 pt, also auf halber Breite. Ein
// Handwerksbetrieb hat aber oft ein rundes oder quadratisches Logo.
//
// Die Regel, die jetzt gilt: Ein Logo wird über seine HÖHE ausgerichtet, nie
// über seine Breite. Die Breite folgt dem Seitenverhältnis des Bildes.
//
// Zweiter Teil des Befundes: Unter Einstellungen → Briefpapier & Design gibt
// es seit jeher die Schalter „Größe" (Klein/Mittel/Groß) und „Position"
// (links/mitte/rechts). Beide waren im PDF an nichts angeschlossen. Diese
// Datei hält fest, dass sie es jetzt sind — und dass ein Betrieb ohne
// Briefpapier weiterhin genau das bekommt, was er vorher hatte: links, mittel.
import { describe, it, expect } from 'vitest'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { AngebotPDF, logoKopf, LOGO_HOEHE_PT, LOGO_MAX_BREITE_PT } from '@/lib/pdf'
import type { Briefpapier, Company, Quote, QuoteItem } from '@/lib/types'

function briefpapier(over: Partial<Briefpapier>): Briefpapier {
  return {
    id: 'bp1', betrieb_id: 'b1', name: 'Standard', ist_standard: true,
    firmenname: null, zusatz: null, strasse: null, plz: null, ort: null,
    telefon: null, email: null, website: null,
    logo_url: 'https://example.test/logo.png',
    logo_position: 'links', logo_groesse: 'mittel',
    akzentfarbe: '#D9A400',
    fusszeile_links: null, fusszeile_mitte: null, fusszeile_rechts: null,
    schrift: 'inter',
    erstellt_am: new Date().toISOString(), aktualisiert_am: new Date().toISOString(),
    ...over,
  } as Briefpapier
}

describe('DC-121 — Höhe und Position des Kopflogos', () => {
  it('ohne Briefpapier gilt die Vorgabe: mittel, links', () => {
    expect(logoKopf()).toEqual({ hoehe: LOGO_HOEHE_PT.mittel, position: 'links' })
    expect(logoKopf(null)).toEqual({ hoehe: LOGO_HOEHE_PT.mittel, position: 'links' })
  })

  it('der Größen-Schalter aus dem Briefpapier wirkt — alle drei Stufen', () => {
    expect(logoKopf(briefpapier({ logo_groesse: 'klein' })).hoehe).toBe(LOGO_HOEHE_PT.klein)
    expect(logoKopf(briefpapier({ logo_groesse: 'mittel' })).hoehe).toBe(LOGO_HOEHE_PT.mittel)
    expect(logoKopf(briefpapier({ logo_groesse: 'gross' })).hoehe).toBe(LOGO_HOEHE_PT.gross)
  })

  it('die drei Stufen sind echt verschieden und aufsteigend', () => {
    expect(LOGO_HOEHE_PT.klein).toBeLessThan(LOGO_HOEHE_PT.mittel)
    expect(LOGO_HOEHE_PT.mittel).toBeLessThan(LOGO_HOEHE_PT.gross)
  })

  it('der Positions-Schalter aus dem Briefpapier wirkt — alle drei Werte', () => {
    expect(logoKopf(briefpapier({ logo_position: 'links' })).position).toBe('links')
    expect(logoKopf(briefpapier({ logo_position: 'mitte' })).position).toBe('mitte')
    expect(logoKopf(briefpapier({ logo_position: 'rechts' })).position).toBe('rechts')
  })

  it('ein leerer Wert aus der Datenbank fällt auf die Vorgabe zurück, statt das Logo verschwinden zu lassen', () => {
    // Ältere Zeilen können die Spalten noch nicht gefüllt haben.
    const leer = briefpapier({}) as unknown as Record<string, unknown>
    delete leer.logo_groesse
    delete leer.logo_position
    expect(logoKopf(leer as unknown as Briefpapier)).toEqual({
      hoehe: LOGO_HOEHE_PT.mittel, position: 'links',
    })
  })

  it('die Breite ist nur gedeckelt, nicht gesetzt — der Nummernblock rechts braucht rund 150 pt', () => {
    // Textspalte + Nummernblock liegen im A4-Satzspiegel (595 − 2×52 = 491 pt).
    expect(LOGO_MAX_BREITE_PT).toBeGreaterThan(LOGO_HOEHE_PT.gross)
    expect(LOGO_MAX_BREITE_PT).toBeLessThanOrEqual(491 - 150)
  })
})

// Der zweite Teil: das PDF muss mit jeder der drei Positionen auch wirklich
// durchlaufen. Die Positionsumschaltung fügt bei „mitte" eine zusätzliche,
// mitlaufende Zeile über dem Kopf ein — ein Fehler darin fiele in keiner
// reinen Rechenprüfung auf, sondern erst beim Erzeugen des Dokuments.
describe('DC-121 — das Dokument entsteht mit jeder Position', () => {
  // 1×1 px PNG, reicht react-pdf als echtes Bild.
  const LOGO =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

  function firma(): Company {
    return {
      id: 'x', user_id: 'x', name: 'Holm GmbH', address: 'Musterstr. 1\n12345 Berlin',
      phone: null, contact_email: null, website: null, tax_number: null, iban: null,
      logo_url: null, signature_url: null, vat_rate: 19, payment_days: 14, language: 'de',
      accounting_software: 'none', abrechnungs_modus: 'inapp', angebot_struktur: 'raeume',
      widerruf_aktiv: false, widerruf_text: null, gewerke: ['maler'],
      created_at: new Date().toISOString(),
      lexware_api_key: null, lexoffice_api_key: null, sevdesk_api_key: null,
      fastbill_api_key: null, fastbill_email: null, billomat_api_key: null,
      billomat_subdomain: null, papierkram_api_key: null, easybill_api_key: null,
      ust_id: null, agb_url: null, plan: null, reminder_days: null,
      regionaler_preisfaktor_prozent: 0, angebot_gueltig_tage: 30,
      materialpreis_hinweis_aktiv: false, mindestauftragswert: 0, e_rechnung_aktiv: false,
      onboarding_completed: true, onboarding_step: 8,
      kleinmaterial_config: null, anfahrt_config: null,
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

  it.each(['links', 'mitte', 'rechts'] as const)('Position %s erzeugt ein PDF', async pos => {
    // @ts-expect-error react-pdf typing
    const buf: Buffer = await renderToBuffer(createElement(AngebotPDF, {
      quote: angebot(), company: firma(), quoteNumber: 'AG-2026-004',
      logoBase64: LOGO,
      briefpapier: briefpapier({ logo_position: pos, logo_groesse: 'gross' }),
    }))
    expect(buf.length).toBeGreaterThan(1000)
  }, 30_000)
})
