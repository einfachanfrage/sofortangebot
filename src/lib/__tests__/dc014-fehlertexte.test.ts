// DC-014 (Sandy, 17.08.2026) — keine Rohmeldung eines Systems im Produkt.
import { describe, it, expect } from 'vitest'
import { nutzerFehler, istTechnisch, FEHLER_STANDARD } from '@/lib/fehlertexte'

describe('DC-014 — der gemeldete Fall', () => {
  it('ersetzt die Datenbank-Meldung aus Sandys Screenshot', () => {
    const roh = 'Upload fehlgeschlagen: new row violates row-level security policy'
    const gezeigt = nutzerFehler(roh, 'Hochladen hat nicht geklappt.')
    expect(gezeigt).not.toContain('row-level')
    expect(gezeigt).toContain('Berechtigung')
  })

  it('zeigt nie englischen Rohtext, egal aus welcher Ecke er kommt', () => {
    const rohe = [
      'duplicate key value violates unique constraint "customers_pkey"',
      'null value in column "name" violates not-null constraint',
      'insert or update on table "quotes" violates foreign key constraint',
      'TypeError: Cannot read properties of undefined',
      'Failed to fetch',
      'JWT expired',
      'Internal Server Error',
      'new row violates row-level security policy',
    ]
    for (const roh of rohe) {
      const gezeigt = nutzerFehler(roh, 'Ausweichtext.')
      expect(istTechnisch(gezeigt), `durchgerutscht: ${roh}`).toBe(false)
    }
  })
})

describe('DC-014 — eigene Meldungen bleiben stehen', () => {
  it('reicht unsere deutschen Sätze unverändert durch', () => {
    const unsere = [
      'Nicht eingeloggt',
      'Keine Datei',
      'Nur PNG, JPG, WebP oder SVG erlaubt',
      'Datei zu groß (max. 5 MB)',
      'Fehler beim Löschen. Bitte versuche es erneut.',
      'Registrierung fehlgeschlagen. Versuche es nochmal.',
      'Verbindung zum Server fehlgeschlagen.',
      'Dein Monat ist voll — für ein neues Angebot brauchst du Pro.',
    ]
    for (const satz of unsere) {
      expect(nutzerFehler(satz, 'Ausweichtext.'), satz).toBe(satz)
    }
  })
})

describe('DC-014 — Herkunft der Meldung', () => {
  it('liest Error, String und Antwortobjekt gleich', () => {
    expect(nutzerFehler(new Error('Failed to fetch'), 'X')).toContain('Verbindung')
    expect(nutzerFehler('Failed to fetch', 'X')).toContain('Verbindung')
    expect(nutzerFehler({ error: 'Failed to fetch' }, 'X')).toContain('Verbindung')
    expect(nutzerFehler({ message: 'Failed to fetch' }, 'X')).toContain('Verbindung')
  })

  it('nimmt den Ausweichtext, wenn gar nichts ankommt', () => {
    expect(nutzerFehler(null, 'Ausweichtext.')).toBe('Ausweichtext.')
    expect(nutzerFehler(undefined, 'Ausweichtext.')).toBe('Ausweichtext.')
    expect(nutzerFehler('   ', 'Ausweichtext.')).toBe('Ausweichtext.')
    expect(nutzerFehler({}, 'Ausweichtext.')).toBe('Ausweichtext.')
  })

  it('hat einen eigenen Standardsatz, wenn die Stelle keinen mitgibt', () => {
    expect(nutzerFehler('Failed to load resource')).not.toBe('')
    expect(nutzerFehler(null)).toBe(FEHLER_STANDARD)
  })
})

describe('DC-014 — die Erkennung selbst', () => {
  it('erkennt Spaltennamen, Pfade und Namensräume als Maschinentext', () => {
    expect(istTechnisch('quote_items.price_item_id')).toBe(true)
    expect(istTechnisch('at Object.<anonymous> (/app/.next/server.js)')).toBe(true)
    expect(istTechnisch('https://xyz.supabase.co/storage/v1/object')).toBe(true)
  })

  it('hält einen normalen deutschen Satz nicht für Maschinentext', () => {
    expect(istTechnisch('Das Angebot wurde gesendet.')).toBe(false)
    expect(istTechnisch('Raumhöhe > 3 m wird als Erschwernis gerechnet.')).toBe(false)
  })
})
