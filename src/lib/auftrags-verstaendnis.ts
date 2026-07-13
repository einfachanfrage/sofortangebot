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
import { erkenneBelag, hatBodenArbeit, type BelagTyp } from './boden-normalisierer'

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
  /** Boden-Gewerk: erkannter Belagstyp (parkett/laminat/vinyl/…), null wenn keiner. */
  belag: BelagTyp
  /** Boden-Gewerk: Altbelag-Demontage erkannt (inkl. Partizipien). */
  altbelagEntfernen: boolean
  /** Bequemer Einzel-Check. */
  hatArbeit(kategorie: ArbeitsKategorie): boolean
}

/**
 * Etappe 2: Bereits von der KI verstandene, strukturierte Signale.
 * Die KI liefert saubere Arbeiten je Raum + Belag + Altbelag-Flag — deutlich
 * robuster als Rohtext-Regex. Der Vertrag bevorzugt diese Signale; Regex bleibt
 * Fallback/Ergänzung. Alle Felder optional → fehlt eins, greift der Regex-Weg.
 */
export interface ExtraktionSignale {
  /** Alle `arbeiten`-Strings aus raeume/bereiche (schon KI-verstanden). */
  arbeitenTexte?: string[]
  /** KI-erkannter Belag-String (z.B. "Klick-Vinyl", "Eichenparkett"). */
  belagText?: string | null
  /** KI-Boolean: Altbelag soll entfernt werden. */
  altbelagEntfernen?: boolean
}

/**
 * Baut das Verständnis. Ohne Signale: reiner Regex-Weg (Fallback, z.B. Tests).
 * Mit Signale: KI-Ausgabe hat Vorrang, Regex ergänzt (Union) — nie weniger.
 */
export function baueVerstaendnis(text: string, signale?: ExtraktionSignale): AuftragsVerstaendnis {
  const t = text ?? ''

  // Basis: Regex über Rohtext (Fallback + Ergänzung)
  const arbeiten = erkenneArbeiten(t)
  let belag = erkenneBelag(t)
  let altbelag = hatBodenArbeit(t, 'altbelag_entfernen')

  // Etappe 2: saubere KI-Signale einweben
  if (signale) {
    const arbeitenText = (signale.arbeitenTexte ?? []).filter(Boolean).join('. ')
    if (arbeitenText.trim()) {
      for (const k of erkenneArbeiten(arbeitenText)) arbeiten.add(k)
    }
    if (signale.belagText) {
      const b = erkenneBelag(signale.belagText)
      if (b) belag = b // KI-Belag hat Vorrang
    }
    if (signale.altbelagEntfernen) altbelag = true
  }

  return {
    arbeiten,
    scope: erkenneScope(t),
    oeffnungen: erkenneOeffnungen(t),
    kontext: erkenneRaumkontext(t),
    istKomplett: istKomplettFn(t),
    hatAkzentwand: hatAkzentwandFn(t),
    belag,
    altbelagEntfernen: altbelag,
    hatArbeit: (kategorie) => arbeiten.has(kategorie),
  }
}
