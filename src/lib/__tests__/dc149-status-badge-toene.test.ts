// DC-149 (23.09.2026) — die Badge-Töne der Status-Quelle, die letzte offene
// Zeile aus DC-049. Der Test prüft nicht "sieht schön aus", sondern die zwei
// Zusicherungen, an denen die Änderung hängt:
//   1. Jeder Farbwert ist eine benannte Rolle aus globals.css — kein roher
//      Hex-Wert, keine Tailwind-Vorgabe (blue-50, red-700, gray-100 …).
//      Das ist zugleich die Waisenkind-Prüfung: eine Utility ohne Token wäre
//      im fertigen Stylesheet eine Klasse ohne Farbe.
//   2. Jede Kombination hält die Kontrastgrenze des Handbuchs (S. 05:
//      "Fließtext mindestens 4,5:1 gegen seinen Untergrund"), und jede
//      Badge-Fläche hebt sich mit mindestens 3:1 vom anthraziten
//      App-Header ab (DC-072: dort war "Entwurf" vorher unsichtbar).
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { STATUS_CONFIG } from '@/lib/status'

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf-8')

/** Alle `--color-x: #hex` aus dem @theme-inline-Block, als Utility-Name → Hex. */
const TOKENS: Record<string, string> = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2].toUpperCase()]),
)

const ANTHRAZIT_HEADER = '#2C2C2C'

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

/** "bg-sunken" → "#F1F1EE". Wirft, wenn die Klasse keine Rolle referenziert. */
function farbeVon(klasse: string, praefix: 'bg' | 'text'): string {
  const name = klasse.slice(praefix.length + 1)
  expect(klasse.startsWith(`${praefix}-`), `${klasse} ist keine ${praefix}-Utility`).toBe(true)
  expect(name).not.toMatch(/^\[/) // bg-[#FEF9C3] — roher Hex-Wert
  expect(name).not.toMatch(/\//) // text-anthracite/50 — Deckkraft statt Farbstufe
  const hex = TOKENS[name]
  expect(hex, `für "${klasse}" gibt es keinen --color-${name} in globals.css`).toBeTruthy()
  return hex
}

describe('DC-149 — jeder Badge-Ton ist eine Rolle aus dem Handbuch', () => {
  for (const [status, info] of Object.entries(STATUS_CONFIG)) {
    it(`${status} ("${info.label}") nutzt nur benannte Rollen`, () => {
      farbeVon(info.bg, 'bg')
      farbeVon(info.text, 'text')
    })
  }

  it('kennt keinen Tailwind-Vorgabeton mehr', () => {
    const vorgaben = /-(?:blue|red|green|gray|grey|slate|zinc|amber|emerald|indigo)-\d{2,3}\b/
    for (const [status, info] of Object.entries(STATUS_CONFIG)) {
      expect(`${info.bg} ${info.text} ${info.aufDunkel}`, status).not.toMatch(vorgaben)
    }
  })
})

describe('DC-149 — gemessen, nicht geschätzt', () => {
  for (const [status, info] of Object.entries(STATUS_CONFIG)) {
    it(`${status}: Text auf der Fläche hält 4,5:1`, () => {
      const wert = kontrast(farbeVon(info.text, 'text'), farbeVon(info.bg, 'bg'))
      expect(wert, `${info.text} auf ${info.bg} = ${wert.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
    })

    it(`${status}: Fläche hebt sich mit 3:1 vom anthraziten Header ab`, () => {
      const wert = kontrast(farbeVon(info.bg, 'bg'), ANTHRAZIT_HEADER)
      expect(wert, `${info.bg} auf ${ANTHRAZIT_HEADER} = ${wert.toFixed(2)}:1`).toBeGreaterThanOrEqual(3)
    })
  }
})

describe('DC-149 — die Handbuch-Regeln, die die Wahl entschieden haben', () => {
  it('stellt auf Gelb immer Anthrazit, nie einen zweiten Gelbton (S. 05)', () => {
    expect(STATUS_CONFIG.bereit.bg).toBe('bg-yellow-300')
    expect(STATUS_CONFIG.bereit.text).toBe('text-anthracite')
  })

  it('nutzt als Fläche nur Seite, Sunken, Gelb oder eine Wash — nie einen Rahmen-Ton', () => {
    const erlaubt = ['bg-bg', 'bg-sunken', 'bg-white', 'bg-yellow-300', 'bg-success-wash', 'bg-danger-wash']
    for (const [status, info] of Object.entries(STATUS_CONFIG)) {
      expect(erlaubt, `${status} liegt auf ${info.bg}`).toContain(info.bg)
    }
  })

  it('färbt nur die drei Status mit echtem Ausgang', () => {
    const farbig = Object.entries(STATUS_CONFIG)
      .filter(([, i]) => i.bg !== 'bg-sunken' && i.bg !== 'bg-bg')
      .map(([s]) => s)
      .sort()
    expect(farbig).toEqual(['accepted', 'bereit', 'rejected'])
  })
})

describe('DC-149 — die dunkle Fläche braucht keinen Sonderweg mehr (DC-072)', () => {
  for (const [status, info] of Object.entries(STATUS_CONFIG)) {
    it(`${status}: aufDunkel ist wörtlich bg + text`, () => {
      expect(info.aufDunkel).toBe(`${info.bg} ${info.text}`)
    })
  }
})
