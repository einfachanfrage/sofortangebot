// ── EINER ─────────────────────────────────────────────────────────────────────

const EINER: Record<string, number> = {
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
}

const ZEHNER: Record<string, number> = {
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
  'dreißig': 30,
  'vierzig': 40,
  'fünfzig': 50,
  'sechzig': 60,
  'siebzig': 70,
  'achtzig': 80,
  'neunzig': 90,
}

// "einundzwanzig", "zweiunddreißig" etc.
function generiereZusammengesetzte(): Record<string, number> {
  const result: Record<string, number> = {}
  // Nur Basisformen für Zusammensetzung
  const einerBasis: Record<string, number> = {
    'ein': 1, 'zwei': 2, 'drei': 3, 'vier': 4, 'fünf': 5,
    'sechs': 6, 'sieben': 7, 'acht': 8, 'neun': 9,
  }
  for (const [einerWort, einerZahl] of Object.entries(einerBasis)) {
    for (const [zehnerWort, zehnerZahl] of Object.entries(ZEHNER)) {
      if (zehnerZahl >= 20) {
        result[`${einerWort}und${zehnerWort}`] = einerZahl + zehnerZahl
      }
    }
  }
  return result
}

const ZUSAMMENGESETZT = generiereZusammengesetzte()

const ALLE_ZAHLEN: Record<string, number> = {
  ...EINER,
  ...ZEHNER,
  ...ZUSAMMENGESETZT,
  'hundert': 100,
  'einhundert': 100,
  'zweihundert': 200,
  'dreihundert': 300,
  'vierhundert': 400,
  'fünfhundert': 500,
}

const KOMBI: Record<string, number> = {
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

const BRUECHE: Record<string, number> = {
  'halb': 0.5, 'halbe': 0.5, 'halben': 0.5, 'halber': 0.5, 'halbes': 0.5,
  'viertel': 0.25,
  'dreiviertel': 0.75,
  'drittel': 0.3333,
}

// ── PARSER ────────────────────────────────────────────────────────────────────

export function parseZahlWort(text: string): number | null {
  const lower = text.toLowerCase().trim()

  if (/^\d+([.,]\d+)?$/.test(lower)) {
    return parseFloat(lower.replace(',', '.'))
  }
  if (KOMBI[lower] !== undefined) return KOMBI[lower]
  if (BRUECHE[lower] !== undefined) return BRUECHE[lower]
  if (ALLE_ZAHLEN[lower] !== undefined) return ALLE_ZAHLEN[lower]

  // "X Komma Y"
  const kommaMatch = lower.match(/^(\w+)\s+komma\s+(\w+)$/)
  if (kommaMatch) {
    const v = parseZahlWort(kommaMatch[1])
    const d = parseZahlWort(kommaMatch[2])
    if (v !== null && d !== null) return parseFloat(`${v}.${d}`)
  }

  // "X und ein Halb"
  const halbMatch = lower.match(/^(\w+)\s+und\s+(?:ein\s+)?halb$/)
  if (halbMatch) {
    const b = parseZahlWort(halbMatch[1])
    if (b !== null) return b + 0.5
  }

  // "drei viertel"
  const viertelMatch = lower.match(/^(\w+)\s+viertel$/)
  if (viertelMatch) {
    const f = parseZahlWort(viertelMatch[1])
    if (f !== null) return f * 0.25
  }

  return null
}

// ── ZAHLWÖRTER IM TEXT ERSETZEN ───────────────────────────────────────────────

const EINHEITEN_REGEX = 'm²|lfdm|m³|cm|meter|quadrat|stück|stk|quadratmeter|laufmeter|kubikmeter'

export function ersetzeZahlenWorte(text: string): string {
  let result = text

  // 1. Kombi-Zahlen zuerst (anderthalb etc.)
  for (const [wort, zahl] of Object.entries(KOMBI)) {
    result = result.replace(new RegExp(`\\b${wort}\\b`, 'gi'), String(zahl))
  }

  // 2. "X Komma Y" → Dezimalzahl
  result = result.replace(/\b(\w+)\s+komma\s+(\w+)\b/gi, (_match, vorTeil, nachTeil) => {
    const v = parseZahlWort(vorTeil)
    const n = parseZahlWort(nachTeil)
    if (v !== null && n !== null) return `${v}.${n}`
    return _match
  })

  // 3. "X und ein halb" → Dezimalzahl
  result = result.replace(/\b(\w+)\s+und\s+(?:ein\s+)?halb\b/gi, (_match, basis) => {
    const b = parseZahlWort(basis)
    if (b !== null) return String(b + 0.5)
    return _match
  })

  // 4. Einfache Zahlwörter — alle standalone ersetzen (vor Einheiten UND vor anderen Wörtern)
  const zahlenAlternative = Object.keys(ALLE_ZAHLEN)
    .sort((a, b) => b.length - a.length) // längste zuerst
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')

  result = result.replace(
    new RegExp(`\\b(${zahlenAlternative})\\b`, 'gi'),
    (match) => {
      const zahl = parseZahlWort(match)
      return zahl !== null ? String(zahl) : match
    }
  )

  // 5. Dezimalkomma → Dezimalpunkt (nur zwischen Ziffern)
  result = result.replace(/(\d+),(\d+)/g, '$1.$2')

  return result
}

// ── MASSANGABEN EXTRAHIEREN ───────────────────────────────────────────────────

export interface MassErgebnis {
  typ: 'dimension' | 'flaeche' | 'laenge' | 'stueckzahl'
  wert1: number
  wert2?: number
  einheit: string
  original: string
}

export function normalisiereMasse(text: string): MassErgebnis[] {
  const ergebnisse: MassErgebnis[] = []

  // Dimensionen — Reihenfolge ist wichtig: mit Dezimalstellen zuerst matchen
  // "5,20 mal 4,80" → 5.20 × 4.80  (Komma = Dezimaltrenner, nicht Tausender oder Malzeichen)
  // "4×3,50" → 4.0 × 3.5
  // "4 mal 3" → 4.0 × 3.0
  const dimPatterns: RegExp[] = [
    // Beide Zahlen mit Dezimalstelle: "5,20 mal 4,80" / "5.20×4.80"
    /(\d+)[.,](\d+)\s*(?:mal|×|x|auf|zu|bei)\s*(\d+)[.,](\d+)\s*(?:meter|m\b)?/gi,
    // Erste ganz, zweite mit Dezimalstelle: "4 mal 3,50" / "4×3,50"
    /(\d+)\s*(?:mal|×|x|auf|zu|bei)\s*(\d+)[.,](\d+)\s*(?:meter|m\b)?/gi,
    // Beide ganzzahlig: "5 mal 4"
    /(\d+)\s*(?:mal|×|x|auf|zu|bei)\s*(\d+)\s*(?:meter|m\b)?/gi,
  ]
  let m: RegExpExecArray | null
  const dimGematched = new Set<number>() // vermeide Doppel-Matches
  for (const pat of dimPatterns) {
    pat.lastIndex = 0
    while ((m = pat.exec(text)) !== null) {
      if (dimGematched.has(m.index)) continue
      dimGematched.add(m.index)
      let wert1: number, wert2: number
      if (m.length === 5) {
        // Beide mit Dezimal: gruppen 1,2 = erste Zahl; 3,4 = zweite Zahl
        wert1 = parseFloat(`${m[1]}.${m[2]}`)
        wert2 = parseFloat(`${m[3]}.${m[4]}`)
      } else if (m.length === 4) {
        // Erste ganz, zweite mit Dezimal: gruppen 1 = erste; 2,3 = zweite
        wert1 = parseFloat(m[1])
        wert2 = parseFloat(`${m[2]}.${m[3]}`)
      } else {
        wert1 = parseFloat(m[1])
        wert2 = parseFloat(m[2])
      }
      // Plausibilitätsprüfung: Raummaße typisch 1.5m–50m
      if (wert1 >= 0.5 && wert1 <= 50 && wert2 >= 0.5 && wert2 <= 50) {
        ergebnisse.push({ typ: 'dimension', wert1, wert2, einheit: 'm', original: m[0] })
      }
    }
  }

  // Länge × Breite textlich: "Länge 5 Breite 4"
  const lbPattern = /(?:länge|lang)\s*(\d+\.?\d*)\s*(?:breite|breit)\s*(\d+\.?\d*)/gi
  while ((m = lbPattern.exec(text)) !== null) {
    ergebnisse.push({ typ: 'dimension', wert1: parseFloat(m[1]), wert2: parseFloat(m[2]), einheit: 'm', original: m[0] })
  }

  // Fläche
  const flaechePattern = /(\d+\.?\d*)\s*(?:m²|qm|quadratmeter|quadrat)\b/gi
  while ((m = flaechePattern.exec(text)) !== null) {
    ergebnisse.push({ typ: 'flaeche', wert1: parseFloat(m[1]), einheit: 'm²', original: m[0] })
  }

  // Laufmeter
  const laufPattern = /(\d+\.?\d*)\s*(?:lfdm|lfm|laufmeter|laufende\s*meter)\b/gi
  while ((m = laufPattern.exec(text)) !== null) {
    ergebnisse.push({ typ: 'laenge', wert1: parseFloat(m[1]), einheit: 'lfdm', original: m[0] })
  }

  // Stückzahl
  const stueckPattern = /(\d+)\s*(?:stück|stk|einzel)\b/gi
  while ((m = stueckPattern.exec(text)) !== null) {
    ergebnisse.push({ typ: 'stueckzahl', wert1: parseInt(m[1]), einheit: 'Stück', original: m[0] })
  }

  return ergebnisse
}
