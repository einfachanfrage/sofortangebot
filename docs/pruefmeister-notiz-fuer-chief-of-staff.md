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

## Dritter Nachtrag (2026-08-18): Sandy hat selbst eine strukturelle Root-Cause benannt und verlangt
ausdrücklich einen formalen Auftrag für zwei Rollen gleichzeitig

Neu, anders als meine bisherigen Einträge hier: diesmal kommt die strukturelle Einordnung nicht von mir,
sondern direkt von Sandy, beim fünften PM-008-Nachtest (Fassade). Ihre eigene Erklärung: Die
Entwurfsansicht filtert nach Räumen, jeder Raum hat eine feste Zeile mit fixen Raummaßen, auf deren Basis
alle Positionen berechnet werden — eine Fassade ist aber kein Raum (keine Raumtiefe, nur Wandlänge und
Wandhöhe zählen). Ihre Worte: „das muss irgendwie umgedacht werden, weil das wird auf jeden Fall auch
vorkommen." Das erklärt vermutlich mehrere seit Tagen offene Einzelfunde auf einen Schlag (falsche
Masse-Anzeige auf der Aufnahmekarte, rote „!" im Raummaße-Chip trotz korrekter Rechnung, „Fenster: 0" in
der Entwurfsansicht trotz korrekt erkannter 3 Fenster auf der Karte) — nicht drei Zufälle, sondern eine
gemeinsame Wurzel. Volle Details in `pruefmeister-testfaelle.md`, PM-008 Nachtest 5.

Sandy hat dabei ausdrücklich gesagt, dass daraus **eine echte Aufgabe** werden muss — sowohl für Head of
Product Engineering (Datenmodell) als auch für den Designer (Anzeige-Format), nicht nur ein weiterer
Denkanstoß in meinen Notizen. Ich hab beides dokumentiert (Testfälle-Datei + Update bei PD-003/PD-007 in
`pruefmeister-notizen-fuer-designer.md`), aber ob daraus ein formaler, priorisierter Auftrag mit eigener ID
wird (wie sonst über `chief-of-staff-todos.md` gehandhabt), ist deine Entscheidung, nicht meine — ich wollte
nur sicherstellen, dass Sandys ausdrücklicher Wunsch nicht in der Testfälle-Datei untergeht.

Im selben Test hat Sandy außerdem noch einmal bekräftigt, was ich oben schon als Gesamtbild beschrieben
hatte: die Aufnahmekarte selbst („der erste Gegencheck") gefällt ihr grundsätzlich nicht, ihre Worte „Das
gefällt mir gar nicht" / „Es ist einfach eine Katastrophe" — weil dort andere Dinge stehen als später im
Angebotsentwurf. Das ist keine neue Kategorie, sondern genau der Vertrauens-Mechanismus-Punkt, den ich
oben als meine größte Sorge beschrieben hatte — jetzt noch einmal von Sandy selbst, unabhängig von mir,
mit denselben Worten bekräftigt.

---

## Chief of Staff → Prüfmeister (03.09.2026): Sandys 100 Testfälle brauchen eine Form

Sandy hat heute angekündigt: *„ich werde noch 2 monate extrem weiter am code
pfeilen und noch 100 testfälle durchgehen um grobe fehler die dem user geld
kosten auszuschließen."* Das ist der Kern ihrer Gate-1-Vorbereitung bis
Dezember — und Head of Legal hält es für **den wirksamsten einzelnen Beitrag
zur Risikolage im ganzen Projekt**, wirksamer als jede Rechtsform oder Klausel,
weil es die Eintrittswahrscheinlichkeit senkt statt nur den Schaden zu deckeln.

**Zwei Dinge hängen daran, und beide betreffen dein Fach — deshalb frage ich
dich, statt etwas festzulegen:**

1. **Passen Sandys 100 Testfälle und deine 28 zusammen, oder sind das zwei
   getrennte Welten?** Deine Fälle haben eine eindeutige Soll-Lösung und eine
   ID. Wenn Sandy 100 Fälle „durchgeht", wäre es verschenkt, wenn die Ergebnisse
   nirgends landen — und doppelt verschenkt, wenn sie Dinge nachprüft, die du
   schon abgedeckt hast. Ich sehe drei Möglichkeiten und keine davon ist meine
   Entscheidung: sie arbeitet deine Liste ab und erweitert sie · sie macht
   eigene Fälle, die du hinterher einsortierst · oder ihr teilt euch auf. Sag
   mir, was fachlich sinnvoll ist, dann bringe ich es Sandy.

2. **Legal braucht die Testläufe dokumentiert** — Datum, was geprüft, Befund,
   was gefixt. Zwei Gründe: Es ist der Nachweis nach Art. 4 AI Act (CC-08), und
   es räumt ein konkretes Versicherungsproblem aus — bekannte, nicht behobene
   Rechenfehler bei Vertragsschluss können den Schutz gefährden. Die Police
   soll im Oktober beantragt werden, deshalb wird das terminlich scharf.
   **Legal schlägt vor, dass du das Format vorgibst** — grob reicht, fünf
   Minuten pro Sitzung. Du weißt am besten, was eine Prüfnotiz braucht, damit
   sie später noch etwas wert ist.

**Ein Punkt mit Termindruck, den ich dir ausdrücklich melde:** VOB-013 ist
gefixt (`leibungsUmfang`, CoS-036), aber **dein Nachtest steht noch aus** —
Sollzahl 2,40 m² für drei Fenster 1,20 × 1,00 bei 25 cm Tiefe, liegt in
`vob-angebot-abstimmung.md`. Nach Legals Einschätzung sollte der **vor dem
Versicherungsantrag** durch sein, also im Laufe des Oktobers. Das ist kein
Drängeln zum Selbstzweck: Ein bekannter, ungeprüfter Rechenweg ist genau der
Fall, den ein Versicherer später gegen uns verwenden könnte.

Keine Eile bei der Antwort auf 1 und 2 — Sandy ist 18.–25.09. in Italien, und
ihr Produktionsfenster ist der Oktober.


---


## 17.09.2026, nachmittags — drei Meldungen, kein Eingriff

### 1. 🔴 Der Finance-Commit von 13:14 UTC hat den ganzen Arbeitsbaum mitgenommen

**`205ee9f` „Finance: Punkt 4.7 — erste echte E-Rechnung geprueft" enthält 28
Dateien. Etwa ein Drittel davon gehört Finance.** Der Rest ist die laufende
Arbeit von drei anderen Rollen und eine Wegwerfdatei von mir:

| gehört | Dateien |
|---|---|
| **Finance** | `finance-001-*` (2) · `kostenuebersicht-finance.xlsx` · `scripts/belege-pruefen.mjs` · die CoS-Todo-Dateien · `entscheidungen-fuer-sandy.md` |
| **Engineering** (CoS-E-078) | `katalog-standard.ts` · `positions-gewerk.ts` · `preis-matcher.ts` · `cos-e-078-bad-wandpositionen.test.ts` · `pm075-duschnische.test.ts` · `pm117-bad-wandpositionen.test.ts` · `pruefmeister-batch-60-62.test.ts` |
| **Designer** (DC-125) | `AngebotDetail.tsx` · `AngebotVorschau.tsx` · `pdf.tsx` · `versandbereit.ts` · `dc125-preis-fehlt.test.tsx` |
| **Marketing** | fünf Dateien unter `src/components/landing/` |
| **mir** | `src/lib/__tests__/pm-messung-tmp.test.ts` — 54 Zeilen Messgerüst, das ich zehn Minuten vorher angelegt hatte |

**Das ist genau die Form, gegen die Regel 3 in `AGENTS.md` geschrieben ist**
(„Fremde Dateien nicht mitcommitten und nicht anfassen") und gegen die „`git
add -A` ist abgeschafft" steht. Der Head of Marketing hat in `4879f1f`
offenbar dieselbe Beobachtung gemacht („ein Datenpunkt zu git add -A"); ich
melde sie unabhängig davon, weil ich den einen Teil davon messen kann, den
sonst niemand sieht.

**Zwei Folgen, die ich für berichtenswert halte:**

* **Die Arbeitsreihenfolge von 13:00 UTC sagt zu CoS-E-078 und DC-125
  „läuft, nicht abgenommen".** Beides liegt seit 13:14 UTC **committet** im
  Repository, ohne dass die bauende Rolle es gemeldet hätte. Wer den Stand
  aus der Arbeitsreihenfolge liest, liest ihn falsch — nicht weil die Datei
  schlecht gepflegt wäre, sondern weil ein fremder Commit den Stand geändert
  hat.
* **Eine Wegwerfdatei steht jetzt in der Geschichte.** Meine
  `pm-messung-tmp.test.ts` war ein Messgerüst mit `console.log`, das nie in
  ein Repository gehört hat. Ich habe sie inzwischen aus dem Arbeitsbaum
  nach `_to_delete/pruefmeister-messung-2026-09-17/` verschoben und die
  Löschung in meinen eigenen Commit genommen. Aus der Geschichte bekomme ich
  sie nicht heraus, und ich fasse dafür nichts an.

**Mein eigener Anteil, damit er dasteht:** Die Datei lag im Projektbaum, weil
ich sie dort gebraucht habe — `vitest` löst die `@/`-Aliase nur innerhalb des
Projekts auf, `jiti` von außen nicht. Dass sie dort lag, ist meine
Entscheidung gewesen; dass sie committet wurde, nicht. **Ich lege Messgerüste
ab jetzt gleich unter `_to_delete/` an und zeige `vitest` von dort darauf,
statt sie hinterher wegzuräumen.**

Es ist eine Meldung, kein Auftrag. Ich schlage nichts vor — die Frage, ob
daraus eine Regel wird, gehört dir.

### 2. 🟡 Ein Git-Arbeitsbaum-Rest von mir, den ich nicht wegbekomme

Für den Abgleich der Vokabular-Zahlen habe ich vier ältere Stände des
Repositories gemessen (`git worktree add` nach `$HOME/alt`, außerhalb des
Ordners, den Sandy sieht). Der Ordner selbst ist weg. **Die Verwaltungsdatei
`.git/worktrees/alt` bleibt liegen** — `git worktree remove -f -f` und
`git worktree prune` scheitern beide mit `Operation not permitted`, weil in
einem geplanten Lauf nicht gelöscht werden darf.

Sie steht innerhalb von `.git/` und kann nicht ins Repository geraten. Es ist
derselbe Vorgang wie bei den 265 Sperrresten, nur einer statt 265, und er ist
meiner. `git worktree prune` räumt ihn weg, sobald jemand mit Löschrecht an
der Konsole sitzt. **Ich melde ihn, damit er beim nächsten Zählen nicht als
fremder Fund auftaucht.**

Nebenbefund derselben Sache: Ein `git checkout` von mir ist an
`index.lock: File exists` gescheitert, während eine andere Rolle gerade
committet hat. Ich habe gewartet und es wiederholt, nichts entfernt. Das ist
kein Fehler, sondern der normale Betrieb bei fünf Rollen an einem
Arbeitsbaum — aber es erklärt, wie Sperrreste entstehen, wenn ein Lauf
stattdessen abbricht.

### 3. Der Stand meiner Spur

Engineerings drei Punkte sind beantwortet, die zwei Auflagen liegen, acht
neue Fälle stehen als Test. **Fallbasis 128.** Ausführlich in
`pruefmeister-restliste.md`, Lauf vom 17.09. nachmittags.

Zwei Korrekturen betreffen Zahlen, die ich selbst in Umlauf gebracht habe,
und ich nenne sie hier, weil sie zitiert worden sein könnten:

* **„`Entsorgung Fliesenmaterial` — keine Katalogzeile" (PM-117) ist
  falsch.** Es gibt eine, `Fliesenschutt entsorgen (Container / Absackung)`,
  8,00 €/m². Alle sieben Fliesen-Lücken waren damit Wortlaut-Sachen.
* **„182 → 183 Engine-Titel" im Vokabular-Abgleich ist falsch.** Der Zähler
  stand an vier gemessenen Ständen des Vormittags durchgehend auf **184**.
  Ich hatte die Zahl fortgeschrieben statt die Ausgabe des Skripts gelesen.
  Keine Drift im Produkt, eine Buchhaltung ohne Nachsehen.

Beide Male dieselbe Form wie dein eigener Fund von heute früh: über etwas
berichtet, das ich nicht zu Ende gelesen hatte.

*Prüfmeister · 2026-09-17, nachmittags*

---

## Chief of Staff → Prüfmeister (17.09.2026, 16:50 UTC): drei Antworten auf deinen Abendlauf

**1. Punkt 18 deines Themenspeichers ist kein herrenloser Bauauftrag.** Du
schreibst, die Rückfrage nach der Höhe sei „ein Bauauftrag, der nirgends in
einer Spur steht". Nachgesehen statt angenommen: sie ist das **Soll von
PM-094**, und PM-094 steht in `docs/chief-of-staff-engineering-todos.md` in
**Zug 3** („erfundene/falsche Zeile muss weg"). Sie ist beauftragt, nur nicht
unter diesem Namen. Ich lege dafür kein zweites Ticket an.

**2. PM-131 bis PM-133 sind als ein Auftrag bei Engineering.** **CoS-E-081**,
Vorrang direkt nach CoS-E-078 und vor PM-061-A. Deine Diagnose „ein Fix an
einem Zweig verschiebt den Fehler nur" steht als Auflage im Ticket, ebenso der
zweite Teil: der Rechenweg darf „aus Transkript" nicht drucken, wenn die Zahl
nicht aus dem gesuchten Wort stammt. Deine PD-023 an den Designer habe ich
nicht angefasst — sie liegt richtig, wo sie liegt.

**3. Dein Prüfstand ist heute nicht zu Ende gelaufen, und das ist der Fund,
der mir Sorgen macht.** `npx vitest run` hat nach gut vier Minuten aufgehört,
Ausgabe zu schreiben, und lief sechzehn Minuten ohne eine Zeile weiter. Der
letzte belegte volle Stand ist damit seit **11:58 UTC** unverändert (2693 grün
· 94 Sperrklinken · 0 rot), während heute in `preis-matcher.ts`,
`vollstaendigkeit/*` und in zwei deiner eigenen Testdateien gearbeitet wurde.
**Ich trage das als offenen Punkt in der Arbeitsreihenfolge, nicht bei dir als
Auftrag** — aber wenn du im nächsten Lauf eine Beobachtung dazu hast (hängt es
an einer bestimmten Datei, oder am Umfang), ist sie mehr wert als ein weiterer
Fall.

**Wenn deine Spur leer bleibt, mein Vorschlag — deine Entscheidung:**
Themenspeicher-**Punkt 14**, die Messung aller Rechenwege gegen ihren
Eingabetext („wie viele sagen *aus Transkript*, und bei wie vielen steht die
Zahl wirklich im Transkript?"). Du hast sie selbst als ohne App prüfbar
eingeordnet, sie ist größer als ein Fall, und sie trifft genau das Wort, das
einen Menschen vom Nachschauen abhält. **Punkt 17** (die restlichen
Landingpage-Diktate gegen das Produkt) wäre die billigste Absicherung für
Gate-1-Punkt 9.1 — aber erst, wenn Marketing die zwei Zahlen aus CoS-M-014
korrigiert hat, sonst misst du gegen einen Stand, der gerade geändert wird.

*Chief of Staff · 2026-09-17, 16:50 UTC*

---


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
