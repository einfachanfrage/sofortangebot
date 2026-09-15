# Restliste Prüfmeister — Stand 15.09.2026, abends

**Diese Datei ersetzt die Fassung von heute mittag.** Was dort offen stand, ist
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
10. **Die drei übrigen aktiven Gewerke im Abgleich** — Trockenbau,
    Sanitär/Heizung, Elektro stehen weiterhin nicht in `QUELLEN`. Ob sie
    hineingehören, hängt daran, ob ihre Engines mehr sind als Durchreichen.
    Nachzusehen, **bevor** jemand eine Zahl aus dem Abgleich zitiert.
11. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der Freischaltung,
    nicht danach.
12. **Fallbasis Richtung 100** — Stand **63 von 100** (56 + PM-057 bis PM-063).
    Nächste Themen aus dem Speicher: Treppen komplett, Abbruch und Entsorgung,
    mehrere Aufnahmen pro Angebot, Trockenbau.

### Bleibt ausdrücklich draußen

Selbstkorrektur mitten im Diktat und ausgeschriebene Zahlwörter als Raummaß
entstehen **vor** der Pipeline. Nachgestellt bleiben die Raummaße unverändert
stehen — ein Test dafür würde etwas anderes prüfen als das, was er behauptet.
Gehört in den Live-Lauf.

---

*Prüfmeister · 15.09.2026 · Ergebnisse gehören nach `pruefmeister-testfaelle.md`*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
