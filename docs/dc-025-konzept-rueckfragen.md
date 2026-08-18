# DC-025 — Konzept: Rückfragen-UI neu gedacht

**Von:** Product Designer, 2026-08-18
**Bezug:** `docs/design-check.md` DC-025 + DC-026, `docs/pruefmeister-notizen-fuer-designer.md` PD-002 + PD-005

Sandy hat die aktuelle Rückfragen-UI selbst als „hässlich und kacke" bewertet und ein
komplettes Neudenken gewünscht, nicht Nachbessern. Das hier ist meine Richtung dafür —
mit klickbarem Prototyp (`dc-025-rueckfragen-prototyp.html`, separat verschickt), damit
sich das Ganze anfühlen lässt statt nur gelesen zu werden.

## Ausgangslage

Ich habe mir den echten Code angeschaut (`src/components/aufnahme/RueckfragenScreen.tsx`,
`src/lib/mengen/rueckfragen-flow.ts`), nicht nur die Beschreibung aus den Prüfmeister-Notizen.
Zwei Dinge fallen dabei positiv auf, die ich bewusst NICHT wegwerfe: Die einzelnen
Eingabe-Bausteine (Maße mit Länge×Breite-Live-Vorschau, Höhen-Schnellauswahl mit
„häufigste Höhe"-Markierung, Anzahl-Kacheln mit „Mehr …") sind inhaltlich schon gut gebaut
und nutzerfreundlich gedacht. Das Problem liegt nicht in den einzelnen Eingabefeldern,
sondern im **Gerüst drumherum**: ein Vollbild-Screen pro einzelner Frage, dazu die von
Prüfmeister/Sandy genannten Punkte (PD-002, PD-005).

## Die Richtung

**Ein Screen pro Raum, nicht pro Frage.** Die Daten sind ohnehin schon nach `kontext`
(Raum) gruppiert (`raumSchritte` existiert im Code bereits) — das wird jetzt auch visuell
genutzt. Alle offenen Fragen zu einem Raum stehen als Karten untereinander auf einem
Screen, beantwortbar ohne Bildschirmwechsel. Bei sechs Fragen über zwei Räume sind das
jetzt zwei Screens statt sechs.

**Fortschritt über alles, nicht nur den aktuellen Raum.** Oben eine Zeile „Insgesamt: 3
von 5 offen beantwortet" plus Raum-Pillen zum direkten Springen — der Handwerker sieht
sofort, wie viel insgesamt noch kommt, nicht nur „Raum 2 von 2".

**Weicherer Bruch statt Vollbild-Schwarz.** Der dunkle Header bleibt (Wiedererkennung,
Kontrast für die Fortschrittsanzeige), aber nur als Kopfzeile über hellem Content — näher
an den anderen App-Screens, kein harter Stilbruch zum Aufmaß-Screen davor.

**Schon Gesagtes wird vorgeschlagen, nicht nochmal gefragt** (Antwort auf PD-005/DC-026).
Wenn das Transkript für ein Feld bereits einen Wert enthält, erscheint er als Vorschlag mit
Zitat-Quelle direkt auf der Karte („Du hast gesagt: ‚zwei Fenster in der Küche' → 2
Fenster") mit zwei Aktionen: „Stimmt ✓" (übernimmt sofort) oder „Korrigieren" (öffnet die
normale Eingabe). Technische Voraussetzung: Der Rückfragen-Generator müsste erkannte,
aber nicht strukturiert gesetzte Werte aus dem Transkript als Vorschlag statt als offene
Frage markieren — das ist eine Erweiterung für Head of Product Engineering, keine reine
UI-Änderung.

**Überspringen zeigt die Konsequenz, statt sie zu verstecken.** „Später ergänzen" bleibt
sichtbar (kein Kleingedrucktes mehr), aber ein Klick zeigt zuerst einen kurzen Satz, was
ohne die Angabe passiert (z. B. „Ohne Raumhöhe nehmen wir 2,60 m Standard an"), bevor der
Handwerker wirklich überspringt. Das macht die spätere rote Fehleranzeige (PM-003) nicht
überflüssig, aber der Handwerker trifft die Entscheidung informiert statt versehentlich.

**Zusammenfassung vor der Berechnung.** Nach dem letzten Raum ein kurzes Recap aller
Antworten (und was übersprungen wurde), jede Zeile per Tap editierbar — baut denselben
Vertrauens-Moment wie die Bestätigungskarte (DC-021), nur schon einen Schritt früher.

## Was ich bewusst nicht anfasse

Die einzelnen Eingabe-Komponenten (`MasseEinzelInput`, `HoeheInput`, `AnzahlInput` in
`RueckfragenScreen.tsx`) sind inhaltlich gut und werden im Prototyp im Prinzip
wiederverwendet, nur in Karten statt Vollbild-Screens verpackt — kein Grund, die
fachliche Logik dahinter (Flächen-/Umfangsberechnung, Schnell-Chips) neu zu erfinden.

## Was das technisch braucht (für Head of Product Engineering)

1. Fragen werden weiterhin pro Frage generiert (`RueckfrageItem[]`) — die Gruppierung
   nach `kontext` zu Raum-Screens ist reine Präsentationsschicht, keine Datenänderung.
2. Neu: ein Flag/Feld pro Frage, ob ein Wert aus dem Transkript bereits vorhanden ist,
   aber nicht strukturiert erkannt wurde (für die „Du hast gesagt"-Vorschläge) — das ist
   der einzige Punkt, der eine echte Erweiterung der bestehenden Erkennung braucht, nicht
   nur UI.
3. Die Konsequenz-Texte beim Überspringen sind statisch pro Fragetyp (Anzahl/Höhe/Maße),
   keine neue Logik nötig, nur feste Texte pro `typ`.

## Status

Ich halte das für ausreichend konkret, um damit zum Chief of Staff zu gehen und Head of
Product Engineering zu briefen, was technisch gebraucht wird (siehe Punkt 2 oben — das ist
der einzige Teil mit echtem Implementierungsaufwand auf der Erkennungsseite). DC-025 in
`docs/design-check.md` ist entsprechend aktualisiert.
