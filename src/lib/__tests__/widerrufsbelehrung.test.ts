import { describe, it, expect } from 'vitest'
import {
  braucheWiderrufsbelehrung, standardWiderrufsbelehrung,
  musterWiderrufsformular, widerrufsbelehrungText,
} from '../widerrufsbelehrung'

const BETRIEB = {
  name: 'Müller Malerbetrieb',
  adresse: 'Musterstr. 1\n12345 Musterstadt',
  telefon: '0123 456789',
  email: 'info@mueller-maler.de',
}

describe('braucheWiderrufsbelehrung — nur Privatkunden', () => {
  it('Privatkunde + aktiv → ja', () => {
    expect(braucheWiderrufsbelehrung({ widerrufAktiv: true, kundeIstUnternehmen: false })).toBe(true)
  })
  it('Kundentyp unbekannt → sicherheitshalber ja (Verbraucher annehmen)', () => {
    expect(braucheWiderrufsbelehrung({ widerrufAktiv: true, kundeIstUnternehmen: null })).toBe(true)
  })
  it('Geschäftskunde → NEIN (kein Widerrufsrecht)', () => {
    expect(braucheWiderrufsbelehrung({ widerrufAktiv: true, kundeIstUnternehmen: true })).toBe(false)
  })
  it('vom Betrieb deaktiviert → nein', () => {
    expect(braucheWiderrufsbelehrung({ widerrufAktiv: false, kundeIstUnternehmen: false })).toBe(false)
  })
})

describe('standardWiderrufsbelehrung', () => {
  const t = standardWiderrufsbelehrung(BETRIEB)
  it('enthält die 14-Tage-Frist und den Fristbeginn', () => {
    expect(t).toMatch(/vierzehn Tagen/)
    expect(t).toMatch(/ab dem Tag des Vertragsabschlusses/)
  })
  it('enthält die Kontaktdaten des Betriebs (Pflicht)', () => {
    expect(t).toContain('Müller Malerbetrieb')
    expect(t).toContain('0123 456789')
    expect(t).toContain('info@mueller-maler.de')
  })
  it('enthält die Wertersatz-Klausel bei vorzeitigem Beginn', () => {
    expect(t).toMatch(/angemessenen Betrag/)
  })
})

describe('musterWiderrufsformular', () => {
  it('enthält Adressat und Unterschriftsfeld', () => {
    const f = musterWiderrufsformular(BETRIEB)
    expect(f).toContain('Müller Malerbetrieb')
    expect(f).toMatch(/Unterschrift/)
  })
})

describe('widerrufsbelehrungText — eigener Text schlägt Muster', () => {
  it('eigener Text wird genutzt', () => {
    expect(widerrufsbelehrungText(BETRIEB, 'Mein eigener Text')).toBe('Mein eigener Text')
  })
  it('leer/null → amtliches Muster', () => {
    expect(widerrufsbelehrungText(BETRIEB, '   ')).toMatch(/Widerrufsrecht/)
    expect(widerrufsbelehrungText(BETRIEB, null)).toMatch(/Widerrufsrecht/)
  })
})
