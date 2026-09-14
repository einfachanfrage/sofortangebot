// Kommen die Vorlagen beim Gewerk an?
//
// ── CoS-E-052 / TN-140 ────────────────────────────────────────────────────
//
// Manfred bekam beim Schritt „Eigene Preise" **fünf Felder**: Anfahrt,
// zwei Stundensätze, Bauschutt-Container, Kleinfuhre. Sandys Frage dazu war
// die richtige: „warum Entsorgung?"
//
// Weil zwei Namensräume nie zusammengeführt wurden. Die Gewerke heißen
// `maler` und `boden_parkett`, die Vorlagengruppen `malerarbeiten`,
// `bodenbeläge`, `maler_fassade`. `GEWERK_PREISE[id]` traf deshalb nie —
// übrig blieben drei allgemeine Zeilen, und weil die Merkliste durch den
// Fehlschlag leer blieb, feuerte auch noch die Regel „Entsorgung immer
// dabei".
//
// Gemessen: 13 von 18 Gewerk-Kennungen trafen ins Leere. Es war kein Fehler
// der beiden aktiven Gewerke, sondern einer, der jedes weitere beim
// Freischalten genauso getroffen hätte. Genau das prüft diese Datei.
import { describe, expect, it } from 'vitest'
import { getPreisvorlagenForGewerke, GEWERK_VORLAGEN, GEWERK_PREISE, ALLGEMEINE_PREISE, ENTSORGUNG_STANDARD } from '../preise-vorlagen'
import { ALLE_GEWERKE_IDS, INAKTIVE_GEWERKE_IDS } from '../gewerke-config'

const ALLE_IDS = [...ALLE_GEWERKE_IDS, ...INAKTIVE_GEWERKE_IDS]

describe('Jede Gewerk-Kennung findet ihre Vorlagen', () => {
  // Die Sperrklinke gegen den Wiederholungsfall: Wer ein Gewerk freischaltet
  // und die Zuordnung vergisst, sieht es hier — nicht der Handwerker beim
  // Onboarding.
  it.each(ALLE_IDS)('„%s" ist zugeordnet', id => {
    expect(GEWERK_VORLAGEN[id], `„${id}" fehlt in GEWERK_VORLAGEN`).toBeDefined()
  })

  it.each(ALLE_IDS)('„%s" verweist auf Gruppen, die es gibt', id => {
    // Ein Schreibfehler im Schlüssel wäre derselbe Fehler nochmal, nur
    // besser versteckt.
    for (const schluessel of GEWERK_VORLAGEN[id] ?? []) {
      expect(GEWERK_PREISE[schluessel], `Gruppe „${schluessel}" gibt es nicht`).toBeDefined()
      expect(GEWERK_PREISE[schluessel].length).toBeGreaterThan(0)
    }
  })

  it.each(ALLE_IDS)('„%s" liefert mehr als nur die allgemeinen Zeilen', id => {
    // Der eigentliche Fehler in einer Zeile: Es kamen genau die drei
    // allgemeinen Zeilen an (plus zwei Entsorgungsposten).
    expect(getPreisvorlagenForGewerke([id]).length).toBeGreaterThan(ALLGEMEINE_PREISE.length)
  })
})

describe('Die beiden aktiven Gewerke, konkret', () => {
  it('Maler bekommt Innen- UND Fassadenvorlagen', () => {
    // Die Gewerk-Kachel wirbt ausdrücklich mit „Fassade streichen" — also
    // braucht `maler` zwei Gruppen. Das ist der Grund, warum hier eine
    // Zuordnungstabelle steht und keine Umbenennung: 1:1 reicht nicht.
    const v = getPreisvorlagenForGewerke(['maler'])
    expect(v.length).toBeGreaterThan(80)
    expect(v.some(x => /Fassade/i.test(x.category))).toBe(true)
    expect(v.some(x => /Maler/i.test(x.category))).toBe(true)
  })

  it('Boden bekommt seine Belagsvorlagen', () => {
    const v = getPreisvorlagenForGewerke(['boden_parkett'])
    expect(v.length).toBeGreaterThan(45)
    expect(v.some(x => /Parkett|Laminat|Vinyl/i.test(x.title))).toBe(true)
  })

  it('zählt eine Vorlage nicht doppelt, wenn beide Gewerke sie kennen', () => {
    const beide = getPreisvorlagenForGewerke(['maler', 'boden_parkett'])
    const schluessel = beide.map(v => `${v.category}::${v.title}`)
    expect(new Set(schluessel).size).toBe(schluessel.length)
  })
})

describe('Entsorgung landet nur dort, wo sie Alltag ist', () => {
  it('nicht beim Maler und nicht beim Bodenleger', () => {
    // Sandys Frage. Ein Bauschutt-Container ist für einen Abbruchbetrieb
    // eine Standardzeile und für einen Maler eine Ausnahme — vorher stand er
    // bei jedem, weil die Bedingung an einem Fehler hing.
    for (const id of ['maler', 'boden_parkett']) {
      const entsorgung = getPreisvorlagenForGewerke([id]).filter(v => v.category === 'Entsorgung')
      expect(entsorgung, id).toHaveLength(0)
    }
  })

  it.each(ENTSORGUNG_STANDARD)('aber bei „%s"', id => {
    const entsorgung = getPreisvorlagenForGewerke([id]).filter(v => v.category === 'Entsorgung')
    expect(entsorgung.length).toBeGreaterThan(0)
  })

  it('ohne gewähltes Gewerk kommt gar nichts dazu', () => {
    expect(getPreisvorlagenForGewerke([])).toHaveLength(ALLGEMEINE_PREISE.length)
  })
})
