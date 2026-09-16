import { describe, it, expect } from 'vitest'
import {
  GEWERK_PREISE,
  GEWERK_VORLAGEN,
  ENTSORGUNG_STANDARD,
  getPreisvorlagenForGewerke,
} from '../preise-vorlagen'
import { ALLE_GEWERKE_IDS, INAKTIVE_GEWERKE_IDS } from '../gewerke-config'
import { DEFAULT_PRICES } from '../default-prices'
import { findePreisposition, type PreisPosition } from '../preis-matcher'

// PM-Vorlagen — „164 Vorlagen ohne Katalog-Zwilling", nachgemessen
// (Prüfmeister, 15.09.2026)
//
// Die Zahl stammt aus einem Abgleich Titel gegen Titel. Sie ist richtig, aber
// sie beantwortet die falsche Frage. Eine Vorlage ist nicht deshalb kaputt,
// weil ihr Titel im Katalog etwas länger heißt — die Normalisierung wirft
// Klammern ohnehin weg. Kaputt ist sie, wenn der Handwerker eine Zahl
// einträgt und **eine andere im Angebot steht**.
//
// Gemessen, mit dem echten Matcher, über die Liste, die ein Maler und
// Bodenleger im Onboarding wirklich vorgesetzt bekommt (134 Zeilen):
//
//   Zeilen, die sich selbst nicht finden        : 4 von 134
//     davon harmlos (derselbe Preis)            : 2
//     davon mit ANDEREM Preis (falsches Geld)   : 2
//
// Von den 167 titelgleichen Lücken (Stand 15.09., nicht mehr 164) liegen 15
// bei den aktiven Gewerken, 142 bei gesperrten und 10 in Gruppen, die kein
// Gewerk erreicht. Geld bewegen davon genau zwei — und die stehen unten.
//
// Dieselbe Methode wie `scripts/katalog-dopplungen.mjs`: jede Zeile durch den
// Matcher gegen die eigene Liste schicken und fragen, ob sie sich selbst
// findet. Was dort für 2379 Katalogzeilen gilt („0 finden sich nicht"), muss
// für die Vorlagen genauso gelten — sie werden zum Katalog des Betriebs.

const VORLAGEN_AKTIV = getPreisvorlagenForGewerke(['maler', 'boden_parkett'])
const ALS_PREISLISTE: PreisPosition[] = VORLAGEN_AKTIV.map((v, i) => ({
  id: `v${i}`,
  title: v.title,
  category: v.category,
  unit: v.unit,
  unit_price: v.defaultPrice,
}))

/** Die zwei bekannten Selbstfinder-Fehler, die KEIN Geld bewegen. */
const HARMLOS = new Set([
  'Fassade streichen 1× Anstrich (Dispersionsfarbe)',
  'Fassade streichen 2× Anstrich',
])

/** Die zwei, die Geld bewegen. Solange sie hier stehen, sind sie offen. */
const OFFEN_MIT_GELD = [
  'Laminat verlegen schwimmend (Großdiele)',
  'Kleinstauftrag pauschal (Mindestbetrag)',
]

describe('Jede Vorlage findet ihren eigenen Preis wieder', () => {
  it('kein Betrieb bekommt für eine ausgefüllte Zeile einen fremden Preis', () => {
    // Die eigentliche Prüfung. Alles, was hier auffällt und nicht in einer
    // der beiden Listen oben steht, ist neu und muss angesehen werden.
    const fremd: string[] = []
    for (const p of ALS_PREISLISTE) {
      const z = findePreisposition(p.title, p.unit, ALS_PREISLISTE)
      if (!z || z.position.id === p.id) continue
      if (HARMLOS.has(p.title)) continue
      if (OFFEN_MIT_GELD.includes(p.title)) continue
      fremd.push(`„${p.title}" ${p.unit_price} € → „${z.position.title}" ${z.position.unit_price} €`)
    }
    expect(fremd, `neue Vorlagen mit fremdem Preis:\n${fremd.join('\n')}`).toHaveLength(0)
  })

  it('die zwei bekannten harmlosen Fälle sind wirklich harmlos — gleicher Preis', () => {
    // Ein harmloser Fall, der still teuer wird, ist der schlimmste von allen.
    // Deshalb steht die Harmlosigkeit als Prüfung da und nicht als Zusage.
    for (const titel of HARMLOS) {
      const p = ALS_PREISLISTE.find(x => x.title === titel)!
      const z = findePreisposition(p.title, p.unit, ALS_PREISLISTE)!
      expect(z.position.unit_price, titel).toBe(p.unit_price)
    }
  })
})

describe('🔒 Sperrklinke: die zwei Vorlagen, die Geld bewegen', () => {
  it.fails('„Laminat verlegen schwimmend (Großdiele)" ist erreichbar', () => {
    // 16,00 € eingetragen, 14,00 € im Angebot — 2,00 €/m², bei 40 m² also
    // 80 € je Auftrag, und zwar zu Lasten des Betriebs.
    //
    // Ursache: Beide Vorlagen heißen „Laminat verlegen schwimmend", der
    // Unterschied steht in Klammern am Ende, und Klammern wirft die
    // Normalisierung weg (PM-018, aus gutem Grund).
    //
    // ENTSCHEIDUNG (Prüfmeister): Die Vorlage heißt künftig wörtlich wie die
    // Katalogzeile, die es längst gibt — **`Laminat Großdiele verlegen,
    // schwimmend`** (16,00 €). Damit steht das Unterscheidende vor dem Verb,
    // genau wie Manfred es formuliert hat, und der Matcher kann sie treffen.
    // Keine neue Sonderregel, kein neuer Katalogeintrag.
    const p = ALS_PREISLISTE.find(x => x.title.includes('Großdiele'))!
    const z = findePreisposition(p.title, p.unit, ALS_PREISLISTE)!
    expect(z.position.unit_price).toBe(p.unit_price)
  })

  it.fails('„Kleinstauftrag pauschal" gibt es nur einmal', () => {
    // Zwei gleichnamige Vorlagen in zwei Rubriken: Fassade 150 €, Boden
    // 110 €. Wer beides macht, bekommt auf jeden kleinen Bodenauftrag die
    // 150 € — 40 € zu viel, und die zahlt der Kunde.
    //
    // Dahinter steckt mehr als eine Dopplung: Den Mindestauftragswert gibt es
    // längst als Einstellung (`MINDESTAUFTRAGSWERT_ORIENTIERUNG`, Standard 0,
    // Zeile „Anfahrt & Vorbereitung"), und am 14.09. wurde ausdrücklich
    // entschieden, dass ein Vorschlag sich nicht selbst einträgt. Zwei
    // bepreiste Vorlagenzeilen für dieselbe Sache machen genau das wieder auf
    // — dann sind es drei Quellen für einen Betrag (180 · 150 · 110).
    //
    // ENTSCHEIDUNG (Prüfmeister): Der Mindestauftragswert ist eine
    // Eigenschaft des BETRIEBS, nicht des Gewerks. Eine Quelle, und das ist
    // die Einstellung. Beide Vorlagenzeilen gehören weg; weil Betriebe sie
    // schon ausgefüllt haben können, ist das eine Migration und keine
    // Streichung nebenbei.
    const treffer = VORLAGEN_AKTIV.filter(v => v.title.startsWith('Kleinstauftrag'))
    expect(treffer).toHaveLength(1)
  })
})

describe('🔒 Sperrklinke: Vorlagen der aktiven Gewerke ohne Preis im Standardkatalog', () => {
  // Zwei Vorlagen treffen im Standardkatalog gar nichts. Das ist kein
  // falscher Preis, sondern eine Zeile, nach der das Onboarding fragt und die
  // hinterher niemand benutzt — dieselbe Falle wie CoS-E-052, nur kleiner.
  const KATALOG: PreisPosition[] = DEFAULT_PRICES.map((p, i) => ({
    id: `k${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
  }))

  it.fails.each([
    // ENTSCHEIDUNG: Titel auf die Katalogzeile ziehen, die es schon gibt —
    // `Aufpreis Fußbodenheizung, verklebt mit Elastikkleber` (8,00 €). Der
    // Preis stimmt bereits, nur der Wortlaut nicht.
    'Aufpreis Verlegung bei Fußbodenheizung',
    // ENTSCHEIDUNG: dito, `Klebe-Vinyl verlegen, Nasskleber` (28,00 €).
    // „Profikleber" ist kein Verlegeverfahren, „Nasskleber" schon.
    'Klebe-Vinyl verlegen vollflächig (Profikleber)',
  ])('„%s" findet eine Katalogzeile', titel => {
    const v = VORLAGEN_AKTIV.find(x => x.title === titel)!
    expect(findePreisposition(v.title, v.unit, KATALOG)).not.toBeNull()
  })
})

describe('🔒 Sperrklinke: CoS-E-052 in der Gegenrichtung', () => {
  it.fails('jede Vorlagengruppe wird von mindestens einem Gewerk erreicht', () => {
    // Die bestehende Prüfung fragt: Findet jedes Gewerk seine Gruppen? Die
    // Gegenfrage stand nirgends — und dort liegen heute zwei Gruppen mit
    // zusammen 36 Zeilen, die kein Gewerk je abruft: `aufzug` und
    // `luftdichtigkeit`. Entweder fehlt die Gewerk-Kennung in
    // `gewerke-config.ts`, oder die Zeilen sind tot. Beides gehört
    // entschieden, bevor jemand die Gewerke freischaltet.
    //
    // `allrounder` ist ausdrücklich in Ordnung: Die Gruppe hängt an
    // ENTSORGUNG_STANDARD, nicht an GEWERK_VORLAGEN.
    const erreichbar = new Set<string>(['allrounder'])
    for (const id of [...ALLE_GEWERKE_IDS, ...INAKTIVE_GEWERKE_IDS]) {
      for (const k of GEWERK_VORLAGEN[id] ?? []) erreichbar.add(k)
    }
    const waisen = Object.keys(GEWERK_PREISE).filter(g => !erreichbar.has(g))
    expect(waisen, `Gruppen ohne Gewerk: ${waisen.join(', ')}`).toHaveLength(0)
  })

  it('ENTSORGUNG_STANDARD zeigt auf Gewerke, die es gibt', () => {
    const alle = new Set<string>([...ALLE_GEWERKE_IDS, ...INAKTIVE_GEWERKE_IDS])
    for (const id of ENTSORGUNG_STANDARD) expect(alle.has(id), id).toBe(true)
  })
})
