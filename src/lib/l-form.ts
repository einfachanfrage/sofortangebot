// ── PM-035, Befund 1 (Prüfmeister, 02.09.2026): die L-Form verschwindet ───
//
// Gesagt: „Der Flur ist L-förmig, einmal sechs Meter mal eins zwanzig und der
// kurze Schenkel zwo Meter mal eins zwanzig."
// Angekommen: ein rechteckiger Flur. Der zweite Schenkel taucht nirgends auf —
// nicht als Fläche, nicht als Rückfrage, nicht als Hinweis. 2,40 m² Boden
// verschwinden lautlos; der Handwerker sieht keine falsche Zahl, sondern ein
// fehlendes Stück Raum.
//
// An den Produktionsdaten vom 03.09. nachgesehen, kommt der Flur inzwischen
// SO in der Extraktion an:
//
//   { name: "Flur", laenge: null, breite: null, flaeche: null,
//     tueren: [{ anzahl: 3, breite: 0.9 }] }
//
// Die KI gibt bei der L-Beschreibung also komplett auf. Es gibt keine Zahl,
// die man korrigieren könnte — die Maße müssen aus dem Text kommen. Genau das
// tut diese Datei.
//
// Fachlich, und deshalb überhaupt lösbar: Bei einem L ist der Umfang derselbe
// wie beim umschließenden Rechteck. Zwei Schenkel, die sich eine Breite
// teilen (ein Flur ist überall gleich breit), ergeben:
//
//   Fläche = Breite × (Schenkel 1 + Schenkel 2)
//   Umfang = 2 × (Schenkel 1 + Schenkel 2 + Breite)
//
// Für PM-035: 1,20 × (6,00 + 2,00) = 9,60 m² und 2 × (6+2+1,20) = 18,40 lfm —
// exakt die Soll-Werte des Prüfmeisters.
//
// Die Zuordnung der Zahlen ist der heikle Teil. Whisper schreibt „einmal" als
// „1 x", der Satz lautet also „L-förmig, 1 x 6 m x 1.20 und der kurze
// Schenkel 2 m x 1.20". Ein naiver Scan findet daraus auch das Paar (1 × 6).
// Deshalb werden ALLE Paare gesammelt (auch überlappende) und danach die
// Kombination gesucht, die geometrisch überhaupt ein L sein kann: Beide
// Schenkel teilen sich eine Seite, und diese geteilte Seite ist die Breite —
// also höchstens so lang wie die beiden Schenkel. (1 × 6) und (6 × 1,20)
// teilen sich zwar die 6, aber eine 6 m breite Wand mit 1 m langen Schenkeln
// ist kein Flur. Bleibt genau eine Kombination übrig, wird gerechnet;
// bleiben mehrere oder keine, wird gefragt statt geraten.

import { saetzeMitRaum } from './satz-raum'

const L_MARKER = /l-?f[öo]rmig|l-?form|winkelf[öo]rmig|[üu]ber eck|um die ecke|zwei schenkel|kurze[rn]? schenkel|langer schenkel/i

/** Ein Maßpaar aus dem Text — überlappend gesucht, deshalb mit Position. */
interface MassPaar {
  a: number
  b: number
  pos: number
}

const MASS_PAAR = /(\d+(?:[.,]\d+)?)\s*(?:m|meter)?\s*(?:x|×|mal)\s*(\d+(?:[.,]\d+)?)/gi

const MIN_SEITE_M = 0.3
const MAX_SEITE_M = 40
const MAX_FLAECHE_M2 = 300

function zahl(rohwert: string): number {
  return parseFloat(rohwert.replace(',', '.'))
}

/** Alle Maßpaare im Text — auch überlappende („1 x 6 m x 1.20" liefert beide). */
export function findeMassPaare(text: string): MassPaar[] {
  const paare: MassPaar[] = []
  let start = 0
  while (start < text.length) {
    MASS_PAAR.lastIndex = start
    const treffer = MASS_PAAR.exec(text)
    if (!treffer) break
    const a = zahl(treffer[1])
    const b = zahl(treffer[2])
    if (isFinite(a) && isFinite(b) && a >= MIN_SEITE_M && b >= MIN_SEITE_M && a <= MAX_SEITE_M && b <= MAX_SEITE_M) {
      paare.push({ a, b, pos: treffer.index })
    }
    // Nur um EIN Zeichen weiterrücken, damit überlappende Paare erhalten
    // bleiben — sonst frisst „1 x 6 m" das „6 m x 1.20" auf.
    start = treffer.index + 1
  }
  return paare
}

export interface LFormGeometrie {
  breite: number
  schenkel: [number, number]
  flaeche: number
  umfang: number
}

/**
 * Sucht die eine Kombination zweier Maßpaare, die ein L ergeben kann.
 * Null, wenn es keine oder mehrere gibt — dann wird gefragt, nicht geraten.
 */
export function baueLForm(paare: MassPaar[]): LFormGeometrie | null {
  const kandidaten: LFormGeometrie[] = []
  const gesehen = new Set<string>()

  for (let i = 0; i < paare.length; i++) {
    for (let j = i + 1; j < paare.length; j++) {
      const p = paare[i]
      const q = paare[j]
      if (p.pos === q.pos) continue
      for (const geteilt of [p.a, p.b]) {
        if (q.a !== geteilt && q.b !== geteilt) continue
        const schenkel1 = p.a === geteilt ? p.b : p.a
        const schenkel2 = q.a === geteilt ? q.b : q.a
        // Die geteilte Seite ist die Breite des Ganges — sie kann nicht länger
        // sein als die Schenkel, die von ihr abgehen.
        if (geteilt > schenkel1 || geteilt > schenkel2) continue
        const flaeche = Math.round(geteilt * (schenkel1 + schenkel2) * 100) / 100
        if (flaeche <= 0 || flaeche > MAX_FLAECHE_M2) continue
        const umfang = Math.round(2 * (schenkel1 + schenkel2 + geteilt) * 100) / 100
        const schluessel = `${flaeche}|${umfang}`
        if (gesehen.has(schluessel)) continue
        gesehen.add(schluessel)
        kandidaten.push({
          breite: geteilt,
          schenkel: [Math.max(schenkel1, schenkel2), Math.min(schenkel1, schenkel2)],
          flaeche,
          umfang,
        })
      }
    }
  }

  return kandidaten.length === 1 ? kandidaten[0] : null
}

export interface RaumFuerLForm {
  name?: string | null
  laenge?: number | null
  breite?: number | null
  flaeche?: number | null
  umfang?: number | null
}

export interface LFormErgebnis {
  hinweise: string[]
  /** Räume, für die eine L-Form übernommen wurde (Name → Geometrie). */
  erkannt: Map<string, LFormGeometrie>
}

function fmt(wert: number): string {
  return wert.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Erkennt L-förmige Räume im Transkript und schreibt Fläche + Umfang in den
 * Raum. Verändert die übergebenen Räume an Ort und Stelle.
 */
export function erkenneLFormen(
  text: string,
  raeume: RaumFuerLForm[] | undefined | null,
): LFormErgebnis {
  const hinweise: string[] = []
  const erkannt = new Map<string, LFormGeometrie>()
  const liste = (raeume ?? []).filter(r => (r?.name ?? '').trim() !== '')
  if (!text || liste.length === 0) return { hinweise, erkannt }

  const saetze = saetzeMitRaum(text, liste.map(r => (r.name ?? '').trim()))

  for (const raum of liste) {
    const name = (raum.name ?? '').trim()
    const eigene = saetze.filter(s => s.raum === name)
    const markerIndex = eigene.findIndex(s => L_MARKER.test(s.satz))
    if (markerIndex < 0) continue

    // Der Marker-Satz plus der nächste Satz desselben Raums — der zweite
    // Schenkel steht oft erst dahinter („… Der kurze Schenkel ist 2 × 1,20.").
    const abschnitt = eigene.slice(markerIndex, markerIndex + 2).map(s => s.satz).join(' ')
    const geometrie = baueLForm(findeMassPaare(abschnitt))

    if (!geometrie) {
      hinweise.push(
        `${name}: Der Raum wurde als L-förmig beschrieben, aber die beiden Schenkel sind aus dem Diktat ` +
        `nicht eindeutig herauszulesen. Es wurde NICHTS angenommen — bitte die Form über „Unförmig? Form zeichnen" ` +
        `eintragen oder die Fläche direkt setzen, sonst fehlt sie im Angebot.`,
      )
      continue
    }

    raum.flaeche = geometrie.flaeche
    raum.umfang = geometrie.umfang
    // Ein L ist kein Rechteck. Länge/Breite stehen zu lassen hieße, die
    // Rechteck-Formel weiterlaufen zu lassen — genau der stille Verlust.
    raum.laenge = null
    raum.breite = null
    erkannt.set(name, geometrie)

    hinweise.push(
      `${name}: L-Form aus ${fmt(geometrie.schenkel[0])} × ${fmt(geometrie.breite)} m und ` +
      `${fmt(geometrie.schenkel[1])} × ${fmt(geometrie.breite)} m gerechnet — ` +
      `${fmt(geometrie.flaeche)} m² Fläche, ${fmt(geometrie.umfang)} m Umfang für die Sockelleisten. ` +
      `Stimmt die Form nicht, bitte über „Unförmig? Form zeichnen" korrigieren.`,
    )
  }

  return { hinweise, erkannt }
}
