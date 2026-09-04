// ── PM-034, Befund 3 (Prüfmeister, 02.09.2026) ────────────────────────────
//
// Gesagt: „Im Flur machen wir nichts am Boden, der bleibt, wie er ist."
// Gefragt wurde: „Welche Maße kennst du für „Keine Arbeiten am Boden im
// Flur.“?" — das Tool fragt nach den Maßen eines Raums, dessen Name der Satz
// ist, mit dem der Handwerker ihn abbestellt hat.
//
// An den echten Produktionsdaten der Aufnahme nachgesehen (entwurf_aufnahmen
// vom 03.09.) — und die KI-Extraktion ist an dieser Stelle **richtig**:
//
//   { name: "Flur", vage: true, vage_typ: "raum_ohne_masse",
//     vage_beschreibung: "Keine Arbeiten am Boden im Flur.",
//     arbeiten: [], belag: null, laenge: null, breite: null }
//
// Der Raum heißt „Flur", nicht „Keine Arbeiten…". Die Beschreibung steht
// sauber im dafür vorgesehenen Feld. Zwei Fehler in unserem Code haben daraus
// die Frage gemacht, die der Prüfmeister gesehen hat:
//
//   1. Es wurde überhaupt gefragt. Ein Raum ohne jede Arbeit, dessen eigene
//      Beschreibung „Keine Arbeiten" lautet, braucht keine Maße — er kommt im
//      Angebot gar nicht vor. Genau das prüft diese Datei.
//   2. Die Oberfläche hat die Beschreibung als Überschrift benutzt statt der
//      fertig formulierten Frage (RueckfragenScreen.tsx).
//
// Bewusst zwei Bedingungen, nicht eine: Der Raum muss **beides** sein — ohne
// jede Arbeit UND ausdrücklich abbestellt. Eine allein reicht nicht. Ein Raum
// ohne Arbeiten kann auch einfach ein Raum sein, bei dem die KI die Arbeiten
// nicht zugeordnet hat — dann ist die Rückfrage richtig und wichtig.

import { saetzeJeRaum } from './satz-raum'

const AUSSCHLUSS =
  /\bkeine?\s+arbeit|\bnichts\b|\bnix\b|\bbleibt\s+(?:so|wie|unver|liegen|drin|dran)|\bbleiben\s+(?:so|wie|unver|liegen|drin|dran)|wird\s+nicht|werden\s+nicht|nicht\s+(?:gemacht|bearbeitet|angefasst|angetastet|angerührt)|ausgenommen|au(?:ß|ss)en vor|unber[üu]hrt/i

export interface RaumFuerAusschluss {
  name?: string | null
  laenge?: number | null
  breite?: number | null
  flaeche?: number | null
  belag?: string | null
  arbeiten?: string[]
  vage_beschreibung?: string | null
  altbelag_entfernen?: boolean
  sockelleisten?: boolean
  ausgleich?: boolean
  feuchtigkeitssperre?: boolean
  parkett_schleifen?: boolean
}

/** Trägt dieser Raum überhaupt irgendeinen Auftrag? */
export function hatKeinerleiArbeit(raum: RaumFuerAusschluss): boolean {
  const arbeiten = (raum.arbeiten ?? []).filter(a => typeof a === 'string' && a.trim() !== '')
  if (arbeiten.length > 0) return false
  if (typeof raum.belag === 'string' && raum.belag.trim() !== '') return false
  return !raum.altbelag_entfernen
    && !raum.sockelleisten
    && !raum.ausgleich
    && !raum.feuchtigkeitssperre
    && !raum.parkett_schleifen
}

/**
 * Räume, die im Diktat ausdrücklich abbestellt wurden. Ergebnis: Raumname →
 * der Satz, auf den es sich stützt (für Hinweise und Tests nachvollziehbar).
 */
export function ausgeschlosseneRaeume(
  raeume: RaumFuerAusschluss[] | undefined | null,
  transkript?: string | null,
): Map<string, string> {
  const treffer = new Map<string, string>()
  const liste = (raeume ?? []).filter(r => (r?.name ?? '').trim() !== '')
  if (liste.length === 0) return treffer

  const zuordnung = transkript
    ? saetzeJeRaum(transkript, liste.map(r => (r.name ?? '').trim()))
    : new Map<string, string[]>()

  for (const raum of liste) {
    const name = (raum.name ?? '').trim()
    if (!hatKeinerleiArbeit(raum)) continue

    // 1. Die KI hat den Ausschluss selbst notiert — der direkteste Beleg.
    const beschreibung = (raum.vage_beschreibung ?? '').trim()
    if (beschreibung && AUSSCHLUSS.test(beschreibung)) {
      treffer.set(name, beschreibung)
      continue
    }

    // 2. Sonst im Transkript nachlesen, in den Sätzen dieses Raums.
    const satz = (zuordnung.get(name) ?? []).find(s => AUSSCHLUSS.test(s))
    if (satz) treffer.set(name, satz.trim())
  }

  return treffer
}

export function istRaumAusgeschlossen(
  raum: RaumFuerAusschluss,
  alleRaeume: RaumFuerAusschluss[],
  transkript?: string | null,
): boolean {
  const name = (raum?.name ?? '').trim()
  if (!name) return false
  return ausgeschlosseneRaeume(alleRaeume, transkript).has(name)
}
