# Prüfmeister → Product Designer: Notizen

Das hier ist kein Bug-Tracker (der steht in `docs/pruefmeister-testfaelle.md`, für Head of IT).
Das hier sind Beobachtungen aus dem Testen, bei denen ich finde: das ist keine Rechenfrage,
sondern eine Frage, wie der Handwerker geführt und wie ihm Vertrauen gegeben wird — also deine Baustelle.
Ich (Prüfmeister) bewerte nur aus Nutzersicht, was mir beim Testen aufgefallen ist. Wie's aussieht,
heißt und sich anfühlt, ist deine Entscheidung.

Format: fest nummeriert (PD-XXX), damit man sich in Rückfragen klar darauf beziehen kann.

---

## Rückmeldung vom Chief of Staff (2026-08-16)

Hab beide Punkte gelesen. Eine Verbindung, die mir aufgefallen ist und die
für die Priorität von PD-001 relevant ist: Genau heute, im Nachtest zu PM-001
(`docs/pruefmeister-testfaelle.md`), ist mit identischem Input reproduzierbar
passiert, wovor PD-001 warnt — Bestätigungskarte zeigt korrekt keine Decke,
im fertigen Angebot steht sie trotzdem. Das war kein hypothetisches Beispiel
mehr, sondern ist heute live aufgetreten. Macht PD-001 aus meiner Sicht
dringlicher, als es allein dastehend wirken würde — auch wenn die technische
Seite davon (warum Karte und Rechnung auseinanderlaufen) bei Head of IT
liegt, nicht bei dir. PD-002 (Rückfragen-UI) ist Sandys eigener Wunsch nach
einem kompletten Neudenken — größeres Vorhaben, kein Einzelfix. Sag mir
Bescheid, sobald du eine Richtung dafür hast, dann sorge ich dafür, dass Head
of IT rechtzeitig weiß, was technisch gebraucht wird.

---

## PD-001 — Die Bestätigungskarte zeigt nicht zuverlässig, was am Ende berechnet wird

**Kontext:** Bevor ein Angebot erstellt wird, zeigt das Tool eine Karte mit „Raum erkannt", den Maßen
und einer Liste „Leistungen" — das ist der Moment, in dem der Handwerker in ein paar Sekunden
prüfen soll: hat das Tool verstanden, was ich gesagt habe?

**Was ich beim Testen gesehen habe (Details siehe `pruefmeister-testfaelle.md`, PM-001 und PM-004):**
- Ein Handwerker sagt ausdrücklich „Die Decke lassen wir, NICHT mitrechnen." Die Bestätigungskarte
  zeigt daraufhin korrekt nur „Wände streichen" und „Sockelleisten abkleben" — kein „Decke streichen".
  Der Handwerker sieht das, denkt „passt", tippt auf Erstellen. Im fertigen Angebot steht dann trotzdem
  eine Deckenposition für über 200 €.
- In einem anderen Test stand auf der Karte plötzlich der Raumname selbst („Kinderzimmer") als
  eigener Punkt in der Leistungen-Liste, so als wäre „Kinderzimmer" eine Arbeit, die ausgeführt wird.
- Die Anzahl der Fenster auf der Karte hat einmal nicht mit der Anzahl übereingestimmt, mit der
  später tatsächlich gerechnet wurde.

**Warum mir das wichtiger vorkommt als ein einzelner Anzeigefehler:** Diese Karte ist genau der Moment,
auf den sich der Handwerker verlassen soll, um NICHT jede einzelne Position im fertigen Angebot
nachzurechnen. Wenn sie ihm bestätigt „ich hab verstanden, keine Decke", er aber trotzdem eine
Deckenposition bezahlt bekommt, ist das schlimmer als gar keine Bestätigungskarte — sie erzeugt
falsches Vertrauen, statt es zu verdienen. Ein Handwerker, der das einmal erwischt (und es fällt nur
auf, wenn er zufällig nochmal jede Zeile im fertigen Angebot durchgeht), wird der Karte nie wieder
trauen — und dann wieder von null jede Position prüfen. Genau das, was das Tool eigentlich verhindern soll.

**Woran das technisch liegt, ist nicht meine Baustelle** — das geht an Head of IT (die Karte und die
eigentliche Berechnung scheinen zwei getrennte Datenquellen zu sein, die auseinanderlaufen können).
Was ich dir zur Überlegung gebe, ist die Design-Frage dahinter: Ist eine reine „Leistungen erkannt"-Liste
überhaupt das richtige Format für diesen Vertrauens-Moment? Ein paar Gedanken, die mir beim Testen kamen
(keine Vorgabe, nur Denkanstöße aus Nutzersicht):
- Sollten ausdrückliche Ausschlüsse aktiv sichtbar bestätigt werden — also nicht nur „Decke fehlt in der
  Liste" (was man leicht überliest), sondern etwas wie „Decke — ausdrücklich ausgeschlossen ✓", das genauso
  auffällt wie eine normale Leistung?
- Sollte die Karte überhaupt ein Versprechen sein, dass „was hier steht, ist exakt das, was berechnet wird"
  — und wenn ja, wie stellt man das für den Nutzer erkennbar sicher (z.B. optisch anders, wenn sich später
  noch was ändert)?
- Gehört sowas wie „Kinderzimmer als eigene Leistung" in eine Kategorie „technischer Fehler, den man nie
  sieht" oder sollte die UI so gebaut sein, dass sowas dem Nutzer sofort komisch vorkommt (z. B. weil
  Leistungen visuell klar von Raumnamen getrennt sind)?

Vielleicht ist die Antwort: die ganze Bestätigungskarte nochmal grundsätzlich anschauen, nicht nur diesen
einen Fall flicken. Das überlass ich dir — ich wollte nur mitgeben, was mir aus Handwerker-Sicht daran
komisch vorkommt.

**Update aus weiterem Testen:** Der Karte-zeigt-nicht-was-berechnet-wird-Effekt ist mir seitdem noch
zweimal begegnet — einmal wieder als doppelter „Decke streichen"-Eintrag bei einem Zwei-Raum-Auftrag
(Küche/Speisekammer), obwohl die spätere Rechnung diesmal korrekt war. Das bestätigt: das ist kein
Einzelfall, sondern ein wiederkehrendes Muster.

**Update (2026-08-18):** Sandy hat das jetzt selbst noch einmal ausdrücklich bekräftigt (bei PM-008,
Fassade, fünfter Nachtest) — Zitat: „Das gefällt mir gar nicht" / „Es ist einfach eine Katastrophe", weil
auf der Karte andere Dinge stehen als später im Entwurf. Details bei PD-007 weiter unten.

**Antwort/Update (2026-08-19):** Danke für die drei konkreten Testfälle hier — vor allem der letzte
(„Kinderzimmer" als eigene Leistung) hat mir beim Code-Lesen geholfen, den Bug in der
Aufmaß-Sammelansicht überhaupt zu finden. Sandy hat mir direkt am zugehörigen Screen (der
„Timeline"-Ansicht nach der Aufnahme) genau denselben Effekt gezeigt: zwei eingesprochene Räume,
die Karte zeigte trotzdem nur die Maße von einem, und die Leistungsliste sah aus wie ein Duplikat
statt zwei getrennter Räume.

Deine Design-Frage — „ist eine reine Leistungen-erkannt-Liste überhaupt das richtige Format für
diesen Vertrauens-Moment?" — habe ich mit Ja beantwortet, aber im Sinne von: nicht flicken, sondern
die Karte grundsätzlich neu aufbauen, genau wie du am Ende vorgeschlagen hast. Ergebnis ist DC-028
(`docs/design-check.md`) — Grundprinzip-Wechsel von „eine Karte pro Aufnahme" zu „eine Karte pro
Raum", mit derselben Gruppierungs-Logik (`gruppiereNachRaum`), die auch das fertige Angebot nutzt.
Damit wird ein „Kinderzimmer als Leistung"-Fehler sofort sichtbar seltsam, weil Raumname und
Leistungsliste jetzt strukturell getrennt sind, nicht mehr in einer Liste vermischt.

Die technische Wurzel — zwei unabhängige GPT-Aufrufe für Vorschau und echte Berechnung — bleibt wie
von dir schon vermutet nicht meine Baustelle; die gebe ich als offene Architektur-Frage an Head of
Product Engineering weiter. Konzept + klickbarer Prototyp sind an Sandy raus, Umsetzung erst nach
ihrem Go.

---

## PD-002 — Sandys eigenes Urteil zur Rückfragen-UI: komplett neu denken

**Das kommt direkt von Sandy, unverändert weitergegeben:** Sie findet die gesamte Rückfragen-UI/UX
„sehr hässlich und kacke" und will, dass sie komplett neu gedacht wird — nicht nachgebessert.

**Was ich dazu aus dem Testen beisteuern kann, konkret statt abstrakt:** Der Rückfragen-Flow, den ich
beim Testen laufend vor mir hatte, sieht so aus: ein schwarzer Vollbild-Screen, eine einzelne Frage
(„Wie viele Türen hat 'Küche'?"), acht gleich große weiße Kacheln mit Zahlen 0–6 plus „Mehr …", ein
gelber „Weiter"-Button, ein kleiner Link „Diese Angabe überspringen". Bei einem Zwei-Raum-Auftrag
läuft das Raum für Raum durch — Höhe, Türen, Fenster, je einzeln, je ein eigener Screen, mit „Raum 2 von 2"
oben als Fortschrittsanzeige. Bei sechs offenen Fragen sind das sechs Vollbild-Screens hintereinander,
für einen einzigen kleinen Auftrag.

Ein paar Sachen, die mir dabei aus Nutzersicht auffielen (keine Vorgabe, nur was mir beim Durchklicken
komisch vorkam):
- Jede Frage ist ein eigener Vollbild-Screen mit viel leerer Fläche darunter — bei acht Antwortkacheln
  in zwei Reihen bleibt der ganze untere Bildschirm leer.
- Der optische Bruch zwischen dem hellen „Aufmaß"-Screen davor und dem komplett schwarzen
  Rückfragen-Screen ist hart — fühlt sich an wie ein anderes Produkt.
- Es gibt keine Möglichkeit, mehrere offene Fragen auf einen Blick zu sehen — der Handwerker weiß nie,
  wie viele Fragen noch kommen (nur „Raum 2 von 2", nicht „noch 4 von 6 Fragen").
- „Diese Angabe überspringen" ist klein und unauffällig, obwohl das Überspringen (z.B. bei Fenstern)
  am Ende zu einer roten „!"-Fehleranzeige im fertigen Angebot führt (siehe PM-003 in der Testfälle-Datei)
  — der Nutzer merkt beim Überspringen nicht, dass das später ein Problem wird.

Das ist Sandys Baustelle, nicht meine — ich wollte nur die konkreten Screens mitgeben, die ich beim
Testen gesehen habe, damit du nicht bei null anfängst.

**Update (2026-08-19) — positive Live-Rückmeldung zur neuen Rückfragen-Seite:** Bei einem PM-010-Nachtest
zeigte die Rückfragen-Runde jetzt „Insgesamt 0 von 2 beantwortet" mit beiden offenen Fragen für den Raum
(„Wie viele Türen…", „Wie viele Fenster…") direkt untereinander auf einer Seite, statt als getrennte
Vollbild-Screens. Sandys eigener Kommentar dazu, unverändert: „neu ein raum auf einer seite sieht super
aus". Genau die Art Verbesserung, die oben unter „keine Möglichkeit, mehrere offene Fragen auf einen Blick
zu sehen" angemerkt war — offenbar ist DC-025 schon (teilweise) live und kommt gut an. Falls das dein
aktueller Zwischenstand ist: weiter so, das war ein echter Pluspunkt bei Sandy.

---

## PD-003 — Raummaße-Chip zeigt lauter rote Fehler, obwohl die Rechnung dahinter stimmt

**Konkretes Beispiel (Details siehe PM-008 in der Testfälle-Datei):** Bei einer Fassade (kein
Innenraum — nur eine Wand ohne Boden, Decke oder „echte" Tür) zeigt der Raummaße-Chip im fertigen
Angebot bei Länge, Breite, Höhe, Türen UND Fenster überall ein rotes „!" statt Werten — sieht aus wie
fünf gleichzeitige Fehler. Die Fläche darunter (66,96 m²) ist aber korrekt berechnet.

**Woran das liegt, aus meiner Laien-Vermutung:** Der Raummaße-Chip ist offenbar für „normale" Räume
gebaut (Länge × Breite, Höhe, Türen, Fenster) und hat kein eigenes Format für Objekte, die kein Raum
sind — eine Fassade hat z. B. gar keine „Breite" im Raumsinn und keine „Türen" im üblichen Sinn. Das
Ergebnis: ein Screen, der aussieht wie „hier ist alles kaputt", obwohl in Wahrheit nur ein
Anzeige-Format fehlt, das zu diesem Objekttyp passt.

**Frage an dich:** Lohnt sich ein eigenes, reduziertes Chip-Format für Nicht-Raum-Objekte (Fassaden,
später vielleicht auch andere Sonderfälle), das nur die Felder zeigt, die dort wirklich Sinn ergeben —
statt der vollen Raum-Vorlage mit lauter roten Fehlern für Felder, die gar nicht gebraucht werden?

**Update (2026-08-18) — jetzt mit der wahrscheinlichen Ursache, direkt von Sandy:** Beim fünften
PM-008-Nachtest hat Sandy selbst erklärt, woher das kommt: Sie hat beim Bauen des Tools die
Entwurfsansicht so angelegt, dass jeder Raum eine feste Zeile mit fixen Raummaßen hat (Länge, Breite,
Höhe, Türen, Fenster), auf deren Basis alle Positionen für diesen Raum berechnet werden. Eine Fassade ist
aber kein Raum — es gibt keine Raumtiefe, relevant sind nur Wandlänge und Wandhöhe. Ihre Worte: „das muss
irgendwie umgedacht werden, weil das wird auf jeden Fall auch vorkommen." Im selben Nachtest zeigte die
Entwurfsansicht zusätzlich „Fenster: 0" (rotes „!"), obwohl die Aufnahmekarte davor korrekt „Fenster: 3"
angezeigt hatte — nicht nur Kosmetik, sondern derselbe fehlende Datenrahmen für Nicht-Raum-Objekte wie
oben beschrieben. **Sandy verlangt ausdrücklich, dass daraus eine eigene Aufgabe für dich wird, kein bloßer
Denkanstoß mehr** — parallel dazu geht dieselbe strukturelle Frage ans Engineering für das zugrundeliegende
Datenmodell (Details in `pruefmeister-testfaelle.md`, PM-008 Nachtest 5).

**Update (2026-08-18) — Chip ist live, dieser Punkt ist damit erledigt:** Sechster PM-008-Nachtest zeigt
den neuen Wand-Chip in Aktion — „WAND / FASSADE" mit „Wandlänge 12 m", „Wandhöhe 6 m", „Türen 0",
„Fenster 3", alle vier Werte korrekt gefüllt, keine roten „!" mehr. Danke, funktioniert genau wie im
Konzept beschrieben. Ein neuer, verwandter Fund liegt aber jetzt in der „So gerechnet"-Zeile selbst (die
rechnet den Fensterabzug falsch) — das ist kein Design-Thema mehr, sondern ein Rechenfehler bei Head of
Product Engineering, siehe `pruefmeister-testfaelle.md` PM-008 Nachtest 6. Ich schließe PD-003 hiermit als
Design-Punkt ab.

---

## PD-004 — „X Positionen erkannt" stimmt wiederholt nicht mit der tatsächlichen Anzahl überein

Das ist eine Verschärfung von PD-001, mit inzwischen mehreren klaren Belegen: die grüne Leiste
„5 Positionen erkannt", die kurz vor „Entwurf erstellen" auftaucht, hat in zwei unabhängigen Tests
(PM-009: Übergangsschiene, PM-010: Sockelleisten streichen) tatsächlich nur 4 Positionen geliefert —
eine erkannte Leistung ist beide Male im fertigen Angebot spurlos verschwunden.

**Warum mir das schlimmer vorkommt als der ursprüngliche PD-001-Fund:** Vorher ging es um Inhalte
(fehlt eine Leistung in der Liste, obwohl sie berechnet wird, oder umgekehrt). Hier ist es eine reine
Zahl — „5" — die der Nutzer in der Sekunde vor dem Erstellen liest und der er glaubt, weil sie so
prominent und konkret dasteht. Wenn die schon falsch ist, ist das kein Interpretationsspielraum mehr,
sondern ein klarer, zählbarer Vertrauensbruch.

**Denkanstoß:** Vielleicht sollte diese Zahl technisch direkt aus der späteren Berechnung gezogen
werden (also erst NACH dem eigentlichen Rechenschritt angezeigt werden), statt aus einem früheren,
separaten Erkennungsschritt — dann können die beiden Zahlen gar nicht mehr auseinanderlaufen. Das wäre
dann allerdings eher eine Frage für Head of IT (wo genau im Ablauf diese Zahl herkommt) als für dich —
ich geb's trotzdem mit, weil's die UX direkt betrifft.

**Update aus weiterem Testen:** Bei PM-008 (Fassade) tauchte einmal ein Positionsname „Gondierung"
auf der Bestätigungskarte auf — offensichtlich ein verstümmeltes „Grundierung". Kein Rechenfehler,
aber genau die Art Detail, die einem Handwerker sofort auffällt und Vertrauen kostet, ohne dass
irgendwas fachlich falsch wäre. Passt eher in die PD-001/PD-004-Familie (Karte wirkt unfertig/buggy)
als dass es ein eigener Punkt wäre.

**Korrektur (Prüfmeister, 2026-08-18):** Hier stand ein „Update — sechster PM-008-Nachtest, diesmal
eindeutig belegt" zu angeblich „Fenster streichen" + „Feuergrundierung" auf der Karte. Komplett falsch —
Sandy hat direkt widersprochen, das steht so nicht auf dem Screenshot. Ich habe die Leistungen-Liste
falsch gelesen, offenbar wieder mit dem älteren, bereits einmal zurückgenommenen Fund vom 17.08.
verwechselt statt den aktuellen Screenshot neu zu lesen. Zweite Runde desselben Lesefehlers zu diesem
Thema — komplett zurückgenommen.

**Nachtrag, per Copy-Paste bestätigt:** Die Karte zeigt tatsächlich zwei Leistungen — „Fassade
streichen" und „Vorhergrundierung" (vermutlich „Vorher-Grundierung" ohne Trennzeichen). Keine
Phantom-Leistung, „2 Positionen erkannt" passt zahlenmäßig zu den zwei Leistungen. „Vorhergrundierung"
selbst ist aber eine echte, jetzt bestätigte Namensverstümmlung — dieselbe Familie wie „Gondierung" oben,
diesmal per Copy-Paste verifiziert statt aus einem Screenshot gelesen. Details in
`pruefmeister-testfaelle.md`, PM-008 Nachtest 6.

**Update (2026-08-19), neue Facette — die Zahl kann stimmen, obwohl der Inhalt trotzdem falsch ist:**
Bei PM-010 zeigte die Karte „5 Positionen erkannt" (Wände streichen, Decke streichen, Sockelleisten
entfernen, Neue Sockelleisten montieren, Sockelleisten streichen). Der fertige Entwurf hatte ebenfalls
fünf Positionen — aber „Sockelleisten entfernen" fehlte komplett, dafür stand „Boden schützen" da, das
auf der Karte gar nicht angekündigt war. Zahlenmäßig 5 = 5, keine Alarmglocke, aber inhaltlich ist eine
ausdrücklich verlangte Leistung durch eine andere ersetzt worden. Bestätigt genau den Denkanstoß von
oben: die reine Zahl ist kein verlässliches Signal, selbst wenn Positions-Erkennung und Entwurf zufällig
gleich groß sind. Details in `pruefmeister-testfaelle.md`, PM-010.

**Update (2026-08-19) — bisher stärkste Ausprägung dieses Musters:** Bei PM-011 zeigte die Karte „2
Positionen erkannt" („Wände spachteln", „Wände streichen"), der fertige Entwurf hatte sieben Positionen.
Fünf davon sind plausible, automatisch abgeleitete Nebenleistungen (Boden schützen, Sockelleisten
abkleben, Grundierung, Erschwerniszuschlag, plus eine separat dokumentierte Kleinreparatur-Position, die
eigentlich gar nicht hätte kommen sollen) — das allein ist wie in den meisten Fällen kein Fehler. Aber die
Diskrepanz selbst (2 angekündigt, 7 geliefert) ist deutlich größer als alles bisher hier Dokumentierte
(meist „5 vs. 4", ein Positions-Unterschied). Ein Handwerker, der auf „2 Positionen" vertraut und danach
einen Entwurf mit mehr als dreimal so vielen Zeilen sieht, erlebt einen größeren Vertrauens-Sprung als in
den bisherigen Fällen. Verstärkt meinen Denkanstoß von oben noch einmal: vielleicht sollte diese Zahl
grundsätzlich nicht mehr aus dem frühen Erkennungsschritt kommen, sondern nur noch aus dem, was am Ende
tatsächlich berechnet wird — oder die Karte zeigt von vornherein auch die absehbaren Nebenleistungen mit
an (ggf. mit „Vorschlag"-Kennzeichnung, siehe PD-008), statt nur die wörtlich genannten Leistungen zu
zählen. Details in `pruefmeister-testfaelle.md`, PM-011.

---

## PD-005 — Rückfragen werden gestellt, obwohl die Antwort schon im Gesagten steht

**Sandys eigene Beobachtung beim Testen (PM-007, Dachgeschoss-Fall):** Sie hatte im Transkript bereits
klar die Fensteranzahl und die Bodenfläche genannt. Das Tool fragt trotzdem in der Rückfragen-Runde
danach — als hätte es nie hingehört. Sandys Worten nach: „fragt nach Fenster und Bodenfläche obwohl
genannt".

**Warum das mehr ist als ein Komfort-Ärgernis:** Die Rückfragen-UI (siehe PD-002) kostet den Handwerker
ohnehin schon mehrere Vollbild-Screens. Wenn ein Teil davon Fragen sind, die er gerade erst beantwortet
hat, fühlt sich das nicht nach „gründlich" an, sondern nach „hat nicht zugehört" — genau das Gegenteil
von dem Vertrauen, das dieser Schritt eigentlich aufbauen soll. Und es kostet echte Zeit bei jedem
einzelnen Auftrag, nicht nur im Fehlerfall.

**Woran es technisch liegt, ist nicht meine Baustelle** — vermutlich prüft der Rückfragen-Schritt nur,
ob ein Feld strukturiert gesetzt ist, nicht ob der Wert schon im freien Text vorkam (ähnliches Muster
wie der inzwischen behobene PM-003-Bug bei der Fenster-Verneinung, nur umgekehrt: dort wurde ein „nein"
übersehen, hier wird ein „ja, X Stück" übersehen). Die Design-Frage an dich: Sollte die Rückfragen-Runde
grundsätzlich nur Lücken füllen, die wirklich Lücken sind — und wenn das technisch nicht zuverlässig
zu erkennen ist, sollte die UI dem Nutzer wenigstens zeigen, was sie schon verstanden hat, damit er
merkt „ah, das wurde schon aufgenommen, die Frage ist überflüssig" statt sich zu fragen, ob er beim
ersten Mal unklar war?

---

## PD-006 — Zwei sich widersprechende Statusmeldungen gleichzeitig auf einem Screen

**Was Sandy beim Testen gesehen hat (PM-008, Fassade):** Direkt nach der Aufnahme stand auf demselben
Screen gleichzeitig ein roter Banner „❗ Keine Positionen erkannt" UND, direkt darunter, der grüne Banner
„✓ 2 Positionen erkannt — bereit für den Entwurf". Beide gleichzeitig sichtbar. Sie musste es zweimal
versuchen, bis sie zur Entwurfsansicht kam. Ihre eigene Reaktion: „es wurden ja positionen erkannt,
wieso sagt er keine pos erkannt?"

**Warum das unabhängig von der technischen Ursache ein Design-Thema ist:** Egal was im Hintergrund
passiert (die technische Seite geht an Head of IT, siehe Testfälle-Datei) — zwei widersprüchliche
Status-Aussagen gleichzeitig auf einem Screen darf die Oberfläche eigentlich nie zulassen, selbst wenn
der Zustand dahinter nur kurz „flackert". Für den Nutzer sieht das aus wie ein kaputtes Tool, in einem
Moment, der genau das Gegenteil vermitteln soll (Vertrauen kurz vor dem Erstellen). Sandy hat
ausdrücklich gesagt, dass das sowohl an dich als auch an Head of IT gehen soll.

**Denkanstoß:** Vielleicht lohnt sich eine Regel auf UI-Ebene, unabhängig vom konkreten Bug: ein
Fehler-Banner und ein Erfolgs-Banner sollten sich nie gleichzeitig anzeigen lassen können — im Zweifel
sollte der letzte, verlässlichere Zustand gewinnen, nicht beide nebeneinander.

**Update (2026-08-17):** Bei einem weiteren Fassade-Test blieb der Widerspruch einmal aus, ist jetzt aber
in einem vierten Durchlauf wieder aufgetreten — 2 von 3 Fassade-Tests hatten ihn. Bestätigt: kein
Einzelfall, sondern ein Fehler, der nur nicht bei jedem Durchlauf auslöst (intermittierend). Macht die
Design-Regel oben eher wichtiger als weniger wichtig — ein Fehler, der nur manchmal auftritt, ist für den
Nutzer noch verwirrender als einer, der immer da ist.

---

## PD-007 — Fassade: Aufnahmekarte zeigt die Fenstermaße statt der Fassadenmaße

**Kontext (PM-008):** Bei einer Fassade („zwölf Meter lang, Giebelhöhe sechs Meter, drei Fenster eins
zwanzig mal eins vierzig") zeigt die Aufnahmekarte unter „Masse" die Zahlen **1,20 × 1,40 m** — das sind
die Fenstermaße, nicht die Fassadenmaße (12 × 6 m). Die eigentliche Berechnung dahinter ist korrekt
(66,96 m² netto stimmt), nur die Anzeige auf der Karte zeigt die falschen Zahlen. Head of IT hatte das
beim ersten PM-008-Fix bereits gesehen und bewusst als offene, noch ungeklärte Frage stehen lassen — im
Nachtest heute ist bestätigt, dass sie weiterhin auftritt.

**Warum das mehr als Kosmetik ist:** Die „Masse"-Zeile auf der Karte ist der erste Ort, an dem ein
Handwerker prüft, ob das Tool die Grundmaße richtig verstanden hat — bevor er überhaupt bei den
Leistungen ist. Wenn dort die falschen Zahlen stehen (selbst wenn die spätere Rechnung sie korrigiert),
wirkt das Tool auf den ersten Blick kaputt, obwohl es am Ende richtig rechnet. Passt in dieselbe Familie
wie PD-001/PD-003: die Karte ist der Vertrauens-Moment, und genau da geht was schief.

**Update (2026-08-17):** Vierte identische Reproduktion — steht immer noch bei „1,20 × 1,40 m" statt
12×6 m, unverändert.

**Korrektur (2026-08-17):** Hier stand noch ein zweiter Absatz zu einer angeblich zweiten Bestätigung von
„Fenster streichen" als Phantom-Leistung auf der Karte. Das war ein Lesefehler von mir beim Auswerten
eines Screenshots, Sandy hat direkt nachgefragt und ich konnte es nicht bestätigen — zurückgenommen. Der
einzelne ältere Fund dazu (aus einem früheren Test, siehe `pruefmeister-testfaelle.md` PM-008) bleibt
stehen, aber nur einfach belegt, nicht zweifach.

**Update (2026-08-18) — fünfte Reproduktion, neue Variante, plus Root-Cause von Sandy:** Die Karte zeigt
diesmal nicht mehr „1,20 × 1,40 m", sondern „120,00 × 140,00 m" — dieselben Fenstermaße, nur um den
Faktor 100 verschoben. Auffällige Nähe zu dem Spracherkennungs-Bug aus PM-010 („drei fünfzig" wurde dort
als 350 statt 3,50 gelesen) — möglich, dass hier ein verwandter Effekt mitspielt, zusätzlich zur
bekannten falschen Feld-Zuordnung. Wichtiger als die Zahl selbst: Sandy hat für diese ganze Fundfamilie
(PD-003/PD-007, plus das neue „Fenster: 0" in der Entwurfsansicht) jetzt die vermutliche gemeinsame
Ursache benannt — Fassaden werden technisch wie Räume behandelt, obwohl sie keine Raumtiefe haben — und
ausdrücklich eine eigene Aufgabe für dich verlangt, nicht nur einen weiteren Einzelfund. Siehe Update bei
PD-003 oben für den vollen Wortlaut, Details in `pruefmeister-testfaelle.md` PM-008 Nachtest 5.

Zusätzlich, unabhängig von der Fassade: Sandy hat im selben Test klar gesagt, dass ihr die Aufnahmekarte
als Ganzes (der erste Gegencheck vor der Entwurfsansicht) grundsätzlich nicht gefällt — ihre Worte: „Das
gefällt mir gar nicht" und „Es ist einfach eine Katastrophe", weil dort andere Dinge stehen als später im
Angebotsentwurf. Das ist inhaltlich PD-001 (Karte zeigt nicht zuverlässig, was am Ende berechnet wird),
aber eine ausdrückliche Bekräftigung von ihr, dass das kein Kleinfund mehr ist, sondern Priorität hat.

---

## PD-008 — Automatisch ergänzte Positionen sollten als „Vorschlag" gekennzeichnet sein

**Wo das herkommt (Sandys eigene Idee, aus PM-011):** Bei einem Testfall mit echter Vollflächenspachtelung
hat das Tool zusätzlich eine Grundierung ergänzt, obwohl im Transkript kein Grundierungs-Wort vorkam. Ich
hatte das erst als Bug gemeldet — Sandy hat mich zu Recht korrigiert: fachlich ist eine Grundierung nach
großflächigem Spachteln genau das, was ein Maler sowieso machen würde. Kein Rechenfehler, sondern eine
sinnvolle, gut begründete Ergänzung.

Das eigentliche Problem ist ein anderes: im fertigen Angebot sieht diese ergänzte Position optisch exakt
gleich aus wie eine, die der Handwerker wörtlich gesagt hat. Sandys Formulierung dazu direkt: *„es soll
nur vom tool irgendwie markiert/hervorgehoben sein, dass es sich um Position[en] handelt die als Vorschlag
mäßig ergänzt wurden, user soll prüfen."*

**Warum das mehr ist als eine Kleinigkeit:** Das Tool ergänzt inzwischen an vielen Stellen automatisch
sinnvolle Positionen, ohne dass der Nutzer sie ausdrücklich verlangt hat — „Boden schützen", „Sockelleisten
abkleben", Erschwerniszuschläge, und jetzt auch Grundierungen nach Spachtelarbeiten. Das ist grundsätzlich
gut und spart dem Handwerker Tipparbeit (genau das Produkt-Prinzip: schneller korrigieren als von null
tippen). Aber aktuell kann der Handwerker beim schnellen Prüfen nicht unterscheiden: „das hab ich gesagt"
vs. „das hat das Tool für mich mitgedacht, checken!" Beides sieht gleich aus. Für die meisten ergänzten
Positionen ist das nicht schlimm, weil sie fachlich passen — aber es gab in dieser Testreihe auch
Gegenbeispiele, wo das Tool ergänzt hat, obwohl es NICHT passte (z. B. eine Kleinreparatur-Position trotz
ausdrücklicher Verneinung, ebenfalls PM-011) oder wo es sogar einen ganzen unverlangten Leistungsblock
erfunden hat (PM-010, Bodenaustausch). Eine klare Kennzeichnung würde in allen diesen Fällen dasselbe
leisten: den Blick des Handwerkers gezielt dahin lenken, wo er wirklich nochmal prüfen sollte, statt dass
er entweder jede Position gleich intensiv checken muss oder gar nicht merkt, dass da was Ungefragtes steht.

**Denkanstoß:** Ein kleines Badge oder eine andere Hintergrundfarbe/Kennzeichnung bei „vom Tool ergänzt,
nicht wörtlich gesagt" könnte für einen großen Teil der bisher gefundenen „stillen" Fehler in dieser
Testreihe die Wirkung deutlich abschwächen — nicht weil der zugrundeliegende Fehler weg wäre, sondern weil
der Handwerker genau an der richtigen Stelle hinschaut. Technische Voraussetzung dafür (für Head of IT,
siehe PM-011): es bräuchte pro Position ein Flag, ob sie direkt aus dem Transkript kam oder vom Tool
selbst abgeleitet wurde — das gibt es aktuell offenbar noch nicht.

**Update (2026-08-18):** Noch ein Beispiel dazu, aus PM-008 Nachtest 6 — die neue „Erschwerniszuschlag
Raumhöhe > 3m"-Position bei der Fassade (6 m Wandhöhe) wurde automatisch ergänzt, ohne dass „Gerüst" oder
„Erschwernis" im Transkript vorkam. Fachlich nachvollziehbar (Leiter/Gerüst nötig ab 3 m), aber genau der
Fall, wo eine „Vorschlag"-Kennzeichnung dem Handwerker sofort zeigen würde: das hat sich das Tool selbst
gedacht, kurz prüfen.

**Update (2026-08-17):** Dritte identische Reproduktion, jetzt ganz sicher kein Einzelfall. Interessanter
Beleg dabei: es gibt inzwischen ein neues „So gerechnet"-Infofeld in der Positionsansicht, das die
Rechnung transparent aufschlüsselt (z. B. „12m × 6m − Fenster (5,04 m²) = 66,96 m²") — dort stehen die
RICHTIGEN Zahlen. Nur die Masse-Zeile ganz oben auf der Aufnahmekarte zeigt weiterhin die falschen. Für
dich als Design-Info: dieses „So gerechnet"-Feld scheint grundsätzlich ein gutes Vertrauens-Element zu
sein (zeigt genau den Rechenweg) — vielleicht lohnt sich sowas Ähnliches auch schon auf der allerersten
Aufnahmekarte, nicht erst später in der Positionsansicht.

---

## Rückmeldung vom Product Designer (2026-08-18)

Danke, alle acht Punkte gelesen und übernommen. Übersicht, wo sie jetzt
stehen (alles in `docs/design-check.md`, dort mit vollem Text inkl. meiner
Empfehlung):

- **PD-001** → **DC-021** (Bestätigungskarte unzuverlässig)
- **PD-002** → **DC-025** (Rückfragen-UI komplett neu denken — eigenes,
  größeres Vorhaben, ich muss zuerst eine Richtung erarbeiten, bevor Head
  of Product Engineering etwas bauen kann; melde mich beim Chief of Staff,
  sobald ich so weit bin)
- **PD-003** → **DC-024** (Raummaße-Chip bei Fassaden)
- **PD-004** → **DC-022** (Positionsanzahl stimmt nicht, verwandt mit
  meinem eigenen DC-009)
- **PD-005** → **DC-026** (Rückfragen ignorieren Gesagtes — gehört
  inhaltlich zu DC-025)
- **PD-006** → direkt in **DC-010** eingearbeitet (nicht als neuer Punkt,
  weil es exakt derselbe Befund ist, den ich selbst schon live reproduziert
  hatte — nur mit 2 Positionen statt meinen 0. Danke für die unabhängige
  Bestätigung, das erhöht bei mir die Priorität)
- **PD-007** → **DC-023** (Fassade: falsche Maße auf Aufnahmekarte)
- **PD-008** → **DC-027** (ergänzte Positionen als „Vorschlag" kennzeichnen)

Bei DC-021/DC-023 (beides „Karte zeigt falsche Zahlen") und DC-025/DC-026
(beides Rückfragen-UI) sind die technischen Ursachen bei Head of Product
Engineering, die Design-Fragen dahinter jetzt bei mir eingeplant. DC-025
ist das mit Abstand größte Stück — behandle ich als eigenständiges Projekt,
nicht zusammen mit den kleineren Punkten.

---

## Update (Product Designer, 2026-08-18) — PD-003/PD-007 nach Nachtest 5

Beide nochmal durchgegangen, jetzt mit Head of Product Engineerings
Root-Cause-Analyse aus PM-008 Nachtest 5:

- **PD-007 (DC-023):** Extraktions-Fix ist da und lokal verifiziert (712/712
  Tests, inkl. Sandys echtem Transkript als Testfall) — die Karte zeigt bei
  Sandys Fassaden-Satz nicht mehr die falschen Fenstermaße, sondern ehrlich
  gar keine Maße (die echten Fassadenmaße stehen im Rohtext nicht im „X mal
  Y"-Format). Auf `sofortangebot.app` noch nicht deployt. „Lieber nichts als
  Falsches" ist als Zwischenstand aus meiner Sicht in Ordnung.
- **PD-003 (DC-024):** Design-Konzept steht — „Wand-Chip" statt Raum-Chip,
  kein Modus-Umschalter, kein „Breite"-Feld, „So gerechnet"-Zeile direkt am
  Chip. Vollständig in `docs/dc-024-konzept-wandchip.md`, Mockup in
  `docs/dc-024-wandchip-mockup.html`. Ich habe bewusst noch keinen Code
  angefasst — die Datenmodell-Hälfte (`modus: 'wand'`) fehlt noch und
  betrifft den Live-Berechnungspfad fertiger Angebote, das wartet laut Head
  of Product Engineering ausdrücklich auf Sandys Go. Sobald das steht, baue
  ich die Komponente direkt dazu.

Beide Stände auch in `docs/design-check.md` (DC-023/DC-024) aktualisiert.

---

## Update (Product Designer, 2026-08-18) — DC-024 umgesetzt

Head of Product Engineering hat `modus: 'wand'` geliefert (`waende[]` fließt
jetzt in `raum_details`). Wand-Chip nach meinem eigenen Konzept
(`dc-024-konzept-wandchip.md`) direkt in `AngebotDetail.tsx` gebaut: kein
Modus-Umschalter mehr für Wand-Objekte, Wandlänge × Wandhöhe statt
Breite/Länge, „So gerechnet"-Zeile direkt am Chip. Dabei eine eigene
Design-Lücke gefunden und gleich mitgeschlossen: `waende[]` fragt strukturell
nie nach Türen, darum zeigt das Türen-Feld jetzt `0` statt „!", wenn nichts
erfasst wurde (Standardannahme „keine Tür", weiter editierbar) — sonst wäre
genau die Art Fehlanzeige zurückgekommen, die DC-024 eigentlich beheben
sollte. Scoped Typecheck + ESLint auf den geänderten Dateien sauber, kompletten
`npm test` konnte ich nicht laufen lassen (Umgebungsproblem, kein
Rolldown-Binding fürs Zielsystem) — bitte einmal gegenlaufen lassen. Details
und Status in `docs/design-check.md`, DC-024.

---
