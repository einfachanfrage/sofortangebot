import type { BerechnetePosition } from '../mengen/types'
import { hat, add, filtereArray, istWandStreichen, istDeckeStreichen } from './helpers'
import { saetze } from '../satz-raum'
import { mitTitelZusatz } from '../positions-titel'

// Schimmel → Schimmelbehandlung + Sperranstrich (additiv)
export function pruefeSchimmel(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): boolean {
  const hatSchimmel = lower.includes('schimmel') || lower.includes('schimmelbehandl')
  if (!hatSchimmel || hat(ergaenzt, 'schimmelbehandlung', 'schimmel behandl')) return hatSchimmel

  const schimmelMatch = lower.match(/schimmel[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
    ?? lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?]*?schimmel/i)
  const schimmelM2 = schimmelMatch ? parseFloat(schimmelMatch[1].replace(',', '.')) : null
  if (schimmelM2 && schimmelM2 > 0) {
    ergaenzt.unshift({ beschreibung: 'Schimmelbehandlung', menge: schimmelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${schimmelM2} m² aus Transkript (Schimmelbereich)`, annahmen: [] })
    // ── F.2 #3 / F.3 (Prüfmeister, 12.09.2026) ──────────────────────────
    //
    // Zwei Engine-Titel („Sperranstrich / Flecken sperren", „Sperranstrich
    // nach Schimmelbehandlung") meinen dieselbe Arbeit und fanden beide
    // GAR NICHTS — 0,00 € im Angebot, obwohl der Katalog die Zeile für
    // 9,00 €/m² führt.
    //
    // Sein Vorschlag war `Isoliergrund auftragen (Nikotin / Ruß /
    // Wasserflecken / Schimmel)`. Gemessen: Der Titel findet **auch nichts**.
    // Grund ist die Aufwandswort-Regel von heute Morgen — „Schimmel" im
    // gesuchten Titel, keiner in der Katalogzeile, also harte Sperre. Die
    // Regel hat recht: Der Titel würde Arbeit am Schimmel versprechen, die
    // diese Zeile nicht bepreist. Die Behandlung selbst steht ja als eigene
    // Position darüber.
    //
    // Deshalb der Katalogtitel wörtlich, und der Anlass in den Rechenweg —
    // der steht auch auf dem Kundendokument, die Annahmen nicht (CoS-E-002).
    ergaenzt.push({ beschreibung: 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken', menge: schimmelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${schimmelM2} m² Schimmelbereich, Sperranstrich nach der Behandlung`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Schimmelbehandlung')
    add(ergaenzt, fehlende, 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken (nach Schimmelbehandlung)')
  }
  return hatSchimmel
}

// ══════════════════════════════════════════════════════════════════════════
// Sperrgrund / Isoliergrund — CoS-E-059, Eingriff 3 (15.09.2026)
// ══════════════════════════════════════════════════════════════════════════
//
// Vorher: Jedes Wort mit dem Stamm „sperr" warf die vorhandene Decken-
// position weg und baute drei neue Zeilen auf der Deckenfläche —
// Isoliergrund, Tiefengrund und eine neu angelegte Decke. Eine Ursache,
// vier Wirkungen (PM-046-A/B/C/D/E, PM-064-A/B/C).
//
// Die Fläche folgt jetzt der URSACHE, nicht dem Auslösewort. So hat der
// Prüfmeister K.1 beantwortet, und genau so steht es hier:
//
//   Wasserfleck / Fleck / „schlägt von oben durch"  → Decke
//   Nikotin / Ruß / Rauch / „verraucht" / „gelb"    → Wand UND Decke
//   eine im Auslösersatz genannte Fläche            → die genannte,
//                                                     schlägt alles
//   nichts davon, bloß „Sperrgrund"                 → KEINE bepreiste
//                                                     Zeile, Rückfrage
//
// Der Nikotin-Fall ist Wand und Decke, und das ist keine Vorsicht: Rauch
// steigt, die Decke ist die am stärksten belastete Fläche im Raum. Wer nur
// die Wände sperrt, hat nach ein paar Wochen gelbe Schatten an der Decke —
// und steht in der Gewährleistung. Der letzte Fall ist Regel H Satz 3
// (Sandy, 12.09.): nicht gesagt → keine bepreiste Zeile. Er ist ausdrücklich
// NICHT „dann eben die Decke"; dass bisher still die Decke galt, war die
// Herkunft der Regel aus ihrem ersten Fall (Wasserflecken an der Decke) und
// kein Fachurteil.
//
// Drei Dinge, die dazugehören und ohne die die Antwort nur halb wäre:
//
// 1. **Der Auslöser hängt am Wort, nicht am Wortstamm** (PM-064). „Sperrmüll",
//    „absperren", „Absperrband", „Sperrholz", „gesperrt" sind auf dem Bau
//    gewöhnliche Wörter. Gemessen hat ein Satz über den alten Teppich
//    162,00 € erzeugt, von denen niemand gesprochen hat.
// 2. **Der Tiefengrund fällt auf der gesperrten Fläche weg** (PM-046-B). Der
//    Isoliergrund IST dort die Grundierung; ein Tiefengrund darunter nimmt
//    ihr den saugenden Untergrund und hebt die Sperre auf. Auf jeder anderen
//    Fläche bleibt die Grundierung, wo sie hingehört — diese Regel fasst sie
//    nicht mehr an, sie legt sie aber auch nicht neu an. Die Regel gilt je
//    Fläche, nie je Angebot.
// 3. **Die gesagte Deckenposition bleibt stehen** (PM-046-C / PM-064-C).
//    Vorher wurde sie entfernt und als neues Objekt gepusht; `index.ts`
//    markiert am Ausgang alles, was nicht objektidentisch aus der Eingabe
//    stammt, als `automatisch_ergaenzt`. Eine ausdrücklich bestellte Decke
//    verlor so ihre Herkunft. Mit Regel H Satz 3 würde sie damit ihren Preis
//    verlieren — deshalb gehört das VOR den Umbau, nicht danach.
//
// Was diese Regel bewusst NICHT tut: eine Grundierung auf einer nicht
// gesperrten Fläche erfinden. „Decke normal grundieren" erzeugt der
// Engine-Weg (`Voranstrich / Grundierung Decke`); was hier zusätzlich
// dazukäme, stünde zweimal da.

/** Echte Sperr-/Fleckenwörter — an der Wortgrenze, nicht am Wortstamm. */
const SPERR_AUSLOESER = /wasserfleck|\bflecken?\b|\bsperrgrund\b|\bsperrgrundierung\b|\bsperranstrich\b|\bsperrschicht\b|\bnikotinsperre\b|\bsperren\b|\bgesperrt\b|\bisoliergrund\b/

/** Ursache „Decke": Flecken, die von oben durchschlagen. */
const URSACHE_DECKE = /wasserfleck|\bflecken?\b|von oben durch|durchgeschlagen|\bwasserschaden\b/

/** Ursache „Wand UND Decke": alles, was sich als Rauch im Raum verteilt. */
const URSACHE_BEIDE = /nikotin|\bruß\b|\bruss\b|rauch|verraucht|verqualmt|vergilbt|\bgelb\b|zigaretten/

const ISOLIERGRUND = 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken'

export function pruefeWasserflecken(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string, hatSchimmelFlag: boolean): void {
  if (hatSchimmelFlag) return
  // Wächter kennt beide Schreibweisen — sonst legt er die Position nach der
  // Umbenennung ein zweites Mal an (derselbe tote Pfad wie bei `Parkett
  // schleifen`).
  if (hat(ergaenzt, 'sperranstrich', 'flecken sperr', 'isoliergrund')) return

  const text = lower ?? ''
  // Der Satz mit dem Auslöser ist der Satz, in dem die Fläche stehen kann.
  // „gelb an den Wänden" steht in einem anderen Satz als „da muss ein
  // Sperrgrund drauf" — das ist die Ursache, nicht die genannte Fläche.
  const ausloeserSatz = saetze(text).find(s => SPERR_AUSLOESER.test(s))
  if (!ausloeserSatz) return

  const genannt: Array<'wand' | 'decke'> = []
  if (/\bwand|\bwänd/.test(ausloeserSatz)) genannt.push('wand')
  if (/\bdecke/.test(ausloeserSatz)) genannt.push('decke')

  const flaechen: Array<'wand' | 'decke'> =
    genannt.length > 0 ? genannt
      : URSACHE_BEIDE.test(text) ? ['wand', 'decke']
        : URSACHE_DECKE.test(text) ? ['decke']
          : []

  if (flaechen.length === 0) {
    // Regel H Satz 3: nicht gesagt → keine bepreiste Zeile. Der Handwerker
    // bekommt die Rückfrage, die App rät nicht.
    add(ergaenzt, fehlende, ISOLIERGRUND)
    return
  }

  const wandPos = ergaenzt.find(p => istWandStreichen(p.beschreibung))
  const deckenPos = ergaenzt.find(p => istDeckeStreichen(p.beschreibung))
  const teile: Array<{ name: string; menge: number }> = []
  if (flaechen.includes('wand') && wandPos) teile.push({ name: 'Wandfläche', menge: wandPos.menge })
  if (flaechen.includes('decke') && deckenPos) teile.push({ name: 'Deckenfläche', menge: deckenPos.menge })

  if (teile.length === 0) {
    add(ergaenzt, fehlende, ISOLIERGRUND)
    return
  }

  const m2 = Math.round(teile.reduce((summe, t) => summe + t.menge, 0) * 100) / 100
  // F.2 #3: Katalogtitel wörtlich — 0,00 € werden 9,00 €/m². Das Bauteil steht
  // im Rechenweg, nicht im Titel (Manfred: „Decke ist die Zeile im Raum, nicht
  // der Preis").
  ergaenzt.push({
    beschreibung: ISOLIERGRUND,
    menge: m2,
    einheit: 'm²',
    konfidenz: 'high',
    berechnungsweg: teile.map(t => `${t.name} ${t.menge} m²`).join(' + '),
    annahmen: [],
  })
}

// Feuchtraum: Wandposition umbenennen
export function pruefeFeuchtraum(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatFeuchtraum = lower.includes('feuchtraum') || lower.includes('feuchtraumfarbe') || lower.includes('nassraum') || lower.includes('feuchtraumfar')
  if (!hatFeuchtraum) return
  for (const p of ergaenzt) {
    if (istWandStreichen(p.beschreibung) && p.beschreibung.toLowerCase().includes('streichen') && !p.beschreibung.toLowerCase().includes('feuchtraum')) {
      p.beschreibung = mitTitelZusatz(p.beschreibung, 'Feuchtraumfarbe')
    }
  }
}

// Abwaschbare Farbe: Wandposition umbenennen
export function pruefeAbwaschbar(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatAbwaschbar = lower.includes('abwaschbar') || lower.includes('abwischbar')
  if (!hatAbwaschbar) return
  for (const p of ergaenzt) {
    if (istWandStreichen(p.beschreibung) && p.beschreibung.toLowerCase().includes('streichen') && !p.beschreibung.toLowerCase().includes('abwaschbar')) {
      p.beschreibung = mitTitelZusatz(p.beschreibung, 'abwaschbare Farbe')
    }
  }
}

// Chlorbeständige Spezialfarbe: alle Streich-Positionen umbenennen + Aufpreis
export function pruefeChlor(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatChlor = lower.includes('chlorbeständig') || lower.includes('schwimmbad') || lower.includes('chlor')
  if (!hatChlor || hat(ergaenzt, 'aufpreis spezialfarbe', 'chlorbeständig')) return
  // ── F.2 #10 (Prüfmeister), umgesetzt am 12.09.2026 ──────────────────────
  //
  // Hier wurde bisher „(chlorbeständige Spezialfarbe)" an JEDE Streichposition
  // gehängt. Der Prüfmeister dazu: *„Das Versprechen steht auf dem Papier,
  // bezahlt wird der Normalpreis."* Der Kunde liest eine Zusage, die keinen
  // Cent teurer ist als der gewöhnliche Anstrich — und der Betrieb schuldet
  // sie trotzdem.
  //
  // Zwei Gründe, warum die Umbenennung jetzt raus ist:
  //
  // 1. Sie war eine unbezahlte Zusage. Der Aufpreis steht als eigene Zeile
  //    darunter; dort gehört er hin.
  // 2. Sobald „chlorbeständig" ein Aufwandswort wird (P.2), würde der Zusatz
  //    den Anstrich gegen JEDE Katalogzeile sperren, die ihn nicht trägt —
  //    also gegen alle. Aus einem zu billigen Anstrich würde einer ohne
  //    jeden Preis. Zwei Fehler heben sich nicht auf.
  //
  // Offen bleibt die zweite Hälfte seiner Ansage: Der Aufpreis gehört auf den
  // Quadratmeter (6,00 €/m² auf die Streichfläche), nicht auf den Auftrag.
  // Das braucht eine neue Katalogzeile und kommt mit dem Katalog-Zug.
  const streichflaeche = ergaenzt
    .filter(p => p.einheit === 'm²' && /streichen|anstrich/i.test(p.beschreibung))
    .reduce((summe, p) => summe + p.menge, 0)
  ergaenzt.push({
    beschreibung: 'Aufpreis Spezialfarbe chlorbeständig',
    menge: streichflaeche > 0 ? Math.round(streichflaeche * 100) / 100 : 1,
    einheit: streichflaeche > 0 ? 'm²' : 'Pauschale',
    konfidenz: 'high',
    berechnungsweg: streichflaeche > 0
      ? `Gleiche Fläche wie die Streichpositionen (${Math.round(streichflaeche * 100) / 100} m²)`
      : 'Chlorbeständige Spezialfarbe erkannt — Fläche nicht bekannt',
    annahmen: [],
  })
}

// Betonwände → Schleifen + Tiefengrund + Betonfarbe (ersetzt Wandposition)
export function pruefeBetonwand(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatBetonwand = (lower.includes('betonwand') || lower.includes('betonwände') ||
    (lower.includes('beton') && lower.includes('wand'))) &&
    !lower.includes('balkon') && !lower.includes('beton boden')
  // F.6: Der Wächter las den ALTEN Titel („tiefengrund beton"). Seit die
  // Position `Grundieren (Tiefengrund)` heißt, prüft er auf das Wort, das in
  // beiden Fassungen steht — sonst legt er sie ein zweites Mal an. Derselbe
  // tote Pfad wie bei `Parkett schleifen` (F.5/4).
  if (!hatBetonwand || hat(ergaenzt, 'betonwand schleifen', 'betonwände schleifen', 'tiefengrund')) return

  const wandPosBeton = ergaenzt.find(p => istWandStreichen(p.beschreibung))
  if (wandPosBeton) {
    const bm2 = wandPosBeton.menge
    filtereArray(ergaenzt, p => !istWandStreichen(p.beschreibung))
    ergaenzt.push({ beschreibung: 'Betonwände schleifen / Untergrundvorbereitung', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${bm2} m²`, annahmen: [] })
    // F.6 (Prüfmeister): fünf Schreibweisen, ein Preis. Tiefengrund ist
    // Tiefengrund — auf Beton, auf der Dachschräge, an der Decke. Der alte
    // Titel `Tiefengrund Beton` fand im Katalog GAR NICHTS (0,00 €), obwohl
    // `Grundieren (Tiefengrund)` mit 4,50 €/m² dort steht.
    ergaenzt.push({ beschreibung: 'Grundieren (Tiefengrund)', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${bm2} m² Beton`, annahmen: ['Untergrund Beton'] })
    ergaenzt.push({ beschreibung: 'Betonfarbe streichen', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${bm2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Betonwände schleifen / Untergrundvorbereitung')
    add(ergaenzt, fehlende, 'Grundieren (Tiefengrund)')
    add(ergaenzt, fehlende, 'Betonfarbe streichen')
  }
}

// Kalkputz → eigene teurere Positionen statt normales Wandstreichen
export function pruefeKalkputz(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatKalkputz = lower.includes('kalkputz') || lower.includes('kalk putz') || lower.includes('kalkfarbe')
  if (!hatKalkputz || hat(ergaenzt, 'kalkputz', 'kalk auftragen')) return

  const wandPosKalk = ergaenzt.find(p => istWandStreichen(p.beschreibung))
  if (wandPosKalk) {
    const km2 = wandPosKalk.menge
    filtereArray(ergaenzt, p => !istWandStreichen(p.beschreibung))
    ergaenzt.push({ beschreibung: 'Untergrundvorbereitung für Kalkputz', menge: km2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${km2} m²`, annahmen: [] })
    // F.3: Der Katalog sagt „aufbringen", die Engine sagte „auftragen" —
    // und fand deshalb nichts. 35,00 €/m² standen die ganze Zeit da.
    ergaenzt.push({ beschreibung: 'Kalkputz aufbringen', menge: km2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${km2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Untergrundvorbereitung für Kalkputz')
    add(ergaenzt, fehlende, 'Kalkputz aufbringen')
  }
}

// Dachschräge → Spachteln + Grundierung ergänzen
export function pruefeDachschraege(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatDachschraege = lower.includes('dachschräge') || lower.includes('dachschraege') || lower.includes('schräge') || lower.includes('schraege')
    || lower.includes('kniestock') || lower.includes('deckenspiegel')
  if (!hatDachschraege) return

  const schraegenPos = ergaenzt.find(p => (p.beschreibung ?? '').toLowerCase().includes('dachschrägen streich'))
  // Soll-Audit 2026-08-31: Der Rückfall auf `dachPos` nahm die Menge der
  // ERSTBESTEN Dachgeschoss-Position — im Zweifel die des Kniestocks. Daraus
  // entstand eine „Dachschrägen streichen"-Position mit der Kniestockfläche:
  // eine erfundene Zahl, die aussieht wie ein Messwert. Ohne echte
  // Schrägenfläche wird deshalb nichts mehr gerechnet, sondern erinnert.
  const dsm2 = schraegenPos?.menge ?? null

  // PM-007: "Dachschräge Grundierung" wurde HIER unconditional draufgesetzt,
  // sobald irgendwo "Dachschräge"/"Kniestock" fiel — ganz ohne Prüfung, ob der
  // Nutzer je "grundieren" gesagt hat. Gleicher Fehlerbau wie PM-003 (Wand-
  // Grundierung) und wie oben bei pruefeGrundierung: nur bei echtem, im
  // Rohtext genanntem Grundierungs-Wunsch, sonst nur Erinnerung.
  const explizitGrundierung = /grundier\w*|grundierung|voranstrich|primer|tiefengrund/i.test(lower)
  // PM-007-Nachtest: dieselbe Fehlerfamilie, dritte Fundstelle — "Dachschräge
  // spachteln / Untergrundvorbereitung" kam bisher ebenso unconditional dazu,
  // nur weil "Dachschräge"/"Kniestock" irgendwo fiel. Jetzt nur bei einem
  // echten Signal für Ausbesserungsbedarf.
  const explizitSpachteln = /spachtel\w*|ausbesser\w*|reparier\w*|riss\w*|löcher|loch\b|uneben\w*|beschädigt\w*|untergrundvorbereitung/i.test(lower)

  // Katalog-Deckungsaudit 2026-08-31: Hier stand die DRITTE Schreibweise
  // derselben Leistung — „Dachschräge streichen — 2× Anstrich" neben dem
  // „Dachschrägen streichen 2x" der Engine und des Katalogs. Zwei Folgen:
  // kein Katalogpreis (0,00 €), und der Teil nach dem „ — " wurde von der
  // Raum-Gruppierung als Raumname gelesen, sodass die Position unter
  // „Allgemein" statt beim Raum landete. Jetzt überall dieselbe Bezeichnung.
  if (dsm2 !== null && dsm2 > 0) {
    if (explizitSpachteln && !hat(ergaenzt, 'spachtel', 'untergrund')) ergaenzt.push({ beschreibung: 'Dachschrägen spachteln', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m² Dachschrägenfläche`, annahmen: [] })
    // F.6: siehe oben — ein Preis, fünf Schreibweisen. Die Dachschräge steht
    // im Rechenweg. (Genau diese Zusammenführung hat der Prüfmeister
    // verlangt, als ich beim ersten Anlauf „Dachschräge" als Erschwernis-Wort
    // eingebaut und damit die beiden auseinandergerissen hatte.)
    if (explizitGrundierung && !hat(ergaenzt, 'grundier')) ergaenzt.push({ beschreibung: 'Grundieren (Tiefengrund)', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Dachschräge ${dsm2} m²`, annahmen: [] })
    if (!hat(ergaenzt, 'dachschrägen streich', 'dachschräge streich', 'schräge streich')) ergaenzt.push({ beschreibung: 'Dachschrägen streichen 2x', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m²`, annahmen: [] })
    if (!hat(ergaenzt, 'boden schütz', 'abdecken')) ergaenzt.push({ beschreibung: 'Boden schützen / Abdeckfolie', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m²`, annahmen: ['Bodenfläche geschätzt'] })
  } else {
    if (explizitSpachteln && !hat(ergaenzt, 'spachtel')) add(ergaenzt, fehlende, 'Dachschrägen spachteln')
    if (explizitGrundierung && !hat(ergaenzt, 'grundier')) add(ergaenzt, fehlende, 'Grundieren (Tiefengrund) — Dachschräge')
    if (!hat(ergaenzt, 'dachschräg streich', 'schräge streich')) add(ergaenzt, fehlende, 'Dachschrägen streichen 2x')
    if (!hat(ergaenzt, 'boden schütz')) add(ergaenzt, fehlende, 'Boden schützen / Abdeckfolie')
  }
}

// ── PM-089 / PM-108 (Prüfmeister, 16.09.2026) ───────────────────────────────
//
// „… da ist eine Regalnische in der Wand, ein Meter zwanzig breit, die muss
// mit gestrichen werden." → heute Zeile für Zeile dasselbe Angebot wie ohne
// den Satz, und `fehlende` bleibt leer. Der Satz verschwindet spurlos.
//
// Das ist NICHT die Familie „Titel trifft den Katalog nicht", sondern eine
// echte Katalog-Lücke wie PM-076 (Rollladenkästen): Der Malerkatalog führt
// die Nische nur fürs TAPEZIEREN (`Ecken / Nischen / Laibungen tapezieren
// (Aufpreis)`, 6,00 €/lfdm), fürs STREICHEN gibt es keine Zeile — gemessen
// über alle Maler-Kategorien, null Treffer (PM-089-D, PM-108-C). Im Bad gibt
// es sie (`Nische / Wandnische fliesen`, 95,00 €/Stück), das ist aber ein
// anderes Gewerk und bleibt hier unberührt (PM-075, weiter offen).
//
// Solange die Katalogzeile fehlt, ist die richtige Antwort ein Fehlt-Eintrag
// — keine erfundene bepreiste Position (K.5) und keine Nullzeile (PM-066).
//
// Wortgrenzen statt Wortstamm, dieselbe Falle wie PM-064 und PM-074:
// „nische" steckt in „technische", „mechanische", „elektronische",
// „hygienische", „spanische", „botanische". Ein blosses
// `lower.includes('nische')` hätte in jedem zweiten Diktat gefeuert. Die
// Umlaute stehen ausgeschrieben statt `\b`, weil `\b` in JavaScript ASCII
// ist und an „Fußnische" wieder eine falsche Grenze sähe.
const NISCHE_WORT = /(?<![a-zäöüß])(?:regal|wand|mauer)?nischen?(?![a-zäöüß])/

export function pruefeNische(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  if (!NISCHE_WORT.test(lower)) return
  // Nur wo im Angebot wirklich an der Wand gestrichen wird. Die Nische ist
  // Mehrarbeit auf derselben Grundfläche — ohne Wandposition gibt es nichts,
  // wozu sie Mehrarbeit wäre. Beide gemessenen Fälle (PM-089, PM-108) sagen
  // „Wände streichen". Der Tapezier-Fall ist NICHT gebaut: dort gibt es die
  // Katalogzeile, und eine bepreiste Position daraus ist ein eigener
  // Eingriff mit eigener Messung.
  if (!ergaenzt.some(p => istWandStreichen(p.beschreibung ?? ''))) return
  // Nicht über `add`: dessen Dopplungsschutz nimmt die ersten ZWEI Wörter
  // des Titels, hier also „nische" und „/" — und „/" steckt in „Boden
  // schützen / Abdeckfolie". Der Eintrag wäre stillschweigend unterdrückt
  // worden.
  if (hat(ergaenzt, 'nische', 'laibung', 'leibung')) return
  // Wortlaut vom Prüfmeister (17.09.2026, Antwort auf Engineerings Frage 2):
  // „Laibungsflächen" allein wäre zu eng. Die gestrichene Fläche einer Nische
  // ist die RÜCKWAND (Breite × Höhe) PLUS die vier Laibungen (umlaufende
  // Kante × Tiefe) — die Rückwand ist davon der größere Teil. Wer nur die
  // Laibungen aufmisst, lässt den Hauptteil weg, und zwar systematisch.
  // Der Zusatz „keine Katalogzeile" bleibt: er sagt dem Betrieb, dass er hier
  // nicht nur eine Menge, sondern auch einen Preis selbst setzen muss (K.5).
  fehlende.push('Nische streichen (Rückwand + Laibungen aufmessen — keine Katalogzeile)')
}
