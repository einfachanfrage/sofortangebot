import type { BerechnetePosition } from '../mengen/types'
import { hat, add, filtereArray, istWandStreichen, istDeckeStreichen } from './helpers'
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

// Wasserflecken / Sperranstrich an Decke
export function pruefeWasserflecken(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string, hatSchimmelFlag: boolean): void {
  const hatFlecken = !hatSchimmelFlag && (lower.includes('fleck') || lower.includes('wasserfleck') || lower.includes('sperr') || lower.includes('sperranstrich'))
  // Wächter kennt beide Schreibweisen — sonst legt er die Position nach der
  // Umbenennung ein zweites Mal an (derselbe tote Pfad wie bei `Parkett
  // schleifen`).
  if (!hatFlecken || hat(ergaenzt, 'sperranstrich', 'flecken sperr', 'isoliergrund')) return

  const deckenPos = ergaenzt.find(p => istDeckeStreichen(p.beschreibung))
  if (deckenPos) {
    const dm2 = deckenPos.menge
    filtereArray(ergaenzt, p => !istDeckeStreichen(p.beschreibung))
    // ── Zwei Funde aus Manfreds Testlauf, beide hier entstanden ──────────
    //
    // 1) „… — Decke": Das Bauteil hat im Positionsnamen nichts verloren.
    //    Manfred: *„Decke ist die Zeile im Raum, nicht der Preis. Wenn die
    //    Engine Bauteile in Titel schreibt, findet sie nie einen
    //    Katalogpreis, egal wie sauber der Katalog ist."* Der Katalog führt
    //    „Nikotinsperre auftragen", nicht „Sperranstrich — Decke". Der
    //    `fehlende`-Zweig unten benutzte ohnehin schon den kurzen Namen —
    //    die beiden Zweige waren schlicht uneinheitlich.
    //
    // 2) „Deckenfläche streichen — 2× Anstrich": **Das ist der Titel aus
    //    TN-093.** Überall sonst schreibt die Engine
    //    „<Leistung> <n>x — <Raum>"; der Gedankenstrich trennt den RAUM ab.
    //    Hier stand dahinter die Anstrichzahl — und weil der Preis-Matcher
    //    genau dort abschneidet, suchte er nach „Decke streichen" ohne
    //    Variante und griff den 1x-Preis (7,00 € statt 11,00 €).
    //    Der Matcher liest die Anstrichzahl inzwischen am ganzen Titel
    //    (CoS-E-038), das hier ist die zweite Hälfte: den Titel gar nicht
    //    erst falsch bauen.
    // F.2 #3: Katalogtitel wörtlich — 0,00 € werden 9,00 €/m².
    ergaenzt.push({ beschreibung: 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken', menge: dm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Deckenfläche ${dm2} m²`, annahmen: [] })
    // F.6: fünf Schreibweisen, ein Preis. Tiefengrund ist Tiefengrund —
    // an der Decke wie auf der Dachschräge. Das Bauteil steht im Rechenweg,
    // nicht im Titel (Manfred: „Decke ist die Zeile im Raum, nicht der Preis").
    ergaenzt.push({ beschreibung: 'Grundieren (Tiefengrund)', menge: dm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Deckenfläche ${dm2} m²`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Decke streichen 2x', menge: dm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Deckenfläche ${dm2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken')
  }
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
