// DC-039: Ein neuer Preis landet direkt in der echten Preisdatenbank. Was hier
// durchrutscht, steht dauerhaft im Katalog des Betriebs — deshalb die Prüfung
// als eigene, testbare Funktion statt inline im Endpunkt.
import { describe, expect, it } from 'vitest'
import {
  kategorieFuerTitel, titelFuerPreisdatenbank, pruefeNeuenPreis,
  RUBRIK_BODEN, RUBRIK_MALER, RUBRIK_ALLGEMEIN, PREIS_MAX, TITEL_MAX_LAENGE,
} from '../preis-kategorie'

describe('DC-039 — Rubrik für einen neuen Preis', () => {
  it('sortiert Boden- und Malerarbeiten in ihre Sammel-Rubrik', () => {
    expect(kategorieFuerTitel('Laminat verlegen')).toBe(RUBRIK_BODEN)
    expect(kategorieFuerTitel('Sockelleisten montieren')).toBe(RUBRIK_BODEN)
    expect(kategorieFuerTitel('Wandflächen streichen')).toBe(RUBRIK_MALER)
    expect(kategorieFuerTitel('Raufaser tapezieren')).toBe(RUBRIK_MALER)
  })

  it('fällt bei allem anderen auf die neutrale Rubrik zurück, statt zu raten', () => {
    expect(kategorieFuerTitel('Baustelle einrichten')).toBe(RUBRIK_ALLGEMEIN)
    expect(kategorieFuerTitel('')).toBe(RUBRIK_ALLGEMEIN)
  })

  it('nimmt den Raum aus dem Titel — sonst steht dieselbe Leistung je Raum im Katalog', () => {
    expect(titelFuerPreisdatenbank('Wandflächen streichen — Flur')).toBe('Wandflächen streichen')
    expect(titelFuerPreisdatenbank('  Laminat verlegen  ')).toBe('Laminat verlegen')
    expect(titelFuerPreisdatenbank('Tür streichen')).toBe('Tür streichen')
  })
})

describe('DC-039 — Prüfung vor dem Schreiben in die Preisdatenbank', () => {
  it('nimmt eine saubere Eingabe an und rundet auf Cent', () => {
    const ergebnis = pruefeNeuenPreis({ titel: 'Laminat verlegen — Bad', einheit: 'm²', preis: 28.999 })
    expect(ergebnis).toEqual({
      ok: true,
      wert: { titel: 'Laminat verlegen', einheit: 'm²', preis: 29, kategorie: RUBRIK_BODEN },
    })
  })

  it('versteht einen Preis mit Komma, wie ihn ein deutsches Eingabefeld liefert', () => {
    const ergebnis = pruefeNeuenPreis({ titel: 'Tapete entfernen', einheit: 'm²', preis: '4,50' })
    expect(ergebnis.ok && ergebnis.wert.preis).toBe(4.5)
  })

  it('lehnt fehlenden Titel, fehlende Einheit und Preis 0 ab', () => {
    expect(pruefeNeuenPreis({ titel: '   ', einheit: 'm²', preis: 10 }).ok).toBe(false)
    expect(pruefeNeuenPreis({ titel: 'Test', einheit: '', preis: 10 }).ok).toBe(false)
    expect(pruefeNeuenPreis({ titel: 'Test', einheit: 'm²', preis: 0 }).ok).toBe(false)
    expect(pruefeNeuenPreis({ titel: 'Test', einheit: 'm²', preis: -5 }).ok).toBe(false)
    expect(pruefeNeuenPreis({ titel: 'Test', einheit: 'm²', preis: 'abc' }).ok).toBe(false)
  })

  it('fängt einen offensichtlichen Tippfehler beim Preis ab', () => {
    const ergebnis = pruefeNeuenPreis({ titel: 'Wand streichen', einheit: 'm²', preis: PREIS_MAX + 1 })
    expect(ergebnis.ok).toBe(false)
    expect(!ergebnis.ok && ergebnis.fehler).toMatch(/Tippfehler/)
  })

  it('lehnt einen überlangen Titel ab, statt den Katalog zuzumüllen', () => {
    expect(pruefeNeuenPreis({ titel: 'x'.repeat(TITEL_MAX_LAENGE + 1), einheit: 'm²', preis: 5 }).ok).toBe(false)
    expect(pruefeNeuenPreis({ titel: 'x'.repeat(TITEL_MAX_LAENGE), einheit: 'm²', preis: 5 }).ok).toBe(true)
  })

  it('gibt für jeden Fehler einen Satz zurück, den der Handwerker lesen kann', () => {
    const ergebnis = pruefeNeuenPreis({ titel: 'Test', einheit: 'm²', preis: 0 })
    expect(!ergebnis.ok && ergebnis.fehler).toBe('Bitte einen Preis größer als 0 eingeben.')
  })
})
