// PM-152 — 1x und 3x heißen anders als 2x. Der Soll-Wortlaut dazu.
//
// ── Woher der Fall kommt ──────────────────────────────────────────────────
//
// Der Chief of Staff hat PM-152 am 24.09.2026 eröffnet, nachdem Engineering
// die ID in einem Code-Kommentar vergeben hatte. Die Lage: drei
// Anstrich-Familien (`Kniestockwände`, `Dachschrägen`, `Fassadenfläche`) haben
// im Katalog je eine 1x-, eine 2x- und eine 3x-Zeile. **DC-145 benennt von
// jeder Familie nur die 2x-Zeile um** — bei der Fassade zusätzlich mit anderer
// Wortstellung. Die Frage, die mir gehört: soll eine Familie drei Zeilen
// tragen, die nach drei verschiedenen Mustern heißen?
//
// ── Die Antwort ───────────────────────────────────────────────────────────
//
// **Nein. 1x und 3x folgen dem 2x-Muster.** Der Grund steht nicht im
// Geschmack, sondern in PM-147-B: dort ist entschieden, dass es um die
// **Schreibweise** geht — kein `2x` ohne `×`. Ein Katalog, in dem die 2x-Zeile
// `— 2× Anstrich` heißt und ihre beiden Geschwister `1x` und `3x`, verletzt
// dieselbe Regel eine Zeile tiefer.
//
// ── Wie gemessen wurde ────────────────────────────────────────────────────
//
// Jeder Soll-Titel zweimal durch denselben Matcher wie der Angebots-Endpunkt:
// einmal gegen den **Bestandskatalog** (ein Konto, das die alte Zeile
// gespeichert hat und sie NICHT mitbenannt bekommt) und einmal gegen den
// mitbenannten Katalog. Gemessen im Arbeitsbaum, in dem Engineerings
// CoS-E-100-Umbau liegt — das ist der Stand, um den es geht.
//
// Prüfmeister · 2026-09-24
import { describe, expect, it } from 'vitest'
import { anstrichzahlAusTitel, findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk, standardpreiseFuerGewerke } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'

type Zeile = { id: string; title: string; category: string; unit: string; unit_price: number }
const alsZeilen = (l: ReadonlyArray<{ category: string; title: string; unit: string; unit_price: number }>): Zeile[] =>
  l.map((p, i) => ({ id: `z${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))

const BESTAND = alsZeilen(standardpreiseFuerGewerke(['maler']))

const treffer = (titel: string, liste: Zeile[]) =>
  findePreisposition(titel, 'm²', liste.filter(p => preisKategoriePasstZuGewerk(p.category, gewerkFuerPosition(titel, 'maler'))))

const preisVon = (titel: string, liste: Zeile[]) => treffer(titel, liste)?.position.unit_price ?? null
const zeileVon = (titel: string, liste: Zeile[]) => treffer(titel, liste)?.position.title ?? null

/** Derselbe Katalog, aber mit den Soll-Wortlauten statt der alten Titel. */
const mitUmbenennung = (paare: Record<string, string>): Zeile[] =>
  BESTAND.map(z => (paare[z.title] ? { ...z, title: paare[z.title] } : z))

const FAMILIEN = [
  { basis: 'Kniestockwände', p1: 7.5, p2: 11.5, p3: 15.5, zwei: 'Kniestockwände streichen — 2× Anstrich' },
  { basis: 'Dachschrägen', p1: 7.5, p2: 11.5, p3: 15.5, zwei: 'Dachschrägen streichen — 2× Anstrich' },
  { basis: 'Fassadenfläche', p1: 9, p2: 14, p3: 19, zwei: 'Fassadenfläche 2× streichen' },
] as const

const SOLL: Record<string, string> = {}
for (const f of FAMILIEN) {
  SOLL[`${f.basis} streichen 1x`] = `${f.basis} streichen — 1× Anstrich`
  SOLL[`${f.basis} streichen 3x`] = `${f.basis} streichen — 3× Anstrich`
}
const UMBENANNT = mitUmbenennung(SOLL)

describe('PM-152 · 1x und 3x folgen dem 2x-Muster', () => {
  it('PM-152-A · die sechs alten Zeilen stehen heute so im Katalog', () => {
    for (const f of FAMILIEN) {
      expect(DEFAULT_PRICES.find(p => p.title === `${f.basis} streichen 1x`)?.unit_price, f.basis).toBe(f.p1)
      expect(DEFAULT_PRICES.find(p => p.title === `${f.basis} streichen 3x`)?.unit_price, f.basis).toBe(f.p3)
      expect(DEFAULT_PRICES.find(p => p.title === f.zwei)?.unit_price, f.basis).toBe(f.p2)
    }
  })

  it('PM-152-B · mit mitbenanntem Katalog trifft jeder Soll-Titel seine eigene Zeile zum selben Preis', () => {
    for (const f of FAMILIEN) {
      expect(preisVon(`${f.basis} streichen — 1× Anstrich`, UMBENANNT), f.basis).toBe(f.p1)
      expect(preisVon(`${f.basis} streichen — 3× Anstrich`, UMBENANNT), f.basis).toBe(f.p3)
      expect(treffer(`${f.basis} streichen — 1× Anstrich`, UMBENANNT)?.score, f.basis).toBe(1)
      expect(treffer(`${f.basis} streichen — 3× Anstrich`, UMBENANNT)?.score, f.basis).toBe(1)
    }
  })

  it('PM-152-C · im Bestandskonto — das die alte Zeile behält — bleibt der Preis ebenfalls stehen', () => {
    // Das ist die Messung, die zählt: die Zeile in der Datenbank eines
    // Betriebs wird von keiner Umbenennung im Code erreicht (PM-151).
    for (const f of FAMILIEN) {
      expect(preisVon(`${f.basis} streichen — 1× Anstrich`, BESTAND), `${f.basis} 1x`).toBe(f.p1)
      expect(preisVon(`${f.basis} streichen — 3× Anstrich`, BESTAND), `${f.basis} 3x`).toBe(f.p3)
    }
  })

  it('PM-152-D · fünf der sechs treffen im Bestandskonto sogar dieselbe Zeile — die sechste ist der Zwilling aus TN-095', () => {
    // Fünf mal dieselbe Zeile …
    for (const f of FAMILIEN) {
      if (f.basis !== 'Fassadenfläche') {
        expect(zeileVon(`${f.basis} streichen — 1× Anstrich`, BESTAND)).toBe(`${f.basis} streichen 1x`)
      }
      expect(zeileVon(`${f.basis} streichen — 3× Anstrich`, BESTAND)).toBe(`${f.basis} streichen 3x`)
    }
    // … und einmal landet der Treffer auf dem DOPPELTEN Eintrag, den Manfred
    // in TN-095 selbst gemeldet hat: `Fassade streichen 1x Anstrich` steht
    // neben `Fassadenfläche streichen 1x`, beide 9,00 €, beide
    // „Maler – Anstrich Außen". Das Geld bleibt gleich, der Titel auf dem
    // Kundenpapier nicht.
    expect(zeileVon('Fassadenfläche streichen — 1× Anstrich', BESTAND)).toBe('Fassade streichen 1x Anstrich')
    expect(preisVon('Fassadenfläche streichen — 1× Anstrich', BESTAND)).toBe(9)
    expect(DEFAULT_PRICES.filter(p => p.category === 'Maler – Anstrich Außen' && p.unit_price === 9 && /1x|1×/.test(p.title)))
      .toHaveLength(2)
  })

  it('PM-152-E · kein Soll-Titel stiehlt dem 2x-Geschwister den Treffer', () => {
    for (const f of FAMILIEN) {
      expect(preisVon(f.zwei, UMBENANNT), f.basis).toBe(f.p2)
      expect(zeileVon(f.zwei, UMBENANNT), f.basis).toBe(f.zwei)
    }
  })

  it('PM-152-F · die Fassade bricht das Muster auch beim 2x — und die Angleichung kostet nichts', () => {
    // `Fassadenfläche 2× streichen` stellt als einzige der drei die
    // Wortstellung um. Das ist DC-145s Titel, also nicht meine Entscheidung —
    // aber gemessen ist es: die einheitliche Fassung trifft im Bestandskonto
    // denselben Preis, nur über den Zwilling aus TN-095.
    expect(preisVon('Fassadenfläche streichen — 2× Anstrich', BESTAND)).toBe(14)
    expect(zeileVon('Fassadenfläche streichen — 2× Anstrich', BESTAND)).toBe('Fassade streichen 2x Anstrich')
  })

  it('PM-152-G · jenseits von 3× hört die Anstrichzahl auf zu tragen — deshalb bleibt der Soll bei 1/2/3', () => {
    // Die Grenze des Musters, damit sie nicht später als Fund verkauft wird:
    // `anstrichzahlAusTitel()` kennt nur 1, 2 und 3. Ein vierter Anstrich
    // wird vom Matcher gar nicht gelesen und landet still auf einem
    // Geschwister — im Bestandskonto auf der 2×-Zeile (11,50 €), im
    // umbenannten Katalog sogar auf der 1×-Zeile (7,50 €).
    expect(anstrichzahlAusTitel('Kniestockwände streichen — 4× Anstrich')).toBeUndefined()
    expect(anstrichzahlAusTitel('Kniestockwände streichen — 3× Anstrich')).toBe('3')
    expect(preisVon('Kniestockwände streichen — 4× Anstrich', BESTAND)).toBe(11.5)
    expect(preisVon('Kniestockwände streichen — 4× Anstrich', UMBENANNT)).toBe(7.5)
    // Heute ist das folgenlos, und genau deshalb steht es hier und nicht als
    // Fund: die Maler-Engine schreibt nur 1 oder 2 Anstriche
    // (`anstricheAusText()` in `mengen/gewerke/maler.ts` gibt nur 1, 2 oder
    // null zurück). Ein 4×-Titel kann aus keinem Diktat entstehen — er
    // entstünde erst, wenn jemand die Anstrichzahl freigibt.
  })

  it('PM-152-H · Schreibweise: im Maler-Katalog stehen heute beide Zeichen nebeneinander', () => {
    const maler = DEFAULT_PRICES.filter(p => p.category.startsWith('Maler'))
    const kleinesX = maler.filter(p => /\d\s*x\b/.test(p.title))
    const malZeichen = maler.filter(p => /\d\s*×/.test(p.title))
    // Der Stand, auf den sich meine Antwort an den Chief of Staff bezieht.
    // Wächst die erste Zahl, ist eine neue Zeile mit kleinem `x` dazugekommen.
    expect(kleinesX.length).toBeGreaterThan(0)
    expect(malZeichen.length).toBeGreaterThan(0)
    // Die sechs Zeilen dieser drei Familien sind Teil der ersten Gruppe —
    // genau sie löst der Soll-Wortlaut auf.
    for (const f of FAMILIEN) {
      expect(kleinesX.some(p => p.title === `${f.basis} streichen 1x`), f.basis).toBe(true)
      expect(kleinesX.some(p => p.title === `${f.basis} streichen 3x`), f.basis).toBe(true)
    }
  })
})
