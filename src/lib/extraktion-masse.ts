// Zentrale, getestete Parser für Maß-Angaben aus freiem Text.
//
// Etappe 3: Diese Regexes lagen bisher inline in angebot-extrahieren und waren
// ungetestet — die letzte fragile Rohtext-Stelle im heißen Pfad. Sie greifen als
// FALLBACK, wenn die KI ein Zahlenfeld nicht geliefert hat. Hier zentral + per
// Fuzzer bewacht; später kann die KI diese Werte direkt liefern (dann nur Fallback).

import { ersetzeZahlenWorte } from './zahlen-parser'

/** Direkte Wandfläche in m² ("Wandfläche 40 m²", "40 qm Wandfläche"). */
export function extrahiereWandflaeche(text: string): number | null {
  const t = text ?? ''
  const m = t.match(/(?:wandfläche|wand(?:fläche)?|wände)[^.!?\n]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
    ?? t.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?\n]*?(?:wandfläche|wand(?:fläche)?|wände)/i)
  return m ? parseFloat(m[1].replace(',', '.')) : null
}

/** Direkte Deckenfläche in m² ("die Decke ist 20 m²", "20 qm Deckenfläche"). */
export function extrahiereDeckenflaeche(text: string): number | null {
  const t = text ?? ''
  const m = t.match(/(?:deckenfläche|die\s+decke\s+ist|decke)\s+(?:so\s+)?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
    ?? t.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)\s*(?:deckenfläche|für\s+die\s+decke)/i)
  return m ? parseFloat(m[1].replace(',', '.')) : null
}

/**
 * Fläche, die ausdrücklich GESTRICHEN werden soll — auch ohne das Wort
 * "Wandfläche": "im Wohnzimmer müssen 35 m² gestrichen werden".
 *
 * DC-040-Nachtrag (Sandy, 29.08.: „das kommt safe vor"). Ohne diese Erkennung
 * landet die Zahl als RAUMGRÖSSE in `flaeche`, und die Engine rechnet daraus
 * über die Quadrat-Annahme eine Wandfläche — aus 35 m² werden 61,5 m².
 *
 * Bewusst eng: nur Partizip/„zu streichen"-Formen, bei denen die Zahl
 * grammatisch am Streichen hängt. Eine reine Aufzählung („Wohnzimmer 35 m²,
 * streichen") bleibt die Raumgröße — dort IST die Zahl die Raumgröße, und
 * die bisherige Rechnung stimmt. Boden- und Deckenwörter direkt an der Zahl
 * schließen den Treffer aus, die haben ihre eigenen Erkenner.
 */
export function extrahiereStreichflaeche(text: string): number | null {
  const t = text ?? ''
  const VERB = '(?:gestrichen|angestrichen|zu\\s+streichen|anzustreichen|gespachtelt|zu\\s+spachteln|tapeziert|zu\\s+tapezieren|lackiert|zu\\s+lackieren)'
  const treffer = t.match(new RegExp(
    `(\\d+(?:[.,]\\d+)?)\\s*(?:m²|qm|quadratmeter)((?:\\s+\\S+){0,3}?\\s+${VERB})`, 'i',
  ))
  if (!treffer) return null
  // "35 m² Decke streichen" / "35 m² Boden" gehören nicht hierher.
  if (/\b(decke|boden|laminat|parkett|vinyl|teppich|estrich|fußboden|fussboden)/i.test(treffer[2])) return null
  return parseFloat(treffer[1].replace(',', '.'))
}

/**
 * Direkte Bodenfläche in m² ("55 m² Laminat", "Bodenfläche 40 qm").
 *
 * DC-040: Gegenstück zu `extrahiereWandflaeche`. Ein Handwerker, der die
 * Wohnung als Ganzes beschreibt, nennt beide Flächen in EINEM Satz
 * ("120 m² Wandfläche streichen und 55 m² Laminat verlegen"). Bewusst nur
 * mit ausdrücklichen Boden-Begriffen — eine nackte m²-Zahl ist mehrdeutig
 * und würde sonst die Wandfläche als Boden verbuchen.
 */
export function extrahiereBodenflaeche(text: string): number | null {
  const t = text ?? ''
  // Wortgrenzen sind hier nicht kosmetisch: ohne sie steckt "estrich" in
  // "gestrichen" — "120 m² Wandfläche gestrichen" wäre als Bodenfläche
  // durchgegangen. "fliesen" bewusst nicht in der Liste (steht genauso oft
  // an der Wand wie am Boden).
  const BELAG = '\\b(?:bodenfl[äa]che|fußboden|fussboden|boden|bodenbelag|laminat|parkett|vinyl|teppich|designboden|linoleum|estrich)'
  const m = t.match(new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(?:m²|qm|quadratmeter)[^.!?\\n]{0,30}?(?:${BELAG})`, 'i'))
    ?? t.match(new RegExp(`(?:${BELAG})[^.!?\\n]{0,30}?(\\d+(?:[.,]\\d+)?)\\s*(?:m²|qm|quadratmeter)`, 'i'))
  return m ? parseFloat(m[1].replace(',', '.')) : null
}

/** Abzugsfläche in m² ("30 m² abziehen", "minus 5 m²"). */
export function extrahiereAbzug(text: string): number | null {
  const t = text ?? ''
  const m = t.match(/(?:abzieh|minus|abzug|abzügl)[^.!?\n]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
    ?? t.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?\n]*?(?:abzieh|abzug)/i)
  return m ? parseFloat(m[1].replace(',', '.')) : null
}

/** Tor-/Garagentor-Maße (Breite × Höhe) — GPT übersieht "Tor" oft. */
export function extrahiereTorMasse(text: string): { breite: number; hoehe: number } | null {
  const t = text ?? ''
  const m = t.match(/\b(?:tor|garagentor|einfahrtstor)\b[^\d]*(\d+(?:[.,]\d+)?)[^\d]+(\d+(?:[.,]\d+)?)/i)
  if (!m) return null
  const breite = parseFloat(m[1].replace(',', '.'))
  const hoehe = parseFloat(m[2].replace(',', '.'))
  return breite > 0 && hoehe > 0 ? { breite, hoehe } : null
}

/**
 * Raumhöhe in Metern aus freiem Text — robust gegen "2 Meter 60"-Fallen.
 * "2,60 m hoch" / "2,60 hoch" / "2 Meter 60 hoch" / "3 m hoch" → korrekt.
 * NICHT: "2 Meter 60" → 60 (der alte Bug, der Erschwerniszuschlag auslöste).
 */
export function extrahiereRaumhoehe(text: string): number | null {
  // PM-008-Nachtest: "Giebelhöhe im Schnitt sechs Meter" (ausgeschriebene Zahl,
  // nicht "6") lief bisher ins Leere — diese Funktion kannte nur Ziffern. Einer
  // der beiden echten Aufrufer (Erschwerniszuschlag-Prüfung in maler-extras.ts)
  // übergibt das rohe, noch NICHT zahlwort-konvertierte Transkript, also muss
  // die Konvertierung HIER passieren, nicht nur beim Aufrufer in der
  // Entwurfsansicht (der das schon vorher selbst macht — doppelt konvertieren
  // ist unschädlich, da ersetzeZahlenWorte auf bereits-digitalem Text ein No-op ist).
  const t = ersetzeZahlenWorte(text ?? '')
  // PM-008: "giebelhöhe"/"wandhöhe" ergänzt — bei einer Fassade gibt's keine
  // "Raumhöhe", sondern die Höhe der Wand/des Giebels, das sagen Handwerker
  // typischerweise so ("Giebelhöhe im Schnitt sechs Meter").
  const HOCH = '(?:hoch|deckenh(?:ö|oe)he|raumh(?:ö|oe)he|giebelh(?:ö|oe)he|wandh(?:ö|oe)he)'
  // Kompakt "X Meter YZ [hoch]" → X + YZ/100 (z.B. "2 meter 60" = 2,60 m)
  const komp = t.match(new RegExp(`(\\d+)\\s*(?:m|meter)\\s+(\\d{1,2})\\s*(?:m\\s*)?${HOCH}`, 'i'))
  if (komp) {
    const val = parseInt(komp[1]) + parseInt(komp[2]) / 100
    return plausibleHoehe(val)
  }
  // Dezimal oder ganze Meter: "2,60 (m) hoch" / "3 meter hoch"
  const dez = t.match(new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(?:m|meter)?\\s*${HOCH}`, 'i'))
  if (dez) return plausibleHoehe(parseFloat(dez[1].replace(',', '.')))
  // Schlüsselwort zuerst: "Raumhöhe 4,5" / "Deckenhöhe von 3,20 m" /
  // "Giebelhöhe im Schnitt sechs Meter" (übliche Fassaden-Formulierung,
  // "im Schnitt"/"durchschnittlich" statt einer festen Zahl direkt danach).
  const kw = t.match(/(?:deckenh(?:ö|oe)he|raumh(?:ö|oe)he|giebelh(?:ö|oe)he|wandh(?:ö|oe)he)\s*(?:von\s*|ist\s*|beträgt\s*|im\s+schnitt\s*|durchschnittlich\s*|:\s*)?(\d+(?:[.,]\d+)?)/i)
  if (kw) return plausibleHoehe(parseFloat(kw[1].replace(',', '.')))
  return null
}

// Raumhöhen liegen realistisch zwischen ~2 und ~12 m — alles andere ist Fehl-Parse.
function plausibleHoehe(v: number): number | null {
  return v >= 1.5 && v <= 12 ? v : null
}

// PM-001: nahm bisher das ERSTE "N Fenster"/"N Tür" im Text. Bei einer
// Selbstkorrektur ("Ein Fenster — ne halt, zwei Fenster") steht die falsche
// Zahl aber zuerst — die Karte zeigte "1", obwohl "2" gemeint und im Rest der
// Berechnung (die auf GPTs Extraktion vertraut) korrekt verwendet wurde. Die
// LETZTE genannte Zahl ist in gesprochener Sprache so gut wie immer die
// gemeinte — Menschen korrigieren sich nach vorne, nicht nach hinten.
/** Fenster-Anzahl ("2 Fenster", "3 Dachfenster"). Bei mehreren Nennungen zählt die letzte. 0 wenn keine Zahl. */
export function zaehleFenster(text: string): number {
  const treffer = [...(text ?? '').matchAll(/(\d+)\s*\S*fenster/gi)]
  return treffer.length ? parseInt(treffer[treffer.length - 1][1]) : 0
}

/** Tür-Anzahl ("1 Tür", "2 Stück Türen"). Bei mehreren Nennungen zählt die letzte. 0 wenn keine Zahl. */
export function zaehleTueren(text: string): number {
  const treffer = [...(text ?? '').matchAll(/(\d+)\s*(?:stück\s*)?\S*tür(?:en)?/gi)]
  return treffer.length ? parseInt(treffer[treffer.length - 1][1]) : 0
}

// PM-008: Steht "X mal Y" in derselben (oder der direkt vorherigen)
// Komma-/Satzklausel wie "fenster"/"tür", ist es fast immer das Maß DIESER
// Öffnung, nicht das Maß des Raums/der Fassade selbst — z.B. "3 Fenster
// drin, 1,20 x 1,40" (Fenstermaß in eigener, knapper Klausel direkt nach der
// Fenster-Erwähnung). Ein festes Zeichenfenster hat das an einem echten
// Sandy-Transkript nachweislich verpasst (zu eng); jetzt satzzeichenbasiert:
// die eigene Klausel PLUS die davor.
function istOeffnungsKontext(text: string, index: number, laenge: number): boolean {
  const grenzen = /[,.!?]/g
  let letzteGrenze = -1
  let vorletzteGrenze = -1
  let treffer: RegExpExecArray | null
  while ((treffer = grenzen.exec(text)) && treffer.index < index) {
    vorletzteGrenze = letzteGrenze
    letzteGrenze = treffer.index
  }
  const start = Math.max(0, vorletzteGrenze + 1)
  // Ab index + laenge suchen, nicht ab index — sonst trifft die Suche den
  // Dezimalpunkt IM Treffer selbst (z.B. "1.20" enthält einen Punkt) und
  // bricht die Klausel viel zu früh ab.
  const restAbEnde = text.slice(index + laenge).search(/[,.!?]/)
  const ende = restAbEnde === -1 ? text.length : index + laenge + restAbEnde
  const umgebung = text.slice(start, ende).toLowerCase()
  return /fenster|tür/.test(umgebung)
}

export interface RaumdatenVorschau {
  laenge: number | null
  breite: number | null
  hoehe: number | null
  fenster: number
  tueren: number
}

/**
 * Grobe Vorschau-Maße für die Aufnahmekarte (rein clientseitige Heuristik,
 * NICHT die echte Berechnung — die läuft serverseitig über die Mengen-Engine
 * und ist davon unabhängig korrekt). Nimmt das erste "X mal Y" im Text, das
 * NICHT erkennbar eine Fenster-/Türöffnung beschreibt.
 */
export function extrahiereRaumdaten(transkript: string | null): RaumdatenVorschau {
  const text = ersetzeZahlenWorte(transkript ?? '')
  const lbTreffer = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:m(?:eter)?)?\s*(?:mal|x|×)\s*(\d+(?:[.,]\d+)?)\s*(?:m(?:eter)?)?/gi)]
  const lb = lbTreffer.find(t => !istOeffnungsKontext(text, t.index ?? 0, t[0].length))
    ?? text.match(/(\d+(?:[.,]\d+)?)\s*(?:m|meter)\s+lang[^.!?\n]*?(\d+(?:[.,]\d+)?)\s*(?:m|meter)\s+breit/i)
  const zahl = (wert: string) => Number(wert.replace(',', '.'))
  return {
    laenge: lb ? zahl(lb[1]) : null,
    breite: lb ? zahl(lb[2]) : null,
    hoehe: extrahiereRaumhoehe(text),
    fenster: zaehleFenster(text),
    tueren: zaehleTueren(text),
  }
}
