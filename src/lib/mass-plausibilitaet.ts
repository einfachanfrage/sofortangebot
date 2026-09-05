// PM-010, Vorschlag von Head of IT, freigegeben von Sandy (2026-08-17):
// Whisper (Spracherkennung) verschriftlicht die Handwerker-Sprechweise
// "drei fünfzig" (= 3,50 m) manchmal direkt als Ziffernfolge "350" — schon
// BEVOR unser eigener Code überhaupt läuft. Das ist mit Text-Nachbearbeitung
// grundsätzlich nicht zuverlässig zu fangen (siehe PM-010-Fix-Update in
// docs/pruefmeister-testfaelle.md). Diese Prüfung repariert das NICHT,
// sondern macht es nur sichtbar: eine unrealistische Raumseite löst eine
// Warnung aus, bevor ein Angebot mit einer absurden Fläche verschickt wird.
//
// Wichtig, passend zur Produktphilosophie: blockiert NIE den Flow. Nur ein
// Hinweis, den der Mensch in 5 Sekunden sieht und selbst einschätzt — nicht
// mehr "100% korrekt" erzwingen, nur schneller korrigierbar machen.
const MAX_PLAUSIBLE_SEITE_M = 15

export interface RaumFuerPlausibilitaet {
  name?: string | null
  laenge?: number | null
  breite?: number | null
}

// ── PM-034 (Prüfmeister, 02.09.2026): von „warnen" zu „korrigieren" ────────
//
// Der Kommentar oben sagt: „repariert das NICHT, macht es nur sichtbar."
// Diese Einordnung trägt nach PM-034 nicht mehr, und die Begründung des
// Prüfmeisters ist die richtige: „drei fünfzig" ist nicht der Sonderfall,
// sondern die normale Sprechweise auf dem Bau. Kein Handwerker sagt „drei
// Komma fünf null Meter". In EINEM Diktat hat es zwei von drei Maßangaben
// zerlegt — Küche „360 x 3" (1.080 m² statt 10,80) und Esszimmer „4 x 350"
// (1.400 m² statt 14,00). Ein Werkzeug, das Sprache aufnimmt, muss die
// Sprache können, die gesprochen wird.
//
// Belegt an den echten Transkripten vom 02./03.09.: Whisper schreibt im selben
// Aufnahme-Batch mal „4,50" und „2,80" (richtig), mal „360" und „350"
// (falsch). Es ist also kein Parser-Fehler bei uns — der Text kommt schon so
// an. Wortbasierte Reparatur greift deshalb nicht: es gibt keine Wörter mehr.
//
// Die Korrektur ist bewusst eng:
//   * nur Raumseiten, die als Meterangabe unmöglich sind (> 15 m),
//   * nur ganze Zahlen mit drei oder vier Ziffern,
//   * nur wenn das Ergebnis danach plausibel ist (0,5 bis 15 m).
// Ein 120 m langer Zaun bleibt damit unangetastet — der ist keine Raumseite.
//
// Und sie passiert NICHT still: jede Korrektur erzeugt einen Hinweis, der
// wörtlich sagt, was aus was wurde. Stillschweigend Zahlen zu ändern wäre
// schlimmer als der Fehler.

const MIN_PLAUSIBLE_SEITE_M = 0.5

/** Was aus einer unmöglichen Seitenlänge wird — oder null, wenn nichts Sinnvolles. */
export function korrigiereSeitenlaenge(wert: number): number | null {
  if (!isFinite(wert) || wert <= MAX_PLAUSIBLE_SEITE_M) return null
  if (!Number.isInteger(wert)) return null
  const ziffern = String(wert)
  if (ziffern.length < 3 || ziffern.length > 4) return null
  const korrigiert = wert / 100
  if (korrigiert < MIN_PLAUSIBLE_SEITE_M || korrigiert > MAX_PLAUSIBLE_SEITE_M) return null
  return Math.round(korrigiert * 100) / 100
}

export interface KorrekturErgebnis {
  /** Menschlich lesbare Hinweise — gehören in dieselbe Anzeige wie die Warnungen. */
  hinweise: string[]
}

/**
 * Korrigiert offensichtlich verschriftlichte Sprechweisen in den Raummaßen.
 * Verändert die übergebenen Räume an Ort und Stelle — der Aufrufer arbeitet
 * mit genau diesen Objekten weiter.
 */
export function korrigiereRaumMasse(raeume: RaumFuerPlausibilitaet[] | undefined | null): KorrekturErgebnis {
  const hinweise: string[] = []
  for (const raum of raeume ?? []) {
    const name = raum?.name?.trim() || 'Raum'
    for (const feld of ['laenge', 'breite'] as const) {
      const wert = raum?.[feld]
      if (typeof wert !== 'number') continue
      const korrigiert = korrigiereSeitenlaenge(wert)
      if (korrigiert === null) continue
      raum[feld] = korrigiert
      const label = feld === 'laenge' ? 'Länge' : 'Breite'
      hinweise.push(
        `${name}: ${label} „${wert}" als ${korrigiert.toLocaleString('de-DE', { minimumFractionDigits: 2 })} m gelesen — ` +
        `so wird „${String(wert)[0]} ${String(wert).slice(1)}" auf dem Bau gesprochen. Stimmt das nicht, bitte unten auf der Raumkarte korrigieren.`,
      )
    }
  }
  return { hinweise }
}

export function pruefeMassPlausibilitaet(raeume: RaumFuerPlausibilitaet[] | undefined | null): string[] {
  const warnungen: string[] = []
  for (const raum of raeume ?? []) {
    const name = raum?.name?.trim() || 'Raum'
    const felder: Array<['Länge' | 'Breite', number | null | undefined]> = [
      ['Länge', raum?.laenge],
      ['Breite', raum?.breite],
    ]
    for (const [feld, wert] of felder) {
      if (typeof wert === 'number' && isFinite(wert) && wert > MAX_PLAUSIBLE_SEITE_M) {
        const wertText = wert.toLocaleString('de-DE')
        warnungen.push(
          `${name}: ${feld} ${wertText} m wirkt unrealistisch für einen Innenraum — bitte kurz prüfen (z. B. wurde „drei fünfzig" (3,50 m) als Ziffer „350" verstanden statt als Meterangabe mit Komma).`,
        )
      }
    }
  }
  return warnungen
}
