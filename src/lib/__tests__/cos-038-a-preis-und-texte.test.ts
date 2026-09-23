// CoS-038-A — Preis und die Texte drumherum (Head of Product Engineering, 23.09.2026)
//
// `src/lib/pricing.ts` stand bis heute auf dem ABGELÖSTEN Modell (22 €/Monat,
// 17 € im Jahresabo, 3 Angebote gratis), während das Backend seit CoS-P-007
// (06.09.) nach dem beschlossenen fährt: ein Tarif, 49 € netto, Gründerpreis
// 29 € netto dauerhaft für die ersten 25, 14 Tage Test ohne Kreditkarte, kein
// Jahresabo vor Gate 2. Die Landingpage bewarb also einen Preis, den niemand
// bezahlen kann, und ein Kontingent, das nicht Teil des Modells ist.
//
// Diese Datei nagelt drei Dinge fest:
//
//   1. Die Zahlen sind die aus `docs/preismodell.md` — und sie stehen an
//      EINER Stelle. Genau daran ist der Preis schon einmal auseinander-
//      gelaufen (CoS-001/DC-001: drei Quellen, drei verschiedene Preise).
//   2. Das abgelöste Modell ist aus den Flächen verschwunden, die ein Kunde
//      sieht — samt der drei hart eingetippten Gratis-Versprechen, die der
//      Head of Marketing am 16.09. gemeldet hat.
//   3. Die GRENZE dieses Baus: CoS-038-A fasst die Sperre (`plan-limit.ts`)
//      nicht an und schreibt keinen Rechtstext um. Beides ist fremdes Revier
//      und hier ausdrücklich festgehalten, damit es niemand für vergessen
//      hält.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  PRICING,
  GRUENDERPREIS_TEXT,
  MWST_HINWEIS,
  TESTPHASE_CTA,
  FREE_KONTINGENT_TEXT,
  bruttoText,
} from '../pricing'

const lies = (p: string) => readFileSync(join(process.cwd(), p), 'utf-8')

/**
 * Kommentare weg, bevor gemessen wird.
 *
 * Die Bauhinweise in den geänderten Dateien ZITIEREN die alten Zahlen
 * („hier stand 17 €"). Ohne diesen Schritt würde der Test den Beleg für die
 * Korrektur als Rückschritt lesen — und, schlimmer, wer ihn grün bekommen
 * will, löscht die Begründung.
 */
function ohneKommentare(quelle: string): string {
  return quelle
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^[ \t]*\/\/.*$/gm, ' ')
}

const PREISE_SECTION = lies('src/components/landing/PreiseSection.tsx')
const PLAN_MODAL = lies('src/components/PlanWahlModal.tsx')
const NAV = lies('src/components/landing/Nav.tsx')
const HERO = lies('src/components/landing/HeroSection.tsx')
const CTA = lies('src/components/landing/CTASection.tsx')
const ABO_SEITE = lies('src/app/(app)/einstellungen/abo/page.tsx')
const PLAN_LIMIT = lies('src/lib/plan-limit.ts')
const AGB = lies('src/app/agb/page.tsx')

/** Jede Fläche, auf der ein Kunde einen Preis oder ein Versprechen liest. */
const KUNDENFLAECHEN: Array<[string, string]> = [
  ['PreiseSection', PREISE_SECTION],
  ['PlanWahlModal', PLAN_MODAL],
  ['Nav', NAV],
  ['HeroSection', HERO],
  ['CTASection', CTA],
  ['einstellungen/abo', ABO_SEITE],
]

describe('CoS-038-A · die Zahlen sind die aus docs/preismodell.md', () => {
  it('trägt den beschlossenen Preis, den Gründerpreis und die 25 Plätze', () => {
    expect(PRICING.standardMonatlich).toBe(49)
    expect(PRICING.gruenderMonatlich).toBe(29)
    expect(PRICING.gruenderPlaetze).toBe(25)
  })

  it('trägt die Testphase mit 14 Tagen und die Regelbesteuerung mit 19 %', () => {
    expect(PRICING.testTage).toBe(14)
    expect(PRICING.mwstSatz).toBe(0.19)
  })

  // 34,51 € steht in docs/preismodell.md und im Landingpage-Entwurf — an zwei
  // Stellen von Hand. Im Code wird sie gerechnet, nicht eingetippt.
  it('rechnet den Bruttopreis, statt ihn abzuschreiben', () => {
    expect(bruttoText(PRICING.gruenderMonatlich)).toBe('34,51 €')
    expect(bruttoText(PRICING.standardMonatlich)).toBe('58,31 €')
  })

  it('kennt das abgelöste Modell nicht mehr', () => {
    expect(PRICING).not.toHaveProperty('proMonatlich')
    expect(PRICING).not.toHaveProperty('proJahresabo')
  })
})

describe('CoS-038-A · das abgelöste Modell ist von den Kundenflächen verschwunden', () => {
  it.each(KUNDENFLAECHEN)('%s nennt weder 17 € noch 22 € noch ein Jahresabo', (_name, quelle) => {
    const code = ohneKommentare(quelle)
    expect(code).not.toMatch(/\b(17|22)\s*€/)
    expect(code).not.toMatch(/Jahresabo/i)
  })

  // „30 Tage gratis testen" stand in PreiseSection und PlanWahlModal — eine
  // Zahl, die es in KEINEM der beiden Preismodelle je gab (Head of Marketing,
  // 16.09.). Die Testphase sind 14 Tage.
  it.each(KUNDENFLAECHEN)('%s verspricht keine 30-Tage-Testphase', (_name, quelle) => {
    expect(ohneKommentare(quelle)).not.toMatch(/30\s*Tage/i)
  })

  // Die drei hart eingetippten Gratis-Versprechen aus der Meldung vom 16.09.
  it('keine Fläche verspricht mehr ein Gratis-Kontingent', () => {
    for (const [name, quelle] of KUNDENFLAECHEN) {
      const code = ohneKommentare(quelle)
      expect(code, name).not.toMatch(/ersten\s+\d+\s+Angebote\s+kostenlos/i)
      expect(code, name).not.toMatch(/Erstes Angebot kostenlos/i)
    }
  })

  // Das Gratis-Kontingent wird nicht mehr beworben — der Satz selbst bleibt,
  // solange die Sperre ihn durchsetzt (siehe letzte Gruppe).
  it('keine Marketing-Fläche zeigt den Kontingent-Satz noch an', () => {
    expect(ohneKommentare(PREISE_SECTION)).not.toContain('FREE_KONTINGENT_TEXT')
    expect(ohneKommentare(PLAN_MODAL)).not.toContain('FREE_KONTINGENT_TEXT')
  })
})

describe('CoS-038-A · keine Zahl steht ein zweites Mal im Code', () => {
  // Der Bruch von CoS-001/DC-001 in einer Zeile: sobald irgendwo „29 €" als
  // Text steht, gibt es wieder zwei Quellen für denselben Preis.
  it.each(KUNDENFLAECHEN)('%s tippt keinen Eurobetrag als Text', (_name, quelle) => {
    expect(ohneKommentare(quelle)).not.toMatch(/\d+\s*€/)
  })

  it('der Gründerpreis-Satz baut sich aus PRICING auf', () => {
    expect(GRUENDERPREIS_TEXT).toContain(String(PRICING.gruenderPlaetze))
    expect(GRUENDERPREIS_TEXT).toContain(String(PRICING.gruenderMonatlich))
    expect(GRUENDERPREIS_TEXT).toContain(String(PRICING.standardMonatlich))
  })

  it('der Test-Aufruf nennt die Dauer aus PRICING', () => {
    expect(TESTPHASE_CTA).toContain(String(PRICING.testTage))
    expect(TESTPHASE_CTA).toMatch(/Tage/)
  })
})

describe('CoS-038-A · Regelbesteuerung ist auf dem Preis sichtbar', () => {
  // Sandys Entscheidung vom 17.09.: Verzicht nach § 19 Abs. 2 UStG. Ein
  // B2B-Preis ohne „zzgl. MwSt." ist die Angabe, die Legal 🔴 setzt.
  it('die Preis-Sektion trägt den Netto-Hinweis', () => {
    expect(PREISE_SECTION).toContain('MWST_HINWEIS')
    expect(PREISE_SECTION).toMatch(/zzgl\. MwSt\./)
  })

  it('der Hinweis nennt netto, MwSt. und den Unternehmerbezug', () => {
    expect(MWST_HINWEIS).toMatch(/netto/i)
    expect(MWST_HINWEIS).toMatch(/MwSt\./)
    expect(MWST_HINWEIS).toMatch(/§ 14 BGB/)
  })

  it('keine Kundenfläche behauptet noch die Kleinunternehmerregelung', () => {
    for (const [name, quelle] of KUNDENFLAECHEN) {
      expect(ohneKommentare(quelle), name).not.toMatch(/Kleinunternehmer/i)
    }
  })
})

describe('CoS-038-A · die Grenzen dieses Baus', () => {
  // CoS-038-B, nicht A: „kein Gratis-Kontingent" greift in plan-limit.ts ein
  // — der Sperre, die heute entscheidet, ob ein Betrieb anlegen darf. Solange
  // sie 3 gewährt, muss der angezeigte Satz dieselbe Zahl meinen (DC-045).
  it('die Sperre ist unangetastet und liest dieselbe Zahl', () => {
    expect(PLAN_LIMIT).toContain('PRICING.freeAngeboteProMonat')
    expect(PRICING.freeAngeboteProMonat).toBe(3)
    expect(FREE_KONTINGENT_TEXT.startsWith(String(PRICING.freeAngeboteProMonat))).toBe(true)
  })

  // Die Abo-Seite zeigt zwei verschiedene Preise, weil es zwei gibt. Die
  // Quelle ist dieselbe Spalte, nach der api/stripe/route.ts den Preis wählt.
  it('die Abo-Seite unterscheidet Gründerpreis und Regelpreis', () => {
    const code = ohneKommentare(ABO_SEITE)
    expect(code).toContain('istGruenderpreis')
    expect(code).toContain('PRICING.gruenderMonatlich')
    expect(code).toContain('PRICING.standardMonatlich')
  })

  // ── Sperrklinke — gehört dem Head of Legal, nicht mir ────────────────────
  //
  // AGB § 4.2: „Der Anbieter handelt als Kleinunternehmer gemäß § 19 UStG —
  // es wird keine Umsatzsteuer ausgewiesen." Das ist seit Sandys Entscheidung
  // vom 17.09. falsch (docs/preismodell.md: „Kleinunternehmer-Hinweis
  // entfällt überall — er wäre ab jetzt falsch"). Ein AGB-Wortlaut ist keine
  // Engineering-Entscheidung; die Frage liegt als Notiz in der Legal-Datei
  // (CoS-L-012). Diese Zeile hält das Soll fest und wird grün, sobald Legal
  // den Absatz ersetzt hat.
  it.fails('CoS-038-A-1 · die AGB behaupten die Kleinunternehmerregelung nicht mehr', () => {
    expect(AGB).not.toMatch(/Kleinunternehmer/)
    expect(AGB).not.toMatch(/§ 19 UStG/)
  })
})
