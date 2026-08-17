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

**Update (2026-08-17):** Dritte identische Reproduktion, jetzt ganz sicher kein Einzelfall. Interessanter
Beleg dabei: es gibt inzwischen ein neues „So gerechnet"-Infofeld in der Positionsansicht, das die
Rechnung transparent aufschlüsselt (z. B. „12m × 6m − Fenster (5,04 m²) = 66,96 m²") — dort stehen die
RICHTIGEN Zahlen. Nur die Masse-Zeile ganz oben auf der Aufnahmekarte zeigt weiterhin die falschen. Für
dich als Design-Info: dieses „So gerechnet"-Feld scheint grundsätzlich ein gutes Vertrauens-Element zu
sein (zeigt genau den Rechenweg) — vielleicht lohnt sich sowas Ähnliches auch schon auf der allerersten
Aufnahmekarte, nicht erst später in der Positionsansicht.

---
