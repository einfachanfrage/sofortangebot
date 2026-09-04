// Mehr-Gewerk-Verarbeitung: Maler UND Boden im selben Auftrag.
//
// Die KI liefert genau EIN Haupt-Gewerk. Steckt in den Räumen aber auch das
// andere Gewerk (z.B. "Wände streichen" + "Vinyl verlegen" im selben Flur),
// lief bisher nur eine Engine — das zweite Gewerk fiel raus, obwohl erkannt.
// Hier: primäres + (falls vorhanden) sekundäres Gewerk berechnen und mergen.

import type { BerechnetePosition, MengenErgebnis } from './types'
import { berechneMengen } from './engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import type { ExtraktionSignale } from '../auftrags-verstaendnis'
import { erkenneBelag, hatBodenArbeit } from '../boden-normalisierer'
import { BODEN_VERLEGEN_SIGNAL } from './gewerke/boden'

type RaumLike = { arbeiten?: string[]; belag?: string | null; altbelag_entfernen?: boolean; sockelleisten?: boolean }

// ── PM-034, Befund 4 (Prüfmeister, 02.09.2026) ───────────────────────────
//
// In einem reinen Bodenauftrag standen drei Maler-Positionen („Wände
// spachteln Q2", „Wände schleifen nach Q2", „Spachtelarbeiten Q2"), alle mit
// 0 Stück und „Preis fehlt in deiner Preisdatenbank" — was den Handwerker
// dazu verleitet, Preise für eine Leistung anzulegen, die er nie anbieten
// wollte. Auslöser: Die Küche trägt in ihrer arbeiten[]-Liste „boden
// spachteln", das Esszimmer „grundierung". Beide trafen das alte
// MALER_ARBEIT-Muster, also lief die komplette Maler-Vollständigkeitsprüfung
// über einen Auftrag, in dem nie von Wänden die Rede war.
//
// Es ist dieselbe Familie wie PM-033/Befund 2: ein Wort gewinnt gegen den
// Satz, in dem es steht — „Boden" direkt daneben wird nicht gelesen.
//
// Gegen die echten Produktionsdaten geprüft (alle gespeicherten
// Extraktionen): Von sechs Einträgen, die das alte Muster treffen, nennen
// vier ihr Objekt selbst („wände grundieren", „wände spachteln q3", „decke
// spachteln q3", „decke grundieren") — die bleiben unverändert Maler. Einer
// nennt ausdrücklich den Boden („boden spachteln"), einer nennt gar nichts
// („grundierung"). Genau diese beiden werden jetzt anders behandelt.
//
// Die Richtung ist bewusst asymmetrisch: Eine fälschlich WEGGELASSENE
// Maler-Position kostet den Betrieb Geld und fällt niemandem auf. Deshalb
// bleibt jedes eindeutige Maler-Wort ohne jede Bedingung stehen; nur die
// mehrdeutigen Wörter brauchen ein Objekt.

/** Eindeutig Maler, egal woran — braucht kein Objekt im Satz. */
const MALER_EINDEUTIG = /streich|anstrich|tapete|tapezier|raufaser|lackier|voranstrich/i
/** Mehrdeutig: gibt es genauso am Boden (Estrich spachteln, Estrich grundieren). */
const MALER_MEHRDEUTIG = /spachtel|glätt|grundier/i
/** Objekte, die die mehrdeutigen Wörter eindeutig zum Maler machen. */
const MALER_OBJEKT = /w[äa]nd|waende|decke|tapete|leibung|zarge|heizk[öo]rper|fassade|t[üu]rblatt/i
/** Objekte, die sie eindeutig zum Boden machen. */
const BODEN_OBJEKT = /\bboden|fu(?:ß|ss)boden|estrich|untergrund/i

const BODEN_ARBEIT = /verleg|vinyl|laminat|parkett|dielen|kork|linoleum|teppich|nadelvlies|bodenbelag|altbelag|trittschall|estrich/i
// Im Rohtext: distinktive Boden-Signale (NICHT bloßes "boden" — "Boden schützen" ist Maler)
const BODEN_TEXT = /vinyl|laminat|parkett|diele|kork|linoleum|nadelvlies|designboden|teppich|bodenbelag|\bverleg|trittschall/i

/**
 * Ist dieser einzelne arbeiten[]-Eintrag Malerarbeit?
 * `raumHatEindeutigMaler` entscheidet den Fall ohne Objekt („grundierung"):
 * dann folgt der Eintrag dem Raum, in dem er steht.
 */
export function istMalerArbeit(arbeit: string, raumHatEindeutigMaler: boolean): boolean {
  if (MALER_EINDEUTIG.test(arbeit)) return true
  if (!MALER_MEHRDEUTIG.test(arbeit)) return false
  if (BODEN_OBJEKT.test(arbeit)) return false
  if (MALER_OBJEKT.test(arbeit)) return true
  return raumHatEindeutigMaler
}

/**
 * Maler-Signal im Rohtext (Fallback, wenn die KI die Malerarbeiten gar nicht
 * in die Struktur gelegt hat). Mehrdeutige Wörter zählen nur, wenn im selben
 * SATZ ein Maler-Objekt steht und kein Boden-Objekt — „danach muss der Boden
 * gespachtelt werden" ist keine Malerarbeit.
 */
export function malerImRohtext(text: string): boolean {
  if (MALER_EINDEUTIG.test(text)) return true
  return text
    .split(/[.!?;\n]+/)
    .some(satz =>
      MALER_MEHRDEUTIG.test(satz) && MALER_OBJEKT.test(satz) && !BODEN_OBJEKT.test(satz),
    )
}

function raeumeAllerArt(extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }): RaumLike[] {
  return [...(extraktion.raeume ?? []), ...(extraktion.bereiche ?? [])]
}

/** Boden-Anteil — aus der Struktur ODER dem Rohtext (KI packt Boden oft nicht in die Struktur).
 *  PM-010: `sockelleisten` zählt bewusst mit dazu — reine Sockelleisten-Arbeiten
 *  (montieren/streichen, ohne neuen Belag) laufen technisch über die Boden-Engine
 *  (sockelleisten.ts), auch wenn kein Belag gewechselt wird. Die Engine selbst
 *  entscheidet dann separat (siehe boden.ts hatEchtenBodenAuftrag), ob sie
 *  zusätzlich "X verlegen" anlegt — das hier ist nur die Aktivierung. */
function hatBodenAnteil(extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }, transkript: string): boolean {
  const inStruktur = raeumeAllerArt(extraktion).some(r =>
    r.belag != null || r.altbelag_entfernen === true || r.sockelleisten === true ||
    (r.arbeiten ?? []).some(a => BODEN_ARBEIT.test(a)))
  return inStruktur || BODEN_TEXT.test(transkript)
}

function hatMalerAnteil(extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }, transkript: string): boolean {
  const inStruktur = raeumeAllerArt(extraktion).some(raum => {
    const arbeiten = raum.arbeiten ?? []
    // Der Raum entscheidet den Fall ohne Objekt: Steht in DIESEM Raum sonst
    // eindeutige Malerarbeit, ist auch das bloße „grundierung" darin Maler.
    const raumHatEindeutigMaler = arbeiten.some(a => MALER_EINDEUTIG.test(a))
    return arbeiten.some(a => istMalerArbeit(a, raumHatEindeutigMaler))
  })
  return inStruktur || malerImRohtext(transkript)
}

/**
 * Zweites Gewerk, das zusätzlich zum primären berechnet werden soll — oder null.
 * Erkennt auch am Rohtext (nicht nur an der Struktur), weil die KI bei
 * gewerk=maler die Boden-Arbeiten oft gar nicht in raeume[] ablegt.
 */
export function sekundaerGewerk(primaer: string, extraktion: { raeume?: RaumLike[]; bereiche?: RaumLike[] }, transkript = ''): string | null {
  if (primaer === 'maler' && hatBodenAnteil(extraktion, transkript)) return 'boden_parkett'
  if (primaer === 'boden_parkett' && hatMalerAnteil(extraktion, transkript)) return 'maler'
  return null
}

/**
 * Grobe, rein textbasierte Haupt-Gewerk-Erkennung — für Stellen OHNE
 * strukturierte raeume[]/bereiche[]-Extraktion (z.B. die schnelle Chip-
 * Vorschau direkt nach der Aufnahme, siehe chips-vervollstaendigung.ts).
 * Dieselben Signalwörter wie hatBodenAnteil/hatMalerAnteil oben, nur ohne
 * Struktur-Anteil — bewusst konservativ (nur maler/boden_parkett, die beiden
 * aktuell unterstützten Gewerke), gibt sonst null zurück.
 */
export function erkenneHauptgewerkAusText(transkript: string): 'maler' | 'boden_parkett' | null {
  if (malerImRohtext(transkript)) return 'maler'
  if (BODEN_TEXT.test(transkript)) return 'boden_parkett'
  return null
}

/** Reichert die Räume mit Boden-Infos aus dem Rohtext an (Belag/Altbelag), damit
 *  die Boden-Engine "Vinyl verlegen" statt "Bodenbelag verlegen" liefert. */
function reichereBodenAn<E extends { raeume?: RaumLike[]; bereiche?: RaumLike[] }>(extraktion: E, transkript: string): E {
  const belag = erkenneBelag(transkript)
  const altbelag = hatBodenArbeit(transkript, 'altbelag_entfernen')
  const raeumeGesamt = (extraktion.raeume ?? []).length + (extraktion.bereiche ?? []).length

  // PM-013, Nachtest 3 (2026-08-21): bei GENAU EINEM Raum ist der aus dem
  // GANZEN Transkript erkannte Belag per Definition der Belag DIESES Raums —
  // die bisherige, ungefilterte Anreicherung ist dafür gebaut und bleibt hier
  // für den Single-Raum-Fall unverändert. Ab ZWEI Räumen gilt das nicht mehr:
  // echter Prod-Fall (Wohnzimmer "Eichenparkett, Fischgrät verlegt", Flur
  // daneben "nur Wände und Decke streichen ... da wird nix am Boden gemacht,
  // der bleibt wie er ist") — der global erkannte Belag ("parkett") wurde
  // bisher trotzdem auch dem Flur übergestülpt, weil der Flur selbst keinen
  // eigenen belag-Wert hatte. Ergebnis: eine echte, bepreiste "Fertigparkett
  // verlegen — Flur"-Position (9 m², exakt die Flur-Bodenfläche) trotz
  // ausdrücklichem Ausschluss. Ab zwei Räumen zusätzlich verlangen, dass der
  // Raum SELBST ein echtes Verlege-Signal in seiner eigenen arbeiten[]-Liste
  // hat (dasselbe BODEN_VERLEGEN_SIGNAL, das boden.ts direkt danach für
  // hatEchtenBelagAuftrag prüft) — sonst bleibt der Raum unangetastet.
  const anreichern = (r: RaumLike): RaumLike => {
    const darfAnreichern = raeumeGesamt <= 1 || (r.arbeiten ?? []).some(a => BODEN_VERLEGEN_SIGNAL.test(a))
    return {
      ...r,
      belag: r.belag ?? (darfAnreichern ? belag : undefined) ?? undefined,
      altbelag_entfernen: r.altbelag_entfernen ?? (darfAnreichern ? altbelag : false),
    }
  }
  return {
    ...extraktion,
    raeume: (extraktion.raeume ?? []).map(anreichern),
    bereiche: (extraktion.bereiche ?? []).map(anreichern),
  }
}

interface Meta { fensterAnzahl?: number; tuerenAnzahl?: number; raeume?: Array<{ name?: string; hoehe?: number | null }> }

/**
 * Berechnet Mengen + Vollständigkeit über ALLE beteiligten Gewerke und merged.
 * Primär-Gewerk zuerst, dann ggf. das sekundäre; Duplikate (gleicher Titel +
 * gleiche Menge) werden entfernt.
 */
export function berechneUndPruefeAlleGewerke(
  extraktion: { gewerk: string; raeume?: RaumLike[]; bereiche?: RaumLike[]; transkript?: string },
  textMitZahlen: string,
  meta: Meta,
  signale: ExtraktionSignale,
): { positionen: BerechnetePosition[]; fehlende: string[]; mengenRoh: MengenErgebnis } {
  const primaer = extraktion.gewerk
  const sekundaer = sekundaerGewerk(primaer, extraktion, textMitZahlen)

  // 1) Engines (Mengen)
  const mengenPrimaer = berechneMengen(primaer, extraktion)
  let rohPositionen = mengenPrimaer.positionen
  if (sekundaer) {
    // Für die Boden-Engine die Räume mit Belag/Altbelag aus dem Text anreichern
    const sekExtraktion = sekundaer === 'boden_parkett'
      ? reichereBodenAn({ ...extraktion, gewerk: sekundaer }, textMitZahlen)
      : { ...extraktion, gewerk: sekundaer }
    const mengenSek = berechneMengen(sekundaer, sekExtraktion)
    rohPositionen = mergePositionen(rohPositionen, mengenSek.positionen)
  }

  // 2) Vollständigkeit je Gewerk (nacheinander auf den gemergten Positionen)
  const fehlende: string[] = []
  let positionen = rohPositionen
  for (const g of sekundaer ? [primaer, sekundaer] : [primaer]) {
    const res = pruefeUndErgaenzeVollstaendigkeit(g, positionen, textMitZahlen, meta, signale)
    positionen = res.positionen
    fehlende.push(...res.fehlende)
  }

  // 3) "Boden schützen" (Maler) ist überflüssig, wenn im selben Raum ein neuer
  //    Boden verlegt wird — man schützt keinen Boden, den man ersetzt.
  positionen = entferneRedundantenBodenschutz(positionen)
  positionen = entferneRedundantesSockelAbkleben(positionen)

  // 4) Finaler Exakt-Dedup: identische Position (gleicher Titel + gleiche Menge)
  //    kann nie doppelt gewollt sein (verschiedene Räume tragen ihr "— Raum"-Suffix)
  positionen = dedupExakt(positionen)

  // 5) PM-010/PM-012/PM-013 (2026-08-19): `fehlende` wurde bisher nirgends
  // gelesen — angebot-extrahieren/route.ts destrukturierte nur `positionen`
  // und `mengenRoh` aus dieser Funktion, `fehlende` fiel komplett unter den
  // Tisch. Jede hier erkannte, aber ohne sichere Menge dastehende Leistung
  // ("Sockelleisten entfernen", "Sockelleisten streichen", "Dehnungsfuge
  // einbauen", ...) erreichte den Nutzer dadurch NIE — weder als Position
  // noch als Rückfrage, einfach stillschweigend nichts. Betrifft strukturell
  // ~130 Fundstellen in src/lib/vollstaendigkeit/*, die alle über `fehlende`
  // denselben unsichtbaren Ausgang nehmen.
  //
  // Statt jeden einzelnen Fall mit einer eigenen Mengen-Heuristik nachzuziehen
  // (fragil — siehe PM-012: die "Menge von Sockelleisten abkleben übernehmen"-
  // Heuristik war im Golden-Test grün, hat aber live nicht gegriffen, weil der
  // reale Satzbau den Happy-Path nicht getroffen hat und der Fallback in
  // `fehlende` landete): zentral hier jede noch offene `fehlende`-Meldung in
  // eine echte, sichtbare Position mit Menge 0 verwandeln. Der Handwerker
  // sieht sie garantiert (Karte UND fertiger Entwurf, exakt wie eine Position
  // ohne Katalogpreis — 0,00 € statt komplett fehlend) und trägt die reale
  // Menge selbst ein, statt dass die Leistung spurlos verschwindet. Blockiert
  // nichts (Systemischer Fund Punkt 2 in pruefmeister-testfaelle.md).
  //
  // Bekannte Einschränkung: `fehlende`-Einträge tragen (anders als die meisten
  // erfolgreich berechneten Positionen) noch kein "— Raum"-Suffix, weil die
  // Vollständigkeitsprüfung gewerkweise über alle gemergten Räume läuft, nicht
  // pro Raum. Bei Mehrraum-Aufträgen mit mehreren gleichnamigen offenen Punkten
  // erscheint die Platzhalter-Position darum nur einmal, nicht pro Raum — das
  // ist immer noch strikt besser als das bisherige komplette Verschwinden,
  // aber kein Ersatz für eine spätere, pro Raum aufgelöste Lösung.
  const bekannteBeschreibungen = new Set(positionen.map(p => p.beschreibung.toLowerCase().trim()))
  for (const beschreibung of [...new Set(fehlende)]) {
    if (bekannteBeschreibungen.has(beschreibung.toLowerCase().trim())) continue
    positionen.push({
      beschreibung,
      menge: 0,
      einheit: 'Stück',
      konfidenz: 'low',
      berechnungsweg: 'Erkannt, aber Menge nicht sicher berechenbar — bitte manuell ergänzen',
      annahmen: [],
      // DC-027/CoS-017: stammt wie alle anderen Ergaenzungen aus den
      // Vollstaendigkeitsregeln, nicht aus dem gesprochenen Text.
      automatisch_ergaenzt: true,
    })
  }

  return { positionen, fehlende, mengenRoh: { ...mengenPrimaer, positionen: rohPositionen } }
}

/** Entfernt exakte Duplikate (gleicher Titel + gleiche Menge), erste Position bleibt. */
function dedupExakt(positionen: BerechnetePosition[]): BerechnetePosition[] {
  const seen = new Set<string>()
  return positionen.filter(p => {
    const key = `${p.beschreibung.toLowerCase().trim()}|${p.menge}|${p.einheit}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const BODENSCHUTZ_POSITION = /boden\s*(?:schütz|schuetz)|boden[^—–]*(?:abdeck|schutz)/i
const BODEN_VERLEGEN_POSITION = /\bverleg(?:en|ung)\b/i

function raumSuffix(beschreibung: string): string | null {
  const match = beschreibung.match(/\s[—–]\s*(.+)$/)
  return match?.[1]?.trim().toLocaleLowerCase('de-DE') || null
}

/**
 * Entfernt Bodenschutz nur bei eindeutig gleicher Raumzuordnung. Eine
 * pauschale Schutzposition ohne Raum-Suffix bleibt bestehen, weil sie sich auf
 * andere Flächen oder Laufwege beziehen kann.
 */
export function entferneRedundantenBodenschutz(positionen: BerechnetePosition[]): BerechnetePosition[] {
  const raeumeMitNeuemBoden = new Set(
    positionen
      .filter(p => BODEN_VERLEGEN_POSITION.test(p.beschreibung))
      .map(p => raumSuffix(p.beschreibung))
      .filter((raum): raum is string => raum !== null)
  )

  if (raeumeMitNeuemBoden.size === 0) return positionen

  return positionen.filter(position => {
    if (!BODENSCHUTZ_POSITION.test(position.beschreibung)) return true
    const raum = raumSuffix(position.beschreibung)
    return !raum || !raeumeMitNeuemBoden.has(raum)
  })
}

export function entferneRedundantesSockelAbkleben(positionen: BerechnetePosition[]): BerechnetePosition[] {
  const raeumeMitMontage = new Set(
    positionen
      .filter(p => /sockelleisten montieren/i.test(p.beschreibung))
      .map(p => raumSuffix(p.beschreibung))
      .filter((raum): raum is string => raum !== null)
  )
  return positionen.filter(position => {
    if (!/sockelleisten abkleben/i.test(position.beschreibung)) return true
    const raum = raumSuffix(position.beschreibung)
    return !raum || !raeumeMitMontage.has(raum)
  })
}

function mergePositionen(a: BerechnetePosition[], b: BerechnetePosition[]): BerechnetePosition[] {
  const seen = new Set(a.map(p => `${p.beschreibung.toLowerCase()}|${p.menge}`))
  const merged = [...a]
  for (const p of b) {
    const key = `${p.beschreibung.toLowerCase()}|${p.menge}`
    if (!seen.has(key)) { merged.push(p); seen.add(key) }
  }
  return merged
}
