import { ersetzeZahlenWorte } from '@/lib/zahlen-parser'
import { segmentiereRaeume, loeseKorrekturenAuf, bauSegmentiertenTranskript } from '@/lib/raum-segmentierer'
import { erkenneErgaenzungen, bereiteFuerKiAuf } from '@/lib/ergaenzungs-erkenner'
import { extrahiereKorrekturen, formatKorrekturenFuerKi } from '@/lib/korrektur-resolver'
import { wendeImplizitRegelnAn } from '@/lib/implizit-wissen'
import { ergaenzeOeffnungenAusText } from './gesagte-werte'
import { berechneUndPruefeAlleGewerke } from './mehrgewerk'
import { berechneBewertung } from './bewertung'
import type { ExtrahierteDaten, MengenErgebnis, KalkulationsBewertung, KIRueckfrage } from './types'
import { normalisiereExtraktion } from './extraktion-normalisierer'
import { repariereDuplikatMasse, repariereDuplikatNamen } from './mehrraum-reparatur'
import {
  extrahiereWandflaeche, extrahiereDeckenflaeche, extrahiereAbzug,
  extrahiereTorMasse, zaehleFenster, zaehleTueren,
} from '@/lib/extraktion-masse'
import { bereiteRueckfragenVor } from './rueckfragen-flow'
import type { KalkulationsAntworten } from './antworten-verarbeiter'
import type { RueckfrageItem } from './rueckfragen-generator'
import { konsolidierePlatzhalterRaum } from './raum-konsolidierung'

export interface ExtraktionResponse {
  extraktion: ExtrahierteDaten
  extraktion_roh: ExtrahierteDaten | null
  mengen: MengenErgebnis
  bewertung: KalkulationsBewertung
  hat_rueckfragen: boolean
  implizit_positionen: string[]
  implizit_flags: Record<string, unknown>
  korrekturen_erkannt: number
  rueckfragen: RueckfrageItem[]
}

// CoS-002 Option 1, Schritt 2 (Head of Product Engineering, 2026-08-20,
// docs/cos-002-architektur-vorschlag.md): 1:1 aus src/app/api/angebot-
// extrahieren/route.ts HERAUSGEZOGEN (nicht neu geschrieben, nicht
// dupliziert) — bewusst, um die exakt gleiche PM-012-Drift-Falle zu
// vermeiden, die diesen ganzen CoS-002-Fund erst ausgelöst hat. Vorher lief
// diese komplette Nachbearbeitungskette NUR innerhalb der Route, direkt
// nach einem frischen GPT-Aufruf. Jetzt ist sie eine eigenständige,
// reine Funktion: nimmt ein (ggf. schon gecachtes) rohes GPT-Ergebnis
// entgegen, statt selbst einen Edge-Function-Aufruf zu machen — die Route
// bleibt für den frischen Aufruf zuständig, ruft danach diese Funktion auf.
// Das erlaubt es, DIESELBE Nachbearbeitung auch auf ein bereits vorher
// gecachtes Ergebnis anzuwenden (voll_extraktion, Schritt 1), ohne die
// Kette ein zweites Mal abzutippen. Single Source of Truth für "wie wird
// aus einer rohen GPT-Extraktion eine fertige Positionsliste" — exakt das,
// was CoS-002 beheben soll.
//
// edgeResult: das rohe { result: ExtrahierteDaten } aus ki-extrahieren,
// ODER null wenn eine bereits vorhandene basis_extraktion (Rückfragen-
// Runde) weiterverwendet werden soll — identisches Verhalten wie vorher in
// der Route.
export function verarbeiteExtraktion(
  text: string,
  edgeResult: { result: ExtrahierteDaten } | null,
  antworten: KalkulationsAntworten = {},
  basis_extraktion?: ExtrahierteDaten,
): ExtraktionResponse {
  // Vorverarbeitung: Zahlwörter + Multi-Raum + Ergänzungen + Korrekturen —
  // dieselben Schritte wie vor dem Edge-Aufruf, hier bewusst aus dem reinen
  // Text neu berechnet (billig, deterministisch), damit diese Funktion
  // eigenständig bleibt und nicht auf Zwischenwerte der Route angewiesen ist.
  const textMitZahlen = ersetzeZahlenWorte(text)
  const segmente = segmentiereRaeume(textMitZahlen)
  const segmenteGeklaert = loeseKorrekturenAuf(segmente)
  const segmentiertText = segmenteGeklaert.length > 1
    ? bauSegmentiertenTranskript(segmenteGeklaert)
    : textMitZahlen

  const ergaenzungen = erkenneErgaenzungen(segmentiertText)
  const korrekturen = extrahiereKorrekturen(segmentiertText)
  let verarbeitetText = bereiteFuerKiAuf(segmentiertText, ergaenzungen)
  if (korrekturen.length > 0) {
    verarbeitetText += formatKorrekturenFuerKi(korrekturen)
  }

  // Sichtbarkeit: Schnappschuss der Struktur GENAU so, wie GPT sie geliefert
  // hat — bevor irgendeines der Nachbearbeitungs-Module (unten) sie anfasst.
  const extraktionRoh = basis_extraktion
    ? null // Rückfragen-Runde: keine neue GPT-Antwort, nichts Neues zu zeigen
    : structuredClone(edgeResult!.result)

  let extraktion = basis_extraktion
    ? normalisiereExtraktion(structuredClone(basis_extraktion) as unknown as Record<string, unknown>)
    : normalisiereExtraktion(edgeResult!.result as unknown as Record<string, unknown>)

  // Manche KI-Antworten enthalten zusätzlich zum benannten Einzelraum einen
  // generischen Platzhalter "Raum". Bei genau einem echten Raum werden beide
  // zusammengeführt, statt den Nutzer doppelt nach denselben Maßen zu fragen.
  extraktion = konsolidierePlatzhalterRaum(extraktion, text)

  // Sicherheitsnetz: Erkennt die schnelle Vorschau konkrete Malerarbeiten,
  // darf die Kalkulation nicht wegen eines von der KI ausgelassenen
  // raeume[]-Eintrags bei "Keine Positionen erkannt" enden. Ein im Text
  // genannter Raumname bleibt erhalten; nur ohne jeden Namen heißt er "Raum".
  if (extraktion.gewerk === 'maler' && extraktion.raeume.length === 0) {
    const raumTreffer = text.match(/\b(Wohnzimmer|Schlafzimmer|Kinderzimmer|Badezimmer|Bad|Küche|Flur|Arbeitszimmer|Büro|Esszimmer|Treppenhaus|Keller|Garage)\b/i)
    const lowerText = text.toLocaleLowerCase('de-DE')
    const arbeiten: string[] = []
    if (/tapete|tapezier|malervlies|raufaser|vliestapete/.test(lowerText)) arbeiten.push('tapezieren')
    if (/tapete|raufaser|vliestapete/.test(lowerText) && /entfern|ablös|abzieh/.test(lowerText)) arbeiten.push('tapete entfernen')
    if (/grundier|tiefengrund|haftgrund/.test(lowerText)) arbeiten.push('wände grundieren')
    if (/spachtel|glätt/.test(lowerText)) arbeiten.push('wände spachteln')
    if (/w[äa]nd|wandfl/.test(lowerText) && /streich|anstrich|weiß|weiss/.test(lowerText)) arbeiten.push('wände streichen')
    if (/decke|deckenfl/.test(lowerText) && /streich|anstrich|weiß|weiss/.test(lowerText)) arbeiten.push('decke streichen')

    if (arbeiten.length > 0) {
      extraktion.raeume.push({
        name: raumTreffer?.[1] ?? 'Raum',
        laenge: null,
        breite: null,
        hoehe: null,
        flaeche: null,
        fenster: [],
        tueren: [],
        arbeiten: [...new Set(arbeiten)],
        altbelag_entfernen: /tapete|raufaser|vliestapete/.test(lowerText) && /entfern|ablös|abzieh/.test(lowerText),
        sockelleisten: false,
        nassbereich: false,
      })
    }
  }
  extraktion.transkript = verarbeitetText

  // GPT-Bug: Bei Mehrraum-Aufträgen gibt GPT manchmal falsche Namen oder kopierte Maße zurück
  if (extraktion.raeume.length > 1) {
    const { repariert: mitNamen, wurdeRepariert: nRep } = repariereDuplikatNamen(extraktion.raeume, text)
    if (nRep) extraktion = { ...extraktion, raeume: mitNamen }
    const { repariert, wurdeRepariert } = repariereDuplikatMasse(extraktion.raeume, text)
    if (wurdeRepariert) extraktion = { ...extraktion, raeume: repariert }
  }
  if (extraktion.bereiche.length > 1) {
    const { repariert: mitNamen, wurdeRepariert: nRep } = repariereDuplikatNamen(extraktion.bereiche, text)
    if (nRep) extraktion = { ...extraktion, bereiche: mitNamen }
    const { repariert, wurdeRepariert } = repariereDuplikatMasse(extraktion.bereiche, text)
    if (wurdeRepariert) extraktion = { ...extraktion, bereiche: repariert }
  }

  // ── DC-026 (2026-08-24): erst selbst nachlesen, dann fragen ──────────────
  // Diese drei Blöcke standen bisher UNTERHALB der Rückfragen-Erzeugung. Das
  // war die eigentliche Ursache von DC-026 („fragt nach Sachen, die ich schon
  // gesagt habe"): Die Fragen entstanden aus dem, was GPT strukturiert
  // geliefert hatte — und erst danach lasen unsere eigenen, getesteten Parser
  // dieselben Werte aus dem Transkript nach. Gefragt wurde also nach Zahlen,
  // mit denen einen Moment später ohnehin gerechnet wurde. Jetzt in der
  // richtigen Reihenfolge: Hausaufgaben zuerst, gefragt wird nur noch, was
  // dann wirklich offen ist. Inhaltlich ist an den Blöcken nichts geändert.

  // Direkte Flächenangaben aus Transkript patchen wenn GPT sie nicht extrahiert hat
  // Greift für Single-Raum — bei Multi-Raum zu riskant (Zuordnung unklar)
  if ((extraktion.raeume?.length ?? 0) === 1) {
    const r = extraktion.raeume[0]
    const t = verarbeitetText

    if (r.wandflaeche_direkt === null || r.wandflaeche_direkt === undefined) {
      const wand = extrahiereWandflaeche(t)
      if (wand !== null) r.wandflaeche_direkt = wand
    }

    if (r.deckflaeche_direkt === null || r.deckflaeche_direkt === undefined) {
      const deck = extrahiereDeckenflaeche(t)
      if (deck !== null) {
        r.deckflaeche_direkt = deck
        if (!r.flaeche) r.flaeche = deck
      }
    }

    if ((r.wandflaeche_abzug_m2 === null || r.wandflaeche_abzug_m2 === undefined) && r.wandflaeche_direkt) {
      const abzug = extrahiereAbzug(t)
      if (abzug !== null) r.wandflaeche_abzug_m2 = abzug
    }
  }

  // Tor/Garagentor in tueren[] injizieren — GPT erkennt "Tor" oft nicht
  if (extraktion.gewerk === 'maler') {
    const tor = extrahiereTorMasse(textMitZahlen)
    if (tor) {
      for (const raum of extraktion.raeume ?? []) {
        // Nur injizieren wenn noch keine passende Tür/kein Tor vorhanden
        const hatBigTuer = (raum.tueren ?? []).some((t: { breite?: number }) => (t.breite ?? 0) >= 1.5)
        if (!hatBigTuer) {
          raum.tueren = [{ breite: tor.breite, hoehe: tor.hoehe }]
        }
      }
    }
  }

  // Fenster/Tür-Anzahl: direkt aus Text extrahieren (zuverlässiger als GPT-Felder)
  const fensterAnzahlText = zaehleFenster(textMitZahlen)
  const tuerenAnzahlText = zaehleTueren(textMitZahlen)

  // DC-026: Die eben gezählten Öffnungen auch in den Raum schreiben. Bisher
  // wurden sie nur als `meta` an die Mengenberechnung weitergereicht — an
  // `raum.fenster` hängt aber die Rückfrage „Wie viele Fenster hat X?"
  // (kontext-analyzer.ts). Ergebnis war: gefragt wurde nach einer Zahl, mit
  // der längst gerechnet wurde. Genau der Fall aus Sandys Testtranskript.
  //
  // Bewusst nur bei GENAU EINEM Raum: `zaehleFenster`/`zaehleTueren` lesen
  // über das ganze Transkript, bei mehreren Räumen wäre die Zuordnung
  // geraten — dieselbe Vorsicht wie beim Flächen-Patch oben. Für die
  // Mehrraum-Fälle greift stattdessen der Vorschlag mit Zitat (DC-025).
  //
  // Die Verneinung gewinnt weiter: sagt jemand „ohne Fenster", wird nichts
  // injiziert (gleiche Prüfung wie im kontext-analyzer, gleiche Fehlerklasse
  // wie PM-011 „keine Kleinreparatur trotz Verneinung").
  ergaenzeOeffnungenAusText(extraktion, textMitZahlen)

  // Rückfragen aus KI und deterministischer Kontextanalyse zusammenführen.
  // Bereits beantwortete Angaben werden vor der Mengenberechnung eingesetzt.
  const rueckfragenErgebnis = bereiteRueckfragenVor(extraktion, antworten, textMitZahlen)
  extraktion = rueckfragenErgebnis.extraktion
  const rueckfragen = rueckfragenErgebnis.rueckfragen

  // Implizit-Wissen lokal anwenden (kein extra Edge-Function-Call nötig)
  const implizitResultat = wendeImplizitRegelnAn(text, extraktion.gewerk, extraktion)
  extraktion = implizitResultat.extraktion_angereichert

  if (implizitResultat.neue_positionen.length > 0) {
    extraktion.annahmen = [
      ...(extraktion.annahmen ?? []),
      ...implizitResultat.neue_positionen.map(p => `Automatisch erkannt: ${p}`),
    ]
  }

  if (implizitResultat.neue_rueckfragen.length > 0) {
    const neueRueckfragen: KIRueckfrage[] = implizitResultat.neue_rueckfragen.map((frage, i) => ({
      id: `implizit_${i}`,
      frage,
      typ: 'ja_nein' as const,
      betrifft: 'Allgemein',
      prioritaet: 1,
      schnell_antworten: [
        { label: 'Ja', wert: true },
        { label: 'Nein', wert: false },
      ],
    }))
    extraktion.rueckfragen = [...(extraktion.rueckfragen ?? []), ...neueRueckfragen]
  }

  // Rückfragen filtern: "Wie viele Fenster/Türen?" supprimieren wenn Raummaße bekannt (Standard-Annahmen)
  const hatRaumMasse = (extraktion.raeume ?? []).some(r => r.laenge && (r.breite || r.hoehe))
    || (extraktion.raeume ?? []).some(r => r.flaeche)
    || textMitZahlen.toLowerCase().includes('dachschräge') || textMitZahlen.toLowerCase().includes('schräge')
  const textLower = textMitZahlen.toLowerCase()
  const istFensterAuftrag = textLower.includes('fenster') &&
    (textLower.includes('lackier') || textLower.includes('streich') || textLower.includes('holzfenster') || textLower.includes('anstrich'))
  const istHeizkörperAuftrag = textLower.includes('heizkörper') || textLower.includes('heizkoerper') || textLower.includes('heizung')
  if (hatRaumMasse || istFensterAuftrag || istHeizkörperAuftrag) {
    extraktion.rueckfragen = (extraktion.rueckfragen ?? []).filter(r => {
      const frage = (r.frage ?? '').toLowerCase()
      return !(frage.includes('fenster') || frage.includes('türen') || frage.includes('türmaß') || frage.includes('fenstermaß') || frage.includes('fenstergrö'))
    })
  }

  // Raw-Text überschreibt GPT-Transkript — GPT normalisiert und verliert "nur X"-Angaben
  extraktion.transkript = text

  // Etappe 2: saubere KI-Signale bündeln — der Vertrag bevorzugt diese vor Rohtext-Regex
  const kiSignale = {
    arbeitenTexte: [
      ...(extraktion.raeume ?? []).flatMap(r => r.arbeiten ?? []),
      ...(extraktion.bereiche ?? []).flatMap(b => b.arbeiten ?? []),
    ],
    belagText: (extraktion.raeume ?? []).find(r => r.belag)?.belag ?? null,
    altbelagEntfernen: (extraktion.raeume ?? []).some(r => r.altbelag_entfernen),
    // PM-005: Räume mit Namen + eigener arbeiten[]-Liste durchreichen, damit
    // "nur Decke"/"nur Wände" pro Raum geprüft wird statt global.
    raeume: [
      ...(extraktion.raeume ?? []).map(r => ({ name: r.name, arbeiten: r.arbeiten })),
      ...(extraktion.bereiche ?? []).map(b => ({ name: b.name, arbeiten: b.arbeiten })),
    ],
  }

  // Mengen + Vollständigkeit über ALLE beteiligten Gewerke (Maler UND Boden im
  // selben Auftrag) — nicht nur das Haupt-Gewerk.
  const { positionen: positionenKomplett, mengenRoh } = berechneUndPruefeAlleGewerke(
    extraktion,
    textMitZahlen,
    { fensterAnzahl: fensterAnzahlText || undefined, tuerenAnzahl: tuerenAnzahlText || undefined },
    kiSignale,
  )
  const mengen = { ...mengenRoh, positionen: positionenKomplett }
  const bewertung = berechneBewertung(extraktion, mengen)

  return {
    extraktion,
    extraktion_roh: extraktionRoh,
    mengen,
    bewertung,
    hat_rueckfragen: rueckfragen.length > 0,
    rueckfragen,
    implizit_positionen: implizitResultat.neue_positionen,
    implizit_flags: implizitResultat.neue_flags,
    korrekturen_erkannt: korrekturen.length,
  }
}
