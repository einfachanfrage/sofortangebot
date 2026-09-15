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

---

## PD-009 — „Fläche oder Zeit" im Preise-Prototyp, fachlich durchgesehen

*Prüfmeister · 15.09.2026 · Auftrag aus `arbeitsreihenfolge.md` (Engineering
Nr. 2 / Prüfmeister Nr. 1). Grundlage: `dc-102-preise-prototyp.html`, die
Tabelle `KATALOG`, und dein Satz dazu: „Meine Einteilung ist ein Vorschlag;
sie gehört einmal fachlich durchgesehen."*

Ist sie. Vorweg das Wichtigste, weil es die halbe Verwirrung erklärt.

---

### 1. Das Etikett stimmt nicht mit dem überein, was der Code tut

`'flaeche'` heißt im Prototyp nicht „aus der Fläche". Es heißt **„skaliert mit
dem Ankerpreis dieser Tätigkeit"** — `wert × (mein / basis)`. Beim Lackieren
ist dieser Anker ein **Stückpreis** („Tür lackieren", €/Stück). Deshalb steht
`Fenster lackieren` auf `'flaeche'` und hat mit Fläche nichts zu tun — und ist
trotzdem **richtig eingeordnet**.

Das fällt genau an der Stelle auf die Füße, an der du Manfred zitierst: Sein
Satz *„Ein Heizkörper hat mit dem Quadratmeterpreis nichts zu tun, der kommt
aus der Zeit"* steht als Kommentar über einer Tabelle, in der
`Heizkörper lackieren` auf `'flaeche'` steht. Wer das liest, hält es für einen
Fehler. Es ist keiner.

**Vorschlag: die beiden Werte heißen `anker` und `zeit`.** Dann stimmt der
Kommentar wieder mit der Tabelle überein, und die eigentliche Frage wird
lesbar.

**Die Prüffrage, mit der ich jede Zeile durchgegangen bin,** ist nämlich nicht
„in welcher Einheit wird abgerechnet" — sonst müsste alles mit lfm und Stück
zur Zeit. Sie lautet:

> **Wenn der Betrieb seinen Ankerpreis um 20 % anhebt — muss diese Zeile
> mitgehen? Dann `anker`. Hängt sie stattdessen daran, wie lange einer dafür
> braucht? Dann `zeit`.**

---

### 2. Drei Zeilen stehen fachlich falsch

| Zeile | steht auf | gehört auf | warum |
|---|---|---|---|
| **Sockelleisten montieren** (Boden, €/lfm) | `flaeche` | **`zeit`, ~0,10 h/lfm** | Du hast es selbst geahnt. Der Aufwand hängt an Metern, Ecken, Gehrungen und Türausschnitten — nicht am Quadratmeterpreis des Belags. Ein Betrieb, der Laminat für 25 €/m² verlegt, nimmt deshalb nicht 8,50 € für den laufenden Meter Leiste |
| **Kleberreste entfernen** (Boden, €/m²) | `flaeche` | **`zeit`, ~0,15 h/m², mit Hinweis** | Die schwankendste Position im ganzen Bodenbau: zwischen 5 und 25 €/m², je nachdem, was da klebt. Eine abgeleitete Zahl täuscht hier eine Genauigkeit vor, die es nicht gibt. Gehört mit dem Zusatz „vor Ort prüfen" in die Liste |
| **Steckdosen abklemmen** (innen, €/Stück) | `zeit` ✓ | `zeit`, aber **anders heißen** | Die Einordnung stimmt, der Name nicht: **Abklemmen ist Elektroarbeit.** Der Maler nimmt die Abdeckung ab und wieder dran. „Steckdosen ab- und anbauen" oder „Abdeckungen demontieren". So wie es dasteht, steht auf dem Kundenangebot eine Leistung, die der Betrieb gar nicht erbringen darf |

**Und eine, die keine Fläche-oder-Zeit-Frage ist, aber in derselben Tabelle
steht:** `Trittschall verlegen` ist als `'zubehoer'` markiert — Material immer
drin, nicht wählbar. Das widerspricht dem Boden-Standard „ohne Belag". Wer
sein Laminat selbst kauft, kauft die Dämmung fast immer mit; die liegt im
Baumarkt direkt daneben. **Gehört auf `'wahl'`.**

---

### 3. Vier Zeitwerte sind zu hoch — einer deutlich

Bei `'zeit'` ist der hinterlegte Wert eine **Stundenzahl**, und die wird mit
dem Stundensatz multipliziert (im Prototyp 52,00 €). Nachgerechnet gegen den
Standardkatalog:

| Zeile | hinterlegt | ergibt bei 52 € | Katalog / fachlich | mein Wert |
|---|---|---|---|---|
| **Sockelleisten abkleben** | 0,04 h/lfm | **2,08 €/lfm** | **0,80 €/lfm** | **0,015 h** |
| Boden reinigen | 0,05 h/m² | 2,60 €/m² | besenrein + feucht ≈ 0,60–1,00 € | **0,02 h** |
| Steckdosen (s. o.) | 0,15 h/Stück | 7,80 €/Stück | Abdeckung ab und dran: 5 Minuten | **0,08 h** |
| Gerüstplane anbringen | 0,06 h/m² | 3,12 €/m² | 100 m² Fassade = gut 3 Mannstunden | **0,03 h** |
| Heizkörper abkleben | 0,30 h/Stück | 15,60 €/Stück | mein Richtwert vom 12.09.: **18,00 €** | **0,35 h** |
| Übergangsprofil setzen | 0,35 h/Stück | 18,20 €/Stück | Katalog 15,00 € | 0,29 h |

Die Sockelleiste ist der Ausreißer: **0,04 h sind 2,4 Minuten je Meter.** Ein
18-Meter-Zimmer wäre damit eine Dreiviertelstunde nur Kreppband. Realistisch
ist eine knappe Minute je Meter, und genau daher kommen die 0,80 € im Katalog.

Der Heizkörper geht in die andere Richtung, und der Grund ist wichtiger als
der Betrag: **Für jede Position, die es auch im Standardkatalog gibt, müssen
beide Wege ungefähr dieselbe Zahl liefern.** Sonst bekommt ein Betrieb, der
die Nick-Seite durchgeht, einen anderen Preis als einer, der sie wegklickt —
für dieselbe Arbeit, in derselben App.

---

### 4. Der schärfste Fund steht nicht in der Fläche-oder-Zeit-Spalte

Die `basis`-Werte der Anker weichen vom Standardkatalog ab. Das ist nicht
egal, denn der Faktor ist **`mein / basis`** — eine falsche Basis verzieht
*alle* abgeleiteten Zeilen dieser Tätigkeit:

| Anker | `basis` im Prototyp | Standardkatalog | Folge |
|---|---|---|---|
| **Vliestapete kleben** | 9,00 € | **18,00 €** | Trägt er seine echten 18,00 € ein, wird der Faktor **2,0** — und jede Tapezier-Zeile verdoppelt sich. „Raufaser kleben" landet bei 15,20 € statt 10,00 € |
| Laminat verlegen | 17,00 € | 14,00 € | Faktor rund 0,8 — alle Boden-Zeilen zu niedrig |
| Wand streichen 2x | 10,00 € | 9,50 € | klein, aber dieselbe Mechanik |
| Decke streichen 2x | 10,00 € | 11,00 € | siehe unten |

**Das ist kein Prototyp-Schönheitsfehler, wenn die Tabelle so übernommen
wird.** Die Basiswerte müssen beim Einbau aus `default-prices.ts` gezogen
werden, nicht abgeschrieben. Sonst rechnet das Onboarding gegen eine
Preisliste, die es so nicht gibt.

**Und ein fachlicher Fehler steckt auch drin:** Decke 2x und Wand 2x stehen
beide auf 10,00 €. **Über Kopf ist teurer** — Leiter, Nackenhaltung,
schlechtere Sicht auf den Randanschluss. Der Katalog hat das richtig (9,50
gegen 11,00). Im Prototyp ist die Decke billiger als die Wand, und das kippt
bei jedem Deckenangebot in die falsche Richtung.

---

### 5. Zu den 63 % — die Stelle, an der Manfred und der Katalog auseinandergehen

Deine Nick-Seite zeigt als Beispiel „Wand streichen 1x · 8,25 €", der Prototyp
rechnet 6,93 €. Der Unterschied ist Manfreds Satz, 1x sei bei ihm **75 %** von
2x, gegen die **63 %** aus dem Katalog (6,00 zu 9,50; bei der Decke 7,00 zu
11,00 — dieselbe Quote).

**Beide haben recht, und es hängt an genau einer Frage:** Steckt die
Vorbereitung im Quadratmeterpreis?

- Wenn Abkleben, Abdecken und Rüsten **extra** berechnet werden — so steht es
  in deinem eigenen Halbsatz auf Bildschirm 3 — dann ist der m²-Preis fast
  reine Streicharbeit. Der zweite Anstrich geht schneller als der erste, aber
  nicht dramatisch. **1x ≈ 60 %, die 63 % stimmen.**
- Steckt die Vorbereitung drin, verschiebt sich das Verhältnis nach oben, und
  Manfreds 75 % sind richtig — **für seine Preise.**

Das ist also nichts zum Entscheiden, sondern etwas zum **Anzeigen** — und
damit genau der Beleg für deine Herkunftszeile. Mein Vorschlag: Bei allen
1x-Zeilen steht dort nicht nur „abgeleitet aus: Wand 2x", sondern
**„abgeleitet aus: Wand 2x · ohne Vorbereitung, die zählt extra"**. Dann
findet Manfred die Stelle, an der er widersprechen will, ohne dass ihm jemand
erklären muss, warum die Zahl so ist.

---

### 6. Was richtig steht, obwohl es falsch aussieht

Damit es beim Umbauen nicht versehentlich „mitkorrigiert" wird:

- **Fenster, Zarge, Heizkörper, Geländer lackieren** auf `anker` — richtig.
  Der Anker ist ein Stückpreis, sie skalieren mit ihm.
- **Wand spachteln Q2, Untergrund vorbereiten, Fassade grundieren** auf
  `anker` — richtig, das sind flächige Arbeiten.
- **Altbelag lose 5,20 € gegen verklebt 9,40 €** — sehr gut. Genau die
  Unterscheidung, die im Angebot dreimal Geld gekostet hat, bevor sie eine
  Regel wurde.
- **Übergangsprofil und Gerüstplane auf `zeit`** — richtig eingeordnet, nur
  die Werte müssen nachgezogen werden.

---

### 7. Was ich prüfe, sobald es gebaut ist

Zwei Betriebe, sonst gleich: einer mit 52 €/h, einer mit 75 €/h. **Die
Zeit-Zeilen müssen sich um genau diesen Faktor unterscheiden, die
Anker-Zeilen um gar nichts.** Wenn sich eine Anker-Zeile mitbewegt, steht sie
in der falschen Spalte — und das sieht man an keinem Bildschirm, nur am
Vergleich.

Dazu die Gegenprobe aus Punkt 3: für jede Position, die es auch im
Standardkatalog gibt, der abgeleitete Preis gegen den Katalogpreis. Abweichung
über 20 % heißt, einer von beiden ist falsch.

---

## PD-010 — Der Anker fürs Lackieren: welche Katalogzeile es wird

*Prüfmeister · 15.09.2026 · offener Punkt aus PD-009 / `arbeitsreihenfolge.md`*

### Die Entscheidung

> **Anker: `Türen lackieren (2× Anstrich)` — 90,00 €/Stück**
> Halbsatz: *„Ein Innentürblatt, beidseitig, zweimal lackiert. Die Zarge zählt
> extra."*

Drei Gründe, in dieser Reihenfolge:

1. **Es ist die Zeile, die die Engine selbst erzeugt.** `maler-lackieren.ts`
   schreibt wörtlich `Türen lackieren (2× Anstrich)`. Der Anker muss dieselbe
   Zeile sein, die später im Angebot steht — sonst fragt das Onboarding nach
   einem Preis, den nachher niemand benutzt. Das ist dieselbe Regel wie beim
   Vokabular-Abgleich: Katalog folgt der Engine.
2. **Es ist die Zahl, die jeder Maler im Kopf hat.** „Was nimmst du für eine
   Tür?" beantwortet jeder ohne nachzudenken. Bei „Holzbauteil lackieren 2x,
   18 €/m²" muss er erst rechnen, wie viel Quadratmeter eine Tür hat.
3. **Sie liegt in der Mitte ihrer Welt.** Alles andere im Lackierbereich
   verhält sich stabil dazu, quer über Betriebe (Verhältnisse unten).

### Warum nicht „Tür lackieren, pro Tür mit Zarge" wie im Prototyp

Im Prototyp steht der Anker als *„Tür lackieren · Pro Tür mit Zarge,
beidseitig"* zu 60,00 €. **Das geht aus zwei Gründen nicht:**

- **Die Zarge ist im Katalog eine eigene Zeile** (`Türzarge lackieren`,
  45,00 €/Stück), und die Engine erzeugt sie auch getrennt. Ein Anker, der die
  Zarge einschließt, bedeutet: Der Betrieb gibt einen Preis für Blatt + Zarge
  an, und im Angebot stehen danach beide Zeilen. **Die Zarge wäre doppelt
  drin.**
- **Der Betrag ist zu niedrig.** Blatt beidseitig (90,00) plus Zarge (45,00)
  sind im Standardkatalog 135,00 € — der Prototyp verankert bei 60,00. Trägt
  ein Betrieb seinen echten Türpreis ein, wird der Faktor 1,5 und jede
  abgeleitete Lackier-Zeile springt um die Hälfte nach oben. **Dieselbe
  Mechanik wie bei der Vliestapete aus PD-009**, nur eine Tätigkeit weiter.

### Die Verhältnisse, aus denen abgeleitet wird

Gemessen am Anker (90,00 €). Diese Quoten halten über Betriebe hinweg — wer
120 € für die Tür nimmt, nimmt rund 60 € für die Zarge:

| Zeile | Katalog | Anteil am Anker |
|---|---|---|
| Türzarge lackieren | 45,00 €/Stück | 50 % |
| Fenster lackieren (2× Anstrich) | 55,00 €/Stück | 61 % |
| Stahlzarge lackieren | 55,00 €/Stück | 61 % |
| Heizkörper streichen / lackieren | 40,00 €/Stück | 44 % |
| Türen grundieren · Fenster grundieren | 25,00 €/Stück | 28 % |
| Türen abschleifen · Fenster abschleifen | 20,00 €/Stück | 22 % |
| Treppengeländer lackieren | 18,00 €/lfdm | 20 % *(andere Einheit, Quote trägt trotzdem)* |

**Ein Ausreißer im Prototyp:** Dort steht „Geländer lackieren 53,00 €/lfm".
Der Katalog hat 18,00 €/lfdm. 53 € je laufendem Meter wäre ein Geländer mit
Abbeizen und Neuaufbau — für „lackieren" sind 18 € richtig, mit Anschleifen
25–30 €. Bitte auf den Katalogwert ziehen.

### Was mit der Entscheidung aufgeräumt werden muss

**Für eine einzige Innentür führt der Katalog heute fünf Zeilen in zwei
Rubriken** — das ist der eigentliche Grund, warum die Ankerfrage überhaupt
schwierig war:

| Zeile | Rubrik | Preis | |
|---|---|---|---|
| `Türen lackieren (2× Anstrich)` | Maler – Lackierarbeiten | 90,00 € | **bleibt, wird Anker** |
| `Innentürblatt lackieren beidseitig` | Maler – Lackierarbeiten | 90,00 € | Dublette, geht im Anker auf |
| `Tür streichen / lackieren (beidseitig)` | Maler – Anstrich Innen | 75,00 € | Altlast, **15 € billiger für dieselbe Arbeit** |
| `Innentürblatt lackieren einseitig` | Maler – Lackierarbeiten | 55,00 € | bleibt als Ausnahme, Titel angleichen |
| `Tür streichen / lackieren (einseitig)` | Maler – Anstrich Innen | 45,00 € | Altlast, Dublette der Zeile darüber |

Dasselbe bei der Zarge: `Türzarge lackieren` 45,00 € (Lackierarbeiten) gegen
`Türzarge streichen` 35,00 € und `Türrahmen streichen` 35,00 € (Anstrich
Innen) — **drei Zeilen, ein Bauteil.**

**Das ist nicht nur Kosmetik, sondern trifft die Tätigkeiten-Ebene:**
`taetigkeiten.ts` ordnet „Maler – Lackierarbeiten" der Tätigkeit *Lackieren*
zu und alles übrige „Maler …" der Tätigkeit *Innen streichen*. Die
Altlast-Zeilen liegen also in der **falschen Tätigkeit** — und ausgerechnet
die billigeren. Ein Betrieb, der den Lackier-Haken nicht setzt, bekommt seine
Türen trotzdem bepreist, nur 15 € zu niedrig und ohne dass er je nach dem
Preis gefragt wurde.

**Mein Vorschlag, in einem Zug mit dem Anker:**

- `Tür streichen / lackieren (beidseitig)` und `(einseitig)` entfallen; die
  Arbeit steht in den Lackierarbeiten.
- `Innentürblatt lackieren einseitig` heißt künftig
  **`Türen lackieren einseitig (2× Anstrich)`** — dieselbe Wortfamilie wie der
  Anker, damit beide im selben Atemzug gefunden werden. Preis bleibt 55,00 €.
- `Innentürblatt lackieren beidseitig` entfällt (identisch zum Anker).
- `Türzarge streichen` und `Türrahmen streichen` entfallen zugunsten von
  `Türzarge lackieren` 45,00 €.

Damit sind aus fünf Türzeilen zwei geworden (beidseitig 90, einseitig 55) und
aus drei Zargenzeilen eine.

### Die Probe, die das absichern muss

Vor dem Einbau, im Test: **Ein Angebot mit einer Tür darf genau zwei Zeilen
erzeugen** — Blatt und Zarge — und nie eine dritte aus der anderen Rubrik.
Heute kann der Matcher je nach Titel in beiden Rubriken landen; nach dem
Aufräumen gibt es die zweite Rubrik nicht mehr.

---

## PD-010 — gebaut. Und drei Dinge, die du von deiner Seite nicht sehen konntest

*Head of Product Engineering · 15.09.2026*

Der Anker ist `Türen lackieren (2× Anstrich)`, 90,00 €. Deine Begründung
stimmt in allen drei Punkten, und der erste ist der tragende: **Es ist die
Zeile, die die Engine selbst erzeugt** — nachgesehen, `maler-lackieren.ts`
schreibt genau diesen Titel. Ein Anker, der anders heißt, fragt nach einem
Preis, den nachher niemand benutzt.

**Deine Quoten habe ich nicht eingebaut, sondern nachgerechnet** — und genau
das war der Punkt: Sie stimmen alle sieben mit dem Katalog überein (Zarge
50 %, Fenster 61 %, Stahlzarge 61 %, Heizkörper 44 %, grundieren 28 %,
abschleifen 22 %, Geländer 20 %). Damit sind sie der **Beleg**, dass die
Katalogwerte zueinander passen, und nicht die Quelle der Preise. Im Code steht
keine einzige davon; alles kommt aus `default-prices.ts`.

Das Geländer ist auf 18,00 €/lfdm gezogen, wie du geschrieben hast.

**Und einen Fund von dir habe ich weitergetragen:** In PD-009 §6 stand
*„Fenster, Zarge, Heizkörper, Geländer lackieren auf `anker` — der Anker ist
ein Stückpreis."* Bei mir hing der Heizkörper an der **Wand**, also am
Quadratmeterpreis — genau die Zuordnung, gegen die Manfreds Satz gerichtet
war. Er hängt jetzt am Türpreis. Ein Test hält es fest.

### 1. Eine deiner fünf Streichungen geht so nicht: `Türrahmen streichen`

Die Zeile ist **ein Engine-Titel.** `maler-extras.ts` hat eine eigene Regel
(`pruefeTuerrahmen`): Sagt der Handwerker „Türrahmen", entstehen **zwei**
Positionen — `Türrahmen schleifen` und `Türrahmen streichen`. Fällt die
Katalogzeile weg, steht die zweite ohne Preis da.

Das ist kein Grund gegen dein Ziel, sondern ein Hinweis, dass es eine Ebene
tiefer sitzt, als wir beide dachten: **Die Engine hat selbst zwei Vokabeln für
dasselbe Bauteil.** `maler-lackieren.ts` sagt „Türzarge", `maler-extras.ts`
sagt „Türrahmen". Der Katalog hat die Dopplung nur gespiegelt.

Ich habe die Zeile deshalb **stehen gelassen** und die anderen vier
gestrichen. Das ist eine Vokabelfrage, und die gehört dir, nicht mir — dieselbe
Regel wie bei CoS-E-037. Wenn du sagst, die Engine soll „Türzarge" sagen, baue
ich es; dann fällt die Katalogzeile im selben Zug.

Nebenbei aus derselben Familie: **`Stahlzarge lackieren` (55,00 €) liegt in
„Anstrich Innen"**, nicht in den Lackierarbeiten. Du hast sie in der
Quotentabelle, aber nicht in der Aufräumliste. Gleicher Fehler, gleiche Rubrik
— sag Bescheid, ob sie mit umzieht.

### 2. Die Streichung ändert einen Preis, den der Handwerker sieht

`Tür streichen / lackieren (einseitig)` war nicht nur eine Katalogzeile,
sondern die **Standardzeile** der Familie „Tür streichen/lackieren"
(`katalog-standard.ts`, CoS-E-051). Wer „Tür lackieren" sagt, ohne einseitig
oder beidseitig zu nennen, bekommt sie.

Ich habe den Standard auf `Türen lackieren einseitig (2× Anstrich)` gezogen —
sonst hätte die Familie ins Leere gezeigt. **Damit steigt der angenommene Preis
für eine einseitige Tür von 45,00 € auf 55,00 €.**

Das ist die richtige Richtung und trotzdem eine Preisänderung, die jemand
merkt: Nicht weil etwas teurer geworden wäre, sondern weil vorher die
**billigere von zwei Zeilen gewann — und zwar die in der falschen Tätigkeit.**
Dein Fund, nur an der Stelle, an der er auf dem Angebot ankommt. Ich nenne es,
damit es nicht als stille Erhöhung durchgeht.

Ebenfalls nachgezogen: die drei Onboarding-Vorlagen, die auf die entfallenen
Zeilen zeigten. Sie zeigen jetzt auf die Lackierarbeiten.

### 3. Beim Nachmessen ein größerer Fund — und er gehört dir

Ich habe geprüft, ob noch andere Vorlagen ins Leere zeigen. Ergebnis:

```
Onboarding-Vorlagen gesamt: 832
davon ohne passende Katalogzeile: 164  (20 %)

aktive Gewerke:   malerarbeiten 1 · bodenbeläge 13 · maler_fassade 1
noch nicht aktiv: schreiner 24 · estrich 23 · elektro 19 · sanitär 19 ·
                  trockenbau 17 · dachdecker 17 · putz_stuck 10 · garten 6 …
```

Die dreizehn beim Boden sind **keine fehlenden Arbeiten, sondern andere
Schreibweisen derselben**:

```
Vorlage: „Laminat verlegen schwimmend (Standard)"
Katalog: „Laminat verlegen, schwimmend"

Vorlage: „Teppichboden verlegen (gespannt / Nagelleiste)"
Katalog: „Teppichboden verlegen (gespannt / Tackern auf Nagelleiste)"
```

**Warum das seit gestern Geld kostet und vorher nicht:** Bis zum 14.09. wurden
die Vorlagen wegen der falschen Gewerk-Kennungen nie gefunden (CoS-E-052).
Seit dem Fix legt das Onboarding jede Vorlage ohne Katalog-Zwilling als
**eigene Zeile** an. Ein Bodenleger bekommt damit „Laminat verlegen,
schwimmend" **und** „Laminat verlegen schwimmend (Standard)" in seine Liste —
zwei Zeilen, eine Arbeit, und der Matcher nimmt eine davon.

Das ist CoS-E-039 durch die Hintertür. Ich habe es **nicht** selbst korrigiert:
Es sind Wortlaute, und die entscheidest du. Die vierzehn Zeilen der aktiven
Gewerke wären ein kurzer Durchgang; die 150 der noch nicht freigeschalteten
haben Zeit, sollten aber vor der Freischaltung des jeweiligen Gewerks dran sein.

### Deine Probe

*„Ein Angebot mit einer Tür darf genau zwei Zeilen erzeugen — Blatt und Zarge
— und nie eine dritte aus der anderen Rubrik."*

Steht als Test (`pd010-tueranker.test.ts`). Ich habe dein „genau zwei" auf den
**Katalog** bezogen, nicht auf die Zahl der Positionen: Abschleifen und
Grundieren sind eigene Arbeitsgänge, die die Engine zu Recht dazulegt. Geprüft
wird deshalb beides —

- der Katalog führt zwei Türzeilen (90/55) und eine Zargenzeile,
- **jede** Tür- und Zargenposition wird aus „Maler – Lackierarbeiten" bepreist,
  keine aus „Anstrich Innen",
- Blatt und Zarge entstehen je genau einmal.

Nachgemessen am echten Durchlauf („Wände streichen. Und die Tür lackieren,
beidseitig."): vier Türpositionen — abschleifen 20, grundieren 25, lackieren
90, Zarge 45 — alle vier aus den Lackierarbeiten.

Migration Nr. 63 ist in Produktion und Staging gelaufen; vorher nachgesehen,
dass keine Angebotsposition an den vier Zeilen hängt (die Bedingung steht
trotzdem im SQL).

*Head of Product Engineering · 2026-09-15*

---

## PD-011 — „Fläche oder Zeit": gemessen, nicht geschätzt — die Tabelle zum Gegenlesen

*Head of Product Engineering · 15.09.2026 · an den Prüfmeister, Kopie Product
Designer*

Der Chief of Staff hat „Fläche oder Zeit" als gemeinsamen Punkt aufgeschrieben
(Engineering Nr. 2 / Prüfmeister Nr. 1), nachdem der Designer selbst gesagt
hat: *„Meine Einteilung ist ein Vorschlag; sie gehört einmal fachlich
durchgesehen."*

**Ich entscheide hier nichts.** Die Einteilung ist Fachwissen und gehört dir.
Was ich beitragen kann, sind Zahlen — damit du nicht 35 Zeilen im Kopf
durchgehen musst, sondern die drei Stellen ansiehst, an denen die Einteilung
wirklich Geld bewegt.

### Zuerst ein Befund, der für die Einteilung spricht

Vier Zeit-Zeilen haben einen echten Katalog-Zwilling. Teilt man dessen Preis
durch deine Stundenzahl, sagt jede, welchen Stundensatz der Katalog an dieser
Stelle unterstellt:

```
Sockelleisten abkleben      0,80 € / 0,015 h  = 53,3 €/h
Altkleber abschaben         8,00 € / 0,15  h  = 53,3 €/h
Sockelleisten montieren     5,50 € / 0,10  h  = 55,0 €/h
Übergangsprofil einbauen   15,00 € / 0,29  h  = 51,7 €/h
```

**51,7 bis 55,0 — 6 % Spanne über vier unabhängig geschätzte Zeilen.** Der
Katalog trägt einen Stundensatz, und deine korrigierten Zeitwerte treffen ihn.
Das ist das beste Argument dafür, dass die Zeit-Spalte kein Bauchgefühl ist.

**Als Test festgehalten** (`preis-ableitung.test.ts`), und zwar bewusst so,
dass er **ohne** Stundensatz auskommt: Die vier Sätze müssen zwischen 50 und
56 liegen und untereinander unter 10 % auseinander. Ein verstellter Stundenwert
fällt damit auf, ohne dass jemand vorher die richtige Zahl kennen muss — deine
fünf Korrekturen aus PD-009 §3 wären hier aufgeschlagen.

### Und der Grund, warum das mehr als Buchhaltung ist

Deine Probe 2 (*„beide Wege müssen ungefähr dieselbe Zahl liefern"*) lief bis
heute bei **52 €/h**. Nachgemessen, bei welchen Stundensätzen sie hält:

```
grün von 44 bis 63 €/h · darunter und darüber rot
75 €/h:  Sockelleisten abkleben 1,10 statt 0,80 · Kleberreste 11,50 statt 8,00
         Sockelleisten montieren 7,50 statt 5,50 · Übergangsprofil 22 statt 15
```

Das ist kein Fehler, sondern genau die Aufteilung: Zeit-Zeilen folgen dem
Stundensatz, Anker-Zeilen dem Ankerpreis. Es heißt aber: **Bei einem Betrieb
mit 75 €/h zerfällt seine Liste in zwei Preisniveaus** — die Zeit-Zeilen auf
seinem, die Anker-Zeilen auf dem des Katalogs, solange er keine eigenen
Ankerpreise nennt. Der Test steht jetzt auf 45–60 €/h statt auf der einen 52.

### Die drei Stellen, an denen die Einteilung Geld bewegt

Zwei Nachbarzeilen, gleiche Art Arbeit, verschiedene Spalte. Alle Zahlen bei
gleichem Stundensatz (52 €/h), nur der Ankerpreis steigt:

**1. Boden — Altbelag gegen Kleberreste**

| Zeile | Spalte | Laminat 14 € | Laminat 25 € |
|---|---|---|---|
| Altbelag aufnehmen, verklebt | `anker` | 9,00 | **16,00** |
| Kleberreste entfernen | `zeit` | 8,00 | **8,00** |

Beides ist Abbruch am selben Boden, im selben Auftrag, oft in derselben
Stunde. Ein Bodenleger mit teurem Laminat schabt den Altkleber nicht schneller
oder langsamer — aber er nimmt den verklebten Altbelag um 78 % teurer auf.

**2. Maler innen — Abdecken gegen Abkleben**

| Zeile | Spalte | Wand 2x 9,50 € | Wand 2x 13,00 € |
|---|---|---|---|
| Boden abdecken (Abdeckvlies) | `anker` | 1,20 | **1,60** |
| Sockelleisten abkleben | `zeit` | 0,80 | **0,80** |
| Heizkörper abkleben | `zeit` | 18,00 | **18,00** |

Vlies auslegen und Kreppband ziehen sind derselbe Handgriff am selben Morgen.

**3. Lackieren — Vorbereitung am Anker**

| Zeile | Spalte | Tür 90 € | Tür 120 € |
|---|---|---|---|
| Türen abschleifen | `anker` | 20,00 | **27,00** |
| Türen grundieren | `anker` | 25,00 | **33,00** |

Hier hat keine Zeile einen Zeit-Zwilling zum Vergleich; beide hängen am
Türpreis. Deine Prüffrage darauf angewandt: *Wenn der Betrieb seinen Türpreis
um ein Drittel anhebt — schleift er die Tür dann auch teurer?*

Zum Einordnen, was in den Vorbereitungszeilen an Zeit steckt, wenn man sie mit
53 €/h zurückrechnet:

```
Schleifen von Hand        4,00 €/m²    4,5 min/m²
Grundieren (Tiefengrund)  4,50 €/m²    5,1 min/m²
Fläche spachteln          9,00 €/m²   10,2 min/m²
Türen abschleifen        20,00 €/Stk  22,6 min
Türen grundieren         25,00 €/Stk  28,3 min
Altbelag verklebt         9,00 €/m²   10,2 min/m²
Untergrund spachteln     12,00 €/m²   13,6 min/m²
```

### Vier Zeit-Zeilen ohne jede Gegenprobe

Diese haben keinen Katalog-Zwilling — ihre Stundenzahl steht allein auf deiner
Schätzung, und kein Test kann sie prüfen:

```
Steckdosen-Abdeckungen ab- und anbauen  0,08 h/Stück   →  4,16 € bei 52 €/h
Heizkörper abkleben                     0,35 h/Stück   → 18,20 €
Gerüstplane anbringen                   0,03 h/m²      →  1,56 €
Boden reinigen                          0,02 h/m²      →  1,04 €
```

### An den Product Designer — dein eigenes Beispiel

Du hast gewarnt: *„Sockelleisten montieren wird in lfm abgerechnet, skaliert
aber mit der Bodenfläche."* Die Zeile steht seit PD-009 §2 auf `zeit`, hängt
also **nicht** mehr am Belagspreis — und die Messung oben bestätigt die Zahl
von der anderen Seite (55,0 €/h gegen die 53 der Nachbarzeilen). Deine Sorge
trifft damit nicht mehr den Preis. Was offen bleibt, ist die **Menge**: wie
viele laufende Meter aus einem Raum entstehen. Das ist die Mengen-Engine, nicht
diese Tabelle, und dort gibt es dazu bereits eigene Fälle.

### Was ich nicht getan habe

Keine Zeile umsortiert. Wenn du eine der drei Stellen anders haben willst, ist
es je ein Wort in `preis-ableitung.ts` (`art: 'anker'` ↔ `art: 'zeit'`) plus
eine Stundenzahl — und der Test oben sagt sofort, ob sie zum Katalog passt.

*Head of Product Engineering · 2026-09-15*

---

## PD-012 — Nachlauf zu PD-010: zwei Fehlpreise gefunden, einer bleibt bei dir

*Head of Product Engineering · 15.09.2026 · an den Prüfmeister*

Der Testlauf nach dem Türen-Aufräumen war rot. Zwei der Funde waren echte
Fehlpreise und sind behoben; einer ist eine Wortlautfrage und gehört dir.

### Behoben, zur Kenntnis

```
„Tür streichen / lackieren (beidseitig)"  →  Heizkörper · 40,00 €
„Tür lackieren beidseitig"                →  Außentür   · 110,00 €
```

Der erste ist eine Bauteil-Sperre geworden — dieselbe Bauart wie deine
Q-Stufen-Regel: Ein Heizkörper ist keine Tür, auch wenn beide gestrichen und
lackiert werden. Der zweite ist eine Nachordnung: Die Außentür darf nur
einspringen, wenn zur Tür selbst nichts passt. Beides gemessen gegen den
ganzen Katalog, 2374 von 2374 Zeilen finden sich weiter selbst, kein einziger
bestehender Treffer hat sich geändert.

### 🟡 Deine Entscheidung: die Klammer-Angabe kommt nicht durch

```
„Tür streichen / lackieren (einseitig)"  →  Türen lackieren (2× Anstrich) · 90,00 €
```

Zwei Dinge treffen zusammen, und keins davon ist neu:

1. Klammerinhalte fallen in der Normalisierung weg (steht seit PM-018 so im
   Code, aus gutem Grund — sonst verzieht jede Klammer die Wortwertung).
2. Deine `nur-unterschied`-Regel sperrt nur, wenn **beide** Seiten eine Angabe
   tragen. Die Zeile, die beidseitig meint, heißt `Türen lackieren (2×
   Anstrich)` — sie trägt keine.

**Der Kern ist Nr. 2, und er ist eine Benennung:** Die beidseitige Zeile sagt
nicht, dass sie beidseitig ist. „2× Anstrich" heißt zwei Gänge, nicht zwei
Seiten. Solange das so steht, kann keine Regel die einseitige Anfrage von der
beidseitigen Zeile fernhalten, ohne die Zeile ohne Zusatz generell zu sperren
— und das wolltest du ausdrücklich nicht.

Mein Vorschlag, deine Entscheidung: `Türen lackieren beidseitig (2× Anstrich)`.
Dann greift deine Regel von selbst, in beide Richtungen, ohne neue Sonderregel.
Sag Bescheid, dann ist es ein Titel plus Migration.

**Wie dringend:** heute nicht. Die Engine erzeugt diese Schreibweise nicht
(nachgemessen: „Tür lackieren einseitig" und „Tür lackieren beidseitig" ohne
Klammer treffen richtig, 55 € und 90 €), und ein Betrieb mit der alten Zeile
in seiner eigenen Liste findet sie dort exakt.

### Eine sichtbare Folge, die du kennen solltest

Beim siebten roten Test kam heraus, dass vier Katalogzeilen als Material
**„Farbe"** statt **„Lack"** führten — die drei aus „Maler – Lackierarbeiten"
und „Heizkörper streichen / lackieren". Ursache: Seit der Umbenennung tragen
sie beide Wörter („lackieren" und „Anstrich"), und die Farb-Regel stand
zuerst. Behoben, Lack geht jetzt vor.

**Damit ändern sich zwei sichtbare Dinge an diesen vier Zeilen:** der Halbsatz
auf dem Angebot heißt „ohne Lack" statt „ohne Farbe", und der Materialanteil
liegt bei deinen 30 % für Lack statt bei 25 %. Ich halte das für die Anwendung
deiner eigenen Zahl und nicht für eine neue Entscheidung — sag es, wenn du es
anders siehst.

*Head of Product Engineering · 2026-09-15*


---

## PD-013 — Antwort auf PD-011: „Fläche oder Zeit" ist entschieden

*Prüfmeister · 15.09.2026 · an den Product Designer, Kopie Head of Product
Engineering*

Deine Tabelle habe ich nachgerechnet, nicht überflogen. Alle Zahlen aus
PD-011 stimmen: die vier unterstellten Stundensätze (53,3 · 53,3 · 55,0 ·
51,7), die 6 % Spanne, das grüne Band 44–63 €/h, und die drei Tabellen mit
den Ankerpreisen. Nachgefahren mit dem echten `leiteAb()` und
`pruefeGegenKatalog()` über den echten Katalog.

### Die Frage heißt anders, als sie dasteht

„Fläche oder Zeit" ist die Antwort, nicht die Frage. Die Frage, die eine
Einteilung trägt, ist diese:

> **Bestimmt die neue Leistung den Aufwand — oder bestimmt ihn der Bestand?**

- Aufwand aus dem, was **entsteht** (Güte der neuen Oberfläche, Anzahl der
  Gänge, Sorgfalt am Finish) → `anker`.
- Aufwand aus dem, was **schon da ist** (Altbelag, Altkleber, alte Tapete,
  verschmutzte Fassade, möbliertes Zimmer) → `zeit`.

Das ist keine Verfeinerung deiner Prüffrage, sondern sie zu Ende gedacht. Du
hast gefragt: *„Wenn der Betrieb seinen Türpreis um ein Drittel anhebt —
schleift er die Tür dann auch teurer?"* Die ehrliche Antwort ist **ja**, und
deshalb steht Türen abschleifen richtig. Eine 120-€-Tür wird anders
angeschliffen als eine 90-€-Tür: feinere Körnung, ein Gang mehr, saubere
Kanten. Das ist dieselbe Arbeit in einer anderen Güte — und Güte ist genau
das, was der Ankerpreis abbildet.

Beim Altkleber ist es umgekehrt. Was da klebt, hat der Vormieter entschieden.
Der Bodenleger schabt es nicht schneller, weil er anschließend teures Laminat
verlegt.

### Die drei Stellen

**1. Boden — Altbelag gegen Kleberreste: beide auf `zeit`.**

Deine Beobachtung, dass hier etwas nicht stimmt, trägt. Gemessen bei einem
Betrieb mit 75 €/h und 25 €/m² Laminat:

```
                        heute     Katalog    nach der Änderung
Altbelag verklebt       16,00      9,00           12,75
Kleberreste entfernen   11,50      8,00           11,25
Verhältnis               1,39      1,13            1,13
```

Zwei Gänge am selben Vormittag am selben Boden, deren Verhältnis sich um ein
Viertel verschiebt — allein deshalb, weil einer am Belagspreis hängt. Mit
`zeit` steht es wieder auf dem Verhältnis, das der Katalog selbst kennt, und
zwar bei jedem Stundensatz.

**Mitentschieden, aus demselben Grund:** `Altbelag aufnehmen, lose verlegt`.
Auch Abbruch, auch am Bestand.

**2. Maler innen — Abdecken auf `zeit`.**

Dein und Engineerings Satz ist richtig: Vlies auslegen und Kreppband ziehen
sind derselbe Handgriff am selben Morgen. Der Aufwand kommt aus dem Zimmer,
nicht aus der Wandfarbe.

**3. Lackieren — beide bleiben `anker`.**

`Türen abschleifen` und `Türen grundieren` bleiben, wo sie sind. Begründung
oben. Der Grundgang ist ohnehin der erste Gang des Lackaufbaus, kein
Vorbereiten des Bestands.

### Zwei weitere Zeilen fallen unter dieselbe Regel

`Tapete ablösen (einlagig)` — was an der Wand klebt, gibt den Aufwand vor.
`Fassade reinigen / druckwaschen` — der Zustand der Fassade, nicht die Farbe,
die danach draufkommt. Beide auf `zeit`.

### Die Stundenzahlen — und warum sie nicht geschätzt sind

Jede ist aus dem Katalogpreis ihrer eigenen Zeile zurückgerechnet, über den
Stundensatz, den der Katalog selbst trägt:

| Zeile | Katalog | Stunden | unterstellt |
|---|---|---|---|
| Teppichboden verklebt entfernen | 9,00 €/m² | **0,17** | 52,9 €/h |
| Laminat demontieren und entsorgen | 5,00 €/m² | **0,094** | 53,2 €/h |
| Boden abdecken (Abdeckvlies) | 1,20 €/m² | **0,0225** | 53,3 €/h |
| Tapete ablösen (einlagig) | 4,00 €/m² | **0,075** | 53,3 €/h |
| Fassade reinigen / druckwaschen | 5,00 €/m² | **0,094** | 53,2 €/h |

**Und hier wird deine Messung stärker, nicht schwächer:** Mit diesen fünf
sind es **neun** Zeit-Zeilen mit Katalog-Zwilling statt vier — und die Spanne
bleibt bei **51,7 bis 55,0 €/h, also 6,3 %**. Vier Zeilen konnten Zufall
sein. Neun sind es nicht. Das grüne Band von `pruefeGegenKatalog` bleibt
unverändert bei **44–63 €/h**; nachgefahren mit dem echten `runde()`.

### Eine Zeile, die ich ausdrücklich NICHT entscheide

`Untergrund spachteln / ausgleichen (bis 5mm)` (12,00 €/m²). Nach der Regel
wäre es `zeit` — der Estrich gibt den Aufwand vor. Dagegen steht ein
Materialanteil, der bei Ausgleichsmasse nicht klein ist und den bisher
niemand gemessen hat. Solange die Zahl fehlt, bleibt die Zeile, wo sie ist.
Sie steht als offener Punkt in der Restliste, nicht als stille Entscheidung.

### Was zu tun ist

Je Zeile ein Wort in `preis-ableitung.ts` (`art: 'anker'` → `art: 'zeit'`)
plus die Stundenzahl aus der Tabelle oben. Der Test liegt schon:
`src/lib/__tests__/pm-flaeche-oder-zeit.test.ts`. Er ist heute grün, weil er
den Ist-Stand als Sperrklinke festhält — **sobald ihr umstellt, wird er rot
und zwingt dazu, das `.fails` zu streichen.** Dieselbe Bauart wie PM-013-A.

*Prüfmeister · 2026-09-15*

---

## PD-014 — Nachlauf zu PD-009: die Materialseite der Preisliste hält nicht, was sie anzeigt

Restliste Nr. 9 war eine kleine Frage: `Übergangsprofil / Schwelle einbauen`
steht mit 15,00 €/Stück im Katalog und mit 0,29 h in `preis-ableitung.ts`. Bei
52 €/h sind das 15,08 € reine Zeit — für das Profil selbst bliebe nichts.
Waren die Stunden zu hoch, oder fehlt das Material?

**Die Stunden sind richtig. Das Material fehlt.** Und beim Nachmessen sind aus
der einen Frage drei geworden, die alle dasselbe Muster haben: Eine Marke sagt
etwas über das Material, das der Preis daneben nicht einlöst.

### 1. Das Übergangsprofil (PM-057)

Der Beweis kommt aus dem Katalog selbst, nicht aus einem Baumarktpreis:

```
Übergangsprofil / Schwelle einbauen     15,00 €/Stück
Schwelle / Übergangsprofil entfernen     8,00 €/Stück   ← reine Arbeit
```

Steckten im Einbau 8–12 € Profil, bliebe für die Einbau-**Arbeit** 3,00 bis
7,00 € — **weniger als für den Ausbau.** Niemand setzt ein Profil schneller,
als er eines herausreißt: messen, ablängen, bohren, dübeln, schrauben. Also
sind die 15,00 € Arbeitslohn, und 0,29 h stimmen — der unterstellte Satz ist
51,7 €/h und liegt damit im selben Band wie die übrigen Zeit-Zeilen
(51,7–55,0 €/h).

Bleibt: Die Zeile trägt `material: 'zubehoer'` („ist bei mir drin", Manfred),
und ihr Preis ist **zu 100 % Zeit, bei jedem Stundensatz**. Bei Kreppband und
Folie fällt das nicht auf; hier sind es 8–12 € auf eine 15-€-Zeile, also über
die Hälfte. Der Betrieb zahlt das Profil aus der eigenen Tasche, bei jeder Tür.

**Was ich nicht entscheide:** ob eine `zeit`-Zeile einen festen Materialbetrag
bekommen soll. Das ist ein Eingriff in die Bauweise und gehört zu euch. Die
Sperrklinke dafür liegt in `pm-preisliste-material.test.ts`.

### 2. „Grundieren (Tiefengrund)" steht zweimal in einer Preisliste (PM-058)

Ein Betrieb, der **Maler innen und Tapezieren** ankreuzt, bekommt dieselbe
Katalogzeile zweimal — einmal aus dem Wand-Anker, einmal aus dem Tapeten-Anker:

```
Grundieren (Tiefengrund)   5,50 €/m²   material: wahl       [maler_innen]
Grundieren (Tiefengrund)   3,00 €/m²   material: zubehoer   [tapezieren]
Katalog                    4,50 €/m²
```

Zwei Preise und zwei Material-Marken für dieselbe Arbeit, in einer Liste.
Welcher im Angebot landet, entscheidet der Matcher, nicht der Betrieb. Spanne
2,50 €/m². Dieselbe Familie wie Q.2 („Kleinstauftrag pauschal" steht zweimal):
eine Zahl, mehrere Quellen.

### 3. Zwei Dateien, zwei Antworten auf dieselbe Materialfrage (PM-059)

`preis-ableitung.ts` markiert je Zeile `'wahl' | 'zubehoer' | null`.
`materialanteil.ts` entscheidet dieselbe Frage noch einmal, am Titel, mit
eigener Zubehör-Liste. Bei **fünf** Zeilen widersprechen sie sich, und immer
in dieselbe Richtung — die Preisliste verspricht einen Materialschalter, die
Angebotszeile hat keinen:

```
Grundieren (Tiefengrund)
Isoliergrund gegen Nikotin / Ruß / Wasserflecken
Fassadengrundierung auftragen
Trittschalldämmung verlegen (PE-Schaum / Filz)
Sockelleisten montieren (Holz / MDF / Kunststoff)
```

Die letzten beiden sind **absichtlich** so entstanden: In PD-009 §2 wurden sie
bewusst auf `wahl` gestellt, mit guter Begründung. `materialanteil.ts` sperrt
`trittschall` und `sockelleiste` wörtlich als Zubehör — beide Dateien am selben
Tag geschrieben, keine kennt die andere.

Praktisch heißt das: Wer sein Material selbst stellt, bekommt bei diesen
Zeilen **nichts abgezogen**, weil `teileMaterialAb()` `null` liefert. Der
umgekehrte Fall kommt nicht vor — geprüft.

**Was zu entscheiden ist, und von wem:** Welche der beiden Dateien recht hat,
ist eine fachliche Frage (Manfreds Satz gegen die Begründung in PD-009 §2), und
die beantworte ich gern — aber erst, wenn klar ist, welche Datei die Oberfläche
speist. Das weiß ich von hier aus nicht. **Eine Quelle, nicht zwei**, ist die
Bedingung; welche es wird, hängt an eurem Aufbau.

Alles drei mit Zahlen in `src/lib/__tests__/pm-preisliste-material.test.ts`.
Zwei Prüfungen stehen als `it.fails` — sobald ihr baut, werden sie rot und
zwingen dazu, das `.fails` zu streichen. Dieselbe Bauart wie PM-013-A.

*Prüfmeister · 2026-09-15*

---

## PD-015 — DC-107, dritte Frage: muss eine angenommene Menge auf dem Kundenpapier auffallen?

Das ist die Frage aus DC-107, die eher meine ist als deine, also beantworte ich
sie. **Kurz: nein — auf dem Kundenpapier soll eine angenommene Menge gar nicht
als angenommen erscheinen. Auffallen muss sie vorher, auf dem Schirm des
Handwerkers, solange er noch etwas ändern kann.**

### Warum nicht beim Kunden

Ein Angebot ist ein Preisversprechen, keine Arbeitsnotiz. Steht dort „4 Türen
(angenommen)", passiert zweierlei, und beides ist schlecht für den Betrieb:
Der Kunde liest, dass der Handwerker nicht nachgesehen hat — und er hat einen
Anker, um über eine Menge zu verhandeln, die gar nicht strittig war. Manfred
würde so ein Papier nicht rausschicken; er würde die Zahl vorher richtigstellen.

Dazu die fachliche Seite: Eine Menge, die auf dem Angebot als Annahme
gekennzeichnet ist, ist kein Aufmaß, sondern ein Vorbehalt. Wer so anbietet,
verschiebt die Klärung in die Abrechnung — genau dahin, wo sie am teuersten
ist. **Die Annahme gehört vor den Versand, nicht ins Dokument.**

### Was der Code heute macht — und die Schieflage darin

Beides ist nachgesehen, nicht vermutet:

- Das Feld `annahmen` (z. B. `3 Zimmer → je 1 Tür angenommen`) kommt
  **absichtlich nicht** bis ins Kunden-PDF. Das ist so gebaut und richtig so;
  die Begründung steht als Kommentar in `pdf.tsx` (VOB-004 / Legal G5).
- Der `berechnungsweg` kommt **schon** aufs Kundenpapier, wenn der Rechenweg
  eingeschaltet ist (Standard). Und genau dort steht seit CoS-E-058 die
  Quellenangabe: `4 Tür(en) aus Aufnahme`.

**Die Schieflage:** Die Zeile mit der belegten Zahl trägt beim Kunden ein
Herkunftsetikett, die Zeile mit der geratenen Zahl trägt keins — die Annahme
ist ja ausgeblendet. Der Kunde sieht also ausgerechnet bei der **sichersten**
Zahl einen Hinweis, dass hier etwas hergeleitet wurde, und bei der
**unsichersten** nichts. Das ist genau verkehrt herum.

### Mein Vorschlag, in drei Sätzen

1. **Auf dem Kundenpapier: keine Herkunftsangabe.** Im Rechenweg steht
   „4 Türen", nicht „4 Tür(en) aus Aufnahme" und auch nicht „aus Transkript".
   Woher der Handwerker seine Mengen hat, ist eine Frage zwischen ihm und
   seiner Aufnahme, nicht zwischen ihm und dem Kunden.
2. **Auf dem Schirm des Handwerkers: deutlich, und zwar im Weg zum Versand.**
   Dort ist die Herkunft nützlich — und dort ist eine angenommene Menge etwas,
   das er antippen und überschreiben soll. Die Stelle dafür gibt es schon
   (`versandbereit.ts`), die Vorschlag-Marke aus TN-057 auch.
3. **Unterscheide drei Fälle, nicht zwei:** *gesagt* (steht so im Diktat) ·
   *aus der Aufnahme* (er hat es gemessen, nur nicht in diesem Satz gesagt) ·
   *angenommen* (niemand weiß es). Nur der dritte Fall muss ihn aufhalten. Der
   zweite ist eine stille Fußnote für ihn, der erste braucht gar nichts.

### Zu deinen beiden eigenen Fragen, nur als Fachhinweis

**„aus Aufnahme" oder „aus Aufmaß"?** Nicht „Aufmaß". Das Wort ist am Bau
belegt: Ein Aufmaß ist die Mengenermittlung, nach der abgerechnet wird, im
VOB-Vertrag gemeinsam genommen und unterschrieben. Ein Diktat ins Handy ist
das nicht. Wer es auf dem Kundenpapier so nennt, weckt eine Erwartung, die das
Papier nicht hält. **„Aufnahme" ist harmlos und richtig** — nur versteht der
Kunde es auch nicht, was der eigentliche Grund für Vorschlag 1 oben ist.

**Ist „angenommen" der richtige Satz?** Für den Handwerker ja, das Wort
benutzt er selbst. Beim Kunden hat es nichts verloren — siehe oben. Wenn dort
doch je etwas stehen soll, dann nicht das Wort, sondern die Zahl, die stimmt.

Nachgesehen in `src/lib/vollstaendigkeit/maler-lackieren.ts` (die beiden
Zeilen aus CoS-E-058) und `src/lib/pdf.tsx`. Kein Test dazu — das ist eine
Wortlaut- und Ablauffrage, keine Rechenfrage. Sobald der Wortlaut steht,
hinterlege ich ihn als Fall.

### Nachtrag, eine halbe Stunde später: du hast es gebaut

`src/lib/rechenweg-kundentext.ts` und der Einhängepunkt in `pdf.tsx` waren da,
als ich das oben geschrieben hatte. Ich lasse meinen Text stehen, wie er war,
und setze die Antwort darunter — damit sichtbar bleibt, wo wir übereinstimmen
und wo nicht.

**Wo du recht hast, und zwar mehr als ich.** Deine Begründung, die Herkunft
fallen zu lassen statt sie umzubenennen, ist besser als meine. Ich habe sie
nachgesehen und sie stimmt: `maler-lackieren.ts` schreibt „aus Aufnahme", wenn
im Satz **keine** Zahl stand, `aufnahme-hinweise.ts` schreibt dieselben zwei
Wörter, wenn ausdrücklich **eine** dastand. Zwei Gegenteile, ein Wortlaut, auf
demselben Blatt. Das ist ein härteres Argument als mein „der Kunde versteht es
nicht", und der Filter an einer Stelle statt in 35 Templates ist die richtige
Bauart.

**Wo ich bei meiner Meinung bleibe: „(angenommen)" auf dem Kundenpapier.** Dein
Argument, das sei keine Herkunft, sondern eine Einschränkung der Menge, ist
richtig. Meins bleibt trotzdem: Der Kunde bekommt damit einen Anker, um über
eine Menge zu verhandeln, die gar nicht strittig war, und liest, dass nicht
nachgesehen wurde. **Beides ist vereinbar, wenn die andere Hälfte gebaut
wird** — der Handwerker muss die angenommene Menge vor dem Versand zu sehen
bekommen und antippen können. Solange ihn nichts aufhält, geht die Klammer
raus, und dann ist sie schlechter als eine Zahl, die stimmt. **Kein
Widerspruch zu deinem Bau, eine Bedingung dazu.**

**Eine Frage, keine Forderung: „im Aufmaß".** `Transkript` → `Aufmaß` ist
verständlicher, keine Frage. Nur ist „Aufmaß" am Bau ein belegtes Wort: die
Mengenermittlung, nach der abgerechnet wird, im VOB-Vertrag gemeinsam genommen.
Auf einem **Angebot** hat die noch gar nicht stattgefunden. „Altbau im Aufmaß
erkannt" kann gelesen werden als: da war jemand und hat gemessen. Dass die App
den Vorgang selbst „Aufmaß" nennt, ist ein gutes Gegenargument — dann ist das
Wort im Produkt schon gesetzt und die Uneinheitlichkeit wäre schlimmer.
**Ich entscheide das nicht, ich melde es:** Das ist eine Wortlautfrage fürs
Kundendokument, und dafür gibt es die Runde mit Legal (LR-16).

### Und ein Fund, den der Filter nicht sieht — PM-078

Zwei `berechnungsweg`-Texte erreichen das Kundenpapier, die keine
Rechnung sind und kein „Transkript" enthalten, also durch den neuen Filter
unverändert durchgehen:

1. **„Erkannt, aber Menge nicht sicher berechenbar — bitte manuell
   ergänzen"** — wörtlich so in `chips-vervollstaendigung.ts` und
   `mengen/mehrgewerk.ts`, beide als `berechnungsweg`, nicht als `annahmen`.
   Der Kunde liest auf dem Angebot eine Arbeitsanweisung an den Betrieb.
   Genau die Sorte Text, die CoS-E-005 mit dem `annahmen`-Array vom Papier
   genommen hat.
2. **„Umfang ≈ 4 × √20 m² = 18 lfdm"** — aus `boden-vorarbeiten.ts` und
   `maler-extras.ts`. Der Kunde sieht eine Wurzel und erfährt, dass sein Raum
   als Quadrat angenommen wurde; die dazugehörige Annahme bleibt unsichtbar,
   sie steht in `annahmen`. Entweder die Annahme wird sichtbar oder der
   Schätzweg verschwindet — beides zugleich ist die schlechteste Fassung.

Hinterlegt als **PM-078 A/B** in
`src/lib/__tests__/pruefmeister-batch-69-77.test.ts`, mit einer grünen
Kontrolle, die bestätigt, dass dein Filter tut, was er soll.

*Prüfmeister · 2026-09-15, nachts*
