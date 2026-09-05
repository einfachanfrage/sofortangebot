import type { MengenErgebnis, BerechnetePosition } from '../types'
import type { BelagTyp } from '../../boden-normalisierer'
import { standardVerschnitt } from '../../boden-normalisierer'
import { baueVerstaendnis } from '../../auftrags-verstaendnis'
import { berechneSockelleistenLaenge } from './sockelleisten'
import { erkenneSockelleistenAusschluss, SOCKEL_WORT } from '../../sockelleisten-ausschluss'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// PM-013 (2026-08-19): auch von kontext-analyzer.ts (anreichernBodenParkett)
// wiederverwendet, um zu erkennen, ob ein Raum überhaupt einen echten
// Verlege-Auftrag hat — EINE Stelle für dieses Signal, damit es nicht wie
// beim losen "boden"-Substring-Bug ein zweites Mal auseinanderdriftet.
export const BODEN_VERLEGEN_SIGNAL = /verleg|vinyl|laminat|parkett|dielen|kork|linoleum|teppich|nadelvlies|bodenbelag|estrich/i

// Label und Verschnitt schalten auf den TYPISIERTEN Belag (BelagTyp aus dem
// Vertrag/erkenneBelag) statt auf eine engine-eigene includes()-Kette — Schluss
// mit der dreifachen Belag-Erkennung. Die Label-Strings bleiben bewusst
// unverändert, weil sie als Katalog-Schlüssel dienen (preis-matcher,
// material-mapping erwarten exakt "Fertigparkett"/"Vinyl-Boden").
function belagLabel(belag: string | undefined, typ: BelagTyp): string {
  if (!belag) return 'Bodenbelag'
  const b = belag.toLowerCase()
  switch (typ) {
    case 'vinyl':
      return b.includes('klick-vinyl') || (b.includes('klick') && /v[ie]nyl/.test(b)) ? 'Klick-Vinyl' : 'Vinyl-Boden'
    case 'laminat':  return 'Laminat'
    case 'parkett':  return 'Fertigparkett'
    case 'kork':     return 'Kork'
    case 'linoleum': return 'Linoleum'
    case 'teppich':  return b.includes('nadelvlies') ? 'Nadelvlies-Teppichboden' : 'Teppichboden'
    default:         return belag // unklassifiziert: Rohwert als Katalog-Fallback
  }
}

// PM-004: pauschal 10% war für JEDE gerade Verlegung zu hoch (Fachwissen-
// Standard bei gerader Verlegung: ca. 5%) — nur bei Diagonalverlegung
// (siehe Aufrufer unten) braucht es wirklich 15% mehr Verschnitt.


// PM-013 (2026-08-19): "verlegerichtung" prüfte bisher NUR auf den exakten
// String 'diagonal' — GPT liefert für Fischgrät-Verlegung aber wörtlich
// "fischgrät" (bestätigt an echten Produktions-Rohdaten, siehe
// debug_extraktion_roh), nicht 'diagonal'. Fachwissen verlangt für BEIDE
// Verlegearten denselben erhöhten Verschnitt (10–15%, hier wie bei diagonal
// bisher schon: pauschal 15%) — Fischgrät ist Muster-/Winkelverlegung,
// braucht mindestens genauso viel Zuschnittsverschnitt wie diagonal. Ohne
// diesen Treffer fiel Fischgrät-Parkett auf `standardVerschnitt()` zurück,
// die für Parkett 0% liefert (siehe oben) — schlechter als sogar der falsche
// Standard für gerade Verlegung (dort wären es bei Laminat/Vinyl 5%).
// Soll-Audit 2026-08-31: umlautlose Schreibweise („fischgraet") ergänzt —
// dieselbe Falle wie bei den Flächen-Mustern. Trifft das Muster nicht, fällt
// Fischgrät auf den Standard-Verschnitt zurück und das Angebot ist zu klein.
const MUSTER_MIT_MEHR_VERSCHNITT = /diagonal|fischgr(?:ä|ae|a)t/i

export function bodenEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  // PM-033: einmal für den ganzen Auftrag lesen, nicht je Raum neu.
  const sockelAusschluss = erkenneSockelleistenAusschluss(
    daten.transkript ?? '',
    (daten.raeume ?? []).map((r: { name?: string }) => r?.name ?? '').filter(Boolean),
  )

  for (const raum of (daten.raeume ?? [])) {
    const {
      name = 'Raum',
      laenge, breite,
      flaeche: f,
      umfang: umfangAusRaum,
      teilflaeche,
      belag,
      verlegerichtung,
      tueren = [],
      altbelag_entfernen = false,
      sockelleisten = false,
      ausgleich = false,
      feuchtigkeitssperre = false,
      parkett_schleifen = false,
      arbeiten = [],
    } = raum

    let flaeche: number | null = null
    let umfang: number | null = null

    if (laenge && breite) {
      flaeche = round2(laenge * breite)
      umfang = round2(2 * laenge + 2 * breite)
    } else if (f) {
      flaeche = f
    }

    // PM-035: Ein L-förmiger Raum hat eine Fläche, aber kein Länge × Breite.
    // Sein Umfang steht dann direkt am Raum (siehe l-form.ts) — ohne ihn gäbe
    // es für einen solchen Flur keine Sockelleisten-Position, obwohl sie
    // ausdrücklich beauftragt ist. Ein ausdrücklich gesetzter Umfang schlägt
    // den aus Länge × Breite berechneten.
    if (typeof umfangAusRaum === 'number' && isFinite(umfangAusRaum) && umfangAusRaum > 0) {
      umfang = round2(umfangAusRaum)
    }

    if (!flaeche) continue

    // PM-036 (Prüfmeister, 02.09.2026): Wird ausdrücklich nur ein Teil des
    // Raums bearbeitet („nur eine Ecke, ungefähr sechs Quadratmeter, der Rest
    // bleibt liegen"), ist DAS die Arbeitsfläche — das Raummaß steht im Diktat
    // nur als Kontext. Vorher gewann immer Länge × Breite: 21,00 m² statt
    // 6,30 m², 785,40 € zu viel auf einem 734-€-Angebot.
    //
    // Der Umfang bleibt bewusst der des GANZEN Raums: Sockelleisten laufen an
    // allen vier Wänden entlang, auch wenn nur eine Ecke neu verlegt wird.
    // Erkennung + Herkunft der Zahl: src/lib/teilflaeche.ts.
    const raumflaeche = flaeche
    const istTeilflaeche = typeof teilflaeche === 'number'
      && isFinite(teilflaeche)
      && teilflaeche > 0
      && teilflaeche < raumflaeche
    if (istTeilflaeche) flaeche = round2(teilflaeche as number)
    const teilflaechenAnnahme = istTeilflaeche
      ? [`Nur Teilfläche ${flaeche.toLocaleString('de-DE')} m² statt der vollen Raumfläche ${raumflaeche.toLocaleString('de-DE')} m² (so im Aufmaß gesagt)`]
      : []

    // Typisierter Auftrags-Vertrag: der Belag-Feldwert wird EINMAL zentral über
    // erkenneBelag klassifiziert (belagText-Signal, Etappe 2). Kein Rohtext vom
    // Transkript → kein Cross-Room-Bleed bei mehreren Räumen.
    const belagTyp: BelagTyp = baueVerstaendnis(belag ?? '', { belagText: belag }).belag
    const hatMusterverlegung = typeof verlegerichtung === 'string' && MUSTER_MIT_MEHR_VERSCHNITT.test(verlegerichtung)
    const verschnitt = hatMusterverlegung ? 0.15 : standardVerschnitt(belagTyp ?? belag)
    const label = belagLabel(belag, belagTyp)
    const pct = Math.round(verschnitt * 100)
    const verschnittSuffix = verschnitt > 0 ? ` inkl. ${pct}% Verschnitt` : ''

    // PM-010: diese Engine läuft jetzt auch für Räume, die NUR Sockelleisten
    // wollen (kein neuer Belag) — sockelleisten.ts braucht dafür die Engine,
    // siehe hatBodenAnteil in mehrgewerk.ts. Ohne diese Prüfung würde für JEDEN
    // Raum mit Maßen automatisch "Bodenbelag verlegen" erfunden, egal ob
    // überhaupt ein neuer Belag verlangt wurde. Echter Beleg-Auftrag liegt vor,
    // wenn: ein Belag-Name genannt wurde, ODER Altbelag raus soll (schon oben
    // gegen GPT-Selbstwidersprüche geprüft), ODER ein echtes Verlege-Verb in
    // den (KI-geprüften) arbeiten[] steht.
    const hatEchtenBelagAuftrag = (typeof belag === 'string' && belag.trim() !== '')
      || altbelag_entfernen
      || (Array.isArray(arbeiten) && arbeiten.some((a: string) => BODEN_VERLEGEN_SIGNAL.test(a)))

    // Verlegen NUR wenn kein reines Abschleif-/Refinish-Auftrag (man legt keinen
    // neuen Boden, wenn der bestehende nur abgeschliffen + versiegelt wird) UND
    // nur wenn überhaupt ein echter Belag-Auftrag vorliegt.
    if (!parkett_schleifen && hatEchtenBelagAuftrag) {
      positionen.push({
        beschreibung: `${label} verlegen${verschnittSuffix} — ${name}`,
        menge: round2(flaeche * (1 + verschnitt)),
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `${flaeche} m² + ${pct}% Verschnitt`,
        annahmen: [
          ...teilflaechenAnnahme,
          `${pct}% Verschnitt${hatMusterverlegung ? ` (${verlegerichtung === 'diagonal' ? 'Diagonalverlegung' : 'Fischgrät-/Musterverlegung'})` : ' (Standard)'}`,
        ],
      })
    }

    if (altbelag_entfernen) {
      positionen.push({
        beschreibung: `Altbelag entfernen — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: istTeilflaeche ? `Teilfläche: ${flaeche} m²` : `Bodenfläche: ${flaeche} m²`,
        annahmen: [...teilflaechenAnnahme],
      })
    }

    // PM-013, Nachtest 3 (2026-08-21): GPTs `sockelleisten`-Flag ist ein
    // reines Boolean ohne Textbeleg-Pflicht — bei diesem Testfall stand es
    // für das Wohnzimmer auf true, obwohl im Transkript nie "Sockelleisten"
    // vorkam und ausdrücklich "an den Wänden machen wir nix" gesagt wurde.
    // Menge exakt 25 lfdm = voller Wohnzimmer-Umfang (2×(8+4,5)) — sieht nach
    // einer GPT-seitigen Standardannahme "neuer Boden → automatisch neue
    // Sockelleisten" aus. Gleiches Prinzip wie bei den Schutz-/Abklebearbeiten
    // in maler-basis.ts (pruefeStreichenBasis): keine ungefragte
    // Zusatzposition — das Flag allein reicht nicht, es braucht zusätzlich
    // ein eigenes Textsignal.
    //
    // Bewusst gegen das ROHTRANSKRIPT geprüft, nicht gegen die arbeiten[]-
    // Liste dieses Raums: PM-002b (Golden-Test) zeigt einen echten Fall, bei
    // dem der Nutzer "Sockelleisten werden neu montiert" sagt, GPT das aber
    // NICHT zusätzlich in arbeiten[] verewigt (dort steht nur "vinyl
    // verlegen") — ein arbeiten[]-Gate hätte diesen legitimen Fall
    // fälschlich mitgestrichen. Kein perfektes Pro-Raum-Signal bei mehreren
    // Räumen, aber strikt besser als das bisherige blinde Vertrauen auf ein
    // unbelegtes Boolean.
    //
    // PM-033 (03.09.2026): Das Textsignal allein reicht nicht — das Wort steht
    // auch in dem Satz, der die Sockelleisten ABBESTELLT („Sockelleisten
    // bleiben überall, wie sie sind"). Deshalb zusätzlich der satzweise
    // Ausschluss, mit Raumbezug: „Sockelleisten im Flur neu. Im Wohnzimmer
    // bleiben sie." legt sie im Flur an und im Wohnzimmer nicht.
    // PM-034 (04.09.2026): stand hier als /sockelleist/i — und Whisper hatte
    // „Zockelleisten" verstanden. Das Gate schlug zu, die Leistung fiel für
    // beide Räume aus. Jetzt der gemeinsame, tolerante Ausdruck.
    const hatSockelleistenSignal = SOCKEL_WORT.test(daten.transkript ?? '')
      && !sockelAusschluss.global
      && !sockelAusschluss.raeume.has(name)
    if (sockelleisten && hatSockelleistenSignal && umfang) {
      // PM-002: Türen unterbrechen die Sockelleiste — genau wie beim Maler
      // (maler.ts), nur bisher hier nie abgezogen worden. Gleiche Funktion
      // wie dort, damit das nicht wieder auseinanderdriftet.
      const effTueren = (tueren as Array<{ breite?: number; anzahl?: number }>).filter(Boolean)
      const sockelM = effTueren.length > 0 ? berechneSockelleistenLaenge(umfang, effTueren) : umfang
      positionen.push({
        beschreibung: `Sockelleisten montieren — ${name}`,
        menge: sockelM,
        einheit: 'lfdm',
        konfidenz: 'high',
        berechnungsweg: umfang > sockelM
          ? `Umfang: ${umfang} lfm − Öffnungen über 1 m: ${round2(umfang - sockelM)} m`
          : `Umfang: ${umfang} lfm (Öffnungen bis 1 m werden nach VOB nicht abgezogen)`,
        annahmen: [],
      })
    }

    if (feuchtigkeitssperre) {
      positionen.push({
        beschreibung: `Epoxidharz-Feuchtigkeitssperre aufwalzen — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: istTeilflaeche ? `Teilfläche: ${flaeche} m²` : `Bodenfläche: ${flaeche} m²`,
        annahmen: [...teilflaechenAnnahme],
      })
    } else if (ausgleich) {
      positionen.push({
        beschreibung: `Untergrundvorbereitung / Ausgleich — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: istTeilflaeche ? `Teilfläche: ${flaeche} m²` : `Bodenfläche: ${flaeche} m²`,
        annahmen: [...teilflaechenAnnahme],
      })
    }

    if (parkett_schleifen) {
      positionen.push({
        beschreibung: `Parkett schleifen — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: istTeilflaeche ? `Teilfläche: ${flaeche} m²` : `Bodenfläche: ${flaeche} m²`,
        annahmen: [...teilflaechenAnnahme],
      })
    }
  }

  if (positionen.length === 0) {
    warnungen.push('Keine Bodenbelag-Flächen erkannt. Bitte Raummaße angeben.')
  }

  return {
    gewerk: 'boden_parkett',
    quelleText: daten.transkript ?? '',
    objekte: [],
    positionen,
    rueckfragen: [],
    warnungen,
    plausibel: warnungen.length === 0,
  }
}
