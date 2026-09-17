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
  /** Ungekürzte, strukturierte Arbeitsbezeichnungen aus der Extraktion. */
  arbeitenTexte: string[]
  /**
   * Scope PRO RAUM (Name → RaumScope), aus der strukturierten arbeiten[]-Liste
   * jedes Raums — nicht aus dem Rohtext. Fund PM-005: "nur Decke" in einem Raum
   * (z.B. Speisekammer) darf niemals den Scope eines ANDEREN Raums (z.B. Küche)
   * beeinflussen. `scope` oben bleibt der GLOBALE Fallback für Fälle ohne
   * Raum-Struktur (z.B. Ein-Raum-Aufträge, alte Tests ohne signale.raeume).
   */
  scopeProRaum: Map<string, RaumScope>
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
  /**
   * Räume mit Namen + eigener arbeiten[]-Liste — Grundlage für scopeProRaum.
   * Ohne dieses Feld: Scope-Prüfung bleibt beim alten globalen Verhalten
   * (Rohtext, ein Wert für den ganzen Auftrag).
   */
  raeume?: Array<{ name?: string; arbeiten?: string[] }>
}

// ── PM-102 / CoS-E-083 (Prüfmeister 17.09.2026) ────────────────────────────
//
// „Alte Tapete muss runter. Danach Wände und Decke zweimal weiß." — im
// Angebot fehlte die Wandposition: 626,62 € diktierte Arbeit, die der Betrieb
// ausführt und nicht bezahlt bekommt.
//
// Der Weg dahin führt genau hier durch. Die Extraktion hatte dem Raum
// `["tapete entfernen", "tapezieren", "decke_streichen"]` mitgegeben. In
// dieser Liste kommt das Wort „Wand" nicht vor, „Decke" schon — die
// SCHWÄCHSTE Scope-Regel („eine Fläche wurde genannt, die andere nicht",
// quelle 'erwaehnung') schloss daraus „nur Decke", und die
// Vollständigkeitsprüfung löschte damit „Wand streichen 2x" UND
// „Sockelleisten abkleben" aus dem fertigen Angebot.
//
// Für den GLOBALEN Scope ist genau dieser Fall längst entschärft (PM-026,
// `schwachUndUeberstimmbar` in maler-basis.ts). Der Raum-Scope hatte die
// Ausnahme nie — und er sticht den globalen, sobald ein Raumname erkannt
// wird. Dieselbe Fehlerklasse wie PM-017 und PM-026, eine Ebene weiter innen.
//
// Die Regel dagegen ist ein Satz: **Tapezierarbeiten sind Wandarbeiten, auch
// wenn das Wort „Wand" nicht darin vorkommt.** Steht eine davon in der Liste,
// darf die reine Nicht-Erwähnung der Wand die Wandpositionen nicht löschen.
//
// Bewusst ENG gehalten: nur `tapete`, `tapezier`, `raufaser`. „spachteln",
// „grundieren" und „vlies" stehen ausdrücklich NICHT hier — die gibt es auch
// am Boden („Boden spachteln", „Schutzvlies"), und ein zu weiter Ausdruck
// würde echte „nur Decke"-Aufträge wieder aufweichen. Eine ausdrückliche
// Einschränkung („nur die Decke") ist von der Ausnahme ohnehin nicht
// betroffen: sie hat quelle 'explizit' und bleibt unangetastet.
const WANDARBEIT_OHNE_WANDWORT = /tapete|tapezier|raufaser/i

/** Scope eines einzelnen Raums aus dessen arbeiten[]-Liste. */
function raumScope(arbeitenText: string): RaumScope {
  const s = erkenneScope(arbeitenText)
  if (s.quelle !== 'erwaehnung') return s
  if (s.nurDecke && WANDARBEIT_OHNE_WANDWORT.test(arbeitenText)) {
    return { nurWaende: false, nurDecke: false, nurBoden: false, quelle: 'keine' }
  }
  return s
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
  const arbeitenTexte = (signale?.arbeitenTexte ?? []).filter(Boolean)
  if (signale) {
    const arbeitenText = arbeitenTexte.join('. ')
    if (arbeitenText.trim()) {
      for (const k of erkenneArbeiten(arbeitenText)) arbeiten.add(k)
    }
    if (signale.belagText) {
      const b = erkenneBelag(signale.belagText)
      if (b) belag = b // KI-Belag hat Vorrang
    }
    if (signale.altbelagEntfernen) altbelag = true
  }

  // Scope PRO RAUM: aus der eigenen arbeiten[]-Liste jedes Raums (Struktur,
  // kein Rohtext-Bleed zwischen Räumen). Fund PM-005.
  const scopeProRaum = new Map<string, RaumScope>()
  for (const raum of signale?.raeume ?? []) {
    const key = raum?.name?.trim().toLocaleLowerCase('de-DE')
    if (!key) continue
    scopeProRaum.set(key, raumScope((raum.arbeiten ?? []).join('. ')))
  }

  return {
    arbeiten,
    scope: erkenneScope(t),
    scopeProRaum,
    oeffnungen: erkenneOeffnungen(t),
    kontext: erkenneRaumkontext(t),
    istKomplett: istKomplettFn(t),
    hatAkzentwand: hatAkzentwandFn(t),
    belag,
    altbelagEntfernen: altbelag,
    arbeitenTexte,
    hatArbeit: (kategorie) => arbeiten.has(kategorie),
  }
}
