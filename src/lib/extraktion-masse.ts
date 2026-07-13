// Zentrale, getestete Parser für Maß-Angaben aus freiem Text.
//
// Etappe 3: Diese Regexes lagen bisher inline in angebot-extrahieren und waren
// ungetestet — die letzte fragile Rohtext-Stelle im heißen Pfad. Sie greifen als
// FALLBACK, wenn die KI ein Zahlenfeld nicht geliefert hat. Hier zentral + per
// Fuzzer bewacht; später kann die KI diese Werte direkt liefern (dann nur Fallback).

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
  const t = text ?? ''
  const HOCH = '(?:hoch|deckenh(?:ö|oe)he|raumh(?:ö|oe)he)'
  // Kompakt "X Meter YZ [hoch]" → X + YZ/100 (z.B. "2 meter 60" = 2,60 m)
  const komp = t.match(new RegExp(`(\\d+)\\s*(?:m|meter)\\s+(\\d{1,2})\\s*(?:m\\s*)?${HOCH}`, 'i'))
  if (komp) {
    const val = parseInt(komp[1]) + parseInt(komp[2]) / 100
    return plausibleHoehe(val)
  }
  // Dezimal oder ganze Meter: "2,60 (m) hoch" / "3 meter hoch"
  const dez = t.match(new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(?:m|meter)?\\s*${HOCH}`, 'i'))
  if (dez) return plausibleHoehe(parseFloat(dez[1].replace(',', '.')))
  // Schlüsselwort zuerst: "Raumhöhe 4,5" / "Deckenhöhe von 3,20 m"
  const kw = t.match(/(?:deckenh(?:ö|oe)he|raumh(?:ö|oe)he)\s*(?:von\s*|ist\s*|beträgt\s*|:\s*)?(\d+(?:[.,]\d+)?)/i)
  if (kw) return plausibleHoehe(parseFloat(kw[1].replace(',', '.')))
  return null
}

// Raumhöhen liegen realistisch zwischen ~2 und ~12 m — alles andere ist Fehl-Parse.
function plausibleHoehe(v: number): number | null {
  return v >= 1.5 && v <= 12 ? v : null
}

/** Fenster-Anzahl ("2 Fenster", "3 Dachfenster"). 0 wenn keine Zahl. */
export function zaehleFenster(text: string): number {
  const m = (text ?? '').match(/(\d+)\s*\S*fenster/i)
  return m ? parseInt(m[1]) : 0
}

/** Tür-Anzahl ("1 Tür", "2 Stück Türen"). 0 wenn keine Zahl. */
export function zaehleTueren(text: string): number {
  const m = (text ?? '').match(/(\d+)\s*(?:stück\s*)?\S*tür(?:en)?/i)
  return m ? parseInt(m[1]) : 0
}
