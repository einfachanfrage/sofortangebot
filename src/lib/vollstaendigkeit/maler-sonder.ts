import type { BerechnetePosition } from '../mengen/types'
import { hat, add, filtereArray, istWandStreichen, istDeckeStreichen, NISCHE_WORT, raumNamenAus, findeRaumImSatz, raumAusTitel } from './helpers'
import { saetze } from '../satz-raum'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import { mitTitelZusatz } from '../positions-titel'
// CoS-E-088 (DC-130 §2): Der Rechenweg steht auf dem Kundendokument. Eine Zahl
// mit Nachkommastelle ging dort ungeformt hinein — „46.8 m²" statt „46,8 m²".
// `zahlDe()` ist dieselbe Hilfe, die `mengen/gewerke/maler.ts` schon benutzt;
// keine neue.
import { zahlDe } from '../mengen/wandflaechen-konflikt'

// Schimmel → Schimmelbehandlung + Sperranstrich (additiv)
export function pruefeSchimmel(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): boolean {
  const hatSchimmel = lower.includes('schimmel') || lower.includes('schimmelbehandl')
  if (!hatSchimmel || hat(ergaenzt, 'schimmelbehandlung', 'schimmel behandl')) return hatSchimmel

  const schimmelMatch = lower.match(/schimmel[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
    ?? lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?]*?schimmel/i)
  const schimmelM2 = schimmelMatch ? parseFloat(schimmelMatch[1].replace(',', '.')) : null
  if (schimmelM2 && schimmelM2 > 0) {
    ergaenzt.unshift({ beschreibung: 'Schimmelbehandlung', menge: schimmelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${zahlDe(schimmelM2)} m² aus Transkript (Schimmelbereich)`, annahmen: [] })
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
    ergaenzt.push({ beschreibung: 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken', menge: schimmelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${zahlDe(schimmelM2)} m² Schimmelbereich, Sperranstrich nach der Behandlung`, annahmen: [] })
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

/**
 * Steht dieser Raumname als GANZES Wort im Satz?
 *
 * Mit Wortgrenze, und Namen unter drei Zeichen zählen gar nicht — die
 * Lehre aus PM-103: die Prüfmeister-Fälle nennen ihre Räume `W`, und ein
 * Namensvergleich ohne Grenze hat dort jedes einzelne „w" getroffen.
 * `Altbauwohnzimmer` ist kein „Wohnzimmer", `Badezimmer` kein „Bad".
 */
const WORTZEICHEN = /[a-zäöüß0-9]/i
function nenntRaum(satz: string, raumName: string): boolean {
  const name = raumName.toLocaleLowerCase('de-DE').trim()
  if (name.length < 3) return false
  for (let ab = 0; ; ) {
    const stelle = satz.indexOf(name, ab)
    if (stelle === -1) return false
    const davor = stelle === 0 ? '' : satz[stelle - 1]
    const danach = satz[stelle + name.length] ?? ''
    if (!WORTZEICHEN.test(davor) && !WORTZEICHEN.test(danach)) return true
    ab = stelle + 1
  }
}

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
  const alleSaetze = saetze(text)
  const ausloeserSatz = alleSaetze.find(s => SPERR_AUSLOESER.test(s))
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

  // ── CoS-E-085 · PM-079-A / PM-079-B (21.09.2026) ──────────────────────
  //
  // Hier stand `ergaenzt.find(istWandStreichen)` und `find(istDeckeStreichen)`
  // — `find` nimmt die ERSTE Position, und der Raumbezug des Auslösersatzes
  // wurde nicht mitgeführt. Eine Zeile, zwei Wirkungen:
  //
  //   PM-079-A  zwei verrauchte Räume → der Isoliergrund lag nur auf dem
  //             ersten. 47,00 m² × 9,00 €/m² = 423,00 € zu wenig (live
  //             an Fall 8 gemessen: 463,50 €).
  //   PM-079-B  war nur der ZWEITE Raum verraucht, lag er auf den Flächen
  //             des ersten — auf dem falschen Raum, nicht bloß auf zu
  //             wenigen. Der Handwerker sperrt ein Zimmer, das es nicht
  //             braucht, und lässt es dort weg, wo es nötig ist.
  //
  // Betroffen ist ein Raum, wenn sein Name in einem Satz steht, der das
  // Auslösewort ODER die Ursache nennt. „auch verraucht" im zweiten Satz
  // reicht also — so redet ein Handwerker, und PM-080 (die Ursache allein
  // löst nichts aus) bleibt davon unberührt: ohne Auslösersatz sind wir
  // oben schon ausgestiegen.
  //
  // Nennt kein betroffener Satz einen bekannten Raum, gilt wie bisher das
  // ganze Angebot — der Ein-Raum-Fall ändert sich damit um nichts (PM-079-C).
  const raumNamen = raumNamenAus(ergaenzt)
  const betroffeneRaeume = new Set<string>()
  for (const satz of alleSaetze) {
    if (!SPERR_AUSLOESER.test(satz) && !URSACHE_BEIDE.test(satz) && !URSACHE_DECKE.test(satz)) continue
    for (const name of raumNamen) if (nenntRaum(satz, name)) betroffeneRaeume.add(name)
  }
  const imBereich = (p: BerechnetePosition) =>
    betroffeneRaeume.size === 0 || betroffeneRaeume.has(raumAusTitel(p.beschreibung) ?? '')

  const teile: Array<{ wort: string; raum: string | null; menge: number }> = []
  const sammle = (art: 'wand' | 'decke', trifft: (b: string) => boolean, wort: string) => {
    if (!flaechen.includes(art)) return
    for (const p of ergaenzt) {
      if (!trifft(p.beschreibung) || !imBereich(p)) continue
      teile.push({ wort, raum: raumAusTitel(p.beschreibung), menge: p.menge })
    }
  }
  sammle('wand', istWandStreichen, 'Wandfläche')
  sammle('decke', istDeckeStreichen, 'Deckenfläche')

  // Der Rechenweg steht auf dem Kundendokument. Hat die Aufnahme nur einen
  // Raum, bleibt er Wort für Wort, wie er war — der Name wäre dort nur
  // Beiwerk. Sobald es mehrere Räume GIBT, muss er dabeistehen, auch wenn
  // am Ende nur einer gesperrt wird: gerade dann ist die Frage „welcher?"
  // die, die der Handwerker beantwortet haben will (PM-079-B).
  const mehrereRaeume = raumNamen.length > 1

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
    berechnungsweg: teile.map(t => `${t.wort}${mehrereRaeume && t.raum ? ` ${t.raum}` : ''} ${zahlDe(t.menge)} m²`).join(' + '),
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
      ? `Gleiche Fläche wie die Streichpositionen (${zahlDe(streichflaeche)} m²)`
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
  // Position `Grundieren — Tiefengrund` heißt, prüft er auf das Wort, das in
  // beiden Fassungen steht — sonst legt er sie ein zweites Mal an. Derselbe
  // tote Pfad wie bei `Parkett schleifen` (F.5/4).
  if (!hatBetonwand || hat(ergaenzt, 'betonwand schleifen', 'betonwände schleifen', 'tiefengrund')) return

  const wandPosBeton = ergaenzt.find(p => istWandStreichen(p.beschreibung))
  if (wandPosBeton) {
    const bm2 = wandPosBeton.menge
    filtereArray(ergaenzt, p => !istWandStreichen(p.beschreibung))
    ergaenzt.push({ beschreibung: 'Betonwände schleifen / Untergrundvorbereitung', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${zahlDe(bm2)} m²`, annahmen: [] })
    // F.6 (Prüfmeister): fünf Schreibweisen, ein Preis. Tiefengrund ist
    // Tiefengrund — auf Beton, auf der Dachschräge, an der Decke. Der alte
    // Titel `Tiefengrund Beton` fand im Katalog GAR NICHTS (0,00 €), obwohl
    // `Grundieren — Tiefengrund` mit 4,50 €/m² dort steht.
    ergaenzt.push({ beschreibung: 'Grundieren — Tiefengrund', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${zahlDe(bm2)} m² Beton`, annahmen: ['Untergrund Beton'] })
    ergaenzt.push({ beschreibung: 'Betonfarbe streichen', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${zahlDe(bm2)} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Betonwände schleifen / Untergrundvorbereitung')
    add(ergaenzt, fehlende, 'Grundieren — Tiefengrund')
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
    ergaenzt.push({ beschreibung: 'Untergrundvorbereitung für Kalkputz', menge: km2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${zahlDe(km2)} m²`, annahmen: [] })
    // F.3: Der Katalog sagt „aufbringen", die Engine sagte „auftragen" —
    // und fand deshalb nichts. 35,00 €/m² standen die ganze Zeit da.
    ergaenzt.push({ beschreibung: 'Kalkputz aufbringen', menge: km2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${zahlDe(km2)} m²`, annahmen: [] })
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
  // „Dachschrägen streichen — 2× Anstrich" der Engine und des Katalogs. Zwei Folgen:
  // kein Katalogpreis (0,00 €), und der Teil nach dem „ — " wurde von der
  // Raum-Gruppierung als Raumname gelesen, sodass die Position unter
  // „Allgemein" statt beim Raum landete. Jetzt überall dieselbe Bezeichnung.
  if (dsm2 !== null && dsm2 > 0) {
    if (explizitSpachteln && !hat(ergaenzt, 'spachtel', 'untergrund')) ergaenzt.push({ beschreibung: 'Dachschrägen spachteln', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${zahlDe(dsm2)} m² Dachschrägenfläche`, annahmen: [] })
    // F.6: siehe oben — ein Preis, fünf Schreibweisen. Die Dachschräge steht
    // im Rechenweg. (Genau diese Zusammenführung hat der Prüfmeister
    // verlangt, als ich beim ersten Anlauf „Dachschräge" als Erschwernis-Wort
    // eingebaut und damit die beiden auseinandergerissen hatte.)
    if (explizitGrundierung && !hat(ergaenzt, 'grundier')) ergaenzt.push({ beschreibung: 'Grundieren — Tiefengrund', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Dachschräge ${zahlDe(dsm2)} m²`, annahmen: [] })
    if (!hat(ergaenzt, 'dachschrägen streich', 'dachschräge streich', 'schräge streich')) ergaenzt.push({ beschreibung: 'Dachschrägen streichen — 2× Anstrich', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${zahlDe(dsm2)} m²`, annahmen: [] })
    if (!hat(ergaenzt, 'boden schütz', 'abdecken')) ergaenzt.push({ beschreibung: 'Boden schützen / Abdeckfolie', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${zahlDe(dsm2)} m²`, annahmen: ['Bodenfläche geschätzt'] })
  } else {
    if (explizitSpachteln && !hat(ergaenzt, 'spachtel')) add(ergaenzt, fehlende, 'Dachschrägen spachteln')
    if (explizitGrundierung && !hat(ergaenzt, 'grundier')) add(ergaenzt, fehlende, 'Grundieren — Tiefengrund — Dachschräge')
    if (!hat(ergaenzt, 'dachschräg streich', 'schräge streich')) add(ergaenzt, fehlende, 'Dachschrägen streichen — 2× Anstrich')
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
// anderes Gewerk — seit PM-075 als bepreiste Position in `fliesen-sonder.ts`
// gebaut und hier weiterhin unberührt.
//
// Solange die Katalogzeile fehlt, ist die richtige Antwort ein Fehlt-Eintrag
// — keine erfundene bepreiste Position (K.5) und keine Nullzeile (PM-066).
//
// Die Wortgrenze steht seit PM-075 in `helpers.ts` — der Fliesenleger
// braucht dieselbe (dort als bepreiste Position, hier als Fehlt-Eintrag).
// Zwei Kopien wären zwei Wahrheiten; die Begründung zur Wortgrenze steht
// jetzt dort.

/**
 * ── Zug 2 · die Tapezier-Nische (Prüfmeister, 17.09.2026, Punkt 5) ─────────
 *
 *   „Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Die Wände mit Raufaser
 *    tapezieren. In der Wand ist eine Regalnische, ein mal zwei Meter, die
 *    wird mittapeziert."
 *
 * Gemessen vor dem Bau: mit und ohne den Nischensatz Zeile für Zeile
 * dasselbe Angebot, `fehlende` leer. Der Satz verschwand spurlos — genau der
 * Befund, den der Prüfmeister bestätigt hat.
 *
 * **Der Unterschied zu `pruefeNische` darunter ist der Katalog, nicht die
 * Nische.** Fürs STREICHEN führt der Malerkatalog keine Zeile (PM-089 /
 * PM-108), also bleibt es dort beim Fehlt-Eintrag. Fürs TAPEZIEREN gibt es
 * `Ecken / Nischen / Laibungen tapezieren (Aufpreis)`, 6,00 €/lfdm — also
 * eine bepreiste Position, sobald die Menge messbar ist.
 *
 * **Die Menge, Fachentscheidung des Prüfmeisters:** `2 × (Breite + Höhe)` der
 * Nischenöffnung, in lfdm. Vier Seiten, weil eine Nische — anders als die
 * Fensterlaibung aus PM-037 / VOB-013 — keine Fensterbank hat, die getrennt
 * abgerechnet wird. Die TIEFE geht nicht ein: die Katalogzeile steht in
 * `lfdm`, der Aufpreis gilt der Kante und nicht der Fläche; die Tiefe steckt
 * im Einheitspreis. (Die m²-Lesart gibt es im Katalog auch — beim Putzer,
 * `Laibung verputzen (>30cm Tiefe)`. Wer beim Tapezieren in m² rechnet, hat
 * die falsche Zeile erwischt.)
 *
 * **Die Formel ist symmetrisch, und das erspart eine Rate-Entscheidung:**
 * `2 × (B + H)` ist gegen Vertauschen unempfindlich. Bei „ein mal zwei
 * Meter" muss deshalb niemand entscheiden, welche der beiden Zahlen die
 * Breite ist — es gibt nichts zu raten.
 *
 * **Auflage 1 des Prüfmeisters — ohne BEIDE Maße keine Menge.** Die Diktate
 * nennen fast immer nur die Breite („ein Meter zwanzig breit"). Dann
 * entsteht der Fehlt-Eintrag, nicht die bepreiste Position; sonst wäre die
 * Zahl geraten. Das ist der häufigere Fall, nicht der Randfall. Der
 * Fehlt-Eintrag ist bewusst OHNE das „⚠ " aus CoS-E-074: er ist keine
 * Anmerkung, sondern eine Leistung mit offener Menge — `mehrgewerk.ts` macht
 * daraus seit PM-010 eine Platzhalter-Zeile, in die der Betrieb die lfdm
 * selbst einträgt, und dann greift der Katalogpreis.
 *
 * **Warum die Katalogschreibweise als Titel — und warum hier anders als bei
 * der Duschnische.** Gemessen, nicht übernommen: beim Fliesen musste der
 * Titel gekürzt werden, weil „Wandnische" über `gewerkFuerPosition`
 * (`/wand/` zuerst) beim MALER landet und der Katalogfilter die Fliesenzeile
 * dann gar nicht mehr anbietet. Hier IST der Maler das richtige Gewerk, und
 * die Katalogschreibweise trifft ihre Zeile mit Score 1,00 — die gekürzte
 * Form „Nischen tapezieren (Aufpreis)" nur mit 0,67. Ein Preis, eine
 * Schreibweise (F.6).
 *
 * **Der Zusatz steht in Klammern, nicht hinter einem Gedankenstrich.**
 * `raumAusTitel` liest alles nach dem ersten „ — " als Raumnamen; ein
 * erklärender Nachsatz dort würde die Position unter einem erfundenen Raum
 * einsortieren (die Falle aus dem Dachschrägen-Audit). Nach dem Strich steht
 * nur der Raum.
 *
 * **Nicht gebaut — die Mehrzahl mit Maßen.** „Zwei Nischen, je ein Meter
 * zwanzig breit und achtzig hoch" hieße, ein Maß auf mehrere Nischen zu
 * übertragen, also anzunehmen, dass sie gleich groß sind. Das ist eine
 * Annahme, keine Messung; die Mehrzahl bekommt deshalb den Fehlt-Eintrag.
 * Frage an den Prüfmeister liegt in seiner Datei.
 */
export function pruefeTapezierNische(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
): void {
  if (!NISCHE_WORT.test(lower)) return
  // Dopplungsschutz von Hand, nicht über `add`: dessen Kennung sind die
  // ersten ZWEI Wörter des Titels, hier „ecken" und „/" — und „/" steckt
  // auch in „Boden schützen / Abdeckfolie". Dieselbe Falle wie in
  // `fliesen-sonder.ts`; der Eintrag wäre stillschweigend unterdrückt worden.
  if (hat(ergaenzt, 'nische', 'laibung', 'leibung')) return
  // Nur wo im Angebot wirklich tapeziert wird. Der Aufpreis ist Mehrarbeit an
  // einer Tapezierleistung — ohne sie gibt es nichts, wozu er Aufpreis wäre.
  // „Tapete entfernen" zählt bewusst nicht mit: Abreißen ist kein Tapezieren.
  if (!hat(ergaenzt, 'tapezier', 'aufzieh')) return

  // Zahlwörter hier noch einmal ersetzt, wie in `fliesen-sonder.ts`: die
  // Regel muss auch dort greifen, wo der Text nicht schon am Eingang
  // normalisiert wurde (K.2 gilt für die Pipeline, nicht für jeden Aufrufer).
  const text = ersetzeZahlenWorte(lower)
  const satz = saetze(text).find(s => NISCHE_WORT.test(s))
  if (!satz) return
  // Der Satz muss die Nische ans Tapezieren binden — dieselbe Bremse wie
  // `/flies|kachel/` beim Fliesenleger. „Die Nische bleibt, wie sie ist"
  // darf auch in einem Tapezierauftrag keine Zeile erzeugen.
  if (!/tapez|raufaser|vlies|tapete/.test(satz)) return

  const namen = raumNamenAus(ergaenzt)
  const raum = namen.length === 1 ? namen[0] : findeRaumImSatz(NISCHE_WORT, text, namen)
  const suffix = raum ? ` — ${raum}` : ''

  const mehrzahl = /(?<![a-zäöüß])(?:regal|wand|mauer)?nischen(?![a-zäöüß])/.test(satz)
  const masse = mehrzahl ? null : nischenMasse(satz)
  if (masse === null) {
    fehlende.push(`Ecken / Nischen / Laibungen tapezieren (Aufpreis, Maße bitte angeben)${suffix}`)
    return
  }

  const lfdm = Math.round(2 * (masse.a + masse.b) * 100) / 100
  ergaenzt.push({
    beschreibung: `Ecken / Nischen / Laibungen tapezieren (Aufpreis)${suffix}`,
    menge: lfdm,
    einheit: 'lfdm',
    konfidenz: 'high',
    berechnungsweg: `Nischenöffnung ${komma(masse.a)} m × ${komma(masse.b)} m, Umfang 2 × (${komma(masse.a)} + ${komma(masse.b)}) = ${komma(lfdm)} lfdm`,
    annahmen: [],
    // Diktiert, nicht ergänzt (PM-023 / PM-077, Regel H Satz 3): Wer die
    // Nische ausdrücklich nennt, darf ihren Preis nicht dadurch verlieren,
    // dass die Zeile aus der Vollständigkeitsprüfung stammt.
    automatisch_ergaenzt: false,
  })
}

/** Deutsche Schreibweise im Rechenweg — 1.2 → „1,20". */
function komma(v: number): string {
  return v.toFixed(2).replace('.', ',')
}

/**
 * Die beiden Öffnungsmaße einer Nische aus ihrem Satz, in Metern.
 * `null`, sobald eines von beiden fehlt — dann wird nicht gerechnet
 * (Auflage 1). Welches der beiden die Breite ist, spielt keine Rolle:
 * `2 × (a + b)` ist symmetrisch.
 */
function nischenMasse(satz: string): { a: number; b: number } | null {
  const breit = nischenMass(satz, '(?:breit|breite)')
  const hoch = nischenMass(satz, '(?:hoch|höhe|hoehe)')
  if (breit !== null && hoch !== null) return { a: breit, b: hoch }
  // „eine Regalnische, ein mal zwei Meter" — die Sprechweise aus PM-108 und
  // das Beispiel des Prüfmeisters. Nur NACH dem Nischenwort gesucht, damit
  // die Raummaße im selben Satz („vier mal fünf") nicht eingesammelt werden;
  // die Plausibilitätsgrenze unten hält sie zusätzlich heraus.
  const nische = NISCHE_WORT.exec(satz)
  if (!nische) return null
  const rest = satz.slice(nische.index + nische[0].length)
  const mal = /(\d+(?:[.,]\d+)?)\s*(?:m|meter)?\s*(?:mal|×|x)\s*(\d+(?:[.,]\d+)?)\s*(?:m|meter)?/.exec(rest)
  if (!mal) return null
  const a = plausiblesNischenmass(parseFloat(mal[1].replace(',', '.')))
  const b = plausiblesNischenmass(parseFloat(mal[2].replace(',', '.')))
  return a !== null && b !== null ? { a, b } : null
}

/** Ein einzelnes Maß („1 meter 20 breit", „80 cm hoch", „1,20 breit", „80 hoch"). */
function nischenMass(satz: string, wort: string): number | null {
  // „1 meter 20 breit" → 1,20 m. Dieselbe Sprechweise, die
  // `extrahiereRaumhoehe` seit PM-024 für die Raumhöhe kennt.
  const komp = new RegExp(`(\\d+)\\s*(?:m|meter)\\s+(\\d{1,2})\\s*(?:m\\s*)?${wort}`).exec(satz)
  if (komp) return plausiblesNischenmass(parseInt(komp[1], 10) + parseInt(komp[2], 10) / 100)
  const cm = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(?:cm|zentimeter)\\s*${wort}`).exec(satz)
  if (cm) return plausiblesNischenmass(parseFloat(cm[1].replace(',', '.')) / 100)
  const m = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*(m|meter)?\\s*${wort}`).exec(satz)
  if (!m) return null
  const roh = parseFloat(m[1].replace(',', '.'))
  // Blanke Zahl ohne Einheit: „achtzig hoch" heißt 0,80 m, nicht 80 m. Das
  // ist keine Annahme, sondern die einzige Lesart, die die Plausibilität
  // überlebt — eine Nische von 80 Metern gibt es nicht. Ab 5 aufwärts, damit
  // „2 hoch" Meter bleibt.
  const inMetern = !!m[2] || /[.,]/.test(m[1])
  return plausiblesNischenmass(inMetern || roh < 5 ? roh : roh / 100)
}

/**
 * Nischenöffnungen liegen zwischen einer Handbreite und Raumhöhe. Alles
 * darüber ist ein Fehl-Parse (typisch: die Raummaße aus demselben Satz), und
 * ein Fehl-Parse darf keine Menge erzeugen — er wird zum Fehlt-Eintrag.
 */
function plausiblesNischenmass(v: number): number | null {
  return v >= 0.05 && v <= 3 ? v : null
}

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
