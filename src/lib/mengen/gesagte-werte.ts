// DC-026 (2026-08-24, Sandys Auftrag „setz dich an dc026"): Werte finden, die
// der Handwerker längst gesagt hat, bevor wir ihn nochmal danach fragen.
//
// Hintergrund: Die Rückfragen entstehen aus dem, was GPT STRUKTURIERT
// geliefert hat. Sagt jemand „drei Fenster sind drin" und GPT füllt das Feld
// nicht, entsteht die Frage „Wie viele Fenster hat X?" — obwohl die Zahl im
// Klartext dasteht. Für den Handwerker fühlt sich das nicht nach gründlich
// an, sondern nach „hat nicht zugehört".
//
// Diese Datei erfindet KEINE neue Erkennung, sondern bündelt die bereits
// vorhandenen, getesteten Parser (`extrahiereRaumhoehe`, `zaehleFenster`,
// `zaehleTueren`, `ersetzeZahlenWorte`) und beantwortet damit eine einzige
// Frage: „Steht der Wert für diese Rückfrage schon im Transkript — und in
// welchem Satz?" Der Satz ist wichtig: Der Product Designer zeigt ihn in
// DC-025 als Zitat („Du hast gesagt: …"), damit der Handwerker die Übernahme
// prüfen kann statt sie glauben zu müssen.
//
// Bewusst konservativ: Bei mehreren Räumen im Transkript wird nur ein Wert
// aus dem Satz vorgeschlagen, der DIESEN Raum nennt. Lieber kein Vorschlag
// als ein Wert aus dem falschen Zimmer.

import { ersetzeZahlenWorte } from '@/lib/zahlen-parser'
import { extrahiereRaumhoehe, zaehleFenster, zaehleTueren } from '@/lib/extraktion-masse'
import { erkenneOeffnungen } from '@/lib/arbeiten-normalisierer'

export type GesagteWertArt = 'hoehe' | 'masse' | 'flaeche' | 'flaeche_boden' | 'anzahl_fenster' | 'anzahl_tueren'

export interface GesagterWert {
  /** Zahl bzw. [Länge, Breite] — dasselbe Format wie `SchnellAntwort.wert`. */
  wert: number | number[]
  einheit: string
  /** Fertig formatiert für die Anzeige („2,60 m", „5 × 4 m", „3 Fenster"). */
  anzeige: string
  /** Der Satz aus dem Transkript, aus dem der Wert stammt — als Beleg. */
  zitat: string
}

const MAX_ZITAT = 140

function deutscheZahl(n: number): string {
  return String(Math.round(n * 100) / 100).replace('.', ',')
}

// Nicht an einem Punkt trennen, dem eine Ziffer folgt: `ersetzeZahlenWorte`
// macht aus "2,40" ein "2.40" — ein naives Trennen an "." zerschneidet sonst
// genau die Maßangabe, die wir suchen ("Die Küche ist 2" / "40 m hoch").
const SATZ_TRENNER = /[.!?;\n]+(?!\d)/

function saetze(text: string): string[] {
  return (text ?? '').split(SATZ_TRENNER).map(s => s.trim()).filter(Boolean)
}

function kuerze(satz: string): string {
  const sauber = (satz ?? '').replace(/\s+/g, ' ').trim()
  return sauber.length <= MAX_ZITAT ? sauber : `${sauber.slice(0, MAX_ZITAT - 1).trimEnd()}…`
}

/**
 * Ein Satz in zwei Fassungen: die normalisierte zum Rechnen, die rohe zum
 * Zitieren. Der Handwerker soll im Zitat SEINE Worte lesen („drei Fenster"),
 * nicht unsere umgeschriebene Fassung („3 Fenster") — sonst prüft er einen
 * Satz, den er so nie gesagt hat.
 */
interface Satzpaar {
  norm: string
  roh: string
}

function satzpaare(normalisiert: string, roh: string): Satzpaar[] {
  const normSaetze = saetze(normalisiert)
  const rohSaetze = saetze(roh)
  return normSaetze.map((norm, i) => ({ norm, roh: rohSaetze[i] ?? norm }))
}

interface Suchraum {
  /** Zahlwörter aufgelöst — hier wird gesucht. */
  normalisiert: string
  /** Originalwortlaut — daraus kommt das Zitat. */
  roh: string
}

/**
 * Der Textbereich, in dem gesucht werden darf. Bei mehreren Räumen im
 * Transkript nur der Satz, der DIESEN Raum nennt — lieber kein Vorschlag als
 * ein Wert aus dem falschen Zimmer.
 */
function suchAbschnitt(
  transkript: string,
  raumName?: string | null,
  alleRaumNamen: string[] = [],
): Suchraum | null {
  const roh = (transkript ?? '').trim()
  if (!roh) return null
  const normalisiert = ersetzeZahlenWorte(roh)
  const lower = normalisiert.toLocaleLowerCase('de-DE')

  const genannteRaeume = new Set(
    alleRaumNamen
      .map(r => (r ?? '').trim().toLocaleLowerCase('de-DE'))
      .filter(r => r.length > 2 && lower.includes(r)),
  )

  // Nur wenn wirklich mehrere Räume im Spiel sind, muss der Wert aus dem Satz
  // dieses Raums kommen. Bei einem einzigen Raum wäre das zu streng: „Im
  // Wohnzimmer die Wände streichen. Da sind drei Fenster drin." — die Zahl
  // steht im Folgesatz, gemeint ist trotzdem derselbe Raum.
  if (genannteRaeume.size > 1) {
    const name = (raumName ?? '').trim().toLocaleLowerCase('de-DE')
    if (!name) return null // mehrdeutig und kein Raumbezug
    // ALLE Sätze nehmen, die diesen Raum nennen — nicht nur den ersten.
    // Handwerker kommen im Sprechen auf einen Raum zurück („Im Wohnzimmer und
    // in der Küche streichen. … Im Wohnzimmer sind drei Fenster drin.").
    const passende = satzpaare(normalisiert, roh).filter(p => p.norm.toLocaleLowerCase('de-DE').includes(name))
    if (passende.length === 0) return null
    return {
      normalisiert: passende.map(p => p.norm).join('. '),
      roh: passende.map(p => p.roh).join('. '),
    }
  }

  return { normalisiert, roh }
}

/** Verhindert, dass Fenster-/Türmaße („1,20 mal 1,40") als Raummaß durchgehen. */
function istOeffnungsMass(satz: string, a: number, b: number): boolean {
  const klein = a <= 2.5 && b <= 2.5
  return klein && /fenster|t(?:ü|ue)r/i.test(satz)
}

interface Fund<T> {
  wert: T
  zitat: string
}

function findeMasse(raum: Suchraum): Fund<number[]> | null {
  for (const paar of satzpaare(raum.normalisiert, raum.roh)) {
    const m = paar.norm.match(/(\d+(?:[.,]\d+)?)\s*(?:m|meter)?\s*(?:mal|x|×|auf)\s*(\d+(?:[.,]\d+)?)/i)
    if (!m) continue
    const a = parseFloat(m[1].replace(',', '.'))
    const b = parseFloat(m[2].replace(',', '.'))
    if (!(a >= 0.5 && a <= 60 && b >= 0.5 && b <= 60)) continue
    if (istOeffnungsMass(paar.norm, a, b)) continue
    return { wert: [a, b], zitat: paar.roh }
  }
  return null
}

// Eine nackte Quadratmeterzahl sagt nicht, WOFÜR sie gilt. „18 Quadratmeter
// Wandfläche" darf niemals als Vorschlag für die Bodenfläche erscheinen —
// das wäre schlimmer als die Frage, die wir sparen wollen. Deshalb muss der
// Satz zur gesuchten Fläche passen, sonst gibt es keinen Vorschlag.
const BODEN_WORT = /boden|fu(?:ß|ss)boden|parkett|laminat|vinyl|teppich|estrich|fliesen/i
const WAND_ODER_DECKE = /wandfl(?:ä|ae)che|w(?:ä|ae)nde|decke/i

function findeFlaeche(raum: Suchraum, art: 'flaeche' | 'flaeche_boden'): Fund<number> | null {
  for (const paar of satzpaare(raum.normalisiert, raum.roh)) {
    const m = paar.norm.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|m2|qm|quadratmeter)/i)
    if (!m) continue
    const wert = parseFloat(m[1].replace(',', '.'))
    if (!(wert >= 0.5 && wert <= 2000)) continue
    if (art === 'flaeche_boden' && !BODEN_WORT.test(paar.norm)) continue
    if (art === 'flaeche' && WAND_ODER_DECKE.test(paar.norm)) continue
    return { wert, zitat: paar.roh }
  }
  return null
}

function findeHoehe(raum: Suchraum): Fund<number> | null {
  const gesamt = extrahiereRaumhoehe(raum.normalisiert)
  if (gesamt === null) return null
  const paar = satzpaare(raum.normalisiert, raum.roh).find(p => extrahiereRaumhoehe(p.norm) === gesamt)
  return { wert: gesamt, zitat: paar?.roh ?? raum.roh }
}

function findeAnzahl(raum: Suchraum, art: 'fenster' | 'tueren'): Fund<number> | null {
  const zaehle = art === 'fenster' ? zaehleFenster : zaehleTueren
  const gesamt = zaehle(raum.normalisiert)
  if (!gesamt || gesamt > 50) return null
  const muster = art === 'fenster' ? /fenster/i : /t(?:ü|ue)r/i
  const paar = satzpaare(raum.normalisiert, raum.roh).find(p => muster.test(p.norm) && zaehle(p.norm) === gesamt)
  return { wert: gesamt, zitat: paar?.roh ?? raum.roh }
}

/**
 * Sucht den Wert für eine Rückfrage im Transkript. `null` heißt: nicht
 * gefunden oder nicht eindeutig genug — dann bleibt es bei der normalen Frage.
 */
export function findeGesagtenWert(
  art: GesagteWertArt,
  transkript: string,
  raumName?: string | null,
  alleRaumNamen: string[] = [],
): GesagterWert | null {
  const raum = suchAbschnitt(transkript, raumName, alleRaumNamen)
  if (!raum) return null

  switch (art) {
    case 'hoehe': {
      const t = findeHoehe(raum)
      return t && { wert: t.wert, einheit: 'm', anzeige: `${deutscheZahl(t.wert)} m`, zitat: kuerze(t.zitat) }
    }
    case 'masse': {
      const t = findeMasse(raum)
      return t && {
        wert: t.wert,
        einheit: 'm',
        anzeige: `${deutscheZahl(t.wert[0])} × ${deutscheZahl(t.wert[1])} m`,
        zitat: kuerze(t.zitat),
      }
    }
    case 'flaeche':
    case 'flaeche_boden': {
      const t = findeFlaeche(raum, art)
      return t && { wert: t.wert, einheit: 'm²', anzeige: `${deutscheZahl(t.wert)} m²`, zitat: kuerze(t.zitat) }
    }
    case 'anzahl_fenster': {
      const t = findeAnzahl(raum, 'fenster')
      return t && { wert: t.wert, einheit: 'Stück', anzeige: `${t.wert} Fenster`, zitat: kuerze(t.zitat) }
    }
    case 'anzahl_tueren': {
      const t = findeAnzahl(raum, 'tueren')
      return t && {
        wert: t.wert,
        einheit: 'Stück',
        anzeige: `${t.wert} ${t.wert === 1 ? 'Tür' : 'Türen'}`,
        zitat: kuerze(t.zitat),
      }
    }
  }
}

/**
 * DC-026: Schreibt die im Text genannte Fenster-/Türanzahl in den Raum,
 * BEVOR die Rückfragen entstehen.
 *
 * Warum das nötig ist: Die Zahl wurde schon immer aus dem Text gezählt und
 * an die Mengenberechnung weitergereicht — nur eben nicht nach
 * `raum.fenster`, und genau daran hängt die Rückfrage „Wie viele Fenster hat
 * X?". Gefragt wurde also nach einer Zahl, mit der längst gerechnet wurde.
 *
 * Bewusst nur bei GENAU EINEM Raum: die Zähler lesen über das ganze
 * Transkript, bei mehreren Räumen wäre die Zuordnung geraten. Für die
 * Mehrraum-Fälle greift stattdessen der Vorschlag mit Zitat.
 *
 * Verneinung gewinnt: „ohne Fenster" verhindert die Injektion (gleiche
 * Prüfung wie im kontext-analyzer, gleiche Fehlerklasse wie PM-011).
 * Bereits vorhandene Öffnungen werden nie überschrieben.
 */
export function ergaenzeOeffnungenAusText(
  extraktion: {
    transkript?: string | null
    raeume?: Array<{
      fenster?: Array<{ anzahl?: number; breite?: number; hoehe?: number }>
      tueren?: Array<{ anzahl?: number; breite?: number; hoehe?: number }>
    }>
  },
  textMitZahlen: string,
): void {
  if ((extraktion.raeume?.length ?? 0) !== 1) return
  const raum = extraktion.raeume![0]
  const oeffnungen = erkenneOeffnungen(extraktion.transkript ?? textMitZahlen)

  const fensterAnzahl = zaehleFenster(textMitZahlen)
  if (!oeffnungen.keinFenster && fensterAnzahl > 0 && (raum.fenster?.length ?? 0) === 0) {
    raum.fenster = [{ anzahl: fensterAnzahl }]
  }

  const tuerenAnzahl = zaehleTueren(textMitZahlen)
  if (!oeffnungen.keineTuer && tuerenAnzahl > 0 && (raum.tueren?.length ?? 0) === 0) {
    raum.tueren = [{ anzahl: tuerenAnzahl }]
  }
}

/** Ordnet einer Rückfrage zu, welche Art Wert sie sucht (`null` = nicht unterstützt). */
export function artFuerRueckfrage(id: string, typ: string): GesagteWertArt | null {
  if (/^fenster_anzahl_/.test(id)) return 'anzahl_fenster'
  if (/^tueren_anzahl_/.test(id)) return 'anzahl_tueren'
  if (/^hoehe_/.test(id) || /_hoehe$/.test(id) || typ === 'hoehe') return 'hoehe'
  if (/^masse_boden_/.test(id)) return 'flaeche_boden'
  if (/_flaeche_/.test(id) || typ === 'flaeche_einzel') return 'flaeche'
  if (/^masse_/.test(id) || /_masse$/.test(id) || typ === 'masse_einzel') return 'masse'
  return null
}
