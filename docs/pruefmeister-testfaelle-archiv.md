# Prüfmeister-Testfälle — Archiv (abgeschlossene Fälle)

Ausgelagert aus `pruefmeister-testfaelle.md` am 2026-08-19, damit die aktive
Datei klein und weniger fehleranfällig bleibt (siehe Hinweis dort). Hier
liegen nur Fälle, die vollständig abgeschlossen sind: behoben, live von
Sandy nachgetestet, nichts mehr offen. Die Kurzfassung/Status jedes Falls
steht weiterhin in der Übersichtstabelle der Hauptdatei — hier steht nur die
volle historische Diskussion, falls sie mal gebraucht wird. Diese Datei wird
selten bis nie wieder bearbeitet, nur ergänzt, wenn ein weiterer Fall aus der
Hauptdatei fertig wird.

---

## PM-002 — Akzentwand + Boden diagonal (Schlafzimmer)

**Datum:** 2026-08-16
**Status:** ✅ Beide Bugs behoben und live nachgetestet — bestätigt

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

**Nachtest (2026-08-16, späterer Durchlauf):** ✅ Beide Bugs gefixt. Gleiches Schlafzimmer (3,5×4, Akzentwand, Klick-Vinyl diagonal): Akzentwand-Fläche ist jetzt 9,1 m² (3,5 m × 2,6 m = die tatsächlich kürzere Seite), und der Annahme-Text „Kürzere Raumseite als Akzentwand angenommen" stimmt jetzt mit der Rechnung überein. Sockelleisten montieren zeigt jetzt 14,1 lfdm (15,00 − 0,90 Türbreite) statt vorher 15,00 lfdm. Rest (Restwände 26,81 m², Klick-Vinyl 16,1 m²) unverändert korrekt, Summe (717,24 € Netto) passt exakt zusammen.

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
**Status:** ✅ Alle drei Punkte live bestätigt behoben (Grundierung weg, Fenster zeigt sauber „0" statt rotem „!", Werte weiterhin exakt); Grenzfall Boden bewusst offen gelassen, kein Fehler

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

**Nachtest (2026-08-16, späterer Durchlauf):** ✅ Grundierungs-Bug ist weg. Gleicher Raum (Flur, 6×1,5×3,2, 2 Dübellöcher) — diesmal **keine** „Voranstrich/Grundierung"-Position mehr im Angebot, die Summe (565,13 € Netto) ergibt sich exakt aus den erwarteten Positionen ohne Grundierung. Wandfläche (46,11 m²), Dübellöcher (2 Stück, 6,00 €) und Höhenzuschlag weiterhin korrekt. Kleine Randnotiz: Diesmal war beim Fenster-Feld ein rotes „!" statt einer Zahl zu sehen — unklar, ob die Rückfrage übersprungen wurde. Die Wandfläche (46,11 m²) passt aber exakt zu „0 Fenster", also rechnerisch kein Problem, nur die Anzeige unklar.

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

**Fix-Update 2 (Head of IT, 2026-08-16) — rotes „!" beim Fenster-Feld:**
Gefunden, im Bearbeiten-Screen des fertigen Entwurfs (`AngebotDetail.tsx`):
das rote „!" heißt dort „Wert fehlt", wenn das Feld `undefined` ist. Der Code,
der die Fenster-Anzahl für dieses Feld befüllt, hat bisher geprüft
„gibt's Fenster-Einträge?" (`raum.fenster?.length`) statt „gibt's überhaupt
eine Antwort?" — und 0 zählt in JavaScript als „nein". Bei „kein Fenster im
Flur" liefert die Extraktion korrekt ein LEERES Fenster-Array, `.length` ist
0, und das wurde wie „gar keine Angabe" behandelt statt wie die echte, richtige
Antwort „0 Fenster". Deshalb das rote „!" statt einer ruhigen 0 — kein
Rechenfehler, nur eine falsch interpretierte Null. Fix: geprüft wird jetzt,
ob überhaupt ein Fenster-Array da ist (auch ein leeres zählt), nicht mehr, ob
die Summe größer null ist. Gleicher Fix auch bei Türen ergänzt, da exakt
derselbe Code direkt daneben stand. Live-Test durch dich steht aus.

**Nachtest (Prüfmeister, 2026-08-16):** Bestätigt. Fenster-Feld zeigt jetzt sauber „0" statt dem roten
„!". Alle anderen Werte weiterhin exakt (Wandfläche 46,11 m², Dübellöcher 2 Stück, Höhenzuschlag
erkannt, keine Grundierung). Dieser Fall ist jetzt komplett grün, alle drei gefundenen Punkte bestätigt
behoben.

---

## PM-004 — Laminat gerade verlegt + Trittschalldämmung (Verschnitt-Grundsatzfrage)

**Datum:** 2026-08-16
**Status:** ✅ Verschnitt-Bug behoben und live nachgetestet — bestätigt (Trittschalldämmung war schon vorher korrekt)

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

**Nachtest (2026-08-16, späterer Durchlauf):** ✅ Verschnitt-Bug ist gefixt. Gleiches Kinderzimmer, gerade verlegtes Laminat — jetzt **12,6 m² (5% Verschnitt)** statt vorher 13,2 m² (10%). Trittschalldämmung weiterhin korrekt dabei (54,00 €, über die Summe verifiziert). Sockelleisten diesmal ohne Türabzug (14 lfdm voll) — das ist hier kein Rückfall, weil in diesem Transkript gar keine Tür genannt wurde, die Boden-Engine also nichts zum Abziehen hatte (siehe PM-002-Nachtest, wo mit genannter Tür korrekt abgezogen wurde). Neue Kleinigkeit: Auf der Aufnahme-Karte stand „Kinderzimmer" selbst als eigener Eintrag in der Leistungen-Liste, obwohl das kein Task ist, sondern der Raumname — kosmetischer Fehler, keine Auswirkung auf die Berechnung.

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
**Status:** ✅ Komplett behoben und live bestätigt — beide Räume erscheinen jetzt korrekt getrennt, mit eigenen Zwischensummen

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

**Nachtest (2026-08-16, späterer Durchlauf) — halber Erfolg, ein Teil des Problems bleibt:**
Gleicher Einsprech-Text nochmal. Diesmal hat Küche ihre eigene Wandfläche:
**26,52 m² Wandflächen streichen 2× (251,94 €)** taucht jetzt korrekt auf —
der Kern-Fix wirkt also, Küche verliert ihre Wände nicht mehr.

Aber: Auf der Küche-Aufnahmekarte (ganz am Anfang, noch bevor überhaupt eine
Rückfrage zur Speisekammer lief) standen wieder zweimal „Decke streichen" und
kein „Wände streichen" als Leistungen — obwohl die spätere Berechnung die
Wände dann doch richtig hatte (wieder die Karte-zeigt-nicht-was-berechnet-
wird-Sache, siehe Notiz an den Designer). Im fertigen Angebot gibt es weiterhin
**nur eine Raumgruppe „KÜCHE"**, darin diesmal: Wandflächen (korrekt),
Deckenfläche 2× (107,80 €), Boden schützen, Sockelleisten abkleben — UND am
Ende der Liste nochmal eine zweite, identische „Deckenfläche streichen 2×"
(107,80 €). Eine eigene „SPEISEKAMMER"-Gruppe erscheint weiterhin nicht.

**Wichtige Präzisierung für Head of IT:** Die Rückfragen selbst laufen klar
getrennt — „RAUM 2 VON 2, Speisekammer" fragt eigenständig nach Höhe und
Türen, das Tool weiß also bis mindestens zur Rückfragen-Stufe, dass es zwei
Räume sind. Der Fehler passiert also nicht (mehr) beim Scope, sondern
irgendwo ZWISCHEN „Rückfragen pro Raum beantwortet" und „Positionen werden zu
Raumgruppen für die Anzeige zusammengefasst" — die berechnete Speisekammer-
Deckenposition landet dabei unter der Raumgruppe „Küche" statt in einer
eigenen Gruppe. Sandys Vermutung („vielleicht wird die Speisekammer gar nicht
als eigener Raum angelegt") trifft also nur zum Teil: bis zu den Rückfragen
ist sie ein eigener Raum, danach nicht mehr sichtbar als einer.

**Fix-Update (Head of IT, 2026-08-16):** Genau da gefunden, wo der Prüfmeister
es eingegrenzt hatte — zwischen Berechnung und Anzeige, nicht mehr im Scope.
Die Berechnung hatte die ganze Zeit zwei saubere, korrekt benannte Positionen
("… — Küche" und "… — Speisekammer"). Die Anzeige-Funktion, die Positionen zu
Raumgruppen zusammenfasst, prüft dafür jeden Namen gegen eine feste Liste
bekannter Räume ("zimmer", "küche", "flur", …) — und "Speisekammer" stand
nicht drauf. Für die Anzeige war "Speisekammer" damit kein Raum, das Suffix
wurde entfernt, und die jetzt namenlose Position landete automatisch bei der
einzigen ANDEREN erkannten Gruppe (Küche) — sah wie ein Duplikat aus, war
aber ein Anzeige-Fehler, kein Rechenfehler.

Fix: Speisekammer und ein paar naheliegende weitere Nebenräume (Abstellraum,
Vorratsraum, Hauswirtschaftsraum, Hobbyraum) zur Liste ergänzt. Neuer Test in
`angebot-gruppierung.test.ts` stellt genau deinen Fall nach (Küche + Speise-
kammer, je eigene Deckenposition) und prüft, dass beide als eigene Gruppe
erscheinen. Alle 669 Tests im Projekt grün. Live-Test durch dich steht aus.

**Nachtest (Prüfmeister, 2026-08-16) — vollständig bestätigt, kompletter Fix:** Dritter Durchlauf.
Jetzt zwei saubere, getrennte Raumgruppen mit eigenen Zwischensummen direkt neben dem Namen:
„KÜCHE — 380,86 €" mit allen vier erwarteten Positionen (Wandflächen 26,52 m², Decke, Boden schützen,
Sockelleisten abkleben), und „SPEISEKAMMER — 107,80 €" mit genau der einen erwarteten Deckenposition,
keine Wandfläche. Keine Duplikate mehr, keine Vermischung. Gesamtsumme (581,51 €) ergibt sich exakt aus
den beiden Raumsummen. Das war der schwerste Fund der ganzen Testreihe — jetzt sauber zu.

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

**Nachtest (2026-08-16, späterer Durchlauf):** Identisch reproduziert, Zahl für Zahl (26,61 m², 442,06 € vor Zuschlag). Keine neuen Auffälligkeiten — bestätigt nur nochmal den bekannten Übermessungs-Punkt und die 1-Cent-Rundungsdrift (jetzt zum dritten Mal beobachtet, immer noch niedrige Priorität).

---

## PM-007 — Dachgeschoss: Kniestock + Dachschrägen + Dachfenster

**Datum:** 2026-08-16
**Status:** 🟡 Kniestock/Grundierungs-Fix live bestätigt; unverlangte „Dachschräge spachteln" bleibt offen; unnötige Rückfragen trotz bereits genannter Werte neu gefunden

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

**Fix-Update (Head of IT, 2026-08-16):** Genau derselbe Fehlerbau wie bei
PM-008, nur an einer anderen Stelle — deshalb diesmal schnell gefunden. Der
GPT-Prompt weist GPT ausdrücklich an, bei Kniestock/Dachschräge/Deckenspiegel
die Felder `kniestockhoehe`, `dachschraege_links_m2`, `dachschraege_rechts_m2`,
`dachschraege_je_seite_m2`, `deckenspiegel_m2` und `dachfenster` zu setzen —
GPT bekommt also den richtigen Auftrag. Aber beim Einlesen der GPT-Antwort
wurden genau diese 6 Felder nie in die interne Raum-Struktur übernommen (die
Liste der "erlaubten" Felder war unvollständig). Ergebnis: die Werte waren
nach dem Einlesen immer leer, egal was GPT geliefert hat — deshalb hat
`istDachgeschoss` nie angeschlagen und der Raum ist in die normale (falsche)
Wandflächen-Rechnung gerutscht. Das erklärt auch die unerklärliche „12 m²":
das war der Zufallswert aus der falsch gegriffenen normalen Rechnung, keine
eigene zweite Fehlerquelle.

Fix: alle 6 Felder werden jetzt beim Einlesen übernommen. Nebenbei die
kosmetische Lücke behoben, die du selbst schon markiert hattest — Kniestock-
und Dachschrägen-Positionen zeigen jetzt auch „{n}x" für den Anstrich, wie
alle anderen Positionen. 4 neue Tests (`maler-engine.test.ts`, exakt deine
Soll-Zahlen: Kniestock 20,40 m², Dachschrägen 23,08 m²), alle 666 Tests im
Projekt laufen weiter grün. Live-Test durch dich steht noch aus.

**Fix-Update 2 (Head of IT, 2026-08-16) — die unverlangte 136,80-€-Grundierung:**
Zwei getrennte Fundstellen, gleicher Fehlerbau, beide jetzt behoben.
1. `pruefeGrundierung` (dieselbe Funktion wie beim PM-003-Fix) hatte für den
   Dachschrägen-Fall keine Prüfung, ob wirklich "grundieren" gewünscht war —
   sie hat die Fläche unconditional draufgesetzt, sobald überhaupt eine
   Dachschrägen-Position da war. Jetzt gilt dasselbe Gate wie bei der
   Wand-Grundierung: nur bei einem echten, im Transkript genannten
   Grundierungs-Wunsch.
2. Eine ZWEITE, ältere Funktion (`pruefeDachschraege`) hat unabhängig davon
   noch eine eigene "Dachschräge Grundierung" ergänzt, ausgelöst allein durch
   die WÖRTER "Dachschräge"/"Kniestock" irgendwo im Text — ganz ohne jeden
   Grundierungs-Bezug. Sie stammt vermutlich noch aus der Zeit vor der
   Dachgeschoss-Engine (als die Vollständigkeitsprüfung versucht hat, die
   fehlende Berechnung selbst zu kompensieren) und wurde bei deren Einbau
   nicht mit angepasst. Gleiches Gate jetzt auch hier ergänzt.
Neuer Golden-Test PM-007b (`golden-korrekturen.test.ts`) stellt genau deinen
Fall nach (Dachzimmer, GPT trägt "grundieren" impliziter Weise in arbeiten[]
ein, Nutzer hat es nie gesagt) und prüft, dass keine Grundierungs-Position
mehr entsteht. Alle 669 Tests im Projekt grün. Live-Test durch dich steht aus.

**Nachtest (Prüfmeister, 2026-08-16):** Grundierung (136,80 €) ist bestätigt weg — Fix wirkt. Kniestock
(20,4 m²) weiterhin exakt Soll. Zwei offene Punkte bleiben:

1. **„Dachschräge spachteln / Untergrundvorbereitung" (0 €, unbepreist) taucht weiterhin auf**, obwohl
   nie erwähnt — sieht nach derselben Fehlerfamilie aus wie die Grundierung, nur eine dritte, noch nicht
   angefasste Fundstelle (evtl. noch in `pruefeFassade`/`maler-tapete.ts` oder einer Nachbarfunktion mit
   demselben „nur weil das Wort Dachschräge irgendwo steht"-Muster).
2. **Neuer Fund, direkt von Sandy bemerkt:** Die Rückfragen fragen weiterhin nach Fensteranzahl und nach
   der Bodenfläche (Länge × Breite), obwohl beides im Transkript klar genannt wurde („Ein Dachfenster",
   „fünf mal dreieinhalb") — bei Letzterem sind die Werte auf der Rückfrage sogar schon korrekt
   vorausgefüllt (5,0 / 3,5), der Nutzer muss trotzdem einmal bestätigen. Das ist kein Rechenfehler,
   sondern unnötige Reibung — siehe Notiz an den Designer (PD-005), Sandy hat dazu eine grundsätzliche
   Meinung zur Rückfragen-UX.

Dachschrägenfläche weiterhin 22,8 m² statt der von mir erwarteten 23,08 m² (Dachfenster-Abzug mit
falschem Standardmaß) — reproduziert sich jetzt zum zweiten Mal identisch, also stabil und kein
Zufall.

**Fix-Update 3 (Head of IT, 2026-08-17) — beide Restpunkte behoben:**

1. **Falsche Fläche (22,8 statt 23,08 m²):** Ursache war nicht bei uns im
   Code, sondern ein Widerspruch zwischen GPT und unserem Code. Ich hab in
   der Datenbank nachgesehen, was GPT bei deinem Testfall wirklich geliefert
   hat: bei „normale Größe" (keine Maße genannt) hat sich GPT SELBST eine
   Zahl ausgedacht — 1,20×1,00m, sein Standard für ein GANZ NORMALES Fenster
   (denselben, den es überall im Tool nutzt), ehrlich mit einem eigenen Flag
   „das ist geraten" markiert. Unser Code kennt aber einen ANDEREN, kleineren
   Standard extra für Dachfenster (0,78×1,18m — Dachfenster sind in echt
   meist kleiner als Wandfenster), genau der Wert aus deiner eigenen
   Soll-Lösung. Weil GPT schon eine Zahl mitliefert, kam unser eigener,
   passenderer Standard nie zum Zug. Fix: wenn GPT sein eigenes „geraten"-
   Flag setzt, gilt jetzt unser Dachfenster-Standard statt GPTs Zahl — nur
   bei echten, von dir genannten Maßen zählt GPTs Wert. Neuer Golden-Test
   PM-007c mit deinen exakten Original-Extraktionsdaten aus der Datenbank.
2. **Unverlangte „Dachschräge spachteln"-Position:** Genau die dritte
   Fundstelle derselben Fehlerfamilie wie die schon gefixte Grundierung —
   die Position kam bisher immer dazu, sobald „Dachschräge"/„Kniestock"
   irgendwo im Text fiel, ganz ohne Prüfung auf ein echtes Signal. Jetzt nur
   noch bei einem echten Ausbesserungs-Hinweis (Risse, Löcher, uneben,
   spachteln, etc.), sonst nur als Erinnerung — gleiches Muster wie überall
   sonst in diesem Bug-Komplex.

3 neue Tests (PM-007c-Golden-Test + 2 Gegen-Tests für Spachteln in
`vollstaendigkeit.test.ts`). Alle 687 Tests grün, `tsc` sauber. Live-Test
durch dich steht für beide Punkte aus.

**Nachtest nach Fix-Deploy (Sandy, 2026-08-17):** ✅ Beide Restpunkte bestätigt behoben. Dachzimmer
nochmal frisch eingesprochen (5×3,5, Kniestock 1,20, Dachschrägen je 12 m², 1 Dachfenster). Karte zeigt
diesmal sauber 3 Leistungen (Wände/Dachschrägen/Kniestock streichen), keine unverlangte „Dachschräge
spachteln" mehr. Im fertigen Angebot: Kniestockwände streichen 2× **20,4 m²** exakt Soll, Dachschrägen
streichen 2× **23,08 m²** exakt Soll (Dachfenster-Abzug jetzt mit dem richtigen kleineren Standardmaß,
vorher 22,8 m²) — beides bestätigt korrekt. Keine unverlangte Spachtel- oder Grundierungsposition mehr.
Fachlich ist dieser Fall damit sauber.

Zwei Punkte bleiben, keiner davon ein Rechenfehler:
1. **Rückfragen-Redundanz reproduziert sich weiter** (PD-005): Bodenfläche wird erneut abgefragt, obwohl
   auf der Karte schon „5,00 × 3,50 m" stand — die Rückfrage kommt sogar mit den richtigen Werten
   vorausgefüllt (5,0/3,5), muss aber trotzdem bestätigt werden. Fenster-Anzahl (1) genauso nochmal
   gefragt, obwohl „Fenster: 1" schon auf der Karte stand.
2. **Neu:** Kniestockwände streichen UND Dachschrägen streichen haben beide **keinen Preis in der
   Preisdatenbank** hinterlegt (0,00 €, „Preis fehlt in deiner Preisdatenbank"). Anders als bei einem
   Erschwerniszuschlag ist das hier keine bewusste Nutzer-Preisfestlegung, sondern schlicht eine fehlende
   Standardposition — siehe „Systemischer Fund" oben, Sandy will das für alle diese Fälle ergänzt haben.

Damit ist PM-007 rechnerisch komplett grün. Offene Punkte sind Designer-Thema (PD-005) bzw.
Preisdatenbank-Pflege, kein Code-Bug mehr in der eigentlichen Berechnung.

---

## PM-008 — Fassade (kein Raum, kein Boden, keine Decke)

**Datum:** 2026-08-16
**Status:** 🟡 Struktureller Fix (Wand-Chip, `modus: 'wand'`) live, PD-003 (rote „!") und die drei
ursprünglichen Engineering-Punkte (Masse-Anzeige, widersprüchlicher Banner, fehlende Preise) bestätigt
behoben. Ein neuer Bug im sechsten Nachtest: die „So gerechnet"-Zeile im neuen Chip rechnet den
Fensterabzug falsch (68,40 m² statt 66,96 m², widerspricht der korrekt abgerechneten Position direkt
darunter). Neue, separat offene „Erschwerniszuschlag Raumhöhe > 3m"-Position ohne Preis. **Korrektur
(2026-08-18):** Ein zweiter, angeblich neuer Fund im sechsten Nachtest — Phantom-Leistung „Fenster
streichen" + Namensverstümmlung „Feuergrundierung" auf der Karte — war erneut ein Lesefehler meinerseits
(Sandy hat direkt widersprochen, das steht so nicht auf der Karte) und ist komplett zurückgenommen.
**Nachtrag, per Copy-Paste bestätigt:** Die Karte zeigt tatsächlich „Fassade streichen" und
„Vorhergrundierung" (zwei Leistungen, passt zu „2 Positionen erkannt") — keine Phantom-Leistung, aber
„Vorhergrundierung" ist eine echte, jetzt bestätigte Namensverstümmlung (Familie „Gondierung").

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

**Fix-Update (Head of IT, 2026-08-16):** Root-Ursache ist eine andere als
vermutet — kein Zahlendreher bei der Extraktion. Ich hab per Debug-Tabelle
nachgesehen, was GPT beim Original-Transkript wirklich geliefert hat: die
Fassadenmaße (12 × 6 m) waren korrekt, die 3 Fenster (1,20 × 1,40 m) auch —
GPT legt Fassaden nur in einem eigenen Feld ab (`waende[]`), weil eine
Fassade kein „Raum" ist (kein Boden, keine Decke). Zwei Stellen im Code haben
das nicht richtig behandelt:
1. Beim Einlesen der GPT-Antwort wurden Fenster und Arbeiten aus diesem Feld
   verworfen (nur bei „echten" Räumen übernommen).
2. Die Mengen-Engine hat dieses Feld danach komplett ignoriert — sie kannte
   nur Räume. Ergebnis: bei jeder reinen Fassade (kein Innenraum dabei) kamen
   buchstäblich null Positionen raus, daher „Keine Positionen erkannt" und die
   Sackgasse.

Fix: Fassaden werden jetzt wie ein Raum ohne Boden/Decke behandelt — Wandfläche
minus Fensterfläche, mit Grundierung NUR wenn das ausdrücklich in der
strukturierten Arbeiten-Liste steht (gleiche Regel wie bei PM-003 — nichts
aus dem Rohtext raten). 4 neue Tests in `maler-engine.test.ts` (u.a. exakt
66,96 m² bei 12×6 m minus 3 Fenster à 1,20×1,40 m), alle 662 Tests im Projekt
laufen weiter grün. Noch offen: woher genau die von dir gesehene
„1,20 × 1,40 m"-Anzeige als vermeintliche Grundfläche kam, ist eine separate,
noch ungeklärte Frage (vermutlich eine andere Anzeige-Stelle) — für den
Blocker selbst aber nicht relevant. Live-Test durch dich steht noch aus.

**Fix-Update 2 (Head of IT, 2026-08-16) — Fenster „1" auf der Karte vs. „2" in
der Rechnung:** Die Aufnahme-Karte zeigt die Fenster-Zahl NICHT aus GPTs
Extraktion, sondern über eine eigene, ganz einfache Text-Suche (die erste
Zahl vor dem Wort „Fenster" im Rohtext) — schnell und ohne KI-Aufruf, aber
blind für Selbstkorrekturen. Bei „Ein Fenster — ne halt, zwei Fenster" nimmt
sie die 1, weil die zuerst im Satz steht. Die eigentliche Berechnung
vertraut zu Recht GPTs Extraktion (die die Korrektur verstanden hat), daher
war die Rechnung schon vorher richtig — nur die Karte hat vorher falsch
angezeigt.

Fix: die Text-Suche nimmt jetzt die LETZTE genannte Zahl statt der ersten —
bei einer Selbstkorrektur ist praktisch immer die letzte gemeint. 2 neue
Tests (`extraktion-masse.test.ts`, exakt dein Fall). Kein Live-Test nötig,
weil hier nur eine Anzeige ohne echten GPT-Aufruf betroffen ist — mit den
Tests reicht die Absicherung.

**Nachtest (2026-08-16, späterer Durchlauf):** Blocker weg, Fläche (66,96 m²)
live bestätigt korrekt. Aber zwei neue Funde: 1) die Fassadenfläche wird
zweimal berechnet, einmal als „Fassadenfläche streichen 2×" (von der Engine)
und nochmal als „Fassadenfarbe 2× Anstrich" (von einer zweiten Stelle) — echte
Doppelberechnung derselben Fläche unter zwei Namen. 2) eine unverlangte
„Fassade reinigen"-Position über 334,80 € taucht auf, obwohl im Transkript nie
von Schmutz, Verschmutzung oder Reinigung die Rede war.

**Fix-Update 3 (Head of IT, 2026-08-16) — Doppelberechnung + unverlangte
334,80-€-Reinigung:** Über die Debug-Tabelle die exakte GPT-Extraktion zu
deinem Live-Test geholt und nachgebaut — beide Funde bestätigt und auf
dieselbe Ursache zurückgeführt: `pruefeFassade`
(`src/lib/vollstaendigkeit/maler-tapete.ts`) ist eine ÄLTERE Funktion, die
noch aus der Zeit vor dem PM-008-Blocker-Fix stammt, als die Engine bei
Fassaden noch gar nichts berechnen konnte — sie hat damals selbst geraten,
welche Standardpositionen bei „Fassade" wohl dazugehören (reinigen,
grundieren, streichen), einfach weil das Wort „Fassade" irgendwo im Text
stand. Seit die Engine die Fassadenfläche jetzt selbst korrekt berechnet
(„Fassadenfläche streichen 2×"), hat diese alte Funktion nicht mitbekommen,
dass ihre eigene „Fassadenfarbe"-Position davon ein Duplikat ist — sie kannte
nur den alten Namen, nicht den neuen der Engine.

Fix: zwei Stellen in `pruefeFassade` angepasst.
1. „Fassade reinigen" wird nur noch ergänzt, wenn im Text wirklich ein
   Reinigungs-Signal steht (reinigen/säubern/waschen/Hochdruck/Schmutz/Risse/
   Algen/Moos) — nicht mehr allein durchs Wort „Fassade". Gleiches Muster wie
   schon bei PM-003/PM-007.
2. Die Duplikat-Prüfung für „Fassadenfarbe" erkennt jetzt auch den neuen
   Engine-Positionsnamen „Fassadenfläche" und überspringt die eigene Position,
   wenn die Engine die Fläche schon berechnet hat.
Die Grundierung bleibt bewusst unverändert (weiterhin unconditional) — das war
nicht Teil deines gemeldeten Befunds. Neuer Golden-Test PM-008b mit deinen
echten Extraktionsdaten (bestätigt: nur noch 2 Positionen statt 4, keine
„Fassadenfarbe"- oder „reinigen"-Duplikate mehr). Bestehender Test in
`vollstaendigkeit.test.ts` an das neue, korrekte Verhalten angepasst (3 Fälle
statt 1: Grundierung+Farbe kommen weiter, Reinigung NICHT ohne Signal, Reinigung
JA bei Algen/Moos/Schmutz). Alle 674 Tests im Projekt grün, `tsc` sauber.
Live-Test durch dich steht aus.

**Nachtest 2 nach Fix-Deploy (Sandy, 2026-08-17):** Duplikat- und Reinigungs-Fix bleiben stabil — auch
im dritten Durchlauf weiterhin nur 2 Positionen (Fassadenfläche streichen 2×, 66,96 m², + Grundierung
66,96 m² × 6,00 € = 401,76 €), keine Duplikate, keine unverlangte Reinigung. Aber drei Funde, die noch
offen sind bzw. neu dazukommen:

1. **Die Masse-Anzeige auf der Aufnahmekarte zeigt weiterhin „1,20 × 1,40 m"** statt der tatsächlichen
   Fassadenmaße (12 × 6 m) — genau die Anzeige-Frage, die im ersten Fix-Update ausdrücklich als „separate,
   noch ungeklärte Frage" offengelassen wurde. Jetzt live bestätigt: sie ist immer noch offen, nicht aus
   Versehen mitgefixt. Die Rechnung selbst stimmt (66,96 m²), nur die Anzeige auf der Karte zeigt die
   falschen Zahlen — das ist trotzdem verwirrend, weil der Handwerker genau dort als Erstes prüft, ob
   die Maße stimmen.
2. **Neuer, ernster Bug:** Direkt nach der Aufnahme erschien kurz ein roter Banner „❗ Keine Positionen
   erkannt" — GLEICHZEITIG mit dem grünen „✓ 2 Positionen erkannt — bereit für den Entwurf" darunter, auf
   demselben Screen. Erst im zweiten Versuch kam Sandy zur Entwurfsansicht durch. Siehe „Systemischer
   Fund" oben — das geht an Head of IT UND an den Designer, auf Sandys ausdrücklichen Wunsch.
3. **Fassadenfläche streichen hat keinen Preis in der Preisdatenbank** (0,00 €, „Preis fehlt") —
   dieselbe Kategorie wie bei PM-007, siehe „Systemischer Fund".

Raummaße-Chip (PD-003, 5× rotes „!") bleibt unverändert offen, unverändert zum letzten Nachtest.

**Nachtest 3 (Sandy, 2026-08-17):** Dritter Durchlauf, gleiche Fassade. Duplikat-/Reinigungs-Fix bleibt
stabil (weiterhin nur 2 Positionen, 401,76 € Netto). Der widersprüchliche „Keine Positionen erkannt"-
Banner von letztem Mal ist diesmal NICHT aufgetreten — passt zum Verdacht, dass es sich um einen
intermittierenden/Race-Condition-artigen Fehler handelt, nicht um einen, der bei jedem Durchlauf greift
(also nicht „behoben", nur nicht ausgelöst).

Zwei Punkte bestätigen sich unverändert:
1. **Masse-Anzeige auf der Karte zeigt weiterhin „1,20 × 1,40 m"** statt der echten Fassadenmaße (12×6 m)
   — dritte identische Reproduktion (PD-007). Interessanter Beleg dazu: das neue „So gerechnet"-Infofeld
   in der Positionsansicht zeigt korrekt „12m × 6m − Fenster (5,04 m²) = 66,96 m²" — die eigentliche
   Rechnung nutzt also die richtigen Zahlen, nur die Karten-Anzeige ganz am Anfang zeigt weiterhin die
   falschen. Bestätigt: reiner Anzeige-Bug an einer isolierten Stelle, kein Rechenfehler.
2. **Fassadenfläche streichen hat weiterhin keinen Preis in der Preisdatenbank** (0,00 €, „Preis fehlt")
   — trotz Sandys expliziter Ansage dazu vor zwei Tests. Bitte nachziehen, siehe „Systemischer Fund" oben.

**Nachtest (Prüfmeister, 2026-08-16):** Beide Fixes bestätigt — nur noch 2 Positionen
(„Fassadenfläche streichen 2×" + „Grundierung / Tiefengrund Fassade", 401,76 €), keine Duplikate, keine
unverlangte Reinigung mehr. Die Grundierung selbst ist hier fachlich korrekt, weil ich sie im Transkript
ausdrücklich verlangt hatte — kein Fehler.

Zwei Dinge bleiben offen:
1. **Raummaße-Chip zeigt weiterhin fünf rote „!"** (Länge, Breite, Höhe, Türen, Fenster), obwohl die
   Rechnung dahinter stimmt — unverändert zum letzten Mal, siehe PD-003 an den Designer.
2. **Neuer kleiner Fund:** Auf der Aufnahme-Karte stand als Leistung „Gondierung" — offensichtlich ein
   verstümmeltes „Grundierung", das so roh (unkorrigiert) angezeigt wird. Wirkt kaputt/unprofessionell,
   auch wenn's die Berechnung nicht stört. Dazu kam „Fenster streichen" als Leistung, obwohl ich nur
   Fenstermaße genannt hatte, keinen Anstrich der Fensterrahmen verlangt — diese Leistung ist im
   fertigen Angebot zu Recht nicht aufgetaucht, war also eine Fehlmeldung der Karte, keine fehlende
   Berechnung (siehe Notiz an den Designer, PD-004/005-Familie: die Karte zeigt wieder etwas anderes
   als das, was am Ende passiert — hier andersrum als sonst, sie verspricht zu viel statt zu wenig).

**Nachtest 4 (Sandy, 2026-08-17):** Vierter Durchlauf, gleiche Fassade. Ein bekannter Bug bestätigt sich
wieder, einer kehrt zurück, und ein neuer, ärgerlicher Fund kommt dazu:

1. Masse-Anzeige zeigt weiterhin „1,20 × 1,40 m" statt 12×6 m — vierte identische Reproduktion (PD-007).
   Das „So gerechnet"-Infofeld zeigt wieder korrekt „12m × 6m − Fenster (5,04 m²) = 66,96 m²" — die
   Rechnung bleibt richtig, nur die Karten-Anzeige nicht.
2. Der widersprüchliche „Keine Positionen erkannt"-Banner ist zurück (war beim letzten Durchlauf nicht
   aufgetreten, jetzt wieder da) — bestätigt endgültig den Verdacht auf einen intermittierenden Fehler:
   2 von 3 bisherigen Fassade-Durchläufen hatten ihn, 1 von 3 nicht. Kein Einzelfall, kein „behoben",
   sondern ein Fehler, der nur nicht bei jedem Durchlauf auslöst.
3. **Korrektur (Sandy, 2026-08-17):** Hier stand „‚Fenster streichen' als Phantom-Leistung auf der
   Karte — zweite Bestätigung". Das war ein Lesefehler von mir beim Auswerten des Screenshots — auf der
   Karte stand das gar nicht, Sandy hat direkt nachgefragt und ich konnte es nicht bestätigen. Nehme
   ich zurück. Der einzelne ältere Fund dazu (weiter unten in diesem Abschnitt, aus einem früheren
   Durchlauf) bleibt bestehen, ist aber weiterhin nur EINFACH belegt, nicht zweifach — falls jemand
   das nochmal gezielt gegenchecken will, gerne, aber ohne neue Bestätigung von meiner Seite heute.
4. Neu und ein Rückschritt: die Grundierung hat jetzt auch keinen Preis mehr. Bisher war
   „Fassadenfläche streichen" die einzige unbepreiste Position (0,00 €), „Grundierung" hatte einen Preis
   (6,00 €/m², 401,76 €). Diesmal zeigen BEIDE Positionen „Preis fehlt in deiner Preisdatenbank" —
   Gesamtsumme jetzt 0,00 € statt vorher wenigstens 401,76 €. Auffällig: die Position heißt hier schlicht
   „Grundierung", in den Raum-basierten Testfällen (z. B. PM-011) aber „Voranstrich / Grundierung" —
   meine Vermutung: das sind für die Preisdatenbank zwei VERSCHIEDENE Einträge, kein gemeinsamer. Falls
   das stimmt, würde ein Preis, den Sandy für „Voranstrich / Grundierung" hinterlegt, die Fassade
   trotzdem nicht abdecken — das wäre eine zusätzliche Erklärung dafür, warum die Preislücke bei der
   Fassade so hartnäckig ist. Bitte von Head of IT gegenchecken, ob es sich wirklich um zwei getrennte
   Preisdatenbank-Schlüssel handelt.

Raummaße-Chip (PD-003) weiterhin unverändert offen.

**Nachtest 5 (Sandy, 2026-08-18) — struktureller Fund: Fassade ist kein Raum, Datenmodell muss
überarbeitet werden.** Fünfter Durchlauf, gleiche Fassade Südseite (12 m lang, Giebelhöhe 6 m, 3 Fenster
1,20×1,40 m). Zwei bekannte Punkte bestätigen sich wieder, eine neue Variante des Masse-Anzeige-Bugs
kommt dazu — vor allem aber liefert Sandy selbst die wahrscheinliche Root-Cause für die ganze
PM-008-Fehlerfamilie:

1. **Masse-Anzeige zeigt jetzt „120,00 × 140,00 m"** statt der Fassadenmaße (12×6 m) — eine neue Variante
   desselben bekannten Anzeige-Bugs (bisher stand dort immer „1,20 × 1,40 m"). Auffällig: 120/140 sieht
   aus wie dieselben Fenstermaße (1,20/1,40), nur um den Faktor 100 verschoben — genau das Muster, das
   beim PM-010-Fund („drei fünfzig" → 350 statt 3,50 m) schon einmal auftrat und dort von Head of IT auf
   die Spracherkennung selbst zurückgeführt wurde, nicht auf eigenen Code. Kann hier derselbe Effekt sein
   („eins zwanzig" wird als „120" gelesen), zusätzlich zur schon bekannten falschen Feld-Zuordnung
   (Fenstermaß statt Fassadenmaß auf der Karte). Bitte gegenchecken, ob beide Bugs zusammenhängen oder
   unabhängig sind.
2. **Fenster in der Entwurfsansicht zeigt „0" (rotes „!")**, obwohl die Aufnahmekarte korrekt
   „Fenster: 3" zeigt — deckt sich mit dem seit Langem bekannten PD-003 (Raummaße-Chip zeigt bei
   Nicht-Raum-Objekten überall rote Fehler statt Werten), nicht neu, aber erneut bestätigt.
3. **Grundierung weiterhin ohne Preis**, zusammen mit Fassadenfläche streichen — unverändert zum letzten
   Nachtest, siehe „Systemischer Fund" oben.

**Sandys eigene Einordnung, wichtiger als die Einzelfunde oben (wörtlich sinngemäß):** Sie hat beim Bauen
des Tools die Entwurfsansicht so angelegt, dass nach Räumen gefiltert wird und jeder Raum eine feste
Zeile mit fixen Raummaßen hat — auf deren Basis werden alle Positionen für diesen Raum berechnet. Eine
Fassade ist aber kein Raum: relevant sind nur Wandlänge und Wandhöhe, es gibt keine Raumtiefe. Ihre
Worte: „das muss irgendwie umgedacht werden, weil das wird auf jeden Fall auch vorkommen." Das ist
vermutlich die gemeinsame Ursache für Punkt 1 und 2 oben (und für PD-003/PD-007 insgesamt) — kein Bündel
zufälliger Einzelbugs, sondern ein Datenmodell, das nur für „echte" Räume gebaut ist und Nicht-Raum-
Objekte wie Fassaden in dasselbe Formular presst, in das sie strukturell nicht passen.

**Aufgabe, ausdrücklich von Sandy verlangt:** Daraus soll eine echte Aufgabe werden, nicht nur eine
weitere Zeile hier — sowohl für Head of Product Engineering (eigenes Datenmodell für Wand-/Fassaden-Objekte
ohne Raumtiefe, das nicht in die feste Raum-Zeile gepresst wird) als auch für den Designer (eigenes
Anzeige-Format für Nicht-Raum-Objekte, siehe Update zu PD-003/PD-007 in
`pruefmeister-notizen-fuer-designer.md`). Prüfmeister meldet strukturell zusätzlich an Chief of Staff
weiter, siehe `pruefmeister-notiz-fuer-chief-of-staff.md`.

**Separat, unabhängig von der Fassade:** Sandy hat außerdem klar gesagt, dass ihr die Aufnahmekarte selbst
(nicht die Entwurfsansicht mit den fehlenden Preisen, sondern die Karte direkt davor, der erste
Gegencheck) grundsätzlich nicht gefällt — ihre Worte: „Das gefällt mir gar nicht" und „Es ist einfach
eine Katastrophe", weil dort andere Dinge stehen als später im Angebotsentwurf. Inhaltlich deckt sich das
mit dem längst bekannten PD-001/PD-004 (Karte zeigt etwas anderes als das, was am Ende berechnet wird),
ist aber eine ausdrückliche Bekräftigung, dass dieser Punkt nicht als Kleinigkeit behandelt werden soll.

**Fix-Update (Head of Product Engineering, 2026-08-18):** Alle vier Engineering-seitigen Punkte aus der
PM-008-Fehlerfamilie einzeln durchgegangen, jeweils bis zur Ursache zurückverfolgt statt nur das Symptom
abzudichten:

1. **Masse-Anzeige falsch** (zuletzt „120,00 × 140,00 m" statt 12×6 m): Ursache gefunden. Die Karte holt
   ihre Vorschau-Maße NICHT aus der echten Berechnung, sondern aus einer eigenen, rein clientseitigen
   Text-Heuristik (`extrahiereRaumdaten()` in der Entwurfsansicht), die im Rohtranskript nach dem ERSTEN
   „X mal Y" sucht — bei einer Fassade mit erwähnten Fenstermaßen („Fenster ist 1,20 mal 1,40") greift sie
   auf das falsche Zahlenpaar zu, weil das zufällig zuerst im Satz steht. Die 100er-Verschiebung (120/140
   statt 1,20/1,40) ist ein zweiter, unabhängiger Effekt der Sprach-zu-Text-Stufe — siehe PM-010, nicht
   Teil dieses Fixes. Fix: die Heuristik überspringt jetzt Zahlenpaare, die im Text erkennbar im
   Fenster-/Tür-Kontext stehen, und nimmt das erste Paar außerhalb davon.
2. **Widersprüchlicher „Keine Positionen erkannt"-Banner:** Ursache gefunden, keine echte
   Race-Condition. Ein früherer „Fertigstellen"-Versuch ohne erkannte Positionen setzt eine Fehlermeldung
   in der Entwurfsansicht — die aber nie wieder geräumt wurde, auch nicht, wenn eine noch verarbeitende
   Aufnahme kurz danach doch Positionen liefert. Dadurch standen rotes Fehler- und grünes Erfolgs-Banner
   gleichzeitig auf dem Schirm. Fix: die Fehlermeldung wird jetzt gezielt geräumt, sobald eine Aufnahme
   tatsächlich Positionen liefert — andere Fehler (Netzwerk, fehlender Preis) bleiben unangetastet stehen.
3. **Grundierung/Fassadenfläche ohne Preis:** Ursache gefunden. Der Preiskatalog schreibt Anstriche mit
   echtem Multiplikationszeichen („2× Anstrich"), die generierten Positionen mit normalem „x" („2x") — beim
   Abgleich wurde das „×" bisher komplett entfernt statt wie „x" behandelt, wodurch die
   Anstrich-Zahl auf beiden Seiten verloren ging. Zusätzlich verschmolz „Fassadenfläche" beim Normalisieren
   mit einer generischen Flächen-Regel zu einem Wort, das nicht mehr zu „Fassade" im Katalog passte. Beides
   gefixt und mit gezielten Tests gegen den echten Preiskatalog abgesichert (`findePreisposition` findet
   „Fassadenfläche streichen 2x" jetzt korrekt zum passenden 2×-Preis, nicht zum 1×-Preis).
4. **Strukturelle Root-Cause (Datenmodell):** Sandys Befund bestätigt und genauer eingegrenzt. Die
   Mengen-Engine selbst behandelt eine Fassade bereits nicht als Raum (eigenes `waende[]`-Feld, nur
   Wandlänge/-höhe, kein Boden/Decke). Die Lücke liegt eine Ebene weiter außen: Die Bearbeiten-Ansicht
   eines fertigen Angebots (Live-Neuberechnung bei manueller Maß-Korrektur) füllt ihre Daten
   ausschließlich aus `raeume[]` — bei einer reinen Fassaden-Aufnahme bleibt dieses Feld leer, und die
   Bearbeiten-Ansicht hat für die Fassaden-Position schlicht keine editierbaren Maße, unabhängig vom
   Anzeige-Format. Konkreter Vorschlag für die Datenmodell-Hälfte (Vorschlag, noch nicht umgesetzt — wie
   von Sandy verlangt als eigene, koordinierte Aufgabe mit dem Designer, nicht blind implementiert):
   einen `typ: 'wand'`-Zweig ergänzen, der nur Länge/Höhe/Türen/Fenster kennt (keine Breite, keine
   Bodenfläche), die Bearbeiten-Ansicht zusätzlich aus `waende[]` befüllen, und die Flächenberechnung für
   diesen Zweig direkt aus Länge × Höhe ableiten statt aus einem Raumumfang. Wartet auf Sandys Go, bevor
   das umgesetzt wird — betrifft den Live-Berechnungspfad fertiger Angebote.

   **Go (Sandy, 2026-08-18):** „go" — Freigabe erteilt, koordiniert mit dem
   Designer (Konzept „Wand-Chip" liegt bereits vor, siehe
   `docs/dc-024-konzept-wandchip.md` bzw. DC-024 in `docs/design-check.md`).
   Head of Product Engineering kann den `'wand'`-Zweig umsetzen.

**Ehrlich zum Stand:** Punkte 1–3 sind lokal gegen den echten Preiskatalog bzw. mit gezielten
Regressionstests verifiziert (neue Testfälle in `extraktion-masse.test.ts` und `preis-matcher.test.ts`).
Punkt 4 ist bewusst nur als Vorschlag dokumentiert, nicht implementiert.

**Update (2026-08-18, nach Sandys Testlauf):** `npm run typecheck` sauber, `npm test` hat von 712 Tests
einen einzigen echten Treffer geliefert — genau das, wofür die Testsuite da ist. Der neue Testfall
„Giebelhöhe im Schnitt sechs Meter" (ausgeschriebene Zahl) schlug fehl, weil `extrahiereRaumhoehe()`
bisher nur Ziffern verstand, keine Zahlwörter. Nachgegangen: einer der beiden echten Aufrufer dieser
Funktion (die Erschwerniszuschlag-Prüfung für hohe Wände/Decken) übergibt das Rohtranskript OHNE
vorherige Zahlwort-Umwandlung — bei „Giebelhöhe im Schnitt sechs Meter" (ohne dass Whisper das schon
selbst in Ziffern verwandelt hätte) wäre der Zuschlag also gar nicht ausgelöst worden. Fix:
`extrahiereRaumhoehe()` wandelt Zahlwörter jetzt selbst zuerst um, unabhängig davon, ob der Aufrufer das
schon gemacht hat. Erneut isoliert gegen alle 32 Fälle der Testdatei geprüft (inklusive der alten
„2 Meter 60"-Falle, die dabei nicht anfassen durfte) — alle grün, keine Regression. An Sandy geliefert;
kompletter `npm test`-Lauf mit dieser letzten Korrektur steht noch aus.

**Update (2026-08-18, nach Sandys Live-Nachtest):** `npm test` danach komplett grün (712/712). Live-Test
auf `sofortangebot.app` zeigte trotzdem alle drei Symptome unverändert — Ursache: die Fixes lagen zu dem
Zeitpunkt nur lokal, `sofortangebot.app` läuft auf einem separaten Deployment, das erst durch den
Platform-&-Integrations-Engineer aktualisiert wird (nicht meine Zuständigkeit, an Sandy so kommuniziert).
Test auf `localhost:3000` (mit den Fixes) brachte zwei echte, neue Erkenntnisse:

1. **Masse-Anzeige — zweiter, subtilerer Fund:** Sandys echtes Test-Transkript („Fassade an der Südseite,
   12 Meter lang, Giebelhöhe im Schnitt 6 Meter, 3 Fenster drin, 1,20 x 1,40, Fassadenfarbe zweimal drauf,
   dazu vorher Grundierung.") zeigte weiterhin „1,20 × 1,40 × 6,00 m" statt der echten Fassadenmaße. Der
   erste Fix (Fenster-/Tür-Kontext überspringen) griff hier nicht: das Fenstermaß „1,20 x 1,40" steht in
   einer EIGENEN, knappen Kommaklausel, das Wort „Fenster" selbst eine Klausel davor — das alte
   12-Zeichen-Kontextfenster war schlicht zu eng (fehlte um 2 Zeichen), um das noch zu erfassen. Fix:
   satzzeichenbasiert statt fester Zeichenzahl — prüft jetzt die eigene Klausel PLUS die davor. Direkt
   gegen Sandys echten Transkript-Text verifiziert (Ergebnis jetzt: Fenstermaß korrekt übersprungen,
   Fassadenmaße selbst stehen aber gar nicht im „X mal Y"-Format im Text — „12 Meter lang" +
   „Giebelhöhe … 6 Meter" getrennt —, die Karte zeigt deshalb ehrlich GAR KEINE Maße statt falscher; besser
   nichts als Falsches). Bei dieser Gelegenheit außerdem die bis dahin ungetestete, direkt in der
   Entwurfsseite lebende Logik (`extrahiereRaumdaten`, `istOeffnungsKontext`) nach `extraktion-masse.ts`
   verschoben und mit 3 neuen Tests abgesichert (inkl. Sandys echtem Satz als Testfall) — genau die Art
   fragiler Rohtext-Stelle, für die diese Datei laut ihrem eigenen Kopfkommentar gedacht ist.
2. **„Preis fehlt" auf localhost war KEIN Bug:** das Test-Angebot lief unter einem anderen Firmen-Konto
   als Sandys reguläres (Preisdatenbank dort hat nur 5 generische Positionen, keine Maler-/Fassadenpreise
   — „Preis fehlt" war in diesem Fall also die ehrliche Wahrheit, nicht der Bug). Mit Sandys Hauptkonto
   (echte ~2155 Positionen) direkt gegen den echten Preiskatalog nachgerechnet: „Fassadenfläche streichen
   2x" und „Grundierung" finden beide korrekt ihren Katalogpreis. Zusätzlich aufgefallen, aber NICHT Teil
   von PM-008: die neue „Erschwerniszuschlag Raumhöhe > 3m"-Position (jetzt korrekt ausgelöst dank Fix 1)
   hat ebenfalls keinen Katalogpreis — die passenden Erschwernis-Einträge im Katalog haben Einheit „%",
   die generierte Position aber „Pauschale". Separater, neuer Fund — noch nicht gefixt, wird als eigener
   Punkt nachgetragen statt hier untergemischt.

**Fix-Update (Head of Product Engineering, 2026-08-18) — Punkt 4, Datenmodell `modus: 'wand'`:**
Sandys Go lag vor (siehe `docs/entscheidungen-fuer-sandy.md`), der Designer hatte sein Konzept
„Wand-Chip" fertig (`docs/dc-024-konzept-wandchip.md`) und ausdrücklich signalisiert: sobald das
Datenfeld existiert, baut er die Komponente. Umgesetzt, genau nach dem dort abgestimmten Umfang:

1. `RaumModus` in `raum-geometrie.ts` um `'wand'` erweitert (Geschwister von `rechteck`/`flaeche`/
   `grundriss`). `berechneRaumMasse()` rechnet für `'wand'` die Wandfläche direkt aus Länge × Höhe −
   Öffnungen (Türen/Fenster wie gehabt abgezogen) — bewusst ohne Umfang und ohne Bodenfläche, weil eine
   Fassade keinen Boden/keine Decke hat (dieselbe fachliche Begründung wie der bestehende Kommentar
   „Keine Decke, kein Boden, kein Umfang für Fassaden" in `maler.ts`). 9 neue Tests in
   `raum-geometrie.test.ts`.
2. `generiere-positionen/route.ts` befüllt `raum_details` jetzt zusätzlich aus `extraktion.waende[]`
   (mit `modus: 'wand'`) — vorher lief die gesamte Raumdimensionen-Speicherung ausschließlich über
   `extraktion.raeume[]`, bei einer reinen Fassaden-Aufnahme (Fassade landet bei GPT strukturell in
   `waende[]`, nicht in `raeume[]`) blieb `raum_details` deshalb komplett leer — die Bearbeiten-Ansicht
   hatte nichts zum Anzeigen oder Neuberechnen, ganz unabhängig vom Chip-Format.
3. **Nebenfund beim Umsetzen, direkt mitgefixt:** dieselbe Lücke gab es ein zweites Mal, auf einem
   anderen Weg — GPT legt manche Fassaden nicht in `waende[]`, sondern als „Raum" mit nur Länge+Höhe ab
   (Breite fehlt strukturell). Dieser Fall bekommt jetzt ebenfalls `modus: 'wand'` statt stillschweigend
   als unvollständiges Rechteck gespeichert zu werden — genau der Fall, der zuvor die 5 roten „!" im
   Chip erzeugt hat, obwohl die Rechnung dahinter stimmte (PD-003).
4. **Zweiter Nebenfund:** `berechneQuantityFuerItem()` (rechnet beim Bearbeiten die Menge einer
   einzelnen Position neu) erkannte „Fassadenfläche streichen …" bisher nicht als Wandleistung (nur
   „wand"/„tapete"/„spachtel"/„grundier"/… im Titel), weil die Maler-Engine Fassaden-Positionen anders
   benennt als Raum-Positionen. Ohne diese Ergänzung hätte eine Änderung an den neuen Wand-Maßen die
   zugehörige Fassadenfläche-Position beim Bearbeiten NICHT aktualisiert — „fassade" ergänzt.

**Bewusst NICHT angefasst:** `AngebotDetail.tsx` (die eigentliche Chip-Anzeige). Das ist abgestimmt
Designer-Terrain — das fertige Konzept liegt in `docs/dc-024-konzept-wandchip.md`, ich habe nur die
Datenbasis dafür gebaut. Ehrlich zum Zwischenstand: bis die neue Komponente eingebaut ist, zeigt die
Bearbeiten-Ansicht bei `modus: 'wand'` eine leere Maße-Zeile statt der 5 roten „!" von vorher (keiner
der drei bisherigen UI-Zweige `rechteck`/`flaeche`/`grundriss` greift für `'wand'`) — kein Rechenfehler,
nur noch kein passendes Format. Datenmodell + Speicherung sind isoliert gegen die exakten Zahlen aus
Sandys eigenem Testfall geprüft (12 m × 6 m − 3 Fenster = 68,4 m²), `npm run typecheck && npm test`
durch Sandy steht noch aus.

**Nachtest 6 (Sandy, 2026-08-18) — Wand-Chip ist live, PD-003 damit tatsächlich behoben, dazu eine echte
Rechen-Diskrepanz gefunden.**

**Positiv, zuerst:** Der Chip zeigt jetzt „WAND / FASSADE" mit vier korrekt gefüllten Feldern —
„Wandlänge 12 m", „Wandhöhe 6 m", „Türen 0", „Fenster 3" — keine roten „!" mehr. Der alte PD-003-Fund
(fünf gleichzeitige Fehleranzeigen trotz korrekter Rechnung) ist damit für dieses Beispiel wirklich weg,
nicht nur angekündigt. Der Umschalter „Kein Wand-Objekt? Als Raum bearbeiten" ist ebenfalls da.

1. **Neuer Bug: Fensterabzug in der „So gerechnet"-Zeile des Chips falsch, widerspricht der tatsächlich
   abgerechneten Position.** Der Chip zeigt „12,00 m × 6,00 m − 3 Fenster (3,60 m²) = 68,40 m²". Das ist
   falsch — 3 Fenster à 1,20×1,40 m sind 5,04 m², nicht 3,60 m² (3,60 ÷ 3 = 1,20 m² je Fenster — sieht so
   aus, als würde nur die Fensterbreite abgezogen, nicht Breite × Höhe). Wichtiger als die einzelne
   Zahl: direkt darunter zeigt die tatsächlich abgerechnete Position „Fassadenfläche streichen 2x"
   weiterhin korrekt „66,96 m²" — zwei Zahlen für denselben Sachverhalt auf demselben Screen,
   widersprüchlich. Das ist derselbe Fehler-Typ, den ich seit Tagen als größtes strukturelles Risiko
   melde (zwei unabhängige Berechnungen laufen auseinander) — nur diesmal beide auf dem neuen Chip
   selbst, nicht mehr Karte-gegen-Entwurf. Für Head of Product Engineering: das passt zu der im letzten
   Fix-Update selbst notierten Zahl „12 m × 6 m − 3 Fenster = 68,4 m²" als vermeintlich verifiziertes
   Ergebnis für `berechneRaumMasse()`/`modus: 'wand'` — das würde bedeuten, der neue isolierte Test prüft
   bereits gegen die falsche Zahl, nicht gegen die alte, seit PM-008 Tag 1 unveränderte Soll-Lösung
   dieser Datei (66,96 m², Wandfläche minus Fenster à 1,20×1,40 m). Bitte gegenchecken, ob die
   Öffnungsfläche im neuen `'wand'`-Zweig aus Breite × Höhe oder nur aus einem der beiden Werte kommt.

**Korrektur (Prüfmeister, 2026-08-18):** Hier stand als Punkt 2 „Karte zeigt wieder eine Phantom-Leistung
— Fenster streichen, Feuergrundierung, diesmal eindeutig belegt, kein Lesefehler". Sandy hat direkt
widersprochen: das steht so nicht auf der Karte. Zurückgenommen, komplett — ich habe die Leistungen-Liste
falsch gelesen bzw. mit einem älteren PM-008-Fund (der schon einmal denselben Lesefehler-Zyklus durchlief,
siehe PD-007-Korrektur vom 17.08.) verwechselt, statt den aktuellen Screenshot neu zu lesen. Die
„Erschwerniszuschlag Raumhöhe > 3m"-Position (weiterhin ohne Preis) und die Rechen-Diskrepanz oben
(Punkt 1) sind davon nicht betroffen und bleiben stehen.

**Nachtrag (Prüfmeister, 2026-08-18) — diesmal per Copy-Paste von Sandy verifiziert, nicht per
Screenshot-Lesung:** Ein weiterer Durchlauf (20:27 Uhr, andere Uhrzeit als der 20:02-Uhr-Durchlauf oben —
ob derselbe oder ein neuer Testlauf, ist nicht sicher, deshalb kein direkter Vergleich zum
20:02-Uhr-Entwurf unten) zeigt auf der Aufnahmekarte tatsächlich zwei Leistungen: „Fassade streichen" und
„Vorhergrundierung". Kein „Fenster streichen" — der vorherige Fund war wie oben beschrieben ein echter
Lesefehler meinerseits. „Vorhergrundierung" (vermutlich „Vorher-Grundierung" ohne Leerzeichen/Bindestrich
zusammengezogen) ist eine Namensverstümmlung in derselben Familie wie „Gondierung" aus einem früheren
Nachtest — diesmal aber wirklich bestätigt, nicht geraten. „Fenster: 3" steht separat darunter, Banner
„2 Positionen erkannt" passt zahlenmäßig zu den zwei gelisteten Leistungen. Für Head of Product
Engineering: Namensverstümmlungen wie „Gondierung"/„Vorhergrundierung" treten wiederholt bei
Grundierungs-Positionen auf der Karte auf — könnte an derselben Textquelle liegen, die schon beim
Masse-Anzeige-Bug in diesem Testfall eine Rolle spielte (clientseitige Text-Heuristik statt echter
GPT-Extraktion für die Karte).

**Fix-Update zur Rechen-Diskrepanz aus Nachtest 6 (Head of Product Engineering, 2026-08-19):**
Root-Ursache bestätigt — genau die Vermutung des Prüfmeisters oben stimmte. `raum_details` (die
gespeicherten Raummaße, die der Chip beim Bearbeiten neu durchrechnet) hat für Fenster/Türen bisher nur
eine STÜCKZAHL gespeichert, nie die echte Breite/Höhe aus dem Transkript. `berechneRaumMasse()` in
`raum-geometrie.ts` rechnete deshalb beim Neuberechnen immer mit dem Standardmaß 1,20×1,00 m je Fenster
(3 × 1,20 m² = 3,60 m², daher die falschen 68,40 m²) — obwohl die ursprüngliche, korrekt bepreiste
Position („Fassadenfläche streichen", 66,96 m²) aus derselben Extraktion stammt und in `maler.ts` mit den
echten 1,20×1,40 m je Fenster gerechnet hatte (3 × 1,68 m² = 5,04 m²). Zwei Berechnungen auf denselben
Rohdaten, aber mit unterschiedlich vollständigen Eingaben — kein Rundungsfehler, echte Diskrepanz.

Das ist keine Eigenheit des neuen `'wand'`-Zweigs, sondern eine Lücke, die es in `raum-geometrie.ts` für
ALLE Modi (auch 'rechteck', 'grundriss') schon vorher gab — bei Standardmaßen fällt sie nicht auf, weil
dann Standardmaß und echtes Maß identisch sind. Sichtbar wurde sie erst durch die Kombination aus diesem
Testfall (bewusst nicht-standardmäßiges Fenster) und der neuen „So gerechnet"-Anzeige des Designers, die
das erstmals offenlegt.

Fix: `RaumDimension` bekommt zwei neue, optionale Felder `fensterFlaeche`/`tuerFlaeche` (echte
Gesamtfläche in m², wenn bekannt) — sind sie gesetzt, ersetzen sie den Stückzahl×Standardmaß-Abzug in
`berechneRaumMasse()`; ohne sie bleibt alles wie bisher. `generiere-positionen/route.ts` berechnet diese
Flächen jetzt beim Speichern der Raummaße mit exakt derselben Formel wie `maler.ts`
(`anzahl × (breite ?? Standard) × (hoehe ?? Standard)`), für Räume UND Fassaden. Geänderte Dateien:
`raum-geometrie.ts`, `generiere-positionen/route.ts`, dazu 3 neue Tests in `raum-geometrie.test.ts`
(u. a. exakt dieser Fall: 3 Fenster à 1,20×1,40 m → 66,96 m² statt 68,40 m²). Live-Nachtest durch dich
steht noch aus — am besten genau diesen Fall (Fassade, 3 Fenster 1,20×1,40 m) im Chip nochmal öffnen und
auf „So gerechnet" schauen.

**Nachtest 7 (Sandy, 2026-08-20) — ✅ Rechenbug bestätigt behoben, Fall damit fachlich komplett grün.**
Dieselbe Fassade (Südseite, 12 m lang, 6 m Giebelhöhe, 3 Fenster) nochmal frisch eingesprochen und den
Chip direkt per Copy-Paste geprüft:

- Chip: „Wandlänge 12 m · Wandhöhe 6 m · Türen 0 · Fenster 3" — alle vier Felder korrekt gefüllt, keine
  roten „!" mehr (PD-003 bleibt bestätigt behoben).
- „So gerechnet: 12,00 m × 6,00 m − 3 Fenster (5,04 m²) = 66,96 m²" — **jetzt korrekt.** Der
  Fensterabzug rechnet endlich mit Breite × Höhe (1,20×1,40=1,68 m² je Fenster × 3 = 5,04 m²) statt nur
  mit der Breite (die alten, falschen 3,60 m² = 68,40 m² Gesamtfläche). Kein Widerspruch mehr zur
  tatsächlich abgerechneten Position.
- Fassadenfläche streichen 2×: 66,96 m² × 14,00 € = 937,44 € — exakt Soll, deckt sich exakt mit der
  Chip-Zeile.
- Grundierung: 66,96 m² × 6,00 € = 401,76 € — ebenfalls exakt Soll, Preis diesmal vorhanden (der
  „×"-vs-„x"-Matching-Fix aus dem 2026-08-18-Update wirkt live).
- Kein Duplikat, keine unverlangte Reinigung, kein widersprüchlicher „Keine Positionen erkannt"-Banner.

Einziges verbleibendes Detail: „Erschwerniszuschlag Raumhöhe > 3m" (1 Pauschale, korrekt ausgelöst wegen
6 m Giebelhöhe) hat weiterhin keinen Preis — das ist der schon bekannte, separat dokumentierte
Einheiten-Konflikt (Katalog führt Erschwerniszuschläge unter „%", die generierte Position unter
„Pauschale") aus dem PM-015-Seitenfund, kein neuer Bug und keine offene Live-Test-Frage mehr, sondern
eine Preisdatenbank-/Produktentscheidung, die auf deine Rückmeldung wartet (siehe dort). Damit ist der
eigentliche PM-008-Rechenfehler, um den es in diesem Fall die ganze Zeit ging, live bestätigt behoben —
gleiche Kategorie „fachlich/rechnerisch grün, nur noch Preisdatenbank-Frage offen" wie PM-007 und PM-009.
Wandert damit ins Archiv, volle Historie bleibt dort erhalten.

---

## PM-009 — Bodenleger Komplettpaket: Altbelag, Ausgleich, Vinyl gerade, Sockelleisten, Übergangsschiene

**Datum:** 2026-08-16
**Status:** 🟡 Verschnitt-Fix bestätigt auch für Vinyl — aber Übergangsschiene fehlt komplett, obwohl „erkannt"

**Hinweis an Chief of Staff (Prüfmeister, 2026-08-17):** Das Ist-Ergebnis unten
stand hier schon einmal, ist aber offenbar bei einer gleichzeitigen Bearbeitung
verloren gegangen (kein Vorwurf — passiert bei einer gemeinsamen Datei mit
mehreren Autoren). Ich hab's aus meinem eigenen Gesprächsverlauf wiederhergestellt,
Wortlaut sollte identisch zum Original sein. War tatsächlich schon getestet,
nicht nur in der Tabelle behauptet.

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

**Ist-Ergebnis (aus dem Tool):**
- Aufnahme-Karte: „5 Positionen erkannt" — Teppich entfernen, Untergrund ausgleichen, Vinylboden verlegen, Sockelleisten anbringen, **Übergangsschiene einbauen** (alle 5 als Leistungen gelistet, inkl. Übergangsschiene).
- Vinyl-Boden verlegen inkl. **5% Verschnitt**: 7,56 m² × 22,00 € = 166,32 € ✓ — Verschnitt-Fix wirkt auch bei Vinyl, nicht nur bei Laminat.
- Teppichboden entfernen und entsorgen: 7,2 m² × 6,00 € = 43,20 € ✓
- Untergrundvorbereitung / Ausgleich: 7,2 m² × 12,00 € = 86,40 € ✓
- Sockelleisten montieren: 11,6 lfdm × 5,50 € = 63,80 € ✓ (Umfang, kein Türabzug — hier gab's im Boden-Kontext keine erfasste Tür, also strukturell erwartbar)
- **Übergangsschiene fehlt komplett in der finalen Positionsliste.** Die Nettosumme (359,72 €) ergibt sich exakt aus den anderen 4 Positionen — es ist rechnerisch kein 5. Posten versteckt.

**Befund:**

1. **Übergangsschiene: „erkannt", aber nie berechnet — Lücke bestätigt**
   - Die Aufnahme-Karte zählt „5 Positionen erkannt" und listet die Übergangsschiene als Leistung. Im fertigen Angebot kommen nur 4 Positionen raus, die Übergangsschiene fehlt spurlos.
   - Bestätigt meinen Verdacht: es gibt keine Berechnungsstelle für Übergangsschienen im Code — die Leistung wird zwar erkannt, aber nirgends in eine Position umgesetzt.
   - Das ist zusätzlich eine Instanz des Karte-zeigt-nicht-was-berechnet-wird-Musters, diesmal als glatte Zahl sichtbar: „5 erkannt" vs. 4 geliefert. Sowas fällt einem Handwerker eher auf als ein falscher Flächenwert, weil die Zahl direkt vorne auf der Karte steht.

**Für Head of IT:** Übergangsschiene als eigene Position ergänzen (Stück oder lfdm, an Türdurchgängen zwischen unterschiedlichen Belägen).
**Für den Designer:** siehe PD-004 — die „X Positionen erkannt"-Zahl selbst war hier schlicht falsch, nicht nur die Detailtiefe dahinter.

**Nachtest (Prüfmeister, 2026-08-16):** Identisch reproduziert — Übergangsschiene fehlt weiterhin, Netto
(359,72 €) unverändert exakt aus den 4 anderen Positionen. Noch nicht gefixt, aber jetzt zweifach
bestätigt, also sicher kein Zufall.

**Fix-Update (Head of IT, 2026-08-17):** Es gab schon eine Berechnungsstelle
dafür — dein Verdacht "keine Stelle im Code" war knapp daneben, aber der
Effekt war derselbe. Sie kannte nur das Wort "Profil" (und "Alu"), nicht
"Schiene" — und "Übergangsschiene" ist im Handwerk mindestens genauso
gebräuchlich wie "Übergangsprofil". Weil das Wort fehlte, wurde die
Erkennung nie ausgelöst, egal wie klar du's gesagt hast.

Fix: "Schiene" als gleichwertiges Wort ergänzt, und die Positionsbezeichnung
übernimmt jetzt deine Wortwahl ("Übergangsschiene" bleibt "Übergangsschiene",
nicht automatisch "Übergangsprofil"). Beim Testen ist mir dabei noch ein
zweiter, latenter Fehler in derselben Funktion aufgefallen: die Stückzahl-
Erkennung sucht Zahlwörter wie "vier" irgendwo im GANZEN Text, nicht in der
Nähe von "Übergang" — bei deinem Transkript hätte sie fälschlich die "vier"
aus der Raummaß-Angabe ("vier mal eins achtzig") als Stückzahl der
Übergangsschiene genommen. In der echten Pipeline (Zahlen werden vorher
schon in Ziffern umgewandelt) passiert das zum Glück nicht — dort landet es
korrekt als Erinnerung "Anzahl prüfen" statt eine falsche Zahl zu erfinden.
Hab einen Test extra dafür ergänzt, der das absichert.
2 neue Tests in `boden.test.ts` (dein Fall + der Zahlen-Fallstrick). Alle 684
Tests grün, `tsc` sauber. Live-Test durch dich steht aus.

**Nachtest nach Fix-Deploy (Sandy, 2026-08-17):** ✅ Bestätigt behoben. Flur nochmal frisch eingesprochen
(4×1,80, Teppich raus, Untergrund ausgleichen, Vinyl gerade, Sockelleisten, Übergangsschiene). Karte
zeigt „5 Positionen erkannt" inkl. Übergangsschiene — und diesmal taucht sie auch im fertigen Angebot
auf: „Übergangsschiene, 1 Stück". Verschnitt weiterhin korrekt bei 5 % (166,32 €, 7,56 m²). Einzige
offene Kleinigkeit: die Übergangsschiene hat noch keinen Preis in der Preisdatenbank hinterlegt
(0,00 €, „Preis fehlt") — reine Preisdatenbank-Pflege, siehe „Systemischer Fund" oben, kein Rechenfehler
mehr. Dieser Fall ist damit fachlich komplett grün.

---

## PM-010 — Sockelleisten-Doppel-Falle: alte raus, neue montiert, dann gestrichen

**Status:** 🟡 Zwei der drei ursprünglichen Bugs bestätigt behoben (erfundener Bodenaustausch weg,
„Sockelleisten streichen" jetzt da, fünfter Fix wirkt), der 350-Bug ist eine akzeptierte, bewusste
Design-Entscheidung (Warnung statt Korrektur). **Neuer Fund (2026-08-19):** „Sockelleisten entfernen" wird
auf der Karte erkannt, taucht aber im fertigen Entwurf nirgends auf — dieselbe stille Fehlerkategorie wie
der ursprüngliche „streichen"-Fund, jetzt beim „entfernen". Siehe Nachtest vom 2026-08-19 unten.

**Zum Einsprechen:**
„Gästezimmer, drei fünfzig mal drei, Höhe zwo sechzig. Die alten Sockelleisten kommen raus, neue werden montiert, weiße MDF-Leisten. Die sollen dann auch noch gestrichen werden, passend zur Wand. Wände und Decke streichen, zweimal."

**Soll-Lösung:**
- Umfang: 2×(3,50+3,00)=13,00 lfm
- Wandflächen streichen 2× (Standardannahmen 1 Fenster, 1 Tür, Höhe 2,60): 13,00×2,60=33,80 minus 1,20 minus 1,89 = **30,71 m²**
- Deckenfläche streichen 2×: 3,50×3,00= **10,50 m²**
- **Boden-Gewerk:** Sockelleisten montieren (neu): 13,00 lfm
- **Maler-Gewerk:** Sockelleisten streichen: eigene Position, 13,00 lfm (minus Türbreite, falls die Maler-Engine das hier richtig macht)

**Worauf achten:** Das ist die im Fachwissen explizit benannte klassische Falle, hier bewusst als Doppel-Fall gebaut — alte Leisten raus + neue montiert (Boden) UND gestrichen (Maler), im selben Satz. Erwartung: zwei getrennte Positionen in zwei Gewerken. Verdacht: die Maler-Engine kennt nach meinem Code-Blick nur „Sockelleisten abkleben" (Schutz vorm Streichen der Wand) als Sockelleisten-Position, aber keine eigene „Sockelleisten streichen"-Position für das tatsächliche Lackieren der Leisten selbst. Wenn das stimmt, fehlt eine ganze Leistung im Angebot, obwohl sie ausdrücklich verlangt wurde — das wäre wieder ein stiller Fehler.

**Ist-Ergebnis (aus dem Tool):**
- **Aufnahme-Karte zeigte Maße „350,00 × 3,00 m"** — statt der gesprochenen 3,50 × 3,00 m. „Drei fünfzig" (die im Handwerk übliche Sprechweise für 3,50 m, genau wie ich sie in praktisch jedem Testfall benutzt habe) wurde als die Zahl 350 statt als 3,50 gelesen. Ein Gästezimmer mit 350 Meter Länge ist offensichtlicher Unsinn.
- Leistungen auf der Karte: Sockelleisten entfernen, Neue Sockelleisten montieren, **Sockelleisten streichen**, Wände streichen, Decke streichen — „5 Positionen erkannt". „Sockelleisten streichen" wird also als eigene Leistung erkannt, unabhängig von „abkleben".
- Im fertigen Angebot stehen die Raummaße dann korrekt bei „3 × 3,5 m" — die absurden 350 m sind bis zur Fertigstellung verschwunden (wie genau, ist unklar — vermutlich wurden sie beim Einrichten des Entwurfs von Hand korrigiert, nicht vom Tool selbst).
- Positionen im fertigen Angebot: Wandflächen streichen 2× (30,71 m², 291,75 €) ✓, Deckenfläche streichen 2× (10,5 m², 115,50 €) ✓, Boden schützen (10,5 m², 12,60 €), **Sockelleisten montieren (12,1 lfdm, 66,55 €)** — mit korrektem Türabzug (13,00 − 0,90 = 12,10, der PM-002-Fix wirkt auch hier.
- Nettosumme (486,40 €) ergibt sich exakt aus diesen 4 Positionen. **„Sockelleisten streichen" fehlt komplett** — genau wie auf der Karte „5 Positionen erkannt" standen, aber wieder nur 4 geliefert wurden.

**Befund:**

1. **Massiver Extraktionsfehler bei Maßangaben in Wort-Sprechweise („drei fünfzig" → 350 statt 3,50)**
   - Das ist potenziell der gefährlichste Einzelfund von allen bisherigen Tests, weil es keine Nische betrifft, sondern die Art, wie praktisch jeder Handwerker Maße durchsagt („drei fünfzig", „zwei achtzig" usw. — genau die Sprechweise, die ich in fast jedem Testfall benutzt habe, und die bisher nie danebenging). Hier ging's einmal komplett daneben, faktisch um den Faktor 100.
   - Wäre das nicht aufgefallen (Raummaße stehen ja nicht immer prominent im Blick, bevor man auf „Entwurf erstellen" tippt), hätte das Angebot entweder mit absurden Flächen gerechnet oder wäre wie bei PM-008 in einer Sackgasse gelandet.
   - Für Head of IT: bitte gezielt testen, wie robust die Zahlenerkennung bei der Sprechweise „X-Y" für Meterangaben mit Komma ist (z. B. „drei fünfzig", „vier zwanzig", „zwei achtzig") — das war bei mir bisher öfter korrekt als hier, also eventuell ein Sonderfall (z. B. speziell bei „drei fünfzig" ohne die Einheit „Meter" direkt danach, oder abhängig von der Satzposition).

2. **Bestätigte Lücke: „Sockelleisten streichen" wird erkannt, aber nie zu einer Position**
   - Erwartet: eine eigene Maler-Position „Sockelleisten streichen" neben „Sockelleisten montieren" (Boden) — zwei Gewerke, zwei Positionen, wie ausdrücklich verlangt.
   - Tatsächlich: Die Karte zählt „Sockelleisten streichen" mit („5 Positionen erkannt"), aber im fertigen Angebot taucht nur „Sockelleisten montieren" (Boden) auf — die Maler-Seite fehlt komplett, obwohl ausdrücklich verlangt.
   - Das bestätigt exakt die klassische Falle aus dem Fachwissen: der Handwerker bekommt die neuen Leisten montiert berechnet, aber das Streichen der Leisten fehlt im Angebot — würde er das übersehen, macht er die Arbeit am Ende unbezahlt.

**Für Head of IT:** zwei getrennte Themen — (1) Zahlenerkennung bei „X-Y"-Sprechweise für Maße prüfen, (2) eigene „Sockelleisten streichen"-Position in der Maler-Engine ergänzen, analog zu „Sockelleisten abkleben", aber als tatsächliche Anstrich-Leistung (mit lfdm-Fläche, nicht nur als Nebenleistung).
**Für den Designer:** wieder „X Positionen erkannt" ≠ tatsächliche Positionen, siehe PD-004. Und: sollte eine derart auffällige Maßangabe wie „350 m" bei einem Innenraum nicht schon auf der Aufnahme-Karte selbst eine Warnung auslösen, bevor der Nutzer weiterklickt?

**Nachtest (Prüfmeister, 2026-08-16) — beide alten Funde bestätigt, plus ein neuer, ernster:**

Denselben Fall nochmal eingesprochen. Die Karte zeigte wieder **„350,00 × 3,00 m"** statt 3,50 × 3,00 —
identisch zum ersten Mal, also kein Einzelfall, sondern reproduzierbar bei genau dieser Sprechweise
(„drei fünfzig mal drei"). Das ist jetzt bestätigt, nicht mehr nur Verdacht. „Sockelleisten streichen"
fehlt weiterhin im fertigen Angebot, ebenfalls reproduziert.

**Neuer Fund, schwerer als die beiden anderen:** Im fertigen Angebot tauchten diesmal zusätzlich zwei
Positionen auf, die ich nie verlangt habe — **„Bodenbelag verlegen inkl. 5% Verschnitt"** (11,03 m²,
Preis fehlt) und **„Altbelag entfernen"** (10,5 m², Preis fehlt). Ich hatte ausschließlich von
Sockelleisten gesprochen (alte raus, neue montiert, gestrichen) — nie davon, dass der Bodenbelag selbst
ausgetauscht wird. Sieht so aus, als hätte die Extraktion „die alten Sockelleisten kommen raus" mit
„der alte Bodenbelag kommt raus" verwechselt und daraus einen kompletten (nie verlangten) Bodenaustausch
gemacht, inklusive neuer Verlegung. Beide Positionen sind zum Glück noch unbepreist (roter Warnhinweis),
würden aber, wenn übersehen und mit Preis versehen, ein völlig falsches Leistungsbild ins Angebot
bringen — eine Fußbodenerneuerung kostet erheblich mehr als ein Sockelleisten-Tausch.

**Einordnung:** Das ist eine neue Fehlerkategorie gegenüber allem bisher Gefundenen — nicht „Position
fehlt" oder „Position doppelt", sondern „Tool erfindet einen ganzen, nie angefragten Leistungsblock".
Für Head of IT: bitte prüfen, ob die Extraktion bei Sockelleisten-Erwähnungen („alte raus", „neue
montiert") fälschlich auch Bodenbelag-Signale auslöst — evtl. dieselbe Fundstelle wie bei
„altbelag_entfernen"/"belag"-Erkennung in der Boden-Engine, die zu breit auf Wörter wie „alte …
kommen raus" anspringt, ohne zu prüfen, WAS genau rauskommt.

**Fix-Update (Head of IT, 2026-08-17) — erfundener Bodenaustausch:** Genau
dort gefunden, wo der Prüfmeister es vermutet hat. In `boden-normalisierer.ts`
gibt es eine Erkennung für „Altbelag muss raus" — die hatte einen Textbaustein,
der auf das BLOSSE Wort „raus" reagiert, ganz ohne zu prüfen, wovon im Satz
überhaupt die Rede ist. Bei „Die alten Sockelleisten kommen raus" reicht das
Wort „raus" allein, damit das Tool einen kompletten Bodenaustausch dazu
erfindet — obwohl kein einziges Mal von Teppich, Parkett, Vinyl o.ä. die Rede
war. Interessant dabei: für das schwächere Wort „weg" gab es diese Prüfung
("steht im selben Satz auch ein Boden-Wort?") schon längst — nur beim Wort
„raus" fehlte sie.

Fix: „raus" (und „weg") zählen jetzt nur noch, wenn im selben Satz auch
wirklich ein Boden-Wort steht (Teppich/Parkett/Vinyl/Laminat/Belag/Boden/…).
Eindeutigere Wörter wie „rausreißen", „entfernen", „demontiert", „abgerissen"
bleiben unverändert (die sind spezifisch genug, kein Bug bekannt). Neuer Test
in `boden-normalisierer.test.ts` mit genau deinem Sockelleisten-Fall (jetzt:
kein Bodenaustausch mehr) plus einem Gegen-Test, dass „Der alte Boden muss
raus" weiterhin korrekt erkannt wird. Alle 676 Tests im Projekt grün, `tsc`
sauber. Live-Test durch dich steht aus.

**Fix-Update (Head of IT, 2026-08-17) — „drei fünfzig" wurde zu 350:**
Ursache lag NICHT bei GPT, sondern bei UNS selbst — eine eigene Vorverarbeitung
wandelt Zahlwörter in Ziffern um, bevor der Text überhaupt zu GPT geschickt
wird. Sie hat „drei" und „fünfzig" JEDES FÜR SICH ersetzt: aus „drei fünfzig
mal drei" wurde „3 50 mal 3" — zwei Zahlen nur mit einem Leerzeichen
getrennt, keine Verbindung mehr zur Handwerker-Sprechweise „X Y" = X Meter Y
Zentimeter. GPT hat dann verständlicherweise „3 50" als „350" gelesen, weil
es die Trennung nicht mehr sehen konnte — der Fehler war zum Zeitpunkt der
GPT-Anfrage schon längst passiert.

Fix: Eine neue Vorverarbeitungs-Regel erkennt genau dieses Muster
(Einer-Zahlwort + Zehner-Zahlwort, z.B. „drei fünfzig", „eins zwanzig", „zwei
achtzig") und wandelt es VOR der Einzelwort-Ersetzung direkt in die richtige
Dezimalzahl um (3.50, 1.20, 2.80). Das betrifft nicht nur diesen einen Fall,
sondern JEDE Ansage in diesem Sprechmuster — bisher hat's zufällig meistens
geklappt, weil GPT es meistens richtig geraten hat, nur bei dir nicht.
Jetzt ist es kein Raten mehr. Neue Testdatei `zahlen-parser.test.ts` (4 Tests,
u.a. dein genauer Fall + alle bisher bekannten „X Y mal Z"-Fälle aus anderen
Testfällen zur Kontrolle). Alle 680 Tests grün, `tsc` sauber.

**Fix-Update (Head of IT, 2026-08-17) — „Sockelleisten streichen" fehlte:**
Es gab schon eine passende Funktion dafür, sie hat aus zwei Gründen nicht
gegriffen. Erstens: „gestrichen" (die Form, die du benutzt hast: „sollen
dann auch noch gestrichen werden") ist ein unregelmäßiges Verb — anders als
„streichen" enthält „gestrichen" den Wortstamm „streich" nicht wörtlich
(Vokal ändert sich), die Funktion hat das Wort schlicht nie erkannt.
Zweitens: du hast „Sockelleisten" und „gestrichen" in zwei GETRENNTEN Sätzen
gesagt, verbunden nur über das Wort „Die" — die Funktion hat aber nur 3
Wörter weit im selben Satz geschaut. Dazu kam eine dritte, zu grobe Bremse:
sobald irgendwo im Text das Wort „montiert" vorkam, wurde „Sockelleisten
streichen" komplett blockiert — gedacht für den Fall „nur montiert, nicht
gestrichen", hat aber auch den legitimen Doppel-Fall („montiert UND
gestrichen", genau deine Sockelleisten-Falle) mit blockiert.

Fix: „gestrichen" wird jetzt erkannt, auch über einen Satz hinweg per
Bezugswort „die"/„sie"/„diese". Die zu grobe „montiert"-Bremse ist raus,
dafür gibt's jetzt eine echte Verneinungs-Prüfung („nicht gestrichen" zählt
nie als Ja) — wichtig, damit hier nicht der gleiche Fehler entsteht wie beim
gerade gefixten Bodenaustausch (Position erfinden, wo keine gewollt war).
2 neue Tests in `vollstaendigkeit.test.ts`: dein Fall (jetzt erkannt) und ein
Gegen-Test mit echter Verneinung („nicht gestrichen, nur montiert" — bleibt
korrekt leer). Alle 682 Tests grün, `tsc` sauber.

Damit sind jetzt alle drei PM-010-Funde behoben. Live-Test durch dich steht
für alle drei noch aus.

**Nachtest nach Fix-Deploy (Sandy, 2026-08-17) — ⚠️ alle drei Fixes wirken im Live-Test NICHT:**
Denselben Fall („Gästezimmer, drei fünfzig mal drei...") nochmal frisch eingesprochen, ausdrücklich NACH
den drei oben dokumentierten Fix-Updates. Ergebnis: alle drei Bugs sind unverändert wieder da, identisch
zu den vorherigen Durchläufen.

1. **350-Bug:** Karte zeigt wieder „350,00 × 3,00 m" statt 3,50 × 3,00 m — dritte identische
   Reproduktion, jetzt auch nach dem Fix, der laut Update genau diesen Fall in `zahlen-parser.test.ts`
   testet.
2. **Erfundener Bodenaustausch:** „Bodenbelag verlegen inkl. 5% Verschnitt" (11,03 m²) und „Altbelag
   entfernen" (10,5 m²) sind wieder im Angebot, obwohl nur von Sockelleisten die Rede war — trotz Fix in
   `boden-normalisierer.ts`.
3. **„Sockelleisten streichen" fehlt weiterhin** in der finalen Positionsliste — Karte verspricht es
   („5 Positionen erkannt"), das fertige Angebot liefert nur 4 (Wandflächen, Deckenfläche, Bodenbelag-
   Phantom, Altbelag-Phantom, Sockelleisten montieren — „streichen" fehlt), trotz Fix in
   `vollstaendigkeit.test.ts`.

Nettosumme (462,40 €) und alle Einzelwerte (Wandflächen 29,51 m², Decke 10,5 m², Sockelleisten montieren
12,1 lfdm mit korrektem Türabzug) sind untereinander konsistent — es ist also nicht so, dass hier
irgendwas krude durcheinander wäre, es sieht einfach exakt wie der Stand VOR den drei Fixes aus.

**Einordnung:** Das ist kein neuer Fund, sondern ein direkter Widerspruch zu den drei „Fix-Update"-
Einträgen oben. Zwei Erklärungen liegen nahe, beide für Head of IT zu prüfen, bevor an der Logik selbst
weitergesucht wird: entweder die Fixes sind noch nicht in der Umgebung deployed, in der Sandy testet,
oder die neuen Tests (`zahlen-parser.test.ts`, `boden-normalisierer.test.ts`, `vollstaendigkeit.test.ts`)
decken einen Fall ab, der sich von Sandys tatsächlichem Testsatz doch in einer Kleinigkeit unterscheidet
(z. B. Groß-/Kleinschreibung, Satzzeichen, exakte Wortstellung). Angesichts dessen, dass alle DREI
unabhängig behaupteten Fixes gleichzeitig nicht greifen, ist „nicht deployed" die wahrscheinlichere
Erklärung als drei zufällig gleichzeitig unvollständige Fixes.

**Fix-Update (Head of IT, 2026-08-17) — echte Ursache gefunden, kein Deploy-Problem:**
Per echter Supabase-Rohdaten deines Nachtests (`debug_extraktion_roh`, id `9f7c0ed9…`) geprüft statt
weiter zu raten. Ergebnis: alle drei Commits waren live (Git-Historie linear, spätere Commits vom selben
Tag sind laut deinen eigenen Notizen bestätigt live) — aber alle drei Fixes waren **gegen die falsche
Eingabeform gebaut**. Drei getrennte Erkenntnisse:

1. **Die 350 ist gar nicht unser Bug, sondern Whisper.** In den echten Rohdaten aus deinem Nachtest steht
   „350 x 3" schon so im Transkript-Text selbst — BEVOR unser eigener Code überhaupt läuft. Whisper (die
   Spracherkennung) hat „drei fünfzig" direkt als Ziffernfolge „350" verschriftlicht, nicht als Wörter.
   Mein erster Fix (`zahlen-parser.ts`) repariert einen anderen, ebenfalls echten Fall — wenn Whisper die
   Zahlwörter „drei" und „fünfzig" ausschreibt, verbindet mein Fix sie richtig zu 3.50. Aber wenn Whisper
   direkt „350" transkribiert, sieht unser Code diese 350 gar nicht anders als eine echte Meterangabe. Das
   ist mit Text-Nachbearbeitung grundsätzlich nicht lösbar — dafür siehe Vorschlag ganz unten.
2. **Erfundener Bodenaustausch — Ursache stimmte, aber mein erster Fix hat einen NEUEN Fehler eingebaut.**
   GPT lieferte selbst `altbelag_entfernen:true` UND `altbelag_vorhanden:true`, obwohl `belag:null` war und
   kein Belag-Wort im Text stand — das eigene Signal von GPT war falsch, und meine Regex-Korrektur (Fund
   vom ersten Fix-Update) griff hier gar nicht, weil sie nur den TEXT prüft, nicht GPTs eigenes,
   gegensätzliches Strukturfeld. Neuer Fix an der richtigen Stelle: `extraktion-normalisierer.ts` prüft
   jetzt, ob `altbelag_entfernen`/`altbelag_vorhanden` durch einen echten Belag-Namen oder ein echtes
   Verlege-Wort in `arbeiten[]` gedeckt sind — sonst werden beide auf `false` korrigiert. Nebenwirkung
   dabei entdeckt und gleich mitbehoben: diese Korrektur hätte sonst auch „Sockelleisten montieren"
   verschwinden lassen (lief technisch über dieselbe Boden-Engine) — dafür `mehrgewerk.ts` und `boden.ts`
   so angepasst, dass Sockelleisten-Arbeiten unabhängig vom Belag-Signal laufen, aber „X verlegen"
   weiterhin nur bei echtem Belag-Auftrag.
3. **„Sockelleisten streichen" fehlte aus einem DRITTEN, bisher unentdeckten Grund.** Mein zweiter Fix
   (Satzgrenzen-Erkennung über „gestrichen"/Folgesatz) war technisch korrekt, griff aber nie, weil echte
   Transkripte (wie deins) keine Satzpunkte zwischen den Teilsätzen haben, sondern nur Kommas — meine
   Testfälle hatten künstlich Punkte gesetzt. Fix: die Prüfung liest jetzt zuerst GPTs eigene, bereits
   geprüfte `arbeiten[]`-Liste (dort stand „sockelleisten streichen" die ganze Zeit korrekt drin), die
   Satzgrenzen-Logik bleibt nur als Rückfallebene. Dabei noch einen VIERTEN, ganz eigenständigen Bug
   gefunden: ein genereller Dubletten-Filter hat „Sockelleisten streichen" verworfen, sobald „Sockelleisten
   montieren" schon als Position existierte (beide fangen mit „Sockelleisten" an, der Filter prüft nur
   grob die ersten zwei Wörter) — auch das jetzt behoben (`maler-tapete.ts`).

Alle drei Fixe zusammen gegen genau deine echten Live-Daten geprüft (nicht nur gegen eigene Testfälle):
neuer Golden-Test in `mehrgewerk.test.ts` (Block „PM-010 — Sockelleisten-only-Auftrag erfindet keinen
Bodenaustausch mehr") nutzt exakt GPTs Rohantwort aus deinem Nachtest 1:1. Ergebnis: kein „verlegen"/
„Altbelag entfernen" mehr, „Sockelleisten montieren" bleibt korrekt, „Sockelleisten streichen" fehlt nicht
mehr (landet als offene Rückfrage, weil keine Meterangabe explizit fürs Streichen genannt wurde — das ist
gewollt: lieber fragen als raten). Volle Testsuite (691 Tests) + `tsc --noEmit` grün. Live-Test durch dich
steht noch aus — bitte diesmal wieder denselben Satz einsprechen und auf alle drei Punkte gleichzeitig
achten.

**Vorschlag für den 350-Bug (Whisper-Ebene) — umgesetzt (Sandys Go: 2026-08-17):** Weil das vor unserem
Code passiert, kann Text-Nachbearbeitung es nicht zuverlässig fangen. Umgesetzt: eine deterministische
Plausibilitäts-Prüfung direkt nach der Extraktion (`src/lib/mass-plausibilitaet.ts`, 7 eigene Tests) —
wenn eine Raum-Länge oder -Breite über 15 m liegt, kommt eine Warnung zurück. Eingebaut in
`generiere-positionen/route.ts` (läuft bei jeder Generierung mit) und in der Entwurf-Seite als gelber,
nicht blockierender Hinweis mit „Trotzdem weiter zum Angebot"-Button — genau nach der Grundregel „nie
den Flow blockieren, nur sichtbar machen". Kein Rewrite, eine einzelne Prüfung an einer Stelle. Noch
offen: das ist eine Warnung an der Stelle, wo die Karte gerade sowieso schon geprüft wird — die
GPT-Chip-Vorschau ganz am Anfang (die, wo du „350,00 × 3,00 m" zuerst siehst) zeigt sie NICHT, weil die
über eine andere, unabhängige Schnellvorschau läuft (dasselbe „Karte ≠ Berechnung"-Muster wie bei CoS-002)
— dafür bräuchte es einen zweiten, separaten Schritt, absichtlich nicht mit reingenommen. Live-Test durch
dich steht aus.

**Nachtest zum neuen Fix (Sandy, 2026-08-17):** Denselben Fall nochmal frisch eingesprochen, wie von
Head of IT erbeten, auf alle drei Punkte gleichzeitig geachtet. Gemischtes, aber größtenteils gutes
Ergebnis:

1. **Erfundener Bodenaustausch: bestätigt weg.** ✅ Weder „Bodenbelag verlegen" noch „Altbelag entfernen"
   tauchen diesmal im fertigen Angebot auf. Nur die vier erwarteten Positionen (Wandflächen 30,71 m² ×
   9,50 € = 291,75 €, Deckenfläche 10,5 m² × 11,00 € = 115,50 €, Boden schützen 12,60 €, Sockelleisten
   montieren 12,1 lfdm × 5,50 € = 66,55 €). Dieser Fix wirkt live — genau wie in der neuen Root-Cause-
   Erklärung beschrieben.
2. **350-Bug: weiterhin auf der Karte sichtbar** („350,00 × 3,00 m"), aber das deckt sich mit deiner
   eigenen Erklärung (Whisper verschriftlicht „drei fünfzig" direkt als Ziffernfolge, das ist vor eurem
   Code passiert) — im fertigen Entwurf stehen die Raummaße dann korrekt bei „3 × 3,5 m", die Rechnung
   selbst ist also nicht betroffen. Kein neuer Fund, sondern die erwartete Restwirkung der gewählten
   Lösung (Warnung statt Korrektur). Die neue gelbe Plausibilitäts-Warnung auf der Entwurf-Seite war in
   meinem Screenshot-Ausschnitt nicht zu sehen (könnte oberhalb des sichtbaren Bereichs gewesen sein) —
   kann ich nicht bestätigen oder verneinen, bitte bei Gelegenheit gezielt draufschauen.
3. **„Sockelleisten streichen" fehlt definitiv — bestätigt von Sandy direkt am Bildschirm.** Ich hatte
   das wegen des abgeschnittenen Screenshots erst offengelassen; Sandy hat direkt bestätigt, dass danach
   nichts mehr kommt — kein 5. Position, keine offene Rückfrage dazu. Die Liste endet bei vier Positionen
   (Wandflächen, Deckenfläche, Boden schützen, Sockelleisten montieren). Damit ist der vierte Root-Cause-
   Fix aus dem letzten Fix-Update (Dubletten-Filter, der „Sockelleisten streichen" verwirft, weil
   „Sockelleisten montieren" schon existiert) **nicht wirksam** — die klassische Doppel-Falle aus dem
   Fachwissen (montiert UND gestrichen, zwei Gewerke, zwei Positionen) bleibt live weiterhin unvollständig.
   Der Handwerker bekäme in diesem Angebot das Streichen der Sockelleisten nicht in Rechnung gestellt,
   obwohl ausdrücklich verlangt — genau der stille, teure Fehler, um den es in diesem Testfall von Anfang
   an ging.

**Zwischenstand:** 1 von 3 sauber bestätigt behoben (erfundener Bodenaustausch), 1 von 3 wie erwartet
(350-Bug auf der Karte, bewusste Design-Entscheidung, Rechnung selbst korrekt), 1 von 3 **weiterhin real
und bestätigt offen** („Sockelleisten streichen" fehlt komplett). Damit ist PM-010 noch nicht grün.

**Fix-Update (Head of Product Engineering, 2026-08-17) — der wahre Grund, warum vier Versuche nicht
gewirkt haben:** Nicht die Signal-Erkennung war das Problem (die war bei allen vier Versuchen am Ende
korrekt, mit echten Live-Daten geprüft). Das Problem lag eine Ebene tiefer: `fehlende` — der Rückgabewert
der Vollständigkeitsprüfung, extra dafür gedacht, "erkannt, aber keine sichere Menge, bitte fragen" an den
Nutzer weiterzugeben — wird in `angebot-extrahieren/route.ts` beim Auswerten NIE gelesen. Kein Feld dafür
in der API-Antwort. Jeder Fund, der dort landet, ist unsichtbar — keine 5. Position, keine offene Frage,
einfach nichts. Genau das hast du gesehen.

Fix (Ansatz gewechselt, wie vom Prüfmeister empfohlen): „Sockelleisten streichen" fragt jetzt nicht mehr
nach einer expliziten Meterangabe im Text, sondern übernimmt die Menge von „Sockelleisten montieren"
(derselbe Raum, schon berechnet) — dieselben neuen Leisten, dieselbe Länge. Nur bei mehreren Räumen mit
je eigener Position wird nicht geraten. Test verschärft: prüft jetzt hart, dass es eine ECHTE Position
wird (13,00 lfdm), nicht nur „irgendwas". Volle Testsuite (706 Tests) + `tsc --noEmit` grün.

**Wichtig, ehrlich:** Der größere Fund dahinter (`fehlende` erreicht generell nie den Nutzer, betrifft
130 Stellen in 18 Dateien, nicht nur Sockelleisten) ist NICHT mit gelöst — das ist eine größere
Architektur-Entscheidung, dokumentiert bei CoS-007/CoS-002, wartet auf Sandys/CoS' Einordnung. Live-Nachtest
für diesen konkreten Fix steht noch aus.

**Nachtest (Sandy, 2026-08-19) — fünfter Fix bestätigt: „Sockelleisten streichen" ist endlich da, aber ein
neuer, echter Fund kommt dazu.** Denselben Fall nochmal frisch eingesprochen, diesmal Karten- und
Entwurfstext komplett per Copy-Paste geschickt statt als Screenshot — exakter Wortlaut, kein
Lesefehler-Risiko mehr.

1. **„Sockelleisten streichen" ist da.** ✅ Nach vier gescheiterten Versuchen endlich bestätigt behoben —
   die Position steht im fertigen Entwurf, mit exakt derselben Menge wie „Sockelleisten montieren"
   (12,1 lfdm), genau wie im letzten Fix-Update beschrieben (Menge wird übernommen, nicht neu erfragt).
2. **Erfundener Bodenaustausch: weiterhin bestätigt weg.** ✅ Keine „Bodenbelag verlegen"- oder
   „Altbelag entfernen"-Position im Entwurf.
3. **350-Bug: weiterhin wie erwartet, keine neue Abweichung.** Karte zeigt „350,00 × 3,00 m", der Entwurf
   selbst korrekt „3 × 3,5 m" — die akzeptierte Design-Entscheidung (Warnung statt Korrektur, weil die
   Ursache bei Whisper liegt) hält.
4. **Neuer, echter Fund: „Sockelleisten entfernen" wird erkannt, taucht aber nirgends im Entwurf auf.**
   Die Karte listet fünf Leistungen: „Wände streichen", „Decke streichen", „Sockelleisten entfernen",
   „Neue Sockelleisten montieren", „Sockelleisten streichen" — „5 Positionen erkannt". Der fertige Entwurf
   hat ebenfalls fünf Positionen (Wandflächen streichen, Deckenfläche streichen, **Boden schützen**,
   Sockelleisten montieren, Sockelleisten streichen) — die Zahl stimmt wieder zufällig, aber der Inhalt
   nicht: „Sockelleisten entfernen" (ausdrücklich verlangt: „die alten Sockelleisten kommen raus") fehlt
   komplett, weder als eigene Zeile noch erkennbar in eine andere Position eingerechnet. Stattdessen steht
   „Boden schützen" da, das die Karte gar nicht angekündigt hatte. Genau die stille Fehlerkategorie, um
   die es bei PM-010 von Anfang an ging — diesmal beim Entfernen statt beim Streichen. Alle übrigen Zahlen
   sind rechnerisch sauber (Wandfläche 30,71 m², Deckenfläche 10,5 m², Sockelleisten 12,1 lfdm — passt
   exakt zur Soll-Lösung).
5. **Sauber quergeprüft, gehört zu PM-014:** Sandy hat bewusst zweimal direkt hintereinander auf „Angebot
   erstellen" geklickt (genau der von Head of Product Engineering erbetene gezielte Doppelklick-Test) —
   keine Verdopplung. Details und Einordnung bei PM-014.

**Für Head of Product Engineering:** Bitte „Sockelleisten entfernen" genauso behandeln wie eben
„Sockelleisten streichen" gefixt wurde — vermutlich landet auch dieses Signal in `fehlende` und erreicht
den Nutzer nie (derselbe größere, noch ungelöste Fund von oben), oder es wird an einer anderen Stelle
grundsätzlich verworfen. Fachlich wäre zu klären, ob „Entfernen" als eigene lfdm-Position berechnet werden
soll (parallel zu „Sockelleisten montieren") oder ob sie bewusst im Montage-Preis mitgedacht ist — aber
dann sollte sie auch nicht auf der Karte als eigene Leistung auftauchen, das verspricht dem Handwerker
etwas, das er später nicht wiederfindet.

**Fix-Update (Head of Product Engineering, 2026-08-19) — echte Ursache war NICHT `fehlende`, sondern ein
Wort-Mismatch:** Auf Sandys „das bearbeiten und fixen!" hin den größeren, mehrfach genannten `fehlende`-Fund
angegangen — dabei aber, bevor irgendwas geändert wurde, jeden der drei betroffenen Fälle (PM-010/012/013)
einzeln bis zur Codezeile zurückverfolgt, statt blind eine einzige generische Lösung draufzusetzen. Ehrliches
Ergebnis: die drei Fälle haben DREI VERSCHIEDENE Ursachen, nicht eine gemeinsame.

Für „Sockelleisten entfernen" konkret: die Funktion, die dafür zuständig aussieht
(`pruefeSockelleisten` in `vollstaendigkeit/boden-vorarbeiten.ts`, inkl. eines `fehlende.push('Sockelleisten
entfernen (alt)')`) wird **im gesamten Code nirgends aufgerufen** — toter Code, nicht der Grund für den
Live-Bug. Die Position, die live tatsächlich erscheint, kommt über einen ganz anderen, schon länger
existierenden Mechanismus: `aufnahme-hinweise.ts` liest die Titel der schnellen Aufnahme-Karten-Chips
("Sockelleisten demontieren", "Sockelleisten montieren") als Sicherheitsnetz und ergänzt daraus fehlende
Positionen mit einer geliehenen Menge. Der Karten-Chip aus deinem Nachtest heißt aber wörtlich „Sockelleisten
**entfernen**", nicht „demontieren" — GPT formuliert Chip-Titel frei, ohne festes Vokabular. Die Prüfung kannte
nur „demontieren" als Wort. Deshalb ist die Position spurlos verschwunden, obwohl die Karte sie korrekt
erkannt hatte.

Fix: die Prüfung akzeptiert jetzt alle gängigen Synonyme (`demontieren|entfernen|abbauen|abmontieren|
ausbauen`) statt nur eines wörtlichen Treffers — risikoarm, weil Chip-Titel bereits kuratierte Kurzlabel
sind, kein Fließtext (keine „Über-Erkennungs"-Gefahr wie bei Regex auf Rohtext). Neuer Test in
`aufnahme-hinweise.test.ts` mit deinem exakten Nachtest-Transkript, erwartet 12,1 lfdm (gleiche Länge wie
„Sockelleisten montieren"). **Zusätzlich, unabhängig davon:** den `fehlende`→sichtbare-Platzhalterposition-
Fix aus deiner Anfrage trotzdem zentral in `mehrgewerk.ts` umgesetzt (jede der ~130 Fundstellen in
`vollstaendigkeit/*`, die heute still in `fehlende` verschwindet, wird jetzt als Position mit Menge 0 sichtbar,
genau wie eine Position ohne Katalogpreis) — als Sicherheitsnetz für alle künftigen/anderen Fälle, auch wenn
er für DIESEN speziellen Fund hier nicht die Ursache war (die Funktion, die ihn erzeugen würde, wurde ja nie
aufgerufen). Volle Testsuite/`tsc --noEmit` von dir/dem Prüfmeister noch zu bestätigen (kein CI-Zugriff von
hier aus). Live-Nachtest steht aus.

**Nachtest (Sandy, 2026-08-20) — ✅ Fix bestätigt, alle vier PM-010-Funde damit geklärt.** Denselben Fall
noch einmal frisch eingesprochen. Karte: „5 Positionen erkannt" — Wände streichen (70 m²), Decke streichen
(10,5 m²), Sockelleisten entfernen (1 pauschal), Neue Sockelleisten montieren (1 pauschal), Sockelleisten
streichen (10 m). Rückfragen (Türen, Fenster) mit je 1 Stück beantwortet. Raummaße im Entwurf exakt (3×3,5 m,
Höhe 2,6 m, 1 Tür, 1 Fenster). Sechs Positionen im fertigen Entwurf:

1. Wandflächen streichen 2× — 30,71 m² × 9,50 € = 291,75 € — exakt Soll
2. Deckenfläche streichen 2× — 10,5 m² × 11,00 € = 115,50 € — exakt Soll
3. Boden schützen — 10,5 m² × 1,20 € = 12,60 € — normale Nebenleistung
4. Sockelleisten montieren — 12,1 lfdm × 5,50 € = 66,55 € — exakt Soll
5. Sockelleisten streichen — 12,1 lfdm × 3,50 € = 42,35 € — weiterhin bestätigt behoben (vierter Fix hält)
6. **„Sockelleisten entfernen (alt)" — 12,1 lfdm × 0,00 €, „Preis fehlt in deiner Preisdatenbank", 0,00 €**
   — **jetzt endlich da.** Exakt dieselbe Menge wie „Sockelleisten montieren" (12,1 lfdm), genau wie im
   Fix-Update erwartet. Kein Platzhalter, keine offene Rückfrage — eine echte, mengenmäßig korrekte
   Position, nur eben noch ohne hinterlegten Preis.

Damit sind jetzt alle vier ursprünglichen PM-010-Funde geklärt: erfundener Bodenaustausch bestätigt weg,
Sockelleisten streichen bestätigt behoben, 350-Bug akzeptierte Design-Entscheidung, und jetzt auch
Sockelleisten entfernen bestätigt behoben. Einziger Rest: die fehlende Preishinterlegung für „Sockelleisten
entfernen (alt)" — dieselbe Kategorie „Preisdatenbank-Pflege, kein Code-Bug" wie bei PM-007/008/009, kein
Blocker mehr für „grün". Wandert damit ins Archiv, volle Historie bleibt dort erhalten.

---

## PM-012 — Sockelleisten-Falle umgekehrt: nur streichen, ausdrücklich NICHT neu (Esszimmer)

**Datum:** 2026-08-17
**Status:** ❌ Wandfläche exakt Soll, Ausschluss sauber respektiert (kein Boden-Phantom) — aber „Sockelleisten streichen" fehlt komplett, jetzt DRITTE unabhängige Bestätigung derselben Lücke wie PM-010, diesmal isoliert ohne Doppel-Fall-Verwicklung

**Warum dieser Fall:** PM-010 prüft die Doppel-Falle in eine Richtung (beides verlangt, „streichen" fehlt
im Ergebnis — bestätigt offen). Dieser Fall prüft die GEGENRICHTUNG desselben Themas, isoliert: nur
Streichen ist verlangt, Neumontage ist ausdrücklich ausgeschlossen. Zwei Dinge auf einmal getestet: (a)
kommt „Sockelleisten streichen" (Maler) diesmal, ganz ohne die Doppel-Fall-Verwicklung von PM-010 — falls
sie auch hier fehlt, ist das ein weiterer, unabhängiger Beleg, dass die Lücke generell besteht, nicht nur
im Doppel-Fall; (b) wird trotz des ausdrücklichen Ausschlusses fälschlich eine Boden-Position
„Sockelleisten montieren" erfunden — die Über-Erkennungs-Variante desselben Fehlertyps, den wir bei den
Fassaden- und Bodenaustausch-Phantompositionen schon gesehen haben.

**Zum Einsprechen:**
„Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber, ganz normal.
Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, die NICHT demontiert — die
sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand. Ein Fenster, Standardgröße,
eine Tür, normal Maß.“

**Soll-Lösung:**
- Umfang: 2×(4,50+3,00) = 15,00 lfm
- Wandbrutto: 15,00×2,55 = 38,25 m²
- Abzug 1 Fenster Standard (1,20 m²) + 1 Tür Standard (1,89 m²) = 3,09 m²
- Wandfläche netto: **35,16 m²**
- Wandflächen streichen 2×: **35,16 m²**
- Sockelleisten streichen (Maler): eigene Position, 15,00 − 0,90 (Tür) = **14,10 lfm**
- Sockelleisten montieren (Boden): **keine Position** — ausdrücklich ausgeschlossen
- Sockelleisten entfernen (Boden): **keine Position** — ausdrücklich ausgeschlossen

**Worauf achten:**
- Kommt „Sockelleisten streichen" (Maler) überhaupt als eigene Position — isolierter Test derselben
  Lücke, die bei PM-010 bereits bestätigt offen ist, diesmal ohne die Doppel-Fall-Verwicklung. Fehlt sie
  auch hier, ist das ein zusätzlicher, unabhängiger Beleg für eine generelle Lücke, kein Sonderfall.
- Wird trotz „bleiben wie sie sind", „NICHT neu gemacht", „NICHT demontiert" trotzdem eine Boden-Position
  „Sockelleisten montieren" oder „entfernen" erfunden? Das wäre die Über-Erkennungs-Variante desselben
  Fehlertyps wie beim phantomen Bodenaustausch in PM-010.
- Wird der ausdrückliche, dreifach wiederholte Ausschluss überhaupt als solcher erkannt (ähnlich der
  Ausschluss-Erkennung aus PM-001), oder wird das Wort „Sockelleisten" trotzdem als generelles
  Boden-Signal gewertet?

**Ist-Ergebnis (Prüfmeister, direkt im Browser-Tab geprüft, 2026-08-17):** Esszimmer korrekt erkannt,
Raummaße exakt (3×4,5 m, Höhe 2,55 m, Türen 1, Fenster 1). Positionen im fertigen Entwurf:

- Wandflächen streichen 2×: 35,16 m² × 9,50 € = 334,02 € ✓ exakt Soll
- Boden schützen: 13,5 m² × 1,20 € = 16,20 € (automatisch abgeleitete Nebenleistung, wie in jedem
  anderen Testfall — kein Fehler)
- Sockelleisten abkleben: 14,1 lfdm × 0,80 € = 11,28 € — das ist die normale, in praktisch jedem Testfall
  auftauchende Schutz-Nebenleistung fürs Streichen der Wand, KEIN Ersatz für die verlangte Leistung
- **„Sockelleisten streichen" (Maler) fehlt komplett** — trotz ausdrücklichem, dreifachem Verlangen
  im Transkript
- **Keine Boden-Position** („Sockelleisten montieren"/„entfernen") — der Ausschluss wurde also sauber
  respektiert, keine Über-Erkennung
- Gesamt: Netto 361,50 € × 1,19 = **430,19 €** — rechnerisch konsistent, kein versteckter 4. Posten

**Befund:**

1. **„Sockelleisten streichen" fehlt — dritte unabhängige Bestätigung derselben Lücke wie PM-010.** Diesmal
   ganz ohne die Doppel-Fall-Verwicklung (kein „montiert UND gestrichen" im selben Satz, keine Verwechslung
   mit „Sockelleisten abkleben" möglich, da diese ja ohnehin als eigene, normale Position da ist). Das
   entkräftet die Hoffnung, dass es sich bei PM-010 um einen Sonderfall der Doppel-Situation handeln
   könnte — die Lücke ist generell: die Maler-Engine kennt offenbar überhaupt keine „Sockelleisten
   streichen"-Position, unabhängig vom Kontext.
2. **Gute Nachricht: kein Phantom auf der Boden-Seite.** Trotz drei verschiedener Verneinungs-
   Formulierungen im selben Satz („bleiben wie sie sind", „NICHT neu gemacht", „NICHT demontiert") kam
   keine einzige unverlangte Boden-Position. Die Über-Erkennungs-Sorge aus der „Worauf achten"-Liste hat
   sich nicht bestätigt — die Ausschluss-Erkennung funktioniert hier sauber, in beide Richtungen (weder
   „montieren" noch „entfernen" wurde fälschlich ergänzt).

**Für Head of IT:** Zusammen mit PM-010 jetzt dreifach bestätigt (Doppel-Fall + zwei isolierte
Wiederholungen an anderer Stelle in diesem Test): eine eigene „Sockelleisten streichen"-Position fehlt
in der Maler-Engine komplett, unabhängig vom Kontext. Das ist keine Rand-Situation mehr, sondern eine
grundsätzliche Lücke — bitte mit entsprechender Priorität behandeln.

**Fix-Update (Head of Product Engineering, 2026-08-17):** Gleicher Fix wie bei PM-010 (siehe dortiges
Update für die volle Root-Cause-Erklärung), hier zusätzlich wichtig: in diesem Fall gibt es GAR KEINE
„Sockelleisten montieren"-Position (ausdrücklich ausgeschlossen). Die Menge wird deshalb stattdessen von
„Sockelleisten abkleben" übernommen — die nutzt dieselbe Umfang-minus-Türen-Formel und ist praktisch immer
da, sobald im Raum gestrichen wird und Sockelleisten existieren, unabhängig davon, ob neu montiert wird.
Neuer Golden-Test mit deinem exakten Transkript (`golden-korrekturen.test.ts`, „PM-012"), erwartet 14,10
lfdm. Volle Testsuite (706 Tests) + `tsc --noEmit` grün. Live-Nachtest steht aus.

**Nachtest (Prüfmeister, 2026-08-19) — ❌ Fix wirkt live NICHT:** Denselben Fall frisch eingesprochen.
Karte erkennt „2 Positionen" — Wände streichen (36 m²), Sockelleisten streichen (10 m), also wieder mit
eigener Menge gemeldet. Raummaße im Entwurf exakt (3×4,5 m, Höhe 2,55 m, 1 Tür, 1 Fenster). Positionen im
fertigen Entwurf:

- Wandflächen streichen 2×: 35,16 m² × 9,50 € = 334,02 € — exakt Soll
- Boden schützen: 13,5 m² × 1,20 € = 16,20 € — normale Nebenleistung
- Sockelleisten abkleben: 14,1 lfdm × 0,80 € = 11,28 € — normale Nebenleistung, kein Ersatz
- **„Sockelleisten streichen" fehlt weiterhin komplett** — keine sechste Position, keine offene
  Rückfrage. Netto 361,50 € — identisch bis auf den Cent mit dem allerersten Ist-Ergebnis von vor dem
  Fix. Keine Boden-Position („montieren"/„entfernen") erfunden, der Ausschluss wird also weiterhin sauber
  respektiert.

**Einordnung:** Der Fix vom 17.08. („Menge wird von Sockelleisten abkleben übernommen") zeigt hier exakt
dasselbe Muster wie bei PM-010: Golden-Test grün, aber live wirkungslos. Wahrscheinlichste Erklärung nach
PM-010s eigener Root-Cause-Kette: derselbe größere, ungelöste Architekturfund (`fehlende` erreicht den
Nutzer nie, 130 Stellen in 18 Dateien) betrifft auch diesen isolierten Fall, oder der PM-010-Fix vom
19.08. (der dort inzwischen bestätigt wirkt) wurde für den Einzelfall „nur Streichen, kein Montieren"
nicht mitgezogen. Für Head of Product Engineering: bitte mit demselben, jetzt bei PM-010 erfolgreichen
Ansatz nachziehen und hier ebenfalls live gegenprüfen — nicht nur gegen den Golden-Test.

**Fix-Update (Head of Product Engineering, 2026-08-19):** Ehrlich zum Stand: die genaue Ursache, warum die
Text-Heuristik in `vollstaendigkeit/maler-tapete.ts` (`hatSockelleistenStreichenSignal`) live nicht greift,
obwohl sie mehrfach gegen echte Transkripte getestet wurde, konnte ich ohne Zugriff auf die tatsächlichen
GPT-Rohdaten deines Nachtests nicht abschließend klären — das wäre reines Raten gewesen, und genau davor
warnt die eigene Historie dieses Falls (fünf Versuche, die alle „im Golden-Test grün" waren). Statt einer
sechsten Text-Heuristik deshalb dieselbe robustere Lösung wie bei PM-010: dein Karten-Chip meldet
„Sockelleisten streichen" nachweislich zuverlässig (dein Nachtest zeigt „Sockelleisten streichen, 10 m" auf
der Karte) — das ist ein verlässlicheres Signal als die tiefere, mehrfach gescheiterte Text-Analyse.
`aufnahme-hinweise.ts` prüft jetzt zusätzlich, als Sicherheitsnetz, auf diesen Chip-Titel und ergänzt bei
Bedarf eine „Sockelleisten streichen"-Position — Menge kommt von „Sockelleisten montieren" falls vorhanden,
sonst (wie in deinem Fall, Neumontage ausdrücklich ausgeschlossen) von „Sockelleisten abkleben" (14,1 lfdm,
exakt die Soll-Lösung). Läuft NUR, wenn die tiefere Engine noch keine solche Position angelegt hat (kein
Duplikat-Risiko). Neuer Test in `aufnahme-hinweise.test.ts` mit deinem exakten Nachtest-Transkript, prüft
zusätzlich, dass weiterhin keine Boden-Position „montieren"/„entfernen" erfunden wird (der Ausschluss bleibt
erhalten). Zusätzlich, als generelles Sicherheitsnetz für alle ähnlichen Fälle: der `fehlende`→sichtbare-
Position-Fix aus `mehrgewerk.ts` (siehe PM-010-Fix-Update oben). Live-Nachtest steht aus — bitte diesmal
wieder denselben Satz einsprechen.

**Nachtest (Sandy, 2026-08-20) — ✅ Fix bestätigt, Fall damit komplett grün.** Denselben Fall frisch
eingesprochen. Karte weiterhin „2 Positionen erkannt" (Wände streichen 36 m², Sockelleisten streichen
10 m). Raummaße im Entwurf exakt (3×4,5 m, Höhe 2,55 m, 1 Tür, 1 Fenster). Drei Positionen im fertigen
Entwurf:

1. Wandflächen streichen 2× — 35,16 m² × 9,50 € = 334,02 € — exakt Soll
2. Boden schützen — 13,5 m² × 1,20 € = 16,20 € — normale Nebenleistung
3. **Sockelleisten streichen — 14,1 lfdm × 3,50 € = 49,35 € — jetzt endlich als echte Position da,
   exakte Soll-Menge** (14,1 lfdm, wie im Fix-Update erwartet, Menge korrekt von „Sockelleisten
   abkleben" übernommen)

„Sockelleisten abkleben" selbst taucht diesmal zu Recht nicht mehr separat auf — fachlich folgerichtig,
weil man Sockelleisten, die man ohnehin streicht, nicht zusätzlich zum Schutz abklebt. Keine Boden-Position
(„montieren"/„entfernen") erfunden, der ausdrückliche Ausschluss bleibt sauber respektiert. Damit ist der
Kernbug dieses Falls — „Sockelleisten streichen" fehlte trotz dreifach ausdrücklichem Verlangen — nach
fünf gescheiterten Versuchen jetzt live bestätigt behoben. Wandert damit ins Archiv, volle Historie bleibt
dort erhalten.
