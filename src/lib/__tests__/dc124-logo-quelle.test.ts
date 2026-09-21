// DC-124 (Product Designer, 17.09.2026) — Welches Logo im Angebotskopf steht.
//
// Der Befund: Es gab zwei Stellen, an denen ein Logo hochgeladen werden konnte
// — Einstellungen → Firmenlogo (`companies.logo_url`) und Einstellungen →
// Briefpapier & Design (`briefpapiere.logo_url`). Das Dokument liest das
// Briefpapier zuerst. Wer sein Logo an der ersten Stelle wechselte, bekam auf
// jedem Angebot weiter das alte, ohne einen Hinweis darauf, dass es eine
// zweite Stelle gibt, die gewinnt.
//
// Verschärft wurde das durch eine Zeile beim Anlegen: Das Standard-Briefpapier
// bekam eine KOPIE der damaligen Logo-Adresse mit. Die Überschreibung entstand
// also, ohne dass sie jemand angelegt hätte.
//
// Die Entscheidung: Ein Betrieb hat EIN Logo, und es wird an EINER Stelle
// hochgeladen. Ein Briefpapier bestimmt, WO es steht und WIE GROSS es ist —
// nicht, WELCHES es ist. Die zweite Upload-Stelle ist deshalb weg.
//
// Was diese Datei absichert:
//   1. die Rangfolge selbst, die für Bestands-Briefpapiere gilt und nicht
//      kippen darf,
//   2. dass ein Briefpapier OHNE eigenes Logo das Firmenlogo jedes Mal neu
//      holt (das ist der Fix, nicht eine Kopie von früher),
//   3. dass beide Vorschauen dieselben drei Stufen im selben Verhältnis
//      zeigen und sich nur im Maßstab unterscheiden.
import { describe, it, expect } from 'vitest'
import {
  logoQuelle, logoKopfVorschau, logoKopf,
  LOGO_HOEHE_PT, LOGO_MAX_BREITE_PT, LOGO_PT_ZU_PX, LOGO_PT_ZU_PX_MINI,
} from '@/lib/briefpapier-logo'
import type { Briefpapier } from '@/lib/types'

function bp(over: Partial<Briefpapier>): Briefpapier {
  return {
    id: 'bp1', betrieb_id: 'b1', name: 'Standard', ist_standard: true,
    firmenname: null, zusatz: null, strasse: null, plz: null, ort: null,
    telefon: null, email: null, website: null,
    logo_url: null, logo_position: 'links', logo_groesse: 'mittel',
    akzentfarbe: '#D9A400',
    fusszeile_links: null, fusszeile_mitte: null, fusszeile_rechts: null,
    schrift: 'inter',
    erstellt_am: new Date().toISOString(), aktualisiert_am: new Date().toISOString(),
    ...over,
  } as Briefpapier
}

const FIRMA = { logo_url: 'https://example.test/firmenlogo.png' }

describe('DC-124 — welches Bild in den Kopf kommt', () => {
  it('ohne Briefpapier: das Firmenlogo, und es ist nicht als eigenes markiert', () => {
    expect(logoQuelle(null, FIRMA)).toEqual({ src: FIRMA.logo_url, eigenes: false })
    expect(logoQuelle(undefined, FIRMA)).toEqual({ src: FIRMA.logo_url, eigenes: false })
  })

  it('Briefpapier ohne eigenes Logo: das Firmenlogo — das ist der Fix', () => {
    // Genau dieser Fall war kaputt: Das Standard-Briefpapier trug eine Kopie
    // der Adresse von früher, statt jedes Mal beim Betrieb nachzusehen.
    expect(logoQuelle(bp({ logo_url: null }), FIRMA)).toEqual({ src: FIRMA.logo_url, eigenes: false })
  })

  it('Briefpapier MIT eigenem Logo behält Vorrang — die Rangfolge kippt nicht', () => {
    const eigen = 'https://example.test/variante.png'
    expect(logoQuelle(bp({ logo_url: eigen }), FIRMA)).toEqual({ src: eigen, eigenes: true })
  })

  it('kein Logo an keiner der beiden Stellen: kein Bild, kein Platzhalter', () => {
    expect(logoQuelle(bp({ logo_url: null }), { logo_url: null })).toEqual({ src: null, eigenes: false })
    expect(logoQuelle(null, null)).toEqual({ src: null, eigenes: false })
  })

  it('ein leerer String ist kein Logo (eine gelöschte Adresse darf nicht gewinnen)', () => {
    expect(logoQuelle(bp({ logo_url: '' }), FIRMA)).toEqual({ src: FIRMA.logo_url, eigenes: false })
  })
})

describe('DC-124 — beide Vorschauen, ein Verhältnis', () => {
  it('die große Vorschau trägt die Höhe des Papiers: mittel = 42 px = 42 pt', () => {
    // Bis DC-132 stand hier 48 px, der gesetzte Bezugspunkt aus DC-121 für
    // ein Blatt, das kein maßstäbliches A4 war. Seit DC-132 ist es eins
    // (595 px = 595 pt), damit ist LOGO_PT_ZU_PX = 1 und die Vorschau zeigt
    // dieselbe Logohöhe wie das PDF. Der Faktor bleibt ein Parameter mit
    // Vorgabewert — die Mini-Vorschau unten hat weiterhin ihren eigenen.
    expect(logoKopfVorschau(bp({}))).toEqual({
      hoehePx: 42,
      maxBreitePx: Math.round(LOGO_MAX_BREITE_PT * LOGO_PT_ZU_PX),
      position: 'links',
    })
  })

  it('die Mini-Vorschau: mittel = 32 px, so groß wie das Logo dort vorher stand', () => {
    expect(logoKopfVorschau(bp({}), LOGO_PT_ZU_PX_MINI).hoehePx).toBe(32)
  })

  it('die drei Stufen stehen in beiden Vorschauen im Verhältnis des PDF', () => {
    for (const groesse of ['klein', 'mittel', 'gross'] as const) {
      const pt = LOGO_HOEHE_PT[groesse]
      expect(logoKopfVorschau(bp({ logo_groesse: groesse })).hoehePx).toBe(Math.round(pt * LOGO_PT_ZU_PX))
      expect(logoKopfVorschau(bp({ logo_groesse: groesse }), LOGO_PT_ZU_PX_MINI).hoehePx).toBe(Math.round(pt * LOGO_PT_ZU_PX_MINI))
    }
    // Und die Mini-Vorschau ist überall kleiner als die große — sonst ist
    // einer der beiden Bezugspunkte verrutscht.
    expect(LOGO_PT_ZU_PX_MINI).toBeLessThan(LOGO_PT_ZU_PX)
  })

  it('die Position ist eine Anordnung, kein Maß — sie kommt unverändert durch', () => {
    for (const pos of ['links', 'mitte', 'rechts'] as const) {
      expect(logoKopfVorschau(bp({ logo_position: pos }), LOGO_PT_ZU_PX_MINI).position).toBe(pos)
      expect(logoKopf(bp({ logo_position: pos })).position).toBe(pos)
    }
  })
})
