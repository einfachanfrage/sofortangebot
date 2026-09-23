// CoS-038-B — die Sperre ist die Testphase, nicht ein Kontingent
// (Head of Product Engineering, 23.09.2026)
//
// CoS-038-A hat den Preis und die Texte drumherum auf das beschlossene Modell
// gebracht und dabei eine Schieflage BEWUSST stehen lassen: `plan-limit.ts`
// gewährte weiter 3 neu angelegte Angebote pro Monat, beworben wurde das
// nicht mehr. Die Seite versprach also weniger, als das Produkt gewährte —
// die harmlose Richtung, aber ein Widerspruch.
//
// B löst ihn auf. Die Regel steht nicht von mir, sondern vom Platform &
// Integrations Engineer, im Handoff zu CoS-P-007 (06.09.) wörtlich:
//
//   gesperrt (neues Angebot anlegen), wenn `plan === 'starter'` UND
//   `trial_ends_at` gesetzt UND `trial_ends_at < jetzt`. Firmen mit
//   `trial_ends_at = NULL` sind Bestandskonten und von der Sperre ausgenommen.
//
// Diese Datei hält vier Dinge fest:
//
//   1. Die Regel selbst, an ihren Rändern — heute ablaufend, gestern
//      abgelaufen, Bestandskonto, kaputter Wert.
//   2. Dass die beiden Anlege-Wege EINE Funktion lesen. Zwei Regeln an zwei
//      Routen waren der Befund von DC-045; das darf nicht zurückkommen.
//   3. Dass das Kontingent aus dem Code verschwunden ist — nicht auf 0
//      gesetzt, sondern weg.
//   4. Dass die 14 Tage überall aus PRICING kommen und keine Kundenfläche
//      mehr ein Gratis-Kontingent behauptet. Das ist die Sorge aus CoS-M-010,
//      umgezogen von der Kontingent-Zahl auf die Testtage.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { bewerteTestphase, sperrNachricht } from '../plan-limit'
import { PRICING, TESTPHASE_CTA } from '../pricing'

const lies = (p: string) => readFileSync(join(process.cwd(), p), 'utf-8')

/**
 * Kommentare weg, bevor gemessen wird. Die Bauhinweise in den geänderten
 * Dateien ZITIEREN das abgelöste Kontingent („hier stand X von 3"). Ohne
 * diesen Schritt läse der Test den Beleg für die Korrektur als Rückschritt —
 * und wer ihn grün bekommen will, löscht die Begründung.
 */
function ohneKommentare(quelle: string): string {
  return quelle
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^[ \t]*\/\/.*$/gm, ' ')
}

const PLAN_LIMIT = lies('src/lib/plan-limit.ts')
const PRICING_QUELLE = lies('src/lib/pricing.ts')
const ROUTE_ENTWURF = lies('src/app/api/entwurf/neu/route.ts')
const ROUTE_DUPLIKAT = lies('src/app/api/quotes/create/route.ts')
const DATEN_ABO = lies('src/data/abo.ts')
const ABO_SEITE = lies('src/app/(app)/einstellungen/abo/page.tsx')
const PLAN_MODAL = lies('src/components/PlanWahlModal.tsx')
const PREISE_SECTION = lies('src/components/landing/PreiseSection.tsx')

/** Jede Fläche, auf der ein Kunde ein Versprechen über den Umfang liest. */
const KUNDENFLAECHEN: Array<[string, string]> = [
  ['PreiseSection', PREISE_SECTION],
  ['PlanWahlModal', PLAN_MODAL],
  ['Abo-Seite', ABO_SEITE],
]

const JETZT = new Date('2026-09-23T10:00:00.000Z')
const versetzt = (ms: number) => new Date(JETZT.getTime() + ms).toISOString()
const TAG = 24 * 60 * 60 * 1000

describe('CoS-038-B · die Regel an ihren Rändern', () => {
  it('eine Sekunde vor Ablauf ist offen, eine Sekunde danach gesperrt', () => {
    expect(bewerteTestphase('starter', versetzt(1000), JETZT).gesperrt).toBe(false)
    expect(bewerteTestphase('starter', versetzt(-1000), JETZT).gesperrt).toBe(true)
  })

  // Der Grenzfall, den eine Sperre am ehesten falsch macht: der Moment selbst.
  // `<=` ist Absicht — wer bis 10:00 testen darf, hat um 10:00 ausgetestet.
  it('der Ablaufzeitpunkt selbst sperrt', () => {
    expect(bewerteTestphase('starter', JETZT.toISOString(), JETZT).gesperrt).toBe(true)
  })

  it('tageRestlich zählt volle Tage und wird negativ, wenn es vorbei ist', () => {
    expect(bewerteTestphase('starter', versetzt(14 * TAG), JETZT).tageRestlich).toBe(14)
    expect(bewerteTestphase('starter', versetzt(1.5 * TAG), JETZT).tageRestlich).toBe(1)
    expect(bewerteTestphase('starter', versetzt(0.5 * TAG), JETZT).tageRestlich).toBe(0)
    expect(bewerteTestphase('starter', versetzt(-2 * TAG), JETZT).tageRestlich).toBe(-2)
  })

  it('Pro und Bestandskonto haben gar keine Testphase', () => {
    expect(bewerteTestphase('pro', versetzt(-9 * TAG), JETZT).testEndeISO).toBeNull()
    expect(bewerteTestphase('starter', null, JETZT).istBestandskonto).toBe(true)
    expect(bewerteTestphase('starter', undefined, JETZT).gesperrt).toBe(false)
  })

  // Ein kaputter Wert in einer Spalte darf niemanden vor dem Kunden
  // aussperren. Dieselbe Vorsicht wie bei `baustelle_id` in den Insert-Routen.
  it('ein unlesbares Datum sperrt nicht', () => {
    const stand = bewerteTestphase('starter', '31.02.2026', JETZT)
    expect(stand.gesperrt).toBe(false)
    expect(stand.grund).toBe('keine')
  })
})

describe('CoS-038-B · eine Regel, nicht zwei', () => {
  // DC-045s Befund war, dass zwei Anlege-Wege zwei verschiedene Grenzen
  // hatten (5 auf der einen, gar keine auf der anderen). Das darf beim
  // Modellwechsel nicht zurückkommen.
  it('beide Anlege-Wege rufen dieselbe Funktion', () => {
    for (const [name, quelle] of [['entwurf/neu', ROUTE_ENTWURF], ['quotes/create', ROUTE_DUPLIKAT]] as const) {
      expect(ohneKommentare(quelle), name).toContain('pruefeAngebotsSperre')
      expect(ohneKommentare(quelle), name).toContain('sperre.gesperrt')
    }
  })

  it('die Abo-Seite liest denselben Stand, der auch sperrt', () => {
    expect(ohneKommentare(DATEN_ABO)).toContain('pruefeAngebotsSperre')
  })

  // Die Sperre lädt `plan` und `trial_ends_at` selbst, statt sie sich von der
  // Route durchreichen zu lassen. Sonst muss jede Route daran denken, die
  // Spalte in ihr `select` aufzunehmen — und die erste, die es vergisst,
  // sperrt niemanden mehr, ohne dass es auffällt.
  it('die Sperre holt ihre Spalten selbst', () => {
    const code = ohneKommentare(PLAN_LIMIT)
    expect(code).toContain("from('companies')")
    expect(code).toContain('trial_ends_at')
  })
})

describe('CoS-038-B · das Kontingent ist weg, nicht auf 0', () => {
  it('die Preisliste trägt keine Kontingent-Zahl mehr', () => {
    expect('freeAngeboteProMonat' in PRICING).toBe(false)
    expect(ohneKommentare(PRICING_QUELLE)).not.toContain('freeAngeboteProMonat')
    expect(ohneKommentare(PRICING_QUELLE)).not.toContain('FREE_KONTINGENT_TEXT')
  })

  it('die Sperre zählt keine Monatsangebote mehr', () => {
    const code = ohneKommentare(PLAN_LIMIT)
    expect(code).not.toContain('freeAngeboteProMonat')
    expect(code).not.toContain('pruefeAngebotsLimit')
  })

  // Die Zählung bleibt — aber nur als Auskunft auf der Abo-Seite. Sie darf
  // nirgends mehr über ein `>=` in eine Sperre münden.
  it('die Zählung ist Anzeige und trägt keine Grenze', () => {
    expect(ohneKommentare(PLAN_LIMIT)).toContain('zaehleNeueAngeboteDiesenMonat')
    expect(ohneKommentare(DATEN_ABO)).not.toContain('freikontingent')
    expect(ohneKommentare(ABO_SEITE)).not.toContain('freikontingent')
  })
})

describe('CoS-038-B · was der Kunde liest', () => {
  it('keine Kundenfläche verspricht noch ein Gratis-Kontingent', () => {
    for (const [name, quelle] of KUNDENFLAECHEN) {
      const code = ohneKommentare(quelle)
      expect(code, name).not.toMatch(/Angebote (gratis|kostenlos)/i)
      expect(code, name).not.toMatch(/Freikontingent/i)
      expect(code, name).not.toMatch(/\bvon \$\{?freikontingent/i)
    }
  })

  // Die 14 stehen an EINER Stelle. Genau daran ist der Preis schon einmal
  // auseinandergelaufen (CoS-001/DC-001: drei Quellen, drei Zahlen).
  it('die Testtage kommen überall aus PRICING', () => {
    expect(PRICING.testTage).toBe(14)
    expect(TESTPHASE_CTA).toContain(String(PRICING.testTage))
    expect(sperrNachricht()).toContain(`${PRICING.testTage} Tage`)
    for (const [name, quelle] of [['PlanWahlModal', PLAN_MODAL], ['plan-limit', PLAN_LIMIT]] as const) {
      expect(ohneKommentare(quelle), name).not.toMatch(/\b14 Tage\b/)
    }
  })

  // Die Zusage aus DC-045, Wort für Wort unverändert: niemand bleibt beim
  // Kunden hängen. Sie steht in der Sperr-Nachricht UND auf der Abo-Seite.
  it('beide Stellen sagen, dass Angefangenes weitergeht', () => {
    expect(sperrNachricht()).toMatch(/weiter bearbeiten und versenden/)
    expect(ohneKommentare(ABO_SEITE)).toMatch(/weiter bearbeiten und versenden/)
  })

  // Der Nutzer muss sehen können, wie lange er noch hat — sonst ist der
  // erste Hinweis auf das Ende der Testphase die Sperre selbst.
  it('die Abo-Seite zeigt den Stand der Testphase', () => {
    const code = ohneKommentare(ABO_SEITE)
    expect(code).toContain('testTageRestlich')
    expect(code).toContain('testEndeISO')
  })

  // „Starter — kostenlos" war die Beschriftung eines Dauer-Gratis-Tarifs.
  // Ein Wort, aber es sagt dasselbe wie das gestrichene Kontingent.
  it('der Starter-Plan wird nicht mehr als kostenlos beschriftet', () => {
    expect(ohneKommentare(ABO_SEITE)).not.toContain("'kostenlos'")
  })
})
