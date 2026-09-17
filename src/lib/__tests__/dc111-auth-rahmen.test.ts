/**
 * ── DC-111 · Die Anmelde-Seiten teilen sich einen Rahmen ──────────────────
 *
 * Befund (Sandys Klick-Durchlauf, 16.09.2026): Auf einem Desktop-Fenster
 * liefen `/passwort-vergessen` und `/passwort-reset` über die volle
 * Fensterbreite — ein fast meterbreiter „Passwort speichern"-Knopf.
 *
 * Beim Nachsehen trugen ALLE FÜNF Anmelde-Seiten denselben telefonbreiten
 * Rahmen ohne Maximalbreite, an zehn Stellen. Der Rahmen liegt jetzt einmal
 * in `src/app/(auth)/layout.tsx`.
 *
 * Dieser Prüfstand hält genau das fest, was sonst wieder auseinanderläuft:
 * dass keine der fünf Seiten sich einen EIGENEN Rahmen zurückholt. Ein
 * optischer Test wäre hier der ehrlichere, aber ein Bildschirmfoto kann
 * dieser Prüfstand nicht machen — die Bedingung dafür, dass das Layout
 * überhaupt greifen KANN, kann er.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const AUTH = join(__dirname, '..', '..', 'app', '(auth)')
const SEITEN = [
  'login/page.tsx',
  'register/page.tsx',
  'passwort-vergessen/page.tsx',
  'passwort-reset/page.tsx',
  'bestaetigt/page.tsx',
]
const lies = (rel: string) => readFileSync(join(AUTH, rel), 'utf-8')

describe('DC-111 — ein Rahmen für alle fünf Anmelde-Seiten', () => {
  it('das gemeinsame Layout existiert und deckelt die Breite', () => {
    const layout = lies('layout.tsx')
    expect(layout).toContain('min-h-dvh')
    expect(layout).toContain('max-w-sm')
    // Ohne `items-center` stünde der gedeckelte Block linksbündig am
    // Fensterrand — das sähe schlimmer aus als der Zustand davor.
    expect(layout).toContain('items-center')
  })

  it.each(SEITEN)('%s baut sich keinen eigenen Rahmen mehr', seite => {
    const quelle = lies(seite)
    expect(quelle).not.toContain('min-h-dvh')
  })

  it.each(SEITEN)('%s benutzt kein Emoji als Bildmarke', seite => {
    // DC-017 hat die Bildsprache auf Lucide vereinheitlicht; die
    // Anmelde-Seiten waren nie nachgezogen (📬 und 📧 als 5xl-Grafik).
    // Ein Emoji rendert auf jedem Betriebssystem anders und ist in keinem
    // CI-Dokument gedeckt.
    expect(lies(seite)).not.toMatch(/"text-5xl[^"]*">\s*\p{Extended_Pictographic}/u)
  })
})
