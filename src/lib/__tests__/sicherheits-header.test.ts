// Sicherheits-Header (CoS-037, 03.09.2026)
//
// Vorgeschichte: `next.config.ts` hatte gar keinen `headers()`-Block. Live
// ankam nur Vercels Standard-HSTS ohne `includeSubDomains` — niemandem
// aufgefallen, weil ein fehlender Header nichts kaputt macht, sondern nur
// weniger schützt. Genau deshalb steht er jetzt in einem Test: Wer den Block
// beim nächsten Umbau der Konfiguration verliert, merkt es sofort.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const CONFIG = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf-8')

describe('Strict-Transport-Security', () => {
  it('wird überhaupt gesetzt', () => {
    expect(CONFIG).toMatch(/async headers\(\)/)
    expect(CONFIG).toContain('Strict-Transport-Security')
  })

  it('gilt für alle Pfade', () => {
    expect(CONFIG).toMatch(/source: '\/\(\.\*\)'/)
  })

  it('enthält includeSubDomains und preload', () => {
    expect(CONFIG).toContain('includeSubDomains')
    expect(CONFIG).toContain('preload')
  })

  it('hält die Mindestlaufzeit für die Preload-Liste ein (ein Jahr)', () => {
    const treffer = CONFIG.match(/max-age=(\d+)/)
    expect(treffer).not.toBeNull()
    expect(Number(treffer![1])).toBeGreaterThanOrEqual(31536000)
  })
})
