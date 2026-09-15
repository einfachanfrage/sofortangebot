# Restliste Prüfmeister — Stand 15.09.2026, spät abends

**Diese Datei ersetzt die Fassung vom Live-Lauf** und führt sie fort: Der
Live-Teil unten steht unverändert, dahinter steht, was der stündliche Lauf
danach gemacht hat (K.1/K.2/K.3, Batch PM-064 bis PM-068). Was dort offen stand, ist
unten weitergeführt oder als erledigt eingetragen. Die Datei wird immer
ersetzt, nie ergänzt.

---

## Wie geprüft wurde

Sandys Rechner ist über die Shell weiterhin nicht erreichbar (Windows-Update
vom 08.09.). Gelesen und geschrieben wurde über Staging und Commit, gerechnet
in der Ersatzumgebung mit dem echten Code und dem echten Standardkatalog.

**Gelaufen:** `node scripts/vokabular-abgleich.mjs` und die Testdateien dieser
Spur — **215 grüne Prüfungen, 27 bewusste Sperrklinken** (`it.fails`).
`katalog-deckung.test.ts` braucht den Next.js-Endpunkt und läuft hier
grundsätzlich nicht — eine Grenze der Umgebung, kein Befund.

---

## Erledigt in diesem Lauf

### 1. Restliste Nr. 10 — `VARIANTEN` nachziehen. War die falsche Diagnose.

Der Zähler „Titel aus Variablen, nicht prüfbar" stand auf 6 und war von 3
gewachsen. Ich hatte das einer unvollständigen `VARIANTEN`-Liste zugeschrieben.
Nachgesehen, welche sechs Titel es sind: **vier brechen mitten im Ausdruck ab.**

Die Ursache saß in `literal()` im Skript selbst: Der Leser zählte `${ … }`
nicht mit und hielt den ersten Backtick eines **verschachtelten** Templates für
das Ende des Titels. Jeder Raum-Anhang, der als Ternär geschrieben ist
— `${raum ? ` — ${raum}` : ''}` —, erhöhte den Zähler um eins. Dahinter stehen
ganz normale, prüfbare Titel.

Behoben (drei Eingriffe in `scripts/vokabular-abgleich.mjs`), **Zähler jetzt
0.** Alle sechs Titel finden einen Katalogpreis, keiner ist eine Lücke.
Ausführlich in `vokabular-abgleich.md` R.
Test: `src/lib/__tests__/pm-vokabular-varianten.test.ts`.

### 2. Dabei aufgefallen: das Skript las zwei von sechs aktiven Gewerken

`QUELLEN` enthielt Maler und Boden. **`fliesen` steht in `gewerke-config.ts`
auf `aktiv: true`** — ein Fliesenleger bekommt das Gewerk angeboten, geprüft
hat es nie jemand. Jetzt mit drin.

```
                                   vorher    nachher
Engine-Titel mit eigener Einheit     155        170
davon ohne Preis                      15         22
davon knapp (Score < 0,75)             3          3
gute Treffer                         137        145
Titel aus Variablen, nicht prüfbar     6          0
```

**Alle sieben neuen Lücken sind Fliesen** — und es sind die tragenden Zeilen
eines Bades. Siehe PM-060 unten. Ausführlich in `vokabular-abgleich.md` S.

### 3. Restliste Nr. 9 — `Übergangsprofil / Schwelle einbauen` nachgemessen

Die Frage war: sind die 0,29 h zu hoch, oder fehlt das Material?
**Die Stunden sind richtig, das Material fehlt.** Der Beweis kommt aus dem
Katalog, nicht aus einem Baumarktpreis:

```
Übergangsprofil / Schwelle einbauen     15,00 €/Stück
Schwelle / Übergangsprofil entfernen     8,00 €/Stück   ← reine Arbeit
```

Steckten im Einbau 8–12 € Profil, bliebe für die Einbau-**Arbeit** 3,00 bis
7,00 € — weniger als für den Ausbau. Niemand setzt ein Profil schneller, als er
eines herausreißt. Also: 15,00 € ist Arbeitslohn, 0,29 h stimmen (unterstellter
Satz 51,7 €/h, im Band der übrigen Zeit-Zeilen 51,7–55,0 €/h).

Offen bleibt damit nicht die Stundenzahl, sondern die **Marke**: Die Zeile
trägt `material: 'zubehoer'`, ihr Preis ist aber zu 100 % Zeit — bei jedem
Stundensatz. Als PM-057 in die Fallbasis, Entscheidung über die Bauweise liegt
bei Engineering.

---

## Neu: drei Funde aus der Preisliste, zwei mit Geldweg

Beim Nachmessen von Nr. 9 quer geprüft, was `preis-ableitung.ts` und
`materialanteil.ts` über dieselbe Zeile sagen.

| Fund | Wirkung | Geldweg |
|---|---|---|
| **PM-057** Zeile mit `material: 'zubehoer'` trägt das Zubehör nicht im Preis | Betrieb zahlt das Profil selbst, bei jeder Tür | 8–12 € je Stück |
| **PM-058** `Grundieren (Tiefengrund)` steht **zweimal** in einer Preisliste — 5,50 € und 3,00 €, Katalog 4,50 € | zwei Preise für dieselbe Arbeit; welcher gilt, entscheidet der Matcher | 2,50 €/m² Spanne |
| **PM-059** fünf Zeilen: `preis-ableitung.ts` sagt `wahl`, `materialanteil.ts` gibt keinen Schalter | wer Material selbst stellt, bekommt nichts abgezogen | je Zeile 25–45 % |

Zu PM-058: betroffen ist jeder Betrieb, der **Maler innen und Tapezieren**
ankreuzt. Zu PM-059: zwei der fünf Zeilen (Trittschall, Sockelleisten) wurden
in PD-009 §2 **absichtlich** auf `wahl` gestellt, während `materialanteil.ts`
sie wörtlich als Zubehör sperrt — beide Dateien am selben Tag geschrieben.

**Was ich ausdrücklich nicht entscheide:** welche der beiden Dateien recht hat.
Die fachliche Frage beantworte ich gern, aber erst, wenn klar ist, welche Datei
die Oberfläche speist. Eine Quelle, nicht zwei, ist die Bedingung.

Ausführlich in `pruefmeister-notizen-fuer-designer.md`, PD-014.
Test: `src/lib/__tests__/pm-preisliste-material.test.ts`.

---

## Neu: Batch PM-060 bis PM-062 — Bad und Fliesen

Erster Batch außerhalb von Maler und Boden. Thema stand seit dem 10.09. im
Speicher unter F. Hinterlegt als
`src/lib/__tests__/pruefmeister-batch-60-62.test.ts` — **9 Prüfungen grün, vier
Sperrklinken.**

Anders als PM-047 bis PM-056 läuft dieser Batch nicht über
`verarbeiteExtraktion`: Die Pipeline dort normalisiert `raeume` für Maler und
Boden, die Fliesen-Engine liest `bereiche` und `altbelag`. Gefahren wird
Engine + Vollständigkeitsprüfung, so wie der Endpunkt es für dieses Gewerk tut.

| Fall | Inhalt | Stand |
|---|---|---|
| PM-060 | Bad komplett neu fliesen, Nassbereich — Mengen und Verschnitt stimmen | ✅ + 2 Funde |
| PM-061 | „nur die Wandfliesen" — der Boden wird trotzdem berechnet | 🔴 Sperrklinke |
| PM-062 | `Altfliesen abstemmen` nimmt immer den Bodenpreis | 🔴 zwei Sperrklinken |

### PM-060-A — sieben von neun Zeilen ohne Preis: 1.935,94 € auf einem kleinen Bad

Bad 2,40 × 1,80 m, Fliesenhöhe 2,10 m. Ohne Preis stehen da:

```
Bodenfliesen verlegen     4,75 m²   Verfugung Boden                4,32 m²
Wandfliesen verlegen     18,52 m²   Verfugung Wand                17,64 m²
Verbundabdichtung Wand   17,64 m²   Fliesensockel / Abschluss       8,40 lfdm
Entsorgung Fliesenmaterial 16,00 m²
```

Die Mengen selbst stimmen (10 % Verschnitt Boden, 5 % Wand, Verfugung und
Abdichtung auf netto — richtig so, abgedichtet wird die Wand, nicht der
Verschnitt). Es fehlt nur der Preis. **Zwei Ursachen, sauber getrennt:**

- **Wortlaut** — die Engine schreibt `Verfugung Boden`, der Katalog führt
  `Verfugen Boden`; `Bodenfliesen verlegen` gegen `Bodenfliesen Standard
  (30×30 bis 60×60cm), gerade, Q2`. Kein Treffer über der Schwelle.
- **PM-060-B, Gewerke-Zuordnung** — `gewerkFuerPosition` liest „Wand" und
  entscheidet auf **`maler`**, für alle drei Wand-Zeilen. Danach wird gegen den
  Malerkatalog gehalten. `Verbundabdichtung Wand` hätte im Fliesenkatalog mit
  Score 0,94 auf 28,00 €/m² getroffen: **493,92 € allein an der Zuordnung.**

### PM-061-A — „nur die Wandfliesen", und der Boden steht trotzdem im Angebot

Das Gegenstück zu PM-047 („nur die Decke, Wände bleiben"), das für Maler grün
ist. `fliesenEngine` schreibt Bodenfliesen, sobald Länge und Breite dastehen —
unabhängig davon, was gesagt wurde. `erkenneFliesenBereich()` kennt `nurWand`
sogar, wird aber erst **nach** der Engine gelesen und räumt nichts mehr weg.

Das ist die Regel „Nichts erfinden" einmal ganz: nicht eine ergänzte Zeile mit
Preis, sondern drei Zeilen für eine Arbeit, die ausdrücklich ausgenommen wurde.
**324,50 €**, sobald PM-060-A behoben ist.

### PM-062-A — der Titel sagt nicht, welche Fliesen abgestemmt werden

Der Katalog unterscheidet Boden (18,00 €/m²) und Wand (22,00 €/m²). Die Engine
schreibt einen Titel für beides, und er trifft immer den Boden. Bei Wandfliesen
sind das 4,00 €/m² zu wenig — auf 18 m² **72,00 €** — und auf dem Kundenpapier
steht eine Arbeit, die nicht die ausgeführte ist. Dieselbe Familie wie TN-127
(PM-056-A): Der Titel nimmt nicht, was im Raum liegt.

---

---

## Neu: Manfreds Durchsicht der Diktate PM-047 bis PM-056 (15.09., abends)

Sandy hat die zehn Diktate zum Einsprechen bekommen. Manfred hat sie gegengelesen.
047, 048, 049, 051, 054 hat er nachgerechnet und freigegeben — Umfänge, Flächen,
Übermessung, 49,40 / 39,00 / 46,80 / 15,12 stimmen. Fünf Punkte kamen zurück, vier
davon sind echte Funde am Produkt, einer war ein Fehler in meiner Erwartung.

### PM-053-A — Erschwerniszuschlag Raumhöhe feuert außen neben dem Gerüst

Der Zuschlag „Raumhöhe > 3 m" (15 %) ist der Innenfall: Leiter oder Rollgerüst statt
Stehen auf dem Boden. Außen **ist** das Gerüst die Erschwernis, und es steht mit
450,00 € als eigene Pauschale im selben Angebot. Heute kommen beide Zeilen.
Das ist zweimal Geld für dieselbe Sache und fällt auf dem Kundenpapier auf.
**Soll:** kein Raumhöhen-Zuschlag, wenn die Fläche eine Außenfläche ist oder eine
Gerüstposition im selben Angebot steht. Sperrklinke steht in der Batch-Datei.

### PM-063-A — „bauseits gestellt" wird nicht gelesen (neuer Fall)

Nachgemessen mit drei Formulierungen: „Gerüst wird gestellt", „wir stellen das
Gerüst", „das Gerüst wird bauseits gestellt" — **alle drei** ergeben
`Gerüst stellen (Pauschale)` zu 450,00 €. Das Wort bauseits kommt im Code nicht vor.
Bauseits heißt: der Kunde hat es schon stehen, es wird nicht berechnet. Heute liest er
eine Position, die er nicht bestellt hat.
**Soll:** bei bauseits / „steht schon" / „stellt der Kunde" keine Gerüstposition.

Gleichzeitig war mein Diktat schlecht gewählt: „Gerüst wird gestellt" ist auf dem Bau
zweideutig und taugt nicht als Prüfsatz. PM-053 sagt jetzt „wir stellen das Gerüst",
der bauseitige Fall ist PM-063. Das war ein Fehler in der Erwartung, nicht am Produkt.

### PM-055-A — Verschnitt nur bei schwimmend ist die falsche Regel

Kork vollflächig verklebt ergibt 12,00 m² auf 12,00 m² Rohfläche. Laminat schwimmend
bekommt 5 % Aufschlag. Kork kommt in Platten, der Verschnitt ist dort eher höher als
beim Klick-Laminat. Eine Regel, die den Aufschlag an der Verlegeart festmacht, ist
fachlich falsch.
**Entscheidung (Prüfmeister):** 5 % Verschnitt auf **jeden** Belag, unabhängig von der
Verlegeart; 15 % bei Fischgrät und Diagonalverlegung. Soll für PM-055: 12,60 m².

### PM-056-B — die Entsorgung fehlt, 110,00 € je Fall

Im Diktat steht „raus **und entsorgt** werden". Die fachlich richtige Zeile für
verklebten Teppich heißt `Teppichboden verklebt entfernen` (9,00 €/m²) — und die Wörter
„und entsorgen" stehen dort, anders als bei der Zeile für losen Teppich, **nicht** drin.
14 m² verklebter Teppich sind rund ein Kubikmeter Sperrmüll. Das ist die
`Kleinfuhre bis 1m³` mit 110,00 €, die heute nur in der Allrounder-Vorlage
(`preise-vorlagen.ts`) steht und nicht im Katalog unter `Boden – Reinigung & Entsorgung`.
**Soll:** Zeile in den Katalog aufnehmen und setzen, sobald Altbelag entfernt wird und
der Entfernen-Titel die Entsorgung nicht selbst schon enthält.
Zusätzlich: `Klebstoffreste / Altkleber abfräsen` (14,00 €/m²) ist nach verklebtem
Teppich die Regel, nicht die Ausnahme — steht als „darf drinstehen", nicht als Fehler.

### PM-050-B — 3,00 € je Dübelloch ist keine Zahl, die ein Betrieb schreibt

Drei Löcher ergeben 9,00 €. Dafür fährt niemand raus. In der Praxis ist das eine
Pauschale, Manfreds Spanne 15–25 €.
**Entscheidung (Prüfmeister):** Katalogzeile wird
`Kleine Ausbesserungen (bis 5 Stellen)`, Pauschale, **20,00 €**. Ab der sechsten Stelle
greift die Flächen- oder Zeitzeile. Damit erledigt sich für diesen Fall auch die
Mengenfrage; das Zahlwort bleibt über PM-052-A abgedeckt.

### PM-052 — „Heizkörper abkleben" als Verbotsprüfung nachgetragen

Wer lackiert, klebt nicht ab. Die beiden Zeilen liegen im Katalog nebeneinander, das ist
die naheliegendste Verwechslung. Nachgemessen: die App macht sie heute **nicht** —
die Prüfung steht ab jetzt trotzdem als Sperrklinke drin.

### Stand der Batch-Datei

`pruefmeister-batch-47-56.test.ts`: 22 Prüfungen grün, 7 Sperrklinken
(PM-050-B, PM-052-A, PM-053-A, PM-055-A, PM-056-A, PM-056-B, PM-063-A).
Die Diktate zum Einsprechen liegen in `docs/pruefmeister-einsprechen-47-56.md`.

---

---

## Neu: Live-Lauf PM-047 bis PM-056 und PM-063 (15.09., abends, Sandy eingesprochen)

Der erste Durchgang, bei dem alle elf Fälle wirklich ins Mikrofon gesprochen wurden.
Damit ist zum ersten Mal der KI-Schritt mitgeprüft, den die Batch-Datei ausdrücklich
nicht abdeckt. Ergebnis: **sechs Fälle sauber, fünf neue Funde, zwei Korrekturen an
meinem eigenen Prüfstand.**

Live sauber: **047, 048, 049, 051, 052, 054.** Alle Mengen stimmen — 14,00 · 49,40 ·
39,00 / 15,12 · 46,80 · 45,00 · 14,70 / 15,00 / 14,00. Übermessung, Sockelleisten-
Umfang, Q3 statt Q2, zwei Anstrichzahlen im selben Raum, Verschnitt nur auf den Belag
und nicht auf die Dämmung: alles wie im Soll.

### Zwei Korrekturen an meinem Prüfstand — beide gegen mich

**1. Die Zahlwort-Familie gibt es nicht.** Die Spracherkennung liefert Zahlen als
**Ziffern**: aus „zwölf Meter lang" wird `12 Meter lang`, aus „die zwei Heizkörper"
wird `die 2 Heizkörper`. Live steht in allen drei Heizkörperzeilen Menge **2** und bei
den Dübellöchern Menge **3**. Nachgemessen: mit Ziffern im Transkript ist der
Prüfstand ebenfalls grün.
Meine Testdiktate hatten ausgeschriebene Zahlwörter — eine Schreibweise, die im echten
Transkript nie vorkommt. Damit fallen **PM-050-A und PM-052-A** ersatzlos weg, und
**PM-045-A / PM-045-B aus dem stündlichen Lauf sind mit hoher Wahrscheinlichkeit
dieselbe Sache** und vor der Umsetzung nachzumessen, bevor jemand daran Code ändert.
Die Diktate in der Batch-Datei sind auf die Schreibweise der Spracherkennung gebracht.

**2. `ergaenzeAusAufnahmeHinweisen` lief im Prüfstand nicht mit.** Die echte Route legt
diese Stufe (und `normalisiereBodenPositionenAusAufnahme`) über die
Vollständigkeitsprüfung. In `pruefmeister-batch-47-56.test.ts` fehlte sie — derselbe
Fehler wie bei PM-013-A, zum zweiten Mal. Beide Stufen sind jetzt drin. Erst dadurch
wird PM-056-C überhaupt sichtbar.

### PM-056-C — dieselbe Arbeit zweimal im Angebot, 168,00 € statt 126,00 €

Der schwerste Fund des Laufs. Im Schlafzimmer stehen **zwei** Entfernen-Zeilen:

| Zeile | Menge | Preis | Betrag |
|---|---|---|---|
| Laminat demontieren und entsorgen | 14 m² | 5,00 € | 70,00 € |
| Altbelag entfernen | 14 m² | 7,00 € | 98,00 € |
| **richtig wäre** | **14 m²** | **9,00 €** | **126,00 €** |

168,00 € für einen Arbeitsgang, und keine der beiden Zeilen nennt Teppich oder verklebt.
Die Raumübersicht zählt „2 Positionen", das Angebot zeigt drei — die zweite Entfernen-
Zeile wird nicht einmal mitgezählt.

**Ursache, im Code nachgelesen:** `pruefeAltbelag` benennt die Engine-Zeile
`Altbelag entfernen — Schlafzimmer` in `Laminat demontieren und entsorgen` um. Danach
sucht `ergaenzeAusAufnahmeHinweisen` (`mengen/aufnahme-hinweise.ts`, Z. 55) nach
`/altbelag entfernen|teppichboden entfernen/`, findet nichts mehr und legt die Zeile ein
zweites Mal an. **Die Umbenennung macht die vorhandene Position für die eigene
Dopplungsbremse unsichtbar** — exakt der Mechanismus der Zug-2b-Regression vom 12.09.
Sperrklinke steht, im Prüfstand reproduziert.

### L-02 — die Fassadenaufnahme legt einen leeren Zweitraum an (PM-053 und PM-063)

Beide Fassadenfälle erzeugen neben der Wand ein zweites Objekt `Raum` **ohne Maße**
(`! × ! m`). Sandy musste drei bzw. vier Rückfragen zu einem Raum beantworten, den es
nicht gibt. Dort hängt der `Erschwerniszuschlag Raumhöhe > 3m` mit **15 % × 0,00 € =
0,00 €**.

Damit ist **PM-053-A entschärft, aber nicht erledigt**: es wird kein doppeltes Geld
kassiert, weil die Bezugsfläche leer ist. Auf dem Kundenpapier steht trotzdem eine Zeile,
die 15 % Zuschlag ankündigt und nichts berechnet. Der Phantomraum ist der schwerere Fund
und entsteht vor der geprüften Stufe.

### L-03 — Positionen mit Menge 0 auf dem Kundenpapier

In 050, 053 und 063 steht `Voranstrich / Grundierung (nur Reparaturstelle)` mit
**0 Stück × 25,00 € = 0,00 €**. Bei 053 zusätzlich zur richtigen Fassadengrundierung
über 72 m². Eine Nullzeile gehört nicht auf ein Angebot: entweder die Menge steht, oder
die Zeile fällt weg. **Soll:** Positionen mit Menge 0 werden vor der Anzeige verworfen.

### L-04 bis L-08 — der Text auf dem Kundenpapier

Fünf Funde, die keine Zahl verschieben, aber den Betrieb auf dem Papier schlecht aussehen
lassen. Kein einziger davon ist im Prüfstand sichtbar, weil dort nur Titel und Menge
geprüft werden und nicht der Untertitel.

**L-04 (PM-050):** Unter `Dübellöcher spachteln` steht als Beschreibung
„Wände für einen ebenen Untergrund **vollflächig** spachteln". Genau der teure
Verwechsler, den die Prüfung abwehren sollte — nicht in der Menge, sondern im Text. Der
Kunde liest eine Vollflächenspachtelung für drei Löcher.

**L-05 (PM-052):** Unter `Heizkörper lackieren (2× Anstrich)` steht
„Heizkörper **schleifen, grundieren** und lackieren", während `Heizkörper abschleifen`
und `Heizkörper grundieren` als eigene Zeilen daneben stehen. Der Kunde liest dreimal
dieselbe Arbeit. **Soll:** der Untertitel einer aufgeteilten Zeile beschreibt nur seinen
eigenen Arbeitsgang.

**L-06 (PM-051):** Die Reihenfolge ist nicht der Arbeitsablauf. Auf dem Papier steht
Grundierung, dann Anstrich, dann Spachtelarbeiten Q3. Gearbeitet wird umgekehrt:
spachteln, grundieren, streichen. Wer das liest, hält den Betrieb für ahnungslos.
**Soll:** Positionen in der Reihenfolge der Ausführung.

**L-07 (PM-055):** Untertitel „Fachgerecht verlegt inklusive Zuschnitt und
**Verschnitt**" bei einer Menge **ohne** Verschnittaufschlag. Der Text verspricht, was
die Zahl nicht enthält. Erledigt sich mit PM-055-A.

**L-08 (PM-047, PM-055):** Die Pauschale `Kleinmaterial und Verbrauchsmaterial` kommt in
048, 049, 050, 051, 052, 053, 054 — in **047 und 055 nicht**. Dieselbe Baustelle, mal
25,00 € (bzw. 35,00 € beim Boden), mal nichts. Wer nur die Decke streicht, braucht
genauso Folie, Krepp und Rührquirl. **Soll:** entweder immer oder nach einer Regel, die
sich erklären lässt — nicht abhängig davon, wie viele Positionen zufällig entstanden sind.

### Live bestätigt

* **PM-063-A** — „Das Gerüst wird bauseits gestellt, das steht schon" ergibt trotzdem
  `Gerüst stellen und abbauen`, 1 Pauschale, **450,00 €**. Bestätigt.
* **PM-055-A** — Kork 12,00 m² statt 12,60 m². Bestätigt.
* **PM-056-A** — der Entfernen-Titel nennt den neuen Belag, nicht den alten. Bestätigt.
* **PM-056-B** — keine Entsorgungsfahrt im Angebot. Bestätigt.
* **PM-050-B** — 3 Dübellöcher × 3,00 € = 9,00 €. Bestätigt.

### Geldweg in einem Satz

Pro Angebot mit verklebtem Altbelag: **42,00 € zu viel** (doppelte Entfernen-Zeile) und
gleichzeitig **110,00 € zu wenig** (fehlende Entsorgungsfahrt). Pro Fassadenangebot mit
bauseitigem Gerüst: **450,00 € zu viel**. Pro Kleinreparatur: rund **11,00 € zu wenig**.

### Stand der Batch-Datei

`pruefmeister-batch-47-56.test.ts`: **23 Prüfungen grün, 7 Sperrklinken**
(PM-050-B, PM-053-A, PM-055-A, PM-056-A, PM-056-B, PM-056-C, PM-063-A).
Gesamte Ersatzumgebung: 654 grün, 7 erwartete Fehlschläge, 2 Fehler nur wegen zweier
nicht gestagter Dateien.

---

## Neu: K.1 beantwortet — Engineerings Eingriff 3 ist frei

Ausführlich im Themenspeicher unter K.1, hier die zwei Sätze:

- **Welche Fläche gilt bei bloßem „Sperrgrund"?** Die Fläche folgt der
  **Ursache**: Wasserfleck → Decke · Nikotin/Ruß → **Wand und Decke** · eine im
  Satz genannte Fläche schlägt alles · gar nichts davon → **keine bepreiste
  Zeile, Rückfrage**. Rauch steigt; die Decke ist die am stärksten belastete
  Fläche im Raum. Eine halb gesperrte Wohnung ist keine gesperrte Wohnung.
- **Fällt der Tiefengrund weg?** **Nur auf der gesperrten Fläche. Je Fläche,
  nie je Angebot.** Der Isoliergrund *ist* dort die Grundierung, und er braucht
  den saugenden Untergrund, den ihm ein Tiefengrund darunter nimmt. „Wände
  sperren, Decke normal grundieren" muss **beide** Zeilen ergeben — nur nie auf
  derselben Zahl.

Als Soll hinterlegt in `pruefmeister-batch-1509.test.ts`: PM-046-A, -B, -D, -E.
Der Fehlauslöser, der beim Beantworten aufgefallen ist, steht als PM-064 unten.

## Neu: K.2 erledigt — und PM-045-A nachgemessen, wie der Live-Lauf verlangt hat

Der Live-Teil oben sagt: „**PM-045-A / PM-045-B sind mit hoher Wahrscheinlichkeit
dieselbe Sache** und vor der Umsetzung nachzumessen, bevor jemand daran Code
ändert." **Nachgemessen. Der Verdacht stimmt.**

`lauf()` in `pruefmeister-batch-1509.test.ts` hat der Vollständigkeitsprüfung
das **rohe** Transkript gereicht; die Pipeline reicht dort `textMitZahlen` —
den einmal am Eingang durch `ersetzeZahlenWorte` geschickten Text
(extraktion-pipeline.ts Z. 83, Z. 271 f.; mehrgewerk.ts Z. 212). Mit dem Text,
den das Produkt tatsächlich weitergibt:

| war gemeldet | gemeldeter Geldweg | tatsächlich |
|---|---|---|
| **PM-045-A** vier Türzeilen tragen Menge 1 | 540,00 € — „teuerster Fund des Batches" | Menge **4**, grün |

Damit ist die ganze Zahlwort-Familie erledigt: PM-050-A und PM-052-A durch den
Live-Lauf (die Spracherkennung liefert Ziffern), PM-045-A hier.

**PM-045-B neu gefasst:** Die alte Fassung prüfte `zaehleTueren('vier Türen')`
nackt. Richtig gemessen, aber ohne Aussage über das Produkt — das ruft die
Funktion nie mit rohem Text auf. Zugesichert wird jetzt der Weg, den das
Produkt geht: Zahlwort → Normalisierung → Stückzahl → Position.

Beide Batch-Dateien normalisieren den Text jetzt einmal am Eingang, wie die
Pipeline es tut. Das ist dieselbe Lehre wie der zweite Live-Fund („`ergaenze-
AusAufnahmeHinweisen` lief im Prüfstand nicht mit"), von der anderen Seite:
**Ein Prüfstand, der die Pipeline nachbaut, ist selbst prüfbedürftig.** Zweimal
an einem Tag hat er eine Stufe anders gehabt als das Produkt — einmal zu wenig,
einmal zu roh.

*Für Engineering: zwei Zeilen weniger auf CoS-E-059. Ich habe sie gemeldet, ich
nehme sie zurück.*

## Neu: K.3 übernommen — und damit Nr. 10 beantwortet

Die Korrektur des Chief of Staff stimmt; ich hatte `aktiv: true` der
Kleinmaterial-Pauschale zugeschrieben. Übernommen ist die schärfere
Formulierung: Die vier Gewerke sind nicht „aktiv", sie sind **über das Diktat
erreichbar**. Betroffen ist nicht der Fliesenleger, den es nicht gibt, sondern
der Maler mit einem Bad im Diktat. Die Korrektur steht auch in
`vokabular-abgleich.md` als Abschnitt T, dort wo die falsche Begründung steht.

Die Frage aus Nr. 10 („sind die drei Engines mehr als Durchreichen?") war die
falsche Frage. Der Abgleich prüft Titel gegen Katalog — eine Durchreiche-Engine
schreibt genauso feste Titel wie eine rechnende, und ein Titel ohne Treffer
ergibt 0,00 €. `trockenbau`, `elektro` und `sanitaer` sind jetzt in `QUELLEN`:

```
                                   vorher    nachher
Engine-Titel mit eigener Einheit     170        182
davon ohne Preis                      22         32
davon knapp (Score < 0,75)             3          3
gute Treffer                         145        147
Titel aus Variablen, nicht prüfbar     0          0
```

**Alle zehn neuen Lücken liegen in den drei neu gelesenen Gewerken**, sechs
davon Trockenbau. Ausführlich in `vokabular-abgleich.md` T, als Fall PM-068.

## Neu: Batch PM-064 bis PM-068 — fünf Themen aus dem Speicher

Hinterlegt als `src/lib/__tests__/pruefmeister-batch-64-68.test.ts` —
**4 Prüfungen grün, 15 Sperrklinken.**

| Fall | Thema (Speicher) | Stand |
|---|---|---|
| PM-064 | B · Sperrgrund, Fehlauslöser | 🔴 drei Sperrklinken |
| PM-065 | D · Treppe Maler: Stufen, Setzstufen, Wangen, Geländer | 🔴 drei Sperrklinken |
| PM-066 | F · Treppen komplett (Bodenbelag) | ✅ + 🔴 vier Sperrklinken |
| PM-067 | F · Abbruch und Entsorgung, Container | ✅ + 🔴 zwei Sperrklinken |
| PM-068 | F · Trockenbau: Wand stellen, Decke abhängen | ✅ + 🔴 drei Sperrklinken |

### PM-064 — „das ist Sperrmüll" erzeugt einen Isoliergrund

Beim Beantworten von K.1 aufgefallen. Der Auslöser hängt an
`lower.includes('sperr')` (`maler-sonder.ts` Z. 42) — am **Wortstamm**, nicht
am Sachverhalt. Der steckt in Sperrmüll, absperren, Absperrband, Sperrholz,
gesperrt; auf dem Bau sind das gewöhnliche Wörter. Gemessen, mit „Wände und
Decke zweimal streichen" als Auftrag und einem harmlosen Nebensatz:

```
„… das ist Sperrmüll."          → Isoliergrund 12,00 m²  108,00 €
                                  Tiefengrund  12,00 m²   54,00 €
„… die Baustelle absperren."    → dasselbe
```

**162,00 € für eine Arbeit, von der niemand gesprochen hat.** Und die Regel ist
nicht bloß additiv: Sie wirft die vorhandene `Decke streichen`-Position weg und
baut drei neue auf derselben Zahl — die ausdrücklich bestellte Deckenposition
trägt danach `automatisch_ergaenzt`. Ein Wort im Nebensatz ändert den
Hauptauftrag.

### PM-065 — ein Treppenhaus streichen: keine einzige Treppenposition

Diktat: vierzehn Stufen streichen, Setzstufen auch, acht Meter Geländer
lackieren, Wangen mitstreichen. Der Malerkatalog kann zwei davon
(`Treppenstufen streichen / versiegeln` 18,00 €/Stück, `Treppengeländer
lackieren` 18,00 €/lfdm). **Im Angebot steht keine davon.** Was entsteht, sind
Wand- und Deckenflächen für einen Raum 3,00 × 1,20 — als wäre ein Treppenhaus
ein Zimmer.

```
Soll  14 Stufen  × 18,00 =  252,00 €
      8,00 lfdm  × 18,00 =  144,00 €
                            396,00 €   davon im Angebot: 0,00 €
```

Dazu **der falsche Handgriff**: `Geländer abkleben`, Pauschale, ohne Preis, aus
`maler-abkleben.ts` Z. 121 mit dem Kommentar „Treppenhaus — Geländer immer
abkleben". Feuert unbesehen, auch wenn im Diktat wörtlich „das wird lackiert"
steht. Wer lackiert, klebt nicht ab — dieselbe Verwechslung wie beim Heizkörper
in PM-052, hier ohne jede Bedingung. Setzstufe und Wange fehlen im
**Malerkatalog** ganz, obwohl Fliesen- und Bodenkatalog die Setzstufe führen.

### PM-066 — Treppe mit Belag: 770,00 € ohne Preis

Diktat: vierzehn Stufen, Vinyl geklebt, Treppennase. Die App **erkennt die
Stückzahl richtig** (14 Trittstufen, 14 Setzstufen) und findet für keine davon
einen Preis: Die Titel heißen `Trittstufen belegen` / `Setzstufen belegen`
(`boden-sonder.ts` Z. 208/216), der Katalog heißt `Vinyl auf Treppenstufen
kleben` (55,00 €/Stück).

```
Trittstufen belegen    14 Stück   Soll 55,00 €  → 770,00 €   Ist 0,00 €
Setzstufen belegen     14 Stück   Soll  —                    Ist 0,00 €
Treppennase                       gesagt, steht nicht im Angebot (22,00 €/St.)
Vinyl-Boden verlegen    3,15 m²   16,00 € = 50,40 €  ← erfunden
```

Die letzte Zeile ist der Grundriss der Treppe, einmal als Fläche berechnet —
**zusätzlich** zu den vierzehn Stufen. Auf der Treppe wird die Stufe belegt,
nicht der Grundriss. Unterm Strich kommt ein Treppenauftrag mit rund 50 €
heraus, wo gut 1.100 € stehen müssten. **Der teuerste Fund dieses Batches.**
Dieselbe Familie wie PM-060-A: Die Mengen stimmen, der Wortlaut trifft den
Katalog nicht.

### PM-067 — der bestellte Container fehlt, der Altbelag ist zu billig

Zweites Diktat zum Thema aus PM-056, und es bestätigt PM-056-A aus anderer
Richtung: „Der alte Teppich muss raus, **verklebt**" ergibt `Teppichboden
entfernen und entsorgen` zu **6,00 €/m²** — die Zeile für den losen Teppich.
Verklebt kostet 9,00 €/m²; auf 14 m² sind das 42,00 € zu wenig.

„Wir brauchen einen Container" steht wörtlich im Diktat — **keine
Entsorgungsposition im Angebot.** Regel H Satz 1: gesagt → Position. Die zweite
Hälfte des Funds ist eine bekannte Wand: Container führt der Katalog erst unter
`Entrümpelung – Container & Entsorgung` (5 m³ = 280,00 €), unter
`Boden – Altbelag entfernen` nur `Bauschutt / Altbelag entsorgen (Sackweise)`
zu 12,00 €/Sack. Selbst wenn die Position entstünde, hielte
`preisKategoriePasstZuGewerk` sie vom Entrümpelungskatalog fern — **dieselbe
Wand wie PM-060-B.**

### PM-068 — Trockenbau: das ganze Gewerk ohne Preis

Eine Trennwand 4,00 × 2,50 m, doppelt beplankt, mit Dämmung, dazu 6,00 m²
abgehängte Decke. **Die Mengen stimmen** (10,00 m² Wand, 6,00 m² Decke, das
Ständerwerk aus `ceil(4 / 0,625) × 2,50`). Es fehlt der Preis — bei jeder
einzelnen Zeile. Im Katalog steht `Trennwand 100mm, 2-lagig je Seite (GK),
Rw ~50dB, Q2` zu 98,00 €/m²: **980,00 € gegen 0,00 €.**

Zwei Funde, die mit einer Katalogzeile nicht verschwinden:

- **`Ständerwerk CW-Profil` ist eine Doppelberechnung.** Jeder
  Trockenbau-Katalog rechnet die Unterkonstruktion im Quadratmeterpreis der
  Trennwand ab. Bekäme die Zeile einen marktüblichen Profilpreis, stünde die
  Wand zweimal im Angebot. **Die Zeile gehört weg, nicht bepreist.**
- **Zwei Titel für dieselbe abgehängte Decke** — `Abgehängte Decke (GK)` aus
  `decken[]`, `Abgehängte Decke — <Raum>` aus `raeume[].arbeiten`. Dieselbe
  Familie wie PM-058, hier auf der Engine-Seite.

**Was ich ausdrücklich nicht behaupte:** dass diese Lücken heute Geld kosten.
Solange kein Betrieb mit dem Gewerk angemeldet ist, trifft es den Maler, der
eine Trennwand ins Diktat spricht. Gemessen ist der Betrag, nicht seine
Häufigkeit — und zu prüfen ist er **vor** der Freischaltung.

### Stand der Ersatzumgebung nach diesem Lauf

Die zehn Dateien dieser Spur, die in der Ersatzumgebung laufen: **99 grüne
Prüfungen, 46 Sperrklinken** (nachgezählt am Lauf, nicht geschätzt).
`katalog-deckung.test.ts` braucht den Next.js-Endpunkt; die Dateien der anderen
Spuren waren in diesem Lauf nicht gestagt und sind in der Zahl nicht enthalten
— die 215/27 oben aus dem Live-Lauf zählen einen anderen Umfang und
widersprechen dem nicht.

---

## Offen

### Braucht die laufende App (Spur 6)

1. **PM-002 komplett** — gemischtes Angebot, Maler und Boden in einem Raum.
   **Unverändert offen seit dem 14.09., ohne laufende App nicht weiterzubringen.**
2. **PM-032 zweimal einsprechen** — der Fehler trat in einem von vier Läufen auf.
3. **PM-031, zweiter Teil** — Raummaß in der Bearbeiten-Ansicht anfassen.
4. **PM-030** — dieselbe Zahl auf Karte und im Entwurf.
5. **PM-014 / PM-015** — doppeltes „Angebot erstellen", frisches Konto.
6. **G.3** — Manfreds zwei Szenarien vom 11.09.
7. **Gegenprobe aus PD-009 §7** — wartet auf den gebauten Preise-Schritt.

### Geht ohne App, steht als Nächstes an

8. **PM-013-A** — die Dehnungsfuge entsteht weiter nirgends. Sperrklinke steht,
   Entscheidung steht (lfdm zu 18,00 €), Umsetzung bei Engineering.
9. **`Untergrund spachteln / ausgleichen (bis 5mm)`** — nach der Regel aus
   PD-013 wäre es `zeit`, dagegen steht ein ungemessener Materialanteil. Bleibt
   `anker`, bis die Zahl da ist. Ausdrücklich keine stille Entscheidung.
10. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der
    Freischaltung, nicht danach. Mit PM-068 ist klar, worauf zu achten ist:
    nicht auf die Vorlage allein, sondern auf das Paar aus Engine-Titel und
    Katalogzeile.
11. **Fallbasis Richtung 100** — Stand **68 von 100** (63 + PM-064 bis PM-068).
    Nächste Themen aus dem Speicher: mehrere Aufnahmen zu einem Angebot (E),
    Estrich (F), Fassade mit Gerüst vollständig (F), Möbel komplett ausräumen
    (B), Deckenrosette und Sichtbalken (A).

### Erledigt und damit von der Liste

Die alte Nr. 2 (`fliesen` sei ein aktives Gewerk) — durch K.3 richtiggestellt.
Die alte Nr. 10 (die drei übrigen Gewerke im Abgleich) — beantwortet und
umgesetzt, siehe oben.

### Bleibt ausdrücklich draußen

Selbstkorrektur mitten im Diktat und ausgeschriebene Zahlwörter als Raummaß
entstehen **vor** der Pipeline. Nachgestellt bleiben die Raummaße unverändert
stehen — ein Test dafür würde etwas anderes prüfen als das, was er behauptet.
Gehört in den Live-Lauf.

---

*Prüfmeister · 15.09.2026 spät abends · Ergebnisse gehören nach `pruefmeister-testfaelle.md`*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
