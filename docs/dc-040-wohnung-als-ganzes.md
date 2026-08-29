# DC-040 — "Wohnung als Ganzes" statt zwingend nach Räumen

**Datum:** 2026-08-29 (Sandy, weitergegeben von Clemens, selbst Maler,
künftiger Testnutzer)

**Auftrag (zusammengefasst):** Handwerker sprechen sehr häufig NICHT
raumweise, sondern betrachten die Wohnung als Ganzes — z. B. "in der
ganzen Wohnung müssen 120 m² Wandfläche gestrichen werden und 55 m²
Laminat verlegt werden". Die App muss das als eigenständigen Fall
behandeln können, nicht nur Raum für Raum. Rückfragen zu Tür-/Fenster-
Abzug dürfen trotzdem kommen (Anzahl erfragen), aber bezogen auf die
Wohnung als Ganzes, nicht pro Raum.

## Root-Cause (Code + Prompt geprüft)

Das ist kein UI-Problem, sondern ein Extraktions-Problem — die Anfrage
kommt nie in einer Form an, mit der der Rest des Systems arbeiten könnte.

In `src/lib/mengen/prompt-extraktion.ts` (Anweisung an die KI beim
Einsprechen) steht unter "VAGE-ERKENNUNG":

> Vage Raumreferenzen → vage_typ: "raum_ohne_masse": … "alles", "komplett",
> **"die ganze Wohnung"**

Das gilt aktuell UNBEDINGT — auch wenn direkt danach eine echte Maßangabe
kommt ("die ganze Wohnung, 120 m² Wandfläche"). Die KI stuft genau Sandys/
Clemens' Beispielsatz also vermutlich als vage/unklar ein, obwohl die Zahl
eindeutig da ist — und eine vage Angabe landet nicht als normale Position,
sondern als Rückfrage-würdiger Sonderfall oder wird schlimmstenfalls
übergangen.

**Der entscheidende Punkt: es gibt bereits ein eingebautes Vorbild dafür,
wie man das richtig macht** — Fassade. Etwas weiter oben im selben Prompt:

> FASSADE IN RAEUME: Fassade / Außenwand immer als raeume-Eintrag mit
> flaeche (wenn m² genannt) … Beispiel: "Fassade streichen, 120 m²" →
> raeume: [{name: "Fassade", flaeche: 120, …}]

Eine Fassade ist im System also längst kein "Raum" im engeren Sinn,
sondern ein NAMED PSEUDO-RAUM mit direkter Flächenangabe statt
Länge×Breite — genau das Muster, das "Wohnung" auch braucht.

## Was zusätzlich zu klären ist (kein reines Copy-Paste von Fassade)

Eine Fassade hat nur Wandfläche (keinen Boden). "Wohnung" braucht
BEIDES gleichzeitig (120 m² Wand UND 55 m² Boden in einem Satz) — dafür
reicht das einzelne `flaeche`-Feld im Extraktions-Schema nicht. Fündig
geworden bin ich in `src/lib/mengen/extraktion-pipeline.ts`: dort gibt es
bereits separate Felder `wandflaeche_direkt`, `deckflaeche_direkt` UND
sogar `wandflaeche_abzug_m2` (regelbasierte Nacherkennung direkt aus dem
Transkript-Text, unabhängig vom KI-JSON) — das sieht nach der richtigen
Erweiterungsstelle aus, um einen `bodenflaeche_direkt`-Gegenpart zu
ergänzen, statt etwas komplett Neues zu bauen.

Zum Tür-/Fenster-Abzug: `berechneRaumMasse()` (`raum-geometrie.ts`) zieht
bei `modus: 'flaeche'` (direkte m²-Eingabe) den Tür-/Fensterabzug aktuell
GAR NICHT ab — der Kommentar im Code sagt explizit, eine direkt
eingegebene Fläche gelte schon als fertige Netto-Fläche. Für "Wohnung"
mit Rückfrage zu Tür-/Fensteranzahl (dein Wunsch) müsste das für diesen
Fall anders funktionieren: die 120 m² sind vermutlich BRUTTO gemeint
(Handwerker denkt in Gesamtwandfläche, Türen/Fenster zieht man erst ab).
Das ist eine bewusste Entscheidung, keine Kleinigkeit — sie betrifft auch
bestehende Räume, die heute schon `modus: 'flaeche'` nutzen (z. B. für
Nischen/L-Räume aus DC-036). Am saubersten vermutlich: ein neues, eigenes
Flag statt das bestehende Verhalten für alle `flaeche`-Fälle zu ändern.

**Rückfragen-Mechanik selbst ist bereits generisch genug:** die
Tür-/Fenster-Stückzahlfragen (`rueckfragen-flow.ts`) sind pro Raum-NAME
aufgebaut (`tueren_anzahl_<raumname>`), nicht pro Raum-TYP — "Wohnung"
als Raumname würde hier vermutlich ohne Sonderfall einfach mitlaufen,
sobald es als `raeume[]`-Eintrag existiert.

## Vorschlag (Spec für Head of Product Engineering)

1. `prompt-extraktion.ts`: "die ganze Wohnung" / "gesamte Wohnung" /
   "komplette Wohnung" (+ ähnliche Varianten) aus der
   VAGE-ERKENNUNG-Liste herausnehmen UND als eigenen Abschnitt nach dem
   Vorbild "FASSADE IN RAEUME" ergänzen — inkl. Beispiel mit BEIDEN
   Flächen in einem Satz ("120 m² Wandfläche, 55 m² Laminat" →
   `raeume: [{name: "Wohnung", wandflaeche: 120, bodenflaeche: 55, …}]`
   oder wie auch immer das Schema sauber erweitert wird).
2. `extraktion-pipeline.ts`: `bodenflaeche_direkt` als Gegenstück zu
   `wandflaeche_direkt`/`deckflaeche_direkt` ergänzen, nach demselben
   Muster.
3. `raum-geometrie.ts`: klären, ob/wie der Tür-/Fensterabzug bei einer
   "Wohnung"-Angabe (Brutto-Fläche + Rückfrage-Anzahl) funktionieren soll,
   ohne das bestehende Verhalten für andere `flaeche`-Räume (Netto-Eingabe,
   z. B. bei Nischen) zu verändern — eigenes Flag statt globaler Änderung.
4. Rückfragen zu Tür-/Fensteranzahl für den Fall "Wohnung" sollten über
   denselben, schon vorhandenen `tueren_anzahl_<raumname>`-Mechanismus
   laufen — vermutlich ohne Sonderbau, aber bitte beim Testen genau
   gegenprüfen.

## Mein Teil (Product Designer)

Auf der Anzeige-Seite (Entwurf-Ansicht, `gruppiereNachRaum`,
`RaumDimensionenZeile`) rechne ich damit, dass eine "Wohnung"-Position
größtenteils automatisch als eigene Raumgruppe erscheint, sobald
Engineering die Extraktion liefert — dasselbe generische Muster trägt ja
schon "Fassade" heute. Kleine Politur, die ich mit übernehme, sobald es
so weit ist: in `angebot-gruppierung.ts`s `RAUM_EMOJIS` fehlt "wohnung"
komplett (fällt aktuell auf das generische 🏠 zurück, das sich "Fassade"
schon teilt) — bekommt ein eigenes Symbol (Vorschlag: 🏡), damit man die
Wohnung-als-Ganzes-Position auf einen Blick von einer Fassade
unterscheidet. Baue und teste ich, sobald der Extraktions-/Rechenweg
steht — kein erneuter Auftrag nötig.

**Status:** 🔵 Root-Cause + Spec fertig, Umsetzung braucht Engineering
(Extraktion + Berechnung), Product-Designer-Teil (Anzeige-Politur) folgt
danach.
