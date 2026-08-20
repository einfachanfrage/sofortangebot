import type { BerechnetePosition } from './mengen/types'
import { pruefeUndErgaenzeVollstaendigkeit } from './vollstaendigkeit/index'
import {
  sekundaerGewerk, erkenneHauptgewerkAusText,
  entferneRedundantenBodenschutz, entferneRedundantesSockelAbkleben,
} from './mengen/mehrgewerk'
import * as Sentry from '@sentry/nextjs'

interface Chip {
  titel?: string
  menge?: number
  einheit?: string
  einzelpreis?: number
  gesamtpreis?: number
  erkannt?: boolean
  automatisch_ergaenzt?: boolean
}

const STREICH_MUSTER = /wandfl.{0,15}streich|deckenfl.{0,15}streich|w[äa]nde?\s+streich|decke\s+streich/i
const BODEN_SCHUTZ_MUSTER = /boden\s*(?:schütz|schuetz)|boden[^—–]*(?:abdeck|schutz)/i
const VERLEGEN_MUSTER = /\bverleg(?:en|ung)\b/i

function raumSuffixRoh(beschreibung: string): string | null {
  const m = beschreibung.match(/\s[—–]\s*(.+)$/)
  return m?.[1]?.trim() ?? null
}

/**
 * PM-001, Nachtrag: "Boden schützen" ist Sandys konkretes Beispiel — und
 * genau dort reicht die Vollständigkeits-Prüfung oben NICHT aus. In der
 * echten Engine (mengen/gewerke/maler.ts, Kommentar "Boden schützen: immer
 * wenn Wände ODER Decke gestrichen wird — Farbe tropft") kommt diese
 * Position praktisch immer bei jedem Anstrich dazu — dort aber, weil die
 * TEURE, strukturierte KI-Extraktion "Boden schützen" oft schon selbst als
 * Handwerker-Standardwissen in die arbeiten[]-Liste eines Raums packt, auch
 * wenn der Nutzer das Wort nie ausgesprochen hat (exakt Sandys Originalfund:
 * "nie im Transkript vorkam"). Die schnelle Chip-Vorschau hat diese teure
 * Extraktion nicht — deshalb hier als eigene, deterministische Regel pro
 * Raum nachgebildet, statt auf die (hier nicht verfügbare) KI-Intuition zu
 * hoffen: jeder Raum mit Wand-/Deckenanstrich bekommt automatisch einen
 * Bodenschutz-Hinweis, außer er hat schon einen ODER in demselben Raum wird
 * ohnehin ein neuer Boden verlegt (dann schützt man nichts, das ersetzt
 * wird — dieselbe Logik wie `entferneRedundantenBodenschutz`).
 */
function ergaenzeBodenschutzBeiAnstrich(positionen: BerechnetePosition[]): BerechnetePosition[] {
  const anstrichRaeume = new Map<string, string | null>()
  for (const p of positionen) {
    if (!STREICH_MUSTER.test(p.beschreibung)) continue
    const roh = raumSuffixRoh(p.beschreibung)
    const key = roh?.toLocaleLowerCase('de-DE') ?? ''
    if (!anstrichRaeume.has(key)) anstrichRaeume.set(key, roh)
  }
  if (anstrichRaeume.size === 0) return positionen

  const keyVon = (b: string) => raumSuffixRoh(b)?.toLocaleLowerCase('de-DE') ?? ''
  // Eine pauschale Schutzposition OHNE Raum-Suffix deckt den ganzen Auftrag ab
  // (gleiche Annahme wie in maler-basis.ts/maler-abkleben.ts, die so eine
  // Position selbst ohne Raumbezug erzeugen) — zählt für jeden Raum als
  // "schon da", nicht nur für den leeren Schlüssel.
  const hatGlobalenSchutz = positionen.some(p => BODEN_SCHUTZ_MUSTER.test(p.beschreibung) && raumSuffixRoh(p.beschreibung) === null)
  const hatSchutz = (key: string) => hatGlobalenSchutz || positionen.some(p => BODEN_SCHUTZ_MUSTER.test(p.beschreibung) && keyVon(p.beschreibung) === key)
  const hatNeuenBoden = (key: string) => positionen.some(p => VERLEGEN_MUSTER.test(p.beschreibung) && keyVon(p.beschreibung) === key)

  const ergaenzt = [...positionen]
  for (const [key, roh] of anstrichRaeume) {
    if (hatSchutz(key) || hatNeuenBoden(key)) continue
    ergaenzt.push({
      beschreibung: roh ? `Boden schützen — ${roh}` : 'Boden schützen',
      menge: 0,
      einheit: 'm²',
      konfidenz: 'low',
      berechnungsweg: 'Wand-/Deckenanstrich erkannt — Bodenschutz ist Standard-Nebenleistung, Fläche wird bei der Berechnung ermittelt',
      annahmen: [],
    })
  }
  return ergaenzt
}

/**
 * PM-001 (2026-08-17, Nachtrag 2026-08-20): Die Aufnahmekarte zeigte bisher
 * nur, was das schnelle Chip-Modell (`extrahiereChips`, CHAT_MODEL_FAST)
 * direkt aus dem Transkript herausliest. Automatisch vom echten Rechenmotor
 * ergänzte Nebentätigkeiten — Boden schützen, Sockelleisten abkleben,
 * Grundierung, Fliesenspiegel/Lampen/Heizkörper abkleben, usw. (siehe
 * `vollstaendigkeit/*.ts`) — tauchten dort NIE auf, obwohl sie im fertigen
 * Angebot sicher erscheinen. Sandys konkreter Fund: Karte zeigte 2
 * Positionen, das Angebot lieferte 3 ("Boden schützen" fehlte auf der
 * Karte) — und ihre ausdrückliche Ansage danach: das gilt für ALLE
 * Nebentätigkeiten, nicht nur diesen einen Fall.
 *
 * Fix: dieselbe echte Vollständigkeits-Prüfung (`pruefeUndErgaenzeVollstaendigkeit`),
 * die auch die finale Kalkulation in generiere-positionen/angebot-extrahieren
 * durchläuft, direkt auf die Chip-Liste anwenden. Ihre Regeln arbeiten rein
 * textbasiert auf dem Transkript (keine Raum-Geometrie nötig — siehe
 * maler-basis.ts/boden.ts, die nur mit `lower`/`transkript` + bereits
 * vorhandenen Positionen arbeiten) und laufen deshalb auch mit der
 * schnellen, unstrukturierten Chip-Vorschau, OHNE die eigentliche (teurere)
 * KI-Extraktion ein zweites Mal aufzurufen. Wichtig: dieselbe
 * Produktionslogik, keine eigene Kopie der Regeln — kein Drift-Risiko wie
 * bei früheren Heuristik-Kopien (siehe die PM-012-Lehre, dokumentiert in
 * mehrgewerk.ts).
 *
 * Bewusst konservativ: läuft nur, wenn der Transkript-Text eindeutig Maler-
 * oder Boden-Signalwörter enthält (`erkenneHauptgewerkAusText`) — andere
 * Gewerke (Elektro, Fliesen, Sanitär, Trockenbau) sind aktuell nicht Teil
 * dieses Fixes, weil dafür (anders als bei Maler/Boden) noch keine
 * durchgängig text-only funktionierende Vollständigkeits-Prüfung geprüft ist.
 *
 * Fehler hier dürfen NIEMALS die Aufnahme blockieren (Systemischer Fund
 * Punkt 2 in pruefmeister-testfaelle.md) — bei jedem Problem einfach die
 * Original-Chips unverändert zurückgeben, nie werfen.
 */
export function ergaenzeChipsUmAutomatischeNebenpositionen(
  positionen: unknown[],
  transkript: string,
): unknown[] {
  try {
    if (!transkript?.trim() || !Array.isArray(positionen) || positionen.length === 0) return positionen

    const chips = positionen.filter((p): p is Chip => !!p && typeof p === 'object')
    const gewerkPrimaer = erkenneHauptgewerkAusText(transkript)
    if (!gewerkPrimaer) return positionen

    const basis: BerechnetePosition[] = chips
      .map(chip => ({
        beschreibung: String(chip.titel ?? '').trim(),
        menge: typeof chip.menge === 'number' ? chip.menge : 0,
        einheit: String(chip.einheit ?? 'Stück'),
        konfidenz: 'low' as const,
        berechnungsweg: '',
        annahmen: [] as string[],
      }))
      .filter(p => p.beschreibung)

    if (basis.length === 0) return positionen

    const bekannt = new Set(basis.map(p => p.beschreibung.toLocaleLowerCase('de-DE')))
    const gewerkSekundaer = sekundaerGewerk(gewerkPrimaer, { raeume: [], bereiche: [] }, transkript)

    const res1 = pruefeUndErgaenzeVollstaendigkeit(gewerkPrimaer, basis, transkript)
    let ergebnis = res1.positionen
    const fehlende = [...res1.fehlende]
    if (gewerkSekundaer) {
      const res2 = pruefeUndErgaenzeVollstaendigkeit(gewerkSekundaer, ergebnis, transkript)
      ergebnis = res2.positionen
      fehlende.push(...res2.fehlende)
    }
    ergebnis = entferneRedundantenBodenschutz(ergebnis)
    ergebnis = entferneRedundantesSockelAbkleben(ergebnis)

    // Boden schützen ist im Maler-Gewerk praktisch immer dabei, auch ohne
    // ausdrückliche Erwähnung — siehe Kommentar bei ergaenzeBodenschutzBeiAnstrich.
    if (gewerkPrimaer === 'maler' || gewerkSekundaer === 'maler') {
      ergebnis = entferneRedundantenBodenschutz(ergaenzeBodenschutzBeiAnstrich(ergebnis))
    }

    // Manche Regeln (z.B. Sockelleisten abkleben in maler-basis.ts) melden
    // eine erkannte, aber nicht sicher berechenbare Nebentätigkeit nur über
    // `fehlende`, nicht direkt als Position — genau wie in
    // mengen/mehrgewerk.ts (berechneUndPruefeAlleGewerke, Schritt 5) wird
    // jeder noch offene `fehlende`-Eintrag hier ebenfalls in eine sichtbare
    // Menge-0-Position verwandelt, sonst fehlt er auf der Karte genauso wie
    // vorher — nur an anderer Stelle im Code.
    const bekanntNachErgaenzung = new Set(ergebnis.map(p => p.beschreibung.toLocaleLowerCase('de-DE').trim()))
    for (const beschreibung of new Set(fehlende)) {
      const key = beschreibung.toLocaleLowerCase('de-DE').trim()
      if (bekanntNachErgaenzung.has(key)) continue
      bekanntNachErgaenzung.add(key)
      ergebnis.push({
        beschreibung,
        menge: 0,
        einheit: 'Stück',
        konfidenz: 'low',
        berechnungsweg: 'Erkannt, aber Menge nicht sicher berechenbar — bitte manuell ergänzen',
        annahmen: [],
      })
    }

    const neu = ergebnis.filter(p => p.beschreibung && !bekannt.has(p.beschreibung.trim().toLocaleLowerCase('de-DE')))
    if (neu.length === 0) return positionen

    const neueChips: Chip[] = neu.map(p => ({
      titel: p.beschreibung,
      menge: p.menge,
      einheit: p.einheit,
      einzelpreis: 0,
      gesamtpreis: 0,
      erkannt: true,
      automatisch_ergaenzt: true,
    }))

    return [...positionen, ...neueChips]
  } catch (e) {
    console.error('[chips-vervollstaendigung] Ergänzung fehlgeschlagen — Original-Chips unverändert')
    Sentry.captureException(e, { tags: { feature: 'chips_vervollstaendigung' } })
    return positionen
  }
}
