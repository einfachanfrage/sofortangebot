# Prüfmeister-Testfälle

Gemeinsame Datei von Sandy, dem Prüfmeister und Head of IT — der EINE Ort, an
dem der aktuelle QA-Stand von Sofortangebot steht. Auch der Chief of Staff hat
Zugriff, so wie er auch den Stand von Marketing & Co. kennt — nicht zur
Kontrolle, sondern damit immer klar ist, wo wir stehen.

**Ablauf:** Prüfmeister spricht Testfälle ein und dokumentiert Zum Einsprechen
→ Soll-Lösung → Ist-Ergebnis → Befund. Head of IT (ich) trage nach jedem Fix
ein kurzes **Fix-Update** direkt unter dem jeweiligen Befund ein — was
geändert wurde, wie geprüft, was noch offen ist. Status-Zeile je Fall wird
danach aktualisiert. So muss niemand an zwei Stellen nachschauen.

Jeder Fall hat eine feste ID (PM-XXX) — bei Rückfragen einfach auf die ID
verweisen, dann ist für alle Beteiligten klar, welcher Fall gemeint ist.

**Status-Zeichen:** ✅ behoben & getestet · 🟡 behoben, noch nicht live von
Sandy nachgetestet · ❌ Bug offen · ⏳ noch nicht geprüft.

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-16)

| ID | Thema | Status |
|---|---|---|
| PM-001 | Ausschluss + Selbstkorrektur (Wohnzimmer) | ✅ bestanden, kein Fix nötig |
| PM-002 | Akzentwand + Boden diagonal (Schlafzimmer) | 🟡 beide Bugs behoben, Live-Test steht noch aus |
| PM-003 | Kleinreparatur + Höhenzuschlag (Flur) | 🟡 Grundierung + Fenster-Rückfrage behoben, Grenzfall Boden bewusst nicht angefasst |
| PM-004 | Laminat gerade + Trittschalldämmung (Kinderzimmer) | 🟡 Verschnitt-Bug behoben (Sockelleisten-Fix war schon Teil von PM-002) |
| PM-005 | Zwei Räume, Scope "nur Decke" (Küche/Speisekammer) | 🟡 behoben (schwerster Fund bisher), Live-Test steht noch aus |
| PM-006 | Kleines Fenster + Altbau-Zuschlag (Büro) | ✅ bestätigt bekannter Punkt, keine Dringlichkeit |
| PM-007 | Dachgeschoss: Kniestock + Dachschrägen | ⏳ noch nicht geprüft |
| PM-008 | Fassade | ⏳ noch nicht geprüft |
| PM-009 | Bodenleger-Komplettpaket | ⏳ noch nicht geprüft |
| PM-010 | Sockelleisten-Doppel-Falle | ⏳ noch nicht geprüft |

**Noch offen, bewusst zurückgestellt (niedrige Priorität, siehe PM-003/006):**
1-Cent-Rundungsdrift zwischen Positions-Summe und Gesamtbetrag; fehlende
VOB-Übermessungsregel für kleine Fensteröffnungen.

---

## PM-001 — Ausschluss + Selbstkorrektur (Wohnzimmer)

**Datum:** 2026-08-16
**Status:** ✅ Bestanden — keine Abweichung

**Zum Einsprechen:**
„Also, äh, Wohnzimmer, fünf zwanzig mal vier zehn, Deckenhöhe zwo fünfzig. Wände komplett streichen, zweimal drüber. Ein Fenster — ne halt, zwei Fenster sind da drin, Standardgröße reicht. Eine Tür, normal Maß. Die Decke lassen wir, ist erst letztes Jahr gemacht worden, die bitte NICHT mitrechnen. Sockelleisten kleben wir noch ab, sind aus Holz, werden mitgestrichen.“

**Soll-Lösung:**
- Umfang: 2×(5,20+4,10) = 18,60 lfm
- Wandfläche brutto: 18,60 × 2,50 = 46,50 m²
- Abzug 2 Fenster Standard (1,20×1,00 je): 2,40 m²; 1 Tür Standard (0,90×2,10): 1,89 m²
- Wandflächen streichen 2×: **42,21 m²**
- Decke: **keine Position** (ausdrücklich ausgeschlossen)
- Sockelleisten abkleben — Maler: 18,60 − 0,90 = **17,70 lfm**

**Ist-Ergebnis (aus dem Tool):**
- Wandflächen streichen 2×: 42,21 m² × 9,50 € = 401,00 € ✓
- Boden schützen: 21,32 m² × 1,20 € = 25,58 € (nicht im ursprünglichen Soll, aber fachlich plausibel als automatisch abgeleitete Nebenleistung — kein Fehler)
- Sockelleisten abkleben: 17,7 lfdm × 0,80 € = 14,16 € ✓
- Keine Decken-Position ✓
- Summe: Netto 440,74 € / MwSt 83,74 € / Gesamt 524,48 € — rechnerisch konsistent

**Befund:** Keiner. Selbstkorrektur, expliziter Ausschluss und Gewerk-Zuordnung Sockelleiste liefen alle korrekt.

---

## PM-002 — Akzentwand + Boden diagonal (Schlafzimmer)

**Datum:** 2026-08-16
**Status:** 🟡 Beide Bugs behoben (2026-08-16) — Live-Test durch Prüfmeister steht noch aus

**Zum Einsprechen:**
„Schlafzimmer, vier mal dreieinhalb, Höhe zwo sechzig. Drei Wände weiß streichen, zweimal. Die Wand hinterm Bett kriegt Tapete, sozusagen Akzentwand, der Rest bleibt weiß. Ein Fenster, eine Tür, normal. Boden kriegt Klick-Vinyl, diagonal verlegt. Sockelleisten werden neu montiert, nicht gestrichen, nur montiert.“

**Soll-Lösung:**
- Umfang: 2×(4,00+3,50) = 15,00 lfm; Wandbrutto: 15,00×2,60 = 39,00 m²
- Abzug Fenster 1,20 m² + Tür 1,89 m² → Wandnetto gesamt 35,91 m²
- Akzentwand-Fläche: je nach gewählter Seite 9,10 m² (kurze, 3,50 m) oder 10,40 m² (lange, 4,00 m) — muss klar definiert und der Annahme-Text dazu korrekt sein
- Restwände streichen 2×: Gesamt − Akzentwand
- Boden Klick-Vinyl diagonal: 4,00×3,50 = 14,00 m² + 15% Verschnitt = 16,10 m²
- Sockelleisten montieren — Boden: 15,00 − 0,90 (Tür) = **14,10 lfm**

**Ist-Ergebnis (aus dem Tool):**
- Akzentwand Vliestapete: 10,4 m² × 14,00 € = 145,60 € — Berechnung „4 m × 2,6 m", Annahme-Text sagt „Kürzere Raumseite als Akzentwand angenommen"
- Restwände streichen: 25,51 m² × 9,50 € = 242,35 €
- Deckenfläche streichen 2×: 14 m² × 11,00 € = 154,00 € ✓
- Klick-Vinyl verlegen inkl. 15% Verschnitt: 16,1 m² × 16,00 € = 257,60 € ✓
- Sockelleisten montieren: **15 lfdm** × 5,50 € = 82,50 €
- Summe: Netto 882,05 € / MwSt 167,59 € / Gesamt 1.049,63 € (1 Cent Rundungsdifferenz zur Nachrechnung — vernachlässigbar)

**Befund:**

1. **Akzentwand-Annahme widerspricht der Berechnung**
   - Fundort: `src/lib/mengen/gewerke/maler.ts`, ca. Zeile 349–352
   - Erwartet: Annahme-Text muss zur tatsächlichen Rechnung passen
   - Tatsächlich: Code nimmt `Math.max(laenge, breite)` → längere Seite (4,00 m). Annahme-Text sagt „Kürzere Raumseite als Akzentwand angenommen" — genau das Gegenteil.
   - Abweichung: Handwerker verlässt sich beim Schnellcheck auf den Annahme-Text und wird in die Irre geführt. Zusätzlich: ohne Signal aus dem Text, welche Wand wirklich gemeint ist, ist „automatisch längere Seite" ein Münzwurf — bei diesem Raum macht der Unterschied zwischen 9,10 m² und 10,40 m² schon 18,20 € aus.
   - Fix-Vorschlag: Text und Code angleichen; grundsätzlich klären, ob Default „länger" oder „kürzer" sein soll, oder ob das Tool lieber nachfragt statt zu raten.

2. **Sockelleisten Boden ohne Türabzug**
   - Fundort: `src/lib/mengen/gewerke/boden.ts`, ca. Zeile 102–111
   - Erwartet: 15,00 − 0,90 (Türbreite) = 14,10 lfm — genauso wie bei der Maler-Sockelleiste in `maler.ts`
   - Tatsächlich: 15,00 lfm, kein Türabzug
   - Abweichung: 4,95 € zu teuer beim Kunden, Inkonsistenz zwischen Maler- und Boden-Engine.
   - Fix-Vorschlag: Türbreiten-Abzug in `boden.ts` analog zu `maler.ts` ergänzen.

**Fix-Update (Head of IT, 2026-08-16):** Beide Bugs behoben, root-cause statt
Pflaster.
1. Akzentwand: Code hatte sich vom eigenen Kommentar entfernt (`Math.max`
   statt dokumentiertem `Math.min`) — zurück auf die kürzere Seite, Annahme-
   Text stimmt jetzt wieder mit der Rechnung überein.
2. Sockelleisten-Türabzug: neue gemeinsame Funktion `berechneSockelleistenLaenge`
   (`src/lib/mengen/gewerke/sockelleisten.ts`), von Maler- UND Boden-Engine
   genutzt — damit das nicht wieder auseinanderdriftet.
Golden-Tests PM-002a/PM-002b ergänzt (exakte Mengen, laufen bei jedem
zukünftigen Fix automatisch mit). Noch offen: Sandy testet live nach, ob's
auch im echten Tool stimmt.

---

## PM-003 — Kleinreparatur + Höhenzuschlag + Boden-Ausschluss trotz Erwähnung (Flur)

**Datum:** 2026-08-16
**Status:** 🟡 Großer + kleiner Bug behoben (2026-08-16), Grenzfall bewusst offen gelassen — Live-Test steht noch aus

**Zum Einsprechen:**
„Flur, sechs mal eins fünfzig, Deckenhöhe drei zwanzig — is schon ne hohe Bude hier. Kein Fenster im Flur, aber eine Tür, normal Maß. Wände streichen, zweimal, Decke auch mit. Zwei Dübellöcher spachteln, sonst nix Großes. Boden lass mal weg, der bleibt wie er ist, den nicht anfassen.“

**Soll-Lösung:**
- Umfang: 2×(6,00+1,50) = 15,00 lfm; Wandbrutto: 15,00×3,20 = 48,00 m²
- Kein Fenster-Abzug (explizit ausgeschlossen); 1 Tür Standard 1,89 m² abziehen
- Wandflächen streichen 2×: **46,11 m²**
- Deckenfläche streichen 2×: 6,00×1,50 = **9,00 m²**
- Dübellöcher spachteln: **2 Stück**
- Erschwerniszuschlag Raumhöhe >3m: **1 Pauschale**
- Boden: **keine Position** — weder Streichen noch Schützen, trotz Erwähnung des Worts „Boden“
- Falls eine Grundierung wegen der Reparatur ergänzt wird: nur auf der Reparaturstelle, nicht auf der vollen Wandfläche

**Ist-Ergebnis (aus dem Tool):**
- Wandflächen streichen 2×: 46,11 m² × 9,50 € = 438,05 € ✓ (exakt wie im Soll)
- Dübellöcher spachteln: 2 Stück × 3,00 € = 6,00 € ✓ (Anzahl korrekt erkannt, nicht auf Default 1 zurückgefallen)
- Erschwerniszuschlag Raumhöhe > 3m: 1 Pauschale erkannt ✓ (Preis 0,00 €, das ist gewollt — Nutzer legt Preis fest)
- Boden schützen: 9 m² × 1,20 € = 10,80 €
- Sockelleisten abkleben: 14,1 lfdm × 0,80 € = 11,28 €
- **Voranstrich / Grundierung: 46,11 m² × 6,00 € = 276,66 €**
- Netto gesamt: 742,78 €
- Vor der Fenster-Frage: Rückfrage-Screen fragte explizit „Wie viele Fenster hat 'Flur'?" trotz gesprochenem „kein Fenster im Flur"

**Befund:**

1. **Größter Fund: Grundierung auf volle Wandfläche statt nur Reparaturstelle — teuer und still**
   - Fundort: `src/lib/vollstaendigkeit/maler-basis.ts`, Funktion `pruefeGrundierung`, ca. Zeile 103–112
   - Erwartet: Nach Reparatur (2 Dübellöcher) ist eine Grundierung fachlich zwar richtig gedacht — aber nur auf der geflickten Stelle, ein paar Handbreit, keine paar Euro.
   - Tatsächlich: Grundierung wird auf `wandPos.menge` gesetzt, also die komplette Wandfläche (46,11 m²) → 276,66 €.
   - Abweichung: 276,66 € von 742,78 € Netto — über ein Drittel des ganzen Angebots — für zwei Dübellöcher. Das ist der teuerste und gefährlichste Fehler von allen drei Testfällen, weil er auf den ersten Blick plausibel aussieht (Grundierung nach Reparatur ist ja grundsätzlich richtig) und deshalb leicht durchrutscht.

2. **Rückfrage nach Fensteranzahl trotz explizitem „kein Fenster"**
   - Fundort: `src/lib/kontext-analyzer.ts`, ca. Zeile 149–156
   - Erwartet: Wenn der Text „kein Fenster" enthält (wird an anderer Stelle, `maler.ts` Zeile 103, korrekt als `keinFenster`-Signal erkannt und für die Berechnung genutzt), sollte die Rückfrage nach Fenster-Anzahl gar nicht erst kommen.
   - Tatsächlich: Rückfragen-Generator prüft nur, ob `raum.fenster` ein leeres Array ist — die transkriptweite Verneinung wird hier nicht mitgelesen. Frage kam trotzdem.
   - Abweichung: Kein teurer Fehler (Endergebnis mit 0 Fenstern stimmt, nachdem manuell beantwortet), aber unnötiger Klick und wirkt so, als würde das Tool nicht zuhören.

3. **Grenzfall: Boden schützen + Sockelleisten abkleben trotz „Boden lass mal weg, nicht anfassen"**
   - Für mich kein harter Fehler: „nicht anfassen" heißt fachlich „keine Bodenarbeiten", schützt aber nicht davor, dass beim Streichen Farbe tropft — Abdecken bleibt sinnvoll, genau wie in PM-001. Trage ich hier nur ein, falls ihr die Ausschluss-Erkennung strenger auslegen wollt als ich.

**Insgesamt zu diesem Fall:** Wandfläche, Dübellöcher-Stückzahl und Höhenzuschlag laufen sauber. Der Grundierungs-Fehler ist der mit Abstand wichtigste Fund aus allen drei Testfällen bisher — bitte zuerst angehen.

**Fix-Update (Head of IT, 2026-08-16):**
1. **Grundierung:** Erfindet jetzt keine Fläche mehr für Kleinreparaturen. Ohne
   echtes Vollflächen-Signal im Rohtext (Neubau/Erstanstrich/Tiefengrund/
   Grundieren wörtlich genannt) landet „Grundierung" nur noch als Erinnerung
   in der Liste offener Punkte — der Handwerker trägt die reale
   Reparaturfläche selbst ein, statt dass das Tool 276,66 € für zwei
   Dübellöcher erfindet.
2. **Fenster-Rückfrage trotz „kein Fenster":** behoben — der Rückfragen-
   Generator nutzt jetzt dasselbe `keinFenster`/`keineTuer`-Signal, das die
   Berechnung schon vorher korrekt genutzt hat.
3. **Grenzfall Boden schützen/Sockelleisten:** bewusst NICHT verändert — dein
   eigener Einschätzung nach kein Fehler, siehe Punkt 3 oben.

**Nebenfund beim Testen (2026-08-16):** Beim Bauen des Tests für diesen Fall
ist noch ein unabhängiger Bug aufgefallen, der NICHT in deinen ursprünglichen
3 Befunden stand: die Deckenfläche verschwand komplett aus Fällen wie „Wände
streichen, zweimal, Decke auch mit" — einmal wegen Kommas in einer alten
Text-Erkennung, einmal weil „Deckenhöhe drei zwanzig" fälschlich als „Decke
wird gestrichen" gelesen wurde. Beides jetzt auch behoben (siehe Golden-Test
PM-003 in `golden-korrekturen.test.ts`, prüft jetzt Wand UND Decke).

---

## PM-004 — Laminat gerade verlegt + Trittschalldämmung (Verschnitt-Grundsatzfrage)

**Datum:** 2026-08-16
**Status:** 🟡 Verschnitt-Bug behoben (2026-08-16), Trittschalldämmung war schon korrekt — Live-Test steht noch aus

**Zum Einsprechen:**
„Kinderzimmer, vier mal drei, Höhe zwo sechzig. Laminat, ganz normal gerade verlegt, keine Muster oder so. Drunter kommt noch ne Trittschalldämmung."

**Soll-Lösung:**
- Fläche: 4,00×3,00 = 12,00 m²
- Laminat verlegen: nach Fachwissen-Standard 5% Verschnitt bei gerader Verlegung = **12,60 m²**
- Trittschalldämmung als eigene Position: **12,00 m²**

**Worauf achten:**
- Fundort für den Verschnitt-Verdacht: `src/lib/mengen/gewerke/boden.ts`, Funktion `standardVerschnitt`, ca. Zeile 29–35 — dort steht pauschal 10% für Laminat/Vinyl/Linoleum, unabhängig von der Verlegerichtung. Falls das Tool 13,20 m² statt 12,60 m² ausgibt, bestätigt das die Vermutung: bei gerader Verlegung wird systematisch der doppelte Verschnitt berechnet.
- Trittschalldämmung wird an anderer Stelle ergänzt (`src/lib/vollstaendigkeit/boden-sonder.ts`, `pruefeTrittschalldaemmung`, ca. Zeile 236–261) — die Funktion triggert eigentlich schon allein bei „Klick-Vinyl", trotzdem fehlte sie in PM-002. Hier jetzt mit „Trittschalldämmung" wörtlich genannt — kommt sie diesmal?

**Ist-Ergebnis (aus dem Tool):**
- Rückfrage kam zuerst: „Muss der alte Bodenbelag entfernt werden?" — sinnvoll, war im Transkript nicht erwähnt, keine Kritik. Mit „Ja, raus" beantwortet.
- Laminat verlegen inkl. **10% Verschnitt**: 13,2 m² × 18,00 € = 237,60 €
- Altbelag entfernen: 12 m² × 12,00 € = 144,00 €
- Sockelleisten montieren: 14 lfdm × 5,50 € = 77,00 € (nicht erwähnt, automatisch ergänzt — bei Belagwechsel fachlich plausibel, siehe Befund 2)
- Trittschalldämmung: 12 m² × 4,50 € = 54,00 € ✓ (diesmal korrekt da, keine Ergänzung nötig)
- Netto 512,60 € / MwSt 97,39 € / Gesamt 609,99 € — rechnerisch konsistent

**Befund:**

1. **Verschnitt-Bug bestätigt: 10% statt 5% bei gerader Verlegung**
   - Fundort: `src/lib/mengen/gewerke/boden.ts`, Funktion `standardVerschnitt`, ca. Zeile 29–35
   - Erwartet: 12,00 m² × 1,05 = 12,60 m² (Fachwissen-Standard: gerade Verlegung ca. 5%)
   - Tatsächlich: 12,00 m² × 1,10 = 13,20 m²
   - Abweichung: 0,60 m² zu viel Material, 10,80 € zu teuer — allein in diesem kleinen Kinderzimmer. Da der Code den Verschnitt pauschal auf 10% für Laminat/Vinyl/Linoleum setzt (nur diagonal geht auf 15% hoch, „gerade" wird nirgends separat behandelt), zieht sich das vermutlich durch **jedes** Angebot mit gerade verlegtem Plattenboden. Das ist der wichtigste Fund aus PM-004 — bitte mit hoher Priorität prüfen, weil er nicht nur diesen einen Fall betrifft.

2. **Sockelleisten montieren ohne Türabzug — strukturell, nicht nur ein Rechenfehler**
   - Fundort: `src/lib/mengen/gewerke/boden.ts`, Zeile 42–53 (Raum-Destrukturierung) und Zeile 102–111 (Sockelleisten-Position)
   - Die Boden-Engine erfasst für Räume gar keine Türen/Fenster-Felder — anders als die Maler-Engine. Deshalb kann die Sockelleisten-Position dort strukturell nie eine Tür abziehen, das ist nicht nur eine vergessene Zeile wie in PM-002 vermutet, sondern es fehlt das Datenfeld komplett. Selbe Abweichung wie in PM-002: 14,00 lfdm statt 14,00 − Türbreite.

**Positiv:** Trittschalldämmung kam diesmal korrekt als eigene Position — der Fehlschlag in PM-002 war also entweder ein Einzelfall oder tritt nur auf, wenn die Dämmung nicht wörtlich genannt wird, sondern nur aus „Klick-Vinyl" abgeleitet werden müsste. Wert für Head of IT: die implizite Ableitung (`pruefeTrittschalldaemmung` triggert laut Code schon bei „klick-vinyl" allein) scheint unzuverlässiger zu sein als die explizite Nennung.

**Fix-Update (Head of IT, 2026-08-16):**
1. **Verschnitt:** `standardVerschnitt()` gibt jetzt 5% für gerade verlegte
   Plattenware (Laminat/Vinyl/Linoleum) statt pauschal 10% — Diagonalverlegung
   bleibt unverändert bei 15%. Betraf laut deiner Einschätzung vermutlich
   jedes Angebot mit gerade verlegtem Plattenboden, nicht nur diesen Fall.
2. **Sockelleisten ohne Türabzug:** war schon durch den PM-002-Fix miterledigt
   (gemeinsame Funktion `berechneSockelleistenLaenge`, siehe dort) — hier
   nochmal bestätigt.
Golden-Test PM-004 ergänzt (prüft 12,60 m² statt 13,20 m²).
Implizite Trittschalldämmung-Ableitung (dein Randbefund) noch nicht
untersucht — kein akuter Fehler in diesem Fall, aber vorgemerkt.

---

## PM-005 — Zwei Räume, Duplikat-Falle + Scope „nur Decke" darf nicht überspringen

**Datum:** 2026-08-16
**Status:** 🟡 Behoben (2026-08-16) — schwerster Fund bisher, root-cause gefixt, Live-Test steht noch aus

**Zum Einsprechen:**
„Zwei Räume: Küche, dreieinhalb mal zwo achtzig, Höhe zwo fünfzig, Wände und Decke komplett streichen, zweimal. Daneben die Speisekammer, auch dreieinhalb mal zwo achtzig, Höhe genauso — aber da nur die Decke streichen, zweimal, die Wände lassen wir in Ruhe."

**Soll-Lösung:**
- Küche: Umfang 2×(3,50+2,80)=12,60 lfm; Wandbrutto 12,60×2,50=31,50 m²; minus Standard-Fenster 1,20 + Standard-Tür 1,89 → Wandflächen streichen 2×: **28,41 m²**; Decke 3,50×2,80= **9,80 m² 2×**
- Speisekammer: nur Decke **9,80 m² 2×**, **keine Wandposition**

**Worauf achten:** Bleiben beide Räume unter eigenem Namen (nicht beide „Küche")? Bleibt „nur Decke" auf die Speisekammer beschränkt, ohne dass die Küche dadurch ihre Wandposition verliert (Scope-Bleed zwischen Räumen, siehe Kommentar zu `scopeTxt` in `src/lib/mengen/gewerke/maler.ts` ca. Zeile 200–207)?

**Ist-Ergebnis (aus dem Tool):**
- Rückfragen liefen für beide Räume durch: Küche → Türen 2, Fenster 1 (von mir frei gewählt, da im Transkript nicht genannt — das ist kein Fehler, Rückfrage war berechtigt). Speisekammer → Höhe erneut abgefragt trotz „Höhe genauso" (2,50 m manuell nachgetragen), Türen 1, Fenster 0.
- Auf der Aufnahme-Karte zeigte „Küche" als Leistungen **zweimal „Decke streichen" und kein „Wände streichen"** — obwohl ich für die Küche ausdrücklich „Wände UND Decke komplett streichen" gesagt habe.
- Im fertigen Angebot (2026-543F, 270,56 €) gibt es nur eine Raumgruppe „KÜCHE" mit genau drei Positionen: Deckenfläche streichen 2× (9,8 m² × 11,00 € = 107,80 €) — **zweimal identisch untereinander** — und Boden schützen (9,8 m² × 1,20 € = 11,76 €). Eine eigene „SPEISEKAMMER"-Raumgruppe taucht in der Positionsliste nicht auf.
- Die Netto-Summe (227,36 €) ergibt sich exakt aus diesen drei Positionen (107,80 + 11,76 + 107,80) — es fehlt rechnerisch kein Cent auf einen vierten, unsichtbaren Posten. Das spricht stark dafür, dass wirklich nichts weiter im Angebot steckt.

**Befund:**

1. **Speisekammer verschwindet als eigener Raum — Küche verliert ihre Wandposition (schwerster Fund bisher)**
   - Erwartet: Zwei getrennte Raumgruppen. Küche mit Wandflächen 2× (~28 m² je nach Türen/Fenstern) + Decke 2× (9,8 m²). Speisekammer mit nur Decke 2× (9,8 m²), eigene Raumgruppe, eigener Name.
   - Tatsächlich: Nur eine Raumgruppe „Küche" mit zwei baugleichen „Deckenfläche streichen 2×"-Positionen (9,8 m², 107,80 €) und ganz ohne Wandflächen-Position. Meine Lesart: die zweite „Decke"-Position ist eigentlich die der Speisekammer, die aber unter „Küche" gelandet ist statt in einer eigenen Raumgruppe — und Küches eigene Wandfläche ist dabei komplett verloren gegangen.
   - Abweichung: Der Kunde bekommt ein Angebot, in dem „Speisekammer" nirgends als eigener Posten auftaucht, obwohl 3 eigene Rückfragen dafür beantwortet wurden — und in dem die Küchenwände (der größte Batzen von diesem Auftrag) komplett fehlen. Das ist ein stiller, teurer Fehler: das Angebot sieht auf den ersten Blick vollständig aus (3 Positionen, Preis draufsteht), ist aber inhaltlich falsch und um die Wandflächen zu billig.
   - **Bestätigt (2026-08-16):** Speisekammer taucht nirgends im Angebot auf — durchgescrollt und geprüft. Kein Grenzfall, harter Bug.
   - Für Head of IT als Ausgangspunkt: das deterministische Scope-Handling in `src/lib/mengen/gewerke/maler.ts` (ca. Zeile 200–207) hat extra eine Sperre eingebaut, damit „nur Decke" bei mehreren Räumen nicht über die Grenzen bleedet — die greift hier anscheinend nicht bzw. das Problem entsteht vermutlich schon eine Ebene früher, bei der GPT-Extraktion der Raum-Arbeiten (jeder Raum bekommt sein eigenes `arbeiten[]`-Array, und genau da scheint „Decke" der Speisekammer in die Küche zu rutschen).

**Sonst:** Der Rückfragen-Flow selbst (Höhe/Türen/Fenster pro Raum einzeln) lief für beide Räume sauber durch, auch bei zwei fast identischen Räumen wurden keine Maße oder Namen verwechselt — das Duplikat-Namen-Problem, das ich befürchtet hatte, trat nicht auf.

**Fix-Update (Head of IT, 2026-08-16):** Root-Ursache gefunden und behoben —
genau das strukturelle Muster, das der Audit befürchtet hat: eine Stufe hat
nochmal den ganzen Rohtext gelesen statt nur die schon geprüfte Struktur.
Die "nur Decke"-Prüfung lief bisher über EINEN globalen Wert für den ganzen
(Mehrraum-)Auftrag — sagte die Speisekammer "nur Decke", flog auch die Wand
der Küche raus, obwohl die nie eingeschränkt wurde. Die Mengen-Engine selbst
war die ganze Zeit korrekt (im Debug bestätigt: alle 5 Positionen richtig
berechnet); der Fehler saß erst in der Vollständigkeitsprüfung danach, die
Küches Wand- und Sockelleisten-Position wieder gelöscht hat.

Fix: Der Scope wird jetzt PRO RAUM aus dessen eigener, schon geprüfter
`arbeiten[]`-Liste gebildet (nicht mehr aus dem Rohtext), und beim Filtern
schaut jede Position zuerst auf den Scope ihres EIGENEN Raums. Golden-Test
PM-005 ergänzt (Küche behält ihre Wände, Speisekammer bekommt garantiert
keine). Noch offen: Sandy testet live nach, ob auch die Raumgruppen im
fertigen Angebot jetzt sauber getrennt erscheinen (Küche/Speisekammer).

---

## PM-006 — Kleines Fenster (Übermessungsfrage) + Altbau-Zuschlag

**Datum:** 2026-08-16
**Status:** ✅ Wie erwartet — bestätigt bekannten Punkt, keine Überraschung; 1 neue Randbeobachtung

**Zum Einsprechen:**
„Büro, Altbau, drei mal drei, Höhe zwo vierzig. Ein kleines Fenster, fünfzig mal sechzig, sonst nix Besonderes. Wände und Decke streichen, zweimal."

**Soll-Lösung:**
- Umfang 12,00 lfm; Wandbrutto 12,00×2,40=28,80 m²
- Fachlich korrekt nach VOB (Öffnung 0,30 m², unter der 2,5 m²-Grenze für Übermessung): kein Abzug fürs Fenster, nur Standard-Tür 1,89 m² abziehen → **26,91 m²**
- Erschwerniszuschlag Altbau: **1 Pauschale**

**Worauf achten:** Erwartung ist, dass das Tool das kleine Fenster trotzdem 1:1 abzieht (26,61 m² statt 26,91 m²) — das bestätigt mit echten Zahlen die fehlende Übermessungslogik für kleine Öffnungen (bekannter Punkt, kein neuer Fund). Zusätzlich 20 Sekunden nach dem Erstellen auf die Summe schauen (Race-Condition-Check).

**Ist-Ergebnis (aus dem Tool):**
- Wandflächen streichen 2×: 26,61 m² × 9,50 € = 252,79 € — exakt wie erwartet, kleines Fenster (0,30 m²) wurde 1:1 abgezogen
- Deckenfläche streichen 2×: 9 m² × 11,00 € = 99,00 € ✓
- Boden schützen: 9 m² × 1,20 € = 10,80 € (automatisch ergänzt, nicht erwähnt — wie in PM-001/PM-003 fachlich plausibel)
- Sockelleisten abkleben: 11,1 lfdm × 0,80 € = 8,88 € (automatisch ergänzt; Umfang 12,00 − Türbreite 0,90 = 11,10 — Türabzug hier korrekt, da Maler-Sockelleiste)
- Erschwerniszuschlag Altbau: 1 Pauschale erkannt, Preis 0,00 € (gewollt) — nach manueller Preiseingabe (100,00 €/pauschal) korrekt ins Angebot übernommen
- Vor Preiseingabe: Netto 371,47 € / MwSt 70,58 € / Gesamt 442,06 €
- Nach Preiseingabe: Netto 471,47 € / MwSt 89,58 € / Gesamt 561,06 €

**Befund:**

1. **Bestätigt, kein neuer Fund:** Übermessungsregel für kleine Öffnungen (VOB/DIN 18363) ist nicht implementiert — 26,61 m² statt fachlich korrekten 26,91 m². 0,30 m² Differenz, macht bei diesem Preis 2,85 €. Klein hier, aber jetzt mit echten Zahlen belegt statt nur Verdacht.
2. **Randbeobachtung — 1-Cent-Rundungsdrift, jetzt zum zweiten Mal gesehen:** Netto+MwSt ergibt rechnerisch 442,05 € bzw. 561,05 €, angezeigt werden aber 442,06 € bzw. 561,06 €. Gleiches Muster wie schon in PM-002 (dort 1049,64 € erwartet vs. 1049,63 € angezeigt, nur in die andere Richtung). Für sich genommen nicht der Rede wert, aber zwei Treffer aus zwei Tests deuten auf einen systematischen Rundungs-Unterschied hin — vermutlich wird pro Position brutto gerundet und dann aufsummiert, statt einmal auf die Gesamtsumme. Reine Beobachtung, keine Dringlichkeit.
3. Race-Condition-Check (20 Sekunden warten) habe ich nicht dokumentiert bekommen — offen, ob das noch gemacht wurde.

**Sonst:** Erschwerniszuschlag Altbau wurde korrekt erkannt und als Pauschale angelegt, Einheit „pauschal" war im Preis-Dialog schon sinnvoll vorausgewählt.

---

## PM-007 — Dachgeschoss: Kniestock + Dachschrägen + Dachfenster

**Datum:** 2026-08-16
**Status:** ❌ Kompletter Fehlschlag — Dachgeschoss-Zweig wurde gar nicht aktiviert

**Zum Einsprechen:**
„Dachzimmer, fünf mal dreieinhalb. Kniestock ist eins zwanzig hoch. Die Dachschrägen links und rechts jeweils zwölf Quadratmeter. Ein Dachfenster drin, normale Größe. Wände, Schrägen und Kniestock alles streichen, zweimal."

**Soll-Lösung:**
- Kniestockwände: Umfang 2×(5,00+3,50)=17,00 lfm × 1,20 m = **20,40 m²**
- Dachschrägen: links 12 + rechts 12 = 24,00 m² brutto, minus 1 Dachfenster Standard (0,78×1,18=0,92 m²) = **23,08 m²**
- Kein Deckenspiegel (nicht erwähnt) — keine eigene Position dafür
- Keine normale „Wandflächen streichen"-Position — wäre falscher Zweig

**Worauf achten:**
- Wird der Dachgeschoss-Zweig überhaupt erkannt (braucht `kniestockhoehe` aus der Extraktion), oder rutscht das in die normale Wandflächen-Berechnung?
- Kommen Kniestock und Dachschrägen als zwei getrennte Positionen mit den oben genannten Flächen?
- Wird das Dachfenster von der Schrägenfläche abgezogen?
- Fundort/Vorab-Hinweis: In `src/lib/mengen/gewerke/maler.ts`, Dachgeschoss-Zweig (ca. Zeile 295–342), fehlt bei „Kniestockwände streichen" und „Dachschrägen streichen" die „{anstriche}x"-Kennzeichnung im Positionstext, die der normale Zweig hat — rein kosmetisch (Menge/Preis unberührt), aber auf dem Papier sieht's dann so aus, als wäre nur 1× Anstrich drin. Schau, ob das im Ergebnis auch so aussieht.

**Ist-Ergebnis (aus dem Tool):**
- Erkennungskarte zeigte 3 getrennte Leistungen: „Wände streichen", „Dachschrägen streichen", „Kniestock streichen" — schon hier ein schlechtes Zeichen, weil ein Dachzimmer ohne genannte Giebelwand eigentlich nur Kniestock + Schräge hat, nicht noch eine dritte „Wände"-Leistung.
- Rückfragen waren komplett generisch: „Wie hoch sind die Wände in Dachzimmer?" (2,60 m gewählt), „Wie viele Türen/Fenster?", „Wie groß ist die Bodenfläche?" (5 × 3,5 erneut eingegeben). Keine einzige Rückfrage zur Kniestockhöhe oder zu den Dachschrägenflächen — obwohl beides im Transkript klar genannt wurde („Kniestock eins zwanzig hoch", „Dachschrägen links und rechts je zwölf Quadratmeter").
- Fertiges Angebot (2026-03EE, 175,98 €) enthält **nur**: Wandflächen streichen 2× (12 m² × 9,50 € = 114,00 €), Boden schützen (17,5 m² × 1,20 € = 21,00 €), Sockelleisten abkleben (16,1 lfdm × 0,80 € = 12,88 €). Weder „Kniestockwände" noch „Dachschrägen" tauchen als eigene Position auf.
- Die 12 m² bei „Wandflächen streichen" lassen sich nicht aus den angezeigten Raumdaten (3,5 × 5 m, Höhe 2,6 m, 1 Tür, 1 Fenster) nachrechnen — nach Standardformel (Umfang 17,00 lfm × 2,60 m − Fenster − Tür) käme man auf rund 41 m², nicht 12 m².

**Befund:**

1. **Kompletter Fehlschlag des Dachgeschoss-Zweigs**
   - Fundort: die Aktivierungsbedingung `istDachgeschoss` in `src/lib/mengen/gewerke/maler.ts`, ca. Zeile 87, greift nur wenn `kniestockhoehe`, `dachschraege_links_m2`/`_rechts_m2` oder `deckenspiegel_m2` aus der Extraktion gefüllt sind. Die Rückfragen legen nahe, dass keins davon gesetzt wurde — der Raum ist komplett in den normalen Wandflächen-Zweig gerutscht.
   - Erwartet: Kniestockwände (20,40 m²) und Dachschrägen (23,08 m² netto) als zwei eigene Positionen.
   - Tatsächlich: Beides fehlt vollständig. Stattdessen eine einzelne „Wandflächen streichen"-Position mit einer Zahl (12 m²), die sich nicht aus den angezeigten Maßen herleiten lässt — es steckt also vermutlich noch ein zweiter Fehler in der Berechnung selbst, on top von der fehlenden Zweig-Aktivierung.
   - Einordnung: Das ist der schwerste strukturelle Fund bisher, gleichauf mit PM-005. Die komplette Produktkategorie „Dachgeschoss/Kniestock/Dachschräge" scheint vom Aufnahme-Schritt an nicht zu funktionieren, nicht nur an einer einzelnen Berechnungsstelle. Bitte zuerst bei der Extraktion (wie wird `kniestockhoehe` aus der Sprache erkannt?) ansetzen, dann erst bei der Menge nachschauen.

---

## PM-008 — Fassade (kein Raum, kein Boden, keine Decke)

**Datum:** 2026-08-16
**Status:** ❌ Blockierender Fehler — Tool erzeugt gar kein Angebot

**Zum Einsprechen:**
„Fassade an der Südseite, zwölf Meter lang, Giebelhöhe im Schnitt sechs Meter. Drei Fenster drin, eins zwanzig mal eins vierzig. Fassadenfarbe zweimal drauf, dazu vorher Grundierung."

**Soll-Lösung:**
- Wandbrutto: 12,00×6,00=72,00 m²
- Minus 3 Fenster (1,20×1,40=1,68 m² je Fenster) = 5,04 m²
- Wandflächen streichen 2×: **66,96 m²**
- Grundierung auf gleicher Fläche: **66,96 m²**
- Keine Boden-, Decken- oder „Boden schützen"-Position — eine Fassade hat keinen Innenraum

**Worauf achten:**
- Kommt wirklich keine Boden-/Deckenposition rein? Das wäre ein grober handwerklicher Unsinn bei einer Außenfassade.
- Wie heißt die Position — steht da „— Fassade" oder „— Raum"? In `src/lib/mengen/gewerke/maler.ts` steht die Liste der erkannten Raumtypen (ca. Zeile 90), „Fassade" ist dort nicht enthalten. Falls GPT den Raumnamen generisch als „Raum" zurückgibt, wird er nicht aus dem Transkript korrigiert — Positionstitel würde dann „— Raum" heißen statt „— Fassade", was beim schnellen Prüfen verwirrt.
- Landet die Grundierung auf exakt derselben Fläche wie die Fassadenfarbe?

**Ist-Ergebnis (aus dem Tool):**
- Raum wurde „Südseite" genannt (aus „an der Südseite" abgeleitet) — nicht mein vermuteter Fehlname „Raum", also unbegründete Sorge, das lief sauber.
- **Massе: 1,20 × 1,40 m.** Das sind die Fenstermaße aus dem Transkript, nicht die Fassadenmaße (12 m lang, 6 m hoch)! Die Extraktion hat die falschen Zahlen für die Grundfläche genommen.
- Fenster: 3 korrekt erkannt.
- Danach: roter Banner „Keine Positionen erkannt", und die Entwurfsansicht ließ sich nicht mehr öffnen — das Angebot blieb stecken.

**Befund:**

1. **Blockierender Fehler: Fassade mit Fenstermaßen statt Fassadenmaßen extrahiert, Ergebnis: kein Angebot**
   - Erwartet: Fassadenmaße 12 × 6 m erkannt, Wandfläche 66,96 m² netto.
   - Tatsächlich: 1,20 × 1,40 m als Grundfläche verwendet (das sind exakt die genannten Fenstermaße). Mit 3 Fenstern à 1,20×1,40 = 5,04 m² Abzug von einer Bruttofläche von nur 1,68 m² (1,20×1,40) geht die Rechnung natürlich ins Negative — vermutlich deshalb „Keine Positionen erkannt": die Menge wird 0 oder negativ und komplett verworfen, statt dass eine Rückfrage kommt.
   - Abweichung: Das ist kein Zahlendreher, den man in 10 Sekunden korrigiert — der Nutzer bekommt gar kein Angebot, landet in einer Sackgasse und muss von vorn anfangen. Schlimmer als jeder bisherige Fund, weil das Tool hier komplett verweigert statt (auch falsch) zu liefern.
   - Für Head of IT: Vermutlich ein Extraktionsfehler bei der Fassaden-Erkennung (`laenge`/`hoehe` ohne `breite`, siehe `src/lib/mengen/gewerke/maler.ts` Zeile 126–136) — die GPT-Extraktion scheint die zuletzt im Satz genannten Zahlen (Fenstermaße) statt der Fassadenmaße ins `laenge`/`hoehe`-Feld zu packen. Zusätzlich: das Tool sollte bei einer Menge ≤ 0 nicht einfach schweigen, sondern eine Warnung oder Rückfrage auslösen statt „Keine Positionen erkannt" ohne Ausweg.

---

## PM-009 — Bodenleger Komplettpaket: Altbelag, Ausgleich, Vinyl gerade, Sockelleisten, Übergangsschiene

**Status:** ⏳ Noch nicht getestet

**Zum Einsprechen:**
„Flur, vier mal eins achtzig. Alter Teppich muss komplett raus und entsorgt werden, Untergrund ist uneben, den gleich mit ausgleichen. Dann Vinylboden drauf, ganz normal gerade verlegt. Neue Sockelleisten drumrum. Am Übergang zum Wohnzimmer brauchen wir noch ne Übergangsschiene."

**Soll-Lösung:**
- Fläche: 4,00×1,80=7,20 m²
- Altbelag entfernen: **7,20 m²**
- Untergrundvorbereitung/Ausgleich: **7,20 m²**
- Vinyl verlegen gerade: nach Fachwissen-Standard 5% Verschnitt = **7,56 m²**
- Sockelleisten montieren: Umfang 2×(4,00+1,80)=11,60 lfm
- Übergangsschiene: **1 eigene Position** (Stück oder lfdm, an der Tür zum Wohnzimmer)

**Worauf achten:**
- Verschnitt-Bug aus PM-004 nochmal, diesmal bei Vinyl statt Laminat: kommt 7,56 m² oder wieder 7,92 m² (10%)? Falls auch hier 10%, ist bestätigt, dass es alle Plattenware gleichermaßen betrifft, nicht nur Laminat.
- Taucht die Übergangsschiene überhaupt als eigene Position auf? Ich habe im Code keine Stelle gefunden, die dafür eine Position erzeugt — Verdacht auf echte Lücke, nicht nur eine Fehlberechnung.

---

## PM-010 — Sockelleisten-Doppel-Falle: alte raus, neue montiert, dann gestrichen

**Status:** ⏳ Noch nicht getestet

**Zum Einsprechen:**
„Gästezimmer, drei fünfzig mal drei, Höhe zwo sechzig. Die alten Sockelleisten kommen raus, neue werden montiert, weiße MDF-Leisten. Die sollen dann auch noch gestrichen werden, passend zur Wand. Wände und Decke streichen, zweimal."

**Soll-Lösung:**
- Umfang: 2×(3,50+3,00)=13,00 lfm
- Wandflächen streichen 2× (Standardannahmen 1 Fenster, 1 Tür, Höhe 2,60): 13,00×2,60=33,80 minus 1,20 minus 1,89 = **30,71 m²**
- Deckenfläche streichen 2×: 3,50×3,00= **10,50 m²**
- **Boden-Gewerk:** Sockelleisten montieren (neu): 13,00 lfm
- **Maler-Gewerk:** Sockelleisten streichen: eigene Position, 13,00 lfm (minus Türbreite, falls die Maler-Engine das hier richtig macht)

**Worauf achten:** Das ist die im Fachwissen explizit benannte klassische Falle, hier bewusst als Doppel-Fall gebaut — alte Leisten raus + neue montiert (Boden) UND gestrichen (Maler), im selben Satz. Erwartung: zwei getrennte Positionen in zwei Gewerken. Verdacht: die Maler-Engine kennt nach meinem Code-Blick nur „Sockelleisten abkleben" (Schutz vorm Streichen der Wand) als Sockelleisten-Position, aber keine eigene „Sockelleisten streichen"-Position für das tatsächliche Lackieren der Leisten selbst. Wenn das stimmt, fehlt eine ganze Leistung im Angebot, obwohl sie ausdrücklich verlangt wurde — das wäre wieder ein stiller Fehler.
