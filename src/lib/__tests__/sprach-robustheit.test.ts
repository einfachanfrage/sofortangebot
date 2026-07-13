import { describe, it, expect } from 'vitest'
import { erkenneArbeiten } from '../arbeiten-normalisierer'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'

// ── DER FUZZER ──────────────────────────────────────────────────────────────
// Statt dass ein echter Nutzer 1000 Ansagen reinspricht und wir einzeln fixen,
// steht hier ein breiter Korpus realistischer Handwerker-Sprache. Wächst mit
// jedem echten Beispiel. Findet ganze Fehlerklassen automatisch.

// Jede Zeile: freie Ansage → welche Arbeiten MÜSSEN erkannt werden (mind. diese).
const KORPUS: { text: string; erwartet: string[] }[] = [
  // — streichen: Flexionen & Umgangssprache
  { text: 'die Wände werden gestrichen', erwartet: ['streichen'] },
  { text: 'da muss mal frisch gestrichen werden', erwartet: ['streichen'] },
  { text: 'einmal drüberpinseln reicht', erwartet: ['streichen'] },
  { text: 'neuer Anstrich in weiß', erwartet: ['streichen'] },
  { text: 'die Küche wollen wir weißeln', erwartet: ['streichen'] },
  { text: 'Farbe drauf und gut', erwartet: ['streichen'] },
  // — Tapete entfernen: Partikel & Partizip
  { text: 'erst die Tapete ab', erwartet: ['tapete_entfernen'] },
  { text: 'die Raufaser muss runter', erwartet: ['tapete_entfernen'] },
  { text: 'alte Tapete abmachen', erwartet: ['tapete_entfernen'] },
  { text: 'Tapete wird abgerissen', erwartet: ['tapete_entfernen'] },
  { text: 'die Tapete kommt ab', erwartet: ['tapete_entfernen'] },
  // — spachteln / glätten: Umgangssprache
  { text: 'die Wände glattgemacht', erwartet: ['spachteln'] },
  { text: 'erst glatt ziehen', erwartet: ['spachteln'] },
  { text: 'Wände verspachteln auf Q3', erwartet: ['spachteln'] },
  // — lackieren / schleifen / grundieren
  { text: 'die Türen neu lackieren', erwartet: ['lackieren'] },
  { text: 'Dielen abschleifen', erwartet: ['schleifen'] },
  { text: 'im Neubau erst grundieren', erwartet: ['grundieren'] },
  // — Kombis (mehrere Arbeiten in einem Satz)
  { text: 'Tapete ab, spachteln, dann streichen', erwartet: ['tapete_entfernen', 'spachteln', 'streichen'] },
  { text: 'abschleifen und danach lackieren', erwartet: ['schleifen', 'lackieren'] },
]

describe('Sprach-Robustheit — Arbeiten werden erkannt', () => {
  it.each(KORPUS)('"$text"', ({ text, erwartet }) => {
    const erkannt = erkenneArbeiten(text)
    const fehlend = erwartet.filter(e => !erkannt.has(e as never))
    expect(fehlend, `nicht erkannt: ${fehlend.join(', ')}`).toEqual([])
  })
})

// ── NEGATIV: Maßangaben & Alltagswörter dürfen KEINE Phantom-Positionen bauen ──
// Das war der "gestrichen enthält estrich"-Bug. Diese Klasse fangen wir generisch.
const PHANTOM_VERBOTEN = ['estrich', 'epoxid', 'versiegel', 'fischgrät', 'fußbodenheizung']
const NEGATIV: { text: string }[] = [
  { text: 'Wohnzimmer gestrichen, 24 Quadratmeter Bodenfläche, Wände 2,60 hoch' },
  { text: 'alles frisch gestrichen, 30 qm' },
  { text: 'die Wände streichen, Raum ist 4 mal 5 Meter' },
  { text: 'Decke und Wände gestrichen im Flur' },
]

describe('Sprach-Robustheit — keine erfundenen Positionen', () => {
  it.each(NEGATIV)('"$text" erzeugt keine Boden-Phantome', ({ text }) => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], text)
    const namen = positionen.map(p => p.beschreibung.toLowerCase())
    const treffer = PHANTOM_VERBOTEN.filter(v => namen.some(n => n.includes(v)))
    expect(treffer, `erfundene Positionen: ${treffer.join(', ')}`).toEqual([])
  })
})
