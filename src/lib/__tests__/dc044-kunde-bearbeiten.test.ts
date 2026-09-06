import { describe, it, expect } from 'vitest'
import { parseAddress, composeAddress, EMPTY_ADDRESS } from '../address'

// ── DC-044 (Product Designer, 06.09.2026) ─────────────────────────────────
//
// „Kundendaten lassen sich nach dem Anlegen nirgends mehr bearbeiten."
//
// Der Bearbeiten-Weg füllt das Formular aus dem gespeicherten Adress-String
// vor und schreibt ihn danach wieder zusammen. Geht dabei etwas verloren,
// merkt es niemand: Der Nutzer korrigiert eine Telefonnummer und verliert
// still seine Hausnummer. Deshalb hier die Hin-und-Rück-Probe mit echten
// Adressformen — sie ist die einzige Stelle des Fixes, an der Daten
// umgeformt werden.

describe('DC-044 — die Adresse überlebt Bearbeiten und Speichern', () => {
  const faelle = [
    'Musterstraße 12\n10115 Berlin',
    'Am Hang 3a\n84028 Landshut',
    'Hauptstr. 1\n1010 Wien',
  ]
  for (const gespeichert of faelle) {
    it(gespeichert.replace('\n', ' · '), () => {
      expect(composeAddress(parseAddress(gespeichert))).toBe(gespeichert)
    })
  }

  it('eine einzeilige Adresse geht nicht verloren', () => {
    expect(composeAddress(parseAddress('Musterstraße 12'))).toBe('Musterstraße 12')
  })

  it('leer bleibt leer — und wird beim Speichern zu null', () => {
    expect(parseAddress(null)).toEqual(EMPTY_ADDRESS)
    expect(composeAddress(parseAddress(null))).toBe('')
  })

  it('eine Adresse ohne PLZ landet nicht in der Straße', () => {
    const zerlegt = parseAddress('Musterstraße 12\nBerlin')
    expect(zerlegt.strasse).toBe('Musterstraße 12')
    expect(zerlegt.ort).toBe('Berlin')
  })

  it('die Hausnummer überlebt auch bei mehrzeiligem Zusatz', () => {
    // Ältere Datensätze können eine dritte Zeile haben (z. B. „c/o").
    // Wichtig ist nur: Die Straße mit Hausnummer bleibt vollständig.
    expect(parseAddress('Musterstraße 12\nc/o Meier\n10115 Berlin').strasse).toBe('Musterstraße 12')
  })
})
