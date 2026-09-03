// Erkennung der Doku-Endmarkierung (CoS-013 / CoS-028, Nachbesserung 03.09.2026)
//
// Das Prüfskript soll den Speicherfehler finden, der in diesem Projekt
// sechsmal aufgetreten ist: zwei gleichzeitige Schreibvorgänge, die
// ineinander rutschen. Am 03.09. meldete es plötzlich drei der wichtigsten
// Koordinationsdateien als beschädigt — ohne dass etwas kaputt war. Ursache:
// Die Dateien erklären die Markierung im Fließtext und zitieren sie dabei;
// beim Umbrechen des Absatzes landete das Zitat am Zeilenanfang.
//
// Ein Prüfer, der grundlos Alarm schlägt, ist schlimmer als keiner — beim
// nächsten echten Vorfall sieht niemand mehr hin. Deshalb diese Tests.
import { describe, it, expect } from 'vitest'
import { istEndmarkierung, endmarkierungsZeilen } from '../../../scripts/endmarkierung.mjs'

const ECHT = '<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->'

describe('Was als Endmarkierung zählt', () => {
  it('die vollständige Markierung', () => {
    expect(istEndmarkierung(ECHT)).toBe(true)
  })

  it('auch mit Einrückung oder nachlaufendem Leerzeichen', () => {
    expect(istEndmarkierung('   ' + ECHT + '  ')).toBe(true)
  })

  it('NICHT das Zitat im Fließtext — der Fehlalarm vom 03.09.', () => {
    // Genau so steht es in chief-of-staff-todos.md, finance und platform:
    // die schließende Klammer und der Folgesatz stehen auf derselben Zeile.
    const zitat = '<!-- ENDE DER DATEI -->`). Taucht beim Lesen noch Text NACH dieser'
    expect(istEndmarkierung(zitat)).toBe(false)
  })

  it('NICHT eine bloße Kurzform ohne den erklärenden Satz', () => {
    expect(istEndmarkierung('<!-- ENDE DER DATEI -->')).toBe(false)
  })

  it('NICHT irgendeine Zeile, die das Wort enthält', () => {
    expect(istEndmarkierung('Am ENDE DER DATEI steht eine Markierung.')).toBe(false)
    expect(istEndmarkierung('')).toBe(false)
  })
})

describe('Der echte Speicherfehler wird weiterhin gefunden', () => {
  it('zwei vollständige Markierungen = zwei Schreibvorgänge ineinander', () => {
    const zeilen = ['Text', ECHT, 'Noch mehr Text', ECHT]
    expect(endmarkierungsZeilen(zeilen)).toEqual([1, 3])
  })

  it('eine Datei mit Zitat UND echter Markierung hat genau eine', () => {
    const zeilen = [
      'Erklärung: Ganz am Ende steht eine feste Markierung',
      '(`<!-- ENDE DER DATEI -->`). Taucht danach noch Text auf …',
      '',
      ECHT,
    ]
    expect(endmarkierungsZeilen(zeilen)).toEqual([3])
  })

  it('gar keine Markierung bleibt erkennbar', () => {
    expect(endmarkierungsZeilen(['nur', 'text'])).toEqual([])
  })
})
