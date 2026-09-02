// Datenminimierung (Head of Product Engineering, 2026-09-02)
//
// Vorgeschichte: Am 07.08.2026 wurde für die Suche nach dem Multi-Raum-Bug
// eine Debug-Tabelle angelegt — mit dem Vorsatz „wieder entfernen sobald
// geklärt", direkt im Code notiert. Der Bug war nach Tagen geklärt, die
// Tabelle schrieb noch fast einen Monat weiter: jedes Transkript und jede
// rohe KI-Antwort, also Kundennamen, Adressen und Gesprächsinhalte aus
// fremden Wohnungen. Zehn Tage davon sogar ohne Zugriffsschutz.
//
// Ein Vorsatz im Kommentar hat das nicht verhindert. Ein Test verhindert es.
import { describe, it, expect } from 'vitest'
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

function quelldateien(wurzeln: string[]): { pfad: string; inhalt: string }[] {
  const treffer: { pfad: string; inhalt: string }[] = []
  const lauf = (dir: string) => {
    let eintraege: string[]
    try { eintraege = readdirSync(dir) } catch { return }
    for (const name of eintraege) {
      if (name === 'node_modules' || name === '__tests__' || name.startsWith('.')) continue
      const pfad = join(dir, name)
      if (statSync(pfad).isDirectory()) lauf(pfad)
      else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) {
        treffer.push({ pfad, inhalt: readFileSync(pfad, 'utf-8') })
      }
    }
  }
  for (const w of wurzeln) lauf(join(process.cwd(), w))
  return treffer
}

const DATEIEN = quelldateien(['src', 'supabase/functions'])

describe('Keine Debug-Rohdaten in Produktion', () => {
  it('findet überhaupt Quelldateien (Selbsttest)', () => {
    expect(DATEIEN.length).toBeGreaterThan(50)
  })

  it('schreibt nirgends in eine Tabelle, deren Name mit debug_ beginnt', () => {
    // Deckt auch eine neue Debug-Tabelle unter anderem Namen ab — der Punkt
    // ist die Sorte Tabelle, nicht dieser eine Name.
    const treffer = DATEIEN.filter(d => /\.from\(\s*['"`]debug_/.test(d.inhalt))
    expect(treffer.map(t => t.pfad)).toEqual([])
  })

  it('greift nirgends mehr auf debug_extraktion_roh zu', () => {
    // Kommentare dürfen die Tabelle erwähnen — sie erklären, woher unser
    // Wissen über echte Extraktionen stammt. Zugriffe dürfen es nicht.
    const zugriffe = DATEIEN.filter(d =>
      /(?:from|table)\(\s*['"`]debug_extraktion_roh['"`]/.test(d.inhalt),
    )
    expect(zugriffe.map(z => z.pfad)).toEqual([])
  })

  it('protokolliert kein vollständiges Transkript in eine Tabelle', () => {
    // Der konkrete Insert sah so aus: { user_id, transkript, raw_result }.
    // Wer das wieder braucht, soll es bewusst tun — nicht versehentlich.
    // [^}] deckt Zeilenumbrüche mit ab — kein s-Flag nötig (und nicht erlaubt).
    const treffer = DATEIEN.filter(d => /insert\(\s*\{[^}]*\braw_result\b/.test(d.inhalt))
    expect(treffer.map(t => t.pfad)).toEqual([])
  })
})
