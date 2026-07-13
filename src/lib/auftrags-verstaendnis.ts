// Der typisierte Auftrags-Vertrag — die EINE Stelle, an der freie Sprache in
// feste Bedeutung übersetzt wird. Downstream (Engine, Vollständigkeit) liest
// nur noch diese Struktur, nie wieder den Rohtext mit includes().
//
// Heute wird sie aus dem Transkript per Normalisierer gebaut (baueVerstaendnis).
// Etappe 2: dieselbe Struktur füllt direkt die KI — dann ist der Regex-Weg nur
// noch Fallback/Validierung. Der Vertrag bleibt gleich, die Quelle ändert sich.

import {
  erkenneArbeiten, erkenneScope, erkenneRaumkontext, erkenneOeffnungen,
  istKomplett as istKomplettFn, hatAkzentwand as hatAkzentwandFn,
  type ArbeitsKategorie, type RaumScope, type Raumkontext, type OeffnungsNegation,
} from './arbeiten-normalisierer'

export interface AuftragsVerstaendnis {
  /** Erkannte Arbeits-Kategorien (streichen, tapete_entfernen, spachteln, …). */
  arbeiten: Set<ArbeitsKategorie>
  /** Flächen-Einschränkung: nur Wände / nur Decke / nur Boden. */
  scope: RaumScope
  /** Öffnungs-Negation: kein Fenster / keine Tür. */
  oeffnungen: OeffnungsNegation
  /** Raumkontext: Keller / Garage / Dachschräge / Fassade. */
  kontext: Raumkontext
  /** "komplett / alles / ganze Wohnung". */
  istKomplett: boolean
  /** "eine Wand" / Akzentwand. */
  hatAkzentwand: boolean
  /** Bequemer Einzel-Check. */
  hatArbeit(kategorie: ArbeitsKategorie): boolean
}

/** Baut das Verständnis aus freiem Text (Normalisierer-Weg). */
export function baueVerstaendnis(text: string): AuftragsVerstaendnis {
  const t = text ?? ''
  const arbeiten = erkenneArbeiten(t)
  return {
    arbeiten,
    scope: erkenneScope(t),
    oeffnungen: erkenneOeffnungen(t),
    kontext: erkenneRaumkontext(t),
    istKomplett: istKomplettFn(t),
    hatAkzentwand: hatAkzentwandFn(t),
    hatArbeit: (kategorie) => arbeiten.has(kategorie),
  }
}
