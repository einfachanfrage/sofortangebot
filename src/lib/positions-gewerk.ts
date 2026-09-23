// Welches Gewerk bepreist eine Position?
//
// ── Warum das hier liegt und nicht im API-Endpunkt (12.09.2026) ───────────
//
// Diese Funktion ist reine Logik ohne Datenbank, Netz oder Next.js — sie
// stand trotzdem in `src/app/api/angebot-generieren/route.ts`. Zwei Folgen:
//
//  • Der Test `entscheidungen-31-08.test.ts` musste die halbe Next.js-Route
//    nachladen, um EINE Zeile zu prüfen. Der Import hat erst 2,3 s gebraucht,
//    dann die 5-Sekunden-Grenze gerissen, und nach dem Hochsetzen auf 20 s
//    auch die. Ein Test, der zufällig rot wird, bringt einem bei, rote Läufe
//    wegzuklicken — deshalb die Ursache statt der Zeit.
//
//  • `scripts/vokabular-abgleich.mjs` hielt eine KOPIE dieser Funktion, weil
//    sie aus einem Node-Skript nicht importierbar war. Der Kopfkommentar dort
//    warnt selbst davor, dass die Kopie veralten kann. Jetzt ist sie
//    importierbar.
//
// Der Endpunkt exportiert sie unverändert weiter, damit bestehende Importe
// nichts merken.

export function gewerkFuerPosition(beschreibung: string, hauptgewerk?: string): string | undefined {
  const text = beschreibung.toLocaleLowerCase('de-DE')
  const istBoden = /vinyl|laminat|parkett|teppich|kork|linoleum|designboden|bodenbelag|trittschall|altbelag|sockelleisten montier|boden (?:verleg|entfern|schleif)|untergrund schleifen.*kleberreste|kleberreste.*schleifen/i.test(text)
  if (istBoden) return 'boden_parkett'
  // ── CoS-E-094-Beifang: die zwei Parkett-Aufpreise nennen keinen Belag ────
  //
  // Gemessen am 23.09.2026, bevor diese Zeilen entstanden sind. `bodenEngine`
  // schreibt den Muster-Aufpreis als eigene Position, und ihr Titel ist der
  // wörtliche Katalogeintrag (`MUSTER_KATALOG`). Bei Vinyl und Laminat steht
  // der Belag darin — `Aufpreis Diagonalverlegung Laminat` — und `istBoden`
  // oben greift. Bei **Parkett** heißen die zwei Einträge nur
  // `Aufpreis Diagonalverlegung` (10,00 €/m²) und
  // `Aufpreis Fischgrät-Verlegemuster` (14,00 €/m²). Darin steht kein Belag,
  // kein Maler-Wort und kein Fliesen-Wort — die Position fiel bis hierher
  // durch alle Regeln und landete beim **Hauptgewerk**.
  //
  // Im reinen Bodenauftrag ist das richtig. Im gemischten Angebot
  // (Parkett diagonal + Wände streichen), dessen Hauptgewerk `maler` ist,
  // filtert der Endpunkt danach auf Kategorien, die mit „Maler" beginnen —
  // dort gibt es keinen Muster-Aufpreis. Kandidatenliste leer, kein Treffer,
  // `unit_price ?? 0`: **10,00 € bzw. 14,00 €/m² werden auf dem Kundenpapier
  // zu 0,00 €, und zwar stumm.** Dieselbe Kette wie PM-117, dieselbe Lehre
  // wie „Boden schützen" (PM-024/PM-026) — nur in die andere Richtung.
  //
  // Die Regel ist bewusst an den beiden Katalogtiteln festgemacht und nicht
  // an `/aufpreis.*diagonal/`: Gemessen über alle 2.374 Katalogzeilen trifft
  // sie genau diese zwei. Die Fliesen-Aufpreise (`… Boden`, `… Wand`,
  // `Aufpreis Fischgrät / Muster / Mosaik`) nennen ihr Bauteil hinter dem
  // Muster und bleiben deshalb Fliesenarbeit — was sie sind.
  const istMusterAufpreisOhneBelag =
    /^\s*aufpreis\s+(?:diagonalverlegung|fischgr(?:ä|ae|a)t-verlegemuster)\s*(?:$|—|–|-)/i.test(text)
  if (istMusterAufpreisOhneBelag) return 'boden_parkett'
  // PM-024/PM-026-Nachtest (Sandy, 2026-08-30): „Boden schützen" enthält kein
  // einziges Maler-Wort — kein „streichen", kein „abdecken". In einem reinen
  // Malerauftrag fiel das nie auf, weil dann ohnehin auf 'maler' gefiltert
  // wurde. In einem GEMISCHTEN Angebot (Laminat + Streichen) landet die
  // Position dagegen beim Hauptgewerk 'boden_parkett' — und der Katalogeintrag
  // „Boden abdecken (Abdeckvlies)" steht unter „Maler – Vorbereitung & Schutz".
  // Ergebnis: kein Kandidat, 0,00 €, „Preis fehlt" bei einer der häufigsten
  // Positionen überhaupt. Bodenschutz ist Vorbereitung des Malers, auch wenn
  // das Wort „Boden" darin vorkommt.
  const istMalerVorbereitung = /boden\s*sch[üu]tz|bodenschutz|abdeckvlies|abdeckfolie|m[öo]bel\s*abdeck/i.test(text)
  if (istMalerVorbereitung) return 'maler'
  // ── PM-117 / PM-060-B: Fliesenarbeit geht VOR der /wand/-Regel ───────────
  //
  // Der Prüfmeister hat den vollen Preisweg eines gewöhnlichen Badangebots
  // gefahren (3,20 × 2,10 m, Wände bis 2,20 m): 543,84 € standen da, wo
  // 2.980,44 € hingehören. Ursache ist die Zeile darunter — `istMaler`
  // prüft `/wand/` vor allem anderen, und damit landen `Wandfliesen
  // verlegen`, `Verfugung Wand` und `Verbundabdichtung Wand` beim Maler.
  //
  // Danach filtert der Endpunkt auf Kategorien, die mit „Maler" beginnen.
  // Im Katalog eines Fliesenlegers gibt es davon **null von 95**: die
  // Kandidatenliste ist LEER, der Matcher bekommt nichts zu sehen, und
  // `unit_price ?? 0` macht daraus eine 0,00-€-Zeile auf dem Kundenpapier.
  // Es ist also kein schlechter Treffer, den ein besserer Wortlaut heilen
  // könnte, sondern eine leere Menge. Gegenprobe Allrounder mit vollem
  // Katalog: dieselbe Summe — der Filter greift VOR dem Matcher.
  //
  // Die Regel steht bewusst HIER und nicht als Ausnahme innerhalb von
  // `istMaler`: `/wand/` ist die tragende Zeile des Malers und bleibt
  // unangetastet. Vorrang bekommt nur, was unmissverständlich Fliesenarbeit
  // ist. Deshalb ist sie eng:
  //
  //  • `fliesen` steht erst NACH `istBoden` — Teppich-, Vinyl- und
  //    Linoleumfliesen sind dort schon abgeholt und kommen hier nie an.
  //  • `verbundabdichtung` gibt es im ganzen Katalog nur unter „Fliesen".
  //  • `verfugen`/`verfugung` ist an `boden`/`wand` gebunden. Ohne diese
  //    Bindung würden `Fugensand einbringen / verfugen` (Garten),
  //    `Außentreppe Klinker neu verfugen` (Fassade) und `Fugen sanieren`
  //    (Rohbau) mitgerissen — drei Gewerke, die hier nichts zu suchen haben.
  //  • Abdecken und Abkleben sind ausgenommen: „Fliesen abdecken" ist
  //    Vorbereitung des Malers, dieselbe Lehre wie bei „Boden schützen".
  const istFliesenarbeit =
    /fliesen|verbundabdichtung|verfug(?:en|ung)\s+(?:boden|wand)/i.test(text)
    && !/abdeck|abkleb|sch[üu]tz/i.test(text)
  if (istFliesenarbeit) return 'fliesen'
  // ── PM-148 / CoS-E-099: Trockenbau, Elektro und SHK gehen VOR der
  //    /wand|decke/-Regel (23.09.2026) ───────────────────────────────────
  //
  // **Es gibt keinen Trockenbauer, und das ist wichtig für das, was hier
  // steht.** `AKTIVE_GEWERKE` (gewerke-config.ts Z. 1–45) kennt genau zwei
  // Einträge — `maler` und `boden_parkett` —, `onboarding/[step]/page.tsx`
  // (Z. 14, 532) rendert nur diese, und `trockenbau`, `elektro`,
  // `sanitaer_heizung` stehen in `INAKTIVE_GEWERKE_IDS`. Die sechs
  // `aktiv: true` in derselben Datei gehören zu `KLEINMATERIAL_CONFIG` und
  // schalten die Kleinmaterial-Pauschale, nicht das Onboarding. (Die
  // ursprüngliche Fassung dieses Kommentars behauptete das Gegenteil; der
  // Chief of Staff hat es am 23.09. um 11:45 nachgemessen und korrigiert.)
  //
  // **Der Fall, den die drei Zweige treffen, ist trotzdem echt:** ein Maler
  // oder Bodenleger diktiert eine fremde Position („die abgehängte Decke
  // einziehen", „den Heizkörper wieder dranmachen"). Sie trägt „Decke" bzw.
  // gar kein Maler-Wort, läuft in `istMaler` oder fällt bis zum Hauptgewerk
  // durch und wird in beiden Fällen dem Maler zugeordnet. Dieselbe Kette wie
  // PM-117 (Bad, 543,84 € statt 2.980,44 €), nur ein Gewerk weiter.
  //
  // ── Zweimal gemessen, weil die erste Messung die falsche Frage beantwortet
  //
  // (a) **Gegen den Katalog des jeweiligen Gewerks** (alle 211 Engine-Titel ×
  //     sechs Hauptgewerke): 76 Kombinationen gehen von 0,00 € auf einen
  //     Preis, **0 verlieren einen Preis**, genau einer ändert sich
  //     (`Wallbox montieren + anschließen`: traf im SHK-Katalog
  //     `Bidet anschließen und montieren`, 180,00 €, Score 0,67 — trifft
  //     jetzt `Wallbox 11kW montieren + anschließen`, 650,00 €, Score 0,86).
  //
  // (b) **Gegen die Preisliste, die ein echter Betrieb hat** — also
  //     `standardpreiseFuerGewerke(['maler'])`, `(['boden_parkett'])` und
  //     beide zusammen, weil genau das im Onboarding eingespielt wird
  //     (`onboarding/[step]/page.tsx` Z. 324): **null Änderung am Geld.**
  //     Die Liste eines Malers trägt nur `Maler …`-Kategorien; die fremde
  //     Position findet vorher wie nachher nichts und steht mit 0,00 € da.
  //
  // **Heute ist der Eingriff also wirkungslos und risikolos, nicht
  // gewinnbringend** — und das ist der ehrliche Satz dazu. Er wirkt erst,
  // wenn eine Preisliste fremde Kategorien trägt: bei einer von Hand
  // ergänzten Zeile, oder mit dem Vokabular-Vorhaben, das Sandy am 23.09.
  // mit „C" auf die Zeit nach Gate 1 gelegt hat. Gebaut ist er jetzt, weil
  // die Zuordnung dann stimmen muss, bevor jemand Preise daran hängt.
  //
  // **Keine sichtbare Nebenwirkung:** der Rückgabewert speist ausschließlich
  // den Kategorie-Filter (`angebot-generieren/route.ts` Z. 88–91). Er wird
  // nicht an der Position gespeichert und erzeugt keine Gewerk-Überschrift
  // auf dem Kundenpapier.
  //
  // Die drei Zweige hängen an **Eigennamen des Gewerks**, nicht an Bauteilen:
  // `wand`, `decke`, `leitung` gehören mehreren Gewerken, `ständerwand`,
  // `wallbox`, `thermostatventil` nur einem.
  //
  // `istMalerHand` ist die Grenze in die Gegenrichtung, und der Grund dafür
  // steht im Katalog: `Heizkörper abschleifen` und `Heizkörper grundieren`
  // sind **Maler**-Einträge, `Heizkörper streichen / lackieren` ebenfalls.
  // Ohne die Ausnahme hätte `heizkörper` sie in die SHK-Spalte gezogen —
  // derselbe Fehler, nur eine Tür weiter. Dieselbe Lehre wie „Boden
  // schützen" (PM-024/026) und „Fliesen abdecken" (PM-117): wer ein fremdes
  // Bauteil VORBEREITET, bleibt Maler.
  const istMalerHand = /abdeck|abkleb|sch[üu]tz|streich|anstrich|lackier|tapez|schleif|grundier|spachtel/i.test(text)
  const istTrockenbau =
    /st(?:ä|ae)nderw(?:and|erk)|abgeh(?:ä|ae)ngte\s+decke|unterdecke|deckensegel|akustikdecke|beplankung|gipskarton|rigips|trockenbau|(?:cw|uw|ua)-profil/i.test(text)
    && !istMalerHand
  if (istTrockenbau) return 'trockenbau'
  const istElektro =
    /steckdose|lichtschalter|einbaustrahler|au(?:ß|ss)enleuchte|wandleuchte|herdanschluss|wallbox|(?:unter|haupt)verteilung|leitungen\s+verlegen|nym-leitung|fi-schalter/i.test(text)
    && !istMalerHand
  if (istElektro) return 'elektro'
  const istSanitaerHeizung =
    /(?<![a-zäöüß])wc(?![a-zäöüß])|waschtisch|badewanne|duschtasse|urinal|bidet|armatur|heizk(?:ö|oe)rper|thermostatventil|rohrleitungen\s+(?:erneuern|verlegen)|trinkwasserleitung/i.test(text)
    && !istMalerHand
  if (istSanitaerHeizung) return 'sanitaer_heizung'
  const istMaler = /wand|decke|streich|anstrich|tapete|raufaser|spachtel|schleifen|grundier|abdeck|abkleb/i.test(text)
  if (istMaler) return 'maler'
  // Dieselbe Falle wie bei „Boden schützen": „Erschwerniszuschlag Raumhöhe
  // > 3m — Büro" enthält kein einziges Maler-Wort. In einem reinen
  // Malerauftrag fiel das nie auf, in einem gemischten Angebot landete der
  // Zuschlag beim Hauptgewerk „boden_parkett" und fand seinen Katalogeintrag
  // unter „Maler – Erschwernisse & Zuschläge" nicht mehr. Alle Zuschläge,
  // die die Vollständigkeitsprüfung erzeugt, sind Maler-Zuschläge.
  if (/^\s*erschwerniszuschlag\b/i.test(text)) return 'maler'
  return hauptgewerk
}
