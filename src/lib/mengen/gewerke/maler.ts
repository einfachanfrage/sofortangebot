import type { MengenErgebnis, BerechnetePosition } from '../types'
import { erkenneScope } from '../../arbeiten-normalisierer'
import { baueVerstaendnis } from '../../auftrags-verstaendnis'
import { berechneSockelleistenLaenge } from './sockelleisten'
import { berechneOeffnungsabzugVob, vobHinweistext, type OeffnungsabzugErgebnis } from './vob-uebermessung'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Der Teil des Transkripts, der zu EINEM Raum gehört: ab der letzten Nennung
 * seines Namens bis zur nächsten Nennung eines anderen Raumnamens.
 *
 * Dieselbe Logik nutzt der Kontext-Analyzer schon, um eine Wandfläche dem
 * richtigen Raum zuzuordnen. Ohne sie bleibt bei mehreren Räumen nur die Wahl
 * zwischen „ganzer Text" (Angaben bluten in fremde Räume, PM-005) und „gar
 * kein Text" (Angaben gehen verloren, PM-026-Nachtest) — beides falsch.
 */
function abschnittFuerRaum(transkript: string, name: string, alleNamen: Array<string | undefined>): string {
  const text = (transkript ?? '').toLocaleLowerCase('de-DE')
  const gesucht = (name ?? '').toLocaleLowerCase('de-DE')
  if (!text || !gesucht) return ''
  // Nur ein Raum: der ganze Text gehört ihm.
  if (alleNamen.filter(Boolean).length <= 1) return text
  const start = text.lastIndexOf(gesucht)
  if (start < 0) return ''
  const naechster = alleNamen
    .filter((n): n is string => Boolean(n) && String(n).toLocaleLowerCase('de-DE') !== gesucht)
    .map(n => text.indexOf(n.toLocaleLowerCase('de-DE'), start + gesucht.length))
    .filter(index => index > start)
    .sort((a, b) => a - b)[0]
  return text.slice(start, naechster ?? text.length)
}

export function malerEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  // Typisierter Auftrags-Vertrag auf Transkript-Ebene: Öffnungs-Negation
  // ("kein Fenster") und Raumkontext (Keller/Garage/Schräge) sowie eine
  // Akzentwand-Ansage gelten transkriptweit — deshalb EINMAL außerhalb der
  // Raum-Schleife aus dem Gesamt-Transkript, nicht je Raum neu.
  const vGesamt = baueVerstaendnis(daten.transkript ?? '')

  for (const raum of (daten.raeume ?? [])) {
    const {
      name: nameRaw = 'Raum',
      laenge, breite, hoehe,
      flaeche: flaeche_angegeben,
      wandflaeche_direkt: wandflaeche_direkt_raw,
      wandflaeche_brutto: wandflaeche_brutto_raw = null,
      deckflaeche_direkt: deckflaeche_direkt_raw,
      wandflaeche_abzug_m2: wandflaeche_abzug_raw,
      dachschraege_flaeche_m2: dachschraege_flaeche_raw = null,
      umfang: umfang_direkt,
      kniestockhoehe = null,
      dachschraege_links_m2: dgLinks = null,
      dachschraege_rechts_m2: dgRechts = null,
      dachschraege_je_seite_m2: dgJeSeite = null,
      deckenspiegel_m2: dgDeckenspiegel = null,
      dachfenster: dgFensterRoh = [],
      fenster = [],
      tueren = [],
      arbeiten = [],
      sockelleisten: sockel = false,
    } = raum

    let bodenflaecheM2: number | null = null
    let wandflaecheNettoM2: number | null = null
    let deckenflaecheM2: number | null = null
    let umfangM: number | null = null
    const annahmenUmfang: string[] = []
    // VOB-Übermessung (siehe vob-uebermessung.ts): einmal je Raum berechnet,
    // damit die Wandflächen-Rechnung UND der spätere Anzeige-/Annahmetext
    // (weiter unten) garantiert dieselben Zahlen verwenden.
    let fensterAbzugVob: OeffnungsabzugErgebnis | null = null
    let tuerAbzugVob: OeffnungsabzugErgebnis | null = null

    const arbeitenStr = arbeiten.join(' ').toLowerCase()
    const transkriptLower = (daten.transkript ?? '').toLowerCase()
    // Raum-Ebene des typisierten Vertrags: NUR aus den (KI-verstandenen)
    // Raum-Arbeiten gebaut — so bluten Signale eines Raums nicht in andere
    // Räume. `arbeitenTexte` aktiviert den KI-Signalpfad (Etappe 2) des Vertrags:
    // saubere KI-Arbeiten statt reiner Rohtext-Regex.
    const vRaum = baueVerstaendnis(arbeitenStr, { arbeitenTexte: arbeiten })
    // Bei mehreren Räumen darf die Angabe "zweimal" eines Raums nicht auf
    // alle anderen Räume überspringen. Der Gesamttext ist nur im Ein-Raum-Fall
    // ein sicherer zusätzlicher Kontext.
    // PM-026-Nachtest (2026-08-30): Bei ZWEI Räumen im Angebot wurde der
    // Transkripttext hier komplett weggelassen — aus Angst vor Bleeding. Damit
    // erreichte „Decke reicht einmal" die Anstrichzahl nie, und die Decke stand
    // wieder mit 2× im Entwurf, obwohl die Karte schon 1× zeigte. Jetzt der
    // Mittelweg: der Abschnitt, der zu DIESEM Raum gehört — kein Bleeding, aber
    // auch kein Informationsverlust.
    const anstrichText = `${arbeitenStr} ${abschnittFuerRaum(daten.transkript ?? '', nameRaw, (daten.raeume ?? []).map((r: any) => r.name))}`
    const explizitEinAnstrich = /(?:einmal|1\s*[x×]|ein(?:en)?\s+anstrich|eine\s+lage)/i.test(anstrichText)
    const explizitZweiAnstriche = /(?:zweimal|2\s*[x×]|zwei\s+anstrich|zwei\s+lagen|2-fach)/i.test(anstrichText)
    const anstriche = explizitEinAnstrich && !explizitZweiAnstriche ? 1 : 2
    const anstrichAnnahmen = explizitEinAnstrich || explizitZweiAnstriche
      ? []
      : ['Zweifacher Anstrich als Standard angenommen — bitte prüfen']
    // PM-026 (Sandys Live-Fund, 2026-08-30): „Wände zweimal streichen, Decke
    // reicht einmal" ergab 2× für BEIDE Flächen. Die Anstrichzahl galt für den
    // ganzen Raum — sobald irgendwo „zweimal" fiel, gewann die 2, auch für eine
    // Fläche, für die im selben Satz ausdrücklich „einmal" gesagt wurde.
    // Jetzt wird je Fläche im zugehörigen Satzteil nachgesehen; findet sich
    // dort nichts, bleibt es beim Raum-Wert oben.
    const anstricheFuerFlaeche = (muster: RegExp): number => {
      const teile = anstrichText.split(/[,.;]|\bund\b/)
      const passend = teile.filter(teil => muster.test(teil))
      if (passend.length === 0) return anstriche
      const text = passend.join(' ')
      const ein = /(?:einmal|1\s*[x×]|ein(?:en)?\s+anstrich|eine\s+lage|reicht\s+ein)/i.test(text)
      const zwei = /(?:zweimal|2\s*[x×]|zwei\s+anstrich|zwei\s+lagen|2-fach)/i.test(text)
      if (ein && !zwei) return 1
      if (zwei && !ein) return 2
      return anstriche
    }
    const anstricheWand = anstricheFuerFlaeche(/w[äa]nd/i)
    const anstricheDecke = anstricheFuerFlaeche(/(?<!ab)decke/i)
    // Kontext (Keller/Garage/Schräge/Fassade) = Union aus Transkript-Ebene und
    // Raum-Arbeiten. Öffnungs-Negation gilt transkriptweit. Beides jetzt aus dem
    // typisierten Vertrag statt aus direkten Normalisierer-/Rohtext-Aufrufen.
    // Rohtext-Audit (2026-08-30, Auftrag nach PM-026): Der Gesamt-Kontext wird
    // aus dem ganzen Transkript gelesen. Bei MEHREREN Räumen blutet er sonst
    // von einem Raum in alle anderen — steht in einem Satz "Keller", verlieren
    // auch Wohnzimmer und Flur ihre Sockelleisten; fällt irgendwo "Garage",
    // verlieren alle Räume ihr Standardfenster. Dieselbe Fehlerklasse wie
    // PM-005 (dort beim Scope). Bei einem einzigen Raum bleibt der Gesamttext
    // ein sicherer Zusatz, weil er sich nur auf diesen Raum beziehen kann.
    const einRaum = (daten.raeume?.length ?? 0) === 1
    const kontext = {
      istKeller: (einRaum && vGesamt.kontext.istKeller) || vRaum.kontext.istKeller,
      istGarage: (einRaum && vGesamt.kontext.istGarage) || vRaum.kontext.istGarage,
      istDachschraege: (einRaum && vGesamt.kontext.istDachschraege) || vRaum.kontext.istDachschraege,
      istFassade: (einRaum && vGesamt.kontext.istFassade) || vRaum.kontext.istFassade,
    }
    const oeffnungen = vGesamt.oeffnungen
    // Früh deklarieren — wird in flaeche_angegeben-Branch benötigt.
    // Dachschräge kann ALLEIN vorkommen (ganzer Raum ist Schräge → Fläche = Wandfläche)
    // ODER neben normalen Wänden im selben Raum (Treppenhaus: Wände 68 m² + Schrägen 22 m²).
    // Im gemischten Fall dürfen die Schrägen NICHT die Wand-Positionen kapern — sie
    // bekommen eine eigene Fläche (dachschraege_flaeche_m2) und eine eigene Position.
    const dgUserFlaeche = (dachschraege_flaeche_raw as number | null)
    const hatDachschraegeArbeit = kontext.istDachschraege || /dachschr/i.test(arbeitenStr)
    // Soll-Audit 2026-08-31: `w[aä]nde?\b` traf unser eigenes Feldformat NICHT.
    // In „waende_streichen" folgt auf „waende" ein Unterstrich — und der zählt
    // als Wortzeichen, also gibt es dort keine Wortgrenze. Folge im
    // Dachgeschoss: ein Raum mit Wänden UND Schrägen galt als reiner
    // Schrägen-Raum, die Schrägenfläche aus dem Feld wurde nie zu einer
    // Position, und die Vollständigkeitsprüfung erfand stattdessen eine mit
    // der Fläche des Kniestocks. Ohne Wortgrenze, dafür mit beiden
    // Schreibweisen.
    const hatEchteWandArbeit = /w(?:ä|ae)nde?|wandfl|decke/i.test(arbeitenStr)
    const istDachschraege = hatDachschraegeArbeit && !hatEchteWandArbeit
    const dachschraegeSeparat = hatDachschraegeArbeit && hatEchteWandArbeit
    const dgLinksM2: number | null = (dgLinks as number | null) ?? (dgJeSeite as number | null)
    const dgRechtsM2: number | null = (dgRechts as number | null) ?? (dgJeSeite as number | null)
    const dgFenster = dgFensterRoh as any[]
    const istDachgeschoss = (kniestockhoehe as number | null) !== null || dgLinksM2 !== null || (dgDeckenspiegel as number | null) !== null

    // GPT gibt manchmal "Raum" als generischen Namen zurück — Raumtyp aus Transkript holen
    const raumTypen = ['kinderzimmer', 'wohnzimmer', 'schlafzimmer', 'badezimmer', 'bad', 'küche', 'flur', 'diele', 'keller', 'kellerraum', 'büro', 'arbeitszimmer', 'esszimmer', 'gästezimmer', 'garage', 'treppenhaus', 'dachgeschoss', 'dachzimmer', 'hobbyraum', 'spielzimmer', 'abstellraum', 'hauswirtschaftsraum', 'werkstatt']
    const nameAusTranskript = nameRaw === 'Raum'
      ? (raumTypen.find(t => transkriptLower.includes(t)) ?? nameRaw)
      : nameRaw
    // Ersten Buchstaben großschreiben
    const name = nameAusTranskript.charAt(0).toUpperCase() + nameAusTranskript.slice(1)

    // Garagen/Keller: kein Standard-Fenster — Tor/Tür wird separat behandelt.
    // Auch den (ggf. abgeleiteten) Raumnamen prüfen, nicht nur das Transkript.
    const nameKontext = baueVerstaendnis(name).kontext
    const istGarageRaum = kontext.istGarage || nameKontext.istGarage
    const istFassadeRaum = kontext.istFassade || nameKontext.istFassade || /fassade|au[sß]enwand/i.test(name)
    const istKellerRaum = kontext.istKeller || nameKontext.istKeller
    // "kein Fenster" / "ohne Fenster" → Standard-Fenster-Fallback unterdrücken
    const keinFenster = oeffnungen.keinFenster
    const keineTuer = oeffnungen.keineTuer
    const fensterGefiltert = (fenster as any[]).filter(Boolean)
    const tuerenGefiltert = (tueren as any[]).filter(Boolean)
    const effFenster = fensterGefiltert.length > 0 ? fensterGefiltert : (istGarageRaum || istKellerRaum || keinFenster) ? [] : [{ breite: 1.2, hoehe: 1.0, annahme: true }]
    const effTueren = tuerenGefiltert.length > 0 ? tuerenGefiltert : (istGarageRaum || keineTuer) ? [] : [{ breite: 0.9, hoehe: 2.1, annahme: true }]

    if (laenge && breite) {
      bodenflaecheM2 = round2(laenge * breite)
      umfangM = round2(2 * laenge + 2 * breite)
      // Deckenfläche = Bodenfläche — immer, unabhängig von Höhe
      deckenflaecheM2 = bodenflaecheM2

      if (hoehe) {
        const wandBrutto = round2(umfangM * hoehe)
        fensterAbzugVob = berechneOeffnungsabzugVob(effFenster, 1.2, 1.0)
        tuerAbzugVob = berechneOeffnungsabzugVob(effTueren, 0.9, 2.1)
        wandflaecheNettoM2 = round2(wandBrutto - fensterAbzugVob.abzugFlaeche - tuerAbzugVob.abzugFlaeche)
      }
    } else if (laenge && hoehe && !breite) {
      // Fassade / einzelne Wand: Breite × Höhe — kein Raum, nur Wandfläche
      const wandBrutto = round2(laenge * hoehe)
      fensterAbzugVob = berechneOeffnungsabzugVob(effFenster, 1.2, 1.0)
      tuerAbzugVob = berechneOeffnungsabzugVob(effTueren, 0.9, 2.1)
      wandflaecheNettoM2 = round2(wandBrutto - fensterAbzugVob.abzugFlaeche - tuerAbzugVob.abzugFlaeche)
      // Keine Decke, kein Boden, kein Umfang für Fassaden
    } else if (umfang_direkt && hoehe) {
      // Umfang direkt angegeben (Halle, Lagerhalle) — ohne L×B
      umfangM = round2(umfang_direkt)
      fensterAbzugVob = berechneOeffnungsabzugVob(effFenster, 1.2, 1.0)
      tuerAbzugVob = berechneOeffnungsabzugVob(effTueren, 0.9, 2.1)
      wandflaecheNettoM2 = round2(umfangM * hoehe - fensterAbzugVob.abzugFlaeche - tuerAbzugVob.abzugFlaeche)
      // Boden-/Deckenfläche unbekannt ohne L×B → Rückfrage kommt
    } else if (flaeche_angegeben) {
      // flaeche = immer Bodenfläche (GPT-Konvention). Nur bei Dachschräge/Fassade = Wandfläche.
      if (istDachschraege) {
        wandflaecheNettoM2 = flaeche_angegeben
      } else {
        bodenflaecheM2 = flaeche_angegeben
        deckenflaecheM2 = flaeche_angegeben
        if (hoehe) {
          // Nutzer nennt nur Bodenfläche + Höhe (typische Sprechweise: "20 qm, Decke 3 m hoch").
          // Umfang über Quadrat-Annahme schätzen: Seite = √Fläche → Umfang = 4·√Fläche.
          // Bei üblichen Raumproportionen (bis ~1:2) liegt der Fehler unter ~7 % — klar als Annahme markiert.
          umfangM = round2(4 * Math.sqrt(flaeche_angegeben))
          fensterAbzugVob = berechneOeffnungsabzugVob(effFenster, 1.2, 1.0)
          tuerAbzugVob = berechneOeffnungsabzugVob(effTueren, 0.9, 2.1)
          wandflaecheNettoM2 = Math.max(0, round2(umfangM * hoehe - fensterAbzugVob.abzugFlaeche - tuerAbzugVob.abzugFlaeche))
          annahmenUmfang.push(`Umfang aus Bodenfläche geschätzt (≈ quadratischer Raum, ${umfangM} lfm) — bei länglichem Raum bitte Maße prüfen`)
        }
        // Ohne Höhe: Wandfläche bleibt null (Rückfrage kommt)
      }
    }

    // Explizite Wandfläche/Deckfläche vom User überschreiben Engine-Berechnungen
    // (`!= null` statt `!== null`: GPT lässt Felder oft ganz weg → undefined, sonst NaN!)
    if (wandflaeche_direkt_raw != null) {
      const abzug = (wandflaeche_abzug_raw as number | null) ?? 0
      const brutto = round2((wandflaeche_direkt_raw as number) - abzug)
      // DC-040: Nur wenn der Handwerker ausdrücklich bestätigt hat, dass
      // Türen/Fenster in der genannten Fläche noch drinstecken, wird
      // abgezogen — und dann nach derselben VOB-Regel wie überall sonst
      // (Öffnungen bis 2,5 m² bleiben drin, PM-021). Ohne Antwort bleibt es
      // beim bisherigen Verhalten: genannte Fläche = zu streichende Fläche.
      if (wandflaeche_brutto_raw === true) {
        fensterAbzugVob = berechneOeffnungsabzugVob(effFenster, 1.2, 1.0)
        tuerAbzugVob = berechneOeffnungsabzugVob(effTueren, 0.9, 2.1)
        wandflaecheNettoM2 = Math.max(0, round2(brutto - fensterAbzugVob.abzugFlaeche - tuerAbzugVob.abzugFlaeche))
      } else {
        wandflaecheNettoM2 = brutto
      }
    }
    if (deckflaeche_direkt_raw != null) {
      deckenflaecheM2 = deckflaeche_direkt_raw as number
      // Bodenfläche ≈ Deckenfläche wenn nicht anders bekannt
      if (bodenflaecheM2 === null) bodenflaecheM2 = deckflaeche_direkt_raw as number
    }

    // Keine Maße: Engine überspringt den Raum (Rückfrage kommt aus rueckfragen-generator)
    // Leeres arbeiten[] = implizit "komplett streichen" (GPT hat Feld weggelassen)
    const leerOderKomplett = arbeiten.length === 0 || vRaum.istKomplett
    // Normalisierer deckt Flexionen ab ("gestrichen", "anmalen" …) — nur auf arbeiten[],
    // NICHT aufs Transkript (das gilt raumübergreifend und würde Signale in andere Räume streuen)
    const hatStreichen = leerOderKomplett || vRaum.hatArbeit('streichen')
    // Scope ("nur die Wände / Decke / Boden") zentral im Normalisierer — deckt
    // Flexionen, Einschränkungs-Synonyme und "ohne Decke" ab (siehe arbeiten-normalisierer).
    // Sowohl arbeiten[] als auch Transkript prüfen (GPT schreibt "nur X" selten in arbeiten[]).
    // In der strukturierten Arbeiten-Liste kann z.B. "tapezieren" neben
    // "Decke streichen" stehen. Daraus darf nicht "nur Decke" werden; eine
    // implizite Flächenbegrenzung ist nur im vollständigen Transkript sicher.
    const scopeArb = /\b(?:nur|bloß|lediglich|ausschließlich|ohne|keine?)\b/i.test(arbeitenStr)
      ? erkenneScope(arbeitenStr)
      : { nurWaende: false, nurDecke: false, nurBoden: false }
    // Globale Formulierungen wie „im Arbeitszimmer nur die Decke“ dürfen bei
    // mehreren Räumen nicht auf Wohnzimmer/Flur übertragen werden.
    const scopeTxtRoh = (daten.raeume?.length ?? 0) === 1
      ? vGesamt.scope
      : { nurWaende: false, nurDecke: false, nurBoden: false, quelle: 'keine' as const }

    // PM-026 (Sandys Live-Fund, 2026-08-30): Whisper hat „Wände zweimal
    // streichen" als „BÄNDE zweimal streichen" transkribiert. Die schwächste
    // Scope-Regel — „eine Fläche wurde genannt, die andere nicht" — fand im
    // Rohtext also kein Wandwort, wohl aber „Decke", und schloss daraus „nur
    // Decke". Ergebnis: „Wandflächen streichen" UND „Sockelleisten abkleben"
    // fielen aus dem fertigen Angebot, obwohl die strukturierte Extraktion
    // „wände streichen" sauber erkannt hatte. Ein Buchstabe im Transkript
    // löschte die Hauptposition.
    //
    // Deshalb: Eine Einschränkung, die NUR auf dem Nicht-Erwähnen beruht, darf
    // die strukturierte Erkennung nicht überstimmen. Ausdrückliche
    // Einschränkungen („nur die Decke", „ohne Decke", „die Wände lassen wir")
    // wiegen weiterhin schwerer als arbeiten[] — die hat der Handwerker so
    // gesagt, und genau darauf beruhen PM-001/PM-005.
    const arbeitenNenntWaende = /w[äa]nd/.test(arbeitenStr)
    const arbeitenNenntDecke = /(?<!ab)decke/.test(arbeitenStr)
    const nurErwaehnung = scopeTxtRoh.quelle === 'erwaehnung'
    const scopeTxt = {
      nurWaende: scopeTxtRoh.nurWaende && !(nurErwaehnung && arbeitenNenntDecke),
      nurDecke: scopeTxtRoh.nurDecke && !(nurErwaehnung && arbeitenNenntWaende),
      nurBoden: scopeTxtRoh.nurBoden && !(nurErwaehnung && (arbeitenNenntWaende || arbeitenNenntDecke)),
    }
    const nurWaende = scopeArb.nurWaende || scopeTxt.nurWaende
    const nurDecke = scopeArb.nurDecke || scopeTxt.nurDecke
    const nurBoden = scopeArb.nurBoden || scopeTxt.nurBoden
    // Akzentwand: "nur eine Wand tapezieren, Rest streichen" — eine Wand = min(laenge,breite) × hoehe
    const hatAkzentwandRaum = vGesamt.hatAkzentwand
      && /tapez|vliestapete|tapete/i.test(transkriptLower)
      && /rest|übrige|weiß|weiss/i.test(transkriptLower)
    // Boden streichen (Keller/Garage): NUR wenn explizit "boden streichen"/"boden anstrich" — nicht bei "boden abdecken"/"boden schützen"
    const hatBodenStreichen = nurBoden || arbeitenStr.includes('boden streich') || arbeitenStr.includes('boden anstrich')
      || transkriptLower.includes('boden streich') || transkriptLower.includes('boden anstrich')
      || ((istKellerRaum || istGarageRaum) && (transkriptLower.includes('boden streich') || transkriptLower.includes('boden anstrich')))
    const einzelraum = (daten.raeume?.length ?? 0) === 1
    // PM-017: GPT liefert "tapete aufziehen" (nicht "tapezieren") in
    // arbeiten[] — das reine "tapez"-Fragment hat das übersehen, wodurch
    // beim Tapezieren (ohne Anstrich) gar kein Wand-Signal erkannt wurde und
    // die komplette Wandfläche verlorenging. "tapete" jetzt zusätzlich als
    // eigenes Signal.
    const hatWandSignal = /wand|wände|waende|tapete|tapez|spachtel|grundier/.test(arbeitenStr)
      || (einzelraum && /(?:wand|wände|waende).{0,35}(?:streich|anstrich|maler)/.test(transkriptLower))
    // "Deckenhöhe drei zwanzig" ist eine Maßangabe, kein Arbeits-Signal — sonst
    // liest "decke.{0,35}streich" das "Decke" aus "Deckenhöhe" fälschlich als
    // "Decke wird gestrichen" (PM-003-Folgefund: sichtbar geworden, nachdem
    // erkenneScope() nicht mehr aus Versehen kompensiert hat).
    const transkriptOhneDeckenhoehe = transkriptLower.replace(/deckenh[öo]he\w*/g, ' ')
    // PM-017: "abdecken"/"abgedeckt" (Boden schützen/abdecken) enthält selbst
    // die Zeichenkette "decke" (ab-DECKE-n) — ohne die (?<!ab)-Ausnahme wurde
    // daraus fälschlich ein Signal für "Decke wird gestrichen", was wiederum
    // (über hatExpliziteFlaeche) das echte Wand-Signal blockieren konnte.
    // Gleiche Fehlerklasse wie schon in maler-basis.ts (istBodenSchutz).
    const hatDeckenSignal = /(?<!ab)decke/.test(arbeitenStr)
      || (einzelraum && /(?<!ab)decke.{0,35}(?:streich|anstrich|maler)|(?:streich|anstrich).{0,35}(?<!ab)decke/.test(transkriptOhneDeckenhoehe))
    const hatExpliziteFlaeche = hatWandSignal || hatDeckenSignal || /boden/.test(arbeitenStr)
    const anWaenden = !nurDecke && !nurBoden && (hatWandSignal || (!hatExpliziteFlaeche && hatStreichen))
    // Decke: nicht wenn explizit Boden gestrichen wird (Keller-Fall), nurWaende oder nurBoden
    const anDecke = !nurWaende && !nurBoden && !hatBodenStreichen && (hatDeckenSignal || (!hatExpliziteFlaeche && hatStreichen))
    const bodenStreichen = hatBodenStreichen && bodenflaecheM2 !== null
    // Boden schützen: immer wenn Wände ODER Decke gestrichen wird (Farbe tropft).
    //
    // Sandys Live-Fund (2026-08-30): Genau das stand hier schon als Kommentar —
    // die Bedingung darunter verlangte aber, dass der Handwerker "abdecken",
    // "Schutz" oder "Vlies" AUSSPRICHT. Kommentar und Code sagten also
    // Verschiedenes, und gemerkt hat es niemand, weil GPT die Nebenarbeiten
    // meistens von sich aus mitliefert. Bei "in der ganzen Wohnung 120 m²
    // streichen" tat es das nicht — und die Position fehlte im Angebot.
    const bodenSchutzGenannt = /schutz|abdeck|vlies/.test(arbeitenStr)
    const bodenSchutz = !bodenStreichen && (bodenSchutzGenannt || anWaenden || anDecke)
    // Sockelleisten abkleben: gehört bei Wandanstrich genauso zum Handwerk wie
    // das Abdecken des Bodens — auch das musste bisher ausgesprochen werden.
    // Nicht in Kellern (kein Sockelleisten-Standard im Keller).
    const sockelGenannt = sockel || arbeitenStr.includes('sockel')
      || arbeitenStr.includes('leiste') || arbeitenStr.includes('abkleben')
    const hatSockel = anWaenden && wandflaecheNettoM2 !== null && !istKellerRaum

    const fensterStandard = fenster.some((f: any) => (f.anzahl ?? 1) > 0 && (!f.breite || !f.hoehe))
    const annahmenFenster = fensterStandard ? ['Fensterfläche mit Standardmaß 1,20 × 1,00 m je Fenster angenommen — bitte prüfen'] : []

    const wandzonen = (raum.wandzonen ?? []) as Array<{zone: string, hoehe: number, farbe?: string, aktion?: string}>
    const effUmfangWZ = umfangM ?? (laenge && breite ? round2(2 * (laenge + breite)) : null)
    const hatWandzonen = wandzonen.length >= 2 && effUmfangWZ !== null

    if (hatWandzonen) {
      // Wandzonen-Branch: je Zone eigene Position
      let zoneStart = 0
      for (const zone of wandzonen) {
        const zoneEnd = round2(zoneStart + zone.hoehe)

        if (zone.aktion === 'abkleben') {
          positionen.push({
            beschreibung: `Holzvertäfelung / Wandbelag abkleben — ${name}`,
            menge: effUmfangWZ!, einheit: 'lfdm', konfidenz: 'high',
            berechnungsweg: `Umfang ${effUmfangWZ} lfm (Oberkante Zone ${zone.zone} bei ${zoneEnd}m)`, annahmen: [],
          })
          zoneStart = zoneEnd
          continue
        }

        // Fenster: nur abziehen wenn explizit dieser Zone zugeordnet (f.wandzone) ODER keine Zone gesetzt und keine andere Zone da
        const fensterInZone = effFenster.filter((f: any) => f.wandzone ? f.wandzone === zone.zone : true)
        // Vermeidung Doppelabzug: wenn wandzone annotiert, nur in der passenden Zone
        const fensterMitZone = effFenster.some((f: any) => f.wandzone)
        const fensterFl = round2(
          (fensterMitZone ? effFenster.filter((f: any) => f.wandzone === zone.zone) : fensterInZone).reduce(
            (s: number, f: any) => s + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0
          )
        )

        // Türen: Überschneidung mit Zone [zoneStart, zoneEnd]
        const tuerFl = round2(effTueren.reduce((s: number, t: any) => {
          const hoeT = t.hoehe ?? 2.1
          const overlap = Math.max(0, Math.min(zoneEnd, hoeT) - zoneStart)
          return s + (t.anzahl ?? 1) * (t.breite ?? 0.9) * overlap
        }, 0))

        const zoneFl = round2(effUmfangWZ! * zone.hoehe - fensterFl - tuerFl)
        const zoneLabel = zone.farbe ? `${zone.farbe} streichen` : `Wandzone ${zone.zone} streichen`
        positionen.push({
          beschreibung: `${zoneLabel} — ${name}`,
          menge: Math.max(0, zoneFl), einheit: 'm²', konfidenz: 'high',
          berechnungsweg: `${effUmfangWZ}m × ${zone.hoehe}m − Fenster ${fensterFl} m² − Türen ${tuerFl} m²`,
          annahmen: [],
        })
        zoneStart = zoneEnd
      }
      if (anDecke && deckenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Deckenfläche streichen — ${name}`, menge: deckenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${laenge} × ${breite}`, annahmen: [] })
      }
      if (bodenStreichen && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden streichen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenflaecheM2} m²`, annahmen: [] })
      }
      if (bodenSchutz && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden schützen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenflaecheM2} m²`, annahmen: [] })
      }
      if (hatSockel && effUmfangWZ !== null) {
        const tuerBreiten = effTueren.reduce((s: number, t: any) => s + (t.breite ?? 0.9), 0)
        positionen.push({ beschreibung: `Sockelleisten abkleben — ${name}`, menge: round2(effUmfangWZ - tuerBreiten), einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `Umfang ${effUmfangWZ} − Türen ${round2(tuerBreiten)}`, annahmen: [] })
      }
    } else if (istDachgeschoss) {
      // DG-Branch: Kniestockwände + Dachschrägen + Deckenspiegel separat
      const knH = kniestockhoehe as number | null
      if (knH && laenge && breite && anWaenden) {
        const kniestockM2 = round2(2 * (laenge + breite) * knH)
        positionen.push({
          beschreibung: `Kniestockwände streichen ${anstricheWand}x — ${name}`,
          menge: kniestockM2, einheit: 'm²', konfidenz: 'high',
          berechnungsweg: `Umfang ${round2(2*(laenge+breite))} lfm × ${knH} m = ${kniestockM2} m²`,
          annahmen: [],
        })
      }
      // Soll-Audit 2026-08-31 (PM-030): Der Dachgeschoss-Zweig kannte NUR die
      // seitenweisen Felder (links/rechts/je Seite). Sagt der Handwerker die
      // Schrägen als EINE Zahl („die Dachschrägen zusammen achtzehn
      // Quadratmeter"), landet sie in `dachschraege_flaeche_m2` — und dieses
      // Feld wurde hier nie gelesen. Ergebnis: gar keine Dachschrägen-Position,
      // obwohl die Fläche sauber erkannt war. Die Vollständigkeitsprüfung hat
      // die Lücke dann mit der Kniestockfläche „gefüllt", also mit einer
      // falschen Zahl. Beide Formulierungen führen jetzt zum selben Ergebnis.
      const dgGesamtM2 = (dgLinksM2 !== null || dgRechtsM2 !== null)
        ? round2((dgLinksM2 ?? 0) + (dgRechtsM2 ?? 0))
        : (dgUserFlaeche != null && dgUserFlaeche > 0 ? dgUserFlaeche : null)
      if (dgGesamtM2 !== null) {
        const brutto = dgGesamtM2
        // PM-007: bei "normale Größe" (keine Maße genannt) rät GPT selbst
        // eine Fenstergröße und markiert das ehrlich mit `annahme: true` —
        // dabei greift GPT auf sein generisches "normales Fenster" zurück
        // (1,20×1,00m, dasselbe wie bei Wandfenstern), nicht auf den kleineren,
        // für Dachfenster typischen Standard (0,78×1,18m), den unser eigener
        // Code extra dafür kennt. Weil GPT schon eine Zahl liefert, kam unser
        // eigener (passenderer) Standard nie zum Zug — zwei unabhängige
        // Annahmen, die sich widersprechen. Bei GPTs eigener Annahme gilt
        // deshalb jetzt UNSER Dachfenster-Standard; nur bei echten, vom Nutzer
        // genannten Maßen zählt GPTs Zahl.
        const dgFensterFl = round2(dgFenster.reduce((s: number, f: any) => {
          const breite = f.annahme ? 0.78 : (f.breite ?? 0.78)
          const hoehe = f.annahme ? 1.18 : (f.hoehe ?? 1.18)
          return s + (f.anzahl ?? 1) * breite * hoehe
        }, 0))
        const netto = round2(brutto - dgFensterFl)
        positionen.push({
          beschreibung: `Dachschrägen streichen ${anstriche}x — ${name}`,
          menge: Math.max(0, netto), einheit: 'm²', konfidenz: 'high',
          berechnungsweg: (() => {
            const basis = (dgLinksM2 !== null || dgRechtsM2 !== null)
              ? `Links ${dgLinksM2 ?? 0} m² + Rechts ${dgRechtsM2 ?? 0} m² = ${brutto} m²`
              : `Dachschrägenfläche ${brutto} m²`
            return dgFensterFl > 0 ? `${basis} − Dachfenster ${dgFensterFl} m²` : basis
          })(),
          annahmen: [],
        })
      }
      if ((dgDeckenspiegel as number | null) !== null && anDecke) {
        positionen.push({
          beschreibung: `Deckenspiegel streichen — ${name}`,
          menge: dgDeckenspiegel as number, einheit: 'm²', konfidenz: 'high',
          berechnungsweg: `Deckenspiegel ${dgDeckenspiegel} m²`, annahmen: [],
        })
      }
      if (bodenStreichen && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden streichen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenflaecheM2} m²`, annahmen: [] })
      }
      if (bodenSchutz && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden schützen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenflaecheM2} m²`, annahmen: [] })
      }
      // Sockelleisten am Kniestockumfang
      if (knH && laenge && breite && hatSockel) {
        const knUmfang = round2(2 * (laenge + breite))
        const sockelKnM = berechneSockelleistenLaenge(knUmfang, effTueren)
        positionen.push({
          beschreibung: `Sockelleisten abkleben — ${name}`,
          menge: sockelKnM, einheit: 'lfdm', konfidenz: 'high',
          berechnungsweg: `Kniestockumfang ${knUmfang} lfm − Türen ${round2(knUmfang - sockelKnM)} m`, annahmen: [],
        })
      }
    } else {
      // Normal-Branch: Wände + Decke + Boden
      if (anWaenden && wandflaecheNettoM2 !== null) {
        const fensterFlaeche2 = effFenster.reduce((s: number, f: any) => s + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0)
        const tuerFlaeche2 = effTueren.reduce((s: number, t: any) => s + (t.anzahl ?? 1) * (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0)
        if (hatAkzentwandRaum && laenge && breite && hoehe) {
          // PM-002: war Math.max, widersprach dem Kommentar oben ("min") UND
          // dem Annahme-Text ("Kürzere Raumseite") — Code war vom
          // dokumentierten Verhalten abgedriftet. Zurück auf min, damit
          // Kommentar, Text und Rechnung wieder dasselbe sagen.
          const akzentWandBreite = Math.min(laenge, breite)
          const akzentWandFlaeche = round2(akzentWandBreite * hoehe)
          const restwandFlaeche = round2(wandflaecheNettoM2 - akzentWandFlaeche)
          positionen.push({ beschreibung: `Akzentwand Vliestapete — ${name}`, menge: akzentWandFlaeche, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${akzentWandBreite} m × ${hoehe} m = ${akzentWandFlaeche} m²`, annahmen: ['Kürzere Raumseite als Akzentwand angenommen — bitte prüfen, welche Wand gemeint war'] })
          if (restwandFlaeche > 0) positionen.push({ beschreibung: `Restwände streichen — ${name}`, menge: restwandFlaeche, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gesamt ${wandflaecheNettoM2} m² − Akzentwand ${akzentWandFlaeche} m²`, annahmen: annahmenFenster })
        } else {
          // Trockenlauf PM-031 (2026-08-30): Eine Fassade kommt laut unserem
          // eigenen Prompt als RAUM an ("FASSADE IN RAEUME") — bekam hier aber
          // den Innenraum-Titel "Wandflächen streichen". Zwei Folgen: der
          // Preis-Matcher fand den Innenpreis statt des Fassadenpreises, und
          // die Fassaden-Vollständigkeitsregel erkannte die Position nicht als
          // vorhanden und setzte "Fassadenfarbe 2× Anstrich" NOCH EINMAL
          // obendrauf — dieselbe Fläche zweimal im Angebot.
          const wandLabel = istDachschraege
            // Trockenlauf 2026-08-30: Singular „Dachschräge streichen" fand
            // keinen Katalogpreis, der Eintrag heißt „Dachschrägen streichen"
            // (11 €/m²). Der Dachgeschoss-Zweig weiter unten benutzt längst
            // den Plural — jetzt beide gleich.
            ? `Dachschrägen streichen ${anstricheWand}x — ${name}`
            : istFassadeRaum
              ? `Fassadenfläche streichen ${anstricheWand}x — ${name}`
              : `Wandflächen streichen ${anstricheWand}x — ${name}`
          const wandBrutto2 = round2((umfangM ?? 0) * (hoehe ?? 0))
          const fensterAnzahl2 = effFenster.reduce((s: number, f: any) => s + (f.anzahl ?? 1), 0)
          const tuerAnzahl2 = effTueren.reduce((s: number, t: any) => s + (t.anzahl ?? 1), 0)
          const fensterEinzel2 = fensterAnzahl2 > 0 ? round2(fensterFlaeche2 / fensterAnzahl2) : 0
          const tuerEinzel2 = tuerAnzahl2 > 0 ? round2(tuerFlaeche2 / tuerAnzahl2) : 0
          // VOB-Übermessung: die Wandfläche oben wurde bereits mit dem
          // tatsächlichen (übermessungsbereinigten) Abzug berechnet
          // (fensterAbzugVob/tuerAbzugVob) — hier dieselben Zahlen für den
          // Anzeigetext wiederverwenden, sonst würde die Rechenweg-Anzeige
          // eine größere Fläche abziehen, als tatsächlich passiert ist.
          // Fällt nur bei Dachschräge/direkter Wandflächen-Angabe auf die
          // rohe Summe zurück (dort greift die VOB-Regel nicht, siehe oben).
          const fensterAbzugAnzeige = fensterAbzugVob?.abzugFlaeche ?? round2(fensterFlaeche2)
          const tuerAbzugAnzeige = tuerAbzugVob?.abzugFlaeche ?? round2(tuerFlaeche2)
          const vobHinweis = fensterAbzugVob && tuerAbzugVob ? vobHinweistext(fensterAbzugVob, tuerAbzugVob) : null
          positionen.push({
            beschreibung: wandLabel, menge: wandflaecheNettoM2, einheit: 'm²', konfidenz: annahmenUmfang.length > 0 ? 'medium' : 'high',
            berechnungsweg: istDachschraege ? `Dachschrägenfläche ${wandflaecheNettoM2} m²` : `Umfang ${umfangM ?? '?'} lfm × ${hoehe} m = ${wandBrutto2} m² − Fenster ${fensterAbzugAnzeige} m² − Türen ${tuerAbzugAnzeige} m² [${effTueren.map((t: any) => `${t.breite ?? 0.9}×${t.hoehe ?? 2.1}`).join(', ')}]`,
            annahmen: [...annahmenFenster, ...annahmenUmfang, ...anstrichAnnahmen, ...(vobHinweis ? [vobHinweis] : [])],
            ...(!istDachschraege && umfangM && hoehe ? {
              flaechen_parameter: {
                brutto_m2: wandBrutto2,
                fenster_anzahl: fensterAnzahl2,
                fenster_einzelflaeche: fensterEinzel2,
                tuer_anzahl: tuerAnzahl2,
                tuer_einzelflaeche: tuerEinzel2,
              }
            } : {}),
          })
        }
      }
      // Dachschrägen im selben Raum wie normale Wände: eigene Position mit eigener
      // Fläche — kapert NICHT die Wandfläche (siehe dachschraegeSeparat/dgUserFlaeche).
      if (dachschraegeSeparat && dgUserFlaeche != null && dgUserFlaeche > 0) {
        // Soll-Audit 2026-08-31: Dieser Zweig zog das Dachfenster nicht ab, der
        // Links/Rechts-Zweig weiter oben schon — dieselbe Leistung, zwei
        // Ergebnisse, je nachdem welches Feld die Extraktion gefüllt hat.
        // Jetzt beide gleich (unser Dachfenster-Standard 0,78 × 1,18 m, siehe
        // Kommentar oben).
        const dgFensterFlSep = round2(dgFenster.reduce((s: number, f: any) => {
          const breite = f.annahme ? 0.78 : (f.breite ?? 0.78)
          const hoehe = f.annahme ? 1.18 : (f.hoehe ?? 1.18)
          return s + (f.anzahl ?? 1) * breite * hoehe
        }, 0))
        const dgNettoSep = Math.max(0, round2(dgUserFlaeche - dgFensterFlSep))
        positionen.push({
          beschreibung: `Dachschrägen streichen ${anstriche}x — ${name}`,
          menge: dgNettoSep, einheit: 'm²', konfidenz: 'high',
          berechnungsweg: dgFensterFlSep > 0
            ? `Dachschrägenfläche ${dgUserFlaeche} m² − Dachfenster ${dgFensterFlSep} m²`
            : `Dachschrägenfläche ${dgUserFlaeche} m²`,
          annahmen: [...anstrichAnnahmen],
        })
      }
      if (anDecke && deckenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Deckenfläche streichen ${anstricheDecke}x — ${name}`, menge: deckenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: laenge && breite ? `Länge (${laenge}) × Breite (${breite})` : `Deckenfläche ${deckenflaecheM2} m² (= Bodenfläche)`, annahmen: [...anstrichAnnahmen] })
      }
      if (bodenStreichen && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden streichen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche = Länge × Breite`, annahmen: [] })
      }
      if (bodenSchutz && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden schützen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche = Länge × Breite`, annahmen: [], automatisch_ergaenzt: !bodenSchutzGenannt })
      }
      if (hatSockel && umfangM !== null) {
        const sockelM = berechneSockelleistenLaenge(umfangM, effTueren)
        positionen.push({ beschreibung: `Sockelleisten abkleben — ${name}`, menge: sockelM, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `Umfang (${umfangM} lfm) − Türbreiten (${round2(umfangM - sockelM)} m)`, annahmen: [], automatisch_ergaenzt: !sockelGenannt })
      }
    }
  }

  // Leibungen (Top-Level-Feld im GPT-Output — außerhalb der Raum-Schleife)
  const transkriptAll = (daten.transkript ?? '').toLowerCase()
  for (const l of ((daten.leibungen ?? []) as any[])) {
    const anz = l.anzahl ?? 1
    const br = l.breite ?? 1.2
    const hoe = l.hoehe ?? 1.0
    const tiefe = l.tiefe ?? 0.25
    const istAnnahme = !l.tiefe
    const leibungsUmfang = round2(2 * br + 2 * hoe)
    const flaecheM2 = round2(anz * leibungsUmfang * tiefe)
    const posTyp = (l.typ ?? '').includes('innen') ? 'Fenster Innenleibungen streichen'
      : l.typ === 'tuer' ? 'Türleibungen streichen'
      : 'Fensterleibungen streichen'
    positionen.push({
      beschreibung: posTyp,
      menge: flaecheM2, einheit: 'm²', konfidenz: 'high',
      berechnungsweg: `${anz} × (2×${br} + 2×${hoe}) × ${tiefe}m = ${anz} × ${leibungsUmfang} × ${tiefe} = ${flaecheM2} m²`,
      annahmen: istAnnahme ? ['Leibungstiefe 25cm Standard (nicht angegeben)'] : [],
    })
    // Fensterbänke bei Innenleibung + Erwähnung
    if ((l.typ ?? '').includes('innen') && transkriptAll.includes('fensterbank')) {
      const bankFl = round2(anz * br * tiefe)
      positionen.push({ beschreibung: 'Fensterbänke streichen', menge: bankFl, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${anz} × ${br}m × ${tiefe}m = ${bankFl} m²`, annahmen: [] })
    }
  }

  // Fassade: GPT legt Fassaden-Maße ins waende[]-Feld ab, weil eine Fassade
  // kein "Raum" ist (kein Boden, keine Decke). PM-008: das wurde bisher
  // komplett ignoriert — die Engine kannte nur raeume[], das bei einer
  // Fassade leer bleibt. Ergebnis: buchstäblich keine einzige Position,
  // "Keine Positionen erkannt", Nutzer blieb ohne Angebot stecken.
  // Behandlung wie ein Raum, nur ohne Boden/Decke: Wandfläche minus Fenster.
  for (const wand of ((daten.waende ?? []) as any[])) {
    const wLaenge = wand.laenge as number | null
    const wHoehe = wand.hoehe as number | null
    if (!wLaenge || !wHoehe) continue

    const wArbeiten = ((wand.arbeiten ?? []) as string[]).join(' ').toLowerCase()
    const wName = (wand.name as string | undefined)?.trim() || 'Fassade'

    const wFensterRoh = ((wand.fenster ?? []) as any[]).filter(Boolean)
    const wFensterAbzugVob = berechneOeffnungsabzugVob(wFensterRoh, 1.2, 1.0)
    const bruttoFlaeche = round2(wLaenge * wHoehe)
    const nettoFlaeche = Math.max(0, round2(bruttoFlaeche - wFensterAbzugVob.abzugFlaeche))
    const wVobHinweis = wFensterAbzugVob.uebermessenAnzahl > 0 ? vobHinweistext(wFensterAbzugVob, { uebermessenAnzahl: 0, uebermessenFlaeche: 0, abzugFlaeche: 0, rohFlaeche: 0 }) : null

    const wAnstrichText = `${wArbeiten} ${transkriptAll}`
    const wEinAnstrich = /(?:einmal|1\s*[x×]|ein(?:en)?\s+anstrich|eine\s+lage)/i.test(wAnstrichText)
    const wZweiAnstriche = /(?:zweimal|2\s*[x×]|zwei\s+anstrich|zwei\s+lagen|2-fach)/i.test(wAnstrichText)
    const wAnstriche = wEinAnstrich && !wZweiAnstriche ? 1 : 2
    const wAnstrichAnnahmen = wEinAnstrich || wZweiAnstriche
      ? []
      : ['Zweifacher Anstrich als Standard angenommen — bitte prüfen']

    positionen.push({
      beschreibung: `Fassadenfläche streichen ${wAnstriche}x — ${wName}`,
      menge: nettoFlaeche,
      einheit: 'm²',
      konfidenz: 'high',
      berechnungsweg: wFensterRoh.length > 0
        ? `${wLaenge}m × ${wHoehe}m − Fenster (${wFensterAbzugVob.abzugFlaeche} m²)`
        : `${wLaenge}m × ${wHoehe}m`,
      annahmen: [...wAnstrichAnnahmen, ...(wVobHinweis ? [wVobHinweis] : [])],
    })

    // Grundierung NUR aus der strukturierten arbeiten[]-Liste, nicht aus dem
    // Rohtext geraten — sonst würde ein ausdrücklicher Ausschluss ("ohne
    // Grundierung") von einer Text-Heuristik übersteuert (PM-003-Lehre).
    const wHatGrundierung = /grundier|voranstrich|tiefengrund/.test(wArbeiten)
    if (wHatGrundierung) {
      positionen.push({
        beschreibung: `Grundierung — ${wName}`,
        menge: nettoFlaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${nettoFlaeche} m²)`,
        annahmen: [],
      })
    }
  }

  // Sonderarbeiten — top-level fields, unabhängig von Räumen
  for (const s of ((daten.sonder ?? []) as any[])) {
    const m2 = s.m2 ?? null
    const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }
    switch (s.typ) {
      case 'schimmelbehandlung':
        positionen.push({ beschreibung: 'Schimmelbehandlung / Grundierung', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m² aus Transkript`, ...mk })
        break
      case 'kalkputz':
        positionen.push({ beschreibung: 'Kalkputz aufbringen', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'silikatfarbe':
        positionen.push({ beschreibung: 'Silikatfarbe auftragen (2×)', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'nikotinsperre':
        positionen.push({ beschreibung: 'Nikotinsperre auftragen', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'geruest':
        positionen.push({ beschreibung: 'Gerüst stellen (Pauschale)', menge: 1, einheit: 'Pauschale', berechnungsweg: 'Pauschale', ...mk })
        break
      case 'rissversschluss':
        positionen.push({ beschreibung: 'Rissverschluss mit Gewebe', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'heizkoerper':
        positionen.push({ beschreibung: 'Heizkörper schleifen und lackieren', menge: s.anzahl ?? 1, einheit: 'Stück', berechnungsweg: `${s.anzahl ?? 1} Stück`, ...mk })
        break
      case 'fussleisten':
        positionen.push({ beschreibung: 'Fußleisten schleifen und lackieren', menge: s.lfdm, einheit: 'lfdm', berechnungsweg: `${s.lfdm} lfdm`, ...mk })
        break
      case 'bautrockner':
        positionen.push({ beschreibung: 'Bautrockner aufstellen und betreiben', menge: s.tage, einheit: 'Tage', berechnungsweg: `${s.tage} Tage`, ...mk })
        break
      case 'antischimmel':
        positionen.push({ beschreibung: 'Anti-Schimmel-Anstrich', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'kalken':
        positionen.push({ beschreibung: 'Kalken / Weißkalkung', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'spachteltechnik':
        positionen.push({ beschreibung: 'Spachteltechnik (Betonoptik)', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'versiegelung_spachtel':
        positionen.push({ beschreibung: 'Versiegelung / Schutzanstrich', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'holzbalken': {
        const lfdm = round2((s.anzahl ?? 1) * (s.laenge_m ?? 1))
        positionen.push({ beschreibung: 'Holzbalken anschleifen', menge: lfdm, einheit: 'lfdm', berechnungsweg: `${s.anzahl} × ${s.laenge_m} m = ${lfdm} lfdm`, ...mk })
        positionen.push({ beschreibung: 'Lasur auftragen (transparent)', menge: lfdm, einheit: 'lfdm', berechnungsweg: `${lfdm} lfdm`, ...mk })
        break
      }
    }
  }

  for (const pos of positionen) {
    const wand = positionen.find(p => p.beschreibung.includes('Wandfläche'))
    const boden = positionen.find(p => p.beschreibung.includes('Boden'))
    if (wand && boden && wand.menge < boden.menge) {
      warnungen.push('Wandfläche kleiner als Bodenfläche — Raumhöhe prüfen!')
    }
    if (pos.menge > 500 && pos.einheit === 'm²') {
      warnungen.push(`${pos.beschreibung}: ${pos.menge} m² — ungewöhnlich groß, bitte prüfen`)
    }
    if (pos.menge <= 0) {
      warnungen.push(`${pos.beschreibung}: Menge 0 — Berechnung prüfen`)
    }
  }

  return {
    gewerk: 'maler',
    quelleText: daten.transkript ?? '',
    objekte: [],
    positionen,
    rueckfragen: [],
    warnungen,
    plausibel: warnungen.length === 0,
  }
}
