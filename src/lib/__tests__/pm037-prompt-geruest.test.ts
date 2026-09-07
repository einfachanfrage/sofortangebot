import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { normalisiereExtraktion } from '../mengen/extraktion-normalisierer'

// ── PM-037, dritte und vierte Tür (06.09.2026) ────────────────────────────
//
// Der Prüfmeister vermutete, der Prompt fülle `leibungen[]` nicht. Er tut es
// doch — seit jeher, mit eigenem Abschnitt und Beispiel. Der Grund lag eine
// Zeile tiefer: **Das JSON-Gerüst am Ende des Prompts, das dem Modell die
// Antwortform vorgibt, kannte das Feld nicht.** Ein Modell, das der Vorlage
// folgt, lässt es weg — egal wie ausführlich die Regel darüber steht.
//
// Dieselbe Bauform wie die Weißliste im Normalisierer: eine Vorlage, die ein
// dokumentiertes Feld stillschweigend verschluckt. Zwei davon hintereinander,
// beide mit demselben fehlenden Schlüssel.
//
// Dieser Test prüft beide Vorlagen gegen dieselbe Liste. Er ist billig und
// hätte den Fall in Sekunden gefunden.

const PROMPT = readFileSync(
  join(process.cwd(), 'supabase/functions/_shared/prompt-extraktion-v4.ts'),
  'utf8',
)

/** Das JSON-Gerüst am Ende des Prompts — die Antwortform für das Modell. */
function geruestSchluessel(): string[] {
  const treffer = /\{"gewerk":[\s\S]*?"transkript":""\}/.exec(PROMPT)
  if (!treffer) throw new Error('JSON-Gerüst im Prompt nicht gefunden')
  return Object.keys(JSON.parse(treffer[0]))
}

// Felder, die der Prompt ausdrücklich als Top-Level-Feld verlangt.
const TOP_LEVEL_FELDER = ['raeume', 'waende', 'leibungen', 'decken', 'bereiche']

describe('PM-037 — was der Prompt verlangt, muss im Antwort-Gerüst stehen', () => {
  for (const feld of TOP_LEVEL_FELDER) {
    it(`„${feld}" steht im JSON-Gerüst`, () => {
      expect(geruestSchluessel()).toContain(feld)
    })
  }

  it('der Prompt erklärt leibungen[] auch im Fließtext', () => {
    expect(PROMPT).toMatch(/LEIBUNGEN/)
    expect(PROMPT).toMatch(/leibungen\[\]/)
  })
})

describe('PM-037 — und der Normalisierer darf es nicht wieder wegwerfen', () => {
  it('eine vom Modell gelieferte Leibung überlebt die Normalisierung', () => {
    const roh = {
      gewerk: 'maler',
      raeume: [],
      leibungen: [{ typ: 'fenster_innen', anzahl: 2, breite: 1.2, hoehe: 1.0, tiefe: 0.25 }],
    }
    const norm = normalisiereExtraktion(roh)
    expect(norm.leibungen).toEqual([
      { typ: 'fenster_innen', anzahl: 2, breite: 1.2, hoehe: 1.0, tiefe: 0.25 },
    ])
  })

  it('jedes Feld des Gerüsts kommt auch aus dem Normalisierer wieder heraus', () => {
    // Die eigentliche Lehre: Prompt-Vorlage und Normalisierer-Weißliste sind
    // zwei Siebe hintereinander. Wer nur eins erweitert, hat nichts geändert.
    const norm = normalisiereExtraktion({ gewerk: 'maler', raeume: [] }) as unknown as Record<string, unknown>
    for (const feld of TOP_LEVEL_FELDER) {
      expect(Object.keys(norm)).toContain(feld)
    }
  })
})
