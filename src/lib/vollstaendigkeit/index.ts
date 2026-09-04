import type { BerechnetePosition } from '../mengen/types'
import { baueVerstaendnis, type ExtraktionSignale } from '../auftrags-verstaendnis'
import { pruefeMaler } from './maler'
import { pruefeFliesen } from './fliesen'
import { pruefeSanitaer } from './sanitaer'
import { pruefeTrockenbau } from './trockenbau'
import { pruefeBoden } from './boden'
import { pruefeElektro } from './elektro'

interface CheckErgebnis {
  fehlende: string[]
  positionen: BerechnetePosition[]
}

export function hat(positionen: BerechnetePosition[], ...begriffe: string[]): boolean {
  return positionen.some(p => p.beschreibung != null && begriffe.some(b => p.beschreibung.toLowerCase().includes(b)))
}

export function pruefeUndErgaenzeVollstaendigkeit(
  gewerk: string,
  positionen: BerechnetePosition[],
  transkript: string,
  meta?: { fensterAnzahl?: number; tuerenAnzahl?: number; raeume?: Array<{ name?: string; hoehe?: number | null }> },
  signale?: ExtraktionSignale,
): CheckErgebnis {
  const lower = transkript.toLowerCase()
  const fehlende: string[] = []
  const ergaenzt: BerechnetePosition[] = [...positionen]

  // Typisierter Auftrags-Vertrag: EINMAL bauen. Etappe 2: mit KI-Signalen
  // (saubere Arbeiten/Belag/Altbelag) als Vorrang, Rohtext-Regex als Fallback.
  const verstaendnis = baueVerstaendnis(transkript, signale)

  if (gewerk === 'maler') {
    pruefeMaler(ergaenzt, fehlende, lower, transkript, positionen, verstaendnis, meta)
  }
  if (gewerk === 'fliesen') {
    pruefeFliesen(ergaenzt, fehlende, lower)
  }
  if (gewerk === 'sanitaer_heizung') {
    pruefeSanitaer(ergaenzt, fehlende, lower)
  }
  if (gewerk === 'trockenbau') {
    pruefeTrockenbau(ergaenzt, fehlende, lower)
  }
  // WICHTIG: normalisiereGewerk liefert 'boden_parkett' (nicht 'boden') — beide abdecken,
  // sonst läuft die Boden-Vollständigkeit im echten Betrieb nie.
  if (gewerk === 'boden' || gewerk === 'boden_parkett') {
    // signale wird durchgereicht, damit die Boden-Prüfung bei mehreren
    // Räumen je Raum ein eigenes Auftrags-Verständnis bauen kann (siehe boden.ts).
    pruefeBoden(ergaenzt, fehlende, lower, verstaendnis, signale)
  }
  if (gewerk === 'elektro') {
    pruefeElektro(ergaenzt, fehlende, lower)
  }

  // DC-027 / CoS-017 (2026-08-24): Kennzeichnung "vom Tool ergaenzt" statt "gesagt".
  // Bewusst EINE zentrale Stelle statt eines Flags an ~117 `ergaenzt.push(...)`-
  // Fundstellen: `positionen` liegt oben unveraendert vor, alles was danach neu in
  // `ergaenzt` steht, kann nur aus den Vollstaendigkeitsregeln stammen.
  // Objekt-Identitaet ist dafuer verlaesslich: die Regeln pushen ausschliesslich
  // NEUE Objekte und kopieren bestehende nie um (filtereArray/dedup behalten
  // Referenzen). Wichtig fuer den Mehrgewerk-Fall, wo diese Funktion zweimal
  // nacheinander laeuft: bereits gesetzte Flags bleiben erhalten, weil die
  // Ergebnisse des ersten Laufs beim zweiten als Originale hereinkommen.
  const originale = new Set<BerechnetePosition>(positionen)
  // PM-023 (Sandy, 2026-08-30: „kein vorschlag! ich habs ja gesagt"): Eine
  // Regel, die auf ein AUSGESPROCHENES Wort reagiert, ergänzt nichts — sie
  // holt nur nach, was der Handwerker verlangt hat. Solche Regeln setzen
  // `automatisch_ergaenzt: false` selbst; das gilt jetzt und wird hier nicht
  // mehr überschrieben. Ohne gesetztes Feld bleibt es beim bisherigen
  // Verhalten (= vom Tool ergänzt).
  const markiert = ergaenzt.map(p =>
    originale.has(p) || p.automatisch_ergaenzt !== undefined ? p : { ...p, automatisch_ergaenzt: true },
  )

  return { fehlende, positionen: markiert }
}
