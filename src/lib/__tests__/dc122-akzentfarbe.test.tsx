// DC-122 (Product Designer, 17.09.2026) — Die Akzentfarbe wirkt jetzt.
//
// Der Befund aus DC-121: Von allen Schaltern unter Einstellungen →
// Briefpapier & Design las das Kundendokument genau einen (`logo_url`). Die
// Mini-Vorschau auf derselben Seite zeigte trotzdem Akzentfarbe, Schrift und
// Fußzeilen — sie behauptete also eine Wirkung, die es nicht gab.
//
// Diese Datei hält den Teil fest, der jetzt wahr ist:
//   1. Die Regel „genau zwei Linien" — nicht mehr, nicht weniger.
//   2. Die Untergrenze: Keine Akzentlinie ist heller als die Vorgabefarbe,
//      sonst verschwindet sie auf Papier. Abgedunkelt wird entlang des
//      eigenen Farbtons, nicht nach Grau.
//   3. Vorschau und Papier rechnen dieselbe Farbe — eine Quelle, zwei Leser.
//      (Abgeschriebene Werte sind hier schon zweimal auseinandergelaufen:
//      DC-049, DC-055.)
//
// Die Schriftauswahl ist nicht nachgebaut, sondern abgeschafft worden; sie
// hat deshalb hier nichts zu prüfen. Die drei Fußzeilen-Felder sind seit dem
// 21.09. gebaut (DC-122 Teil 2, Legal CoS-L-011: Antwort B) und haben ihre
// eigene Datei: `dc122-fusszeile.test.tsx`. Hier bleibt davon nur die eine
// Frage, die zur Farbe gehört — dass die Fußzeile trotzdem KEINE dritte
// Akzentlinie bekommt.
import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import AngebotVorschau from '@/components/AngebotVorschau'
import {
  akzentLinie, akzentLinieAusFarbe, normalisiereAkzent, helligkeit,
  wirdAbgedunkelt, AKZENT_VORGABE, AKZENT_MAX_HELLIGKEIT,
} from '@/lib/briefpapier-farbe'
import type { Briefpapier, Company, Quote, QuoteItem } from '@/lib/types'

// Genau die sechs Farben, die die Einstellungsseite als Chips anbietet.
const FARB_CHIPS = ['#D9A400', '#2563EB', '#16A34A', '#DC2626', '#6B7280', '#1C1C1C']

function briefpapier(over: Partial<Briefpapier>): Briefpapier {
  return {
    id: 'bp1', betrieb_id: 'b1', name: 'Standard', ist_standard: true,
    firmenname: null, zusatz: null, strasse: null, plz: null, ort: null,
    telefon: null, email: null, website: null,
    logo_url: null, logo_position: 'links', logo_groesse: 'mittel',
    akzentfarbe: AKZENT_VORGABE,
    fusszeile_links: null, fusszeile_mitte: null, fusszeile_rechts: null,
    schrift: 'inter',
    erstellt_am: new Date().toISOString(), aktualisiert_am: new Date().toISOString(),
    ...over,
  } as Briefpapier
}

describe('DC-122 — die Farbe selbst', () => {
  it('die Vorgabefarbe kommt unverändert durch', () => {
    // Die Grenze IST die Helligkeit der Vorgabe. Dunkelte die Vorgabe sich
    // selbst ab, wäre die Regel falsch herum gerechnet.
    expect(akzentLinieAusFarbe(AKZENT_VORGABE)).toBe(AKZENT_VORGABE)
    expect(helligkeit(AKZENT_VORGABE)).toBeLessThanOrEqual(AKZENT_MAX_HELLIGKEIT)
    expect(wirdAbgedunkelt(AKZENT_VORGABE)).toBe(false)
  })

  it('alle sechs angebotenen Farben kommen unverändert durch', () => {
    // Ein Chip, den die Seite anbietet und das Papier dann verändert, wäre
    // wieder eine Behauptung — nur andersherum.
    for (const c of FARB_CHIPS) {
      expect(akzentLinieAusFarbe(c)).toBe(c.toLowerCase())
      expect(wirdAbgedunkelt(c)).toBe(false)
    }
  })

  it('eine zu helle Farbe wird abgedunkelt, bis sie sichtbar ist', () => {
    for (const hell of ['#FFFFFF', '#FFFF00', '#FFF9E6', '#E5E5E5']) {
      expect(wirdAbgedunkelt(hell)).toBe(true)
      expect(helligkeit(akzentLinieAusFarbe(hell))).toBeLessThanOrEqual(AKZENT_MAX_HELLIGKEIT)
    }
  })

  it('abgedunkelt wird entlang des Farbtons, nicht nach Grau', () => {
    // Ein Betrieb mit hellem Blau soll sein Blau wiedererkennen. Nach dem
    // Abdunkeln muss Blau der stärkste Kanal bleiben.
    const dunkel = akzentLinieAusFarbe('#BFD4FF')
    const [r, g, b] = [1, 3, 5].map(i => parseInt(dunkel.slice(i, i + 2), 16))
    expect(b).toBeGreaterThan(r)
    expect(b).toBeGreaterThan(g)
  })

  it('Unsinn und Leeres fallen auf die Vorgabe zurück, nie auf Schwarz', () => {
    for (const murks of ['', '   ', 'quatsch', '#12345', null, undefined]) {
      expect(normalisiereAkzent(murks)).toBe(AKZENT_VORGABE)
      expect(akzentLinieAusFarbe(murks)).toBe(AKZENT_VORGABE)
    }
    expect(normalisiereAkzent('D9A400')).toBe(AKZENT_VORGABE)   // ohne #
    expect(normalisiereAkzent('#ABC')).toBe('#aabbcc')          // Kurzform
  })

  it('ohne Briefpapier gilt die Vorgabe — das Blatt sieht aus wie bisher', () => {
    expect(akzentLinie(null)).toBe(AKZENT_VORGABE)
    expect(akzentLinie(undefined)).toBe(AKZENT_VORGABE)
  })
})

// ── Der zweite Teil: die Ansicht benutzt die Farbe auch ────────────────────
// Eine reine Farbrechnung bliebe grün, wenn die Vorschau den Wert zwar
// kennt, aber nicht zeichnet — das war beim Logo der Befund (DC-123) und
// hier bei der Farbe der Befund davor (DC-121).
describe('DC-122 — die Vorschau zieht genau zwei Linien', () => {
  function firma(over: Partial<Company> = {}): Company {
    return {
      id: 'x', user_id: 'x', name: 'Holm GmbH', address: 'Musterstr. 1\n12345 Berlin',
      phone: null, contact_email: null, website: null, tax_number: null, iban: null,
      logo_url: null, signature_url: null,
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

  function markup(bp?: Briefpapier | null) {
    return renderToStaticMarkup(createElement(AngebotVorschau, {
      quote: angebot(), company: firma(), quoteNumber: 'AG-2026-004', briefpapier: bp,
    }))
  }

  const wieOft = (html: string, teil: string) => html.split(teil).length - 1

  it('die gewählte Farbe steht genau zweimal im Dokument', () => {
    // Zwei Linien: unter dem Briefkopf, über der Gesamtsumme. Eine dritte
    // Stelle wäre ein gestreiftes Blatt, eine einzige hieße, dass eine der
    // beiden vergessen wurde.
    expect(wieOft(markup(briefpapier({ akzentfarbe: '#2563EB' })), '#2563eb')).toBe(2)
  })

  it('beide Linien hängen wirklich an der Farbe — eine andere Farbe, andere Linien', () => {
    const blau = markup(briefpapier({ akzentfarbe: '#2563EB' }))
    const rot = markup(briefpapier({ akzentfarbe: '#DC2626' }))
    expect(wieOft(rot, '#dc2626')).toBe(2)
    expect(wieOft(rot, '#2563eb')).toBe(0)
    expect(blau).not.toBe(rot)
  })

  it('die Linien sitzen am Briefkopf und an der Gesamtsumme, nicht irgendwo', () => {
    const html = markup(briefpapier({ akzentfarbe: '#2563EB' }))
    const erste = html.indexOf('#2563eb')
    const zweite = html.indexOf('#2563eb', erste + 1)
    expect(erste).toBeGreaterThan(html.indexOf('Holm GmbH'))       // unter dem Kopf
    expect(erste).toBeLessThan(html.indexOf('Bezeichnung'))        // vor der Tabelle
    expect(zweite).toBeGreaterThan(html.indexOf('Bezeichnung'))    // nach der Tabelle
    expect(zweite).toBeLessThan(html.indexOf('Gesamtbetrag'))      // direkt über der Summe
  })

  it('eine zu helle Farbe steht so im Dokument, wie sie gedruckt wird', () => {
    // Nicht der eingegebene Wert, sondern der abgedunkelte — sonst zeigt die
    // Vorschau wieder etwas anderes als das Papier.
    const html = markup(briefpapier({ akzentfarbe: '#FFF9E6' }))
    expect(html).not.toContain('#fff9e6')
    expect(wieOft(html, akzentLinieAusFarbe('#FFF9E6'))).toBe(2)
  })

  it('ohne Briefpapier zieht die Vorschau dieselben zwei Linien in der Vorgabefarbe', () => {
    expect(wieOft(markup(null), AKZENT_VORGABE)).toBe(2)
  })

  it('die Fußzeilen-Linie bleibt grau — auch jetzt, wo die freien Felder wirken', () => {
    // Seit DC-122 Teil 2 steht der freie Text des Betriebs wirklich im Fuß.
    // Eine dritte Akzentlinie bekommt er trotzdem nicht: Es sind genau zwei,
    // und die Fußzeilen-Linie ist Struktur, keine Marke.
    const html = markup(briefpapier({ akzentfarbe: '#2563EB', fusszeile_links: 'IBAN DE00' }))
    expect(wieOft(html, '#2563eb')).toBe(2)
  })
})
