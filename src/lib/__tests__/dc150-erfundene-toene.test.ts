// DC-150 (24.09.2026) — der Nachtrag zu DC-149 §7: dieselben zwei erfundenen
// Hex-Werte lebten ausserhalb der Status-Quelle weiter (11× #8B7000 in 7
// Dateien, 12× #1A7A38/#EDFAF0 in 4). Der Test prueft drei Zusicherungen,
// alle mechanisch — keine davon glaubt einer Zahl aus design-check.md:
//   1. Die drei erfundenen Werte kommen in src/ nur noch in Kommentaren vor,
//      die erklaeren, warum es sie nicht mehr gibt.
//   2. Jede Klasse, die an ihre Stelle getreten ist, referenziert einen
//      existierenden --color-Token aus globals.css (Waisenkind-Pruefung).
//   3. Jedes Text/Flaeche-Paar, das dabei entstanden ist, haelt die
//      Handbuch-Grenze von 4,5:1 (S. 05, "Fliesstext mindestens 4,5:1").
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const wurzel = process.cwd()
const css = readFileSync(join(wurzel, 'src/app/globals.css'), 'utf-8')

/** Alle `--color-x: #hex` aus globals.css, als Utility-Name → Hex. */
const TOKENS: Record<string, string> = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2].toUpperCase()]),
)

function kanal(v: number): number {
  const c = v / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
function leuchtdichte(hex: string): number {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b)
}
function kontrast(a: string, b: string): number {
  const [x, y] = [leuchtdichte(a), leuchtdichte(b)]
  const [hoch, tief] = x > y ? [x, y] : [y, x]
  return (hoch + 0.05) / (tief + 0.05)
}
/** "text-success" → "#4F6B45". Wirft, wenn die Klasse keinen Token trifft. */
function farbe(klasse: string): string {
  const name = klasse.replace(/^(?:bg|text|border)-/, '')
  const hex = TOKENS[name]
  expect(hex, `für "${klasse}" gibt es keinen --color-${name} in globals.css`).toBeTruthy()
  return hex
}

function tsxDateien(dir: string, treffer: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) tsxDateien(p, treffer)
    else if (/\.(tsx|ts)$/.test(e)) treffer.push(p)
  }
  return treffer
}

const ERFUNDEN = ['#8B7000', '#1A7A38', '#EDFAF0']

describe('DC-150 — die erfundenen Töne stehen nur noch in Kommentaren', () => {
  // Diese Datei selbst nennt die drei Werte als Prüfkonstanten — sie ist die
  // einzige Ausnahme und wird deshalb aus dem Lauf genommen.
  const dateien = tsxDateien(join(wurzel, 'src')).filter((p) => !p.endsWith('dc150-erfundene-toene.test.ts'))

  /**
   * Ersetzt jeden Kommentar durch Leerzeichen gleicher Länge — Zeilennummern
   * bleiben dadurch erhalten. Ein erklärender Kommentar darf die drei Werte
   * weiter nennen; eine Codezeile nicht.
   */
  function ohneKommentare(quelle: string): string {
    return quelle.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '))
  }

  for (const wert of ERFUNDEN) {
    it(`${wert} kommt in keiner Codezeile mehr vor`, () => {
      const stellen: string[] = []
      for (const datei of dateien) {
        ohneKommentare(readFileSync(datei, 'utf-8'))
          .split('\n')
          .forEach((zeile, i) => {
            if (!zeile.toUpperCase().includes(wert)) return
            stellen.push(`${datei.slice(wurzel.length + 1)}:${i + 1}`)
          })
      }
      expect(stellen, `noch im Code: ${stellen.join(', ')}`).toEqual([])
    })
  }
})

describe('DC-150 — jede Ersatzklasse ist eine benannte Rolle', () => {
  for (const k of ['bg-success-wash', 'text-success', 'bg-danger-wash', 'text-danger', 'bg-yellow-100', 'border-yellow-300', 'text-anthracite']) {
    it(`${k} hat einen Token in globals.css`, () => {
      expect(farbe(k)).toMatch(/^#[0-9A-F]{6}$/)
    })
  }
})

describe('DC-150 — gemessen, nicht geschätzt', () => {
  // Jedes Paar, das dieses Ticket gesetzt hat: [Was, Textklasse, Flächenklasse]
  const PAARE: Array<[string, string, string]> = [
    ['Entwurf-Badge "✓ Fertig"', 'text-success', 'bg-success-wash'],
    ['Entwurf-Badge "Verarbeitung…"', 'text-anthracite', 'bg-yellow-100'],
    ['Entwurf-Badge "Fehler"', 'text-danger', 'bg-danger-wash'],
    ['Positionszeile "Wird berechnet"', 'text-anthracite', 'bg-yellow-100'],
    ['Aufnahme-Banner, Ton "success"', 'text-success', 'bg-success-wash'],
    ['Aufnahme-Banner, Ton "mixed"', 'text-anthracite', 'bg-yellow-100'],
    ['Plan-Pille im AvatarSheet', 'text-anthracite', 'bg-yellow-100'],
    ['Filter-Zahl, inaktiv', 'text-anthracite', 'bg-yellow-100'],
    ['Filter-Zahl, aktiv', 'text-anthracite', 'bg-yellow'],
    ['Landing: "Für Maler und Bodenleger"', 'text-anthracite', 'bg-yellow-100'],
    ['Landing: "GERECHNET, NICHT GESCHÄTZT"', 'text-anthracite', 'bg-yellow-100'],
    ['Landing: "✓ Geprüft"', 'text-success', 'bg-success-wash'],
    ['Grundriss: "Form geschlossen"', 'text-success', 'bg-success-wash'],
  ]

  for (const [was, text, flaeche] of PAARE) {
    it(`${was}: ${text} auf ${flaeche} hält 4,5:1`, () => {
      expect(kontrast(farbe(text), farbe(flaeche))).toBeGreaterThanOrEqual(4.5)
    })
  }

  // Texte, die auf der Seite bzw. auf einer weißen Karte stehen, ohne eigene Fläche.
  const AUF_FLAECHE: Array<[string, string, string]> = [
    ['Dashboard "X Angebote angenommen"', 'text-success', 'bg-white'],
    ['Versand-Hinweis "keine E-Mail-Adresse"', 'text-anthracite', 'bg-white'],
    ['Entwurf "Raum erkannt"', 'text-success', 'bg-white'],
    ['Entwurf "Raum erkannt" auf der Seite', 'text-success', 'bg-bg'],
  ]
  for (const [was, text, flaeche] of AUF_FLAECHE) {
    it(`${was}: ${text} auf ${flaeche} hält 4,5:1`, () => {
      expect(kontrast(farbe(text), farbe(flaeche))).toBeGreaterThanOrEqual(4.5)
    })
  }

  it('die gelbe Hinweis-Fläche bleibt leiser als der eine erlaubte gelbe Badge (Gelb 300)', () => {
    const seite = farbe('bg-bg')
    expect(kontrast(farbe('bg-yellow-100'), seite)).toBeLessThan(kontrast(farbe('bg-yellow-300'), seite))
  })

  it('aktive und inaktive Filter-Zahl bleiben über die Fläche unterscheidbar', () => {
    const seite = farbe('bg-bg')
    const aktiv = kontrast(farbe('bg-yellow'), seite)
    const inaktiv = kontrast(farbe('bg-yellow-100'), seite)
    expect(aktiv / inaktiv).toBeGreaterThanOrEqual(1.5)
  })
})
