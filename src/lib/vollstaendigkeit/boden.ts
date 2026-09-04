import type { BerechnetePosition } from '../mengen/types'
import { baueVerstaendnis, type AuftragsVerstaendnis, type ExtraktionSignale } from '../auftrags-verstaendnis'
import { erkenneBelag, hatBodenArbeit } from '../boden-normalisierer'
import { bodenNettoflaecheAusPositionen, pruefeBodenBasis } from './boden-basis'
import { pruefeAltbelag, pruefeFeuchtigkeitssperre, pruefeSockelleisten, pruefeUebergangsprofil } from './boden-vorarbeiten'
import { erkenneSockelleistenAusschluss } from '../sockelleisten-ausschluss'
import { saetzeJeRaum } from '../satz-raum'
import { BODEN_VERLEGEN_SIGNAL } from '../mengen/gewerke/boden'
import { filtereArray, raumNamenAus } from './helpers'
import {
  pruefeDiagonalBoden, pruefeFBHBoden, pruefeParkettSchleifen, pruefeTreppenBoden,
  pruefeFugenVerschweissen, pruefeTrittschalldaemmung, pruefeStosskanten,
  pruefeFischgraet, pruefeVollflaechigeVerklebung,
} from './boden-sonder'

// ── Raumweise Vollständigkeitsprüfung (PM-032 bis PM-036, 03.09.2026) ──────
//
// Bis hierher lief JEDE dieser Prüfungen genau einmal über den kompletten
// Auftrag: ein Transkript, eine Positionsliste, ein Ergebnis. Für einen
// Einzelraum ist das richtig — dafür sind die Regeln geschrieben und getestet.
// Bei mehreren Räumen ist es die Ursache einer ganzen Fehlerfamilie, die im
// Boden-Batch fünfmal in verschiedenen Verkleidungen auftrat:
//
//   * Trittschalldämmung nur im ersten Raum (PM-004, PM-023, PM-032, PM-033)
//   * Sockelleisten unter „Allgemein" mit einem Umfang aus zwei Räumen (PM-033)
//   * Grundierung im Esszimmer fehlt, weil der Untergrund-Block einmal global
//     lief und die Fläche aus dem falschen Zimmer genommen hätte (PM-034)
//   * „fehlende"-Meldungen ohne Raumbezug, deshalb nur einmal statt je Raum
//
// Die Trittschall-Dämmung wurde deswegen DREIMAL repariert — jedes Mal für
// einen Raum, jedes Mal kam sie beim nächsten Mehrraum-Fall zurück. Deshalb
// jetzt nicht die sechste Einzelreparatur, sondern der Schnitt darunter:
//
//   Bei mehreren Räumen wird jeder Raum als eigene, kleine Welt geprüft —
//   seine Sätze aus dem Diktat, seine Positionen, sein Auftrags-Verständnis.
//
// Die Regeln selbst bleiben dabei UNVERÄNDERT. Sie waren nie falsch; sie haben
// nur eine Mehrraum-Welt vorgesetzt bekommen, für die sie nicht geschrieben
// sind. Genau deshalb ist dieser Umbau ein Dispatcher und keine Neufassung von
// dreizehn Prüffunktionen — jede einzelne behält ihr Verhalten und ihre Tests.
//
// Nicht raumweise laufen die Prüfungen, die von Natur aus ZWISCHEN Räumen
// stattfinden: die Übergangsschiene (sie sitzt an der Grenze zweier Räume) und
// der Sockelleisten-Ausschluss (er kann für den ganzen Auftrag gelten). Beide
// laufen weiterhin einmal über alles, bewusst und benannt.

function raumVon(position: BerechnetePosition): string | null {
  return position.beschreibung?.match(/\s+[-–—]\s+(.+)$/)?.[1]?.trim() ?? null
}

/**
 * Alle raumbezogenen Regeln. Bekommt eine Welt vorgesetzt (Positionen + Text)
 * und darf annehmen, dass sie EINEN Raum beschreibt.
 */
function pruefeBodenRegeln(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  v: AuftragsVerstaendnis,
): void {
  // Reiner Abschleif-/Refinish-Auftrag: Parkett wird geschliffen, aber KEIN neuer
  // Boden gelegt (kein Verlegen). Dann keine Untergrundvorbereitung/Ausgleich und
  // keine Sockelleisten-Montage — die alten bleiben dran.
  const istRefinish = ergaenzt.some(p => /parkett\s*schleifen|dielen\s*schleifen|holzboden\s*schleifen/i.test(p.beschreibung))
    && !ergaenzt.some(p => /verlegen|verkleben/i.test(p.beschreibung))

  const { nurOhneSockel } = pruefeBodenBasis(ergaenzt, fehlende, lower, v.belag, v)
  pruefeAltbelag(ergaenzt, fehlende, lower, v)
  pruefeFeuchtigkeitssperre(ergaenzt, fehlende, lower)
  pruefeFischgraet(ergaenzt, fehlende, lower, v)
  pruefeVollflaechigeVerklebung(ergaenzt, fehlende, lower)
  // Bei Refinish nur Sockelleisten, wenn explizit genannt
  if (!istRefinish || lower.includes('sockelleiste')) {
    pruefeSockelleisten(ergaenzt, fehlende, lower, nurOhneSockel)
  }
  pruefeDiagonalBoden(ergaenzt, fehlende, lower)
  pruefeParkettSchleifen(ergaenzt, fehlende, lower, v)
  pruefeFugenVerschweissen(ergaenzt, fehlende, lower)
  pruefeStosskanten(ergaenzt, fehlende, lower)
}

/**
 * Hat DIESER Raum überhaupt einen Bodenauftrag?
 *
 * PM-013, aus einer neuen Richtung: Der Flur eines Maler-Auftrags („nur Wände
 * und Decke streichen, da wird nix am Boden gemacht") hat Positionen wie
 * „Boden schützen" und „Sockelleisten abkleben" — beides Maler-Nebenleistung.
 * In der alten, globalen Prüfung war er dadurch geschützt, dass die
 * Verlege-Position des NACHBARZIMMERS die Regel früh aussteigen ließ. Dieser
 * Schutz aus Versehen fällt mit der Raumtrennung weg: Ohne eigene Prüfung
 * bekäme der Flur jetzt eine erfundene „Bodenbelag verlegen 9 m²". Deshalb
 * dasselbe Signal, das auch die Mengen-Engine für `hatEchtenBelagAuftrag`
 * verlangt — importiert, nicht nachgebaut.
 */
function hatBodenAuftragImRaum(
  eigene: BerechnetePosition[],
  v: AuftragsVerstaendnis,
  raumArbeiten: string[],
): boolean {
  if (v.belag != null || v.altbelagEntfernen) return true
  if (raumArbeiten.some(a => BODEN_VERLEGEN_SIGNAL.test(a))) return true
  return eigene.some(p => /verlegen|verkleben|altbelag|bodenbelag|parkett|laminat|v[ie]nyl|teppich|linoleum|kork|estrich|trittschall|sockelleisten montieren|ausgleich/i.test(p.beschreibung))
}

/**
 * Auftrags-Verständnis für EINEN Raum. Die globalen KI-Signale sind bewusst
 * nur teilweise übernommen: `belagText` und `altbelagEntfernen` sind im
 * globalen Signal über alle Räume zusammengefasst („irgendein Raum hat einen
 * Belag") — genau die Werte, die zwischen Räumen bluten. Sie werden hier aus
 * dem Text und der arbeiten[]-Liste DIESES Raums neu bestimmt; nur wenn dort
 * nichts steht, gilt weiterhin der globale Wert als Rückfall.
 */
function verstaendnisFuerRaum(
  raumText: string,
  name: string,
  signale: ExtraktionSignale | undefined,
): { v: AuftragsVerstaendnis; raumArbeiten: string[] } {
  const key = name.toLocaleLowerCase('de-DE')
  const raum = (signale?.raeume ?? []).find(r => (r.name ?? '').trim().toLocaleLowerCase('de-DE') === key)
  const raumArbeiten = raum?.arbeiten ?? []
  if (!signale) return { v: baueVerstaendnis(raumText), raumArbeiten }

  const eigenerBelag = erkenneBelag(raumText)
  const eigenerAltbelag = hatBodenArbeit(raumText, 'altbelag_entfernen')
    || hatBodenArbeit(raumArbeiten.join('. '), 'altbelag_entfernen')

  return {
    v: baueVerstaendnis(raumText, {
      ...signale,
      arbeitenTexte: raumArbeiten,
      raeume: raum ? [raum] : [],
      // KEIN Rückfall auf den globalen `belagText`. Er ist über alle Räume
    // zusammengefasst („irgendein Raum hat Eichenparkett") — genau der Wert,
    // der einen Maler-Flur zu einem Boden-Raum machen würde. Nennt der Raum
    // seinen Belag nicht selbst, hat er hier eben keinen; die Verlegemenge
    // kommt ohnehin aus der Engine und nicht von hier.
    belagText: eigenerBelag ? raumText : null,
      altbelagEntfernen: eigenerAltbelag,
    }),
    raumArbeiten,
  }
}

function pruefeBodenJeRaum(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  raumNamen: string[],
  signale: ExtraktionSignale | undefined,
): void {
  const zuordnung = saetzeJeRaum(lower, raumNamen)
  const neu: BerechnetePosition[] = []
  const entfernt = new Set<BerechnetePosition>()

  for (const name of raumNamen) {
    const saetze = zuordnung.get(name) ?? []
    // Kein eigener Abschnitt im Diktat: Dann wäre der einzige verfügbare Text
    // der Gesamttext — und genau das ist das Bluten, das hier abgestellt wird.
    // Lieber nichts ergänzen als etwas aus dem Nachbarzimmer.
    if (saetze.length === 0) continue

    const raumText = saetze.join('. ')
    const eigene = ergaenzt.filter(p => raumVon(p) === name)
    const { v: vRaum, raumArbeiten } = verstaendnisFuerRaum(raumText, name, signale)

    // Räume ohne eigenen Bodenauftrag bleiben unangetastet (siehe oben).
    if (!hatBodenAuftragImRaum(eigene, vRaum, raumArbeiten)) continue

    const arbeitsliste = [...eigene]
    const raumFehlende: string[] = []

    pruefeBodenRegeln(arbeitsliste, raumFehlende, raumText, vRaum)

    for (const position of arbeitsliste) {
      if (eigene.includes(position)) continue
      // Neu erzeugte Positionen tragen den Raum, in dem sie entstanden sind.
      // Vorher landeten sie ohne Suffix unter „Allgemein" — daher die
      // 22-lfdm-Sockelleiste aus PM-033.
      neu.push(raumVon(position) ? position : { ...position, beschreibung: `${position.beschreibung} — ${name}` })
    }
    for (const position of eigene) {
      if (!arbeitsliste.includes(position)) entfernt.add(position)
    }
    // Auch offene Punkte ohne sichere Menge bekommen jetzt ihren Raum — sie
    // werden weiter oben (mehrgewerk.ts) zu sichtbaren 0-Positionen, und die
    // erschienen bisher nur EINMAL für den ganzen Auftrag.
    for (const eintrag of raumFehlende) {
      fehlende.push(/\s+[-–—]\s+/.test(eintrag) ? eintrag : `${eintrag} — ${name}`)
    }
  }

  if (entfernt.size > 0) filtereArray(ergaenzt, p => !entfernt.has(p))
  for (const position of neu) ergaenzt.push(position)
}

export function pruefeBoden(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  v: AuftragsVerstaendnis,
  signale?: ExtraktionSignale,
): void {
  // Belag kann null sein (Whisper verstümmelt "Klick-Vinyl" → "Glykvenyl"). Statt am
  // Belag-Wort zu hängen: Ist es überhaupt ein Boden-Auftrag? Erkennbar an Belag,
  // Altbelag-Demontage oder einer bereits erzeugten Verlegen-/Boden-Position.
  const istBodenAuftrag = v.belag != null || v.altbelagEntfernen
    || ergaenzt.some(p => /verlegen|bodenbelag|parkett|laminat|v[ie]nyl|teppich|estrich/i.test(p.beschreibung))
  if (!istBodenAuftrag) return

  const raumNamen = raumNamenAus(ergaenzt)
  if (raumNamen.length > 1) {
    pruefeBodenJeRaum(ergaenzt, fehlende, lower, raumNamen, signale)
  } else {
    // Ein Raum (oder gar keine Raumzuordnung): unverändert der bisherige Weg.
    pruefeBodenRegeln(ergaenzt, fehlende, lower, v)
  }

  // ── Ab hier raumÜBERGREIFEND, und das ist Absicht ────────────────────────

  // Die Übergangsschiene sitzt zwischen zwei Räumen. Sie je Raum zu prüfen
  // hieße, sie an jeder Zimmertür zu erfinden — genau die Falle, auf die
  // PM-032 gebaut war.
  pruefeUebergangsprofil(ergaenzt, fehlende, lower)

  // Trittschalldämmung ist bewusst NICHT raumweise: Die Ansage fällt einmal
  // für den ganzen Auftrag („überall dasselbe Klick-Vinyl … Trittschalldämmung
  // drunter") und muss sich dann auf alle Räume verteilen. Genau dafür wurde
  // die Funktion nach PM-032/033 umgebaut — sie läuft über ALLE
  // Verlegepositionen und erkennt einen genannten Raum satzweise selbst.
  // Würde man sie hier je Raum aufrufen, landete die eine Ansage wieder in
  // genau einem Raum — der Fehler, der dreimal repariert wurde.
  pruefeTrittschalldaemmung(ergaenzt, fehlende, lower)

  // Fußbodenheizung und Treppe sind Gegenstände des Auftrags, nicht eines
  // Raums: beide erzeugen höchstens einen Eintrag für das ganze Angebot.
  pruefeFBHBoden(ergaenzt, fehlende, lower)
  pruefeTreppenBoden(ergaenzt, fehlende, lower, v)

  // PM-033, Befund 2 — Sicherheitsnetz. „Sockelleisten bleiben überall, wie
  // sie sind" gilt für den ganzen Auftrag, kann aber auch nur einen Raum
  // betreffen („Sockelleisten im Flur neu. Im Wohnzimmer bleiben sie.").
  // Bewusst hier am Ende, nachdem alle Ergänzungsregeln gelaufen sind — ein
  // Ausschluss, der irgendwo in der Mitte steht, wird von der nächsten Regel
  // wieder überholt (dieselbe Lehre wie bei der zu spät laufenden
  // Maßkorrektur in PM-034).
  const sockelAusschluss = erkenneSockelleistenAusschluss(lower, raumNamenAus(ergaenzt))
  if (sockelAusschluss.global || sockelAusschluss.raeume.size > 0) {
    filtereArray(ergaenzt, p => {
      if (!/sockelleisten (?:montieren|entfernen)/i.test(p.beschreibung)) return true
      if (sockelAusschluss.global) return false
      const raum = raumVon(p)
      return !(raum && sockelAusschluss.raeume.has(raum))
    })
  }

  // Abschließende, deterministische Zuordnung: Bei ausdrücklich vollflächig
  // verklebtem Fertigparkett muss immer der exakte Katalogtitel verwendet werden.
  // Diese Normalisierung steht bewusst nach allen Ergänzungsregeln.
  if (/fertigparkett/i.test(lower) && /vollfl.chig.{0,30}verkleb|verkleb.{0,30}vollfl.chig/i.test(lower)) {
    const parkettPosition = ergaenzt.find(position =>
      /fertigparkett|parkett\s+verlegen/i.test(position.beschreibung) &&
      !/aufpreis|fischgr.t|sockel|entfern/i.test(position.beschreibung),
    )
    if (parkettPosition) {
      parkettPosition.beschreibung = 'Fertigparkett verlegen vollflächig verklebt'
      parkettPosition.berechnungsweg = `${bodenNettoflaecheAusPositionen([parkettPosition]) ?? parkettPosition.menge} m² vollflächig verklebt`
    }
  }
}
