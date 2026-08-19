# DC-028 — Konzept: Aufmaß-Sammelansicht komplett neu gedacht

**Bezug:** Sandys direkter Auftrag (2026-08-18, Screenshot beigefügt) —
„du musst dir unbedingt diese Ansicht hier bearbeiten ich finds katastrophal
… denk das komplett neu." Betrifft die „Timeline"-Ansicht in
`entwurf/page.tsx` (Screen nach der Aufnahme, vor „Entwurf erstellen") und
darin `AufnahmeCard`. Bündelt außerdem alle bereits bekannten
Kollegen-Hinweise zu genau diesem Screen: PD-001, DC-009, DC-010, DC-021,
DC-022 — die drehen sich alle um dieselbe Stelle, nur aus verschiedenen
Blickwinkeln.

## Was Sandy konkret gezeigt hat

Ein Aufmaß mit zwei eingesprochenen Räumen. Die Sammelansicht zeigt
trotzdem nur EINE Karte, „MASSE 5,00 × 4,00 m" (das sind die Maße von genau
einem der beiden Räume), und darunter eine flache Liste „Wände streichen /
Decke streichen / Wände streichen" — sieht aus wie ein Duplikat, ist aber in
Wirklichkeit Raum 1 + Raum 2 ohne jede Kennzeichnung, welche Position zu
welchem Raum gehört. Optisch: viel Weißraum unten, nichts, was die Fläche
sinnvoll nutzt.

## Root-Cause (Code durchgegangen, nicht nur vermutet)

Zwei getrennte Probleme, die sich gegenseitig verstärken:

**1. Die Karte ist für genau EINEN Raum gebaut, Handwerker sprechen aber
mehrere ein.** `AufnahmeCard` (`entwurf/page.tsx`) hat genau eine
`einzelraum`-Erkennung (`erkenneEinzelraum`) und genau eine
`extrahiereRaumdaten()`-Maßzeile — beide geben bei mehr als einem Raum
entweder `null` oder (schlimmer) das MASS DES ZUERST GEFUNDENEN Raums
zurück, ohne das kenntlich zu machen. Die Leistungsliste darunter
(`erkannte.map(...)`) ist komplett flach, ohne jede Raum-Zuordnung in der
Anzeige — obwohl die Daten dafür schon da wären (siehe Punkt 3).

**2. Grundsätzlicher, seit PD-001/DC-021/DC-022 bekannter Befund: die Karte
und die spätere Berechnung sind zwei komplett unabhängige GPT-Aufrufe.**
`chips-extraktion.ts` (`extrahiereChips`) liefert die Vorschau auf dieser
Karte — ein bewusst leichtgewichtiger, schneller Zweit-Aufruf, der laut
eigenem Kommentar im Code „NICHT die echte Berechnung" ist. Die echte
Berechnung läuft beim Erstellen komplett neu über `angebot-extrahieren` +
`generiere-positionen`. Zwei unabhängige GPT-Antworten auf denselben Text
können strukturell nie zu 100 % übereinstimmen — das ist keine Vermutung
mehr, sondern in `pruefmeister-testfaelle.md` (PM-001) und hier mehrfach
live bestätigt.

**3. Gute Nachricht, die ich beim Code-Lesen gefunden habe: die Raum-Info
ist in den Titeln schon da, wird nur nicht genutzt.** Der Prompt in
`chips-extraktion.ts` weist GPT explizit an: „Wenn ein Raum genannt wird,
schreib ihn mit ' — Raumname' ans Ende des Titels" — exakt dieselbe
Konvention, die später bei den fertigen Angebots-Positionen für die
Raum-Gruppierung genutzt wird (`gruppiereNachRaum` in
`angebot-gruppierung.ts`, dieselbe Funktion, die die Entwurfsansicht und
das fertige Angebot nach Räumen mit Emoji gruppiert). Die aktuelle
Sammelansicht nutzt dieses Suffix aber nur für eine Ja/Nein-Frage
(„gibt's genau einen Raum?"), nicht zum Gruppieren. Das heißt: eine
raum-gruppierte Anzeige ist HEUTE SCHON möglich, ohne neue GPT-Aufrufe,
ohne Datenmodell-Änderung — nur eine andere Verwendung vorhandener Daten.

## Das neue Konzept

**Grundprinzip-Wechsel: nicht mehr nach Aufnahme gruppieren, sondern nach
Raum.** Bisher: eine Karte pro Aufnahme-Session (Mikro an/aus). Neu: alle
bisher erkannten Positionen aus ALLEN Aufnahmen zusammen einsammeln, mit
derselben `gruppiereNachRaum`-Logik wie im fertigen Angebot nach Raum
gruppieren, und das als Hauptstruktur zeigen — Raum-Karte mit Emoji, Name,
Leistungsliste. Genau dieselbe visuelle Sprache wie in der Entwurfsansicht
und im fertigen Angebot, nicht nur ähnlich, sondern DER GLEICHE Code-Pfad.
Das löst das Screenshot-Problem direkt: „Wände streichen" aus Raum 1 und
„Wände streichen" aus Raum 2 stehen jetzt in zwei sichtbar getrennten
Raum-Karten, sehen nicht mehr wie ein Duplikat aus.

**Warum das genau Sandys Vision trifft:** Sie beschreibt Handwerker, die
auf der Baustelle Raum für Raum einsprechen, mit Pausen dazwischen. Wenn
die Ansicht nach RAUM statt nach AUFNAHME strukturiert ist, sieht der
Handwerker automatisch das Richtige: „Wohnzimmer — 3 Positionen" wächst,
wenn er später eine zweite Aufnahme zum selben Raum nachschiebt, statt dass
eine neue, gleich aussehende Karte danebensteht. Die einzelnen Aufnahmen
verschwinden nicht — sie werden nur nicht mehr die primäre Gliederung
(Details unten).

**Kein erfundenes „Maße"-Feld mehr.** Statt einer Kopfzeile mit
Länge-mal-Breite (die bei mehreren Räumen strukturell nur raten kann,
siehe Root-Cause 1 — dieselbe Familie von Fehler wie DC-023 bei Fassaden),
zeigt jede Raum-Karte nur, was wirklich zu diesem Raum gehört: die
Leistungsliste. Wenn eine Fläche als eigener Wert erkannt wurde (der
Prompt kann das als „Wohnzimmer — 24,5 m²"-Position liefern), erscheint sie
als kleine Unterzeile unter dem Raumnamen — sonst einfach nicht. Lieber
nichts zeigen als raten, genau wie beim DC-023-Fix.

**Die einzelnen Aufnahmen bleiben sichtbar, aber als schlanke
Nachweis-Leiste, nicht als große Karten.** Kompakte Chips („🎙 08:23 Uhr ·
Fertig", antippbar für Transkript/Audio/Löschen) statt vollflächiger weißer
Kästen — das behebt gleichzeitig den Weißraum-Vorwurf, weil die Fläche jetzt
von den Raum-Karten (echter Inhalt) genutzt wird statt von leeren
Aufnahme-Hüllen.

**„Bereit für den Entwurf"-Banner wird zur direkten Summe der Raum-Gruppen**
statt eines separat mitgeführten Zählers — es gibt dann nur noch EINE
Quelle für „wie viele Positionen", nicht zwei, die auseinanderlaufen können.
Das nimmt DC-010 einen Teil seiner Grundlage (die zwei potenziell
widersprüchlichen Banner-Zustände).

**DC-009 gleich mit gelöst:** Wenn die gepoolte Positionen-Summe 0 ist,
kein grüner Erfolgs-Stil mehr — neutraler Hinweis „Noch nichts erkannt",
Haupt-Button wird „Nochmal aufnehmen" statt „Entwurf erstellen" aktiv
anzubieten.

## Was das NICHT löst — ehrlich zum Rest

Die Raum-Gruppierung macht die Anzeige endlich richtig STRUKTURIERT und
nutzt exakt dieselbe Logik wie das fertige Angebot. Sie garantiert aber
nicht, dass die Positions-ANZAHL innerhalb eines Raums immer exakt mit der
späteren Berechnung übereinstimmt — dafür bräuchte es Root-Cause 2 (zwei
unabhängige GPT-Aufrufe), und das ist keine Design-Frage mehr, sondern eine
Architektur-Frage für Head of Product Engineering: könnte die Vorschau
irgendwann aus derselben Quelle wie die finale Berechnung kommen (oder
zumindest denselben Extraktions-Aufruf einmal nutzen, cachen, dann bei
„Entwurf erstellen" weiterverwenden statt ein zweites Mal zu fragen)? Das
gebe ich als offene technische Frage weiter, entscheide es nicht selbst.

## Update (2026-08-19) — Sandys Rückfragen: Mikro + nachträgliches Ergänzen

Sandy hat dem Konzept zugestimmt und zwei Anforderungen präzisiert, beide
technisch geprüft:

**1. Das Mikrofon muss von dieser Ansicht aus jederzeit erreichbar
bleiben.** Ist es bereits, unabhängig vom Redesign — der Aufnahme-Button
sitzt fest in der unteren Leiste (`entwurf/page.tsx`, Zeile ~944), auch
wenn schon Aufnahmen/Räume da sind (Label wechselt dann automatisch zu
„Weitere Aufnahme"). Das Redesign ändert nichts an dieser Leiste, nur an
dem, was darüber in der Timeline steht.

**2. Frage: Landet eine Nachtrags-Aufnahme zu einem schon vorhandenen Raum
automatisch in dessen Karte?** Ja — und zwar, weil das Konzept genau so
gebaut ist, nicht zufällig. Die Raum-Gruppierung läuft nicht einmal pro
Aufnahme, sondern jedes Mal NEU über den kompletten gepoolten Positions-
Bestand aller bisherigen Aufnahmen. Sagt eine vierte Aufnahme „ah, auch
noch die Fenster im Wohnzimmer lackieren", landet die neue Position mit
demselben „ — Wohnzimmer"-Suffix im Titel im Pool, und beim nächsten
Neu-Gruppieren fällt sie automatisch in dieselbe Wohnzimmer-Karte wie die
Positionen aus Aufnahme 1 — nicht in eine zweite, neue Wohnzimmer-Karte.
Genau das von Sandy beschriebene Beispiel (Aufnahme 1: Wohnzimmer +
Schlafzimmer, Aufnahme 2: Flur, Aufnahme 3: Wohnzimmer ergänzt, Aufnahme 4:
Kinderzimmer + Wohnzimmer ergänzt) funktioniert damit von selbst, ohne
Sonderfall-Code für „ergänzen" — Ergänzen ist einfach der Normalfall von
Neu-Gruppieren.

**3. Was nach „Entwurf erstellen" passiert, wenn man zurückkommt und
weiter aufnimmt.** Auch hier gibt es schon eine Grundlage: Über den
„Aufnahme"-Link im fertigen Angebot (`AngebotDetail.tsx`) kommt man zurück
auf genau diesen Screen. Aktuell zeigt er dann „X Positionen bereits
berechnet — neue Aufnahmen werden als weitere Positionen ergänzt" als
separaten Hinweis-Banner, aber NICHT raum-gruppiert wie der Rest —
genau die Inkonsistenz, die Sandy zu Recht nicht will („es muss alles
logisch und einheitlich sein").

Sauberer Ansatz, den ich für die Umsetzung vorschlage: sobald es bereits
berechnete Positionen gibt (`quote_items`), werden die genauso über
`gruppiereNachRaum` in Raum-Karten dargestellt wie die Vorschau-Positionen
— gleiche Karten, gleicher Ort. Eine frische Nachtrags-Aufnahme zu
„Wohnzimmer" erscheint dann sofort als zusätzliche Zeile in der
BESTEHENDEN Wohnzimmer-Karte, aber mit einer kleinen visuellen Markierung
(„wird berechnet …", gedämpfter statt satter Text), bis der Handwerker
erneut auf den Button tippt und sie fest berechnet werden. Nach dem Tippen
verschwindet die Markierung, die Zeile sieht aus wie die anderen. So sieht
der Handwerker in einer einzigen, immer gleich aussehenden Ansicht: was
schon feststeht UND was gerade frisch dazugekommen ist, pro Raum, nie
getrennt nach „alter" und „neuer" Aufnahme-Session — genau das Prinzip aus
DC-028, nur konsequent auch auf den Rückkehr-Fall angewendet.

Ich halte mich bewusst noch an derselben Stelle wie vorher: Konzept steht,
Umsetzung erst nach Sandys Go. Der Prototyp (`dc-028-sammlung-prototyp.html`)
wurde um einen dritten Zustand „Nachtrag" ergänzt, der genau das oben
Beschriebene zeigt.

## Nächster Schritt

Mockup folgt als klickbarer HTML-Prototyp (`dc-028-sammlung-prototyp.html`)
— Vorher (Sandys Screenshot nachgebaut), Nachher (raum-gruppiert, Aufnahmen
als Chip-Leiste) und Nachtrag (nachträgliche Aufnahme ergänzt eine
bestehende Raum-Karte, inkl. Rückkehr nach „Entwurf erstellen"). Sobald
Sandy eine Richtung bestätigt, baue ich es in `entwurf/page.tsx` — die
Grundbausteine (`gruppiereNachRaum`, Raum-Emoji, Leistungslisten-Zeile)
existieren bereits und müssen nur wiederverwendet statt neu erfunden
werden.

— Product Designer, 2026-08-19
