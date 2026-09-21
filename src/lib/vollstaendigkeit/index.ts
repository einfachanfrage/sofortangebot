import type { BerechnetePosition } from '../mengen/types'
import { baueVerstaendnis, type ExtraktionSignale } from '../auftrags-verstaendnis'
import { filtereErschwernis, type ErschwernisConfig } from '../erschwernis'
import { entferneAusgeschlosseneBauteileMitHinweisen } from '../bauteil-ausschluss'
import { wendeFliesenrichtungAn } from '../fliesen-richtung'
import {
  entferneZeitlichAusgenommene,
  zeitAusschlussHinweis,
  zeitlichAusgenommeneRaeume,
} from '../zeit-ausschluss'
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
  meta?: {
    fensterAnzahl?: number
    tuerenAnzahl?: number
    /** CoS-E-058: Türen aus der Aufnahme (raeume[].tueren), Annahmen zählen nicht. */
    tuerenAusAufnahme?: number
    /** CoS-E-058: Fenster aus der Aufnahme (raeume[].fenster), Annahmen zählen nicht. */
    fensterAusAufnahme?: number
    raeume?: Array<{ name?: string; hoehe?: number | null }>
    /** Welche Erschwerniszuschläge der Betrieb überhaupt will (CoS-E-040). */
    erschwernis?: ErschwernisConfig | null
  },
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

  // CoS-E-040 / TN-097: Erschwerniszuschläge, die der Betrieb abgeschaltet
  // hat, fallen hier raus — an EINER Stelle, aus demselben Grund wie die
  // Markierung darüber: Die Zuschäge entstehen an fünf Orten in drei
  // Dateien, und der nächste entsteht an einem sechsten. Eine Abfrage an
  // jedem `push(...)` vergisst man; eine Filterung am Ausgang nicht.
  //
  // Ohne Einstellung (NULL) ändert sich nichts — ein Update darf niemandem
  // still einen Zuschlag wegnehmen, den er bisher bekommen hat.
  const nachErschwernis = filtereErschwernis(markiert, meta?.erschwernis)

  // PM-099 / CoS-E-071: die zweite Bremse. Ein Ausschlusssatz im Diktat
  // („An den Wänden machen wir nichts") entfernt die zugehörigen Positionen
  // HIER — nach der Mengenberechnung, unabhängig davon, was die KI in
  // `raeume[].arbeiten` geschrieben hat. Aus demselben Grund am Ausgang wie
  // die beiden Filter darüber: Die Wandpositionen entstehen an vier Stellen
  // in drei Dateien, und die nächste entsteht an einer fünften.
  const raumNamen = (meta?.raeume ?? []).map(r => r?.name ?? '').filter(Boolean)
  //
  // PD-024 / DC-135: Die Bremse war stumm. Sie nimmt die Zeile richtig
  // heraus, sagt es aber niemandem — in PM-134 fallen so 356,25 € weg, ohne
  // dass ein Zeichen davon übrig bleibt. Ab jetzt reicht sie die Sätze mit,
  // auf die sie sich stützt, und zwar NUR für Ausschlüsse, die wirklich eine
  // Zeile gekostet haben. Weg und Form sind dieselben wie beim
  // Zeit-Ausschluss darunter (DC-128): fehlende → warnungen → das
  // bernsteinfarbene Banner auf der Entwurfsseite.
  const bauteilErgebnis = entferneAusgeschlosseneBauteileMitHinweisen(
    nachErschwernis, transkript, raumNamen,
  )
  const nachBauteil = bauteilErgebnis.positionen
  for (const zeile of bauteilErgebnis.hinweise) {
    if (!fehlende.includes(zeile)) fehlende.push(zeile)
  }

  // CoS-E-074 / DC-116 / PM-116 + PM-097: die dritte Bremse, eine Ebene über
  // der zweiten. `entferneAusgeschlosseneBauteile` nimmt EIN Bauteil aus
  // einem Raum; hier fällt ein ganzer Raum, weil der Handwerker ihn auf ein
  // späteres, eigenes Angebot geschoben hat („das kommt später und wird
  // extra angeboten").
  //
  // BEIDE Hälften, nie nur eine (DC-116, wörtlich): Der Raum wird nicht
  // gerechnet UND das Weglassen wird gezeigt. Weglassen ohne Hinweis wäre
  // der schlimmere der beiden Fehler — dann fehlen in PM-116 305,40 € Arbeit
  // und niemand erfährt es.
  //
  // Am Ausgang, aus demselben Grund wie die drei Filter darüber: Positionen
  // mit Raum-Suffix entstehen in jeder Gewerke-Engine und in den
  // Vollständigkeitsregeln. Eine Abfrage an jeder Entstehungsstelle vergisst
  // man; eine Filterung am Ausgang nicht.
  const zeitlichRaus = zeitlichAusgenommeneRaeume(transkript, raumNamen)
  for (const [raum, satz] of zeitlichRaus) {
    const zeile = zeitAusschlussHinweis(raum, satz)
    if (!fehlende.includes(zeile)) fehlende.push(zeile)
  }

  const nachZeit = entferneZeitlichAusgenommene(nachBauteil, zeitlichRaus, raumNamen)

  // PM-061-A / PM-062-A (Auflage PM-123): die vierte Bremse, und nur für
  // Fliesen. „Im Bad nur die Wandfliesen runter" — die Engine schreibt die
  // Bodenzeilen trotzdem, weil sie das Diktat nicht liest. 324,50 € auf einer
  // Arbeit, die der Kunde ausdrücklich ausgenommen hat.
  //
  // Am Ausgang aus demselben Grund wie die drei Bremsen darüber: Bodenzeilen
  // entstehen in `fliesenEngine` UND in den Vollständigkeitsregeln.
  //
  // Sie räumt NUR weg, wo die Einschränkung wirklich im Satz steht — das Bad
  // ohne „nur" behält alle seine Bodenzeilen (Auflage Punkt 4). Und sie
  // bestätigt im selben Zug den Titel der Abbruchzeile, wo die Richtung
  // feststeht (PM-062-B). Kein Fehlt-Eintrag: ausgenommen ist nicht
  // vergessen (Auflage Punkt 3).
  const nachRichtung = gewerk === 'fliesen'
    ? wendeFliesenrichtungAn(nachZeit, transkript, raumNamen).positionen
    : nachZeit

  return {
    fehlende,
    positionen: nachRichtung,
  }
}
