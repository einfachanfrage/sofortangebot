import type { ExtrahierteDaten } from '@/lib/mengen/types'

export interface KontextAnalyse {
  hinweise: string[]
  automatische_ergaenzungen: Array<{ raum: string; ergaenzung: string; grund: string }>
  extraktion_angereichert: ExtrahierteDaten
}

// Typ für KI-generierte Rückfragen (aus PROMPT_EXTRAKTION_V4)
export interface KIRueckfrageRaw {
  id: string
  frage: string
  typ: 'hoehe' | 'anzahl' | 'masse_einzel' | 'ja_nein' | 'meter'
  betrifft: string
  prioritaet: number
  schnell_antworten: Array<{ label: string; wert: number | boolean | null }>
}

type ExtMitExtra = ExtrahierteDaten & { situation?: string; rueckfragen?: KIRueckfrageRaw[] }

function getRueckfragen(ext: ExtMitExtra): KIRueckfrageRaw[] {
  return Array.isArray(ext.rueckfragen) ? ext.rueckfragen : []
}

function addRueckfrage(ext: ExtMitExtra, rq: KIRueckfrageRaw) {
  if (!Array.isArray(ext.rueckfragen)) ext.rueckfragen = []
  if (!ext.rueckfragen.some(r => r.id === rq.id)) {
    ext.rueckfragen.push(rq)
  }
}

function situationIncludes(ext: ExtMitExtra, ...begriffe: string[]): boolean {
  const text = (ext.situation ?? ext.anmerkungen ?? '').toLowerCase()
  return begriffe.some(b => text.includes(b))
}

// ── MALER ─────────────────────────────────────────────────────────────────────

function anreichernMaler(ext: ExtMitExtra, hinweise: string[], ergaenzungen: KontextAnalyse['automatische_ergaenzungen']) {
  for (const raum of ext.raeume) {
    // Generisches "streichen" → Wände + Decke
    if ((raum.arbeiten ?? []).some(a => a === 'streichen' || a === 'anstreichen') &&
        !raum.arbeiten.includes('waende_streichen') &&
        !raum.arbeiten.includes('decke_streichen')) {
      raum.arbeiten = raum.arbeiten.filter(a => a !== 'streichen' && a !== 'anstreichen')
      raum.arbeiten.push('waende_streichen', 'decke_streichen')
      hinweise.push(`${raum.name}: "Streichen" → Wände + Decke`)
    }

    // "Zimmer" / "Raum" ohne Spezifikation → Wände + Decke
    if (raum.arbeiten.length === 0 || raum.arbeiten.every(a => a === 'allgemein')) {
      raum.arbeiten = ['waende_streichen', 'decke_streichen']
      hinweise.push(`${raum.name}: Keine Spezifikation → Wände + Decke Standard`)
    }

    // Streichen ohne Abkleben → Abkleben ergänzen
    if ((raum.arbeiten.includes('waende_streichen') || raum.arbeiten.includes('decke_streichen') ||
         raum.arbeiten.includes('tapezieren')) &&
        !raum.arbeiten.includes('abkleben')) {
      raum.arbeiten.push('abkleben')
      ergaenzungen.push({ raum: raum.name, ergaenzung: 'Abdecken/Abkleben', grund: 'Bei Streicharbeiten immer nötig' })
    }

    const hatStreichen = raum.arbeiten.some(a => a.includes('streichen') || a.includes('wand'))
    const raumId = (raum.name ?? '').toLowerCase().replace(/\s+/g, '_')
    const hatLB = raum.laenge && raum.breite
    const hatFlaeche = raum.flaeche !== null && raum.flaeche !== undefined

    // Gar keine Maße → Rückfrage
    if (hatStreichen && !hatLB && !hatFlaeche && !(raum as any).wandflaeche_direkt) {
      addRueckfrage(ext, {
        id: `masse_${raumId}`,
        frage: `Wie groß ist "${raum.name}"? (Länge × Breite oder Fläche in m²)`,
        typ: 'masse_einzel',
        betrifft: raum.name,
        prioritaet: 0,
        schnell_antworten: [],
      })
    }

    // Nur Fläche, keine L×B → Wandfläche kann nicht berechnet werden
    const hatNurFlaeche = hatFlaeche && !hatLB && !(raum as any).wandflaeche_direkt
    if (hatStreichen && hatNurFlaeche) {
      addRueckfrage(ext, {
        id: `masse_lb_${raumId}`,
        frage: `Wie sind die Maße von "${raum.name}"? (Länge × Breite — für die Wandfläche)`,
        typ: 'masse_einzel',
        betrifft: raum.name,
        prioritaet: 0,
        schnell_antworten: [],
      })
    }

    // Höhe fehlt (L×B bekannt, aber keine Höhe) → Wandfläche nicht berechenbar
    if (hatStreichen && hatLB && !raum.hoehe && !(raum as any).wandflaeche_direkt) {
      addRueckfrage(ext, {
        id: `hoehe_${raumId}`,
        frage: `Wie hoch sind die Wände in "${raum.name}"?`,
        typ: 'hoehe',
        betrifft: raum.name,
        prioritaet: 0,
        schnell_antworten: [
          { label: '2,40 m', wert: 2.4 },
          { label: '2,60 m', wert: 2.6 },
          { label: '3,00 m', wert: 3.0 },
        ],
      })
    }

    // Tapete vorhanden aber Entfernen nicht explizit: Rückfrage
    if ((raum.altbelag_vorhanden || raum.arbeiten.includes('tapezieren')) &&
        !raum.altbelag_entfernen) {
      addRueckfrage(ext, {
        id: `tapete_entfernen_${( raum.name ?? "").toLowerCase().replace(/\s+/g, '_')}`,
        frage: `Muss die alte Tapete in "${raum.name}" vorher runter?`,
        typ: 'ja_nein',
        betrifft: raum.name,
        prioritaet: 1,
        schnell_antworten: [{ label: 'Ja, Tapete runter', wert: true }, { label: 'Nein, drüber', wert: false }],
      })
    }

    // Voranstrich bei Neuputz / frischem Putz
    if ((raum.arbeiten ?? []).some(a => a.includes('spachtel') || a.includes('neuputz') || a.includes('glätten')) &&
        !raum.arbeiten.includes('voranstrich')) {
      raum.arbeiten.push('voranstrich')
      ergaenzungen.push({ raum: raum.name, ergaenzung: 'Tiefengrund/Voranstrich', grund: 'Auf Spachtel/Neuputz immer nötig' })
    }

    // Fensterrahmen lackieren ohne Schutz der Scheiben
    if ((raum.arbeiten ?? []).some(a => a.includes('fenster') || a.includes('lackieren')) &&
        !raum.arbeiten.includes('abkleben')) {
      raum.arbeiten.push('abkleben')
      ergaenzungen.push({ raum: raum.name, ergaenzung: 'Abkleben Scheiben/Rahmen', grund: 'Vor Lackierarbeiten an Fenstern' })
    }
  }

  // Außenarbeiten: Fassade immer mit Gerüst-Frage
  const hatFassade = ext.raeume.some(r => r.arbeiten.some(a => a.includes('fassade') || a.includes('außen') || a.includes('aussen')))
  if (hatFassade && !getRueckfragen(ext).some(r => r.id === 'geruest')) {
    addRueckfrage(ext, {
      id: 'geruest',
      frage: 'Ist ein Gerüst vorhanden oder muss es gestellt werden?',
      typ: 'ja_nein',
      betrifft: 'Fassade',
      prioritaet: 2,
      schnell_antworten: [{ label: 'Gerüst vorhanden', wert: true }, { label: 'Gerüst nötig', wert: false }],
    })
  }
}

// ── FLIESEN ───────────────────────────────────────────────────────────────────

function anreichernFliesen(ext: ExtMitExtra, hinweise: string[], ergaenzungen: KontextAnalyse['automatische_ergaenzungen']) {
  const bereiche = (ext.bereiche.length > 0 ? ext.bereiche : ext.raeume) as Array<{
    name: string; nassbereich: boolean; arbeiten: string[]
    laenge: number | null; breite: number | null; hoehe?: number | null
  }>

  for (const bereich of bereiche) {
    const name = bereich.name?.toLowerCase() ?? ''

    // "Bad" ohne Spezifikation → Boden + Wände komplett
    if ((name.includes('bad') || name.includes('wc') || name.includes('dusche')) &&
        (bereich.arbeiten ?? []).some(a => a.includes('fliesen') || a.includes('verlegen') || a.includes('neu')) &&
        !bereich.arbeiten.includes('boden_fliesen') &&
        !bereich.arbeiten.includes('wand_fliesen')) {
      bereich.arbeiten.push('boden_fliesen', 'wand_fliesen')
      bereich.nassbereich = true
      hinweise.push(`${bereich.name}: Bad → Boden + Wände + Nassbereich`)
    }

    // Nassbereich → Abdichtung immer
    if (bereich.nassbereich && !bereich.arbeiten.includes('abdichtung')) {
      bereich.arbeiten.push('abdichtung')
      ergaenzungen.push({ raum: bereich.name, ergaenzung: 'Verbundabdichtung', grund: 'Nassbereich = Abdichtung Pflicht' })
    }

    // Bodengleiche Dusche → eigene teure Position
    if ((name.includes('dusche') || name.includes('duschen')) &&
        !bereich.arbeiten.includes('bodengleiche_dusche') &&
        !bereich.arbeiten.includes('duschtasse')) {
      bereich.arbeiten.push('bodengleiche_dusche')
      hinweise.push(`${bereich.name}: Dusche → bodengleiche Dusche als eigene Position`)
    }

    // "Komplett" / "erneuern" / "neu" → Altfliesen entfernen als Rückfrage
    if ((bereich.arbeiten ?? []).some(a => a.includes('komplett') || a.includes('erneuern') || a.includes('neu'))) {
      addRueckfrage(ext, {
        id: `altfliesen_${(bereich.name ?? "").toLowerCase().replace(/\s+/g, '_')}`,
        frage: `Müssen die alten Fliesen in "${bereich.name}" entfernt werden?`,
        typ: 'ja_nein',
        betrifft: bereich.name,
        prioritaet: 1,
        schnell_antworten: [{ label: 'Ja, raus', wert: true }, { label: 'Nein, drüber', wert: false }],
      })
    }

    // Wand_fliesen ohne Höhenangabe → Rückfrage
    if (bereich.arbeiten.includes('wand_fliesen') && !bereich.hoehe) {
      addRueckfrage(ext, {
        id: `flieshoehe_${(bereich.name ?? "").toLowerCase().replace(/\s+/g, '_')}`,
        frage: `Wie hoch sollen die Wandfliesen in "${bereich.name}" gehen?`,
        typ: 'hoehe',
        betrifft: bereich.name,
        prioritaet: 1,
        schnell_antworten: [
          { label: 'Bis 1,20 m', wert: 1.2 },
          { label: 'Bis 2,00 m', wert: 2.0 },
          { label: 'Raumhoch', wert: 2.6 },
        ],
      })
    }

    // Diagonal-Verlegung → Verschnitt 15% statt 10%
    if ((bereich.arbeiten ?? []).some(a => a.includes('diagonal'))) {
      hinweise.push(`${bereich.name}: Diagonalverlegung → 15% Verschnitt`)
    }

    // Silikon an Übergängen immer bei Nassbereich
    if (bereich.nassbereich && !bereich.arbeiten.includes('silikon')) {
      bereich.arbeiten.push('silikon')
      ergaenzungen.push({ raum: bereich.name, ergaenzung: 'Silikonfugen', grund: 'An Übergängen im Nassbereich immer nötig' })
    }
  }
}

// ── TROCKENBAU ────────────────────────────────────────────────────────────────

function anreichernTrockenbau(ext: ExtMitExtra, hinweise: string[], ergaenzungen: KontextAnalyse['automatische_ergaenzungen']) {
  for (const wand of ext.waende) {
    // Doppelte Beplankung prüfen — standard bei Ständerwänden
    if ((wand.beplankung ?? 0) < 2) {
      hinweise.push('Ständerwand: doppelte Beplankung prüfen (Standard)')
    }

    // Dämmung bei Ständerwänden ohne explizite Dämmung: Rückfrage
    if (!wand.daemmung) {
      addRueckfrage(ext, {
        id: 'daemmung_staenderwand',
        frage: 'Soll die Ständerwand gedämmt werden?',
        typ: 'ja_nein',
        betrifft: 'Ständerwand',
        prioritaet: 2,
        schnell_antworten: [{ label: 'Ja, dämmen', wert: true }, { label: 'Nein', wert: false }],
      })
    }
  }

  for (const decke of ext.decken) {
    // Decke ohne Fläche → Rückfrage
    if (!decke.flaeche && (!decke.laenge || !decke.breite)) {
      addRueckfrage(ext, {
        id: `decke_masse`,
        frage: 'Wie groß ist die abzuhängende Deckenfläche?',
        typ: 'masse_einzel',
        betrifft: 'Decke',
        prioritaet: 1,
        schnell_antworten: [
          { label: '10 m²', wert: 10 },
          { label: '20 m²', wert: 20 },
          { label: '30 m²', wert: 30 },
        ],
      })
    }
  }

  // Spachtel Q2 ist Standard — immer ergänzen wenn nicht vorhanden
  const hatSpachtel = ext.raeume.some(r => r.arbeiten.some(a => a.includes('spachtel'))) ||
                      ext.waende.length > 0 || ext.decken.length > 0
  if (hatSpachtel) {
    hinweise.push('Spachtelqualität Q2 wird als Standard angenommen')
  }

  // Brandschutz-Frage wenn Büro/Gewerbe erwähnt
  if (situationIncludes(ext, 'büro', 'gewerbe', 'brandschutz', 't30', 't60', 'gewerblich')) {
    addRueckfrage(ext, {
      id: 'brandschutz',
      frage: 'Sind Brandschutzanforderungen zu beachten (T30/T60)?',
      typ: 'ja_nein',
      betrifft: 'Brandschutz',
      prioritaet: 2,
      schnell_antworten: [{ label: 'Ja, T30', wert: true }, { label: 'Nein', wert: false }],
    })
  }

  // Keine Wände und keine Decken aber Trockenbau erwähnt → Rückfrage was genau
  if (ext.waende.length === 0 && ext.decken.length === 0 && ext.raeume.length === 0) {
    hinweise.push('Trockenbau ohne konkrete Wände/Decken — Rückfragen nach Maßen nötig')
  }
}

// ── BODEN / PARKETT ───────────────────────────────────────────────────────────

function anreichernBodenParkett(ext: ExtMitExtra, hinweise: string[], ergaenzungen: KontextAnalyse['automatische_ergaenzungen']) {
  for (const raum of ext.raeume) {
    // "Boden" ohne Spezifikation → Verlegen + Sockelleisten
    if ((raum.arbeiten ?? []).some(a => a.includes('boden') || a.includes('parkett') || a.includes('laminat') || a.includes('vinyl')) &&
        !raum.arbeiten.includes('sockelleisten')) {
      raum.arbeiten.push('sockelleisten')
      ergaenzungen.push({ raum: raum.name, ergaenzung: 'Sockelleisten', grund: 'Bei Bodenbelag immer mit erfassen' })
    }

    // Belag fehlt → Rückfrage welcher Belag
    const hatBodenArbeit = (raum.arbeiten ?? []).some(a =>
      a.includes('verlegen') || a.includes('parkett') || a.includes('laminat') || a.includes('vinyl') || a.includes('boden'))
    if (hatBodenArbeit && !(raum as any).belag) {
      addRueckfrage(ext, {
        id: `belag_${(raum.name ?? '').toLowerCase().replace(/\s+/g, '_')}`,
        frage: `Welcher Belag soll in "${raum.name}" verlegt werden?`,
        typ: 'ja_nein',
        betrifft: raum.name,
        prioritaet: 0,
        schnell_antworten: [
          { label: 'Laminat', wert: null },
          { label: 'Vinyl', wert: null },
          { label: 'Parkett', wert: null },
          { label: 'Teppich', wert: null },
        ],
      })
    }

    // Altbelag-Frage wenn nicht explizit
    if (!raum.altbelag_entfernen && (raum.arbeiten ?? []).some(a =>
        a.includes('verlegen') || a.includes('parkett') || a.includes('laminat') || a.includes('vinyl') || a.includes('boden'))) {
      addRueckfrage(ext, {
        id: `altbelag_${( raum.name ?? "").toLowerCase().replace(/\s+/g, '_')}`,
        frage: `Muss der alte Bodenbelag in "${raum.name}" entfernt werden?`,
        typ: 'ja_nein',
        betrifft: raum.name,
        prioritaet: 1,
        schnell_antworten: [{ label: 'Ja, raus', wert: true }, { label: 'Nein, bleibt', wert: false }],
      })
    }

    // Untergrundvorbereitung bei Fliesen→Parkett: immer nötig
    if ((raum.arbeiten ?? []).some(a => a.includes('parkett') || a.includes('laminat')) &&
        !raum.arbeiten.includes('untergrund')) {
      raum.arbeiten.push('untergrund')
      ergaenzungen.push({ raum: raum.name, ergaenzung: 'Untergrundvorbereitung', grund: 'Vor Parkett/Laminat immer prüfen' })
    }

    // Übergangsprofile bei mehreren Räumen
    if (ext.raeume.length > 1 && !raum.arbeiten.includes('uebergangsprofil')) {
      raum.arbeiten.push('uebergangsprofil')
      ergaenzungen.push({ raum: raum.name, ergaenzung: 'Übergangsprofile', grund: 'Bei mehreren Räumen an Übergängen' })
    }

    // Maße fehlen komplett → kritische Rückfrage
    if (!raum.flaeche && (!raum.laenge || !raum.breite)) {
      addRueckfrage(ext, {
        id: `masse_boden_${( raum.name ?? "").toLowerCase().replace(/\s+/g, '_')}`,
        frage: `Wie groß ist "${raum.name}"?`,
        typ: 'masse_einzel',
        betrifft: raum.name,
        prioritaet: 1,
        schnell_antworten: [
          { label: '10 m²', wert: 10 },
          { label: '20 m²', wert: 20 },
          { label: '30 m²', wert: 30 },
        ],
      })
    }
  }

  // Parkett schleifen + versiegeln: Versiegelung ergänzen
  for (const raum of ext.raeume) {
    if ((raum.arbeiten ?? []).some(a => a.includes('schleifen')) &&
        !raum.arbeiten.includes('versiegeln') &&
        !raum.arbeiten.includes('oelen')) {
      addRueckfrage(ext, {
        id: `versiegelung_${( raum.name ?? "").toLowerCase().replace(/\s+/g, '_')}`,
        frage: `Soll der Parkettboden in "${raum.name}" nach dem Schleifen geölt oder versiegelt werden?`,
        typ: 'ja_nein',
        betrifft: raum.name,
        prioritaet: 2,
        schnell_antworten: [{ label: 'Versiegeln', wert: true }, { label: 'Ölen', wert: false }],
      })
    }
  }
}

// ── SANITÄR / HEIZUNG ─────────────────────────────────────────────────────────

function anreichernSanitaer(ext: ExtMitExtra, hinweise: string[], ergaenzungen: KontextAnalyse['automatische_ergaenzungen']) {
  const isKomplett = situationIncludes(ext, 'komplett', 'erneuern', 'sanierung', 'sanieren', 'komplettsanierung')

  // Demontage bei Austausch automatisch
  if ((ext.austausch || ext.erneuerung || isKomplett) && !situationIncludes(ext, 'demontage')) {
    hinweise.push('Austausch/Erneuerung → Demontage der Altgeräte wird ergänzt')
    // Demontage wird in der Engine als eigene Position berechnet
  }

  // Wanne → Abdichtung und Silikon
  if ((ext.wanne ?? 0) > 0) {
    hinweise.push('Wanne → Silikon an Übergängen automatisch ergänzt')
  }

  // Dusche → bodengleich oder Duschtasse: Rückfrage
  if ((ext.dusche ?? 0) > 0 && !situationIncludes(ext, 'bodengleich', 'duschtasse', 'ebenerdige')) {
    addRueckfrage(ext, {
      id: 'dusche_typ',
      frage: 'Bodengleiche Dusche oder Duschtasse?',
      typ: 'ja_nein',
      betrifft: 'Dusche',
      prioritaet: 1,
      schnell_antworten: [{ label: 'Bodengleich', wert: true }, { label: 'Duschtasse', wert: false }],
    })
  }

  // Rohrmeter fehlen bei Komplettsanierung
  if (isKomplett && !ext.rohrmeter && !ext.leitungen_erneuern) {
    addRueckfrage(ext, {
      id: 'rohre_erneuern',
      frage: 'Sollen auch die Wasserleitungen erneuert werden?',
      typ: 'anzahl',
      betrifft: 'Rohrleitungen',
      prioritaet: 1,
      schnell_antworten: [
        { label: 'Ja, ca. 5m', wert: 5 },
        { label: 'Ja, ca. 10m', wert: 10 },
        { label: 'Ja, ca. 15m', wert: 15 },
        { label: 'Nein', wert: 0 },
      ],
    })
  }

  // Thermostatventile bei Heizkörpertausch
  if ((ext.heizkoerper ?? 0) > 0 || ext.austausch) {
    hinweise.push('Heizkörpertausch → Thermostatventile als eigene Positionen')
  }

  // Gasanschluss / Therme → Druckprüfung und Inbetriebnahme
  if (situationIncludes(ext, 'therme', 'heizung', 'gas', 'kessel', 'brennwert')) {
    hinweise.push('Therme/Heizung → Inbetriebnahme und Druckprüfung als Positionen')
    if (!situationIncludes(ext, 'inbetriebnahme')) {
      ergaenzungen.push({ raum: 'Heizung', ergaenzung: 'Inbetriebnahme', grund: 'Bei Thermentausch immer nötig' })
    }
  }

  // Keine Stückzahlen bei Komplett-Bad → Rückfrage was alles
  const keineObjekte = !ext.wc && !ext.waschtisch && !ext.dusche && !ext.wanne
  if (isKomplett && keineObjekte) {
    addRueckfrage(ext, {
      id: 'bad_ausstattung',
      frage: 'Was kommt ins Bad? (WC, Waschtisch, Dusche, Wanne)',
      typ: 'ja_nein',
      betrifft: 'Bad',
      prioritaet: 1,
      schnell_antworten: [
        { label: 'WC + Waschtisch + Dusche', wert: 1 },
        { label: 'WC + Waschtisch + Wanne', wert: 2 },
        { label: 'Komplett mit allem', wert: 3 },
      ],
    })
  }
}

// ── ELEKTRO ───────────────────────────────────────────────────────────────────

function anreichernElektro(ext: ExtMitExtra, hinweise: string[], ergaenzungen: KontextAnalyse['automatische_ergaenzungen']) {
  const steckdosen = ext.steckdosen ?? 0
  const schalter = ext.schalter ?? 0
  const spots = ext.spots ?? 0
  const isNeuverkabelung = ext.neu_verkabeln || situationIncludes(ext, 'neu verkabel', 'komplett', 'sanierung', 'vollständig')

  // Viele Steckdosen/Schalter ohne Kabelmeter → Rückfrage
  if ((steckdosen > 5 || schalter > 3) && !ext.kabelmeter) {
    addRueckfrage(ext, {
      id: 'kabel_meter',
      frage: 'Wie viele Meter Leitungen sollen verlegt werden?',
      typ: 'meter',
      betrifft: 'Kabelmeter',
      prioritaet: 2,
      schnell_antworten: [
        { label: 'ca. 20m', wert: 20 },
        { label: 'ca. 40m', wert: 40 },
        { label: 'ca. 60m', wert: 60 },
        { label: 'Pauschale', wert: 0 },
      ],
    })
  }

  // Neuverkabelung → Unterverteilung prüfen
  if (isNeuverkabelung && !ext.unterverteilung) {
    addRueckfrage(ext, {
      id: 'unterverteilung',
      frage: 'Muss die Unterverteilung erneuert oder erweitert werden?',
      typ: 'ja_nein',
      betrifft: 'Unterverteilung',
      prioritaet: 2,
      schnell_antworten: [{ label: 'Ja, erneuern', wert: true }, { label: 'Nein, bleibt', wert: false }],
    })
  }

  // Spots → Trafo prüfen (bei LED-Spots oft nötig)
  if (spots > 0) {
    hinweise.push(`${spots} Spots → Trafo/Netzteil als eigene Position prüfen`)
  }

  // Herdanschluss → 3-Phasen-Leitung nötig
  if (ext.herdanschluss) {
    hinweise.push('Herdanschluss → 3-Phasen-Leitung + CEE-Steckdose ergänzt')
    ergaenzungen.push({ raum: 'Küche', ergaenzung: '3-Phasen-Leitung Herd', grund: 'Herdanschluss benötigt eigene Zuleitung' })
  }

  // Wallbox → Zuleitung + Ladestation
  if (ext.wallbox) {
    hinweise.push('Wallbox → Zuleitung vom Zählerschrank + Ladestation als Positionen')
    if (!ext.kabelmeter) {
      addRueckfrage(ext, {
        id: 'wallbox_zuleitung',
        frage: 'Wie weit ist der Stellplatz vom Zählerschrank entfernt?',
        typ: 'meter',
        betrifft: 'Wallbox-Zuleitung',
        prioritaet: 1,
        schnell_antworten: [
          { label: 'ca. 10m', wert: 10 },
          { label: 'ca. 20m', wert: 20 },
          { label: 'ca. 40m', wert: 40 },
        ],
      })
    }
  }

  // UP vs. AP: wenn nicht angegeben, Standard UP
  if (steckdosen > 0 || schalter > 0) {
    hinweise.push('Unterputz (UP) wird als Standard angenommen — Aufputz (AP) wenn anders')
  }

  // Keine einzige Stückzahl → alles fehlt
  if (steckdosen === 0 && schalter === 0 && spots === 0 && !ext.herdanschluss && !ext.wallbox && !isNeuverkabelung) {
    addRueckfrage(ext, {
      id: 'elektro_umfang',
      frage: 'Was soll genau gemacht werden?',
      typ: 'ja_nein',
      betrifft: 'Elektro',
      prioritaet: 1,
      schnell_antworten: [
        { label: 'Steckdosen/Schalter', wert: 1 },
        { label: 'Beleuchtung', wert: 2 },
        { label: 'Neuverkabelung', wert: 3 },
      ],
    })
  }
}

// ── HAUPTFUNKTION ─────────────────────────────────────────────────────────────

export function analysiereKontext(extraktion: ExtrahierteDaten): KontextAnalyse {
  const hinweise: string[] = []
  const automatische_ergaenzungen: KontextAnalyse['automatische_ergaenzungen'] = []
  const ext = JSON.parse(JSON.stringify(extraktion)) as ExtMitExtra

  switch (ext.gewerk) {
    case 'maler':
      anreichernMaler(ext, hinweise, automatische_ergaenzungen)
      break
    case 'fliesen':
      anreichernFliesen(ext, hinweise, automatische_ergaenzungen)
      break
    case 'trockenbau':
      anreichernTrockenbau(ext, hinweise, automatische_ergaenzungen)
      break
    case 'boden_parkett':
      anreichernBodenParkett(ext, hinweise, automatische_ergaenzungen)
      break
    case 'sanitaer_heizung':
      anreichernSanitaer(ext, hinweise, automatische_ergaenzungen)
      break
    case 'elektro':
      anreichernElektro(ext, hinweise, automatische_ergaenzungen)
      break
  }

  return { hinweise, automatische_ergaenzungen, extraktion_angereichert: ext as ExtrahierteDaten }
}
