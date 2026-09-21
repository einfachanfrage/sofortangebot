// DC-122 Teil 2 (Product Designer, 21.09.2026) — Die drei freien
// Fußzeilen-Felder stehen jetzt auf dem Angebot. Zusätzlich, nicht anstelle.
//
// Teil 1 hat die Akzentfarbe wahr gemacht und die Schriftauswahl abgeschafft.
// Die drei Fußzeilen-Felder blieben offen, weil dort eine Rechtsfrage hing
// und keine Gestaltungsfrage: Der feste Fuß trägt Pflichtangaben. Head of
// Legal hat am 21.09. mit **B** geantwortet (CoS-L-011) — die freien Zeilen
// kommen zusätzlich, in einer eigenen Zeile, und ersetzen nichts.
//
// Diese Datei hält die vier Grenzen fest, die daraus folgen. Drei davon sind
// Verbote, und Verbote sind der Teil, den ein späterer Umbau am leichtesten
// versehentlich aufhebt:
//
//   1. ZUSÄTZLICH: Der feste Fuß steht in jedem Fall vollständig da.
//   2. (nicht hier prüfbar) Der feste Fuß selbst wird in CoS-E-057 gebaut.
//   3. KEIN BUDGET, DAS VERDRÄNGT: Zu langer Freitext wird gekürzt — der
//      feste Teil nie.
//   4. KEINE PRÜFUNG DES FREITEXTES: keine Pflichtangaben-Kontrolle, keine
//      Dubletten-Kontrolle. Steht die IBAN zweimal da, ist das hässlich und
//      ausdrücklich nicht unser Problem.
//
// Geprüft wird beides: die Regel selbst (`lib/briefpapier-fusszeile.ts`) UND
// dass die Ansicht sie benutzt. Eine reine Regelprüfung bliebe grün, wenn die
// Vorschau den Text zwar kennt, aber nicht zeichnet — genau das war der
// Befund bei der Farbe (DC-121) und beim Logo (DC-123).
import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import AngebotVorschau from '@/components/AngebotVorschau'
import {
  freieFusszeile, freieFusszeileZeilen, FUSSZEILE_MAX_ZEICHEN,
} from '@/lib/briefpapier-fusszeile'
import { AKZENT_VORGABE } from '@/lib/briefpapier-farbe'
import type { Briefpapier, Company, Quote, QuoteItem } from '@/lib/types'

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

describe('DC-122 Teil 2 — die Regel', () => {
  it('alle drei Felder leer heißt: es gibt nichts zusätzlich zu zeigen', () => {
    // `null` und nicht ein Objekt aus drei Leerstrings: Ein Betrieb, der
    // nichts einträgt, bekommt kein leeres Band über der Fußzeile.
    expect(freieFusszeile(briefpapier({}))).toBeNull()
    expect(freieFusszeile(null)).toBeNull()
    expect(freieFusszeile(undefined)).toBeNull()
    expect(freieFusszeile(briefpapier({ fusszeile_links: '   ' }))).toBeNull()
    expect(freieFusszeileZeilen(briefpapier({}))).toEqual([])
  })

  it('ein einziges gefülltes Feld reicht — die anderen zwei bleiben leer', () => {
    const f = freieFusszeile(briefpapier({ fusszeile_mitte: 'Handwerkskammer Berlin' }))
    expect(f).toEqual({ links: '', mitte: 'Handwerkskammer Berlin', rechts: '' })
    expect(freieFusszeileZeilen(briefpapier({ fusszeile_mitte: 'Handwerkskammer Berlin' })))
      .toEqual(['Handwerkskammer Berlin'])
  })

  it('der Fuß ist eine Zeile, kein Absatz — Umbrüche werden zu Leerzeichen', () => {
    // Das Eingabefeld ist einzeilig, aber Einfügen aus der Zwischenablage
    // bringt Umbrüche mit. Zwei Zeilen im festen Fußbereich würden den
    // Pflichtteil nach oben schieben. Regel 3.
    const f = freieFusszeile(briefpapier({ fusszeile_links: ' Meisterbetrieb \n  seit 1998 ' }))
    expect(f?.links).toBe('Meisterbetrieb seit 1998')
  })

  it('zu langer Text wird gekürzt, und die Kürzung ist sichtbar', () => {
    // Sichtbar mit „…", weil ein stilles Abschneiden wieder ein Unterschied
    // zwischen Eingabefeld und Papier wäre — also genau der Fehler, den
    // DC-122 behebt.
    const lang = 'A'.repeat(FUSSZEILE_MAX_ZEICHEN + 40)
    const f = freieFusszeile(briefpapier({ fusszeile_rechts: lang }))
    expect(f?.rechts).toHaveLength(FUSSZEILE_MAX_ZEICHEN)
    expect(f?.rechts.endsWith('…')).toBe(true)
  })

  it('genau an der Grenze wird nichts gekürzt', () => {
    const genau = 'B'.repeat(FUSSZEILE_MAX_ZEICHEN)
    expect(freieFusszeile(briefpapier({ fusszeile_links: genau }))?.links).toBe(genau)
  })

  it('der Text wird nicht geprüft — Dubletten und Unsinn kommen durch', () => {
    // Legal Regel 4 ausdrücklich: keine Prüfung auf Pflichtangaben, keine auf
    // Dopplungen. Diese Prüfung steht hier, damit niemand später „hilfreich"
    // eine Filterung einbaut.
    const f = freieFusszeile(briefpapier({
      fusszeile_links: 'IBAN: DE00 0000',
      fusszeile_mitte: 'St.-Nr.: 12/345/67890',
      fusszeile_rechts: 'völliger Unsinn',
    }))
    expect(f).toEqual({
      links: 'IBAN: DE00 0000',
      mitte: 'St.-Nr.: 12/345/67890',
      rechts: 'völliger Unsinn',
    })
  })
})

// ── Der zweite Teil: die Ansicht benutzt die Regel auch ────────────────────
describe('DC-122 Teil 2 — die Vorschau zeigt den freien Text ZUSÄTZLICH', () => {
  function firma(over: Partial<Company> = {}): Company {
    return {
      id: 'x', user_id: 'x', name: 'Holm GmbH', address: 'Musterstr. 1\n12345 Berlin',
      phone: null, contact_email: null, website: null,
      tax_number: '12/345/67890', iban: 'DE12 3456 7890 1234 5678 90',
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

  /** Die drei Bestandteile des festen Fußes, die nie verschwinden dürfen. */
  const FESTER_FUSS = ['Holm GmbH', 'Musterstr. 1', 'St.-Nr.: 12/345/67890', 'IBAN: DE12 3456 7890 1234 5678 90']

  it('der freie Text steht auf dem Dokument — vorher stand er nirgends', () => {
    const html = markup(briefpapier({
      fusszeile_links: 'Meisterbetrieb seit 1998',
      fusszeile_mitte: 'Handwerkskammer Berlin',
      fusszeile_rechts: 'Innung Maler',
    }))
    expect(html).toContain('Meisterbetrieb seit 1998')
    expect(html).toContain('Handwerkskammer Berlin')
    expect(html).toContain('Innung Maler')
  })

  it('und der feste Fuß steht vollständig daneben — Regel 1', () => {
    // Das ist die eigentliche Antwort von Legal: zusätzlich, nicht anstelle.
    // Ginge auch nur eine Pflichtangabe verloren, wäre das Ticket falsch
    // gebaut.
    const html = markup(briefpapier({ fusszeile_links: 'Meisterbetrieb seit 1998' }))
    for (const teil of FESTER_FUSS) expect(html).toContain(teil)
  })

  it('der freie Text steht ÜBER dem festen Fuß, nicht mitten hinein', () => {
    // `lastIndexOf`, nicht `indexOf`: Die IBAN steht auf diesem Dokument
    // zweimal — einmal im Briefkopf und einmal im Fuß. Gemeint ist die im
    // Fuß, und nur zu der ist „darüber" eine Aussage.
    const html = markup(briefpapier({ fusszeile_links: 'Meisterbetrieb seit 1998' }))
    expect(html.indexOf('Meisterbetrieb seit 1998')).toBeLessThan(html.lastIndexOf('IBAN: DE12'))
    expect(html.lastIndexOf('IBAN: DE12')).toBeGreaterThan(html.indexOf('Datum, Unterschrift Auftraggeber'))
  })

  it('auch ein überlanger Eintrag verdrängt keine Pflichtangabe — Regel 3', () => {
    const html = markup(briefpapier({ fusszeile_links: 'X'.repeat(400) }))
    expect(html).not.toContain('X'.repeat(FUSSZEILE_MAX_ZEICHEN + 1))
    for (const teil of FESTER_FUSS) expect(html).toContain(teil)
  })

  it('eine doppelte IBAN kommt durch, und die feste bleibt trotzdem stehen — Regel 4', () => {
    const html = markup(briefpapier({ fusszeile_rechts: 'IBAN: DE99 9999' }))
    expect(html).toContain('IBAN: DE99 9999')
    expect(html).toContain('IBAN: DE12 3456 7890 1234 5678 90')
  })

  it('ohne freien Text sieht der Fuß aus wie vor DC-122', () => {
    // Kein leeres Band, keine zusätzliche Zeile: Wer nichts einträgt, merkt
    // von diesem Ticket nichts.
    const ohne = markup(null)
    const leer = markup(briefpapier({}))
    expect(ohne).toBe(leer)
    for (const teil of FESTER_FUSS) expect(ohne).toContain(teil)
  })
})
