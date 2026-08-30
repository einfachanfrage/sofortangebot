import type { ExtrahierteDaten } from '@/lib/mengen/types'
import { extrahiereStreichflaeche } from '@/lib/extraktion-masse'
import { erkenneOeffnungen } from '@/lib/arbeiten-normalisierer'
import { BODEN_VERLEGEN_SIGNAL } from '@/lib/mengen/gewerke/boden'

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

/**
 * DC-040: „Wohnung", „Haus", „Etage" sind keine Räume, sondern eine ganze
 * Einheit in einem Eintrag — der Handwerker hat die Wohnung als Ganzes
 * aufgenommen statt Raum für Raum.
 *
 * Bewusst eng gehalten: Bei einem EINZELNEN Raum („im Flur sind es 18 m²
 * Wandfläche") gilt weiterhin die bestehende Festlegung, dass eine direkt
 * genannte Fläche schon die zu streichende ist — dort wird nicht gefragt.
 * Ob das auch für Einzelräume gelten soll, ist eine Produktentscheidung und
 * liegt bei Sandy, nicht bei diesem Ticket.
 */
function istGesamtflaechenRaum(name: string | null | undefined): boolean {
  return /\b(wohnung|haus|etage|geschoss|stockwerk)\b/i.test(name ?? '')
}

function situationIncludes(ext: ExtMitExtra, ...begriffe: string[]): boolean {
  const text = (ext.situation ?? ext.anmerkungen ?? '').toLowerCase()
  return begriffe.some(b => text.includes(b))
}

// ── MALER ─────────────────────────────────────────────────────────────────────

function anreichernMaler(ext: ExtMitExtra, hinweise: string[], ergaenzungen: KontextAnalyse['automatische_ergaenzungen']) {
  // PM-003: "kein Fenster im Flur" wurde hier nie mitgelesen — die Rückfrage
  // nach der Fensteranzahl kam trotzdem. maler.ts nutzt für die Berechnung
  // schon dasselbe Signal (erkenneOeffnungen); jetzt auch hier, statt einer
  // eigenen zweiten Text-Prüfung.
  const oeffnungen = erkenneOeffnungen(ext.transkript ?? '')

  for (const raum of ext.raeume) {
    // GPT legt eine ausdrücklich genannte Wandfläche gelegentlich im allgemeinen
    // Feld `flaeche` ab. Über den zum Raum gehörenden Transkriptabschnitt wird sie
    // eindeutig als Wandfläche eingeordnet, statt später L×B und Höhe zu erfragen.
    if (!raum.wandflaeche_direkt && raum.flaeche != null) {
      const text = (ext.transkript ?? '').toLocaleLowerCase('de-DE')
      const name = (raum.name ?? '').toLocaleLowerCase('de-DE')
      const start = name ? text.lastIndexOf(name) : -1
      if (start >= 0) {
        const naechsterRaum = ext.raeume
          .filter(r => r !== raum && r.name)
          .map(r => text.indexOf(r.name.toLocaleLowerCase('de-DE'), start + name.length))
          .filter(index => index > start)
          .sort((a, b) => a - b)[0]
        const abschnitt = text.slice(start, naechsterRaum ?? text.length)
        // DC-040-Nachtrag: Nicht nur das Wort "Wandfläche" zählt. Handwerker
        // sagen genauso oft "im Wohnzimmer müssen 35 m² gestrichen werden" —
        // die Zahl ist dann die zu streichende Fläche, nicht die Raumgröße.
        // Ohne diese Zeile rechnet die Engine daraus über die Quadrat-Annahme
        // eine Wandfläche und landet bei 61,5 m² statt 35 m².
        const streichflaeche = extrahiereStreichflaeche(abschnitt)
        if (/wandfl[äa]che/.test(abschnitt) || streichflaeche === raum.flaeche) {
          raum.wandflaeche_direkt = raum.flaeche
          raum.flaeche = null
        }
      }
    }

    // Generisches "streichen" → Wände + Decke
    if ((raum.arbeiten ?? []).some(a => a === 'streichen' || a === 'anstreichen') &&
        !raum.arbeiten.includes('waende_streichen') &&
        !raum.arbeiten.includes('decke_streichen')) {
      raum.arbeiten = raum.arbeiten.filter(a => a !== 'streichen' && a !== 'anstreichen')
      const transkript = (ext.transkript ?? '').toLocaleLowerCase('de-DE')
      const nurWaendeGenannt = /w[aä]nd/.test(transkript) && !/deck/.test(transkript)
      raum.arbeiten.push('waende_streichen')
      if (!nurWaendeGenannt) raum.arbeiten.push('decke_streichen')
      hinweise.push(`${raum.name}: "Streichen" → ${nurWaendeGenannt ? 'Wände' : 'Wände + Decke'}`)
    }

    // "Zimmer" / "Raum" ohne Spezifikation → Wände + Decke
    if (raum.arbeiten.length === 0 || raum.arbeiten.every(a => a === 'allgemein')) {
      const transkript = (ext.transkript ?? '').toLocaleLowerCase('de-DE')
      const nurWaendeGenannt = /w[aä]nd/.test(transkript) && !/deck/.test(transkript)
      raum.arbeiten = nurWaendeGenannt
        ? ['waende_streichen']
        : ['waende_streichen', 'decke_streichen']
      hinweise.push(`${raum.name}: Keine strukturierte Spezifikation → ${nurWaendeGenannt ? 'Wände aus Transkript' : 'Wände + Decke Standard'}`)
    }

    // Streichen ohne Abkleben → Abkleben ergänzen
    if ((raum.arbeiten.includes('waende_streichen') || raum.arbeiten.includes('decke_streichen') ||
         raum.arbeiten.includes('tapezieren')) &&
        !raum.arbeiten.includes('abkleben')) {
      raum.arbeiten.push('abkleben')
      ergaenzungen.push({ raum: raum.name, ergaenzung: 'Abdecken/Abkleben', grund: 'Bei Streicharbeiten immer nötig' })
    }

    // PM-007 (2026-08-24, Sandys Fund): Bei „Dachzimmer, fünf mal dreieinhalb"
    // liefert GPT laenge=5 und breite=3.5, lässt `flaeche` aber leer. Die
    // Rückfrage „Wie groß ist die Bodenfläche?" hing bisher allein an diesem
    // leeren Feld — gefragt wurde also nach einer Zahl, die einen Multiplikator
    // entfernt danebenstand (und die die Engine für „Boden schützen" ohnehin
    // selbst ausrechnet: 17,5 m²).
    //
    // Bewusst HIER, nach dem Wandflächen-Block oben: der verschiebt eine
    // ausdrücklich genannte Wandfläche aus `flaeche` heraus. Würden wir vorher
    // ableiten, würde er unsere abgeleitete BODENfläche für eine Wandfläche
    // halten.
    if ((raum.flaeche === null || raum.flaeche === undefined) && raum.laenge && raum.breite) {
      raum.flaeche = Math.round(raum.laenge * raum.breite * 100) / 100
      hinweise.push(`${raum.name}: Bodenfläche aus ${raum.laenge} × ${raum.breite} m abgeleitet (${raum.flaeche} m²) — keine Rückfrage nötig`)
    }

    const hatStreichen = raum.arbeiten.some(a => a.includes('streichen') || a.includes('wand'))
    const raumId = (raum.name ?? '').toLowerCase().replace(/\s+/g, '_')
    const hatLB = raum.laenge && raum.breite
    const hatFlaeche = raum.flaeche !== null && raum.flaeche !== undefined

    // Gar keine Maße → Rückfrage
    if (hatStreichen && !hatLB && !hatFlaeche && !raum.wandflaeche_direkt) {
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
    const hatNurFlaeche = hatFlaeche && !hatLB && !raum.wandflaeche_direkt
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

    // Höhe unabhängig von L×B direkt mit abfragen. So ist die Gesamtzahl aller
    // Rückfragen von Beginn an bekannt und es entsteht keine zweite Fragerunde.
    // PM-007 (2026-08-24): Im Dachgeschoss ist die Wandhöhe keine sinnvolle
    // Frage. Die Engine rechnet dort über Kniestockhöhe (× Umfang) und die
    // Dachschrägen-Quadratmeter — `raum.hoehe` wird im Dachgeschoss-Zweig von
    // `maler.ts` überhaupt nicht gelesen. Gefragt wurde also nach einer Zahl,
    // die anschließend niemand benutzt. Bedingung bewusst wortgleich zum
    // `istDachgeschoss` der Engine, damit beide nicht auseinanderlaufen.
    const istDachgeschossRaum =
      raum.kniestockhoehe != null
      || (raum.dachschraege_links_m2 ?? raum.dachschraege_je_seite_m2) != null
      || raum.deckenspiegel_m2 != null

    if (hatStreichen && !raum.hoehe && !raum.wandflaeche_direkt && !istDachgeschossRaum) {
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

    // DC-040 (Sandys Entscheidung 29.08.: „nachfragen statt raten"): Wer eine
    // Wandfläche direkt nennt („in der ganzen Wohnung 120 m²"), meint damit
    // mal die Brutto-Wandfläche und mal die tatsächlich zu streichende. Bisher
    // galt eine direkt genannte Fläche IMMER als fertig — bei einem
    // Handwerker, der die Wohnung als Ganzes aufnimmt, ist das eine stille
    // Annahme über bares Geld. Also einmal kurz fragen, statt zu raten.
    // Hat er den Abzug selbst genannt („minus 5 m²"), ist die Frage
    // beantwortet und entfällt.
    if (hatStreichen && istGesamtflaechenRaum(raum.name) && raum.wandflaeche_direkt
        && raum.wandflaeche_brutto == null && raum.wandflaeche_abzug_m2 == null) {
      const flaecheText = String(raum.wandflaeche_direkt).replace('.', ',')
      addRueckfrage(ext, {
        id: `oeffnungen_brutto_${raumId}`,
        frage: `Sind die ${flaecheText} m² Wandfläche in "${raum.name}" inklusive Türen und Fenster?`,
        typ: 'ja_nein', betrifft: raum.name, prioritaet: 1,
        schnell_antworten: [
          { label: 'Ja, sind noch drin', wert: true },
          { label: 'Nein, schon abgezogen', wert: false },
        ],
      })
    }

    // Auch Öffnungen direkt mit abfragen, nicht erst nach der Geometrie.
    // DC-040: zusätzlich, wenn eine direkt genannte Wandfläche als BRUTTO
    // bestätigt wurde — dann brauchen wir die Stückzahlen für den Abzug.
    if (hatStreichen && (!raum.wandflaeche_direkt || raum.wandflaeche_brutto === true)) {
      if (!oeffnungen.keineTuer && (!Array.isArray(raum.tueren) || raum.tueren.length === 0)) {
        addRueckfrage(ext, {
          id: `tueren_anzahl_${raumId}`,
          frage: `Wie viele Türen hat "${raum.name}"?`,
          typ: 'anzahl', betrifft: raum.name, prioritaet: 1,
          schnell_antworten: [0, 1, 2, 3, 4, 5, 6].map(wert => ({ label: String(wert), wert })),
        })
      }
      if (!oeffnungen.keinFenster && (!Array.isArray(raum.fenster) || raum.fenster.length === 0)) {
        addRueckfrage(ext, {
          id: `fenster_anzahl_${raumId}`,
          frage: `Wie viele Fenster hat "${raum.name}"?`,
          typ: 'anzahl', betrifft: raum.name, prioritaet: 1,
          schnell_antworten: [0, 1, 2, 3, 4, 5, 6].map(wert => ({ label: String(wert), wert })),
        })
      }
    }

    // Bei direkt genannter Wandfläche sind Türen/Fenster bereits in der Menge
    // enthalten. Für den Bodenschutz fehlt aber weiterhin die Bodenfläche.
    if (hatStreichen && raum.wandflaeche_direkt && !hatFlaeche) {
      addRueckfrage(ext, {
        id: `masse_boden_${raumId}`,
        frage: `Wie groß ist die Bodenfläche in "${raum.name}"?`,
        typ: 'masse_einzel', betrifft: raum.name, prioritaet: 1,
        schnell_antworten: [],
      })
    }

    // Dachschrägen im selben Raum wie Wände (z.B. Treppenhaus mit Dachschräge):
    // eigene Fläche erfragen — sonst würden Schrägen die Wandfläche kapern.
    const hatDachschraege = (raum.arbeiten ?? []).some(a => /dachschr/i.test(a))
    if (hatStreichen && hatDachschraege && raum.dachschraege_flaeche_m2 == null) {
      addRueckfrage(ext, {
        id: `dachschraege_flaeche_${raumId}`,
        frage: `Wie groß ist die Dachschrägenfläche in "${raum.name}"? (in m²)`,
        typ: 'anzahl',
        betrifft: raum.name,
        prioritaet: 1,
        schnell_antworten: [],
      })
    }

    // Tapete vorhanden aber Entfernen nicht explizit: Rückfrage
    //
    // PM-013, Nachtest 3 (2026-08-21): echter Live-Fund. `altbelag_vorhanden`
    // ist ein generisches "alter Belag da"-Flag, das GPT für BEIDE Gewerke
    // setzt — bei Boden-Räumen heißt es "alte Bodenbelag vorhanden", bei
    // Maler-Räumen "alte Tapete vorhanden". Diese Prüfung nahm es bisher
    // IMMER als Tapete-Signal, unabhängig davon, ob der Raum überhaupt etwas
    // mit Malerarbeiten zu tun hat — bei einem reinen Boden-Raum (Wohnzimmer:
    // "Eichenparkett... Boden nur, an den Wänden machen wir nix",
    // `altbelag_vorhanden: true` wegen des alten Parketts) entstand dadurch
    // die fachlich falsche Rückfrage "Muss die alte Tapete... vorher runter?"
    // für einen Raum ohne jede Wandarbeit. Fix: denselben `hatStreichen`-Gate
    // wie alle anderen Maler-Rückfragen in dieser Schleife verlangen (Türen/
    // Fenster/Höhe oben) — ein Raum ohne Streich-/Wandbezug ist kein
    // Tapete-Kandidat, egal was `altbelag_vorhanden` sagt.
    if (hatStreichen && (raum.altbelag_vorhanden || raum.arbeiten.includes('tapezieren')) &&
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

function anreichernTrockenbau(ext: ExtMitExtra, hinweise: string[]) {
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

// PM-013 (2026-08-19): der lose Substring-Check `a.includes('boden')` fing
// auch reine Schutz-/Nebenleistungen wie "Boden abdecken" (normale Maler-
// Vorbereitung beim Streichen, siehe Ist-Ergebnis Flur — dort korrekt als
// eigene Maler-Position "Boden schützen" berechnet, siehe maler.ts) — nicht
// nur echte Verlege-Aufträge. Bestätigt an echten Produktions-Rohdaten
// (debug_extraktion_roh e7d71649-...): Flurs `arbeiten` enthielt u.a.
// "boden abdecken" und "sockelleisten abkleben" (beides Maler-Nebenleistung),
// KEIN einziges echtes Verlege-Signal — trotzdem hat diese Funktion den Flur
// wie einen Boden-Raum behandelt und ihm zwei Boden-Rückfragen gestellt
// ("Welcher Belag...", "Muss der alte Bodenbelag...entfernt werden?"),
// obwohl im selben Satz ausdrücklich "da wird nix am Boden gemacht" stand.
// Grund: diese Funktion läuft schon dann über JEDEN Raum der Anfrage, wenn
// nur das GLOBALE ext.gewerk (ein einzelnes Feld pro Auftrag) 'boden_parkett'
// ist — bei Mehrgewerk-Anfragen (ein Raum nur Boden, ein anderer nur Maler,
// wie hier) fehlte jede Prüfung, ob der einzelne Raum das überhaupt betrifft.
// Fix: dieselbe, bereits bewährte Verlege-Signal-Erkennung wie in boden.ts
// (BODEN_VERLEGEN_SIGNAL, von dort importiert statt hier zweimal gepflegt) —
// verlangt ein echtes Verlege-/Belag-Wort statt bloß "boden" irgendwo im
// Satz — plus ein früher Skip für Räume ohne dieses Signal, damit KEINE der
// Regeln unten (Rückfragen UND stille Ergänzungen wie Sockelleisten/
// Übergangsprofil) versehentlich auf einen reinen Maler-Raum wirkt.

function anreichernBodenParkett(ext: ExtMitExtra, hinweise: string[], ergaenzungen: KontextAnalyse['automatische_ergaenzungen']) {
  const bodenRaeume = ext.raeume.filter(r => (r.arbeiten ?? []).some(a => BODEN_VERLEGEN_SIGNAL.test(a)))

  for (const raum of ext.raeume) {
    const hatBodenArbeit = (raum.arbeiten ?? []).some(a => BODEN_VERLEGEN_SIGNAL.test(a))
    // Raum ohne echtes Boden-Signal (z.B. reiner Maler-Raum, der nur "Boden
    // abdecken" als Nebenleistung erwähnt) betrifft dieses Gewerk gar nicht —
    // komplett überspringen, statt einzelne Regeln unten einzeln abzusichern.
    if (!hatBodenArbeit) continue

    // "Boden" ohne Spezifikation → Verlegen + Sockelleisten
    if (!raum.arbeiten.includes('sockelleisten')) {
      raum.arbeiten.push('sockelleisten')
      ergaenzungen.push({ raum: raum.name, ergaenzung: 'Sockelleisten', grund: 'Bei Bodenbelag immer mit erfassen' })
    }

    // Belag fehlt → Rückfrage welcher Belag (wert 1-4 = Laminat/Vinyl/Parkett/Teppich)
    if (!raum.belag) {
      addRueckfrage(ext, {
        id: `belag_${(raum.name ?? '').toLowerCase().replace(/\s+/g, '_')}`,
        frage: `Welcher Belag soll in "${raum.name}" verlegt werden?`,
        typ: 'ja_nein',
        betrifft: raum.name,
        prioritaet: 0,
        schnell_antworten: [
          { label: 'Laminat', wert: 1 },
          { label: 'Vinyl', wert: 2 },
          { label: 'Parkett', wert: 3 },
          { label: 'Teppich', wert: 4 },
        ],
      })
    }

    // Altbelag-Frage wenn nicht explizit
    if (!raum.altbelag_entfernen) {
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

    // Übergangsprofile bei mehreren Räumen — "mehrere" meint hier echte
    // Boden-Räume (nicht die Gesamt-Raumzahl der Anfrage, siehe PM-013: bei
    // 1 Boden-Raum + 1 Maler-Raum gibt es keinen zweiten Boden-Übergang).
    if (bodenRaeume.length > 1 && !raum.arbeiten.includes('uebergangsprofil')) {
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
    const hatParkettSchleifen = (raum.arbeiten ?? []).some(arbeit =>
      /(?:parkett|dielen?|holzboden).*(?:ab)?schleif|(?:ab)?schleif.*(?:parkett|dielen?|holzboden)/i.test(arbeit)
    )
    if (hatParkettSchleifen &&
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

// ── Systemischer Fund Punkt 6 / PM-019 + PM-020 ───────────────────────────
// Whisper verschluckt beim Muster „[Zahlwort] mal [Zahl]" die erste
// Maßangabe: aus „zwei mal eins fünfzig" wird „zweimal 1,50", aus „drei mal
// drei sechzig" wird „dreimal 360". GPT macht daraus einen quadratischen Raum
// (Länge = Breite) — und eine falsche Fläche läuft unbemerkt ins Angebot.
// Zweimal unabhängig live bestätigt (Gästeklo 1,50×1,50 statt 2,00×1,50;
// Kinderzimmer 3,60×3,60 statt 3,00×3,60). Sandys Ansage dazu (2026-08-25):
// „die maße müssen natürlich stimmen!!!"
//
// Die verlorene Zahl steht nicht mehr im Text — es gibt keinen Fix, der sie
// zurückholt. Der einzige ehrliche Weg zu „die Fläche stimmt immer" ist eine
// Rückfrage. Damit sie NUR im Verdachtsfall kommt und einen echt
// quadratischen Raum nicht nervt, müssen zwei Dinge zusammentreffen:
//   1. Der Raum ist exakt quadratisch (Länge = Breite).
//   2. Im Transkript steht das verräterische zusammengeschriebene Muster
//      „<Zahlwort>mal <Ziffer>" — genau das, was Whisper aus zwei getrennten
//      Maßen macht. „Wände streichen zweimal" löst nichts aus, weil danach
//      keine Ziffer folgt.
// Die Frage nennt beide Lesarten, damit der Handwerker nicht raten muss,
// worum es geht.
const ZAHLWORTE_MAL: Record<string, number> = {
  zwei: 2, drei: 3, vier: 4, fünf: 5, fuenf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10,
}
const ZAHLWORT_MAL_ZIFFER = new RegExp(`\\b(${Object.keys(ZAHLWORTE_MAL).join('|')})mal\\s+(\\d+(?:[.,]\\d+)?)`, 'i')

function meterText(wert: number): string {
  return wert.toFixed(2).replace('.', ',')
}

function verdaechtigesMasseMuster(transkript: string, raumName: string, raumAnzahl: number): RegExpMatchArray | null {
  const text = transkript ?? ''
  if (!text.trim()) return null
  const name = (raumName ?? '').trim().toLocaleLowerCase('de-DE')
  if (name) {
    const satz = text.split(/[.!?;\n]+/).find(s => s.toLocaleLowerCase('de-DE').includes(name))
    if (satz) {
      const treffer = satz.match(ZAHLWORT_MAL_ZIFFER)
      if (treffer) return treffer
    }
  }
  // Ohne Satzbezug nur bei einem einzigen Raum — sonst wäre die Zuordnung geraten.
  return raumAnzahl === 1 ? text.match(ZAHLWORT_MAL_ZIFFER) : null
}

function pruefeQuadratVerdacht(ext: ExtMitExtra): void {
  const raeume = ext.raeume ?? []
  for (const raum of raeume) {
    const laenge = raum.laenge
    const breite = raum.breite
    if (!laenge || !breite || Math.abs(laenge - breite) > 0.001) continue

    const treffer = verdaechtigesMasseMuster(ext.transkript ?? '', raum.name ?? '', raeume.length)
    if (!treffer) continue

    const verlorene = ZAHLWORTE_MAL[treffer[1].toLocaleLowerCase('de-DE')]
    const raumId = (raum.name ?? '').toLowerCase().replace(/\s+/g, '_')
    const vermutet = verlorene && verlorene !== laenge
      ? ` Im Gesagten stand „${treffer[0]}" — war es vielleicht ${meterText(verlorene)} × ${meterText(breite)} m?`
      : ''

    addRueckfrage(ext, {
      id: `masse_${raumId}`,
      frage: `Ich habe „${raum.name}" als ${meterText(laenge)} × ${meterText(breite)} m verstanden — stimmt das?${vermutet}`,
      typ: 'masse_einzel',
      betrifft: raum.name,
      prioritaet: 0,
      schnell_antworten: [],
    })
  }
}

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
      anreichernTrockenbau(ext, hinweise)
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

  // Gewerk-unabhängig: der Whisper-Quadrat-Verdacht trifft Maler wie Boden
  // gleichermaßen (PM-019 war Maler, PM-020 Bodenleger).
  pruefeQuadratVerdacht(ext)

  return { hinweise, automatische_ergaenzungen, extraktion_angereichert: ext as ExtrahierteDaten }
}
