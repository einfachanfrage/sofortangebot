import { saetze } from './satz-raum'

// ── PM-037 (Prüfmeister, 04.09.2026) ──────────────────────────────────────
//
// Gesagt: „Zwei Fenster, jeweils eins zwanzig mal einen Meter, die Leibungen
// werden mitgestrichen, fünfundzwanzig Zentimeter tief. Die Fensterbänke
// werden auch gestrichen."
// Im Angebot: drei Positionen statt fünf. Leibungen und Fensterbänke fehlen
// ganz — ohne Rückfrage, ohne Hinweis, ohne irgendein Signal.
//
// Die Maler-Engine rechnet die Leibung seit VOB-013 richtig dreiseitig. Sie
// läuft dabei über `daten.leibungen[]` — und dieses Feld **existiert nicht
// einmal im Extraktions-Vertrag** (`ExtrahierteDaten`), geschweige denn im
// Prompt. Der Fix vom 03.09. war also nicht falsch, sondern **unerreichbar**:
// ein reparierter Rechenweg hinter einer verschlossenen Tür.
//
// Derselbe Fehlerbau wie PM-007 (`kniestockhoehe`) und PM-008 (Fassade in
// `waende[]`): Die Engine hat einen fertigen Zweig, die Bedingung hängt an
// einem Extraktionsfeld, und das Feld wird nie gesetzt.
//
// ── Warum im Code und nicht (nur) im Prompt ───────────────────────────────
// Den Prompt zu erweitern wäre die halbe Antwort. Ob das Modell ein Feld
// füllt, hat sich in PM-032 als tagesformabhängig erwiesen (dreimal dasselbe
// Diktat, zweimal „klick-vinyl", einmal nur „vinyl"). Die Maße stehen bereits
// zuverlässig in der Extraktion — Fensterzahl und Fenstergröße —, es fehlt
// allein die Ansage „die Leibungen werden mitgestrichen, 25 cm tief". Genau
// die steht im Rohtext. Also: Struktur, wo sie stimmt; Ansage, wo sie fehlt.

export interface LeibungsEintrag {
  anzahl: number
  breite: number
  hoehe: number
  /** Leibungstiefe in Metern. Fehlt sie, nimmt die Engine 25 cm an. */
  tiefe?: number
  /** 'fenster_innen' | 'fenster' | 'tuer' — steuert Titel und Fensterbank. */
  typ: string
}

interface FensterLike { anzahl?: number; breite?: number; hoehe?: number }
interface RaumLike { fenster?: FensterLike[]; tueren?: FensterLike[] }
interface WandLike { fenster?: FensterLike[] }

const LEIBUNG = /leibung|laibung/i
/** „innen" muss nicht fallen — in einem Raum ist die Leibung die innere. */
const AUSSEN = /au(?:ß|ss)en|fassade|witterung/i
const TUERLEIBUNG = /t[üu]r(?:en)?[\s-]?(?:leibung|laibung)|(?:leibung|laibung)\w*\s+(?:an|von|der)\s+t[üu]r/i

/**
 * Leibungstiefe aus dem Satz — „25 Zentimeter tief", „0,25 m tief", „25 cm".
 * Unplausible Werte werden verworfen; dann greift die 25-cm-Annahme der
 * Engine, und die steht sichtbar in den Annahmen der Position.
 */
export function leibungsTiefeAusText(text: string): number | null {
  for (const satz of saetze(text)) {
    if (!LEIBUNG.test(satz)) continue
    const cm = /(\d+(?:[.,]\d+)?)\s*(?:cm|zentimeter)/i.exec(satz)
    if (cm) {
      const wert = Number(cm[1].replace(',', '.')) / 100
      if (wert >= 0.05 && wert <= 0.6) return Math.round(wert * 100) / 100
    }
    const m = /(\d+(?:[.,]\d+)?)\s*m(?:eter)?\b/i.exec(satz)
    if (m) {
      const wert = Number(m[1].replace(',', '.'))
      if (wert >= 0.05 && wert <= 0.6) return Math.round(wert * 100) / 100
    }
  }
  return null
}

/** Fasst gleich große Öffnungen zu einem Eintrag zusammen. */
function fasseZusammen(oeffnungen: FensterLike[], typ: string, tiefe: number | null): LeibungsEintrag[] {
  const nachGroesse = new Map<string, LeibungsEintrag>()
  for (const f of oeffnungen) {
    const breite = f?.breite ?? null
    const hoehe = f?.hoehe ?? null
    // Ohne Maß keine Fläche. Lieber keine Position als eine geratene —
    // die Engine würde sonst mit Standardwerten rechnen, die niemand gesagt
    // hat, und das Ergebnis sähe aus wie gemessen.
    if (!breite || !hoehe) continue
    const schluessel = `${breite}x${hoehe}`
    const vorhanden = nachGroesse.get(schluessel)
    const anzahl = f?.anzahl ?? 1
    if (vorhanden) vorhanden.anzahl += anzahl
    else nachGroesse.set(schluessel, { anzahl, breite, hoehe, typ, ...(tiefe !== null ? { tiefe } : {}) })
  }
  return [...nachGroesse.values()]
}

export interface LeibungsErgebnis {
  leibungen: LeibungsEintrag[]
  hinweise: string[]
}

/**
 * Baut die Leibungs-Einträge aus Ansage (Rohtext) und Struktur (Fenster- und
 * Türmaße der Extraktion). Erzeugt nichts, wenn im Diktat keine Leibung
 * vorkommt — und nichts, wenn die Extraktion das Feld schon gefüllt hat.
 *
 * Ob eine genannte Leibung überhaupt GESTRICHEN wird, entscheidet weiterhin
 * allein die Engine (CoS-042, Punkt 4: „nur beschichtete Leibungen"). Diese
 * Datei liefert die Maße, nicht das Urteil — zwei Stellen mit derselben
 * Entscheidung wären der Fehler, der diese Woche mehrfach Geld gekostet hat.
 */
export function erkenneLeibungen(
  text: string,
  raeume: RaumLike[] | undefined | null,
  waende: WandLike[] | undefined | null,
): LeibungsErgebnis {
  const hinweise: string[] = []
  if (!text || !LEIBUNG.test(text)) return { leibungen: [], hinweise }

  const tiefe = leibungsTiefeAusText(text)
  const leibungen: LeibungsEintrag[] = []

  const raumFenster = (raeume ?? []).flatMap(r => (r?.fenster ?? []).filter(Boolean))
  const wandFenster = (waende ?? []).flatMap(w => (w?.fenster ?? []).filter(Boolean))

  // Innen oder außen: Ein Fenster in einem RAUM wird von innen gestrichen,
  // eines in einer Fassade von außen. Nur wenn der Text ausdrücklich von
  // außen spricht, kippt es auch für Räume.
  const aussen = AUSSEN.test(text)
  leibungen.push(...fasseZusammen(raumFenster, aussen ? 'fenster' : 'fenster_innen', tiefe))
  leibungen.push(...fasseZusammen(wandFenster, 'fenster', tiefe))

  if (TUERLEIBUNG.test(text)) {
    const tueren = (raeume ?? []).flatMap(r => (r?.tueren ?? []).filter(Boolean))
    leibungen.push(...fasseZusammen(tueren, 'tuer', tiefe))
  }

  if (leibungen.length === 0) {
    // Die Leibung wurde gesagt, aber es gibt keine Öffnung mit Maßen dazu.
    // Das ist der Fall, in dem früher STILL nichts passierte — jetzt steht
    // es wenigstens als sichtbarer Hinweis im Angebot.
    hinweise.push(
      'Im Diktat sind Leibungen genannt, aber es gibt keine Fenster- oder Türmaße, '
      + 'aus denen sich die Fläche berechnen ließe. Bitte Maße ergänzen — sonst fehlt '
      + 'die Leibungsposition im Angebot.',
    )
  } else if (tiefe === null) {
    hinweise.push('Leibungstiefe wurde nicht genannt — es werden 25 cm angenommen. Bitte prüfen.')
  }

  return { leibungen, hinweise }
}
