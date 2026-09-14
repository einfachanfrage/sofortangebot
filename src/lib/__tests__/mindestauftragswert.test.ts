import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  mindestauftragsPosition,
  MINDESTAUFTRAGSWERT_ORIENTIERUNG,
} from '../gewerke-config'

// M-2 (Sandy, 14.09.2026 — TN-142): Der Mindestauftragswert ist standardmäßig
// 0. Manfred hatte ihn nie eingestellt und trotzdem die Position „Anfahrt &
// Vorbereitung" in seinen Angeboten: Das Formular trug 180 € vor und schrieb
// sie beim Speichern mit. Seine Einordnung: „die App entscheidet, ich
// unterschreib."

describe('M-2: ohne eigene Einstellung kommt nichts dazu', () => {
  it('nie eingestellt (NULL) heißt aus', () => {
    expect(mindestauftragsPosition(50, null)).toBeNull()
    expect(mindestauftragsPosition(50, undefined)).toBeNull()
  })

  it('0 heißt aus', () => {
    expect(mindestauftragsPosition(50, 0)).toBeNull()
  })

  it('selbst eingetragen heißt an — und rechnet die Differenz, nicht den Wert', () => {
    const pos = mindestauftragsPosition(50, 180)
    expect(pos).not.toBeNull()
    expect(pos!.unit_price).toBe(130)
    expect(pos!.quantity).toBe(1)
  })
})

describe('M-2: die 180 € sind Text, kein Wert', () => {
  const APP = join(process.cwd(), 'src', 'app')

  function alleDateien(dir: string): string[] {
    const raus: string[] = []
    for (const eintrag of readdirSync(dir)) {
      const voll = join(dir, eintrag)
      if (statSync(voll).isDirectory()) raus.push(...alleDateien(voll))
      else if (voll.endsWith('.ts') || voll.endsWith('.tsx')) raus.push(voll)
    }
    return raus
  }

  it('der Orientierungswert wird nirgends als Vorbelegung eingesetzt', () => {
    const suender: string[] = []

    for (const datei of alleDateien(APP)) {
      const inhalt = readFileSync(datei, 'utf-8')
      // Verboten: als Ersatzwert (`?? …`) oder als Feldinhalt (`value={…}`).
      const alsErsatzwert = /\?\?\s*MINDESTAUFTRAGSWERT_ORIENTIERUNG/.test(inhalt)
      const alsFeldinhalt = /value=\{[^}]*MINDESTAUFTRAGSWERT_ORIENTIERUNG/.test(inhalt)
      if (alsErsatzwert || alsFeldinhalt) suender.push(datei.slice(APP.length + 1))
    }

    // Wird dieser Test rot, trägt sich der Orientierungswert wieder selbst
    // ein. Der Weg zurück ist `?? 0` — und die 180 € gehören in den
    // Hilfetext daneben, wo der Handwerker sie lesen und selbst eintragen
    // kann.
    expect(suender).toEqual([])
  })

  it('der Orientierungswert steht weiterhin zur Verfügung — als Zahl im Text', () => {
    expect(MINDESTAUFTRAGSWERT_ORIENTIERUNG).toBe(180)
  })
})
