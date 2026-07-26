/**
 * GPT-4o-mini gibt bei Mehrraum-Aufträgen manchmal falsche Raumnamen oder -maße zurück.
 * Diese Funktionen erkennen das und reparieren direkt aus dem Originaltext via Regex.
 */

const RAUM_WOERTER = [
  'wohnzimmer','schlafzimmer','kinderzimmer','bad','badezimmer','wc','küche','kueche',
  'flur','keller','dachboden','büro','buro','esszimmer','gästezimmer','gastezimmer',
  'toilette','abstellraum','hauswirtschaft','treppenhaus','garage','terrasse','balkon',
  'zimmer','studio','arbeitszimmer','diele','hauswirtschaftsraum','spielzimmer','hobbyraum',
]

const RAUM_PATTERN = new RegExp(
  '(' + RAUM_WOERTER.join('|') + ')' +
  '[^0-9]*?' +
  '([0-9]+[,.]?[0-9]*)\\s*[×xX]\\s*([0-9]+[,.]?[0-9]*)',
  'gi'
)

interface RaumMass { raumName: string; laenge: number; breite: number }

/** Extrahiert Raumname → Maße direkt aus dem Transkripttext via Regex */
export function extrahiereMasseAusText(transkript: string): Map<string, RaumMass> {
  const ergebnis = new Map<string, RaumMass>()
  RAUM_PATTERN.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = RAUM_PATTERN.exec(transkript)) !== null) {
    const raumName = m[1].toLowerCase().trim()
    const laenge = parseFloat(m[2].replace(',', '.'))
    const breite = parseFloat(m[3].replace(',', '.'))
    if (laenge > 0 && breite > 0 && !ergebnis.has(raumName)) {
      ergebnis.set(raumName, { raumName, laenge, breite })
    }
  }
  return ergebnis
}

/**
 * Bei Mehrraum-Aufträgen: extrahiert Maße direkt aus Originaltext und überschreibt
 * GPT-Werte wenn der Text klare Maße für diesen Raum enthält.
 * Funktioniert bei Duplikaten (GPT kopiert Raum 1 auf alle) UND gemischten Fehlern (6×3.5 statt 4.5×3.5).
 */
export function repariereDuplikatMasse<T extends {
  name: string
  laenge?: number | null
  breite?: number | null
}>(raeume: T[], transkript: string): { repariert: T[]; wurdeRepariert: boolean } {
  if (!raeume || raeume.length < 2) return { repariert: raeume, wurdeRepariert: false }

  const textMasse = extrahiereMasseAusText(transkript)
  // Nur eingreifen wenn Text mindestens 2 Räume mit Maßen enthält
  if (textMasse.size < 2) return { repariert: raeume, wurdeRepariert: false }

  let wurdeRepariert = false
  const repariert = raeume.map(raum => {
    const raumLower = raum.name.toLowerCase().trim()
    // Exakten Match suchen, dann Teilstring-Match
    const match = textMasse.get(raumLower)
      ?? Array.from(textMasse.values()).find(m =>
        raumLower.includes(m.raumName) || m.raumName.includes(raumLower)
      )
    if (match && (match.laenge !== raum.laenge || match.breite !== raum.breite)) {
      wurdeRepariert = true
      return { ...raum, laenge: match.laenge, breite: match.breite }
    }
    return raum
  })

  return { repariert, wurdeRepariert }
}

const RAUM_NAME_PATTERN = new RegExp(
  '(' + RAUM_WOERTER.join('|') + ')',
  'gi'
)

/** Extrahiert alle Raumnamen aus dem Text in Reihenfolge ihres Auftretens (ohne Duplikate) */
function extrahiereRaumNamenAusText(transkript: string): string[] {
  const lower = transkript.toLowerCase()
  const treffer: Array<{ pos: number; name: string }> = []
  RAUM_NAME_PATTERN.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = RAUM_NAME_PATTERN.exec(lower)) !== null) {
    const name = m[1].toLowerCase()
    // Nur als eigenständiges Wort
    const vorher = m.index === 0 || !/[a-zäöü]/.test(lower[m.index - 1])
    const danach = m.index + name.length >= lower.length || !/[a-zäöü]/.test(lower[m.index + name.length])
    if (vorher && danach) treffer.push({ pos: m.index, name })
  }
  // Deduplizieren: nur erste Erwähnung jedes Raumnamens, in Reihenfolge
  const seen = new Set<string>()
  return treffer
    .sort((a, b) => a.pos - b.pos)
    .filter(t => { if (seen.has(t.name)) return false; seen.add(t.name); return true })
    .map(t => t.name.charAt(0).toUpperCase() + t.name.slice(1))
}

/**
 * GPT-4o-mini benennt bei Mehrraum-Aufträgen manchmal alle Räume gleich (z.B. alle "Wohnzimmer").
 * Diese Funktion erkennt doppelte Namen und repariert sie direkt aus dem Transkript.
 */
export function repariereDuplikatNamen<T extends { name: string }>(
  raeume: T[], transkript: string
): { repariert: T[]; wurdeRepariert: boolean } {
  if (!raeume || raeume.length < 2) return { repariert: raeume, wurdeRepariert: false }

  const namen = raeume.map(r => r.name.toLowerCase())
  const hatDuplikat = namen.some((n, i) => namen.indexOf(n) !== i)
  if (!hatDuplikat) return { repariert: raeume, wurdeRepariert: false }

  const textNamen = extrahiereRaumNamenAusText(transkript)
  if (textNamen.length < raeume.length) return { repariert: raeume, wurdeRepariert: false }

  let wurdeRepariert = false
  const repariert = raeume.map((raum, i) => {
    const textName = textNamen[i]
    if (textName && textName.toLowerCase() !== raum.name.toLowerCase()) {
      wurdeRepariert = true
      return { ...raum, name: textName }
    }
    return raum
  })
  return { repariert, wurdeRepariert }
}
