// Was der Betrieb liest, wenn die Testphase vorbei ist
// (Head of Marketing, 23.09.2026)
//
// Ausgangspunkt war eine Bitte des Head of Product Engineering: zwei Sätze
// auf Kundenflächen abnehmen, die er nicht selbst schreiben wollte. Die Sätze
// sind in Ordnung. Was NICHT in Ordnung war, ist, was um sie herum stand.
//
// CoS-038-B hat das Monatskontingent entfernt. Die Sperrfläche, die der
// Handwerker beim Kunden zu sehen bekommt, trug den Grund aber weiter in der
// Überschrift: „Dein Monat ist voll" — größer gesetzt als der richtige Grund
// darunter. Der Knopf daneben hieß „Auf Pro upgraden"; „Pro" ist der Name aus
// dem am 03.09. abgelösten Zwei-Tarif-Modell.
//
// Diese Datei hält drei Dinge fest, die sonst niemand misst:
//
//   1. Ein Ding, ein Wort. „Testphase" — nicht „Testzeit", nicht „Probezeit".
//   2. Kein Tarifname aus dem abgelösten Modell auf einer Kundenfläche.
//   3. Der Grund steht nicht zweimal übereinander auf demselben Bildschirm.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { sperrNachricht } from '../plan-limit'
import { TESTPHASE_ENDE_TITEL, TESTPHASE_ENDE_ZUSAGE, ABO_CTA, PRICING } from '../pricing'

const lies = (p: string) => readFileSync(join(process.cwd(), p), 'utf-8')

/** Kommentare weg — die Bauhinweise ZITIEREN die abgelösten Wörter. */
function ohneKommentare(quelle: string): string {
  return quelle
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/^[ \t]*\/\/.*$/gm, ' ')
}

const SPERRFLAECHE = lies('src/app/(app)/angebot/neu/page.tsx')
const ABO_SEITE = lies('src/app/(app)/einstellungen/abo/page.tsx')
const ABO_AKTIONEN = lies('src/app/(app)/einstellungen/abo/AboAktionen.tsx')

const KUNDENFLAECHEN = [
  ['Sperrfläche', SPERRFLAECHE],
  ['Abo-Seite', ABO_SEITE],
  ['Abo-Aktionen', ABO_AKTIONEN],
] as const

describe('Testphase-Ende · ein Ding, ein Wort', () => {
  it('nennt die Sache „Testphase" und sonst nichts', () => {
    expect(TESTPHASE_ENDE_TITEL).toContain('Testphase')
    for (const [name, quelle] of KUNDENFLAECHEN) {
      const code = ohneKommentare(quelle)
      expect(code, name).not.toMatch(/Testzeit/)
      expect(code, name).not.toMatch(/Probezeit/)
    }
  })

  // Die Zahl steht an EINER Stelle. Wer sie im Titel wiederholt, hat zwei.
  it('der Titel trägt keine eigene Zahl', () => {
    expect(TESTPHASE_ENDE_TITEL).not.toMatch(/\d/)
    expect(sperrNachricht()).toContain(`${PRICING.testTage} Tage`)
  })
})

describe('Testphase-Ende · kein Tarifname aus dem abgelösten Modell', () => {
  it('kein Knopf schickt jemanden „auf Pro"', () => {
    expect(ABO_CTA).not.toMatch(/\bPro\b/)
    for (const [name, quelle] of KUNDENFLAECHEN) {
      expect(ohneKommentare(quelle), name).not.toMatch(/Pro upgraden/)
    }
  })

  // Der Grund aus dem Kontingent-Modell. Er darf als Ausweichzweig für eine
  // noch unterwegs befindliche alte Antwort dastehen — aber nicht als der
  // Satz, den ein Betrieb mit abgelaufener Testphase zu sehen bekommt.
  it('„Dein Monat ist voll" steht nicht mehr über der Testphasen-Sperre', () => {
    const code = ohneKommentare(SPERRFLAECHE)
    expect(code).toContain('TESTPHASE_ENDE_TITEL')
    const stelle = code.indexOf('Dein Monat ist voll')
    if (stelle !== -1) {
      // Wenn der alte Satz noch dasteht, dann nur hinter der Verzweigung.
      expect(code.slice(0, stelle)).toContain('testphaseVorbei')
    }
  })
})

describe('Testphase-Ende · der Grund steht nicht zweimal', () => {
  // Der Titel nennt den Grund, die Zusage nennt, was weitergeht. Stünde die
  // volle Sperr-Nachricht unter dem Titel, läse der Betrieb „Deine Testphase
  // ist vorbei" und direkt darunter „Deine 14 Tage zum Testen sind vorbei."
  it('Titel und Zusage sagen Verschiedenes', () => {
    expect(TESTPHASE_ENDE_ZUSAGE).not.toMatch(/vorbei/)
    expect(TESTPHASE_ENDE_TITEL).toMatch(/vorbei/)
  })

  it('beide Flächen setzen die Bausteine ein, statt sie zu tippen', () => {
    for (const [name, quelle] of [['Sperrfläche', SPERRFLAECHE], ['Abo-Seite', ABO_SEITE]] as const) {
      const code = ohneKommentare(quelle)
      expect(code, name).toContain('TESTPHASE_ENDE_ZUSAGE')
      expect(code, name).not.toMatch(/Angefangene Angebote kannst du/)
    }
  })

  // Die Zusage aus DC-045 (06.09.) — Wort für Wort, seit heute an einer Stelle.
  it('die Zusage aus DC-045 ist unverändert', () => {
    expect(TESTPHASE_ENDE_ZUSAGE).toBe(
      'Angefangene Angebote kannst du weiter bearbeiten und versenden — '
      + 'für ein neues brauchst du ein Abo.'
    )
  })
})
