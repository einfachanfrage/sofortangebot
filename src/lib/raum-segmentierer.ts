export interface RaumSegment {
  id: number
  text: string
  typ: 'raum' | 'ergaenzung' | 'korrektur'
  signal?: string
  reihenfolge: number
  korrigiert?: boolean
  korrektur_text?: string
}

const RAUMWECHSEL_SIGNALE = [
  'und dann', 'dann noch', 'außerdem', 'dazu kommt', 'zusätzlich',
  'noch der', 'noch die', 'noch das', 'als nächstes', 'danach',
  'im wohnzimmer', 'im schlafzimmer', 'im kinderzimmer', 'im bad',
  'im badezimmer', 'in der küche', 'im flur', 'im keller',
  'im dachboden', 'im büro', 'im esszimmer', 'im gäste-wc',
  'im gäste wc', 'jetzt der', 'jetzt die', 'jetzt das',
  'nächster raum', 'zweiter raum', 'dritter raum',
]

const RAUM_NAMEN = [
  'wohnzimmer', 'schlafzimmer', 'kinderzimmer', 'bad', 'badezimmer',
  'küche', 'flur', 'keller', 'dachboden', 'büro', 'esszimmer',
  'gäste-wc', 'gäste wc', 'toilette', 'abstellraum', 'hauswirtschaft',
  'hausflur', 'treppenhaus', 'garage', 'terrasse', 'balkon',
]

const ERGAENZUNGS_SIGNALE = [
  'außerdem', 'zusätzlich', 'dazu', 'auch noch', 'ebenfalls',
  'oben drauf', 'noch dazu', 'und auch',
]

const KORREKTUR_SIGNALE = [
  '[korrektur]', 'warte mal', 'nein warte', 'ich meine', 'korrektur',
  'stimmt nicht', 'nicht', 'ähm nein', 'äh nein', 'moment',
  'stopp', 'zurück', 'das war falsch',
]

// Erkennt ob ein Text-Abschnitt ein Raumwechsel ist
function erkennTyp(text: string, vorher: string): 'raum' | 'ergaenzung' | 'korrektur' {
  const lower = text.toLowerCase()
  const vorherLower = vorher.toLowerCase()

  if (KORREKTUR_SIGNALE.some(s => lower.includes(s))) return 'korrektur'

  // Ergänzung: kein neuer Raum, aber Zusatz zum aktuellen
  if (ERGAENZUNGS_SIGNALE.some(s => lower.startsWith(s))) {
    if (!RAUM_NAMEN.some(r => lower.includes(r))) return 'ergaenzung'
  }

  // Wenn derselbe Raumname wie vorher → Ergänzung
  const aktuellerRaum = RAUM_NAMEN.find(r => vorherLower.includes(r))
  if (aktuellerRaum && lower.includes(aktuellerRaum)) return 'ergaenzung'

  return 'raum'
}

// Erkennt Inline-Multi-Raum-Pattern wie "Wohnzimmer 6×4m, Schlafzimmer 4.5×3.5m"
// und teilt in separate Zeilen auf, die dann normal verarbeitet werden können
function splitInlineRaeume(text: string): string[] {
  const lower = text.toLowerCase()
  // Positionen aller Raumnamen im Text finden
  const treffer: Array<{ pos: number; name: string }> = []
  for (const raumName of RAUM_NAMEN) {
    let start = 0
    while (true) {
      const idx = lower.indexOf(raumName, start)
      if (idx === -1) break
      // Nur als eigenständiges Wort (kein Buchstabe davor/danach)
      const vorher = idx === 0 || !/[a-zäöü]/.test(lower[idx - 1])
      const danach = idx + raumName.length >= lower.length || !/[a-zäöü]/.test(lower[idx + raumName.length])
      if (vorher && danach) treffer.push({ pos: idx, name: raumName })
      start = idx + 1
    }
  }
  // Deduplizieren und sortieren
  const unique = treffer
    .sort((a, b) => a.pos - b.pos)
    .filter((t, i, arr) => i === 0 || t.pos !== arr[i - 1].pos)

  // Nur aufteilen wenn ≥2 verschiedene Räume gefunden
  const verschiedeneNamen = new Set(unique.map(t => t.name))
  if (verschiedeneNamen.size < 2) return [text]

  const segmente: string[] = []
  for (let i = 0; i < unique.length; i++) {
    const start = unique[i].pos
    const end = i + 1 < unique.length ? unique[i + 1].pos : text.length
    const seg = text.slice(start, end).trim().replace(/[,;]\s*$/, '')
    if (seg) segmente.push(seg)
  }
  return segmente.length >= 2 ? segmente : [text]
}

// Teilt Transkript in Segmente auf Basis von Signalwörtern
export function segmentiereRaeume(transkript: string): RaumSegment[] {
  if (!transkript.trim()) return []

  // Bestehende \n-Markierungen aus transkript-normalisierer nutzen
  let zeilen = transkript.split('\n').map(z => z.trim()).filter(Boolean)

  // Inline-Multi-Raum-Pattern erkennen: "Wohnzimmer 6×4m, Schlafzimmer 4.5×3.5m"
  // Jede Zeile auf inline Raumwechsel prüfen und ggf. aufteilen
  const expandiert: string[] = []
  for (const zeile of zeilen) {
    const teile = splitInlineRaeume(zeile)
    expandiert.push(...teile)
  }
  zeilen = expandiert

  if (zeilen.length <= 1) {
    // Kein Raumwechsel erkannt — single segment
    return [{
      id: 0,
      text: transkript.trim(),
      typ: 'raum',
      reihenfolge: 0,
    }]
  }

  const segmente: RaumSegment[] = []
  let vorherText = ''

  for (let i = 0; i < zeilen.length; i++) {
    const zeile = zeilen[i]
    const lower = zeile.toLowerCase()

    // Signal-Wort identifizieren
    const signal = RAUMWECHSEL_SIGNALE.find(s => lower.startsWith(s) || lower.includes(s))

    // Text ohne Signal-Präfix
    const textOhneSignal = signal
      ? zeile.replace(new RegExp(`^.*?${signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[:\\s]*`, 'i'), '').trim() || zeile
      : zeile

    const typ = i === 0 ? 'raum' : erkennTyp(textOhneSignal, vorherText)

    segmente.push({
      id: i,
      text: textOhneSignal,
      typ,
      signal,
      reihenfolge: i,
    })

    vorherText = textOhneSignal
  }

  return segmente
}

// Löst Korrekturen auf: markiert korrigierte Segmente und entfernt [KORREKTUR]-Blöcke
export function loeseKorrekturenAuf(segmente: RaumSegment[]): RaumSegment[] {
  const ergebnis: RaumSegment[] = []

  for (let i = 0; i < segmente.length; i++) {
    const seg = segmente[i]

    if (seg.typ === 'korrektur') {
      // Das unmittelbar vorherige Segment als "korrigiert" markieren
      if (ergebnis.length > 0) {
        const letztes = ergebnis[ergebnis.length - 1]
        letztes.korrigiert = true
        letztes.korrektur_text = seg.text
      }
      // Korrektur-Segment selbst nicht ins Ergebnis aufnehmen
      continue
    }

    // [KORREKTUR]-Tags aus Text entfernen
    const bereinigterText = seg.text
      .replace(/\[KORREKTUR[^\]]*\]/gi, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (bereinigterText) {
      ergebnis.push({ ...seg, text: bereinigterText })
    }
  }

  return ergebnis
}

// Baut segmentierten Transkript-Text für den GPT-Prompt
export function bauSegmentiertenTranskript(segmente: RaumSegment[]): string {
  return segmente
    .filter(s => !s.korrigiert)
    .map(s => {
      const prefix = s.typ === 'ergaenzung' ? '[ERGAENZUNG]'
        : s.typ === 'korrektur' ? '[KORREKTUR]'
        : '[RAUM]'
      return `${prefix} ${s.text}`
    })
    .join('\n')
}
