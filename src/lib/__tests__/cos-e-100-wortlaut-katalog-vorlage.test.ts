import { describe, it, expect } from 'vitest'
import { getPreisvorlagenForGewerke } from '../preise-vorlagen'
import { DEFAULT_PRICES } from '../default-prices'
import { ANKER, katalogPreis } from '../preis-ableitung'
import { STANDARD_FAMILIEN } from '../katalog-standard'

// CoS-E-100 Punkt 3 — die Sperrklinke gegen die nächste Umbenennung.
//
// Bestellt war: *jeder `katalogTitel` in `preis-ableitung.ts` trifft eine
// Zeile in `DEFAULT_PRICES`*, mit der Begründung, es gebe sie heute nicht.
//
// Gemessen (`scripts/umbenennung-sperrklinken.mjs`): es gibt sie, zweimal.
//   · `preis-ableitung.test.ts` → „Alle Katalogtitel der Tabelle gibt es
//     wirklich" und „jeder Anker hat eine Katalogzeile"
//   · `katalog-standard.test.ts` → „Jede Standardzeile gibt es auch wirklich"
// Benennt jemand den Katalog um und zieht die Exakt-Vergleiche nicht mit,
// gehen beide rot: 4 Einträge in `preis-ableitung.ts`, 0 in
// `katalog-standard.ts`. Der Ausfall ist also sichtbar, nicht still.
//
// Die Lücke liegt woanders, und dieses Blatt schließt sie: **die dritte
// Fläche, `preise-vorlagen.ts`, hat keine.** Dort steht der Wortlaut, den der
// Betrieb im Onboarding vorgesetzt bekommt. Weicht er vom Katalog ab, ist das
// kein falscher Preis — der Matcher findet die Zeile fuzzy weiter —, sondern
// genau der Zustand, den der Chief of Staff als den teureren benannt hat:
// **zwei Namen für dieselbe Sache auf zwei Flächen desselben Nutzers.** Und
// er fällt heute durch jede Prüfung durch.
//
// Gemessen, 23.09.2026: von den 134 Vorlagenzeilen, die ein Maler und
// Bodenleger im Onboarding sieht, tragen 116 einen Titel, der wortgleich im
// Standardkatalog steht. Die übrigen 18 stehen unten namentlich. Die Liste
// ist eine Wachstumssperre, keine Aufgabe: sie darf schrumpfen, nicht
// wachsen. Drei der 36 DC-145-Titel stehen in den Vorlagen
// (`Türen lackieren — 2× Anstrich`, `Grundieren — Tiefengrund`,
// `Parkett versiegeln — Lack, 2 Lagen`) — wer den Katalog umbenennt und die
// Vorlage vergisst, macht dieses Blatt rot.

const AKTIV = getPreisvorlagenForGewerke(['maler', 'boden_parkett'])
const KATALOGTITEL = new Set(DEFAULT_PRICES.map(p => p.title))

/**
 * Die 18 Vorlagenzeilen der aktiven Gewerke, die heute schon keinen
 * wortgleichen Katalogtitel haben. Jede einzelne ist ein bekannter, offener
 * Punkt — zwei davon bewegen Geld und liegen als Sperrklinke beim
 * Prüfmeister (`pm-vorlagen-zwilling.test.ts`). Hier geht es nicht um ihren
 * Preis, sondern nur darum, dass keine neue dazukommt.
 */
const BEKANNT_ABWEICHEND = [
  'Anfahrt pro km (einfache Strecke)',
  'Stundensatz Fachkraft',
  'Stundensatz Helfer',
  'Zuschlag bewohnte Wohnung',
  'Fassadengerüst stellen + vorhalten (4 Wochen, je m²)',
  'Aufpreis Verlegung bei Fußbodenheizung',
  'Parkett abschleifen (2 Schleifgänge inkl. Rand)',
  'Parkett ölen (maschinell, 2-lagig)',
  'Parkett schleifen + versiegeln komplett',
  'Parkett schleifen + ölen komplett',
  'Laminat verlegen schwimmend (Standard)',
  'Laminat verlegen schwimmend (Großdiele)',
  'Klick-Vinyl (SPC) verlegen schwimmend (wasserfest)',
  'Klebe-Vinyl verlegen vollflächig (Profikleber)',
  'WPC-Boden / Outdoorvinyl verlegen',
  'Teppichboden verlegen (gespannt / Nagelleiste)',
  'Dampfbremse / PE-Folie verlegen',
  'Treppenstufe mit Belag belegen',
]

describe('🔒 Katalog und Onboarding-Vorlage sagen dasselbe Wort', () => {
  it('keine neue Vorlagenzeile weicht vom Katalogwortlaut ab', () => {
    const bekannt = new Set(BEKANNT_ABWEICHEND)
    const neu = AKTIV.filter(v => !KATALOGTITEL.has(v.title) && !bekannt.has(v.title)).map(v => v.title)
    expect(
      neu,
      'Vorlage und Katalog sind auseinandergelaufen — entweder die Vorlage mit umbenennen ' +
        'oder die Zeile hier eintragen und begründen:\n  ' + neu.join('\n  '),
    ).toEqual([])
  })

  it('die Liste der bekannten Abweichungen ist keine Karteileiche', () => {
    // Eine Wachstumssperre verrottet, wenn sie Namen trägt, die es längst
    // nicht mehr gibt: dann sperrt sie nichts und niemand merkt es.
    const titelAktiv = new Set(AKTIV.map(v => v.title))
    const verwaist = BEKANNT_ABWEICHEND.filter(t => !titelAktiv.has(t))
    expect(verwaist, `steht in der Liste, aber nicht mehr in den Vorlagen: ${verwaist.join(', ')}`).toEqual([])

    const erledigt = BEKANNT_ABWEICHEND.filter(t => KATALOGTITEL.has(t))
    expect(erledigt, `hat inzwischen eine Katalogzeile — aus der Liste nehmen: ${erledigt.join(', ')}`).toEqual([])
  })
})

describe('Die beiden anderen Exakt-Vergleiche — gemessen, nicht geglaubt', () => {
  // Kein Ersatz für die Zusicherungen in `preis-ableitung.test.ts` und
  // `katalog-standard.test.ts`; die stehen dort und bleiben dort. Hier steht
  // nur die Zahl, auf die sich CoS-E-100 beruft, damit sie nicht ein drittes
  // Mal aus einer Zusammenfassung abgeschrieben wird.
  it('es sind 36 katalogTitel in preis-ableitung.ts, und alle treffen', () => {
    const alle = ANKER.flatMap(a => [a.katalogTitel, ...a.zeilen.map(z => z.katalogTitel)]).filter(
      (t): t is string => Boolean(t),
    )
    expect(alle).toHaveLength(36)
    for (const t of alle) expect(katalogPreis(t), t).not.toBeNull()
  })

  it('es sind 12 Standardzeilen, und alle treffen', () => {
    expect(STANDARD_FAMILIEN).toHaveLength(12)
    for (const f of STANDARD_FAMILIEN) expect(KATALOGTITEL.has(f.standard), f.standard).toBe(true)
  })
})
