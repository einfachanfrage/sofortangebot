// DC-123 (Product Designer, 17.09.2026) — Die Live-Vorschau kennt jetzt das
// Briefpapier.
//
// Der Befund aus DC-121: `AngebotVorschau.tsx` sagt „so sieht dein Angebot
// für den Kunden aus", bekam aber nie das Briefpapier des Angebots übergeben.
// Sie zeigte das Kopflogo deshalb IMMER links und IMMER in der Vorgabegröße —
// egal was unter Einstellungen → Briefpapier & Design eingestellt war. Wer
// „Groß / rechts" gewählt hatte, sah den Unterschied erst im fertigen PDF.
//
// Diese Datei hält drei Dinge fest:
//   1. Die Pixelwerte der Vorschau stehen im selben Verhältnis wie die
//      Punktwerte des PDFs — die Vorschau kann also nicht heimlich eine
//      eigene Stufenleiter bekommen.
//   2. Die Vorschau setzt das Logo wirklich an die drei Stellen.
//   3. Ohne Briefpapier zeigt sie exakt das, was sie vorher zeigte.
import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import AngebotVorschau from '@/components/AngebotVorschau'
import {
  logoKopf, logoKopfVorschau, LOGO_HOEHE_PT, LOGO_MAX_BREITE_PT,
} from '@/lib/briefpapier-logo'
import type { Briefpapier, Company, Quote, QuoteItem } from '@/lib/types'

function briefpapier(over: Partial<Briefpapier>): Briefpapier {
  return {
    id: 'bp1', betrieb_id: 'b1', name: 'Standard', ist_standard: true,
    firmenname: null, zusatz: null, strasse: null, plz: null, ort: null,
    telefon: null, email: null, website: null,
    logo_url: 'https://example.test/briefpapier-logo.png',
    logo_position: 'links', logo_groesse: 'mittel',
    akzentfarbe: '#D9A400',
    fusszeile_links: null, fusszeile_mitte: null, fusszeile_rechts: null,
    schrift: 'inter',
    erstellt_am: new Date().toISOString(), aktualisiert_am: new Date().toISOString(),
    ...over,
  } as Briefpapier
}

describe('DC-123 — die Vorschau rechnet dieselben Stufen wie das PDF', () => {
  it('jede Stufe der Vorschau folgt derselben Rangfolge wie im PDF', () => {
    const stufen = (['klein', 'mittel', 'gross'] as const).map(g => ({
      pt: logoKopf(briefpapier({ logo_groesse: g })).hoehe,
      px: logoKopfVorschau(briefpapier({ logo_groesse: g })).hoehePx,
    }))
    // Aufsteigend, ohne zwei gleiche Werte — sonst wäre ein Schalter blind.
    expect(stufen[0].px).toBeLessThan(stufen[1].px)
    expect(stufen[1].px).toBeLessThan(stufen[2].px)
    // Und im selben Verhältnis zueinander wie die Punktwerte (±1 px Rundung).
    const faktor = stufen[1].px / stufen[1].pt
    for (const s of stufen) expect(Math.abs(s.px - s.pt * faktor)).toBeLessThanOrEqual(1)
  })

  it('der Bezugspunkt aus DC-121 bleibt stehen: mittel = 48 px', () => {
    // 42 pt ↔ max-h-12. Ändert jemand LOGO_HOEHE_PT, fällt diese Zeile auf —
    // und zwar bevor Vorschau und PDF auseinanderlaufen.
    expect(LOGO_HOEHE_PT.mittel).toBe(42)
    expect(logoKopfVorschau(null).hoehePx).toBe(48)
  })

  it('die Breitenbremse gilt in der Vorschau auch', () => {
    expect(logoKopfVorschau(null).maxBreitePx).toBeGreaterThan(LOGO_MAX_BREITE_PT * 0.9)
  })

  it('ohne Briefpapier gilt dieselbe Vorgabe wie im PDF: links, mittel', () => {
    expect(logoKopfVorschau(null).position).toBe('links')
    expect(logoKopfVorschau(undefined).position).toBe('links')
    expect(logoKopfVorschau(null).hoehePx).toBe(logoKopfVorschau(briefpapier({})).hoehePx)
  })
})

// ── Der zweite Teil: die Ansicht selbst ────────────────────────────────────
// Reine Zahlenprüfungen würden nicht auffallen lassen, wenn die Ansicht die
// Werte zwar kennt, aber nicht benutzt — genau das war ja der Befund.
describe('DC-123 — die Vorschau setzt das Logo wirklich um', () => {
  function firma(over: Partial<Company> = {}): Company {
    return {
      id: 'x', user_id: 'x', name: 'Holm GmbH', address: 'Musterstr. 1\n12345 Berlin',
      phone: null, contact_email: null, website: null, tax_number: null, iban: null,
      logo_url: 'https://example.test/firmen-logo.png', signature_url: null,
      vat_rate: 19, payment_days: 14, language: 'de',
      accounting_software: 'none', abrechnungs_modus: 'inapp', angebot_struktur: 'raeume',
      widerruf_aktiv: false, widerruf_text: null, gewerke: ['maler'],
      created_at: new Date().toISOString(),
      angebot_gueltig_tage: 30, onboarding_completed: true,
      ...over,
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

  function markup(bp?: Briefpapier | null, company = firma()) {
    return renderToStaticMarkup(createElement(AngebotVorschau, {
      quote: angebot(), company, quoteNumber: 'AG-2026-004', briefpapier: bp,
    }))
  }

  it('die drei Größen kommen als drei verschiedene Höhen an', () => {
    const hoehen = (['klein', 'mittel', 'gross'] as const).map(g => {
      const px = logoKopfVorschau(briefpapier({ logo_groesse: g })).hoehePx
      expect(markup(briefpapier({ logo_groesse: g }))).toContain(`height:${px}px`)
      return px
    })
    expect(new Set(hoehen).size).toBe(3)
  })

  // Achtung beim Lesen dieser drei Prüfungen: React stellt dem Dokument ein
  // <link rel="preload" as="image"> mit derselben URL voran. Nach der URL zu
  // suchen fände immer diese Zeile, ganz vorne, egal wo das Bild steht — die
  // Prüfung wäre grün und würde nichts messen. Deshalb wird die Stelle des
  // <img> gesucht, nicht die der Adresse.
  const bildStelle = (html: string) => html.indexOf('<img')

  it('Position „mitte" steht als eigene Zeile ÜBER dem Kopf, nicht in der linken Spalte', () => {
    const html = markup(briefpapier({ logo_position: 'mitte' }))
    expect(bildStelle(html)).toBeGreaterThan(-1)
    expect(bildStelle(html)).toBeLessThan(html.indexOf('Holm GmbH'))
    expect(html).toContain('justify-center')
  })

  it('Position „rechts" setzt das Logo vor „ANGEBOT", nicht vor den Firmennamen', () => {
    const html = markup(briefpapier({ logo_position: 'rechts' }))
    expect(bildStelle(html)).toBeGreaterThan(html.indexOf('Holm GmbH'))
    expect(bildStelle(html)).toBeLessThan(html.indexOf('ANGEBOT'))
  })

  it('Position „links" bleibt über dem Firmennamen — der alte Stand', () => {
    const html = markup(briefpapier({ logo_position: 'links' }))
    expect(bildStelle(html)).toBeLessThan(html.indexOf('Holm GmbH'))
  })

  it('das Logo ersetzt den Firmennamen nicht (DC-121, hier festgehalten)', () => {
    expect(markup(briefpapier({}))).toContain('Holm GmbH')
  })

  it('das Briefpapier-Logo gewinnt gegen das Firmenlogo — dieselbe Rangfolge wie im PDF', () => {
    const html = markup(briefpapier({}))
    expect(html).toContain('briefpapier-logo.png')
    expect(html).not.toContain('firmen-logo.png')
  })

  it('ohne Briefpapier bleibt es beim Firmenlogo, links und in der Vorgabegröße', () => {
    const html = markup(null)
    expect(html).toContain('firmen-logo.png')
    expect(html).toContain('height:48px')
    expect(bildStelle(html)).toBeLessThan(html.indexOf('Holm GmbH'))
  })

  it('ohne jedes Logo entsteht kein leeres Bild', () => {
    const html = markup(briefpapier({ logo_url: null }), firma({ logo_url: null }))
    expect(html).not.toContain('<img')
    expect(html).toContain('Holm GmbH')
  })
})
