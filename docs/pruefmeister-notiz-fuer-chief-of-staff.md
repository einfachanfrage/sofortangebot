# Prüfmeister → Chief of Staff: Notiz zum Gesamtbild

Kein Bug-Tracker (der ist `docs/pruefmeister-testfaelle.md`) und keine Design-Kritik (die ist
`docs/pruefmeister-notizen-fuer-designer.md`). Das hier ist eine Ebene höher: was mir nach jetzt
10 Testfällen im Gesamtbild auffällt, für die Reifegrad-Einschätzung.

## Ein Muster zieht sich durch fast alle Tests

In 6 von 10 Testfällen (PM-001, PM-004, PM-005, PM-008, PM-009, PM-010) zeigt der Bildschirm, den
der Handwerker kurz vor dem Erstellen des Angebots sieht („X Positionen erkannt", die Leistungen-Liste,
die Raummaße), etwas anderes als das, was am Ende tatsächlich berechnet wird — mal fehlt eine Leistung
auf der Karte, die trotzdem berechnet wird, mal wird eine „erkannte" Leistung nie berechnet, mal zeigt
die Zahl „5 Positionen" am Ende nur 4 gelieferte. Das sind technisch gesehen unterschiedliche
Einzelfehler (an Details siehe die Testfälle-Datei), aber im Muster ist es immer dasselbe: der
Kontrollmoment, auf den sich das ganze Produkt verlässt, um schnelles Prüfen statt Nachrechnen zu
ermöglichen, ist selbst nicht verlässlich.

Dazu kam heute ein Einzelfund, der mir mehr Sorge macht als die anderen: bei PM-010 wurde die
Sprechweise „drei fünfzig" (für 3,50 Meter — die Standard-Sprechweise, die ich in praktisch jedem
Testfall benutzt habe) einmal als die Zahl 350 gelesen. Ein Innenraum mit 350 Metern Länge. Das ist
kein Nischen-Fall, das ist die Art, wie im Handwerk über Maße gesprochen wird. Im Nachtest heute hat
sich das ein zweites Mal identisch reproduziert — kein Ausrutscher, sondern ein stabiler Fehler.

## Neuer, ernsterer Fund: das Tool erfindet einen ganzen unverlangten Leistungsblock

Im selben Nachtest (PM-010, Sockelleisten-Fall) ist mir eine neue Fehlerkategorie begegnet, die
schwerer wiegt als alles bisher Dokumentierte. Angefragt war ausschließlich Sockelleisten-Arbeit
(alte raus, neue rein). Im fertigen Angebot standen zusätzlich zwei nie angefragte Positionen:
kompletter Bodenbelag verlegen (11,03 m², inkl. 5 % Verschnitt) und alten Bodenbelag entfernen
(10,5 m²) — macht in Summe eine ganze Bodenerneuerung, die niemand bestellt hat.

Warum das eine andere Kategorie ist als die bisherigen Funde: bisher ging es immer um „etwas fehlt"
oder „etwas stimmt in der Menge nicht" — ärgerlich, aber der Handwerker merkt es, weil er weiß, was
er bestellt hat. Hier passiert das Gegenteil: das Tool liefert MEHR, als angefragt wurde, und zwar
plausibel genug (realistische m²-Zahlen, korrekte Verschnitt-Logik), dass ein Handwerker, der nur
kurz drüberschaut, es für einen legitimen Teil des Angebots halten könnte — mit allen Folgen, wenn
das so an einen Kunden rausgeht. Meine Vermutung (für Head of IT, nicht bestätigt): die Erwähnung
„die alten Sockelleisten kommen raus" wurde von der Spracherkennung mit einer allgemeinen
Bodenbelag-Entfernung verwechselt.

## Meine ehrliche Einschätzung (nur meine Perspektive, nicht die einzige, die zählt)

Fachlich — also ob die Kernrechnungen für Standardfälle stimmen — macht das Tool inzwischen einen
guten Eindruck: mehrere gefundene Bugs (Akzentwand, Verschnitt, Grundierung auf ganze Wand,
Dachgeschoss) wurden schnell und sauber behoben, mit Tests dahinter. Das ist keine Beschwerde,
das ist echter Fortschritt in einem Tag.

Was mich zögern lässt, „reif für echte Nutzer" zu sagen, ist nicht ein einzelner Rechenfehler, sondern
dass der Vertrauens-Mechanismus selbst (die Karte, die einem sagt „ich hab dich verstanden, bevor ich
dir was in Rechnung stelle") wiederholt nicht hält, was er verspricht. Ein Handwerker, der das einmal
erlebt, prüft danach jede Position von Hand — dann hat das Tool seinen Kernnutzen verloren, selbst
wenn die Rechnung am Ende richtig ist.

Das ist keine Entscheidung, die ich treffe — das ist deine und Sandys Abwägung. Ich wollte nur das
Gesamtbild mitgeben, das sich aus einzelnen Testfällen sonst nicht ergibt.

## Update 2026-08-17: ein neues Problem, eine Ebene über den einzelnen Bugs

Head of IT hat inzwischen für fast jeden gemeldeten Fund ein „Fix-Update" mit genauer Root-Cause-
Erklärung dokumentiert — fachlich sehr überzeugend, mit Tests belegt. Das Gros davon (PM-001 bis PM-009)
hat sich im Live-Nachtest auch bestätigt: der Ausschluss-Bug (PM-001), das Dachgeschoss (PM-007), die
Übergangsschiene (PM-009) — alles läuft jetzt live wie beschrieben.

Bei PM-010 aber (der Sockelleisten-Doppel-Falle) ist heute etwas passiert, das mir mehr zu denken gibt
als jeder einzelne Rechenfehler bisher: Sandy hat denselben Fall NACH drei dokumentierten Fix-Updates
nochmal frisch eingesprochen — und alle drei „behobenen" Bugs (der 350-statt-3,50-Extraktionsfehler,
der erfundene Bodenaustausch, das fehlende „Sockelleisten streichen") sind identisch wieder aufgetreten.
Nicht ähnlich, nicht teilweise — exakt wie vorher.

Das ist ein anderes Problem als „ein Bug wurde nicht sauber gefixt". Wenn drei unabhängig beschriebene
Fixes gleichzeitig nicht greifen, ist die wahrscheinlichste Erklärung nicht drei zufällig unvollständige
Fixes, sondern dass die Fixes in der Umgebung, in der Sandy testet, schlicht noch nicht angekommen sind
(Deploy-Lücke). Das würde bedeuten: die ganzen dokumentierten „behoben, Live-Test steht aus"-Einträge
in der Testfälle-Datei sagen aktuell nicht zuverlässig aus, was wirklich im Tool ankommt, das Sandy und
später echte Nutzer sehen. Für die „reif für echte Nutzer"-Frage ist das relevanter als jeder einzelne
der bisherigen Funde — nicht, weil der Code falsch wäre, sondern weil die Kette „Code fixen → Sandy
testet → wir wissen, was wirklich läuft" gerade eine Lücke hat, die ich als Prüfmeister nicht selbst
schließen kann (ich sehe nur, was ankommt, nicht, ob/wann etwas deployed wurde).

Dazu kam heute noch ein zweiter, eigenständiger neuer Fund: bei PM-008 zeigte das Tool kurzzeitig
gleichzeitig „Keine Positionen erkannt" (rot) und „2 Positionen erkannt" (grün) auf demselben Screen —
Sandy musste es zweimal versuchen, um weiterzukommen. Für sich genommen ein UI-Bug, aber im
Zusammenspiel mit dem Deploy-Verdacht oben macht es mich vorsichtig, aktuell irgendeine Aussage über
den „wahren" Stand des Tools zu treffen, ohne dass jemand technisch bestätigt, welcher Code-Stand gerade
live ist.

**Mein Vorschlag, nur als Denkanstoß:** Bevor der nächste Testblock läuft, würde ich mir wünschen, dass
jemand (Head of IT oder wer auch immer Deploys verantwortet) kurz bestätigt, welcher Stand aktuell live
ist — sonst laufen Sandy und ich Gefahr, entweder echte Regressionen zu übersehen (weil wir denken „war
doch schon gefixt") oder Zeit mit dem Nachtesten von Dingen zu verbringen, die technisch noch gar nicht
live sein können.

## Nachtrag (2026-08-17): meine Deploy-Theorie war falsch, aber der eigentliche Befund positiv

Kurzes Update, damit das oben nicht falsch stehen bleibt: Head of IT hat statt zu raten in den echten
Rohdaten aus Sandys Test nachgesehen und die wahre Ursache gefunden — es war kein Deploy-Problem,
sondern alle drei Fixes waren jeweils gegen eine leicht falsche Annahme darüber gebaut, wie die Daten
in echt aussehen (u. a.: die „350" kommt schon so von der Spracherkennung selbst, nicht aus unserem
eigenen Code — das war vorher niemandem klar). Das war die richtige Reaktion auf meinen Verdacht: bei
echten Daten nachsehen statt weiterzuraten.

Der frische Live-Nachtest danach zeigt ein überwiegend gutes Bild: der erfundene Bodenaustausch (der
Fund, den ich hier oben als „neue, ernstere Fehlerkategorie" beschrieben hatte) ist bestätigt behoben.
Die 350 bleibt auf der ersten Karte sichtbar, aber das ist jetzt eine bewusste, erklärte
Design-Entscheidung (Warnung statt Korrektur, weil die Ursache vor unserem eigenen Code liegt), keine
offene Fehlerquelle mehr — die eigentliche Berechnung ist davon nicht betroffen. Nur beim dritten Punkt
(fehlendes „Sockelleisten streichen") konnte ich noch keine saubere Bestätigung geben, weil mein
Screenshot am Ende abgeschnitten war — das hole ich beim nächsten Test nach.

Insgesamt: das bestätigt eher die positive Seite meiner Einschätzung von oben (fachliche Fixes sind
schnell und sauber) als die Sorge um eine Deploy-Lücke — die gab es so nicht.

## Zweiter Nachtrag (2026-08-17): der bisher schwerste Einzelfund — verdoppeltes Angebot

Das hier stufe ich höher ein als alles, was bisher in dieser Notiz stand. Ich habe bei einem Angebot
(2026-0016) live beobachtet, dass sich der komplette Inhalt verdoppelt hat — jede einzelne Position taucht
zweimal auf, die Endsumme ist exakt das Doppelte des korrekten Werts (2.000,28 € statt 1.000,14 €), ohne
jede Fehlermeldung. Das ist keine falsche Position und kein fehlender Zuschlag mehr, sondern das ganze
Angebot rechnet sich potenziell auf das Doppelte hoch — und für den Handwerker sieht dabei nichts kaputt
aus, die einzelnen Zeilen wirken für sich genommen plausibel, es gibt nur doppelt so viele davon.

Ich kann den genauen Auslöser nicht mit Sicherheit benennen (Details und meine eigene, transparente
Einschätzung dazu in `pruefmeister-testfaelle.md`, PM-014) — es könnte mit wiederholtem Neuladen derselben
Entwurfsseite zusammenhängen. Aber unabhängig von der genauen Ursache: das ist der erste konkret bewiesene
Fall des „Race Condition"-Verdachts, der von Anfang an auf meiner Beobachtungsliste stand, und er ist
ernster als ich erwartet hatte. Für die „reif für echte Nutzer"-Frage von oben ist das relevanter als
jeder einzelne Rechenfehler bisher — ein falsch berechneter Zuschlag kostet den Kunden ein paar Euro zu
viel oder zu wenig, ein verdoppeltes Angebot kann einen Auftrag komplett kippen, wenn es unbemerkt
rausgeht.
