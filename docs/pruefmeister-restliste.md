# Nachtestplan 07.09. — abgearbeitet am 14.09.2026

**Diese Datei ersetzt den Arbeitszettel vom 07.09.** Der alte Stand („grün für
alle dreizehn, bitte einsprechen") ist erledigt: Die dreizehn Fälle sind
nachgerechnet, nicht mehr von Hand eingesprochen, sondern als Code hinterlegt.
Was von Hand bleibt, steht ganz unten.

---

## Wie geprüft wurde

Sandys Rechner ist seit dem 12.09. nicht erreichbar (Windows-Update vom
08.09.). Geprüft wurde deshalb in einer Ersatzumgebung, mit dem echten Code
und dem echten Standardkatalog, über **dieselbe Pipeline wie das Produkt**:

```
verarbeiteExtraktion → berechneMengen → Vollständigkeitsprüfung → Preis-Matcher
```

Nicht abgedeckt bleibt der KI-Schritt davor (aus Sprache wird Struktur). Die
Raumdaten sind so gesetzt, wie die Extraktion sie bei korrekter Arbeit liefern
muss. Weicht sie live davon ab, ist das ein Extraktionsfund und kein
Rechenfehler.

**Gesamtlauf: 631 Tests, 628 grün**, zwei rot aus Umgebungsgründen (zwei
Dateien, die es nur im vollständigen Projekt gibt), plus eine bewusste
Sperrklinke (siehe PM-013).

---

## Die dreizehn Fälle

**Sieben standen längst als Soll-Test hinterlegt** und laufen grün, ohne dass
sie jemand einsprechen muss: PM-021, PM-022, PM-025, PM-026, PM-012, PM-030,
PM-031 (`pruefmeister-soll.test.ts`, 111 Prüfungen).

**Sechs standen nirgends.** Die sind jetzt neu hinterlegt in
`src/lib/__tests__/pruefmeister-nachtest-0709.test.ts`:

| Fall | Stand | Soll getroffen |
|---|---|---|
| **PM-037** Leibungen und Fensterbänke | ✅ **grün, zum ersten Mal** | Leibungen 1,60 m² dreiseitig · Fensterbänke 0,60 m² · Wand 46,80 · Boden 20,00 · Sockel 18,00 lfdm · beide Kleinteilzeilen mit 45,00 €/m² |
| **PM-011** Q2 ohne Untergrund-Zuschlag | ✅ grün | Q2 über die echte Wandfläche 36,00 m² zu 9,00 € · kein „schwieriger Untergrund" · Altbau bleibt · Sockel 14,40 |
| **PM-032** Klick-Vinyl durchgehend | ✅ grün | Titel „Klick-Vinyl" zu 16,00 € (nicht 22,00) · Belag 37,38 · Dämmung 35,60 · Sockel 44,00 lfdm · eine Schiene |
| **PM-033** Fischgrät in einem von drei Räumen | ✅ grün | 31,05 / 14,40 / 7,88 · Aufpreiszeile **nur** im Wohnzimmer · Trittschall nur im Flur · keine Sockelleisten |
| **PM-013** Parkett-Fischgrät | ⚠️ **grün bis auf einen Fund** | 41,40 m² · Aufpreiszeile 41,40 × 14,00 · keine Wandposition — **aber die Dehnungsfuge fehlt** |
| **PM-002** Diagonalverlegung + Akzentwand | ⏸ **nicht hier prüfbar** | Maler-Hälfte stimmt (Akzentwand 9,10 · Restwand 29,90 · keine Decke). Der Boden-Teil hängt an der Gewerke-Aufteilung, die erst der KI-Schritt liefert — gehört in den Live-Lauf |

---

## Der Fund: PM-013-A — die Dehnungsfuge entsteht nirgends

Im Diktat steht *„da muss wahrscheinlich ne Dehnungsfuge rein, mach das bitte
mit rein"*. Nachgestellt, mit der Dehnungsfuge zusätzlich als Arbeit in der
Extraktion: **es entsteht keine Position.** Im Quelltext erzeugt sie auch
niemand — kein Treffer in `boden.ts` oder den Vollständigkeits-Dateien.

Der Katalog hat sie sogar doppelt, mit zwei Einheiten:

```
Dehnungsfuge mit Bewegungsprofil herstellen   18,00 €/lfdm
Dehnungsfuge einbauen                         45,00 €/Stück
```

**Warum das mehr ist als eine fehlende Zeile:** Ein Parkett über 40 m² ohne
Dehnungsfuge wölbt sich. Die Position fehlt im Angebot, die Arbeit macht der
Handwerker trotzdem — oder er verlässt sich auf die Liste, und dann hat er in
zwei Jahren eine Reklamation, die ihn mehr kostet als die Fuge.

**Soll:** Fällt „Dehnungsfuge", „Bewegungsfuge" oder „Randfuge" im Diktat,
entsteht eine Position. Ohne Meterangabe **keine geschätzte Menge**, sondern
sichtbarer Platzhalter — dieselbe Regel wie bei den Fugenmetern (E.1 in
`vokabular-abgleich.md`). Und eine der beiden Katalogzeilen muss weg: eine
Arbeit, eine Einheit. **Meine Entscheidung: lfdm zu 18,00 €** — eine
Dehnungsfuge wird in Metern gelegt, nicht in Stück.

Der Test dazu steht als `it.fails` in der neuen Datei. Er ist heute grün, weil
der Fund bestätigt ist — **sobald jemand die Position baut, wird er rot und
zwingt dazu, ihn zurückzustellen.** Sperrklinke statt Schweigen.

---

## Nebenbefund am Testaufbau — der Grund, warum PM-037 „nie durchlief"

`pruefmeister-soll.test.ts` ruft `berechneMengen` **direkt** mit handgebauten
Räumen und überspringt damit `verarbeiteExtraktion`. Alles, was erst dort
entsteht, kann dieser Test grundsätzlich nicht sehen: **Leibungen,
Fensterbänke, Zahlwörter, Maßreparatur, Mehrgewerk-Aufteilung.**

PM-037 war also nicht kaputt — er wurde an der Stelle geprüft, an der seine
Positionen noch gar nicht existieren. Die neue Datei läuft über die Pipeline.
**Empfehlung ans Engineering:** den Soll-Test auf denselben Einstieg umstellen,
sonst prüft er auf Dauer weniger, als er behauptet. Dieselbe Lehre wie beim
Abgleich-Skript am 12.09.

---

## Zwei Richtwerte, die im Katalog auf mich warteten

- **Fassadenleibung** (`Fensterleibungen streichen`, Maler – Anstrich Außen):
  steht zum selben Satz wie innen, mit dem Vermerk „der Prüfmeister
  entscheidet". Entscheidung: **35,00 €/m²**, nicht 45,00. Außen ist die
  Fläche gröber und der Farbverbrauch höher, aber die Feinarbeit an der Kante
  entfällt weitgehend — und das Gerüst steht ohnehin als eigene Position.
- **Dehnungsfuge**: 18,00 €/lfdm, siehe oben.

---

## Was von Hand bleibt — Live-Lauf in der App

Nicht mit Code prüfbar, gehört in Spur 6:

1. **PM-002 komplett** — gemischtes Angebot, Maler und Boden in einem Raum.
2. **PM-032 zweimal einsprechen** — der Fehler trat in einem von vier Läufen
   auf. Ein grüner Lauf beweist da nichts, auch kein grüner Test.
3. **PM-031, zweiter Teil** — Raummaß in der Bearbeiten-Ansicht anfassen und
   sehen, ob die Menge stehen bleibt. Das ist Oberfläche, nicht Rechnung.
4. **PM-030** — dieselbe Zahl auf Karte **und** im Entwurf.
5. **PM-014 / PM-015** — doppeltes „Angebot erstellen", und ein frisches Konto
   mit rund 340 Katalogpositionen.
6. **G.3** — Manfreds zwei Szenarien vom 11.09., weiterhin offen.

---

## Was danach kommt

Mit diesen dreizehn ist der Stand: **kein bekannter Rechenfehler in Maler und
Boden**, mit dem einen offenen Fund PM-013-A. Die Fallbasis steht bei 44 von
100. Die nächsten Batches stehen im Themenspeicher — Bad/Fliesen, Treppen,
Fenster und Türen lackieren, Abriss und Entsorgung, mehrere Aufnahmen pro
Angebot, Selbstkorrektur mitten im Diktat.

*Prüfmeister · 14.09.2026 · Ergebnisse gehören nach `pruefmeister-testfaelle.md`*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
