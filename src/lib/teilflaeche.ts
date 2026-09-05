// ── PM-036 (Prüfmeister, 02.09.2026): Teilfläche schlägt Raummaß ──────────
//
// Wasserschaden im Wohnzimmer: „Im Wohnzimmer muss nur eine Ecke neu,
// ungefähr sechs Quadratmeter, der Rest vom Parkett bleibt liegen. Das
// Zimmer selbst ist fünf mal vier." Das Angebot stand danach über 21 m²
// statt 6,30 m² — 785,40 € zu viel, das Doppelte des Auftrags.
//
// An den echten Produktionsdaten der Aufnahme (entwurf_aufnahmen vom
// 03.09.) nachgesehen, und der Befund ist NICHT der, den man vermutet:
//
//   Wohnzimmer: { laenge: 5, breite: 4, flaeche: null }
//
// Die sechs Quadratmeter kommen in der Extraktion überhaupt nicht an. Es ist
// also keine Rangfolge-Frage („Raummaß gewinnt gegen Fläche") — es gibt gar
// nichts, was gewinnen könnte. Der Extraktions-Prompt sagt der KI wörtlich,
// `flaeche` NUR zu setzen, wenn keine Länge×Breite genannt wurde; bei beidem
// wirft sie die Teilfläche weg. Eine Rangfolge in der Engine hätte diesen
// Fall deshalb nicht gelöst.
//
// Was diese Datei tut: die Teilfläche aus dem Transkript zurückholen —
// deterministisch, testbar, ohne zweiten KI-Aufruf. Sie ist bewusst eng
// gebaut, weil eine falsch erkannte Teilfläche ein Angebot zu KLEIN macht
// und das noch teurer ist als zu groß:
//
//   * es muss ein ausdrückliches Einschränkungs-Signal im Abschnitt des
//     Raums stehen („nur", „eine Ecke", „der Rest bleibt", „Teilfläche" …),
//   * der Raum muss echte Maße haben (Länge×Breite) — sonst ist die genannte
//     Fläche ohnehin schon die Arbeitsfläche und es gibt nichts zu trennen,
//   * es darf GENAU EINEN Flächenwert geben, der kleiner als der Raum ist.
//     Zwei Kandidaten heißen: nicht raten, sondern nachfragen.
//
// Und wie bei PM-034 gilt: nichts still. Jede erkannte Teilfläche erzeugt
// einen sichtbaren Hinweis und eine Annahme an der Position.

import { saetzeJeRaum } from './satz-raum'

export { saetzeJeRaum }

export interface RaumFuerTeilflaeche {
  name?: string | null
  laenge?: number | null
  breite?: number | null
  flaeche?: number | null
  teilflaeche?: number | null
}

export interface TeilflaechenFund {
  raum: string
  flaeche: number
  raumflaeche: number
  /** Der Satz, in dem die Einschränkung steht — wörtlich, für den Hinweis. */
  beleg: string
}

export interface TeilflaechenErgebnis {
  funde: TeilflaechenFund[]
  /** Für die Warnungs-Anzeige: was wurde übernommen, was ist unklar geblieben. */
  hinweise: string[]
}

// Ausdrückliche Einschränkung. Bewusst KEIN "stelle"/"bereich" allein — die
// stehen zu oft harmlos im Satz ("an der Stelle liegt Vinyl").
export const EINSCHRAENKUNG = /(^|\W)nur(\W|$)|teilfl[äa]ch|teilbereich|teilst[üu]ck|(^|\W)ecke(\W|$)|ausbesser|schadstelle|wasserschaden|partiell|teilweise|(^|\W)rest(\W|$)|bleibt liegen|bleibt drin|bleibt bestehen|bleiben liegen/i

// „6 Quadratmeter", „6,3 m²", „6.3 qm", „ca. 6 m2"
const FLAECHEN_ANGABE = /(\d+(?:[.,]\d+)?)\s*(?:m²|m2|qm|quadratmeter)/gi

// Mindestabstand zur Raumfläche, damit „20 m²" im 20-m²-Raum nicht als
// Teilfläche durchgeht (Rundung, Umformulierung derselben Zahl).
const MIN_ABSTAND_M2 = 0.5

export function erkenneTeilflaechen(
  text: string,
  raeume: RaumFuerTeilflaeche[] | undefined | null,
): TeilflaechenErgebnis {
  const funde: TeilflaechenFund[] = []
  const hinweise: string[] = []
  const liste = (raeume ?? []).filter(r => (r?.name ?? '').trim().length >= 3)
  if (!text || liste.length === 0) return { funde, hinweise }

  const zuordnung = saetzeJeRaum(text, liste.map(r => (r.name ?? '').trim()))

  for (const raum of liste) {
    const name = (raum.name ?? '').trim()
    // Ohne echte Raummaße ist eine genannte Fläche schon die Arbeitsfläche.
    if (!raum.laenge || !raum.breite) continue
    if (raum.teilflaeche != null) continue
    const raumflaeche = Math.round(raum.laenge * raum.breite * 100) / 100

    const eigene = zuordnung.get(name) ?? []
    if (eigene.length === 0) continue

    const belegSatz = eigene.find(s => EINSCHRAENKUNG.test(s))
    if (!belegSatz) continue

    const kandidaten: number[] = []
    for (const satz of eigene) {
      FLAECHEN_ANGABE.lastIndex = 0
      let treffer: RegExpExecArray | null
      while ((treffer = FLAECHEN_ANGABE.exec(satz)) !== null) {
        const wert = parseFloat(treffer[1].replace(',', '.'))
        if (!isFinite(wert) || wert <= 0) continue
        if (wert > raumflaeche - MIN_ABSTAND_M2) continue
        kandidaten.push(Math.round(wert * 100) / 100)
      }
    }

    const eindeutig = Array.from(new Set(kandidaten))
    if (eindeutig.length === 0) continue

    if (eindeutig.length > 1) {
      hinweise.push(
        `${name}: Es klingt nach einer Teilfläche („${belegSatz.trim()}"), aber es stehen mehrere Flächen im Text ` +
        `(${eindeutig.map(w => w.toLocaleString('de-DE')).join(' m², ')} m²). Gerechnet wurde mit der vollen ` +
        `Raumfläche von ${raumflaeche.toLocaleString('de-DE')} m² — bitte die richtige Menge selbst eintragen.`,
      )
      continue
    }

    const flaeche = eindeutig[0]
    raum.teilflaeche = flaeche
    funde.push({ raum: name, flaeche, raumflaeche, beleg: belegSatz.trim() })
    hinweise.push(
      `${name}: Es wird nur eine Teilfläche von ${flaeche.toLocaleString('de-DE')} m² berechnet, nicht der ganze Raum ` +
      `(${raumflaeche.toLocaleString('de-DE')} m²) — gesagt wurde „${belegSatz.trim()}". Soll doch der ganze Raum ` +
      `gemacht werden, bitte die Menge unten auf der Raumkarte korrigieren.`,
    )
  }

  return { funde, hinweise }
}
