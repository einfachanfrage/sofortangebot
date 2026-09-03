// Onboarding-Weiche (Zuarbeit für den Product Designer, 02.09.2026)
//
// Vorher waren „noch nie angefangen" und „angefangen, aber Firmenname leer"
// in der Datenbank derselbe Zustand. Ein „Später fertigstellen"-Link hätte
// den Nutzer sofort wieder ins Onboarding geworfen. Diese Tests halten die
// vier Fälle auseinander — inklusive der Falle, an der ich beim Bauen selbst
// hängengeblieben bin: `requireCompany()` wählte die neue Spalte gar nicht
// aus, die Prüfung wäre stumm wirkungslos geblieben.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Dieselbe Bedingung wie in getDashboardData — hier isoliert prüfbar. */
function mussInsOnboarding(company: { name?: string | null; onboarding_started_at?: string | null }): boolean {
  return !company.name && !Boolean(company.onboarding_started_at)
}

describe('Wer wird ins Onboarding umgeleitet?', () => {
  it('nie angefangen (kein Name, kein Startzeitpunkt) → ja', () => {
    expect(mussInsOnboarding({ name: null, onboarding_started_at: null })).toBe(true)
  })

  it('angefangen, aber Name noch leer → nein, das Dashboard zeigt einen Hinweis', () => {
    expect(mussInsOnboarding({ name: '', onboarding_started_at: '2026-09-02T10:00:00Z' })).toBe(false)
  })

  it('fertig (Name vorhanden) → nein', () => {
    expect(mussInsOnboarding({ name: 'Malerbetrieb Holm', onboarding_started_at: null })).toBe(false)
  })

  it('Bestandskonten ohne Startzeitpunkt verhalten sich wie bisher', () => {
    // Kein Backfill: alle bestehenden Zeilen sind NULL. Wer keinen Namen hat,
    // wird weiterhin umgeleitet — die Migration ändert für sie nichts.
    expect(mussInsOnboarding({ name: null })).toBe(true)
    expect(mussInsOnboarding({ name: 'Betrieb' })).toBe(false)
  })
})

describe('Die Spalte wird auch wirklich geladen', () => {
  it('requireCompany() wählt onboarding_started_at mit aus', () => {
    // Ohne diese Zeile wäre der Wert immer undefined und die Weiche oben
    // stillschweigend wirkungslos. Genau das war der erste Versuch.
    const auth = readFileSync(join(process.cwd(), 'src/data/auth.ts'), 'utf-8')
    expect(auth).toMatch(/\.select\('id, name, plan, onboarding_started_at'\)/)
  })

  it('getDashboardData prüft beide Bedingungen, nicht nur den Namen', () => {
    const dash = readFileSync(join(process.cwd(), 'src/data/dashboard.ts'), 'utf-8')
    expect(dash).toMatch(/onboarding_started_at/)
    expect(dash).toMatch(/!company\.name && !onboardingBegonnen/)
  })
})
