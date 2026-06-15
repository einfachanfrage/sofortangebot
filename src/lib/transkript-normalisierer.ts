export interface NormalisierungsErgebnis {
  original: string
  normalisiert: string
  aenderungen: string[]
  hat_korrektur: boolean
  hat_raumwechsel: boolean
}

// ── ZAHLEN-WÖRTERBUCH ─────────────────────────────────────────────────────────

const EINZEL_ZAHLEN: Record<string, number> = {
  'null': 0,
  'ein': 1, 'eine': 1, 'einem': 1, 'einer': 1, 'einen': 1, 'eins': 1,
  'zwei': 2, 'zwee': 2, 'zwo': 2,
  'drei': 3,
  'vier': 4,
  'fünf': 5,
  'sechs': 6,
  'sieben': 7,
  'acht': 8,
  'neun': 9,
  'zehn': 10,
  'elf': 11,
  'zwölf': 12,
  'dreizehn': 13,
  'vierzehn': 14,
  'fünfzehn': 15,
  'sechzehn': 16,
  'siebzehn': 17,
  'achtzehn': 18,
  'neunzehn': 19,
  'zwanzig': 20,
  'einundzwanzig': 21,
  'zweiundzwanzig': 22,
  'dreiundzwanzig': 23,
  'vierundzwanzig': 24,
  'fünfundzwanzig': 25,
  'dreißig': 30,
  'vierzig': 40,
  'fünfzig': 50,
  'sechzig': 60,
  'siebzig': 70,
  'achtzig': 80,
  'neunzig': 90,
  'hundert': 100,
  'zweihundert': 200,
  'dreihundert': 300,
}

const KOMBI_ZAHLEN: Record<string, number> = {
  'anderthalb': 1.5,
  'eineinhalb': 1.5,
  'zweieinhalb': 2.5,
  'dreieinhalb': 3.5,
  'viereinhalb': 4.5,
  'fünfeinhalb': 5.5,
  'sechseinhalb': 6.5,
  'siebeneinhalb': 7.5,
  'achteinhalb': 8.5,
  'neuneinhalb': 9.5,
  'zehneinhalb': 10.5,
}

// ── EINHEITEN-NORMALISIERUNG ──────────────────────────────────────────────────

const EINHEITEN: Array<[RegExp, string]> = [
  [/\bquadratmeter\b/gi, 'm²'],
  [/\bquadrat\b(?=\s|$)/gi, 'm²'],
  [/\bqm\b/gi, 'm²'],
  [/\bm\s*2\b/gi, 'm²'],
  [/\bm\s*zwei\b/gi, 'm²'],
  [/\bm\s*hoch\s*2\b/gi, 'm²'],
  [/\bvierkantmeter\b/gi, 'm²'],
  [/\blaufmeter\b/gi, 'lfdm'],
  [/\blaufende[nm]?\s*meter\b/gi, 'lfdm'],
  [/\blfm\b/gi, 'lfdm'],
  [/\blinear(meter)?\b/gi, 'lfdm'],
  [/\bkubikmeter\b/gi, 'm³'],
  [/\bcbm\b/gi, 'm³'],
  [/\bm\s*3\b/gi, 'm³'],
  [/\bm\s*drei\b/gi, 'm³'],
  [/\bcentimeter\b/gi, 'cm'],
]

// ── FACHBEGRIFFE-NORMALISIERUNG ───────────────────────────────────────────────

const FACHBEGRIFFE: Array<[RegExp, string]> = [
  // Maler
  [/\btapeten?\s*runter\b/gi, 'Tapeten entfernen'],
  [/\btapeten?\s*ab\b/gi, 'Tapeten entfernen'],
  [/\bnochmal\s+dr[üu]ber\b/gi, 'zweimal Anstrich'],
  [/\b(rauputz)\b/gi, 'Raufaser'],
  // Fliesen
  [/\b(fugen)\b(?!\s*masse)/gi, 'Verfugung'],
  [/\bsili\b/gi, 'Silikon'],
  [/\bbodeneben\b/gi, 'bodengleich'],
  [/\bebenerdig\b/gi, 'bodengleich'],
  [/\bebenerdige?\s*dusche\b/gi, 'bodengleiche Dusche'],
  // Elektro
  [/\bdosen\b(?!\s*dose)/gi, 'Steckdosen'],
  [/\b(spots?)\b/gi, 'Einbaustrahler'],
  [/\b(downlights?)\b/gi, 'Einbaustrahler'],
  [/\b(sicherungskasten|verteilerkasten)\b/gi, 'Unterverteilung'],
  [/\b(ladepunkt|ladestation|e-ladesäule)\b/gi, 'Wallbox'],
  [/\bleer\s*rohr\b/gi, 'Leerrohr'],
  // Sanitär
  [/\b(waschbecken)\b/gi, 'Waschtisch'],
  [/\b(toilette|klo|örtchen|stilles\s*örtchen)\b/gi, 'WC'],
  [/\b(radiator)\b/gi, 'Heizkörper'],
  [/\b(wasserhahn|hahn)\b/gi, 'Armatur'],
  [/\b(mischer)\b/gi, 'Armatur'],
  // Trockenbau
  [/\b(gipskarton|gk-platte|gips-platte)\b/gi, 'Rigips'],
  [/\bst[äa]nder\s*wand\b/gi, 'Ständerwand'],
  [/\babgeh[äa]ngte?\s*decke\b/gi, 'Unterdecke'],
  [/\bdecke\s*absenken\b/gi, 'Unterdecke'],
  // Allgemein
  [/\b(rausreißen|rausschmeißen|rauswerfen)\b/gi, 'entfernen'],
  [/\b(reinmachen|einsetzen)\b/gi, 'einbauen'],
  [/\b(erneuern|ersetzen|neu\s+machen)\b/gi, 'erneuern'],
]

// ── DIALEKT-NORMALISIERUNG ────────────────────────────────────────────────────

const DIALEKTE: Array<[RegExp, string]> = [
  // Bayerisch
  [/\bois\b/gi, 'alles'],
  [/\bnix\b/gi, 'nichts'],
  [/\bned\b/gi, 'nicht'],
  [/\bkoa\b/gi, 'kein'],
  [/\bwia\b/gi, 'wie'],
  [/\bdes\b(?=\s)/gi, 'das'],
  [/\bwos\b/gi, 'was'],
  [/\bhoid\b/gi, 'halt'],
  [/\bschau\s*mer\b/gi, 'schauen wir'],
  [/\bzwoa\b/gi, 'zwei'],
  [/\bdroa\b/gi, 'drei'],
  [/\bviara\b/gi, 'vier'],
  [/\bfümfe?\b/gi, 'fünf'],
  [/\bsechse?\b(?!\s*zehn)/gi, 'sechs'],
  [/\bsiebne?\b/gi, 'sieben'],
  [/\bachte?\b(?!\s*zehn)/gi, 'acht'],
  [/\bneune?\b(?!\s*zehn)/gi, 'neun'],
  // Berlinerisch
  [/\bzwee\b/gi, 'zwei'],
  [/\bick\b/gi, 'ich'],
  [/\bdet\b/gi, 'das'],
  [/\bdit\b/gi, 'dies'],
  [/\bn[üu]scht\b/gi, 'nichts'],
  [/\bjesacht\b/gi, 'gesagt'],
  [/\bjemacht\b/gi, 'gemacht'],
  // Schwäbisch / Alemannisch
  [/\bgell\b/gi, ''],
  [/\b(net|nett)\b(?=\s+(mal|so|mehr))/gi, 'nicht'],
  [/\bauf'm\b/gi, 'auf dem'],
  [/\bin'm\b/gi, 'in dem'],
  // Rheinisch
  [/\bd[ao]t\b/gi, 'das'],
  [/\bne\b(?=\s+[a-z])/gi, 'eine'],
  // Allgemein Umgangssprache
  [/\bso['\s]*n\b/gi, 'ein'],
  [/\bn['\s](\w)/gi, 'ein $1'],
]

// ── MAßANGABEN ────────────────────────────────────────────────────────────────

const MASSANGABEN: Array<[RegExp, string]> = [
  // "5 mal 4" → "5 × 4"
  [/(\d+[,.]?\d*)\s+mal\s+(\d+[,.]?\d*)/gi, '$1 × $2'],
  // "5 auf 4" → "5 × 4"
  [/(\d+[,.]?\d*)\s+auf\s+(\d+[,.]?\d*)/gi, '$1 × $2'],
  // "5 zu 4" → "5 × 4"
  [/(\d+[,.]?\d*)\s+zu\s+(\d+[,.]?\d*)/gi, '$1 × $2'],
  // "5 x 4" normalisieren
  [/(\d+[,.]?\d*)\s*[xX]\s*(\d+[,.]?\d*)/g, '$1 × $2'],
  // Komma als Dezimaltrennzeichen (nur zwischen Ziffern)
  [/(\d+),(\d+)/g, '$1.$2'],
]

// ── RAUMWECHSEL-SIGNALE ───────────────────────────────────────────────────────

const RAUMWECHSEL: Array<[RegExp, string]> = [
  [/\bund\s+dann\b/gi, '\nUnd dann:'],
  [/\bdann\s+noch\b/gi, '\nDann noch:'],
  [/\baußerdem\b/gi, '\nAußerdem:'],
  [/\bdazu\s+kommt\b/gi, '\nDazu kommt:'],
  [/\bnoch\s+der\b(?=\s)/gi, '\nNoch der:'],
  [/\bnoch\s+die\b(?=\s)/gi, '\nNoch die:'],
  [/\bnoch\s+das\b(?=\s)/gi, '\nNoch das:'],
  [/\bim\s+(wohnzimmer|schlafzimmer|kinderzimmer|bad|küche|flur|keller|dachboden|büro|esszimmer)\b/gi, '\nIm $1:'],
  [/\b(wohnzimmer|schlafzimmer|kinderzimmer|badezimmer|küche|flur|keller|dachboden|büro|esszimmer)\s+dann\b/gi, '\n$1:'],
]

// ── KORREKTUREN MARKIEREN ─────────────────────────────────────────────────────

const KORREKTUREN: Array<[RegExp, string]> = [
  [/\bwarte\s+mal\b/gi, '[KORREKTUR]'],
  [/\bnein\s+warte\b/gi, '[KORREKTUR]'],
  [/\bich\s+meine\b/gi, '[KORREKTUR]'],
  [/\bnicht\s+(\w+)\s+sondern\b/gi, '[KORREKTUR: nicht $1 sondern]'],
  [/\bkorrektur\b/gi, '[KORREKTUR]'],
  [/\bstimmt\s+nicht\b/gi, '[KORREKTUR]'],
  [/\bäh+\s+nein\b/gi, '[KORREKTUR]'],
]

// ── ZAHLEN VOR EINHEITEN ──────────────────────────────────────────────────────

const EINHEITEN_PATTERN = 'm²|lfdm|m³|cm|stück|stk|meter|quadrat'

function ersetzeZahlenWorte(text: string): string {
  let ergebnis = text

  // Kombi-Zahlen zuerst (längere Wörter zuerst)
  for (const [wort, zahl] of Object.entries(KOMBI_ZAHLEN)) {
    ergebnis = ergebnis.replace(new RegExp(`\\b${wort}\\b`, 'gi'), String(zahl))
  }

  // Einzel-Zahlen nur direkt vor Einheiten
  const sortiert = Object.entries(EINZEL_ZAHLEN).sort((a, b) => b[0].length - a[0].length)
  for (const [wort, zahl] of sortiert) {
    const pattern = new RegExp(
      `\\b${wort}\\b(?=\\s*(${EINHEITEN_PATTERN}))`,
      'gi'
    )
    ergebnis = ergebnis.replace(pattern, String(zahl))
  }

  // "X Komma Y" → Dezimalzahl
  for (const [wort, zahl] of sortiert) {
    const pattern = new RegExp(`\\b${wort}\\s+komma\\s+(\\w+)`, 'gi')
    ergebnis = ergebnis.replace(pattern, (_match, dezTeil: string) => {
      const dez = EINZEL_ZAHLEN[dezTeil.toLowerCase()]
      return dez !== undefined ? `${zahl}.${dez}` : `${zahl}.${dezTeil}`
    })
  }

  return ergebnis
}

// ── HAUPTFUNKTION ─────────────────────────────────────────────────────────────

export function normalisierenTranskript(text: string): NormalisierungsErgebnis {
  let ergebnis = text
  const aenderungen: string[] = []

  function apply(regeln: Array<[RegExp, string]>, schritt: string) {
    for (const [pattern, ersatz] of regeln) {
      const vorher = ergebnis
      ergebnis = ergebnis.replace(pattern, ersatz)
      if (ergebnis !== vorher) aenderungen.push(schritt)
    }
  }

  apply(DIALEKTE, 'Dialekt')
  apply(MASSANGABEN, 'Maßangabe')
  ergebnis = ersetzeZahlenWorte(ergebnis)
  apply(EINHEITEN, 'Einheit')
  apply(FACHBEGRIFFE, 'Fachbegriff')
  apply(RAUMWECHSEL, 'Raumwechsel')
  apply(KORREKTUREN, 'Korrektur')

  // Bereinigen
  ergebnis = ergebnis.replace(/  +/g, ' ').replace(/\n +/g, '\n').trim()

  return {
    original: text,
    normalisiert: ergebnis,
    aenderungen: [...new Set(aenderungen)],
    hat_korrektur: ergebnis.includes('[KORREKTUR'),
    hat_raumwechsel: ergebnis.includes('\n'),
  }
}
