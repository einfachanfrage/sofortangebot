import type { BerechnetePosition } from '../mengen/types'
import { hat, add, raumNamenAus, findeRaumImSatz, NISCHE_WORT } from './helpers'
import { saetze } from '../satz-raum'
import { ersetzeZahlenWorte } from '../zahlen-parser'

export function pruefeDiagonalFliesen(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatDiagonal =
    lower.includes('diagonal') ||
    lower.includes('schräg') ||
    lower.includes('schraeg') ||
    lower.includes('45 grad') ||
    lower.includes('45°')
  if (!hatDiagonal) return
  if (hat(ergaenzt, 'verschnitt', 'diagonal')) return
  fehlende.push('Verschnitt 15 % (Diagonalverlegung)')
}

export function pruefeMosaik(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  if (!lower.includes('mosaik')) return
  if (hat(ergaenzt, 'mosaik')) return
  add(ergaenzt, fehlende, 'Mosaikfliesen verlegen (erhöhter Aufwand)')
}

export function pruefeNaturstein(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  const hatNaturstein =
    lower.includes('naturstein') ||
    lower.includes('marmor') ||
    lower.includes('granit') ||
    lower.includes('schiefer') ||
    lower.includes('travertin') ||
    lower.includes('quarzit')
  if (!hatNaturstein) return
  if (!hat(ergaenzt, 'imprägnierung', 'imprägnier')) {
    fehlende.push('Imprägnierung Naturstein')
  }
  if (!hat(ergaenzt, 'epoxid', 'naturstein-fug', 'fugenmasse')) {
    fehlende.push('Fugenmasse für Naturstein (Epoxid/Spezialmasse)')
  }
}

/**
 * ── PM-075 — die Duschnische (Prüfmeister, 15.09.2026; entschieden 17.09.2026) ──
 *
 *   „Bad zwei mal drei, Fliesenhöhe zwo Meter zehn, Wände und Boden fliesen.
 *    In der Dusche kommt eine Wandnische rein, die wird mit gefliest."
 *
 * Gemessen: mit und ohne den Nischensatz Position für Position dasselbe
 * Angebot, `fehlende` leer. Der Satz verschwand spurlos — 95,00 €, die auf
 * keinem Angebot landen.
 *
 * **Warum hier eine bepreiste Position und beim Maler ein Fehlt-Eintrag**
 * (PM-089): der Unterschied ist die EINHEIT. Fürs Streichen führt der Katalog
 * gar keine Zeile, fürs Tapezieren eine auf `lfdm` — die verlangt ein Maß,
 * das im Satz nicht steht. Fürs Fliesen gibt es `Nische / Wandnische fliesen`
 * auf **Stück**, und Stück heißt: die Menge steht im Satz. Nichts zu messen,
 * nichts zu raten, K.5 steht nicht im Weg (Prüfmeister, Antwort auf
 * Engineerings Punkt 4).
 *
 * **Warum der Titel „Nische fliesen" heißt und nicht wie die Katalogzeile.**
 * Das ist keine Kosmetik, sondern gemessen — dieselbe Falle wie bei der
 * Staubschutzwand (PM-090): `gewerkFuerPosition` prüft `/wand/` vor allem
 * anderen und schickt jeden Titel mit „Wand" darin zum MALER. Der
 * Katalogfilter lässt danach nur Maler-Kategorien zu, `Fliesen –
 * Sonderarbeiten` fällt heraus, und die Zeile stünde mit 0,00 € auf dem
 * Kundenpapier (PM-066). Gemessen, nicht vermutet:
 *
 *     „Nische / Wandnische fliesen"  → gewerk=maler   → kein Preis
 *     „Wandnische fliesen"           → gewerk=maler   → kein Preis
 *     „Nische fliesen — Bad"         → gewerk=fliesen → 95,00 € ✓
 *
 * Der Preis-Matcher findet die Katalogzeile vom kürzeren Titel aus zuverlässig.
 * Dass derselbe Router auch „Wandfliesen verlegen" zum Maler schickt, ist ein
 * eigener Befund mit eigener Messung — gemeldet, hier nicht mitrepariert.
 *
 * **Mehrzahl ohne Zahl bekommt keinen Preis.** „Da kommen noch Nischen rein"
 * sagt nicht wie viele. Eine Stückzahl zu raten hieße, einen Preis zu erfinden;
 * also Fehlt-Eintrag statt Position — dasselbe Muster wie bei den Trittstufen.
 *
 * **Nicht gebaut:** die Trockenbau-Zeile `Nische / Wandnische einbauen`
 * (180,00 €/Stück). „Kommt rein" heißt, dass sie auch gebaut wird — aber das
 * ist ein anderes Gewerk mit eigener Katalogzeile und eigener Frage (baut der
 * Fliesenleger sie, oder steht sie schon?). Eigener Fall, eigene Messung.
 */
export function pruefeFliesenNische(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  if (!NISCHE_WORT.test(lower)) return
  // Dopplungsschutz von Hand: `add`/`addMitMenge` nehmen die ersten ZWEI
  // Wörter des Titels als Kennung — bei einem Titel mit „/" ist das zweite
  // Wort „/", und das steckt auch in „Boden schützen / Abdeckfolie".
  if (hat(ergaenzt, 'nische')) return
  // Nur wo im Angebot wirklich gefliest wird. Ohne Fliesenposition gibt es
  // nichts, wozu die Nische Mehrarbeit wäre.
  if (!hat(ergaenzt, 'fliesen verlegen', 'wandfliesen', 'bodenfliesen')) return

  // Der Satz, in dem die Nische steht, muss sie auch ans Fliesen binden.
  // „Die Nische bleibt, wie sie ist" darf keine Zeile erzeugen, auch nicht in
  // einem Fliesenauftrag. Zahlwörter vorher ersetzt, weil diese Regel auch
  // dort greifen muss, wo der Text nicht schon am Eingang normalisiert wurde.
  const satz = saetze(ersetzeZahlenWorte(lower)).find(s => NISCHE_WORT.test(s))
  if (!satz || !/flies|kachel/.test(satz)) return

  const namen = raumNamenAus(ergaenzt)
  const raum = namen.length === 1 ? namen[0] : findeRaumImSatz(NISCHE_WORT, lower, namen)
  const suffix = raum ? ` — ${raum}` : ''

  const anzahl = nischenAnzahl(satz)
  if (anzahl === null) {
    fehlende.push(`Nische fliesen${suffix} (Anzahl prüfen)`)
    return
  }

  ergaenzt.push({
    beschreibung: `Nische fliesen${suffix}`,
    menge: anzahl,
    einheit: 'Stück',
    konfidenz: 'high',
    berechnungsweg: `${anzahl} Stück aus Transkript`,
    annahmen: [],
    // Diktiert, nicht ergänzt (PM-077 / Regel H Satz 3): Wer die Nische
    // ausdrücklich bestellt, darf ihren Preis nicht dadurch verlieren, dass
    // die Zeile aus der Vollständigkeitsprüfung stammt.
    automatisch_ergaenzt: false,
  })
}

/** Anzahl der Nischen aus dem Satz — `null`, wenn der Satz sie nicht nennt. */
function nischenAnzahl(satz: string): number | null {
  const mitZahl = /(\d+)\s*(?:regal|wand|mauer)?nischen?(?![a-zäöüß])/.exec(satz)
  if (mitZahl) return parseInt(mitZahl[1], 10)
  // Mehrzahl ohne Zahl: wir wissen es nicht und raten nicht.
  if (/(?<![a-zäöüß])(?:regal|wand|mauer)?nischen(?![a-zäöüß])/.test(satz)) return null
  return 1
}
