# Chief of Staff ↔ Head of Product Engineering — Koordinations-Todos

**Neu angelegt: 10.09.2026, auf Sandys direkten Auftrag** („das soll sofort
von wem auch immer gefixt werden" — zu CoS-013, dem wiederholten
Speicherfehler in `chief-of-staff-todos.md`). Grund für diese Datei: die
beiden am häufigsten und am dichtesten aufeinanderfolgend schreibenden
Parteien — Chief of Staff und Head of Product Engineering — teilten sich
bisher eine einzige Datei (`chief-of-staff-todos.md`). Alle acht bisherigen
Vorfälle des Speicherfehlers sind in genau dieser Kollision entstanden. Die
anderen Fachrollen haben längst eigene Dateien (`chief-of-staff-platform-
todos.md`, `chief-of-staff-marketing-todos.md`, `chief-of-staff-legal-
todos.md`, `chief-of-staff-finance-todos.md`) — diese Datei hier schließt
exakt diese Lücke für Product Engineering.

**Ablauf ab sofort:**
- Neue Themen von CoS an Engineering: hier eintragen, nicht mehr in
  `chief-of-staff-todos.md`.
- Engineerings Antworten/Fix-Updates: ebenfalls hier, direkt unter dem
  jeweiligen Punkt.
- `chief-of-staff-todos.md` bleibt bestehen als **Archiv** der bisherigen
  ~250 Punkte (CoS-001 bis CoS-XXX, IDs bleiben stabil, nichts wird
  umnummeriert) — wird aber ab sofort nicht mehr aktiv von zwei Seiten
  gleichzeitig beschrieben. Bestehende offene Punkte dort (z. B. CoS-013
  selbst) werden hier weitergeführt, sobald die Gegenseite antwortet, mit
  Verweis auf die ursprüngliche ID.
- Jeder neue Punkt hier bekommt eine eigene ID (**CoS-E-XXX**), analog zu
  CoS-P-XXX bei Platform.

**Warum das den Speicherfehler wirklich behebt (nicht nur behandelt):** Der
Fehler entsteht, wenn zwei Prozesse zeitlich nah hintereinander in dieselbe
Datei schreiben, ohne dass ein Commit oder eine andere Synchronisation
dazwischenliegt. Diese Datei hier hat ab jetzt nur noch zwei Schreibende
(CoS und Engineering) statt vieler — reduziert die Kollisionsfläche aber
nicht auf null. Die einzige Konstellation, die weiterhin kollidieren kann,
ist CoS und Engineering selbst, wenn beide gleichzeitig in dieser Datei
schreiben. Deshalb zusätzlich: **möglichst ans Dateiende anhängen, nicht in
bestehende Abschnitte hineinschreiben** (Konvention aus CoS-013
übernommen), und bei Zweifel kurz nachfragen, bevor zwei Antworten
gleichzeitig entstehen.

**Datei-Sicherheit:** Ganz am Ende dieser Datei steht eine feste
Markierung (`<!-- ENDE DER DATEI -->`). Taucht beim Lesen noch Text NACH
dieser Markierung auf, ist das zweifelsfrei ein Speicherfehler — bitte
nicht selbst löschen, sondern dem Chief of Staff melden.

**Status-Zeichen:** ✅ erledigt & geprüft · 🟡 erledigt, noch nicht
nachgeprüft · ❌ offen · ⏳ wartet auf Vorbedingung.

---

## Übersicht

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-E-001 | Fortführung von CoS-013 (`chief-of-staff-todos.md`) — diese Datei selbst als struktureller Teil der Lösung | 🟡 umgesetzt (diese Datei existiert jetzt), Rest der Lösung (Git-Workflow für die verbleibende Kollisionsfläche CoS↔Engineering) bleibt offen | Sandys Auftrag „sofort fixen", 10.09.2026 | ❌ offen |

---

## CoS-E-001 — Diese Datei als struktureller Fix für CoS-013

**Datum:** 2026-09-10
**Auftrag:** Sandy, direkt — „das soll sofort von wem auch immer gefixt
werden", als Antwort auf den 8. Vorfall des Speicherfehlers.

**Was ich (Chief of Staff) umgesetzt habe:** Diese Datei angelegt, um die
Haupt-Kollisionsquelle (CoS ↔ Engineering in derselben Datei) zu
beseitigen — nach demselben Muster, das für Platform, Marketing, Legal und
Finance bereits funktioniert (dort ist der Speicherfehler nie aufgetreten).
`chief-of-staff-todos.md` bleibt als Archiv stehen, wird aber ab sofort
nicht mehr aktiv beschrieben.

**Was noch offen bleibt, ehrlich:** Diese Datei selbst könnte theoretisch
denselben Fehler bekommen, wenn CoS und Engineering exakt gleichzeitig
hineinschreiben — das strukturelle Risiko ist kleiner (nur noch zwei
Parteien statt vieler), aber nicht null. Die vollständige Lösung
(Git-Commits statt Direkt-Überschreiben für `docs/`-Änderungen) bräuchte
weiterhin, dass alle schreibenden Parteien denselben Workflow nutzen —
das kann ich nicht einseitig erzwingen. Kurzfristig reduziert diese Datei
das Risiko spürbar; sie behebt es nicht zu 100 %.

**Für Head of Product Engineering:** Bitte ab sofort neue Einträge hier
statt in `chief-of-staff-todos.md`. Offene Punkte von dort, die noch eine
Antwort von dir brauchen, verweise ich hier mit ihrer ursprünglichen ID,
sobald sie anstehen.

*Chief of Staff · 2026-09-10*

---

## Manfred-Feedback — Batch 1 (11.09.2026)

**Quelle:** `docs/testnutzer-notizen-manfred.md` — erster echter Testlauf
durch den simulierten Testnutzer (siehe `docs/team-organigramm.md`, Rolle
noch nachzutragen). Sandys Anweisung: alles außer der fachlichen
Extraktions-Korrektheit („Diktat → Positionen", die geht an den
Prüfmeister) an die jeweils zuständige Stelle verteilen, wirklich jeden
Punkt, nach Priorität sortiert. Wichtig: **nichts davon wurde real
versendet** — Manfred hat ausschließlich im Testkonto gearbeitet und
Status von Hand verändert, um Abläufe zu prüfen. Die Prioritäten unten
sind Produktrisiko-Einschätzungen, keine „ist schon passiert"-Meldungen.

Format: ID · TN-Referenz · Kurzbeschreibung · Priorität (hoch/mittel/
niedrig). Positiv-Meldungen sind ebenfalls aufgenommen, damit nichts beim
nächsten Umbau kaputtgeht.

| ID | TN-Ref | Thema | Prio | Status Engineering |
|---|---|---|---|---|
| CoS-E-002 | TN-005 | Mikro-Tippfehler navigierte in die Vorschau eines alten Angebots mit aktivem „Senden"-Knopf daneben | hoch | ❌ offen |
| CoS-E-003 | TN-006 | (positiv) Schalter „Rechenweg auf PDF zeigen?" kommt gut an | niedrig | ❌ offen |
| CoS-E-004 | TN-008 | 0,00-€-Position erscheint auf dem Kunden-PDF (Erschwerniszuschlag) | hoch | ❌ offen |
| CoS-E-005 | TN-009 | Internes Wort „Transkript" steht auf einer Position im Kunden-PDF | hoch | 🟡 erledigt — Annahmen raus, Live-Nachtest offen |
| CoS-E-006 | TN-011 | Rechnungssprache „Zahlungsziel: 14 Tage" auf einem ANGEBOT statt Gültigkeitsdauer | hoch | 🟡 erledigt — Zahlungsbedingungen statt Zahlungsziel |
| CoS-E-007 | TN-013 | **Zu klären, bitte zuerst:** Steht „Sofortangebot haftet nicht für fehlerhafte Berechnungen" nur in Manfreds eigener Vorschau oder auch auf dem Kunden-PDF? Bei „auch auf dem Kunden-PDF" sofort an Head of Legal weiterreichen | hoch | ✅ geklärt — nur Vorschau, NICHT auf dem Kunden-PDF |
| CoS-E-008 | TN-015 | Reiter „Angebot/Rechnung" unklar, Sorge um doppelte Rechnungsnummernkreise (siehe auch CoS-E-033/TN-086) | mittel | ✅ erledigt — Reiter entfernt (Sandy: „Rechnung erstmal raus") |
| CoS-E-009 | TN-016 | Interne Notiz „bitte prüfen" landet auf dem Kunden-PDF | hoch | 🟡 erledigt — gleiche Ursache wie CoS-E-005 |
| CoS-E-010 | TN-017 | Widerspruch auf dem PDF: „Fenster 0 m²" direkt neben „3 Öffnungen nicht abgezogen (4,29 m²)" | hoch | 🟡 erledigt — keine 0-Abzüge im Rechenweg mehr |
| CoS-E-011 | TN-018 | Tippfehler im Positionstitel landet unverändert auf dem PDF (gleiche Ursache wie CoS-E-020/TN-051) | mittel | ❌ offen |
| CoS-E-012 | TN-019 | PDF ohne zugewiesenen Kunden ist trotzdem sendbar, Feld bleibt leer | hoch | ❌ offen |
| CoS-E-013 | TN-020 | Gültigkeitsdauer aus den Einstellungen (30 Tage) erscheint auf dem PDF nirgends (gleiche Familie wie TN-081/TN-100, siehe CoS-E-031/CoS-E-042) | hoch | 🟡 erledigt — „Gültig bis" wird gerechnet |
| CoS-E-014 | TN-021 | Ladeanimation „Aufmaß wird angelegt…" startet, bevor überhaupt gesprochen wurde | niedrig | ❌ offen |
| CoS-E-015 | TN-026 | „Satz aus Preisliste" bei Zuschlägen zeigt keine Zahl, anders als alle übrigen Positionen | mittel | ❌ offen |
| CoS-E-016 | TN-027/TN-028 | Abgebrochene „Neues Angebot"-Versuche hinterlassen leere Dauer-Entwürfe „Kunde offen" — zu klären, ob die gegen das Monats-Kontingent im Starter-Plan zählen | hoch | ❌ offen |
| CoS-E-017 | TN-030 | Getippte (nicht gesprochene) Notizen werden gar nicht verarbeitet — keine Meldung, einfach nichts | hoch | ❌ offen |
| CoS-E-018 | TN-044/TN-129 | Kunde wird trotz genannten Namens nicht verknüpft, „Kein Kunde zugewiesen" — in beiden Testszenarien identisch reproduziert, spricht für einen systematischen Bug | hoch | 🟡 erledigt — Migration liegt jetzt auf Staging + Produktion, Live-Nachtest offen |
| CoS-E-019 | TN-045 | Gesprochener Ausführungstermin („in 3 Wochen fertig") wird nirgends gespeichert, kein Feld dafür vorgesehen | mittel | ❌ offen — braucht Prompt-Änderung + Edge-Deploy, siehe Batch 2 |
| CoS-E-020 | TN-051 | Leerzeichen verschwinden beim Umbenennen bestehender Positionen, 3× reproduziert, tritt nur im Bearbeiten-Pfad auf (nicht bei neuen Positionen) | hoch | ❌ offen |
| CoS-E-021 | TN-052 | Wechsel 1×→2× verlangt manuelles Ändern von Titel, Untertitel UND Preis statt eines Umschalters, obwohl die App den Preis kennt | mittel | ❌ offen |
| CoS-E-022 | TN-053 | Neue Positionen landen immer unter „Allgemein", auch wenn sie eindeutig zu einem Raum gehören | mittel | ❌ offen |
| CoS-E-023 | TN-054 | „Senden" ist aktiv, obwohl kein Kunde zugewiesen ist | hoch | ❌ offen |
| CoS-E-024 | TN-060 | Vorgeschlagene Einheit bei „Preis anlegen" war falsch (m² statt Stück bei „Heizkörper abkleben – 1 Stück") | mittel | ❌ offen |
| CoS-E-025 | TN-063 | Drei verschiedene Angebotsnummer-Formate gleichzeitig sichtbar in der App | mittel | ❌ offen |
| CoS-E-026 | TN-064 | Deckenpositionen landen unter „Allgemein" statt beim zugehörigen Raum (siehe auch DC-091/TN-104) | mittel | ❌ offen |
| CoS-E-027 | TN-066 | Nach „Abbrechen" im Bearbeiten-Modus springt der Status zurück auf grauen Punkt statt „Bereit" | mittel | ❌ offen |
| CoS-E-028 | TN-068/TN-069 | „+ Kunde" im Angebot bietet nur Suche, kein „Neu anlegen" — Umweg über anderes Menü nötig, betrifft laut Manfred rund 80 % seiner Angebote (Erstkunden) | hoch | 🟡 erledigt — „Neu anlegen" direkt im Angebot |
| CoS-E-029 | TN-071 | Erster Tipp auf „Kunde anlegen" reagiert nicht | mittel | ❌ offen |
| CoS-E-030 | TN-078 | WhatsApp-Versand zeigt „PDF wird vorbereitet…" ohne erkennbaren Abschluss nach 2 Sekunden | mittel | ❌ offen |
| CoS-E-031 | TN-081 | „Gültig bis" bleibt leer trotz 30-Tage-Standard in den Einstellungen (gleiche Familie wie CoS-E-013/CoS-E-042) | hoch | 🟡 erledigt — gleiche Ursache wie CoS-E-013 |
| CoS-E-032 | TN-083 | Feld „Interne Notiz" bleibt leer, obwohl genau dort ein gesprochener Termin hingehört hätte (siehe TN-045/CoS-E-019) | niedrig | ❌ offen |
| CoS-E-033 | TN-086 | Rechnungsnummer = Angebotsnummer, obwohl die Einstellungen getrennte Nummernkreise vorsehen | hoch | ✅ erledigt — mit dem Reiter weg; echter Nummernkreis erst mit echter Rechnung |
| CoS-E-034 | TN-088 | Interne Prüfhinweise und „bitte Angebot prüfen"-Fußzeile erscheinen auch auf der Rechnung, nicht nur auf dem Angebot | hoch | 🟡 teilweise — interne Hinweise raus, Rest an der Rechnungs-Entscheidung |
| CoS-E-035 | TN-090 | Ein Testangebot mit 0,00-€-Position wurde als „beauftragt/angenommen" markiert, ohne dass die fehlende Bepreisung vorher auffiel | hoch | ❌ offen |
| CoS-E-036 | TN-091 | Kein auffindbarer Weg, aus einem beauftragten Angebot eine Rechnung zu erzeugen | hoch | ✅ erledigt — hinfällig, es gibt keine Rechnung mehr zu erzeugen |
| CoS-E-037 | TN-092 | Preis-Matching findet einen vorhandenen Datenbankeintrag nicht, weil intern ein anderer Begriff verwendet wird als in der Preisdatenbank | hoch | ❌ offen |
| CoS-E-038 | TN-093/TN-094 | Angebotspreise weichen von der Preisdatenbank ab, uneinheitlich zwischen zwei Angeboten desselben Betriebs für dieselbe Position | hoch | ❌ offen |
| CoS-E-039 | TN-095 | Preisdatenbank hat viele Dopplungen mit identischen Preisen unter leicht anderem Namen | mittel | ❌ offen |
| CoS-E-040 | TN-097 | Erschwerniszuschläge „Altbau"/„bewohnt" lassen sich in den Einstellungen nirgends abschalten | mittel | ❌ offen |
| CoS-E-041 | TN-098 | Kleinmaterial-Pauschale „automatisch ab 200 €" griff bei einem 1.700-€-Angebot nicht | hoch | ❌ offen |
| CoS-E-042 | TN-100 | „Zahlungsziel" und „Gültigkeitsdauer" sind zwischen Einstellungen und PDF vertauscht (gleiche Familie wie CoS-E-013/CoS-E-031) | hoch | 🟡 erledigt — gleiche Ursache wie CoS-E-013 |
| CoS-E-043 | TN-105 | Regionaler Preisfaktor kennt Bochum/Ruhrgebiet nicht als Kategorie; zusätzlich Produktfrage, ob ein pauschaler Faktor über der eigenen Preisliste überhaupt sinnvoll ist (möglicher Zusammenhang mit CoS-E-038) | mittel | ❌ offen |
| CoS-E-044 | TN-115 | Kein sichtbarer Status, ob/wann/was beim „Angebots-Nachfassen" passiert | mittel | ❌ offen |
| CoS-E-045 | TN-116 | Zwei Reiter zeigen unterschiedliche Flächenwerte für denselben Raum (einer leer, obwohl 53,2 m² längst berechnet) | hoch | ❌ offen |
| CoS-E-046 | TN-117 | „Unregelmäßig" öffnet den Grundriss-Editor mit Standardmaßen 4×3 statt den bereits erfassten Raummaßen | mittel | ❌ offen |
| CoS-E-047 | TN-119 | Grundriss-Editor akzeptiert keine halben Meter (weder Komma noch Punkt) — macht das laut Manfred beste Feature der App (TN-118) für echte Räume unbrauchbar | hoch | ❌ offen |

**Nicht als Ticket, aber wichtig für dich (Sandy) direkt:** TN-067 — Manfreds
ehrliches Fazit nach dem Bearbeiten-Test: „Beim dritten Angebot trau ich
dem ersten Wurf nicht mehr und lese jede Zeile — dann ist der Zeitgewinn
weg." Kein Einzelbug, sondern ein Vertrauens-/Produktrisiko-Signal, das
sich erst auflöst, wenn die Extraktions-Bugs (Prüfmeister-Seite) und die
Bugs oben zusammen spürbar weniger werden.

*Chief of Staff · 2026-09-11*

---

## Antwort Head of Product Engineering — Batch 1 (11.09.2026)

**Vorgehen:** Nicht CoS-E-002 bis CoS-E-047 der Reihe nach, sondern nach
Ursachen sortiert. Mehrere Tickets sind derselbe Fehler an derselben Stelle —
einzeln abgearbeitet hätte ich dieselbe Zeile viermal angefasst. Batch 1 ist
alles, was auf dem Papier steht, das der **Kunde** bekommt.

Stand: umgesetzt, Typecheck sauber, komplette Testsuite (105 Dateien) grün,
Lint ohne neue Fehler. Live-Nachtest steht aus.

---

### CoS-E-007 / TN-013 — GEKLÄRT, kein Fall für Legal ✅

Der Satz „Bitte Angebot vor dem Versand prüfen. Sofortangebot haftet nicht
für fehlerhafte Berechnungen" steht **ausschließlich in Manfreds eigener
Vorschau**, nicht auf dem Kunden-PDF.

Nachgeprüft: Der Satz sitzt in `src/components/AngebotVorschau.tsx` und dort
*außerhalb* des Dokument-Rahmens — er hängt unter der Vorschau-Karte, nicht
auf dem Blatt. Das echte PDF entsteht in einer anderen Datei
(`src/lib/pdf.tsx`) und kennt den Satz überhaupt nicht. Ein Test hält das
jetzt fest.

Damit entfällt die Weitergabe an Head of Legal.

---

### CoS-E-005 + CoS-E-009 + Teil von CoS-E-034 — eine Ursache ✅

TN-009 („Transkript"), TN-016 („bitte prüfen"), TN-088 (dasselbe auf der
Rechnung) sind **ein** Fehler, nicht drei.

**Ursache:** Jede Position trägt intern ein Feld `annahmen` — das ist die
Notiz an den *Handwerker* („Zweifacher Anstrich als Standard angenommen —
bitte prüfen", „Leitungsmeter nicht angegeben — bitte Menge manuell
anpassen", „… im Transkript erkannt"). Als am 10.09. der Rechenweg aufs
Kunden-PDF kam (DC-049/DC-050), rutschte dieses Feld direkt mit drauf. Der
Kunde las also Arbeitsanweisungen an den Betrieb.

**Fix:** `annahmen` erreicht das Kundendokument nicht mehr — weder im PDF noch
in der Vorschau. Bewusst nicht „den Block gelöscht", sondern die Trennung
hart gezogen: das interne Array wird gar nicht erst bis zur Anzeige
durchgereicht. Wer künftig einen Satz daraus aufs Kundenpapier bringen will,
muss ihn ausdrücklich einzeln herausziehen.

**Was bewusst bleibt:** Der Rechenweg selbst (die reine Rechnung). Der ist
laut CI-Handbuch das Beweisstück für den Kunden, und Manfred hat ihn in
TN-006 ausdrücklich gelobt.

**Nebenbefund, mitgefixt:** Der Übermessungs-Hinweis (VOB-004/Legal G5 — „3
Öffnungen bis 2,5 m² nicht abgezogen") stand im PDF, in der Vorschau aber
noch nie. Die Vorschau zeigte also weniger als das Blatt, das rausgeht.
Jetzt zeigen beide dasselbe, aus derselben Quelle.

---

### CoS-E-010 / TN-017 — „Fenster 0 m²" neben „nicht abgezogen" ✅

Beide Zahlen waren richtig. Die Null war die ehrliche Folge der
VOB-Übermessung: es *wurde* nichts abgezogen. Nur liest sich ein Abzug von
null wie ein übersehener Posten — Manfred: „Kunde sieht ‚Fenster 0' und
denkt, ich hab nicht hingeguckt."

**Fix:** Der Rechenweg nennt nur noch Abzüge, die es wirklich gibt. Kein
Abzug → der Rechenweg endet nach der Bruttofläche, und warum nichts
abgezogen wurde, steht weiterhin im Hinweis darunter (der ist für den Kunden
geschrieben). Eine gemeinsame Stelle für alle vier Fundorte statt vier
gleichlautender Textbauten.

---

### CoS-E-006 + CoS-E-013 + CoS-E-031 + CoS-E-042 — eine Ursachenfamilie ✅

Vier Tickets, ein Befund. Die Einstellung „Angebot gültig für 30 Tage" wurde
im Code zwar sauber aufgelöst — und dann **von niemandem benutzt**. Das
Dokument las ausschließlich das Feld `valid_until` am Angebot, und der Weg,
auf dem Angebote heute wirklich entstehen (der Aufnahme-Flow), setzt dieses
Feld überhaupt nicht. Ergebnis: keine Gültigkeitsdauer auf dem Papier, dafür
prominent im Kopf „Zahlungsziel: 14 Tage". Genau die Verwechslung, die
Manfred in TN-100 beschrieben hat.

**Fix:**
1. „Gültig bis" wird **gerechnet statt gelesen**: Dokumentdatum + eingestellte
   Tage. Bewusst gerechnet und nicht gespeichert — so erreicht es auch die
   rund 100 Angebote, die schon in der Datenbank liegen, und ein Entwurf, der
   drei Wochen liegen bleibt, bringt keine halb abgelaufene Frist mit.
   Ein von Hand gesetztes Datum (Zahnrad) schlägt die Rechnung weiterhin.
2. „Zahlungsziel" verschwindet aus dem Kopfblock des Angebots. Dort steht
   jetzt die Frist, die es auf einem Angebot wirklich gibt.
3. Die Zahlungsbedingungen bleiben im Text, aber als Bedingung formuliert:
   **„Zahlungsbedingungen: 14 Tage nach Rechnungserhalt ohne Abzug."**
   Auf einem Angebot gibt es noch keine Rechnung, ab der eine Frist laufen
   könnte. Auf der Rechnung bleibt die alte Formulierung.
4. Die alte Anlege-Route hatte 30 Tage fest verdrahtet — wer in den
   Einstellungen 14 eintrug, bekam trotzdem 30. Jetzt dieselbe Einstellung
   wie überall.

**Für Sandy, eine Frage:** Punkt 3 ist eine Formulierung auf deinem
Kundendokument. Ich hab die aus meiner Sicht fachlich richtige gewählt.
Sag Bescheid, wenn du sie anders willst — das ist ein Einzeiler.

---

### Was Batch 1 NICHT abdeckt — zwei Befunde, die eine Entscheidung brauchen

**1. CoS-E-018 / TN-044 / TN-129 — der gesprochene Kundenname (hoch).**
Ursache gefunden und sie ist eindeutig: Der Name **wird** aus dem Diktat
erkannt und sauber ausgelesen (Feld `kunde` mit Name, Adresse, Ort) — und
dann liest ihn **niemand mehr**. Er endet in einer Sackgasse. Deshalb hat
sich das bei Manfred zweimal identisch reproduziert; es ist kein
Erkennungsproblem, sondern eine nicht angeschlossene Leitung.

Dasselbe gilt für CoS-E-019 / TN-045 (Ausführungstermin): Da ist es noch
eine Stufe früher — nach einem Termin wird gar nicht erst gefragt, es gibt
kein Feld dafür.

Das hängt direkt an CoS-E-028 (TN-068: „+ Kunde" bietet nur Suche, kein
„Neu anlegen" — laut Manfred 80 % seiner Angebote sind Erstkunden). Beides
zusammen ist EIN Stück Arbeit: der gesprochene Name kommt am Kundenfeld an,
als Vorschlag mit einem Tipp zum Bestätigen.

Meine Empfehlung, passend zur Produktphilosophie: **vorschlagen, nicht
anlegen.** Ein verhörter Name („Krüger"/„Grüger") darf nicht still einen
Kundendatensatz erzeugen. Steht als Batch 2 an.

**2. CoS-E-008 + CoS-E-033 + CoS-E-036 (+ TN-087/TN-089) — „Rechnung" ist
heute kein Dokument.** Der Reiter „Angebot/Rechnung" in der Vorschau ist
reine Anzeige: er tauscht zwei Wörter aus und zeigt dasselbe Blatt. Es wird
keine Rechnungsnummer gezogen (obwohl der getrennte Nummernkreis in den
Einstellungen existiert und die Datenbank ihn könnte), nichts gespeichert,
und es gibt folgerichtig auch keinen Weg vom beauftragten Angebot zur
Rechnung. Deshalb steht auf der „Rechnung" auch die Unterschriftszeile und
der Angebots-Schlusstext.

Das ist keine Bugliste, das ist eine **Produktentscheidung** — und sie hat
eine Größe, die ich nicht einseitig treffen will. Manfred sagt selbst: „Wär
gut, aber ich hab lexoffice. Zwei Rechnungsnummernkreise darf's nicht
geben." Drei mögliche Wege, kurz:

- **A — Reiter raus.** Sofortangebot macht Angebote, Rechnungen macht die
  Buchhaltung. Kleinster Eingriff, löst CoS-E-008/033/036 ehrlich auf,
  nimmt aber ein Versprechen weg, das die App gerade macht.
- **B — Rechnung richtig bauen.** Eigener Nummernkreis, eigenes Layout,
  Leistungsdatum, Steuernummer, Knopf „Rechnung erstellen". Das ist ein
  eigenes Vorhaben, kein Fix — und ein gutes Stück davon (Buchhaltung,
  Nummernkreise) liegt ohnehin bei Platform & Integrations, nicht bei mir.
- **C — dazwischen:** Reiter bleibt, wird aber als das beschriftet, was er
  ist (eine Vorschau „so sähe die Rechnung aus"), plus Export in die
  Buchhaltung. Löst Manfreds Sorge um doppelte Nummernkreise, ohne ein
  Rechnungsmodul zu bauen.

Ich mach hier nichts, bis du entschieden hast.

*Head of Product Engineering · 2026-09-11*

---

## Antwort Head of Product Engineering — Batch 2 (11.09.2026)

**Thema:** Der Kunde aus dem Diktat. CoS-E-018 (TN-044/TN-129) und
CoS-E-028 (TN-068/TN-069) gehören zusammen — beide enden am selben Feld.

Stand: umgesetzt, Typecheck sauber, Testsuite (105 Dateien) grün, Lint ohne
neue Fehler. **Eine Migration ist noch nicht auf der Datenbank** — siehe
unten, das ist der einzige offene Handgriff.

---

### CoS-E-018 / TN-044 / TN-129 — der gesprochene Kundenname ✅

**Ursache, eindeutig:** Kein Erkennungsproblem. Der Name **wird** sauber
ausgelesen — GPT wird ausdrücklich danach gefragt, die Antwort wird
normalisiert und landet als Feld `kunde` (Name, Adresse, Ort) im Ergebnis.
Danach liest ihn **niemand mehr**. Er endete in einer Sackgasse. Deshalb hat
es sich bei Manfred zweimal identisch reproduziert: es ist kein
Wahrscheinlichkeitsproblem, sondern eine nicht angeschlossene Leitung.

**Fix:** Der gehörte Name wird jetzt ans Angebot geheftet — als **Vorschlag**.
In der Kundenkarte steht er unter „Aus der Aufnahme gehört" mit zwei Knöpfen:
*Übernehmen* und *Anderer Kunde*.

**Warum nicht einfach automatisch zuweisen** — das ist die eigentliche
Entscheidung hier: Ein verhörter Name („Krüger"/„Grüger") würde still einen
echten Kundendatensatz anlegen, den danach niemand mehr findet oder
aufräumt. Und weil bei Manfred rund 80 % der Angebote Erstkunden sind,
passiert genau das nicht selten, sondern fast immer. Sofortangebot ist ein
Entwurfsgenerator mit Prüfpflicht — der Name ist ein Vorschlag, den der
Handwerker mit einem Tipp bestätigt. Erst dann entsteht ein Kunde.

Zwei Regeln, die das absichern und die per Test festgehalten sind:
- Der Vorschlag wird nur geschrieben, solange das Angebot **keinen** Kunden
  hat. Hat der Handwerker schon zugewiesen, spielt ihm kein späterer Lauf
  einen alten Vorschlag zurück.
- Leerzeichen oder nichts Gehörtes erzeugen keinen Vorschlag.

---

### CoS-E-028 / TN-068 — „Neu anlegen" fehlt im Angebot ✅

Manfreds Beobachtung stimmt exakt: „+ Kunde" öffnete nur eine Suche. Wer
nicht gefunden wurde, war von hier aus nicht anzulegen — Umweg über das
Kunden-Menü und zurück. Bei 80 % Erstkunden ist das der Normalfall, nicht
die Ausnahme.

**Fix:** In der Suche steht jetzt — **unter** den Treffern, damit niemand
einen vorhandenen Kunden doppelt anlegt — ein Knopf
„+ „Krüger" als neuen Kunden anlegen". Danach läuft exakt derselbe Weg wie
bei jeder anderen Zuweisung, inklusive automatischer Erstbaustelle
(CoS-012/DC-029). Kein zweiter Pfad, der auseinanderlaufen könnte.

Bewusst nur der Name, kein Formular: Adresse, Telefon und Mail stehen beim
Anruf oft noch gar nicht fest, und ein Pflichtformular an dieser Stelle wäre
wieder ein Umweg. Der Kunde existiert danach und lässt sich in Ruhe
vervollständigen (TN-070 lobt das Kundenformular ausdrücklich) — wichtig ist
der Weg **zurück ins Angebot**.

Zusammen greifen die beiden: „Übernehmen" öffnet die Suche mit dem gehörten
Namen. Gibt es den Kunden schon (Manfreds TN-069: „Lina" → Lina Meier),
steht er als Treffer da. Gibt es ihn nicht (Krüger, Yilmaz), steht der
Anlegen-Knopf darunter. Ein Tipp hin, ein Tipp fertig.

---

### ⚠️ Offener Handgriff: eine Migration muss noch auf die Datenbank

`supabase/migrations/20260911160000_erkannter_kundenname.sql` — eine neue,
leere Spalte `quotes.erkannter_kundenname` (TEXT, nullable, **kein**
Backfill, additiv). Solange sie fehlt, ist das Verhalten exakt wie vorher:
Die Route merkt, dass die Spalte nicht da ist, lässt das Feld weg und
speichert den Rest normal — **nichts geht kaputt**, der Vorschlag erscheint
nur noch nicht. Dieselbe Vorsicht wie bei `baustelle_id`/`share_token`.

Warum eine eigene Spalte und nicht eines der vorhandenen JSON-Felder —
geprüft und verworfen, steht ausführlich in der Migration:
`extraktion_final` enthält den Namen zwar, ist aber ausdrücklich ein
**Logging**-Feld; wer die Logs eines Tages ausdünnt, bräche still die
Kundenzuweisung. Die beiden Extraktions-Caches dürfen per Entwurf lückenhaft
sein.

Das Anwenden auf Staging/Produktion ist ein Deployment-Schritt. **Sandy, sag
mir, ob ich sie anwenden soll** — oder ob das über Platform & Integrations
laufen soll. Ich rühre die Produktionsdatenbank nicht ohne dein Wort an.

---

### CoS-E-019 / TN-045 — Ausführungstermin: eine Stufe früher ❌

Beim Kundennamen war die Leitung nicht angeschlossen. Beim Termin gibt es
die Leitung gar nicht: Nach einem Termin („in drei Wochen fertig") wird GPT
überhaupt nicht gefragt, es existiert kein Feld dafür. Manfred hat das
richtig beobachtet — es wird nicht verschluckt, es wird nie erhoben.

Das zu ändern heißt, den Extraktions-Prompt zu erweitern, und der lebt in
einer Edge Function, die **deployt** werden muss. Das ist ein anderer
Handgriff als ein App-Release und ich lege ihn deshalb nicht einfach dazu.
Steht als eigener Punkt an, gebündelt mit CoS-E-032 (TN-083, interne Notiz
bleibt leer) — beide wollen dasselbe: gesprochene Nebeninformationen sollen
irgendwo landen statt zu verpuffen.

*Head of Product Engineering · 2026-09-11*

---

## Antwort Head of Product Engineering — Rechnung raus + Migration (11.09.2026)

**Sandys Entscheidungen, beide heute:** „rechnung erstmal raus… wird aber
eventuell auch nochmal geändert" und „du darfst migration machen".

---

### CoS-E-008 + CoS-E-033 + CoS-E-036 (+ TN-087/TN-089) — Rechnung raus ✅

Der Umschalter „Angebot/Rechnung" in der Vorschau ist entfernt. Er hat nie
eine Rechnung erzeugt: Er tauschte zwei Überschriften aus und zeigte
dasselbe Blatt — dieselbe Nummer (daher TN-086 „Rechnungsnummer =
Angebotsnummer"), dieselbe Unterschriftszeile (TN-087), denselben
Angebots-Schlusstext, ohne Leistungsdatum und Steuernummer (TN-089). Und
weil es keine Rechnung gab, gab es folgerichtig auch keinen Weg vom
beauftragten Angebot zu einer (TN-091).

**Entfernt statt umbeschriftet.** Ein Reiter, der eine Rechnung verspricht,
kostet genau das Vertrauen, um das es in TN-067 geht („beim dritten Angebot
trau ich dem ersten Wurf nicht mehr"). Und Manfreds Sorge war berechtigt:
„Zwei Rechnungsnummernkreise darf's nicht geben."

**Auch der Modus im Code ist weg**, nicht nur der Knopf. Ein stillgelegter
Pfad, den niemand mehr erreicht, ist in diesem Projekt schon zweimal teuer
geworden (PM-010 toter Code, CoS-020 toter Filter). Sandy sagt, das Thema
kommt eventuell wieder — dann aber als echte Rechnung, nicht als
wiederbelebter Zwei-Wörter-Tausch.

**Was eine echte Rechnung später bräuchte** (damit es nicht neu erhoben
werden muss, wenn das Thema zurückkommt):
1. Eigener Nummernkreis. Die Datenbank kann das längst — die Tabelle und die
   Vergabe-Funktion kennen `typ = 'rechnung'`, und die Einstellungen zeigen
   den Kreis schon an. Es zieht nur niemand daraus: `api/quotes/[id]/nummer`
   fragt fest nach `'angebot'`.
2. Eigenes Layout: **keine** Unterschriftszeile, Rechnungs-Schlusstext statt
   „Wir freuen uns auf Ihre Auftragserteilung", Fälligkeit statt Gültigkeit.
3. **Leistungsdatum und Steuernummer/USt-IdNr.** — Manfred in TN-089: ohne
   die kriegt sein Kunde Ärger beim Finanzamt und ruft ihn an. Das sind
   Pflichtangaben nach § 14 UStG, keine Kür.
4. Ein Zustandsübergang „beauftragt → Rechnung erstellt", damit aus einem
   Angebot genau eine Rechnung wird und nicht bei jedem Klick eine neue.

Punkte 1 und 4 berühren Nummernkreise und Buchhaltung und gehören damit
mindestens zur Hälfte zu Platform & Integrations.

---

### ⚠️ Querfund beim Aufräumen — gehört Platform, nicht mir

Ich habe danach geprüft, ob noch woanders eine „Rechnung" verspricht, was es
nicht gibt. Ein Fund, und er ist ernster als der Reiter:

Der **ZUGFeRD/XRechnung-Export deklariert ein Angebot als Rechnung.**
`src/lib/zugferd/generateXML.ts` setzt fest `TypeCode 380` — das ist in der
Norm die *Handelsrechnung*. Erreichbar über „XRechnung XML" im
Angebots-Menü. Das erzeugte XML behauptet gegenüber dem Empfängersystem, ein
steuerlich wirksames Rechnungsdokument zu sein, mit der Angebotsnummer als
Rechnungsnummer. Bei einem öffentlichen Auftraggeber läuft das in die
Rechnungseingangsprüfung.

**Nicht angefasst.** E-Rechnung/ZUGFeRD/Buchhaltung ist laut Rollen-Split
(CoS-009) Platform & Integrations. Eingetragen als **EX-003** in
`docs/engineering-austausch.md`, mit Einordnung und zwei möglichen Wegen.

Ebenfalls dort vermerkt und bewusst stehen gelassen: Die Einstellungen
zeigen weiterhin einen Nummernkreis „Rechnungen", aus dem niemand zieht.
Inert, aber sichtbar. **Sandy, wenn du willst, dass der auch verschwindet,
sag einmal Bescheid** — ich wollte an den Einstellungen nicht einseitig
herumräumen.

---

### CoS-E-018 — Migration ist angewendet ✅

`quotes.erkannter_kundenname` liegt jetzt auf **Staging und Produktion**
(nachgeprüft: TEXT, nullable). Damit ist der Vorschlag aus Batch 2 scharf:
Der im Diktat genannte Kundenname landet ab dem nächsten Entwurf in der
Kundenkarte, mit einem Tipp zum Übernehmen.

Additiv, kein Backfill — bestehende Angebote bleiben leer und verhalten sich
wie bisher.

*Head of Product Engineering · 2026-09-11*


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
