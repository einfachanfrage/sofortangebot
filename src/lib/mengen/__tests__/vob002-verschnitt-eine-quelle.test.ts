import { describe, it, expect } from 'vitest'
import { berechneMengen } from '../engine'
import { berechneBewertung } from '../bewertung'
import { FLIESEN_VERSCHNITT_BODEN, FLIESEN_VERSCHNITT_WAND } from '../gewerke/fliesen'

// VOB-002 (Head of Legal, 04.09.2026) — ein Wert, eine Stelle.
//
// Der Verschnittsatz stand an vier Stellen mit drei verschiedenen Werten. Am
// gefährlichsten: Die Engine rechnete 5 %, und in denselben Angebotsdaten stand
// als Annahme „Belagverschnitt: 10 %". Head of Legal dazu: Wenn ein Endkunde
// das nachrechnet, geht es nicht mehr um 5 % Material, sondern um die
// Glaubwürdigkeit des ganzen Angebots.
//
// Diese Tests prüfen nicht einzelne Zahlen, sondern die EIGENSCHAFT: Was in der
// Annahme steht, muss zu dem passen, was gerechnet wurde. Ändert jemand den
// Satz an der Quelle, bleiben sie grün — schreibt jemand ihn irgendwo neu hin,
// nicht.

function angebot(raum: Record<string, unknown>, transkript: string) {
  const extraktion = {
    gewerk: 'boden_parkett',
    raeume: [{ hoehe: null, flaeche: null, fenster: [], tueren: [], vage: false, ...raum }],
    bereiche: [], waende: [], decken: [], objekte: [], annahmen: [], transkript,
  } as never
  const mengen = berechneMengen('boden_parkett', extraktion)
  return { mengen, bewertung: berechneBewertung(extraktion, mengen) }
}

const satzAusTitel = (titel: string) => titel.match(/(\d+)\s*%/)?.[1] ?? '0'
const satzAusAnnahme = (annahmen: string[]) =>
  annahmen.find(a => /Belagverschnitt/.test(a))?.match(/(\d+)\s*%/)?.[1] ?? null

describe('VOB-002 — die Annahme sagt, was die Engine gerechnet hat', () => {
  it('Laminat gerade: Position und Annahme nennen denselben Satz', () => {
    const { mengen, bewertung } = angebot(
      { name: 'Flur', laenge: 5, breite: 4, belag: 'laminat', verlegerichtung: 'standard', arbeiten: ['laminat verlegen'] },
      'Flur 5 mal 4, Laminat gerade verlegt.',
    )
    const titel = mengen.positionen.find(p => /verlegen/i.test(p.beschreibung))!.beschreibung
    expect(satzAusTitel(titel)).toBe('5')
    expect(satzAusAnnahme(bewertung.annahmen)).toBe('5')
  })

  it('Fischgrät: beide sagen 15 %', () => {
    const { mengen, bewertung } = angebot(
      { name: 'Wohnzimmer', laenge: 6, breite: 4.5, belag: 'parkett', verlegerichtung: 'fischgrät', arbeiten: ['parkett verlegen'] },
      'Wohnzimmer 6 mal 4,5, Parkett im Fischgrätmuster.',
    )
    const titel = mengen.positionen.find(p => /verlegen/i.test(p.beschreibung))!.beschreibung
    expect(satzAusTitel(titel)).toBe('15')
    expect(satzAusAnnahme(bewertung.annahmen)).toBe('15')
  })

  it('Teppich: 0 % — und die Annahme behauptet keinen Verschnitt, den es nicht gibt', () => {
    const { mengen, bewertung } = angebot(
      { name: 'Schlafzimmer', laenge: 4, breite: 3.5, belag: 'teppich', verlegerichtung: 'standard', arbeiten: ['teppich verlegen'] },
      'Schlafzimmer 4 mal 3,5, Teppich Bahnenware.',
    )
    const pos = mengen.positionen.find(p => /verlegen/i.test(p.beschreibung))!
    expect(pos.menge).toBe(14) // keine Aufschlagsmenge
    expect(pos.beschreibung).not.toMatch(/Verschnitt/)
    expect(satzAusAnnahme(bewertung.annahmen)).toBe('0')
  })

  it('die alte feste Behauptung „10 %" steht nirgends mehr im Bodenangebot', () => {
    const { bewertung } = angebot(
      { name: 'Flur', laenge: 5, breite: 4, belag: 'vinyl', verlegerichtung: 'standard', arbeiten: ['vinyl verlegen'] },
      'Flur 5 mal 4, Vinyl gerade verlegt.',
    )
    expect(bewertung.annahmen.some(a => /Belagverschnitt: 10\s*%/.test(a))).toBe(false)
  })
})

describe('VOB-002 — Fliesen: Rechnung und Text aus derselben Konstante', () => {
  it('Bodenfliesen rechnen mit der Konstante und schreiben sie auch hin', () => {
    const mengen = berechneMengen('fliesen', {
      gewerk: 'fliesen',
      bereiche: [{ name: 'Bad', typ: 'boden', laenge: 3, breite: 2, nassbereich: false, arbeiten: ['fliesen verlegen'] }],
      raeume: [], waende: [], decken: [], objekte: [], annahmen: [], transkript: 'Bad 3 mal 2 fliesen.',
    } as never)
    const pos = mengen.positionen.find(p => /Bodenfliesen verlegen/i.test(p.beschreibung))
    expect(pos?.menge).toBe(Math.round(6 * (1 + FLIESEN_VERSCHNITT_BODEN) * 100) / 100)
    expect(pos?.berechnungsweg).toContain(`${Math.round(FLIESEN_VERSCHNITT_BODEN * 100)} %`)
  })

  it('die beiden Fliesen-Sätze stehen als benannte Konstanten, nicht als Zahl im Text', () => {
    expect(FLIESEN_VERSCHNITT_BODEN).toBe(0.1)
    expect(FLIESEN_VERSCHNITT_WAND).toBe(0.05)
  })
})
