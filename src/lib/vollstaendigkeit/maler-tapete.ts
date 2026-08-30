import type { BerechnetePosition } from '../mengen/types'
import { hat, add, filtereArray } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

// Sockelleisten lackieren: Schleifen + 2× Lackieren
export function pruefeSockelleistenLackieren(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string, v: AuftragsVerstaendnis): void {
  const hatSockelLackieren = lower.includes('sockelleist') && v.hatArbeit('lackieren')
  if (!hatSockelLackieren || hat(ergaenzt, 'sockelleisten lackieren', 'sockelleisten abschleifen')) return

  const lfdmMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:lfm|lfdm|laufende?r?\s*meter|meter\s*umfang|meter)/i)
  const lfdm = lfdmMatch ? parseFloat(lfdmMatch[1].replace(',', '.')) : null
  if (lfdm !== null && lfdm > 0) {
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('sockelleisten abkl'))
    ergaenzt.push({ beschreibung: 'Sockelleisten abschleifen', menge: lfdm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdm} lfm aus Transkript`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Sockelleisten lackieren (2× Anstrich)', menge: lfdm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdm} lfm`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Sockelleisten abschleifen')
    add(ergaenzt, fehlende, 'Sockelleisten lackieren (2× Anstrich)')
  }
}

// Sockelleisten streichen: nur wenn explizit "Sockelleisten streichen" ohne Lackkontext
//
// PM-010: zwei Lücken gleichzeitig behoben.
// 1. "gestrichen" (Partizip von "streichen") enthält den Wortstamm "streich"
//    NICHT wörtlich (streichen → gestrichen, Vokalwechsel bei starken Verben)
//    — wurde bisher komplett übersehen.
// 2. "Sockelleisten [Details]. Die sollen dann auch noch gestrichen werden."
//    ist ein in der Praxis übliches Muster: die Sockelleisten und das
//    Streichen stehen in ZWEI Sätzen, verbunden über ein Bezugswort
//    ("die"/"sie"/"diese"). Das reine 3-Wörter-Fenster im selben Satz hat
//    das nie erreicht.
// Wichtig dabei: eine echte Verneinungs-Prüfung, damit "nicht gestrichen,
// nur montiert" (siehe PM-002) niemals als Ja zählt — sonst würde hier
// derselbe Fehler entstehen, den wir gerade erst für den Bodenaustausch
// gefixt haben (Position erfinden, wo keine gewollt war).
const STREICH_WORT = /streich\w*|anstrich\w*|gestrichen|angestrichen/i

function hatVerneinungVorStreichen(satz: string): boolean {
  const m = satz.match(STREICH_WORT)
  if (!m || m.index === undefined) return false
  return /\b(nicht|kein\w*)\b/i.test(satz.slice(0, m.index))
}

// PM-010, zweiter Nachtest (2026-08-17): die Satz-Logik unten geht von
// Punkten zwischen Sätzen aus ("... MDF-Leisten. Die sollen ..."). Echte,
// frei gesprochene Transkripte sind aber oft EIN einziger, kommagetrennter
// Redefluss ganz ohne Punkte dazwischen — dann greift die Satzgrenzen-Logik
// nie, egal wie weit das Fenster wäre. Deshalb JETZT ZUERST das robustere
// Signal: GPT liefert "sockelleisten streichen" oft schon als eigenen,
// bereits geprüften Eintrag in der arbeiten[]-Liste des Raums (dieselbe
// "eine geprüfte Struktur lesen, nicht den Rohtext neu interpretieren"-Regel
// wie beim PM-005-Fix). Die Satz-Logik bleibt als Rückfallebene für Fälle
// ohne diese Struktur (z.B. ältere Tests, die nur Rohtext ohne Signale
// übergeben).
function hatSockelleistenStreichenSignal(lower: string, arbeitenTexte: string[]): boolean {
  const hatStrukturSignal = arbeitenTexte.some(a => {
    const al = a.toLowerCase()
    return /sockelleist/.test(al) && STREICH_WORT.test(al) && !hatVerneinungVorStreichen(al)
  })
  if (hatStrukturSignal) return true

  const saetzeArr = lower.split(/[.!?\n;]+/).map(s => s.trim()).filter(Boolean)
  for (let i = 0; i < saetzeArr.length; i++) {
    const satz = saetzeArr[i]
    if (!/sockelleist/.test(satz)) continue

    // Fall A: "Sockelleisten" und "streichen/gestrichen" im selben Satz, nah beieinander.
    const naheBeieinander = /sockelleist\w*(?:\s+\w+){0,3}\s+(?:streich\w*|anstrich\w*|gestrichen|angestrichen)/i.test(satz)
      || /(?:streich\w*|anstrich\w*|gestrichen|angestrichen)(?:\s+\w+){0,3}\s+sockelleist/i.test(satz)
    if (naheBeieinander && !hatVerneinungVorStreichen(satz)) return true

    // Fall B: eigener Folgesatz mit Bezugswort ("Die sollen ... gestrichen werden").
    const naechsterSatz = saetzeArr[i + 1]
    if (naechsterSatz && /^(?:die|sie|diese)\b/.test(naechsterSatz)
      && STREICH_WORT.test(naechsterSatz) && !hatVerneinungVorStreichen(naechsterSatz)) {
      return true
    }
  }
  return false
}

export function pruefeSockelleistenStreichen(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string, v: AuftragsVerstaendnis): void {
  const hatSockelStreichenExplizit = hatSockelleistenStreichenSignal(lower, v.arbeitenTexte) && v.hatArbeit('streichen') && !v.hatArbeit('lackieren')
  if (!hatSockelStreichenExplizit || hat(ergaenzt, 'sockelleisten schleifen', 'sockelleisten streich')) return

  const lfdmMatchStr = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:lfm|lfdm|laufende?r?\s*meter|meter)/i)
  const lfdmStr = lfdmMatchStr ? parseFloat(lfdmMatchStr[1].replace(',', '.')) : null
  if (lfdmStr !== null && lfdmStr > 0) {
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('sockelleisten abkl'))
    if (lower.includes('schleifen') || lower.includes('schleif')) {
      ergaenzt.push({ beschreibung: 'Sockelleisten schleifen', menge: lfdmStr, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdmStr} lfm aus Transkript`, annahmen: [] })
    }
    ergaenzt.push({ beschreibung: 'Sockelleisten streichen', menge: lfdmStr, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdmStr} lfm`, annahmen: [] })
    return
  }

  // PM-010, FÜNFTER Fund — der eigentliche Grund, warum die letzten vier
  // Fix-Versuche live nie gewirkt haben: "fehlende" (der Rückgabewert von
  // pruefeUndErgaenzeVollstaendigkeit) wird in angebot-extrahieren/route.ts
  // beim Destrukturieren des Ergebnisses NIE gelesen — nur `positionen` und
  // `mengenRoh` kommen an, `fehlende` landet in `{ positionen, mengenRoh }`
  // gar nicht erst in einer Variable. Es existiert kein Feld dafür in
  // ExtraktionResponse. Ein Eintrag in "fehlende" ist technisch korrekt,
  // aber für den Nutzer unsichtbar — er sieht nicht 5 Positionen mit einer
  // offenen Rückfrage, er sieht einfach nur 4. Genau das hat Sandy im
  // Nachtest bestätigt ("keine offene Rückfrage dazu"). Alle vier bisherigen
  // Fix-Versuche haben die SIGNAL-ERKENNUNG repariert (erkennt der Code,
  // dass "Sockelleisten streichen" gemeint ist) — die war am Ende jedes Mal
  // korrekt, hat aber nie etwas genutzt, weil das Ergebnis in ein Loch fiel.
  //
  // Deshalb hier NICHT mehr auf eine explizite Meterangabe im Text warten
  // (die landet sowieso nur in "fehlende"), sondern die Menge von einer
  // bereits berechneten Schwester-Position übernehmen:
  // 1. "Sockelleisten montieren" (PM-010: alte raus, neue rein UND streichen)
  //    — dieselben neuen Leisten werden logischerweise mit derselben Länge
  //    gestrichen.
  // 2. Sonst "Sockelleisten abkleben" (PM-012: gar keine Neumontage, die
  //    VORHANDENEN Leisten sollen nur mitgestrichen werden) — die Abkleben-
  //    Position nutzt exakt dieselbe Umfang-minus-Türen-Formel wie
  //    "montieren" (siehe maler.ts), ist aber IMMER da, sobald in dem Raum
  //    gestrichen wird und Sockelleisten existieren — unabhängig davon, ob
  //    neu montiert wird oder nicht.
  // Nur bei MEHREREN Räumen mit je einer eigenen Kandidaten-Position raten
  // wir nicht, welche gemeint ist (lieber fragen als raten) und fallen auf
  // "fehlende" zurück — auch wenn das aktuell noch nicht beim Nutzer
  // ankommt, ist es nicht falsch.
  const montiertPositionen = ergaenzt.filter(p => /sockelleisten (?:montieren|erneuern)/i.test(p.beschreibung))
  const abklebenPositionen = ergaenzt.filter(p => /sockelleisten abkleben/i.test(p.beschreibung))
  const kandidaten = montiertPositionen.length > 0 ? montiertPositionen : abklebenPositionen
  if (kandidaten.length === 1) {
    const quelle = kandidaten[0]
    const raumSuffix = quelle.beschreibung.match(/\s+[—–-]\s+.+$/)?.[0] ?? ''
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('sockelleisten abkl'))
    ergaenzt.push({
      beschreibung: `Sockelleisten streichen${raumSuffix}`,
      menge: quelle.menge,
      einheit: quelle.einheit,
      konfidenz: 'medium',
      berechnungsweg: `Gleiche Länge wie „${quelle.beschreibung}" — im Transkript stand keine eigene Meterangabe fürs Streichen`,
      annahmen: [`Menge von „${quelle.beschreibung}" übernommen (keine eigene Meterangabe fürs Streichen genannt) — bitte kurz prüfen`],
    })
    return
  }

  if (lower.includes('schleifen') || lower.includes('schleif')) fehlende.push('Sockelleisten schleifen')
  fehlende.push('Sockelleisten streichen')
}

// Tapete entfernen + dann streichen (kein neues Tapezieren)
export function pruefeTapeteWegDannStreich(ergaenzt: BerechnetePosition[], fehlende: string[], v: AuftragsVerstaendnis): boolean {
  // Normalisierte Kategorien aus dem Vertrag statt Wort-Fetzen: deckt "gestrichen",
  // "abgemacht", "muss runter" etc. zentral ab.
  const kat = v.arbeiten
  const hatTapeteWegDannStreich = kat.has('tapete_entfernen') && kat.has('streichen') && !kat.has('tapezieren')
  if (!hatTapeteWegDannStreich) return false

  const wandPosTapRaus = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
  const tfmRaus = wandPosTapRaus?.menge ?? null
  if (tfmRaus !== null && tfmRaus > 0) {
    if (!hat(ergaenzt, 'tapete entfern')) ergaenzt.push({ beschreibung: 'Tapete entfernen', menge: tfmRaus, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfmRaus} m²`, annahmen: [] })
    if (v.hatArbeit('spachteln') && !hat(ergaenzt, 'spachtel', 'glätten')) ergaenzt.push({ beschreibung: 'Wände spachteln / glätten', menge: tfmRaus, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfmRaus} m²`, annahmen: [] })
  } else {
    if (!hat(ergaenzt, 'tapete entfern')) add(ergaenzt, fehlende, 'Tapete entfernen')
    if (v.hatArbeit('spachteln') && !hat(ergaenzt, 'spachtel', 'glätten')) add(ergaenzt, fehlende, 'Wände spachteln / glätten')
  }
  return true
}

// Tapete / Raufaser aufziehen + streichen
export function pruefeTapezieren(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  transkript: string,
  positionen: BerechnetePosition[],
  hatTapeteWegFlag: boolean,
): void {
  const hatAkzentwandPos = ergaenzt.some(p => {
    const d = p.beschreibung.toLowerCase()
    return d.includes('akzentwand') || d.includes('motivtapete') || d.includes('vliestapete')
  })
  const hatTapez = !hatAkzentwandPos && !hatTapeteWegFlag && (lower.includes('tapez') || lower.includes('raufaser') || lower.includes('tapete'))
  if (!hatTapez) return

  const wandPosTapez = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wand'))
  let tfm = wandPosTapez?.menge ?? null
  if (tfm === null) {
    const wandM2Match =
      transkript.match(/(?:wandfläche|wand(?:fläche)?|wände)[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i) ??
      transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?]*?(?:wandfläche|wand(?:fläche)?|wände)/i)
    if (wandM2Match) {
      const brutto = parseFloat(wandM2Match[1].replace(',', '.'))
      const abzugMatch = transkript.match(/(?:abzieh|minus|abzug|abzügl)[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
        ?? transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?]*?(?:abzieh|abzug)/i)
      const abzug = abzugMatch ? parseFloat(abzugMatch[1].replace(',', '.')) : 0
      tfm = Math.max(0, brutto - abzug)
    } else {
      const m2Match = transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
      if (m2Match) tfm = parseFloat(m2Match[1].replace(',', '.'))
    }
  }
  if (tfm !== null) {
    const etMatch = transkript.match(/(\d+)\s*(?:etagen?|stockwerke?|etag\b)/i)
    if (etMatch) {
      const etagen = parseInt(etMatch[1])
      if (etagen > 1) tfm = tfm * etagen
    }
  }

  if (tfm !== null && tfm > 0) {
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('wandflächen streichen'))

    const hatEntfernen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('tapete entf') || p.beschreibung.toLowerCase().includes('tapete abneh'))
    const aufziehenPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('aufzieh') || p.beschreibung.toLowerCase().includes('tapezier'))
    const hatAufziehen = !!aufziehenPos
    const hatStreichen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('raufaser streich') || p.beschreibung.toLowerCase().includes('tapete streich') || p.beschreibung.toLowerCase().includes('vliestapete streich'))

    // PM-017: bisher wurden Entfernen + Streichen IMMER mit erzeugt, sobald
    // irgendein Tapezier-Signal da war — auch wenn der Kunde nur frisch
    // verputzte, unbehandelte Wände neu tapeziert ("frischer Putz, keine
    // Farbe") und weder eine alte Tapete zu entfernen noch ein Anstrich
    // danach gewünscht war. Beide Zusatzschritte jetzt nur noch, wenn der
    // Text sie tatsächlich hergibt — echte Verneinung ("keine Farbe") hat
    // dabei Vorrang vor jedem Streich-Signal.
    const hatEntfernenSignal = /entfern|abl[öo]s|abzieh|alte\s+tapete|tapete\s+(?:ab|raus|runter)|tapete\s+kommt\s+(?:ab|raus|runter)/i.test(lower)
    const keineFarbeSignal = /keine\s+farbe|ohne\s+farbe|nicht\s+(?:mehr\s+)?streich\w*|nicht\s+anstreich\w*|kein\s+anstrich/i.test(lower)
    const hatStreichSignal = !keineFarbeSignal && /streich|anstrich|farbe/i.test(lower)

    const istRaufaser = lower.includes('raufaser')
    const istMalervlies = lower.includes('malervlies') || lower.includes('renoviervlies')
    const istVliestapete = lower.includes('vliestapete') || lower.includes('vlies')
    const tapetenTyp = istRaufaser ? 'Raufaser' : istMalervlies ? 'Malervlies' : istVliestapete ? 'Vliestapete' : 'Tapete'

    // Die KI liefert in arbeiten[] gelegentlich nur das generische
    // "Tapete aufziehen". Der im Transkript genannte Tapetentyp muss für die
    // eindeutige Preiszuordnung erhalten bleiben.
    if (aufziehenPos && tapetenTyp !== 'Tapete' && /^tapete (?:aufzieh|tapezier)/i.test(aufziehenPos.beschreibung)) {
      aufziehenPos.beschreibung = `${tapetenTyp} tapezieren`
    }

    if (!hatEntfernen && hatEntfernenSignal) ergaenzt.push({ beschreibung: 'Tapete entfernen', menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
    if (!hatAufziehen) ergaenzt.push({ beschreibung: `${tapetenTyp} tapezieren`, menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
    if (!hatStreichen && hatStreichSignal) ergaenzt.push({ beschreibung: `${tapetenTyp} streichen`, menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })

    const bodenWirdEntfernt = /(?:teppich|altbelag|bodenbelag|laminat|vinyl|parkett).{0,30}(?:entfern|raus|aufnehm|demont)/i.test(lower)
    const leerstehend = /leer\s*steh|unbewohnt|ohne\s+möbel|möbelfrei/i.test(lower)
    if (!bodenWirdEntfernt && !leerstehend && !hat(ergaenzt, 'boden schütz', 'abdeck')) {
      const bodenEnginePos = positionen.find(p => p.beschreibung.toLowerCase().includes('boden'))
      if (bodenEnginePos) {
        ergaenzt.push({ beschreibung: 'Boden schützen / Abdecken', menge: bodenEnginePos.menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenEnginePos.menge} m²`, annahmen: [] })
      } else {
        add(ergaenzt, fehlende, 'Boden schützen / Abdecken')
      }
    }
  } else {
    // PM-017, Punkt 2: hier wurde bisher IMMER ein fester Vier-Schritte-
    // Workflow (entfernen/glätten/aufziehen/streichen) erfunden, sobald das
    // Wort "tapezieren" fiel — unabhängig davon, was der Kunde tatsächlich
    // gesagt hat. Sandy hat bestätigt, drei der vier Positionen nie gesagt
    // zu haben. Jetzt nur noch das erkannte Tapezieren selbst (der Auslöser
    // dieser Funktion) als fehlende Menge vermerken, plus die drei
    // Zusatzschritte nur bei echtem Signal dafür im Text.
    const hatEntfernenSignal = /entfern|abl[öo]s|abzieh|alte\s+tapete|tapete\s+(?:ab|raus|runter)/i.test(lower)
    const hatGlaettenSignal = /gl[äa]tt|untergrund.{0,20}spachtel|spachtel.{0,20}untergrund/i.test(lower)
    const keineFarbeSignal = /keine\s+farbe|ohne\s+farbe|nicht\s+(?:mehr\s+)?streich\w*|nicht\s+anstreich\w*|kein\s+anstrich/i.test(lower)
    const hatStreichSignal = !keineFarbeSignal && /streich|anstrich|farbe/i.test(lower)
    if (hatEntfernenSignal && !hat(ergaenzt, 'tapete entfern', 'tapete abnehm')) add(ergaenzt, fehlende, 'Tapete entfernen')
    if (hatGlaettenSignal && !hat(ergaenzt, 'untergrund', 'glätten')) add(ergaenzt, fehlende, 'Untergrund glätten / Spachteln')
    if (!hat(ergaenzt, 'aufzieh', 'tapezieren')) add(ergaenzt, fehlende, 'Tapete/Raufaser aufziehen — Fläche bitte angeben')
    if (hatStreichSignal && !hat(ergaenzt, 'raufaser streich')) add(ergaenzt, fehlende, 'Raufaser streichen')
  }
}

// Fassade: Folgepositionen mit gleicher Fläche
export function pruefeFassade(ergaenzt: BerechnetePosition[], lower: string, transkript: string, v: AuftragsVerstaendnis): void {
  const istFassade = lower.includes('fassade') || lower.includes('außenwand')
    || (lower.includes('außen') && v.hatArbeit('streichen') && !lower.includes('fenster') && !lower.includes('außenfen'))
    || lower.includes('garagenfassade') || lower.includes('garage außen')
  if (!istFassade) return

  const hatRisse = lower.includes('riss') || lower.includes('schäden') || lower.includes('abgeplatzt')
    || lower.includes('moos') || lower.includes('algen')
  const wandPos = ergaenzt.find(p =>
    p.beschreibung.toLowerCase().includes('wand') ||
    p.beschreibung.toLowerCase().includes('fassade') ||
    p.beschreibung.toLowerCase().includes('streichen')
  )
  let fm = wandPos?.menge ?? null
  if (fm === null) {
    const m2Match = transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
    if (m2Match) fm = parseFloat(m2Match[1].replace(',', '.'))
  }
  if (fm === null || fm <= 0) return

  // PM-008-Nachtest: diese Funktion stammt noch aus der Zeit, bevor die
  // Fassaden-Engine (maler.ts, `daten.waende[]`-Zweig) selbst rechnen konnte
  // — sie hat die Standardpositionen damals selbst geraten. Seit die Engine
  // "Fassadenfläche streichen …" korrekt berechnet, hat das zwei Folgen, die
  // beide im Nachtest aufgefallen sind:
  //  1. "Fassadenfarbe 2× Anstrich" wurde trotzdem nochmal draufgesetzt —
  //     der `hat...`-Check hier kannte den NEUEN Positionsnamen
  //     "Fassadenfläche streichen" nicht, also doppelte Berechnung derselben
  //     Fläche unter zwei verschiedenen Namen.
  //  2. "Fassade reinigen" kam ungefragt dazu (334,80 €), nur weil das Wort
  //     "Fassade" irgendwo im Text steht — ohne dass je von Schmutz,
  //     Verschmutzung oder Reinigung die Rede war. Gleiches Muster wie schon
  //     bei PM-003/PM-007: nur bei echtem Signal, nicht geraten.
  const hatReinigenSignal = /reinig|s[äa]uber|waschen|druckwasch|hochdruck|schmutz/i.test(lower) || hatRisse
  const hatReinigen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('reinigen'))
  const hatGrundierung = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('grundierung'))
  // Nur "fassadenfarbe" (alte Funktion hier) und "fassadenfläche" (neuer
  // Engine-Name) zählen als Duplikat. NICHT "fassade streichen" — das ist
  // exakt der rohe Eingabetext, den diese Funktion erst noch zur echten
  // 2×-Anstrich-Position anreichern soll. Hätten wir das mitgezählt, würde
  // die Anreicherung nie passieren, weil der Rohtext ja schon "streichen"
  // enthält.
  const hatFarbe = ergaenzt.some(p => {
    const b = p.beschreibung.toLowerCase()
    return b.includes('fassadenfarbe') || b.includes('fassadenfläche')
  })
  const hatRissfix = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('rissverschluss'))
  const fassadeFarbTyp = lower.includes('silikat') ? 'Silikatfarbe' : lower.includes('dispersion') ? 'Dispersionsfarbe' : 'Fassadenfarbe'

  if (hatReinigenSignal && !hatReinigen) ergaenzt.push({ beschreibung: 'Fassade reinigen / Untergrundvorbereitung', menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
  // Trockenlauf PM-031 (2026-08-30): Die Grundierung kam BEDINGUNGSLOS, allein
  // weil das Wort „Fassade" fiel — bei „einmal Fassadenfarbe drauf" also eine
  // volle, bepreiste Position, die niemand verlangt hat. Exakt das Muster, das
  // im Kommentar oben für „Fassade reinigen" schon als falsch erkannt wurde;
  // die Zeile daneben blieb es. Jetzt auch hier: nur bei echtem Signal.
  const hatGrundierSignal = /grundier|voranstrich|tiefengrund|primer|neubau|erstanstrich|rohbau|kreidet|saugend|sandet/i.test(lower) || hatRisse
  if (hatGrundierSignal && !hatGrundierung) ergaenzt.push({ beschreibung: 'Grundierung / Tiefengrund Fassade', menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
  if (!hatFarbe) ergaenzt.push({ beschreibung: `${fassadeFarbTyp} 2× Anstrich`, menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
  if (hatRisse && !hatRissfix) ergaenzt.push({ beschreibung: 'Rissverschluss / Spachtelarbeiten Außen', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Pauschale bei Rissen/Schäden', annahmen: [] })
}
