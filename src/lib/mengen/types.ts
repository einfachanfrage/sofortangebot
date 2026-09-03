export type Konfidenz = 'high' | 'medium' | 'low'

export type ObjektArt =
  | 'raum'
  | 'wand'
  | 'decke'
  | 'boden'
  | 'tuer'
  | 'fenster'
  | 'leitung'
  | 'rohr'
  | 'kabel'
  | 'geraet'
  | 'anschluss'
  | 'stueckzahl'
  | 'laufmeter'
  | 'flaeche'
  | 'volumen'
  | 'pauschale'
  | 'erschwerniss'

export interface MengenObjekt {
  id: string
  objektart: ObjektArt
  beschreibung: string
  masse: {
    laenge?: number
    breite?: number
    hoehe?: number
    flaeche?: number
    umfang?: number
    volumen?: number
    stueckzahl?: number
    laufmeter?: number
  }
  einheit: string
  menge: number | null
  berechnungsweg: string
  quelle: string
  konfidenz: Konfidenz
  annahmen: string[]
  fehlende_angaben: string[]
  rueckfragen: string[]
}

export interface FlaechenParameter {
  brutto_m2: number
  fenster_anzahl: number
  fenster_einzelflaeche: number
  tuer_anzahl: number
  tuer_einzelflaeche: number
}

export interface BerechnetePosition {
  beschreibung: string
  menge: number
  einheit: string
  konfidenz: Konfidenz
  berechnungsweg: string
  annahmen: string[]
  position_id_vorschlag?: string
  flaechen_parameter?: FlaechenParameter
  /**
   * DC-027 / CoS-017: true = diese Position hat das Tool selbst ergaenzt
   * (Vollstaendigkeits-Regeln), der Handwerker hat sie nicht gesagt.
   * Wird ZENTRAL in `pruefeUndErgaenzeVollstaendigkeit()` gesetzt, nicht an den
   * ~117 einzelnen `ergaenzt.push(...)`-Fundstellen.
   */
  automatisch_ergaenzt?: boolean
}

export interface MengenErgebnis {
  gewerk: string
  quelleText: string
  objekte: MengenObjekt[]
  positionen: BerechnetePosition[]
  rueckfragen: string[]
  warnungen: string[]
  plausibel: boolean
}

export type Vertrauensstufe = 'hoch' | 'mittel' | 'gering'

export interface KalkulationsBewertung {
  vertrauensstufe: Vertrauensstufe
  erkannte_angaben: string[]
  fehlende_angaben: string[]
  annahmen: string[]
  bewertungstext: string
  empfehlung: string[]
}

// Rückfrage aus KI-Extraktion (PROMPT_EXTRAKTION_V4)
export interface KIRueckfrage {
  id: string
  frage: string
  typ: 'hoehe' | 'anzahl' | 'masse_einzel' | 'ja_nein' | 'meter'
  betrifft: string
  prioritaet: number
  schnell_antworten: Array<{ label: string; wert: number | boolean | null }>
}

// Strukturierte Extraktion aus GPT-4o
export interface ExtrahierteDaten {
  gewerk: string
  confidence_gewerk: number
  kunde: {
    name: string | null
    adresse: string | null
    ort: string | null
  }
  situation?: string
  annahmen?: string[]
  rueckfragen?: KIRueckfrage[]
  raeume: Array<{
    name: string
    laenge: number | null
    breite: number | null
    hoehe: number | null
    flaeche: number | null
    umfang?: number | null
    fenster: Array<{ anzahl?: number; breite?: number; hoehe?: number; annahme?: boolean }>
    tueren: Array<{ anzahl?: number; breite?: number; hoehe?: number; annahme?: boolean }>
    arbeiten: string[]
    altbelag_vorhanden?: boolean
    altbelag_entfernen: boolean
    sockelleisten: boolean
    nassbereich: boolean
    vage?: boolean
    vage_typ?: string | null
    vage_beschreibung?: string | null
    wandflaeche_direkt?: number | null
    /**
     * DC-040: Antwort auf „sind die genannten m² inklusive Türen und
     * Fenster?". true = brutto, es wird noch abgezogen. false = der Wert ist
     * schon die zu streichende Fläche. undefined = nicht gefragt/übersprungen
     * → verhält sich wie bisher (kein Abzug).
     */
    wandflaeche_brutto?: boolean | null
    deckflaeche_direkt?: number | null
    wandflaeche_abzug_m2?: number | null
    dachschraege_flaeche_m2?: number | null
    // PM-007: Dachgeschoss/Kniestock/Dachschräge — siehe Fix-Kommentar in
    // extraktion-normalisierer.ts. Aktiviert `istDachgeschoss` in maler.ts.
    kniestockhoehe?: number | null
    dachschraege_links_m2?: number | null
    dachschraege_rechts_m2?: number | null
    dachschraege_je_seite_m2?: number | null
    deckenspiegel_m2?: number | null
    dachfenster?: Array<{ anzahl?: number; breite?: number; hoehe?: number; annahme?: boolean }>
    belag?: string
    verlegerichtung?: string
    ausgleich?: boolean
    feuchtigkeitssperre?: boolean
    parkett_schleifen?: boolean
    /**
     * PM-036: Nur ein Teil des Raums wird bearbeitet (Wasserschaden-Ecke,
     * Ausbesserung). Ist dieser Wert gesetzt, rechnet die Boden-Engine mit
     * ihm statt mit Länge × Breite — der Umfang (Sockelleisten) bleibt
     * weiterhin der des ganzen Raums. Siehe src/lib/teilflaeche.ts.
     */
    teilflaeche?: number | null
  }>
  waende: Array<{
    laenge: number | null
    hoehe: number | null
    beplankung: number
    daemmung: boolean
    // PM-008: Fassaden landen bei GPT hier (kein "Raum"), nicht in raeume[].
    // Vorher gingen fenster/arbeiten hier verloren — die Maler-Engine rechnet
    // ohne Fensterabzug faktisch nichts (leere raeume[] → "Keine Positionen").
    fenster?: Array<{ anzahl?: number; breite?: number; hoehe?: number; annahme?: boolean }>
    arbeiten?: string[]
    name?: string
  }>
  decken: Array<{
    laenge: number | null
    breite: number | null
    flaeche: number | null
  }>
  bereiche: Array<{
    name: string
    typ: string
    laenge: number | null
    breite: number | null
    hoehe: number | null
    flieshoehe: number | null
    flaeche: number | null
    nassbereich: boolean
    arbeiten: string[]
  }>
  steckdosen: number | null
  schalter: number | null
  spots: number | null
  aussenlampen: number | null
  wandlampen: number | null
  herdanschluss: boolean
  wallbox: boolean | number
  unterverteilung: boolean
  hauptverteilung: boolean
  kabelmeter: number | null
  neu_verkabeln: boolean
  wc: number | null
  waschtisch: number | null
  dusche: number | null
  wanne: number | null
  urinal: number | null
  bidet: number | null
  armaturen: number | null
  rohrmeter: number | null
  leitungen_erneuern: boolean
  heizkoerper: number | null
  austausch: boolean
  erneuerung: boolean
  altbelag: Array<{ bereich: string; flaeche: number | null }>
  erschwernisse: string[]
  anmerkungen: string | null
  fehlende_angaben: string[]
  transkript: string
}
